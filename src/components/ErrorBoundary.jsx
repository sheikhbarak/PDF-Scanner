import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo })
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  reset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
    this.props.onReset?.()
  }

  copyDetails = async () => {
    const details = `${this.state.error?.toString() || ''}\n\n${this.state.errorInfo?.componentStack || ''}`
    try {
      await navigator.clipboard.writeText(details)
    } catch (e) {
      console.warn('Clipboard not available')
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary" role="alert">
          <h2 className="page-title">Something went wrong</h2>
          <p className="page-subtitle">An unexpected error occurred. You can try again.</p>
          <div className="error-actions">
            <button className="scan-btn" onClick={this.reset}>Retry</button>
            <button className="scan-btn" style={{ background: 'transparent', color: 'var(--accent)', borderColor: 'transparent' }} onClick={this.copyDetails}>Copy details</button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary