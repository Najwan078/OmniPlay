import React, { Component, type ReactNode, type ErrorInfo } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[OmniPlay Neural Boundary Intercepted Exception]:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    try {
      sessionStorage.clear();
      localStorage.removeItem('omni_operator_role');
    } catch {
      // Ignore storage restrictions
    }
    window.location.href = '/login';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          width: '100vw',
          background: 'radial-gradient(ellipse at center, #0f172a 0%, #05050a 100%)',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          textAlign: 'center'
        }}>
          <div style={{
            maxWidth: '520px',
            width: '100%',
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(244, 63, 94, 0.4)',
            borderRadius: '16px',
            padding: '36px 28px',
            boxShadow: '0 8px 32px rgba(244, 63, 94, 0.25), inset 0 0 16px rgba(244, 63, 94, 0.1)',
            backdropFilter: 'blur(16px)'
          }}>
            <div style={{
              display: 'inline-flex',
              padding: '12px',
              borderRadius: '50%',
              background: 'rgba(244, 63, 94, 0.15)',
              color: '#f43f5e',
              marginBottom: '16px'
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '20px', color: '#f43f5e', letterSpacing: '0.05em' }}>
              SOMETHING WENT WRONG
            </h2>
            <p style={{ margin: '0 0 20px 0', color: '#94a3b8', fontSize: '14px', lineHeight: '1.5' }}>
              A temporary technical issue occurred while loading this view. Please click the button below to reload the page.
            </p>
            {this.state.error && (
              <div style={{
                background: 'rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '12px',
                color: '#e2e8f0',
                fontFamily: 'monospace',
                textAlign: 'left',
                overflowX: 'auto',
                marginBottom: '24px',
                maxHeight: '120px'
              }}>
                {this.state.error.toString()}
              </div>
            )}
            <button
              onClick={this.handleReload}
              style={{
                background: 'linear-gradient(135deg, #00d2ff, #0077ff)',
                color: '#ffffff',
                border: 'none',
                padding: '12px 28px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
                letterSpacing: '0.05em',
                boxShadow: '0 4px 16px rgba(0, 210, 255, 0.4)',
                transition: 'all 0.2s ease'
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
