import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: ''
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error.message
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('ErrorBoundary catch error:', error);
    console.error('Details:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '40px',
          textAlign: 'center',
          backgroundColor: '#ffe6e6',
          border: '1px solid #ff9999',
          borderRadius: '8px',
          margin: '20px'
        }}>
          <h2 style={{ color: '#cc0000' }}>Smth went wrong</h2>
          <p>Plese update</p>
          <details style={{ marginTop: '16px', textAlign: 'left' }}>
            <summary>Technical details</summary>
            <pre style={{ fontSize: '12px', color: '#666' }}>
              {this.state.errorMessage}
            </pre>
          </details>
        </div>
      );
    }
    
    return this.props.children;
  }
}

export default ErrorBoundary;