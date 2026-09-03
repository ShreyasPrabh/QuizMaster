import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Eye, EyeOff, UserPlus } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import soundFx from '../lib/soundFx'
import RetroMarquee from '../components/RetroMarquee'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Please enter a gamer tag.')
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
        err?.message ||
        data?.error ||
        (data && typeof data === 'object' ? Object.values(data).flat().join(' ') : null) ||
        'Could not create account. Please try again.'
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
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>🕹️</div>
            <h1>JOIN THE ARCADE</h1>
            <p>Create your permanent account to compete on high scores</p>
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
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="coinop-field-group">
              <label>PLAYER GAMER TAG</label>
              <input
                type="text"
                placeholder="PixelMaster99"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="coinop-input"
                required
              />
            </div>

            <div className="coinop-field-group">
              <label>EMAIL ADDRESS</label>
              <input
                type="email"
                placeholder="player@arcade.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="coinop-input"
                required
              />
            </div>

            <div className="coinop-field-group">
              <label>PASSWORD (MIN 6 CHARS)</label>
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

            <div className="coinop-field-group">
              <label>CONFIRM PASSWORD</label>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="coinop-input"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-retro-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}
            >
              <UserPlus size={15} />
              <span>{loading ? 'REGISTERING PLAYER...' : 'INSERT COIN & SIGN UP'}</span>
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: 'var(--text-secondary)' }}>
            Already have a tag?{' '}
            <Link to="/login" style={{ color: 'var(--neon-yellow)', fontWeight: 'bold', textDecoration: 'none' }}>
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
