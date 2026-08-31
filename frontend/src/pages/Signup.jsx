import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Eye, EyeOff, Sparkles, BarChart2, Smile } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Please enter your full name.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      await signUp(name, email, password)
      navigate('/dashboard')
    } catch (err) {
      const data = err?.response?.data
      const msg =
        data?.error ||
        (data && typeof data === 'object' ? Object.values(data).flat().join(' ') : null) ||
        'Could not create account. Please check your details.'
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
          <h1>Create your account</h1>
          <p>Join QuizMaster and start your journey</p>
        </div>

        {error && <div className="auth-error-banner">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-inputs-form">
          <div className="auth-field-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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

          <div className="auth-field-group">
            <label>Confirm Password</label>
            <div className="password-input-wrap">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="auth-primary-submit-btn" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign up'}
          </button>

          <p className="auth-switch-text">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </form>
      </div>

      {/* RIGHT VALUE PROP PANEL */}
      <div className="auth-value-side">
        <div className="auth-value-content">
          <div className="auth-3d-illustration">
            <div className="illustration-books-stack">
              <span className="emoji-cap">🎓</span>
              <span className="emoji-books">📚</span>
              <span className="emoji-coffee">☕</span>
            </div>
          </div>

          <div className="auth-features-list">
            <div className="auth-feature-row">
              <div className="feature-bullet-icon bg-indigo">
                <Sparkles size={18} />
              </div>
              <div>
                <h4>Personalized quizzes</h4>
                <p>Based on your favorite topics</p>
              </div>
            </div>

            <div className="auth-feature-row">
              <div className="feature-bullet-icon bg-purple">
                <BarChart2 size={18} />
              </div>
              <div>
                <h4>Track your progress</h4>
                <p>See your stats and improve</p>
              </div>
            </div>

            <div className="auth-feature-row">
              <div className="feature-bullet-icon bg-blue">
                <Smile size={18} />
              </div>
              <div>
                <h4>Learn and have fun</h4>
                <p>Challenge yourself daily</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
