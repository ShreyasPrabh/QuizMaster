import React, { useState, useEffect } from 'react'
import soundFx from '../lib/soundFx'
import { Volume2, VolumeX, Tv, Palette, Coins } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const THEMES = [
  { id: 'arcade', label: 'Neon Arcade', class: 'retro-theme-arcade' },
  { id: 'synthwave', label: 'Synthwave', class: 'retro-theme-synthwave' },
  { id: 'gameboy', label: 'Gameboy', class: 'retro-theme-gameboy' },
]

export default function RetroToolbar({ showCoins = true }) {
  const { user } = useAuth()
  const [muted, setMuted] = useState(() => soundFx.isMuted())
  const [crtOn, setCrtOn] = useState(() => localStorage.getItem('quiz_crt_active') === 'true')
  const [themeIdx, setThemeIdx] = useState(() => {
    const saved = localStorage.getItem('quiz_retro_theme') || 'arcade'
    if (saved === 'memphis') {
      localStorage.setItem('quiz_retro_theme', 'arcade')
      return 0
    }
    const idx = THEMES.findIndex((t) => t.id === saved)
    return idx >= 0 ? idx : 0
  })

  // Apply CRT
  useEffect(() => {
    if (crtOn) {
      document.body.classList.add('crt-active')
      localStorage.setItem('quiz_crt_active', 'true')
    } else {
      document.body.classList.remove('crt-active')
      localStorage.setItem('quiz_crt_active', 'false')
    }
  }, [crtOn])

  // Apply Theme
  useEffect(() => {
    THEMES.forEach((t) => document.body.classList.remove(t.class))
    const currentTheme = THEMES[themeIdx]
    document.body.classList.add(currentTheme.class)
    localStorage.setItem('quiz_retro_theme', currentTheme.id)
  }, [themeIdx])

  const handleToggleSound = () => {
    const isNowMuted = soundFx.toggleMute()
    setMuted(isNowMuted)
    if (!isNowMuted) {
      soundFx.playCoin()
    }
  }

  const handleToggleCrt = () => {
    soundFx.playSelect()
    setCrtOn((prev) => !prev)
  }

  const handleCycleTheme = () => {
    soundFx.playSelect()
    setThemeIdx((prev) => (prev + 1) % THEMES.length)
  }

  const userCoins = user?.coins ?? 100

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {showCoins && (
        <div className="retro-coin-badge" title="Arcade Coins">
          <span>🪙</span>
          <span>{userCoins}</span>
        </div>
      )}

      <button
        type="button"
        className={`retro-tool-btn ${!muted ? 'active' : ''}`}
        onClick={handleToggleSound}
        title={muted ? 'Unmute 8-Bit Audio' : 'Mute 8-Bit Audio'}
      >
        {!muted ? <Volume2 size={14} /> : <VolumeX size={14} />}
        <span>{muted ? 'SFX OFF' : 'SFX ON'}</span>
      </button>

      <button
        type="button"
        className={`retro-tool-btn ${crtOn ? 'active' : ''}`}
        onClick={handleToggleCrt}
        title="Toggle CRT Scanline Monitor Effect"
      >
        <Tv size={14} />
        <span>{crtOn ? 'CRT ON' : 'CRT OFF'}</span>
      </button>

      <button
        type="button"
        className="retro-tool-btn"
        onClick={handleCycleTheme}
        title="Cycle Retro Theme"
      >
        <Palette size={14} />
        <span>{THEMES[themeIdx].label}</span>
      </button>
    </div>
  )
}
