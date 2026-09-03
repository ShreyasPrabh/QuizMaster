// Web Audio API based 8-bit Retro Sound Synthesizer
// Zero external audio files required, runs 100% offline and cross-platform!

class RetroSoundEngine {
  constructor() {
    this.ctx = null
    this.muted = localStorage.getItem('quiz_retro_muted') === 'true'
  }

  getAudioContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
    return this.ctx
  }

  isMuted() {
    return this.muted
  }

  toggleMute() {
    this.muted = !this.muted
    localStorage.setItem('quiz_retro_muted', String(this.muted))
    return this.muted
  }

  setMuted(val) {
    this.muted = Boolean(val)
    localStorage.setItem('quiz_retro_muted', String(this.muted))
  }

  // Plays a synth tone with envelope
  playTone(freq, type = 'square', duration = 0.1, startTime = 0, gainLevel = 0.15) {
    if (this.muted) return
    const ctx = this.getAudioContext()
    if (!ctx) return

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = type
    osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime)

    gain.gain.setValueAtTime(gainLevel, ctx.currentTime + startTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + duration)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(ctx.currentTime + startTime)
    osc.stop(ctx.currentTime + startTime + duration)
  }

  // Classic Arcade Coin Insert (B5 -> E6)
  playCoin() {
    if (this.muted) return
    const ctx = this.getAudioContext()
    if (!ctx) return

    const now = 0
    this.playTone(987.77, 'sine', 0.08, now, 0.2) // B5
    this.playTone(1318.51, 'square', 0.28, now + 0.08, 0.25) // E6
  }

  // Quick retro button select blip
  playSelect() {
    if (this.muted) return
    this.playTone(440, 'square', 0.05, 0, 0.1)
  }

  // Correct answer - sparkling 8-bit arpeggio
  playCorrect() {
    if (this.muted) return
    const notes = [523.25, 659.25, 783.99, 1046.50] // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      this.playTone(freq, 'triangle', 0.12, idx * 0.06, 0.2)
    })
  }

  // Wrong answer - low buzzer
  playWrong() {
    if (this.muted) return
    const ctx = this.getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(150, now)
    osc.frequency.linearRampToValueAtTime(80, now + 0.25)

    gain.gain.setValueAtTime(0.2, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.25)
  }

  // Combo Streak sound - rising power pitch
  playCombo(multiplier = 2) {
    if (this.muted) return
    const base = 600 + Math.min(multiplier * 150, 1000)
    this.playTone(base, 'square', 0.08, 0, 0.18)
    this.playTone(base * 1.25, 'square', 0.14, 0.07, 0.22)
  }

  // Countdown clock tick (subtle urgency)
  playTick(isUrgent = false) {
    if (this.muted) return
    const freq = isUrgent ? 880 : 440
    this.playTone(freq, 'square', 0.04, 0, isUrgent ? 0.15 : 0.08)
  }

  // Level up / Milestone fanfare
  playLevelUp() {
    if (this.muted) return
    const notes = [392, 523.25, 659.25, 783.99, 1046.50, 1318.51] // G4 to E6
    notes.forEach((freq, idx) => {
      this.playTone(freq, 'square', 0.15, idx * 0.07, 0.18)
    })
  }

  // Victory / Stage clear fanfare
  playVictory() {
    if (this.muted) return
    const melody = [
      { f: 523.25, d: 0.12, t: 0 },
      { f: 523.25, d: 0.12, t: 0.14 },
      { f: 523.25, d: 0.12, t: 0.28 },
      { f: 659.25, d: 0.35, t: 0.42 },
      { f: 587.33, d: 0.15, t: 0.8 },
      { f: 659.25, d: 0.15, t: 0.96 },
      { f: 783.99, d: 0.5, t: 1.12 },
    ]
    melody.forEach((note) => {
      this.playTone(note.f, 'triangle', note.d, note.t, 0.22)
      this.playTone(note.f * 0.5, 'square', note.d, note.t, 0.1) // sub-octave bass
    })
  }
}

export const soundFx = new RetroSoundEngine()
export default soundFx
