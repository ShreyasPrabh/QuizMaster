import React, { useState, useEffect } from 'react'
import soundFx from '../lib/soundFx'
import { Volume2, VolumeX, Tv, Palette, Coins } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getUserStats } from '../lib/userStats'
import { RETRO_THEMES, getRetroSettings, applyRetroSettings } from '../lib/settingsSync'

export default function RetroToolbar({ showCoins = true }) {
  const { user } = useAuth()
  const [stats, setStats] = useState(() => getUserStats(user?.id))
  const [settings, setSettings] = useState(() => getRetroSettings())

  // Keep stats / coins in sync
  useEffect(() => {
    const handleStatsSync = () => {
      setStats(getUserStats(user?.id))
    }
    window.addEventListener('quizmaster-stats-updated', handleStatsSync)
    return () => window.removeEventListener('quizmaster-stats-updated', handleStatsSync)
  }, [user?.id])

  // Sync settings when changed anywhere (Settings page, toolbar, or factory reset)
  useEffect(() => {
    const handleSettingsSync = () => {
      setSettings(getRetroSettings())
    }
    window.addEventListener('quizmaster-settings-updated', handleSettingsSync)
    window.addEventListener('storage', handleSettingsSync)
    return () => {
      window.removeEventListener('quizmaster-settings-updated', handleSettingsSync)
      window.removeEventListener('storage', handleSettingsSync)
    }
  }, [])

  const handleToggleSound = () => {
    const nextMuted = !settings.muted
    applyRetroSettings({ muted: nextMuted })
    if (!nextMuted) {
      soundFx.playCoin()
    }
  }

  const handleToggleCrt = () => {
    soundFx.playSelect()
    applyRetroSettings({ crtOn: !settings.crtOn })
  }

  const handleCycleTheme = () => {
    soundFx.playSelect()
    const currentIdx = RETRO_THEMES.findIndex((t) => t.id === settings.theme)
    const nextIdx = (currentIdx + 1) % RETRO_THEMES.length
    const nextTheme = RETRO_THEMES[nextIdx]
    applyRetroSettings({ theme: nextTheme.id })
  }

  const userCoins = stats?.coins ?? user?.coins ?? 100
  const activeTheme = RETRO_THEMES.find((t) => t.id === settings.theme) || RETRO_THEMES[0]

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
        className={`retro-tool-btn ${!settings.muted ? 'active' : ''}`}
        onClick={handleToggleSound}
        title={settings.muted ? 'Unmute 8-Bit Audio' : 'Mute 8-Bit Audio'}
      >
        {!settings.muted ? <Volume2 size={14} /> : <VolumeX size={14} />}
        <span>{settings.muted ? 'SFX OFF' : 'SFX ON'}</span>
      </button>

      <button
        type="button"
        className={`retro-tool-btn ${settings.crtOn ? 'active' : ''}`}
        onClick={handleToggleCrt}
        title="Toggle CRT Scanline Monitor Effect"
      >
        <Tv size={14} />
        <span>{settings.crtOn ? 'CRT ON' : 'CRT OFF'}</span>
      </button>

      <button
        type="button"
        className="retro-tool-btn"
        onClick={handleCycleTheme}
        title="Cycle Retro Theme"
      >
        <Palette size={14} />
        <span>{activeTheme.label}</span>
      </button>
    </div>
  )
}
