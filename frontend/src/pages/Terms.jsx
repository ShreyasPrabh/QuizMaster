import { Link } from 'react-router-dom'
import { ArrowLeft, FileText } from 'lucide-react'

export default function Terms() {
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
          <Link to="/contact">Contact</Link>
        </nav>

        <div className="landing-nav-actions">
          <Link to="/login" className="landing-btn-ghost">Log in</Link>
          <Link to="/signup" className="landing-btn-primary">Sign up</Link>
        </div>
      </header>

      {/* CONTENT */}
      <main style={{ maxWidth: '850px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', textDecoration: 'none', marginBottom: '2rem', fontSize: '0.9rem', fontWeight: '600' }}>
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
            <FileText size={22} />
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            Terms of Service
          </h1>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2.5rem' }}>
          Effective Date: August 31, 2026 · Official platform: www.quizclub.in
        </p>

        <div className="qm-card" style={{ padding: '2.5rem', lineHeight: '1.8', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '0', marginBottom: '0.75rem' }}>
            1. Acceptance of Terms
          </h2>
          <p style={{ marginBottom: '1.5rem' }}>
            By creating an account or accessing QuizClub (www.quizclub.in), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, please discontinue use of the platform.
          </p>

          <h2 style={{ fontSize: '1.3rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.75rem' }}>
            2. User Accounts & Integrity
          </h2>
          <p style={{ marginBottom: '1.5rem' }}>
            Users are responsible for safeguarding their login credentials. Any automated botting, artificial leaderboard score inflation, or unauthorized tampering with quiz submission endpoints is strictly prohibited.
          </p>

          <h2 style={{ fontSize: '1.3rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.75rem' }}>
            3. Intellectual Property
          </h2>
          <p style={{ marginBottom: '1.5rem' }}>
            All original questions, software design, graphics, and curriculum content on www.quizclub.in are the exclusive property of QuizClub and protected by international intellectual property laws.
          </p>

          <h2 style={{ fontSize: '1.3rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.75rem' }}>
            4. Disclaimer of Warranty
          </h2>
          <p style={{ marginBottom: '1.5rem' }}>
            QuizClub is provided "as is" for educational, assessment, and training purposes. While we strive for rigorous correctness in our questions and explanations, we make no express warranties of uninterrupted service or absolute question infallibility.
          </p>

          <h2 style={{ fontSize: '1.3rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.75rem' }}>
            5. Modifications to Service
          </h2>
          <p>
            QuizClub reserves the right to modify or discontinue features, categories, and scoring algorithms at any time. Inquiries may be directed to <a href="mailto:support@quizclub.in" style={{ color: 'var(--primary)', fontWeight: '600' }}>support@quizclub.in</a>.
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
