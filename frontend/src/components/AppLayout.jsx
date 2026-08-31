import { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate, useLocation, useSearchParams } from 'react-router-dom'
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
  ChevronDown,
  CheckCircle2,
  Sparkles,
  Zap,
  Check
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/topics', label: 'Topics', icon: Layers },
  { to: '/quiz', label: 'Quiz', icon: HelpCircle },
  { to: '/analytics', label: 'Analytics', icon: BarChart2 },
  { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/settings', label: 'Settings', icon: Settings },
]

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    icon: '🔥',
    title: 'Streak Active!',
    desc: 'Complete your daily module to extend your learning streak.',
    time: '10m ago',
  },
  {
    id: 2,
    icon: '☕',
    title: 'Java Module 1 Ready',
    desc: '20 new practice questions ready in Java Basics & Syntax.',
    time: '1h ago',
  },
  {
    id: 3,
    icon: '🎯',
    title: 'Accuracy Milestone',
    desc: 'Your quiz results are being tracked in real time.',
    time: '2h ago',
  },
]

export default function AppLayout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [showNotifications, setShowNotifications] = useState(false)
  const [notificationsList, setNotificationsList] = useState(() => {
    const isCleared = localStorage.getItem('quizmaster_notifs_cleared') === 'true'
    return isCleared ? [] : INITIAL_NOTIFICATIONS
  })

  const unreadCount = notificationsList.length

  const isQuiz = location.pathname.startsWith('/quiz/') && location.pathname !== '/quiz'
  const hideSearchBar = ['/profile', '/analytics', '/settings'].some((path) =>
    location.pathname.startsWith(path)
  )

  const handleLogout = () => {
    signOut()
    navigate('/login')
  }

  const handleMarkAllRead = () => {
    setNotificationsList([])
    localStorage.setItem('quizmaster_notifs_cleared', 'true')
  }

  const [avatar, setAvatar] = useState(() => localStorage.getItem('quizmaster-avatar') || '🧑‍🎓')
  const [customName, setCustomName] = useState(() => localStorage.getItem('quizmaster-name') || '')
  const displayName = customName || user?.name || 'Learner'

  useEffect(() => {
    const handleProfileUpdate = (e) => {
      if (e.detail?.avatar) setAvatar(e.detail.avatar)
      if (e.detail?.name) setCustomName(e.detail.name)
    }
    const handleStorage = () => {
      setAvatar(localStorage.getItem('quizmaster-avatar') || '🧑‍🎓')
      setCustomName(localStorage.getItem('quizmaster-name') || '')
    }
    window.addEventListener('quizmaster-profile-update', handleProfileUpdate)
    window.addEventListener('storage', handleStorage)
    return () => {
      window.removeEventListener('quizmaster-profile-update', handleProfileUpdate)
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  const [searchParams, setSearchParams] = useSearchParams()
  const currentSearch = searchParams.get('q') || ''

  const handleSearchChange = (e) => {
    const val = e.target.value
    const newParams = new URLSearchParams(location.search)
    if (val.trim()) {
      newParams.set('q', val)
    } else {
      newParams.delete('q')
    }
    const searchString = newParams.toString()
    navigate(`${location.pathname}${searchString ? `?${searchString}` : ''}`, { replace: true })
  }

  return (
    <div className="qm-app-container">
      {/* LEFT SIDEBAR */}
      <aside className="qm-sidebar">
        <div className="qm-sidebar-brand" onClick={() => navigate('/dashboard')}>
          <div className="qm-brand-logo">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="8" fill="#6366F1" />
              <path d="M7 14L14 7L21 14L14 21L7 14Z" fill="white" fillOpacity="0.8" />
              <path d="M14 7V21" stroke="#6366F1" strokeWidth="2" />
              <path d="M7 14H21" stroke="#6366F1" strokeWidth="2" />
            </svg>
          </div>
          <span className="qm-brand-name">QuizClub</span>
        </div>

        <nav className="qm-sidebar-nav">
          {navLinks.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `qm-nav-item ${isActive ? 'active' : ''}`
                }
              >
                <Icon size={19} className="qm-nav-icon" />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        <div className="qm-sidebar-footer">
          {user ? (
            <button className="qm-logout-btn" onClick={handleLogout}>
              <LogOut size={18} />
              <span>Log out</span>
            </button>
          ) : (
            <button className="qm-logout-btn" onClick={() => navigate('/login')}>
              <LogOut size={18} />
              <span>Sign in</span>
            </button>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <div className="qm-main-wrapper">
        {/* TOP HEADER */}
        {!isQuiz && (
          <header className="qm-top-header">
            {!hideSearchBar ? (
              <div className="qm-search-box">
                <Search size={17} className="qm-search-icon" />
                <input
                  type="text"
                  placeholder="Search modules, topics, quizzes..."
                  className="qm-search-input"
                  value={currentSearch}
                  onChange={handleSearchChange}
                />
              </div>
            ) : (
              <div className="qm-header-spacer" />
            )}

            <div className="qm-header-actions">
              {/* NOTIFICATION BUTTON & DROPDOWN */}
              <div className="relative">
                <button
                  className="qm-bell-btn"
                  title="Notifications"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell size={19} />
                  {unreadCount > 0 && <span className="qm-bell-badge" />}
                </button>

                {showNotifications && (
                  <div className="qm-notifications-dropdown">
                    <div className="qm-notif-header">
                      <h3>Notifications</h3>
                      {notificationsList.length > 0 ? (
                        <button
                          className="qm-notif-mark-read"
                          onClick={handleMarkAllRead}
                        >
                          Mark all as read
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400">All cleared</span>
                      )}
                    </div>

                    <div className="qm-notif-list">
                      {notificationsList.length > 0 ? (
                        notificationsList.map((n) => (
                          <div key={n.id} className="qm-notif-item">
                            <span className="qm-notif-icon">{n.icon}</span>
                            <div className="qm-notif-body">
                              <h4>{n.title}</h4>
                              <p>{n.desc}</p>
                              <span className="qm-notif-time">{n.time}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="py-6 text-center text-slate-400 text-xs flex flex-col items-center gap-1.5">
                          <CheckCircle2 size={20} className="text-emerald" />
                          <span>No notifications. You're all caught up!</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="qm-user-profile-btn" onClick={() => navigate('/profile')}>
                <div className="qm-user-avatar">
                  <span>{avatar}</span>
                </div>
                <span className="qm-user-name">{displayName}</span>
                <ChevronDown size={15} className="qm-chevron-icon" />
              </div>
            </div>
          </header>
        )}

        {/* OUTLET */}
        <main className="qm-content-area">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
