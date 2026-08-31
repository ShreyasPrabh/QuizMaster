import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Mail, MapPin, Send, CheckCircle2 } from 'lucide-react'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setForm({ name: '', email: '', subject: '', message: '' })
    }, 2500)
  }

  return (
    <div className="landing-page-root">
      {/* NAVBAR */}
      <header className="landing-navbar">
        <div className="landing-nav-brand">
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
            <div className="qm-brand-logo">
              <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
                <rect width="28" height="28" rx="8" fill="#6366F1" />
                <path d="M7 14L14 7L21 14L14 21L7 14Z" fill="white" fillOpacity="0.8" />
                <path d="M14 7V21" stroke="#6366F1" strokeWidth="2" />
                <path d="M7 14H21" stroke="#6366F1" strokeWidth="2" />
              </svg>
            </div>
            <span className="landing-brand-name">QuizClub</span>
          </Link>
        </div>

        <nav className="landing-nav-links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/contact" className="active">Contact</Link>
        </nav>

        <div className="landing-nav-actions">
          <Link to="/login" className="landing-btn-ghost">Log in</Link>
          <Link to="/signup" className="landing-btn-primary">Sign up</Link>
        </div>
      </header>

      {/* CONTENT */}
      <main style={{ maxWidth: '960px', margin: '0 auto', padding: '3.5rem 2rem 5rem' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', textDecoration: 'none', marginBottom: '2rem', fontSize: '0.9rem', fontWeight: '600' }}>
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#0F172A', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
          Contact Us
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '3rem' }}>
          Have feedback, question suggestions, or partnership inquiries? We would love to hear from you.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {/* CONTACT INFO */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="qm-card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '0.75rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366F1' }}>
                  <Mail size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0F172A' }}>Email Support</h4>
                  <a href="mailto:support@quizclub.in" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.92rem', fontWeight: '600' }}>
                    support@quizclub.in
                  </a>
                </div>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.5' }}>
                We typically respond within 24 business hours.
              </p>
            </div>

            <div className="qm-card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '0.75rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
                  <MapPin size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0F172A' }}>Official Platform</h4>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>www.quizclub.in</span>
                </div>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.5' }}>
                Global online learning platform accessible 24/7 across desktop, tablet, and mobile.
              </p>
            </div>
          </div>

          {/* CONTACT FORM */}
          <div className="qm-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0F172A', marginBottom: '1.25rem' }}>
              Send us a message
            </h3>

            {submitted ? (
              <div style={{ padding: '1.5rem', background: '#ECFDF5', borderRadius: 'var(--radius-md)', color: '#10B981', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={20} />
                <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>Thank you! Your message has been sent successfully.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="qm-field-box">
                  <label style={{ color: '#0F172A', fontWeight: '600', fontSize: '0.85rem' }}>Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div className="qm-field-box">
                  <label style={{ color: '#0F172A', fontWeight: '600', fontSize: '0.85rem' }}>Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>

                <div className="qm-field-box">
                  <label style={{ color: '#0F172A', fontWeight: '600', fontSize: '0.85rem' }}>Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="Feedback / Inquiry"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  />
                </div>

                <div className="qm-field-box">
                  <label style={{ color: '#0F172A', fontWeight: '600', fontSize: '0.85rem' }}>Message</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="How can we assist you?"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  />
                </div>

                <button type="submit" className="qm-btn-primary-sm" style={{ padding: '0.85rem', justifyContent: 'center', fontSize: '0.95rem' }}>
                  <Send size={16} /> Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="landing-footer">
        <div className="landing-footer-brand">
          <span>⬡ QuizClub</span>
          <span className="landing-footer-tagline">Learn. Quiz. Improve. Repeat. · www.quizclub.in</span>
        </div>
        <div className="landing-footer-links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms">Terms</Link>
        </div>
        <p className="landing-footer-copy">© 2026 QuizClub (www.quizclub.in). All rights reserved.</p>
      </footer>
    </div>
  )
}
