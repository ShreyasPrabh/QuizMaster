import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Eye, EyeOff, Sparkles, BarChart2, Smile, Lock } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signIn(email, password)
      navigate('/dashboard')
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.error ||
        'Invalid email or password. Please try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-split-layout">
      {/* LEFT FORM PANEL */}
      <div className="auth-form-side">
        <Link to="/" className="auth-back-link">
          <ArrowLeft size={16} />
          <span>Back to home</span>
        </Link>

        <div className="auth-form-header">
          <h1>Welcome back</h1>
          <p>Enter your details to sign in to QuizMaster</p>
        </div>

        {error && <div className="auth-error-banner">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-inputs-form">
          <div className="auth-field-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-field-group">
            <label>Password</label>
            <div className="password-input-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="auth-primary-submit-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          <p className="auth-switch-text">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </form>
      </div>

      {/* RIGHT VALUE PROP PANEL */}
      <div className="auth-value-side">
        <div className="auth-value-content">
          <div className="auth-3d-illustration">
            <div className="illustration-books-stack">
              <span className="emoji-cap">🎯</span>
              <span className="emoji-books">🏆</span>
              <span className="emoji-coffee">⚡</span>
            </div>
          </div>

          <div className="auth-features-list">
            <div className="auth-feature-row">
              <div className="feature-bullet-icon bg-indigo">
                <Sparkles size={18} />
              </div>
              <div>
                <h4>Resume where you left off</h4>
                <p>Pick up active quizzes and save your daily streak</p>
              </div>
            </div>

            <div className="auth-feature-row">
              <div className="feature-bullet-icon bg-purple">
                <BarChart2 size={18} />
              </div>
              <div>
                <h4>Track your progress</h4>
                <p>Monitor your accuracy and climb the leaderboard</p>
              </div>
            </div>

            <div className="auth-feature-row">
              <div className="feature-bullet-icon bg-blue">
                <Smile size={18} />
              </div>
              <div>
                <h4>Daily challenges</h4>
                <p>Fresh questions added continuously</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
