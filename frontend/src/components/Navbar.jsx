import React, { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LogIn, UserPlus, LogOut, LayoutDashboard, Menu, X } from 'lucide-react'
import RetroToolbar from './RetroToolbar'
import soundFx from '../lib/soundFx'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    soundFx.playSelect()
    signOut()
    setMobileMenuOpen(false)
    navigate('/')
  }

  const toggleMobileMenu = () => {
    soundFx.playSelect()
    setMobileMenuOpen((prev) => !prev)
  }

  return (
    <header className="landing-navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          className="mobile-nav-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <Link to="/" className="landing-nav-brand" onClick={() => setMobileMenuOpen(false)}>
          <div className="arcade-logo-box" style={{ padding: '2px' }}>
            <img src="/logo.svg" alt="QuizClub Logo" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
          </div>
          <div className="landing-brand-name">
            <span>QuizClub</span>
            <span className="arcade-tag-chip">ARCADE</span>
          </div>
        </Link>
      </div>

      {/* DESKTOP NAV LINKS */}
      <nav className="landing-nav-links">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/faq">FAQ</NavLink>
        <NavLink to="/contact">Contact</NavLink>
      </nav>

      {/* ACTIONS & TOOLBAR */}
      <div className="retro-nav-actions">
        <RetroToolbar showCoins={Boolean(user)} />

        {user ? (
          <div className="desktop-nav-auth" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Link to="/dashboard" className="btn-retro-yellow" style={{ padding: '8px 14px', fontSize: '10px' }}>
              <LayoutDashboard size={14} />
              <span>DASHBOARD</span>
            </Link>
            <button onClick={handleLogout} className="retro-tool-btn" title="Exit Arcade">
              <LogOut size={14} />
            </button>
          </div>
        ) : (
          <div className="desktop-nav-auth" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link to="/login" className="btn-retro-primary" style={{ padding: '8px 14px', fontSize: '10px' }}>
              <LogIn size={13} />
              <span>LOGIN</span>
            </Link>
            <Link to="/signup" className="btn-retro-secondary" style={{ padding: '8px 14px', fontSize: '10px' }}>
              <UserPlus size={13} />
              <span>SIGN UP</span>
            </Link>
          </div>
        )}
      </div>

      {/* MOBILE EXPANDED MENU DRAWER */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <NavLink to="/" end onClick={() => setMobileMenuOpen(false)} className="mobile-nav-item">
            🕹️ Home
          </NavLink>
          <NavLink to="/about" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-item">
            👾 About
          </NavLink>
          <NavLink to="/faq" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-item">
            ❓ FAQ
          </NavLink>
          <NavLink to="/contact" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-item">
            📡 Contact
          </NavLink>

          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '2px solid #222', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-retro-yellow"
                  style={{ justifyContent: 'center', width: '100%' }}
                >
                  <LayoutDashboard size={14} />
                  <span>DASHBOARD</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="retro-tool-btn"
                  style={{ justifyContent: 'center', width: '100%' }}
                >
                  <LogOut size={14} />
                  <span>LOG OUT</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-retro-primary"
                  style={{ justifyContent: 'center', width: '100%' }}
                >
                  <LogIn size={14} />
                  <span>LOGIN</span>
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-retro-secondary"
                  style={{ justifyContent: 'center', width: '100%' }}
                >
                  <UserPlus size={14} />
                  <span>SIGN UP</span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
