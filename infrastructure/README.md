# Infrastructure

| Path          | Status (Phase 0)                                                            |
| ------------- | --------------------------------------------------------------------------- |
| `docker/`     | Local PostgreSQL 16 + Redis 7 via Docker Compose.                           |
| `scripts/`    | Operational scripts.                                                        |
| `nginx/`      | Reserved — reverse-proxy configuration is added with deployment (Phase 20). |
| `deployment/` | Reserved — hosting manifests are added with deployment (Phase 20).          |

Production uses Supabase PostgreSQL and a managed Redis; containers here are
for local development only.
