import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Mail, MapPin, Send, CheckCircle2, MessageSquare } from 'lucide-react'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setForm({ name: '', email: '', subject: '', message: '' })
    }, 2000)
  }

  return (
    <div className="landing-container">
      {/* HEADER */}
      <header className="landing-header">
        <div className="landing-brand">
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <div className="landing-brand-icon">
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
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', textDecoration: 'none', marginBottom: '2rem', fontSize: '0.9rem', fontWeight: '600' }}>
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
          Contact Us
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '3rem' }}>
          Have feedback, question suggestions, or partnership inquiries? We would love to hear from you.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {/* CONTACT INFO */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="qm-card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.75rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                  <Mail size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-main)' }}>Email Support</h4>
                  <a href="mailto:support@quizclub.in" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600' }}>
                    support@quizclub.in
                  </a>
                </div>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>We typically respond within 24 business hours.</p>
            </div>

            <div className="qm-card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.75rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--emerald-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--emerald)' }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-main)' }}>Official Website</h4>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>www.quizclub.in</span>
                </div>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Global online learning platform accessible 24/7.</p>
            </div>
          </div>

          {/* CONTACT FORM */}
          <div className="qm-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '1.25rem' }}>
              Send us a message
            </h3>

            {submitted ? (
              <div style={{ padding: '1.5rem', background: 'var(--emerald-light)', borderRadius: 'var(--radius-md)', color: 'var(--emerald)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={20} />
                <span>Thank you! Your message has been sent successfully.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="qm-field-box">
                  <label>Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div className="qm-field-box">
                  <label>Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>

                <div className="qm-field-box">
                  <label>Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="Question suggestion / Feedback"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  />
                </div>

                <div className="qm-field-box">
                  <label>Message</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="How can we help you?"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  />
                </div>

                <button type="submit" className="qm-btn-primary-sm" style={{ padding: '0.85rem', justifyContent: 'center' }}>
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
