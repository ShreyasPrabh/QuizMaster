import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Save, LogOut, Check, Sparkles, User, Trophy, Flame, Coins, Shield, RotateCcw, CheckCircle2, Lock } from 'lucide-react'
import { getUserStats, getQuizHistory, isAchievementUnlocked, RETRO_AVATARS, RETRO_ACHIEVEMENTS, getCleanAvatar, DEFAULT_AVATAR } from '../lib/userStats'
import { TOPIC_MODULES } from '../data/topicModules'
import soundFx from '../lib/soundFx'

export default function Profile() {
  const { user, signOut, updateUser } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState(user?.name || (user?.isGuest ? 'PLAYER 1' : 'RetroGamer'))
  const [avatar, setAvatar] = useState(() => getCleanAvatar(user?.avatar || (user?.id && localStorage.getItem(`quizmaster-avatar-${user.id}`))))
  const [bio, setBio] = useState('Arcade speed-runner and knowledge enthusiast.')
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [avatarNotice, setAvatarNotice] = useState(false)

  const [stats, setStats] = useState(() => getUserStats(user?.id))
  const [history, setHistory] = useState(() => getQuizHistory(user?.id))

  useEffect(() => {
    const handleSync = () => {
      setStats(getUserStats(user?.id))
      setHistory(getQuizHistory(user?.id))
    }
    window.addEventListener('quizmaster-stats-updated', handleSync)
    return () => window.removeEventListener('quizmaster-stats-updated', handleSync)
  }, [user])

  // Synchronize when user context becomes available or updates
  useEffect(() => {
    if (user) {
      if (user.name) setName(user.name)
      const storedAv = user.id ? localStorage.getItem(`quizmaster-avatar-${user.id}`) : null
      const currentAvatar = getCleanAvatar(user.avatar || storedAv)
      setAvatar(currentAvatar)
      setStats(getUserStats(user.id))
      setHistory(getQuizHistory(user.id))
    }
  }, [user])

  const unlockedAchievements = useMemo(() => {
    return RETRO_ACHIEVEMENTS.filter((ach) => isAchievementUnlocked(ach.id, stats, history))
  }, [stats, history])

  const lockedAchievements = useMemo(() => {
    return RETRO_ACHIEVEMENTS.filter((ach) => !isAchievementUnlocked(ach.id, stats, history))
  }, [stats, history])

  const handleAvatarSelect = (avEmoji) => {
    soundFx.playSelect()
    const clean = getCleanAvatar(avEmoji)
    setAvatar(clean)
    if (user?.id) {
      localStorage.setItem(`quizmaster-avatar-${user.id}`, clean)
    }
    localStorage.setItem('quizmaster-avatar', clean)
    updateUser({ avatar: clean })
    setAvatarNotice(true)
    setTimeout(() => setAvatarNotice(false), 2500)
  }

  const handleResetDefault = () => {
    handleAvatarSelect(DEFAULT_AVATAR)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    soundFx.playCoin()
    await updateUser({ name, avatar, bio })
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

          <div style={{ display: 'flex', gap: '16px', marginTop: '14px', flexWrap: 'wrap', fontFamily: 'var(--font-pixel)', fontSize: '10px' }}>
            <span style={{ color: 'var(--neon-yellow)' }}>🪙 {stats.coins || 100} COINS</span>
            <span style={{ color: 'var(--neon-pink)' }}>🔥 {stats.current_streak} DAY STREAK</span>
            <span style={{ color: 'var(--neon-cyan)' }}>🎯 {stats.accuracy}% ACCURACY</span>
            <span style={{ color: 'var(--neon-green)' }}>🏆 {(stats.high_score || 0).toLocaleString()} BEST RUN</span>
            <span style={{ color: 'var(--neon-yellow)' }}>⭐ {(stats.total_score || ((stats.correct_solved || 0) * 100) || stats.high_score || 0).toLocaleString()} TOTAL PTS</span>
          </div>
        </div>
      </div>

      {/* AVATAR SELECTOR */}
      <div style={{ background: 'var(--bg-card)', border: '3px solid #000', borderRadius: 'var(--radius-xl)', padding: '24px', boxShadow: '5px 5px 0px #000' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '8px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 'bold' }}>
            CHOOSE YOUR PIXEL AVATAR
          </h3>
          <button
            type="button"
            onClick={handleResetDefault}
            className="retro-tool-btn"
            style={{ fontSize: '10px', padding: '6px 12px', background: 'var(--bg-secondary)', borderColor: 'var(--neon-cyan)', color: 'var(--neon-cyan)', gap: '6px' }}
            title="Set back to default arcade avatar"
          >
            <RotateCcw size={12} />
            <span>RESET DEFAULT (👾)</span>
          </button>
        </div>

        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          Select an 8-bit character or pick a custom emoji. Your avatar updates across all pages, leaderboard, and profile.
        </p>

        {avatarNotice && (
          <div
            style={{
              background: 'rgba(0, 255, 102, 0.15)',
              border: '2px solid var(--neon-green)',
              color: 'var(--neon-green)',
              padding: '10px 16px',
              borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-pixel)',
              fontSize: '10px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Check size={14} />
            <span>AVATAR CHANGED TO {avatar}! APPLIED ACROSS QUIZCLUB.</span>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '12px' }}>
          {RETRO_AVATARS.map((av) => {
            const isSelected = avatar === av.emoji
            return (
              <button
                key={av.id}
                type="button"
                onClick={() => handleAvatarSelect(av.emoji)}
                className="retro-tool-btn"
                style={{
                  background: isSelected ? 'var(--neon-yellow)' : 'var(--bg-secondary)',
                  color: isSelected ? '#000' : '#fff',
                  borderColor: isSelected ? '#000' : '#333',
                  padding: '12px 8px',
                  flexDirection: 'column',
                  gap: '6px',
                  textAlign: 'center',
                  boxShadow: isSelected ? '4px 4px 0px #000' : '2px 2px 0px #000',
                  position: 'relative',
                  cursor: 'pointer',
                  transform: isSelected ? 'translateY(-2px)' : 'none',
                }}
              >
                <span style={{ fontSize: '32px', lineHeight: 1.2 }}>{av.emoji}</span>
                <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '8px', fontWeight: 'bold' }}>{av.name}</span>
                {isSelected && (
                  <span
                    style={{
                      fontFamily: 'var(--font-pixel)',
                      fontSize: '7px',
                      background: '#000',
                      color: 'var(--neon-yellow)',
                      padding: '2px 6px',
                      borderRadius: '3px',
                      marginTop: '2px',
                    }}
                  >
                    ✓ ACTIVE
                  </span>
                )}
              </button>
            )
          })}
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

      {/* COLLECTED TROPHIES */}
      <div style={{ background: '#000', border: '3px solid #000', borderRadius: 'var(--radius-xl)', padding: '24px', boxShadow: '5px 5px 0px #000' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #333', paddingBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
          <h3 style={{ fontFamily: 'var(--font-pixel)', fontSize: '11px', color: 'var(--neon-yellow)', margin: 0 }}>
            COLLECTED TROPHIES ({unlockedAchievements.length})
          </h3>
          <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '8px', color: 'var(--neon-cyan)', background: 'rgba(0, 240, 255, 0.1)', border: '1px solid var(--neon-cyan)', padding: '3px 8px', borderRadius: '4px' }}>
            {unlockedAchievements.length} OF {RETRO_ACHIEVEMENTS.length} COLLECTED
          </span>
        </div>

        {unlockedAchievements.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '2px dashed #444' }}>
            <Trophy size={36} color="#666" style={{ margin: '0 auto 12px', display: 'block' }} />
            <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '10px', color: '#fff', marginBottom: '6px' }}>
              NO TROPHIES COLLECTED YET
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Complete quizzes, score 100%, and build streaks to unlock arcade trophies!
            </p>
            <button type="button" onClick={() => navigate('/topics')} className="btn-retro-yellow" style={{ fontSize: '10px', padding: '8px 16px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span>START PLAYING</span>
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
            {unlockedAchievements.map((ach) => (
              <div
                key={ach.id}
                style={{
                  background: 'rgba(0, 240, 255, 0.06)',
                  border: '2px solid var(--neon-cyan)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center',
                  boxShadow: '0 0 12px rgba(0, 240, 255, 0.15)',
                }}
              >
                <span style={{ fontSize: '28px' }}>{ach.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px' }}>
                    <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '9px', color: 'var(--neon-yellow)' }}>{ach.name}</div>
                    <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '7px', color: 'var(--neon-green)', background: 'rgba(0,255,102,0.12)', border: '1px solid var(--neon-green)', borderRadius: '3px', padding: '2px 5px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={10} /> COLLECTED
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>{ach.desc}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* LOCKED TROPHIES */}
        {lockedAchievements.length > 0 && (
          <div style={{ marginTop: '28px' }}>
            <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '9px', color: 'var(--text-muted)', marginBottom: '14px', borderBottom: '1px dashed #333', paddingBottom: '8px' }}>
              LOCKED TROPHIES ({lockedAchievements.length})
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
              {lockedAchievements.map((ach) => (
                <div
                  key={ach.id}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '2px dashed #444',
                    borderRadius: 'var(--radius-md)',
                    padding: '14px',
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'center',
                    opacity: 0.65,
                  }}
                >
                  <span style={{ fontSize: '28px', filter: 'grayscale(100%)', opacity: 0.7 }}>{ach.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px' }}>
                      <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '9px', color: 'var(--text-muted)' }}>{ach.name}</div>
                      <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '7px', color: 'var(--text-muted)', background: '#222', border: '1px solid #444', borderRadius: '3px', padding: '2px 5px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        <Lock size={9} /> LOCKED
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{ach.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
