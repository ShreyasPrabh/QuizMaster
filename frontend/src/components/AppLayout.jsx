import { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate, useLocation, useSearchParams, Link } from 'react-router-dom'
import {
  LayoutDashboard,
  Layers,
  HelpCircle,
  BarChart2,
  Trophy,
  User,
  Settings,
  LogOut,
  Search,
  Bell,
  CheckCircle2,
  Zap,
  Flame,
  Menu,
  X
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import RetroToolbar from './RetroToolbar'
import RetroMarquee from './RetroMarquee'
import soundFx from '../lib/soundFx'
import { getUserStats } from '../lib/userStats'

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/topics', label: 'Cartridges', icon: Layers },
  { to: '/quiz', label: 'Arcade Quiz', icon: HelpCircle },
  { to: '/leaderboard', label: 'High Scores', icon: Trophy },
  { to: '/analytics', label: 'Telemetry', icon: BarChart2 },
  { to: '/profile', label: 'Player ID', icon: User },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function AppLayout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [stats, setStats] = useState(() => getUserStats(user?.id))
  const [notifsOpen, setNotifsOpen] = useState(false)
  const [currentSearch, setCurrentSearch] = useState(searchParams.get('q') || '')

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileSidebarOpen(false)
  }, [location.pathname])

  // Sync stats on quiz updates
  useEffect(() => {
    const handleStatsUpdate = () => {
      setStats(getUserStats(user?.id))
    }
    window.addEventListener('quizmaster-stats-updated', handleStatsUpdate)
    return () => window.removeEventListener('quizmaster-stats-updated', handleStatsUpdate)
  }, [user?.id])

  const handleLogout = () => {
    soundFx.playSelect()
    signOut()
    navigate('/')
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (currentSearch.trim()) {
      soundFx.playSelect()
      navigate(`/topics?q=${encodeURIComponent(currentSearch.trim())}`)
    }
  }

  const notifications = [
    { id: 1, title: 'Cabinet Online 🕹️', msg: 'Welcome to QuizClub Arcade v2.0!', time: 'Now' },
    { id: 2, title: 'High Scores Active 🏆', msg: 'Compete across 60+ cartridges to reach S-Rank.', time: '1m ago' },
    { id: 3, title: 'Combo Streak Power 🔥', msg: 'Chain correct answers to unlock 3x score multipliers.', time: '10m ago' },
  ]

  const unreadNotifs = !localStorage.getItem('quizmaster_notifs_cleared')

  const handleClearNotifs = () => {
    soundFx.playSelect()
    localStorage.setItem('quizmaster_notifs_cleared', 'true')
  }

  const avatar = user?.avatar || (user?.id && localStorage.getItem(`quizmaster-avatar-${user.id}`)) || '👾'
  const displayName = user?.name || 'Player 1'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* RETRO TICKER AT THE VERY TOP */}
      <RetroMarquee />

      <div className="app-shell-root">
        {/* MOBILE BACKDROP */}
        {mobileSidebarOpen && (
          <div
            className="retro-sidebar-backdrop"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        {/* RETRO SIDEBAR */}
        <aside className={`retro-sidebar ${mobileSidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-logo-area">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <Link to="/dashboard" style={{ textDecoration: 'none' }} onClick={() => setMobileSidebarOpen(false)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div className="arcade-logo-box" style={{ width: '38px', height: '38px', padding: '3px' }}>
                    <img src="/logo.svg" alt="QuizClub Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                  <div>
                    <div className="landing-brand-name" style={{ fontSize: '20px' }}>QuizClub</div>
                    <span className="arcade-tag-chip">ARCADE</span>
                  </div>
                </div>
              </Link>

              <button
                className="mobile-sidebar-close-btn"
                onClick={() => setMobileSidebarOpen(false)}
                aria-label="Close sidebar"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <nav className="sidebar-nav-list">
            {navLinks.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    isActive ? 'sidebar-nav-item active' : 'sidebar-nav-item'
                  }
                  onClick={() => {
                    soundFx.playSelect()
                    setMobileSidebarOpen(false)
                  }}
                >
                  <Icon className="sidebar-nav-icon" />
                  <span>{item.label}</span>
                </NavLink>
              )
            })}
          </nav>

          {/* PLAYER STATUS CARD */}
          <div className="sidebar-player-card">
            <div className="player-avatar-box">{avatar}</div>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div className="player-name-text" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {displayName}
              </div>
              <div className="player-level-chip">
                LVL {stats.level} • {stats.current_streak}🔥
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="retro-tool-btn"
              style={{ padding: '6px', borderRadius: '4px' }}
              title="Exit / Logout"
            >
              <LogOut size={13} />
            </button>
          </div>
        </aside>

        {/* MAIN APP AREA */}
        <div className="app-main-area">
          {/* TOPBAR */}
          <header className="app-topbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                className="mobile-sidebar-toggle"
                onClick={() => setMobileSidebarOpen(true)}
                aria-label="Open sidebar menu"
              >
                <Menu size={18} />
              </button>

              {/* Search */}
              <form onSubmit={handleSearchSubmit} className="retro-search-form">
                <div className="retro-search-input-wrap">
                  <Search size={15} color="var(--neon-cyan)" />
                  <input
                    type="text"
                    placeholder="Search 60+ topics..."
                    value={currentSearch}
                    onChange={(e) => setCurrentSearch(e.target.value)}
                    className="retro-search-field"
                  />
                </div>
              </form>
            </div>

            {/* Right Tools & Notifs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <RetroToolbar showCoins={true} />

              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  className="retro-tool-btn"
                  onClick={() => {
                    soundFx.playSelect()
                    setNotifsOpen(!notifsOpen)
                  }}
                  title="Arcade Transmissions"
                >
                  <Bell size={14} />
                  {unreadNotifs && <span className="retro-notif-dot" />}
                </button>

                {/* Notifications Drawer */}
                {notifsOpen && (
                  <div className="retro-notifs-dropdown">
                    <div className="notifs-header">
                      <span>ARCADE DISPATCH</span>
                      <button
                        onClick={handleClearNotifs}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--neon-cyan)',
                          cursor: 'pointer',
                          fontFamily: 'var(--font-pixel)',
                          fontSize: '8px',
                        }}
                      >
                        CLEAR ALL
                      </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {notifications.map((n) => (
                        <div key={n.id} className="notif-item">
                          <div style={{ fontWeight: 'bold', color: 'var(--neon-yellow)', fontSize: '12px' }}>
                            {n.title}
                          </div>
                          <div style={{ color: 'var(--text-secondary)', fontSize: '11px', marginTop: '2px' }}>
                            {n.msg}
                          </div>
                          <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '4px' }}>
                            {n.time}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* PAGE CONTENT */}
          <main className="app-content-body">
            <Outlet />
          </main>

          {/* MOBILE BOTTOM NAVIGATION BAR */}
          <nav className="mobile-bottom-bar">
            <NavLink to="/dashboard" className={({ isActive }) => `mobile-bottom-item ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={18} />
              <span>Dash</span>
            </NavLink>
            <NavLink to="/topics" className={({ isActive }) => `mobile-bottom-item ${isActive ? 'active' : ''}`}>
              <Layers size={18} />
              <span>Topics</span>
            </NavLink>
            <NavLink to="/quiz" className={({ isActive }) => `mobile-bottom-item ${isActive ? 'active' : ''}`}>
              <HelpCircle size={18} />
              <span>Quiz</span>
            </NavLink>
            <NavLink to="/leaderboard" className={({ isActive }) => `mobile-bottom-item ${isActive ? 'active' : ''}`}>
              <Trophy size={18} />
              <span>Ranks</span>
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => `mobile-bottom-item ${isActive ? 'active' : ''}`}>
              <User size={18} />
              <span>Profile</span>
            </NavLink>
          </nav>
        </div>
      </div>
    </div>
  )
}
