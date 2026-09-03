import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Send, CheckCircle2, Mail, MessageSquare } from 'lucide-react'
import Navbar from '../components/Navbar'
import RetroMarquee from '../components/RetroMarquee'
import soundFx from '../lib/soundFx'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    soundFx.playCoin()
    setSubmitted(true)
    setTimeout(() => {
      setForm({ name: '', email: '', subject: '', message: '' })
      setSubmitted(false)
    }, 3000)
  }

  return (
    <div className="landing-page-root">
      <RetroMarquee />
      <Navbar />

      <main style={{ maxWidth: '960px', margin: '0 auto', padding: '50px 24px 80px' }}>
        <Link
          to="/"
          onClick={() => soundFx.playSelect()}
          className="retro-tool-btn"
          style={{ width: 'fit-content', marginBottom: '24px' }}
        >
          <ArrowLeft size={14} />
          <span>← BACK TO HOME</span>
        </Link>

        <div className="hero-tag-badge">
          <span>📡</span>
          <span>ARCADE OPERATOR TRANSMISSION</span>
        </div>

        <h1 className="section-retro-title" style={{ fontSize: '42px', marginBottom: '16px' }}>
          CONTACT OPERATORS
        </h1>
        <p style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '36px' }}>
          Have question suggestions, partnership inquiries, or arcade feedback? Transmit your message below!
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '32px' }}>
          {/* FORM */}
          <div style={{ background: '#000', border: '3px solid var(--neon-pink)', boxShadow: '6px 6px 0px var(--neon-pink)', borderRadius: 'var(--radius-xl)', padding: '32px' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎉</div>
                <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '12px', color: 'var(--neon-green)' }}>
                  TRANSMISSION RECEIVED!
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '8px' }}>
                  Thanks for reaching out! An arcade operator will reply shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-pixel)', fontSize: '9px', color: 'var(--neon-cyan)', marginBottom: '8px' }}>
                    CALLSIGN / NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="coinop-input"
                    placeholder="PixelMaster"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-pixel)', fontSize: '9px', color: 'var(--neon-cyan)', marginBottom: '8px' }}>
                    TRANSMISSION EMAIL
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="coinop-input"
                    placeholder="player@arcade.io"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-pixel)', fontSize: '9px', color: 'var(--neon-cyan)', marginBottom: '8px' }}>
                    SUBJECT
                  </label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="coinop-input"
                    placeholder="New Quiz Topic Request"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-pixel)', fontSize: '9px', color: 'var(--neon-cyan)', marginBottom: '8px' }}>
                    MESSAGE
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="coinop-input"
                    style={{ resize: 'vertical' }}
                    placeholder="Enter your feedback or inquiry..."
                  />
                </div>

                <button type="submit" className="btn-retro-yellow">
                  <Send size={14} />
                  <span>TRANSMIT DISPATCH</span>
                </button>
              </form>
            )}
          </div>

          {/* CONTACT INFO */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="retro-cartridge-card">
              <div className="cartridge-icon-box box-cyan">📧</div>
              <h3 className="cartridge-title" style={{ fontSize: '18px' }}>Direct Dispatch</h3>
              <p className="cartridge-desc" style={{ color: 'var(--neon-cyan)', fontWeight: 'bold' }}>
                support@quizclub.in
              </p>
            </div>

            <div className="retro-cartridge-card">
              <div className="cartridge-icon-box box-yellow">🕹️</div>
              <h3 className="cartridge-title" style={{ fontSize: '18px' }}>Community</h3>
              <p className="cartridge-desc">
                Join thousands of players sharing question tips and speed-run streaks.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
