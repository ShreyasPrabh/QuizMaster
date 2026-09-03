import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Eye, EyeOff, LogIn } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import soundFx from '../lib/soundFx'
import RetroMarquee from '../components/RetroMarquee'

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
        err?.message ||
        err?.response?.data?.detail ||
        err?.response?.data?.error ||
        'Invalid email or password. Please try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <RetroMarquee />

      <div className="auth-coinop-root" style={{ flex: 1 }}>
        <div className="auth-coinop-card">
          <Link
            to="/"
            onClick={() => soundFx.playSelect()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--neon-cyan)',
              textDecoration: 'none',
              fontFamily: 'var(--font-pixel)',
              fontSize: '9px',
              marginBottom: '20px',
            }}
          >
            <ArrowLeft size={12} />
            <span>← ARCADE HOME</span>
          </Link>

          <div className="coin-slot-header">
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>🪙</div>
            <h1>INSERT COIN TO LOG IN</h1>
            <p>Access requires an authentic player account</p>
          </div>

          {error && (
            <div
              style={{
                background: 'rgba(255, 0, 127, 0.15)',
                border: '2px solid var(--neon-pink)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 14px',
                color: 'var(--neon-pink)',
                fontSize: '13px',
                marginBottom: '16px',
                fontFamily: 'var(--font-body)',
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="coinop-field-group">
              <label>PLAYER EMAIL</label>
              <input
                type="email"
                placeholder="player1@arcade.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="coinop-input"
                required
              />
            </div>

            <div className="coinop-field-group">
              <label>PASSWORD</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="coinop-input"
                  style={{ paddingRight: '44px' }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-retro-yellow"
              style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}
            >
              <LogIn size={15} />
              <span>{loading ? 'AUTHENTICATING...' : 'LOG IN TO CABINET'}</span>
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: 'var(--text-secondary)' }}>
            New challenger?{' '}
            <Link to="/signup" style={{ color: 'var(--neon-cyan)', fontWeight: 'bold', textDecoration: 'none' }}>
              Create an Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
