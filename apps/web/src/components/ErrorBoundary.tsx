import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Trans } from 'react-i18next';

interface Props {
  readonly children: ReactNode;
}

interface State {
  readonly hasError: boolean;
}

/** Last-resort boundary so a rendering bug never shows a blank page or a stack trace. */
export class ErrorBoundary extends Component<Props, State> {
  override state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  override componentDidCatch(_error: Error, _info: ErrorInfo): void {
    // Client error reporting (Sentry) is wired in Phase 20.
  }

  override render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div role="alert" className="mx-auto max-w-md p-8 text-center">
          <p className="mb-4 font-medium">
            <Trans i18nKey="errors.unexpected" />
          </p>
          <button type="button" className="underline" onClick={() => window.location.reload()}>
            <Trans i18nKey="errors.reload" />
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
