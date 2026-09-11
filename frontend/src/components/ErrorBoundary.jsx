import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('QuizClub App ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReset = () => {
    try {
      localStorage.removeItem('quiz-access-token')
      localStorage.removeItem('quiz-user')
    } catch {}
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            background: '#0b0c16',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            color: '#ffffff',
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          <div
            style={{
              maxWidth: '520px',
              background: '#000000',
              border: '4px solid #ff007f',
              boxShadow: '8px 8px 0px #ff007f',
              borderRadius: '16px',
              padding: '32px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>👾</div>
            <h1
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: '15px',
                color: '#ffe600',
                marginBottom: '16px',
                lineHeight: '1.5',
              }}
            >
              SYSTEM GLITCH DETECTED
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '20px' }}>
              Something interrupted the arcade display. Click below to reload the machine.
            </p>
            {this.state.error?.message && (
              <pre
                style={{
                  background: 'rgba(255, 0, 127, 0.1)',
                  border: '1px solid rgba(255, 0, 127, 0.4)',
                  padding: '12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#ff79c6',
                  textAlign: 'left',
                  overflowX: 'auto',
                  marginBottom: '20px',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={this.handleReset}
              style={{
                background: '#ffe600',
                color: '#000000',
                border: '2px solid #ffffff',
                boxShadow: '4px 4px 0px #ffffff',
                padding: '12px 24px',
                fontFamily: "'Press Start 2P', monospace",
                fontSize: '11px',
                cursor: 'pointer',
                borderRadius: '8px',
              }}
            >
              🔄 RESTART ARCADE
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
