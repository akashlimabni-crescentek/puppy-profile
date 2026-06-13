import { Component, type ReactNode, type ErrorInfo } from 'react'
import { AlertCircle } from 'lucide-react'

interface Props {
  children: ReactNode
  fallbackMessage?: string
}

interface State {
  hasError: boolean
}

/**
 * Card-level error boundary.
 * Wraps only the PuppyProfileCard. Shows an inline fallback instead of
 * crashing the whole page. Does not redirect.
 */
export class CardErrorBoundary extends Component<Props, State> {
  static displayName = 'CardErrorBoundary'

  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[CardErrorBoundary]', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="flex flex-col items-center justify-center p-8 text-center
                        bg-white rounded-card border border-hairline shadow-card max-w-sm mx-auto"
        >
          <div className="flex justify-center mb-3 text-slate">
            <AlertCircle size={28} strokeWidth={1.5} aria-hidden="true" />
          </div>
          <p className="text-ink font-medium">
            {this.props.fallbackMessage ?? 'Unable to load puppy profile'}
          </p>
          <p className="text-slate text-sm mt-1">Please try refreshing the page</p>
        </div>
      )
    }
    return this.props.children
  }
}
