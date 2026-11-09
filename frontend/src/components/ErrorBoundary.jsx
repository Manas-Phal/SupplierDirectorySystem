import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary caught error]:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            backgroundColor: '#f4f7fb',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          <div
            style={{
              maxWidth: '560px',
              width: '100%',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.1)',
              border: '1px solid #fee2e2',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                backgroundColor: '#fef2f2',
                padding: '20px 24px',
                borderBottom: '1px solid #fecaca',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  backgroundColor: '#fee2e2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#dc2626',
                }}
              >
                <AlertTriangle size={24} />
              </div>
              <div>
                <h2
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 600,
                    color: '#991b1b',
                    margin: 0,
                  }}
                >
                  Application Render Error
                </h2>
                <p style={{ margin: '2px 0 0', fontSize: '0.85rem', color: '#b91c1c' }}>
                  A client-side JavaScript error was encountered while rendering.
                </p>
              </div>
            </div>

            <div style={{ padding: '24px' }}>
              <div
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  fontSize: '0.85rem',
                  color: '#334155',
                  fontFamily: 'monospace',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  maxHeight: '160px',
                  overflowY: 'auto',
                }}
              >
                {this.state.error?.message || 'Unknown error'}
              </div>

              <div style={{ marginTop: '20px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={this.handleReload}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 18px',
                    backgroundColor: '#1d4ed8',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  <RefreshCw size={15} />
                  <span>Reload Application</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

