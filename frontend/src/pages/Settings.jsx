import { useState, useEffect } from 'react'
import { Volume2, VolumeX, Tv, Palette, Check, Save } from 'lucide-react'
import soundFx from '../lib/soundFx'
import { RETRO_THEMES, getRetroSettings, applyRetroSettings } from '../lib/settingsSync'

export default function Settings() {
  const [settings, setSettings] = useState(() => getRetroSettings())
  const [savedSuccess, setSavedSuccess] = useState(false)

  // Synchronize in real time with toolbar, other tabs, or factory reset
  useEffect(() => {
    const handleSync = () => {
      setSettings(getRetroSettings())
    }
    window.addEventListener('quizmaster-settings-updated', handleSync)
    window.addEventListener('storage', handleSync)
    return () => {
      window.removeEventListener('quizmaster-settings-updated', handleSync)
      window.removeEventListener('storage', handleSync)
    }
  }, [])

  const handleToggleSound = () => {
    const nextMuted = !settings.muted
    applyRetroSettings({ muted: nextMuted })
    if (!nextMuted) soundFx.playCoin()
  }

  const handleTestSound = () => {
    soundFx.playVictory()
  }

  const handleToggleCrt = () => {
    soundFx.playSelect()
    applyRetroSettings({ crtOn: !settings.crtOn })
  }

  const handleSelectTheme = (themeId) => {
    soundFx.playSelect()
    applyRetroSettings({ theme: themeId })
  }

  const handleSave = () => {
    soundFx.playCoin()
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 2400)
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
            className={`btn-retro-${!settings.muted ? 'yellow' : 'outline'}`}
            style={{ fontSize: '10px', padding: '8px 14px' }}
          >
            {!settings.muted ? <Volume2 size={14} /> : <VolumeX size={14} />}
            <span>{!settings.muted ? 'SFX ENABLED' : 'SFX MUTED'}</span>
          </button>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
          <button
            onClick={handleTestSound}
            disabled={settings.muted}
            className="retro-tool-btn"
            style={{ opacity: settings.muted ? 0.4 : 1 }}
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
            onClick={handleToggleCrt}
            className={`btn-retro-${settings.crtOn ? 'secondary' : 'outline'}`}
            style={{ fontSize: '10px', padding: '8px 14px' }}
          >
            <Tv size={14} />
            <span>{settings.crtOn ? 'CRT FILTER ON' : 'CRT FILTER OFF'}</span>
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
          {RETRO_THEMES.map((th) => {
            const isSelected = settings.theme === th.id
            return (
              <div
                key={th.id}
                onClick={() => handleSelectTheme(th.id)}
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

      {/* SAVE PREFERENCES */}
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
    </div>
  )
}
