import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      message: 'An unexpected UI error occurred.',
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error.message || 'An unexpected UI error occurred.',
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[LifeOS UI Error Boundary]', {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });
  }

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="lifeos-public-shell">
          <div className="lifeos-public-shell__inner">
            <div className="lifeos-card">
              <div className="lifeos-stack lifeos-stack--sm">
                <span className="lifeos-badge lifeos-badge--warning">UI Recovery</span>
                <h1 className="lifeos-section-title">Something went wrong</h1>
                <p className="lifeos-text">{this.state.message}</p>
                <div className="lifeos-actions">
                  <button className="lifeos-button" onClick={this.handleReload} type="button">
                    Reload app
                  </button>
                  <a className="lifeos-button lifeos-button--secondary" href="/">
                    Return home
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
