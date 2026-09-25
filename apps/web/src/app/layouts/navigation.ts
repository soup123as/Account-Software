import { Activity, type LucideIcon } from 'lucide-react';
import type { ParseKeys } from 'i18next';

export interface NavItem {
  readonly to: string;
  readonly labelKey: ParseKeys;
  readonly icon: LucideIcon;
  /**
   * Permission required to see the item (Phase 3). Navigation visibility is a
   * convenience only; the API enforces every permission server-side.
   */
  readonly permission?: string;
}

/** Only implemented routes appear here. Each phase adds its own entries. */
export const primaryNavigation: readonly NavItem[] = [
  { to: '/', labelKey: 'nav.systemStatus', icon: Activity },
];
