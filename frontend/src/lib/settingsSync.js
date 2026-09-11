import soundFx from './soundFx'

export const RETRO_THEMES = [
  { id: 'arcade', label: 'Neon Arcade', desc: 'Electric pink & cyan glowing synthwave', class: 'retro-theme-arcade' },
  { id: 'synthwave', label: 'Synthwave', desc: 'Deep violet gradient & glowing horizons', class: 'retro-theme-synthwave' },
  { id: 'gameboy', label: 'Gameboy', desc: 'Authentic 4-shade green monochrome pixel vibe', class: 'retro-theme-gameboy' },
]

export function getRetroSettings() {
  const muted = soundFx.isMuted()
  const crtOn = localStorage.getItem('quiz_crt_active') === 'true'
  let theme = localStorage.getItem('quiz_retro_theme') || 'arcade'
  if (theme === 'memphis' || !RETRO_THEMES.some((t) => t.id === theme)) {
    theme = 'arcade'
    localStorage.setItem('quiz_retro_theme', 'arcade')
  }
  return { muted, crtOn, theme }
}

export function applyRetroSettings(settings = {}) {
  const current = getRetroSettings()
  const updated = { ...current, ...settings }

  // 1. Sound
  if (typeof updated.muted === 'boolean') {
    soundFx.setMuted(updated.muted)
  }

  // 2. CRT Scanlines
  if (typeof updated.crtOn === 'boolean') {
    if (updated.crtOn) {
      document.body.classList.add('crt-active')
      localStorage.setItem('quiz_crt_active', 'true')
    } else {
      document.body.classList.remove('crt-active')
      localStorage.setItem('quiz_crt_active', 'false')
    }
  }

  // 3. Theme
  if (updated.theme) {
    RETRO_THEMES.forEach((t) => document.body.classList.remove(t.class))
    const themeObj = RETRO_THEMES.find((t) => t.id === updated.theme) || RETRO_THEMES[0]
    if (themeObj.class) {
      document.body.classList.add(themeObj.class)
    }
    localStorage.setItem('quiz_retro_theme', themeObj.id)
  }

  // 4. Dispatch custom event for real-time reactivity across all components
  window.dispatchEvent(new CustomEvent('quizmaster-settings-updated', { detail: updated }))
  return updated
}

export function resetRetroSettingsToDefault() {
  localStorage.removeItem('quiz_retro_muted')
  localStorage.removeItem('quiz_crt_active')
  localStorage.setItem('quiz_retro_theme', 'arcade')
  localStorage.removeItem('quizmaster_notifs_cleared')
  localStorage.removeItem('quizmaster-preferred-topics')
  localStorage.removeItem('qm_leaderboard_cache')

  const defaults = applyRetroSettings({
    muted: false,
    crtOn: false,
    theme: 'arcade',
  })

  window.dispatchEvent(new Event('quizmaster-stats-updated'))
  return defaults
}
