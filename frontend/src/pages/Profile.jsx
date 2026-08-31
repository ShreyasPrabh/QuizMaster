import { useState, useEffect, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { CheckCircle2, ChevronDown, Save, LogOut, Plus, X, Sparkles, User, Edit3 } from 'lucide-react'
import api from '../lib/api'
import { TOPIC_MODULES } from '../data/topicModules'

const AVATAR_OPTIONS = [
  '🧑‍🎓', '👨‍💻', '👩‍💻', '👩‍🔬', '👨‍🏫', '🧑‍🚀',
  '🦸‍♂️', '🥷', '🧙‍♂️', '🦊', '🦁', '🦉',
  '🚀', '💎', '⚡', '🎯'
]

export default function Profile() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [avatar, setAvatar] = useState('🧑‍🎓')
  const [bio, setBio] = useState('Passionate learner and software developer.')
  const [difficulty, setDifficulty] = useState('Medium')
  const [reminders, setReminders] = useState(true)
  const [savedSuccess, setSavedSuccess] = useState(false)

  // Avatar Modal State
  const [showAvatarPicker, setShowAvatarPicker] = useState(false)

  // Preferred Topics & Topic Editor State
  const [topics, setTopics] = useState([
    'Java',
    'Python',
    'Data Structures & Algorithms',
    'Algebra & Equations',
  ])
  const [isEditingTopics, setIsEditingTopics] = useState(false)

  // All available topics derived directly from TOPIC_MODULES
  const allAvailableTopicList = useMemo(() => {
    return Object.values(TOPIC_MODULES).map((t) => ({
      name: t.name,
      icon: t.icon,
      id: t.id,
      category: t.category,
    }))
  }, [])

  useEffect(() => {
    if (user?.name) setName(user.name)
    if (user?.email) setEmail(user.email)

    const savedAvatar = localStorage.getItem('quizmaster-avatar')
    if (savedAvatar) setAvatar(savedAvatar)

    const savedTopics = localStorage.getItem('quizmaster-preferred-topics')
    if (savedTopics) {
      try {
        const parsed = JSON.parse(savedTopics)
        if (Array.isArray(parsed) && parsed.length >= 0) {
          setTopics(parsed)
        }
      } catch {}
    }
  }, [user])

  const handleRemoveTopic = (tToRemove) => {
    setTopics((prev) => {
      const updated = prev.filter((t) => t !== tToRemove && t !== tToRemove.name && t !== tToRemove.id)
      localStorage.setItem('quizmaster-preferred-topics', JSON.stringify(updated))
      return updated
    })
  }

  const handleToggleTopic = (topicName) => {
    setTopics((prev) => {
      let updated
      if (prev.includes(topicName)) {
        updated = prev.filter((item) => item !== topicName)
      } else {
        updated = [...prev, topicName]
      }
      localStorage.setItem('quizmaster-preferred-topics', JSON.stringify(updated))
      return updated
    })
  }

  const handleSave = (e) => {
    if (e) e.preventDefault()
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)

    localStorage.setItem('quizmaster-avatar', avatar)
    localStorage.setItem('quizmaster-preferred-topics', JSON.stringify(topics))

    if (user) {
      api.put('/profile/', { bio, avatar }).catch(() => {})
    }
  }

  const handleLogout = () => {
    signOut()
    navigate('/login')
  }

  return (
    <div className="qm-profile-page">
      {/* HEADER */}
      <div className="qm-page-welcome-header">
        <h1>Profile</h1>
        <p>Manage your account information, avatar, and learning preferences</p>
      </div>

      {/* 2-COLUMN PROFILE WORKSPACE */}
      <div className="qm-profile-split-card">
        {/* LEFT: PROFILE INFORMATION */}
        <div className="qm-profile-info-column">
          <h2 className="qm-column-title">Profile Information</h2>

          <div className="qm-profile-avatar-row">
            <div
              className="qm-profile-avatar-big"
              onClick={() => setShowAvatarPicker(!showAvatarPicker)}
              title="Click to select avatar"
            >
              {avatar}
            </div>
            <div>
              <button
                type="button"
                className="qm-change-avatar-link"
                onClick={() => setShowAvatarPicker(!showAvatarPicker)}
              >
                {showAvatarPicker ? 'Close Avatar Picker' : 'Change Avatar'}
              </button>
            </div>
          </div>

          {/* AVATAR PICKER GRID */}
          {showAvatarPicker && (
            <div className="qm-avatar-picker-modal">
              <span className="qm-avatar-picker-title">Select Avatar:</span>
              <div className="qm-avatar-options-grid">
                {AVATAR_OPTIONS.map((av) => (
                  <button
                    key={av}
                    type="button"
                    className={`qm-avatar-opt-btn ${avatar === av ? 'selected' : ''}`}
                    onClick={() => {
                      setAvatar(av)
                      setShowAvatarPicker(false)
                      localStorage.setItem('quizmaster-avatar', av)
                    }}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSave} className="qm-profile-fields-form mt-3">
            <div className="qm-field-box">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="qm-field-box">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="qm-field-box">
              <label>Bio</label>
              <textarea
                rows={3}
                placeholder="Tell us about yourself"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            <div className="qm-profile-actions-bottom">
              <button type="submit" className="qm-btn-primary-sm">
                <Save size={15} />
                <span>Save Changes</span>
              </button>

              <button type="button" onClick={handleLogout} className="qm-profile-logout-btn">
                <LogOut size={15} />
                <span>Log out</span>
              </button>

              {savedSuccess && (
                <span className="qm-save-indicator">
                  <CheckCircle2 size={16} className="text-emerald" /> Changes saved!
                </span>
              )}
            </div>
          </form>
        </div>

        {/* RIGHT: PREFERENCES */}
        <div className="qm-profile-pref-column">
          <div className="qm-pref-header-row">
            <h2 className="qm-column-title">Preferences</h2>
          </div>

          <div className="qm-pref-subgroup">
            <div className="qm-pref-label-row">
              <label>Preferred Topics ({topics.length})</label>
              <button
                type="button"
                className="qm-btn-text-sm"
                onClick={() => setIsEditingTopics(!isEditingTopics)}
              >
                {isEditingTopics ? 'Done Editing' : 'Edit Topics'}
              </button>
            </div>

            {/* TAGS LIST */}
            {topics.length > 0 ? (
              <div className="qm-tags-row">
                {topics.map((t) => (
                  <span key={t} className="qm-topic-tag-pill">
                    <span>{t}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTopic(t)}
                      className="tag-remove-x"
                      title={`Remove ${t}`}
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 my-2">No preferred topics selected yet.</p>
            )}

            {/* INTERACTIVE TOPIC PICKER DRAWER */}
            {isEditingTopics && (
              <div className="qm-topic-picker-box">
                <span className="qm-topic-picker-hint">Click topics to add or remove:</span>
                <div className="qm-available-topics-chips">
                  {allAvailableTopicList.map((t) => {
                    const isSelected = topics.includes(t.name) || topics.includes(t.id)
                    return (
                      <button
                        key={t.id}
                        type="button"
                        className={`qm-topic-chip-btn ${isSelected ? 'active' : ''}`}
                        onClick={() => handleToggleTopic(t.name)}
                      >
                        <span className="mr-1">{t.icon}</span>
                        {isSelected ? '✓ ' : '+ '}
                        {t.name}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="qm-pref-subgroup mt-6">
            <label>Default Difficulty</label>
            <div className="qm-select-styled-box">
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
              <ChevronDown size={16} className="qm-select-arrow" />
            </div>
          </div>

          <div className="qm-pref-subgroup mt-6">
            <label>Daily Reminders</label>
            <div className="qm-reminder-toggle-row">
              <span className="qm-reminder-desc">Get reminded to practice daily</span>
              <label className="qm-switch">
                <input
                  type="checkbox"
                  checked={reminders}
                  onChange={(e) => setReminders(e.target.checked)}
                />
                <span className="qm-slider round" />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
