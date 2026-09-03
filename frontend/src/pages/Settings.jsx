import { useState, useEffect } from 'react'
import { Volume2, VolumeX, Tv, Palette, RotateCcw, Check, Save, Sparkles, AlertTriangle } from 'lucide-react'
import soundFx from '../lib/soundFx'

const THEMES = [
  { id: 'arcade', label: 'Neon Arcade', desc: 'Electric pink & cyan glowing synthwave', class: 'retro-theme-arcade' },
  { id: 'synthwave', label: 'Synthwave Sunset', desc: 'Deep violet gradient & glowing horizons', class: 'retro-theme-synthwave' },
  { id: 'gameboy', label: 'Gameboy Nostalgia', desc: 'Authentic 4-shade green monochrome pixel vibe', class: 'retro-theme-gameboy' },
]

export default function Settings() {
  const [muted, setMuted] = useState(() => soundFx.isMuted())
  const [crtOn, setCrtOn] = useState(() => localStorage.getItem('quiz_crt_active') === 'true')
  const [selectedTheme, setSelectedTheme] = useState(() => {
    const saved = localStorage.getItem('quiz_retro_theme') || 'arcade'
    if (saved === 'memphis') {
      localStorage.setItem('quiz_retro_theme', 'arcade')
      return 'arcade'
    }
    return saved
  })
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  // Sync CRT
  useEffect(() => {
    if (crtOn) {
      document.body.classList.add('crt-active')
      localStorage.setItem('quiz_crt_active', 'true')
    } else {
      document.body.classList.remove('crt-active')
      localStorage.setItem('quiz_crt_active', 'false')
    }
  }, [crtOn])

  // Sync Theme
  useEffect(() => {
    THEMES.forEach((t) => document.body.classList.remove(t.class))
    const currentTheme = THEMES.find((t) => t.id === selectedTheme) || THEMES[0]
    document.body.classList.add(currentTheme.class)
    localStorage.setItem('quiz_retro_theme', selectedTheme)
  }, [selectedTheme])

  const handleToggleSound = () => {
    const nextMuted = soundFx.toggleMute()
    setMuted(nextMuted)
    if (!nextMuted) soundFx.playCoin()
  }

  const handleTestSound = () => {
    soundFx.playVictory()
  }

  const handleSave = () => {
    soundFx.playCoin()
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 2400)
  }

  const handleResetCabinet = () => {
    soundFx.playWrong()
    localStorage.removeItem('quizmaster_notifs_cleared')
    localStorage.removeItem('quizmaster-preferred-topics')
    localStorage.removeItem('qm_leaderboard_cache')
    window.dispatchEvent(new Event('quizmaster-stats-updated'))
    setShowResetConfirm(false)
    alert('Arcade cabinet state reset to factory defaults!')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* HEADER */}
      <div>
        <div className="hero-tag-badge">
          <span>⚙️</span>
          <span>ARCADE CABINET CONFIGURATION</span>
        </div>
        <h1 className="section-retro-title">SYSTEM SETTINGS</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
          Tune sound synthesizers, monitor scanlines, and customize your retro theme.
        </p>
      </div>

      {/* 8-BIT AUDIO SYNTHESIZER */}
      <div style={{ background: 'var(--bg-card)', border: '3px solid #000', borderRadius: 'var(--radius-xl)', padding: '24px', boxShadow: '5px 5px 0px #000' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>🔊</span>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 'bold' }}>
                8-Bit Audio Synthesizer
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Real-time Web Audio API sound effects for coins, answers, timers &amp; fanfares
              </p>
            </div>
          </div>

          <button
            onClick={handleToggleSound}
            className={`btn-retro-${!muted ? 'yellow' : 'outline'}`}
            style={{ fontSize: '10px', padding: '8px 14px' }}
          >
            {!muted ? <Volume2 size={14} /> : <VolumeX size={14} />}
            <span>{!muted ? 'SFX ENABLED' : 'SFX MUTED'}</span>
          </button>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
          <button
            onClick={handleTestSound}
            disabled={muted}
            className="retro-tool-btn"
            style={{ opacity: muted ? 0.4 : 1 }}
          >
            <span>🎵 TEST STAGE CLEAR FANFARE</span>
          </button>
        </div>
      </div>

      {/* CRT SCANLINE MONITOR */}
      <div style={{ background: 'var(--bg-card)', border: '3px solid #000', borderRadius: 'var(--radius-xl)', padding: '24px', boxShadow: '5px 5px 0px #000' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>📺</span>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 'bold' }}>
                CRT Scanline Monitor Filter
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Authentic 80s arcade monitor phosphors, horizontal scanlines, and subtle vignette
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.playSelect()
              setCrtOn(!crtOn)
            }}
            className={`btn-retro-${crtOn ? 'secondary' : 'outline'}`}
            style={{ fontSize: '10px', padding: '8px 14px' }}
          >
            <Tv size={14} />
            <span>{crtOn ? 'CRT FILTER ON' : 'CRT FILTER OFF'}</span>
          </button>
        </div>
      </div>

      {/* THEME SELECTOR */}
      <div style={{ background: 'var(--bg-card)', border: '3px solid #000', borderRadius: 'var(--radius-xl)', padding: '24px', boxShadow: '5px 5px 0px #000' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
          COLORFUL RETRO THEMES
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '18px' }}>
          Select your preferred arcade aesthetic:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          {THEMES.map((th) => {
            const isSelected = selectedTheme === th.id
            return (
              <div
                key={th.id}
                onClick={() => {
                  soundFx.playSelect()
                  setSelectedTheme(th.id)
                }}
                className="retro-cartridge-card"
                style={{
                  cursor: 'pointer',
                  padding: '18px',
                  background: isSelected ? 'rgba(255, 230, 0, 0.1)' : 'var(--bg-secondary)',
                  borderColor: isSelected ? 'var(--neon-yellow)' : '#000',
                  boxShadow: isSelected ? '4px 4px 0px var(--neon-yellow)' : '3px 3px 0px #000',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>
                    {th.label}
                  </h4>
                  {isSelected && <Check size={16} color="var(--neon-yellow)" />}
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {th.desc}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* SAVE OR FACTORY RESET */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button onClick={handleSave} className="btn-retro-yellow">
            <Save size={14} />
            <span>SAVE PREFERENCES</span>
          </button>
          {savedSuccess && (
            <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '10px', color: 'var(--neon-green)' }}>
              ✓ PREFERENCES SAVED!
            </span>
          )}
        </div>

        {/* FACTORY RESET */}
        <div>
          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="retro-tool-btn"
              style={{ color: 'var(--neon-pink)', borderColor: 'var(--neon-pink)' }}
            >
              <AlertTriangle size={13} />
              <span>FACTORY RESET CABINET</span>
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: 'var(--neon-pink)' }}>Reset all cache?</span>
              <button onClick={handleResetCabinet} className="btn-retro-primary" style={{ padding: '6px 10px', fontSize: '9px' }}>
                YES, RESET
              </button>
              <button onClick={() => setShowResetConfirm(false)} className="btn-retro-outline" style={{ padding: '6px 10px', fontSize: '9px' }}>
                CANCEL
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
