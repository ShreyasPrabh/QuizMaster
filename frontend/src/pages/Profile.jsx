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
  const { user, signOut, updateUser } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [avatar, setAvatar] = useState(() => user?.avatar || (user?.id && localStorage.getItem(`quizmaster-avatar-${user.id}`)) || '🧑‍🎓')
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
    if (user?.avatar) setAvatar(user.avatar)

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

  const handleRemoveTopic = (topicToRemove) => {
    setTopics((prev) => {
      const updated = prev.filter((t) => t !== topicToRemove)
      localStorage.setItem('quizmaster-preferred-topics', JSON.stringify(updated))
      return updated
    })
  }

  const handleToggleTopic = (topicName) => {
    setTopics((prev) => {
      let updated
      if (prev.includes(topicName)) {
        updated = prev.filter((t) => t !== topicName)
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

    const cleanName = name.trim() || user?.name || 'User'
    const cleanEmail = email.trim() || user?.email || ''

    if (user?.id) {
      localStorage.setItem(`quizmaster-avatar-${user.id}`, avatar)
    }
    localStorage.setItem('quizmaster-preferred-topics', JSON.stringify(topics))
    localStorage.removeItem('qm_leaderboard_cache') // Clear leaderboard cache so new name/avatar appears immediately

    if (updateUser) {
      updateUser({ name: cleanName, email: cleanEmail, avatar })
    }

    // 3. Persist to PostgreSQL backend
    if (user) {
      api.put('/profile/', {
        name: cleanName,
        email: cleanEmail,
        bio,
        avatar
      }).then((res) => {
        if (res.data?.user && updateUser) {
          updateUser(res.data.user)
        }
      }).catch(() => {})
    }
  }

  const handleLogout = () => {
    signOut()
    navigate('/login')
  }

  return (
    <div className="qm-profile-page">
      {/* HEADER */}
      <div className="qm-profile-top-header">
        <h1>Profile & Preferences</h1>
        <p>Manage your public identity, study topics, and customized study preferences.</p>
      </div>

      <div className="qm-profile-two-column-grid">
        {/* LEFT: PROFILE FORM */}
        <div className="qm-profile-main-card">
          <h2 className="qm-column-title">Account Information</h2>

          {/* AVATAR HERO ROW */}
          <div className="qm-avatar-change-strip">
            <div className="qm-profile-avatar-giant">
              <span className="giant-emoji">{avatar}</span>
            </div>
            <div className="qm-avatar-actions-meta">
              <span className="qm-avatar-heading">Profile Avatar</span>
              <p className="qm-avatar-sub">This emoji represents you across leaderboards and stats.</p>
              <button
                type="button"
                className="qm-btn-outline-sm"
                onClick={() => setShowAvatarPicker(!showAvatarPicker)}
              >
                <Edit3 size={14} />
                <span>{showAvatarPicker ? 'Close Picker' : 'Change Avatar'}</span>
              </button>
            </div>
          </div>

          {/* POPUP AVATAR PICKER */}
          {showAvatarPicker && (
            <div className="qm-avatar-picker-bubble">
              <span className="picker-title">Select your avatar:</span>
              <div className="avatar-grid-emojis">
                {AVATAR_OPTIONS.map((av) => (
                  <button
                    key={av}
                    type="button"
                    className={`avatar-choice-btn ${avatar === av ? 'selected' : ''}`}
                    onClick={() => {
                      setAvatar(av)
                      setShowAvatarPicker(false)
                      if (user?.id) {
                        localStorage.setItem(`quizmaster-avatar-${user.id}`, av)
                      }
                      if (updateUser) {
                        updateUser({ avatar: av })
                      }
                      if (user) {
                        api.put('/profile/', { avatar: av }).catch(() => {})
                      }
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
