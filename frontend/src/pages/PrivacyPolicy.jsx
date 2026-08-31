import { Link } from 'react-router-dom'
import { ArrowLeft, Shield } from 'lucide-react'

export default function PrivacyPolicy() {
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
          <Link to="/contact">Contact</Link>
        </nav>

        <div className="landing-nav-actions">
          <Link to="/login" className="landing-btn-ghost">Log in</Link>
          <Link to="/signup" className="landing-btn-primary">Sign up</Link>
        </div>
      </header>

      {/* CONTENT */}
      <main style={{ maxWidth: '850px', margin: '0 auto', padding: '3.5rem 2rem 5rem' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', textDecoration: 'none', marginBottom: '2rem', fontSize: '0.9rem', fontWeight: '600' }}>
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '1rem' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366F1' }}>
            <Shield size={24} />
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#0F172A', letterSpacing: '-0.02em' }}>
            Privacy Policy
          </h1>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2.5rem' }}>
          Last Updated: August 31, 2026 · Official website: www.quizclub.in
        </p>

        <div className="qm-card" style={{ padding: '2.5rem', lineHeight: '1.8', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#0F172A', marginTop: '0', marginBottom: '0.75rem' }}>
            1. Information We Collect
          </h2>
          <p style={{ marginBottom: '1.5rem' }}>
            When you create an account on QuizClub (www.quizclub.in), we collect your name, email address, password hash, profile avatar, and preferred learning topics. We also store your quiz scores, session times, and streak metrics to provide your personal learning analytics.
          </p>

          <h2 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#0F172A', marginBottom: '0.75rem' }}>
            2. How We Use Your Information
          </h2>
          <p style={{ marginBottom: '1.5rem' }}>
            We use your data solely to:
          </p>
          <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
            <li>Provide personalized quiz sessions and study recommendations.</li>
            <li>Maintain global leaderboard rankings and streaks.</li>
            <li>Protect your account security and authenticate your session via secure JWT tokens.</li>
            <li>Deliver platform analytics and performance improvements.</li>
          </ul>

          <h2 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#0F172A', marginBottom: '0.75rem' }}>
            3. Data Storage & Security
          </h2>
          <p style={{ marginBottom: '1.5rem' }}>
            Your account credentials are encrypted with industry-standard hashing algorithms (PBKDF2 SHA-256). All communications with www.quizclub.in are secured with TLS/SSL encryption. We do not sell or monetize your personal data.
          </p>

          <h2 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#0F172A', marginBottom: '0.75rem' }}>
            4. Cookies & Analytics
          </h2>
          <p style={{ marginBottom: '1.5rem' }}>
            We use essential local storage tokens for user authentication and privacy-friendly Vercel Web Analytics to track platform performance and usage metrics without third-party ad trackers.
          </p>

          <h2 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#0F172A', marginBottom: '0.75rem' }}>
            5. Contact Us
          </h2>
          <p>
            If you have questions regarding this Privacy Policy or wish to request data deletion, please contact us at <a href="mailto:support@quizclub.in" style={{ color: '#6366F1', fontWeight: '600' }}>support@quizclub.in</a>.
          </p>
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
