-- =============================================================================
-- Phase 0 foundation
--
-- 1. `app` schema holding security helper functions (not managed by Prisma).
-- 2. Tenant-context accessors read by future RLS policies (Phase 2).
-- 3. Reusable append-only guard trigger function.
-- 4. audit_logs table (append-only).
-- 5. RLS enabled on every table (deny-by-default for Supabase API roles).
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Security helper schema
-- ---------------------------------------------------------------------------
CREATE SCHEMA IF NOT EXISTS app;
REVOKE ALL ON SCHEMA app FROM PUBLIC;

-- ---------------------------------------------------------------------------
-- 2. Tenant context accessors
--    Values are set per transaction by @gap/database `withTenantTransaction`
--    using set_config(..., is_local => true). They return NULL when unset, so
--    policies written as `organization_id = app.current_organization_id()`
--    fail closed.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION app.current_user_id()
RETURNS uuid
LANGUAGE sql
STABLE
PARALLEL SAFE
SET search_path = pg_catalog
AS $$
  SELECT NULLIF(current_setting('app.current_user_id', true), '')::uuid
$$;

CREATE OR REPLACE FUNCTION app.current_organization_id()
RETURNS uuid
LANGUAGE sql
STABLE
PARALLEL SAFE
SET search_path = pg_catalog
AS $$
  SELECT NULLIF(current_setting('app.current_organization_id', true), '')::uuid
$$;

-- ---------------------------------------------------------------------------
-- 3. Append-only guard. Attach with:
--      CREATE TRIGGER ... BEFORE UPDATE OR DELETE ON <table>
--        FOR EACH ROW EXECUTE FUNCTION app.reject_mutation();
--      CREATE TRIGGER ... BEFORE TRUNCATE ON <table>
--        FOR EACH STATEMENT EXECUTE FUNCTION app.reject_mutation();
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION app.reject_mutation()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = pg_catalog
AS $$
BEGIN
  RAISE EXCEPTION '% on %.% is not permitted: records are append-only',
    TG_OP, TG_TABLE_SCHEMA, TG_TABLE_NAME
    USING ERRCODE = 'integrity_constraint_violation';
END;
$$;

-- ---------------------------------------------------------------------------
-- 4. audit_logs (generated from schema.prisma)
-- ---------------------------------------------------------------------------
-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "organization_id" UUID,
    "user_id" UUID,
    "action" VARCHAR(64) NOT NULL,
    "module" VARCHAR(64) NOT NULL,
    "record_id" VARCHAR(128),
    "old_values" JSONB,
    "new_values" JSONB,
    "ip_address" INET,
    "user_agent" VARCHAR(512),
    "request_id" VARCHAR(128),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "audit_logs_organization_id_created_at_idx" ON "audit_logs"("organization_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "audit_logs_user_id_created_at_idx" ON "audit_logs"("user_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "audit_logs_module_record_id_idx" ON "audit_logs"("module", "record_id");

CREATE TRIGGER audit_logs_reject_update_delete
  BEFORE UPDATE OR DELETE ON "audit_logs"
  FOR EACH ROW EXECUTE FUNCTION app.reject_mutation();

CREATE TRIGGER audit_logs_reject_truncate
  BEFORE TRUNCATE ON "audit_logs"
  FOR EACH STATEMENT EXECUTE FUNCTION app.reject_mutation();

-- ---------------------------------------------------------------------------
-- 5. Row Level Security
--    Enabling RLS without policies denies all access to non-owner roles.
--    Tenant policies are added in Phase 2. The Prisma migration history table
--    is also locked down so it is never exposed through the Supabase Data API.
-- ---------------------------------------------------------------------------
ALTER TABLE "audit_logs" ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE
  api_role text;
  has_migrations_table boolean := to_regclass('public._prisma_migrations') IS NOT NULL;
BEGIN
  -- The history table does not exist when Prisma replays migrations into a
  -- shadow database, so it is guarded rather than altered unconditionally.
  IF has_migrations_table THEN
    ALTER TABLE public._prisma_migrations ENABLE ROW LEVEL SECURITY;
  END IF;

  FOREACH api_role IN ARRAY ARRAY['anon', 'authenticated'] LOOP
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = api_role) THEN
      EXECUTE format('REVOKE ALL ON TABLE public.audit_logs FROM %I', api_role);
      IF has_migrations_table THEN
        EXECUTE format('REVOKE ALL ON TABLE public._prisma_migrations FROM %I', api_role);
      END IF;
    END IF;
  END LOOP;
END;
$$;
