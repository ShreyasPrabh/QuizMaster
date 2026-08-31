import { Link } from 'react-router-dom'
import { ArrowLeft, Target, Users, Zap, Shield, BookOpen, Trophy } from 'lucide-react'

export default function About() {
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
          <Link to="/about" className="active">About</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/contact">Contact</Link>
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

        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
          About QuizClub
        </h1>
        <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '3rem' }}>
          QuizClub (www.quizclub.in) is an interactive, gamified learning and assessment platform built for developers, students, and lifelong learners. We transform technical knowledge acquisition into engaging, bite-sized daily quiz challenges.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '3.5rem' }}>
          <div className="qm-card" style={{ padding: '1.75rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: '1rem' }}>
              <Target size={22} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Our Mission</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.6' }}>
              To make technical learning and interview preparation accessible, structured, and genuinely engaging through balanced, curriculum-aligned MCQs.
            </p>
          </div>

          <div className="qm-card" style={{ padding: '1.75rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--emerald-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--emerald)', marginBottom: '1rem' }}>
              <Zap size={22} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Active Practice</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.6' }}>
              Active recall and spaced repetition are the most effective ways to retain concepts. QuizClub turns theory into 20-question practice modules.
            </p>
          </div>

          <div className="qm-card" style={{ padding: '1.75rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--amber-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--amber)', marginBottom: '1rem' }}>
              <Trophy size={22} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Competitive Growth</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.6' }}>
              Climb the global leaderboard, maintain daily practice streaks, and track real-time accuracy across multiple subject domains.
            </p>
          </div>
        </div>

        <div className="qm-card" style={{ padding: '2.5rem', background: 'var(--primary-light)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--text-main)' }}>The QuizClub Ecosystem</h2>
          <ul style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '0.95rem', paddingLeft: '1.25rem' }}>
            <li><strong>6 Core Domains:</strong> Programming, Computer Science, Mathematics, Science, General Knowledge, and English.</li>
            <li><strong>60 Comprehensive Subtopics:</strong> Ranging from Java, Python, and DSA to Calculus and Physics.</li>
            <li><strong>3 Skill Tiers:</strong> Easy, Medium, and Hard difficulty levels for progressive mastery.</li>
            <li><strong>Zero Guesswork Engine:</strong> Balanced 25% answer distribution algorithm across all options.</li>
          </ul>
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
