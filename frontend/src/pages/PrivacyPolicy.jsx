import { Link } from 'react-router-dom'
import { ArrowLeft, Shield } from 'lucide-react'
import Navbar from '../components/Navbar'
import RetroMarquee from '../components/RetroMarquee'
import soundFx from '../lib/soundFx'

export default function PrivacyPolicy() {
  return (
    <div className="landing-page-root">
      <RetroMarquee />
      <Navbar />

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '50px 24px 80px' }}>
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
          <span>🛡️</span>
          <span>DATA PROTECTION PROTOCOLS</span>
        </div>

        <h1 className="section-retro-title" style={{ fontSize: '38px', marginBottom: '16px' }}>
          PRIVACY POLICY
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginBottom: '32px' }}>
          Last updated: 2026 • QuizClub Arcade (www.quizclub.in)
        </p>

        <div style={{ background: '#000', border: '3px solid #000', borderRadius: 'var(--radius-xl)', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--neon-yellow)', marginBottom: '8px' }}>
              1. Information We Collect
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
              When you play QuizClub Arcade as a guest or registered player, we store your quiz performance, accuracy, streak, and preferences locally in your browser and sync securely if logged in.
            </p>
          </div>

          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--neon-cyan)', marginBottom: '8px' }}>
              2. How Information is Used
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
              Your quiz scores are used strictly to provide personal learning analytics, calculate difficulty tiers, and display arcade leaderboard rankings. We never sell your personal data.
            </p>
          </div>

          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--neon-green)', marginBottom: '8px' }}>
              3. Local Storage &amp; Cookies
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
              We use standard browser localStorage to keep track of your active theme, CRT filter toggle, sound preferences, and high score records even when offline.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
