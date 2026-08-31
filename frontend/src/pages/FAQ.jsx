import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react'

const FAQ_ITEMS = [
  {
    q: 'What is QuizClub (www.quizclub.in)?',
    a: 'QuizClub is an interactive learning platform featuring thousands of curriculum-structured MCQs across Programming, Computer Science, Mathematics, Science, General Knowledge, and English.',
  },
  {
    q: 'How does the scoring and leaderboard work?',
    a: 'You earn 10 points for every correct answer, 2 points for attempting a question, and 25 bonus points for completing a 20-question quiz module. Your streak increments daily when you complete at least one quiz.',
  },
  {
    q: 'Is QuizClub free to use?',
    a: 'Yes! All learning modules, difficulty tiers, analytics, and leaderboard competitions are completely free for all registered users.',
  },
  {
    q: 'How are the questions generated and balanced?',
    a: 'Our questions are curated by domain and distributed using a deterministic balancing algorithm ensuring equal distribution (25%) across answer options (A, B, C, D) with in-depth technical explanations for every question.',
  },
  {
    q: 'Can I change my profile avatar and name?',
    a: 'Yes. Visit your Profile page to customize your display name, choose from a collection of unique emojis avatars, update your bio, and select your preferred study topics.',
  },
  {
    q: 'Why is my email address locked in the Profile?',
    a: 'Email addresses are permanently bound to your user ID upon signup to protect account security, maintain consistent progress records, and prevent authentication conflicts.',
  },
  {
    q: 'How do learning module completion badges work?',
    a: 'When you submit a quiz, the system records your score and marks that difficulty tier as Completed on your Topics detail page so you can easily track which modules you have mastered.',
  },
]

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(0)

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
          <Link to="/faq" className="active">FAQ</Link>
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
            <HelpCircle size={22} />
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            Frequently Asked Questions
          </h1>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginBottom: '2.5rem' }}>
          Everything you need to know about QuizClub, practice quizzes, scoring, and account management.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIdx === idx
            return (
              <div
                key={idx}
                className="qm-card"
                style={{
                  padding: '1.25rem 1.5rem',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s',
                }}
                onClick={() => setOpenIdx(isOpen ? -1 : idx)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
                    {item.q}
                  </h3>
                  <div style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center' }}>
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>

                {isOpen && (
                  <p style={{ marginTop: '0.85rem', color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                    {item.a}
                  </p>
                )}
              </div>
            )
          })}
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
