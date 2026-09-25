import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useApiHealth } from './api';

export function SystemStatusPage() {
  const { t, i18n } = useTranslation();
  const health = useApiHealth();

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold">{t('systemStatus.title')}</h1>
        <p className="text-muted-foreground">{t('systemStatus.description')}</p>
      </header>

      <Card aria-busy={health.isPending}>
        <CardHeader className="flex-row items-center justify-between">
          <div className="flex flex-col gap-1.5">
            <CardTitle>{t('systemStatus.api')}</CardTitle>
            {health.isError && (
              <CardDescription>{t('systemStatus.unreachableHelp')}</CardDescription>
            )}
          </div>
          <div role="status" aria-live="polite">
            {health.isPending && (
              <Badge>
                <Loader2 aria-hidden="true" className="size-3 animate-spin" />
                {t('systemStatus.checking')}
              </Badge>
            )}
            {health.isSuccess && (
              <Badge variant="success">
                <CheckCircle2 aria-hidden="true" className="size-3" />
                {t('systemStatus.operational')}
              </Badge>
            )}
            {health.isError && (
              <Badge variant="destructive">
                <XCircle aria-hidden="true" className="size-3" />
                {t('systemStatus.unreachable')}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          {health.isSuccess && (
            <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-muted-foreground">{t('systemStatus.version')}</dt>
                <dd className="font-mono">{health.data.version}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">{t('systemStatus.environment')}</dt>
                <dd className="font-mono">{health.data.environment}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">{t('systemStatus.lastChecked')}</dt>
                <dd>
                  <time dateTime={health.data.timestamp}>
                    {new Intl.DateTimeFormat(i18n.language, {
                      dateStyle: 'medium',
                      timeStyle: 'medium',
                    }).format(new Date(health.data.timestamp))}
                  </time>
                </dd>
              </div>
            </dl>
          )}
          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void health.refetch()}
              disabled={health.isFetching}
            >
              {t('systemStatus.retry')}
            </Button>
          </div>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">{t('systemStatus.phaseNotice')}</p>
    </div>
  );
}
