import { Component, type ReactNode, type ErrorInfo } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

/**
 * Global error boundary. Wraps the entire app.
 * Catches any unhandled error in the React tree.
 * TODO: Replace console.error with Sentry or similar in production.
 */
export class GlobalErrorBoundary extends Component<Props, State> {
  static displayName = 'GlobalErrorBoundary'

  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[GlobalErrorBoundary]', error, info)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-card p-8 text-center">
            <div className="text-5xl mb-4">🐾</div>
            <h1 className="text-2xl font-semibold text-neutral-900 mb-2">Something went wrong</h1>
            <p className="text-neutral-500 mb-6">
              An unexpected error occurred. Please try reloading the page.
            </p>
            <button
              onClick={this.handleReset}
              className="w-full bg-primary-600 text-white py-3 px-6 rounded-xl
                         font-medium hover:bg-primary-700 transition-colors"
            >
              Reload app
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
