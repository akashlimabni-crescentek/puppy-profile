import { Component, type ReactNode, type ErrorInfo } from 'react'
import { TriangleAlert } from 'lucide-react'

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
 * TODO: Replace console.error with Sentry once an error-tracking backend is provisioned.
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
        <div className="min-h-screen flex items-center justify-center bg-parchment p-4">
          <div className="max-w-md w-full bg-white rounded-card border border-hairline shadow-card p-8 text-center">
            <div className="flex justify-center mb-4 text-slate">
              <TriangleAlert size={36} strokeWidth={1.5} aria-hidden="true" />
            </div>
            <h1 className="font-display text-2xl font-semibold text-ink mb-2">
              Something went wrong
            </h1>
            <p className="text-slate mb-6">
              An unexpected error occurred. Please try reloading the page.
            </p>
            <button
              onClick={this.handleReset}
              className="w-full bg-copper text-cream py-3 px-6 rounded-xl
                         font-medium hover:bg-copper-dark transition-colors
                         focus:outline-none focus:ring-2 focus:ring-copper focus:ring-offset-2"
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
