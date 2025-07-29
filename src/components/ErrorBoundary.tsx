import React, { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary hat einen Fehler abgefangen:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="error-boundary">
          <div className="error-content">
            <h2>😵 Ups! Etwas ist schiefgelaufen</h2>
            <p>
              Es tut uns leid, aber etwas Unerwartetes ist passiert. 
              Bitte versuche die Seite neu zu laden.
            </p>
            <button 
              className="btn btn-primary"
              onClick={() => window.location.reload()}
            >
              Seite neu laden
            </button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-details">
                <summary>Fehlerdetails (Entwicklung)</summary>
                <div className="error-info">
                  <p><strong>Fehlermeldung:</strong></p>
                  <pre>{this.state.error.message}</pre>
                  <p><strong>Stack Trace:</strong></p>
                  <pre>{this.state.error.stack}</pre>
                </div>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
} 