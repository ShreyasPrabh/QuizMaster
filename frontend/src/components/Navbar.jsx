import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { BookOpen, BarChart3, LayoutDashboard, User, LogOut, Sparkles } from 'lucide-react'

const navItems = [
  { to: '/', label: 'Home', icon: Sparkles },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/topics', label: 'Topics', icon: BookOpen },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/profile', label: 'Profile', icon: User },
]

export default function Navbar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    signOut()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <Link to="/" className="brand-wrap">
        <div className="brand-logo-badge">🎯</div>
        <div className="brand">QuizFlow</div>
      </Link>

      <div className="nav-links">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </div>

      <div className="nav-actions">
        {user ? (
          <div className="user-nav-badge">
            <Link to="/profile" className="user-info-pill">
              <span className="user-avatar-sm">
                {(user.name || user.email || 'U')[0].toUpperCase()}
              </span>
              <span className="user-name-text">{user.name || user.email?.split('@')[0]}</span>
            </Link>
            <button onClick={handleLogout} className="logout-btn" title="Sign out">
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <div className="auth-nav-buttons">
            <NavLink to="/login" className="secondary-btn">
              Login
            </NavLink>
            <NavLink to="/signup" className="primary-btn">
              Sign Up
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  )
}
