import { Link } from 'react-router-dom'
import { ArrowLeft, FileText } from 'lucide-react'
import Navbar from '../components/Navbar'
import RetroMarquee from '../components/RetroMarquee'
import soundFx from '../lib/soundFx'

export default function Terms() {
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
          <span>📜</span>
          <span>ARCADE RULES &amp; CONDITIONS</span>
        </div>

        <h1 className="section-retro-title" style={{ fontSize: '38px', marginBottom: '16px' }}>
          TERMS OF SERVICE
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginBottom: '32px' }}>
          Last updated: 2026 • QuizClub Arcade (www.quizclub.in)
        </p>

        <div style={{ background: '#000', border: '3px solid #000', borderRadius: 'var(--radius-xl)', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--neon-yellow)', marginBottom: '8px' }}>
              1. Arcade Fair Play
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
              QuizClub is designed for personal learning and fair competition. Using automated bot scripts to artificially manipulate leaderboard rankings or speed timers is prohibited.
            </p>
          </div>

          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--neon-cyan)', marginBottom: '8px' }}>
              2. Free Educational Access
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
              All quiz modules, difficulty tiers, learning syllabi, and practice questions are provided free of charge for personal educational enrichment.
            </p>
          </div>

          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--neon-pink)', marginBottom: '8px' }}>
              3. Intellectual Property
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
              All original quiz question explanations, interactive algorithms, and retro design assets are copyright © 2026 QuizClub Arcade under MIT license terms.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
