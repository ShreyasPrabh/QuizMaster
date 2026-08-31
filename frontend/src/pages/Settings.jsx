import { useState, useEffect } from 'react'
import { Bell, Lock, Shield, Moon, Sun, Globe, Save, CheckCircle2, Volume2 } from 'lucide-react'

export default function Settings() {
  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem('quizmaster-sound') !== 'false'
  })

  const [darkMode, setDarkMode] = useState(() => {
    return document.documentElement.getAttribute('data-theme') === 'dark' ||
      localStorage.getItem('quizmaster-theme') === 'dark'
  })

  const [saved, setSaved] = useState(false)

  // Sync dark mode toggle to DOM
  const handleToggleTheme = (isDark) => {
    setDarkMode(isDark)
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark')
      localStorage.setItem('quizmaster-theme', 'dark')
    } else {
      document.documentElement.setAttribute('data-theme', 'light')
      localStorage.setItem('quizmaster-theme', 'light')
    }
  }

  const handleToggleSound = (isEnabled) => {
    setSoundEnabled(isEnabled)
    localStorage.setItem('quizmaster-sound', isEnabled ? 'true' : 'false')
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="qm-profile-page">
      <div className="qm-page-welcome-header">
        <h1>Settings</h1>
        <p>Manage application theme, audio preferences, and interface language</p>
      </div>

      <div className="qm-card qm-settings-card">
        <div className="qm-settings-section">
          <h3 className="qm-settings-subhead">Interface & Theme</h3>

          {/* DARK MODE TOGGLE */}
          <div className="qm-setting-item-row">
            <div className="qm-setting-left-info">
              <div className="qm-setting-icon-pill">
                {darkMode ? <Moon size={18} className="text-indigo" /> : <Sun size={18} className="text-amber" />}
              </div>
              <div>
                <span className="qm-setting-title">Dark Mode Theme</span>
                <p className="qm-setting-sub">Toggle between modern dark mode and clean light theme</p>
              </div>
            </div>
            <label className="qm-switch">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={(e) => handleToggleTheme(e.target.checked)}
              />
              <span className="qm-slider round" />
            </label>
          </div>

          {/* AUDIO EFFECTS TOGGLE */}
          <div className="qm-setting-item-row">
            <div className="qm-setting-left-info">
              <div className="qm-setting-icon-pill">
                <Volume2 size={18} className="text-emerald" />
              </div>
              <div>
                <span className="qm-setting-title">Audio & Sound Effects</span>
                <p className="qm-setting-sub">Play celebratory feedback sounds on quiz answers</p>
              </div>
            </div>
            <label className="qm-switch">
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => handleToggleSound(e.target.checked)}
              />
              <span className="qm-slider round" />
            </label>
          </div>

          {/* LANGUAGE (ENGLISH ONLY) */}
          <div className="qm-setting-item-row">
            <div className="qm-setting-left-info">
              <div className="qm-setting-icon-pill">
                <Globe size={18} className="text-blue" />
              </div>
              <div>
                <span className="qm-setting-title">Application Language</span>
                <p className="qm-setting-sub">Interface & challenge questions language</p>
              </div>
            </div>
            <div className="qm-language-badge-pill">
              <span>🇺🇸 English (US)</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <button className="qm-btn-primary-sm" onClick={handleSave}>
            <Save size={15} />
            <span>Save Preferences</span>
          </button>
          {saved && (
            <span className="qm-save-indicator">
              <CheckCircle2 size={16} className="text-emerald" /> Preferences saved!
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
