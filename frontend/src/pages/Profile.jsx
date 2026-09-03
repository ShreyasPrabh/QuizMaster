import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Save, LogOut, Check, Sparkles, User, Trophy, Flame, Coins, Shield } from 'lucide-react'
import { getUserStats, RETRO_AVATARS, RETRO_ACHIEVEMENTS } from '../lib/userStats'
import { TOPIC_MODULES } from '../data/topicModules'
import soundFx from '../lib/soundFx'

export default function Profile() {
  const { user, signOut, updateUser } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState(user?.name || (user?.isGuest ? 'PLAYER 1' : 'RetroGamer'))
  const [avatar, setAvatar] = useState(() => user?.avatar || (user?.id && localStorage.getItem(`quizmaster-avatar-${user.id}`)) || '👾')
  const [bio, setBio] = useState('Arcade speed-runner and knowledge enthusiast.')
  const [savedSuccess, setSavedSuccess] = useState(false)

  const stats = getUserStats(user?.id)

  const handleAvatarSelect = (avEmoji) => {
    soundFx.playSelect()
    setAvatar(avEmoji)
    if (user?.id) {
      localStorage.setItem(`quizmaster-avatar-${user.id}`, avEmoji)
    }
  }

  const handleSave = (e) => {
    e.preventDefault()
    soundFx.playCoin()
    updateUser({ name, avatar })
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 2400)
  }

  const handleLogout = () => {
    soundFx.playSelect()
    signOut()
    navigate('/')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* HEADER */}
      <div>
        <div className="hero-tag-badge">
          <span>🪪</span>
          <span>PLAYER CREDENTIALS &amp; CUSTOMIZATION</span>
        </div>
        <h1 className="section-retro-title">PLAYER 1 ID CARD</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
          Personalize your arcade avatar, gamer tag, and inspect your unlocked achievements.
        </p>
      </div>

      {/* ARCADE ID CARD */}
      <div
        style={{
          background: '#000000',
          border: '4px solid var(--neon-cyan)',
          boxShadow: '8px 8px 0px var(--neon-cyan)',
          borderRadius: 'var(--radius-xl)',
          padding: '32px',
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gap: '28px',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: '90px',
            height: '90px',
            background: 'var(--bg-card)',
            border: '4px solid var(--neon-yellow)',
            boxShadow: '4px 4px 0px var(--neon-yellow)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '50px',
          }}
        >
          {avatar}
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: '900', color: '#fff' }}>
              {name}
            </h2>
            <span className="arcade-tag-chip" style={{ background: 'var(--neon-green)', color: '#000' }}>
              LVL {stats.level}
            </span>
            {user?.isGuest && (
              <span className="arcade-tag-chip" style={{ background: 'var(--neon-pink)', color: '#fff' }}>
                GUEST
              </span>
            )}
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '6px' }}>
            {bio}
          </p>

          <div style={{ display: 'flex', gap: '20px', marginTop: '14px', flexWrap: 'wrap', fontFamily: 'var(--font-pixel)', fontSize: '10px' }}>
            <span style={{ color: 'var(--neon-yellow)' }}>🪙 {stats.coins || 100} COINS</span>
            <span style={{ color: 'var(--neon-pink)' }}>🔥 {stats.current_streak} DAY STREAK</span>
            <span style={{ color: 'var(--neon-cyan)' }}>🎯 {stats.accuracy}% ACCURACY</span>
            <span style={{ color: 'var(--neon-green)' }}>🏆 {stats.high_score || 0} HIGH SCORE</span>
          </div>
        </div>
      </div>

      {/* AVATAR SELECTOR */}
      <div style={{ background: 'var(--bg-card)', border: '3px solid #000', borderRadius: 'var(--radius-xl)', padding: '24px', boxShadow: '5px 5px 0px #000' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>
          CHOOSE YOUR PIXEL AVATAR
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '18px' }}>
          Select an 8-bit character to represent you on the high scores leaderboard:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '12px' }}>
          {RETRO_AVATARS.map((av) => (
            <button
              key={av.id}
              onClick={() => handleAvatarSelect(av.emoji)}
              className="retro-tool-btn"
              style={{
                background: avatar === av.emoji ? 'var(--neon-yellow)' : 'var(--bg-secondary)',
                color: avatar === av.emoji ? '#000' : '#fff',
                borderColor: avatar === av.emoji ? '#000' : '#333',
                padding: '12px 8px',
                flexDirection: 'column',
                gap: '6px',
                textAlign: 'center',
                boxShadow: avatar === av.emoji ? '4px 4px 0px #000' : '2px 2px 0px #000',
              }}
            >
              <span style={{ fontSize: '28px' }}>{av.emoji}</span>
              <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '8px' }}>{av.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* EDIT GAMER TAG FORM */}
      <div style={{ background: 'var(--bg-card)', border: '3px solid #000', borderRadius: 'var(--radius-xl)', padding: '24px', boxShadow: '5px 5px 0px #000' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
          PLAYER SETTINGS
        </h3>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-pixel)', fontSize: '9px', color: 'var(--neon-cyan)', marginBottom: '8px' }}>
              GAMER TAG / CALLSIGN
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="coinop-input"
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-pixel)', fontSize: '9px', color: 'var(--neon-cyan)', marginBottom: '8px' }}>
              PLAYER BIO / STATUS
            </label>
            <input
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="coinop-input"
            />
          </div>

          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <button type="submit" className="btn-retro-yellow">
              <Save size={14} />
              <span>SAVE CREDENTIALS</span>
            </button>

            {savedSuccess && (
              <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '10px', color: 'var(--neon-green)' }}>
                ✓ SAVED!
              </span>
            )}
          </div>
        </form>
      </div>

      {/* UNLOCKED TROPHIES */}
      <div style={{ background: '#000', border: '3px solid #000', borderRadius: 'var(--radius-xl)', padding: '24px', boxShadow: '5px 5px 0px #000' }}>
        <h3 style={{ fontFamily: 'var(--font-pixel)', fontSize: '11px', color: 'var(--neon-yellow)', marginBottom: '16px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
          COLLECTED TROPHIES ({RETRO_ACHIEVEMENTS.length})
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
          {RETRO_ACHIEVEMENTS.map((ach) => (
            <div
              key={ach.id}
              style={{
                background: 'var(--bg-secondary)',
                border: '2px solid #333',
                borderRadius: 'var(--radius-md)',
                padding: '14px',
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '28px' }}>{ach.icon}</span>
              <div>
                <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '9px', color: '#fff' }}>{ach.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>{ach.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
