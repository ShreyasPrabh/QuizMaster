import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', background: '#0b0c16', color: 'var(--neon-yellow)',
        fontFamily: 'var(--font-pixel)', fontSize: '12px',
        gap: '16px', flexDirection: 'column'
      }}>
        <div style={{
          width: 44, height: 44, border: '4px solid var(--neon-pink)',
          borderTopColor: 'transparent', borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <span>AUTHENTICATING PLAYER...</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  // Strict login only — no guest allowed
  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}
