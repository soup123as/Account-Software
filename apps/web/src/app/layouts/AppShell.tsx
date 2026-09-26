import { NavLink, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { env } from '@/lib/env';
import { cn } from '@/lib/utils';
import { primaryNavigation } from './navigation';

export function AppShell() {
  const { t } = useTranslation();
  return (
    <div className="min-h-dvh md:grid md:grid-cols-[15rem_1fr]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-card focus:px-4 focus:py-2"
      >
        {t('app.skipToContent')}
      </a>

      <aside className="border-b bg-card md:min-h-dvh md:border-b-0 md:border-r">
        <div className="flex h-14 items-center px-4 font-semibold">{env.VITE_APP_NAME}</div>
        <nav aria-label={t('app.primaryNavigation')} className="px-2 pb-2 md:pb-0">
          <ul className="flex gap-1 md:flex-col">
            {primaryNavigation.map(({ to, labelKey, icon: Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted',
                      isActive && 'bg-muted font-medium',
                    )
                  }
                >
                  <Icon aria-hidden="true" className="size-4" />
                  {t(labelKey)}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main id="main-content" tabIndex={-1} className="p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
