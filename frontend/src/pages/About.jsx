import { Link } from 'react-router-dom'
import { ArrowLeft, Target, Users, Zap, Shield, BookOpen, Trophy } from 'lucide-react'
import Navbar from '../components/Navbar'
import RetroMarquee from '../components/RetroMarquee'
import soundFx from '../lib/soundFx'

export default function About() {
  return (
    <div className="landing-page-root">
      <RetroMarquee />
      <Navbar />

      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '50px 24px 80px' }}>
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
          <span>👾</span>
          <span>THE STORY OF QUIZCLUB ARCADE</span>
        </div>

        <h1 className="section-retro-title" style={{ fontSize: '42px', marginBottom: '16px' }}>
          ABOUT THE ARCADE
        </h1>
        <p style={{ fontSize: '17px', color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '40px' }}>
          <strong>QuizClub Arcade</strong> (www.quizclub.in) is an interactive, gamified learning and assessment platform built for developers, students, and lifelong learners. We blend 80s/90s coin-op arcade nostalgia with rigorous computer science, mathematics, science, and language curriculum.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '48px' }}>
          <div className="retro-cartridge-card">
            <div className="cartridge-icon-box box-pink">🎯</div>
            <h3 className="cartridge-title" style={{ fontSize: '20px' }}>Our Mission</h3>
            <p className="cartridge-desc">
              Make technical preparation and domain mastery thrilling, accessible, and structured through balanced, speed-timed MCQs and instant 8-bit feedback.
            </p>
          </div>

          <div className="retro-cartridge-card">
            <div className="cartridge-icon-box box-cyan">⚡</div>
            <h3 className="cartridge-title" style={{ fontSize: '20px' }}>Balanced Design</h3>
            <p className="cartridge-desc">
              Every single quiz session serves 20 questions carefully distributed across difficulty tiers with randomized, deterministic option balancing.
            </p>
          </div>

          <div className="retro-cartridge-card">
            <div className="cartridge-icon-box box-yellow">🏆</div>
            <h3 className="cartridge-title" style={{ fontSize: '20px' }}>Arcade High Scores</h3>
            <p className="cartridge-desc">
              Level up your player profile, maintain daily streak multipliers, earn arcade coins, and compete for crowns on the global leaderboard.
            </p>
          </div>
        </div>

        <div style={{ background: '#000', border: '3px solid #000', borderRadius: 'var(--radius-xl)', padding: '32px', boxShadow: '6px 6px 0px #000' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 'bold', color: 'var(--neon-yellow)', marginBottom: '12px' }}>
            Built With Cutting-Edge Web Standards
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.7' }}>
            Engineered with React 19, Vite, Web Audio API synthesis for zero-dependency sound effects, CSS neo-brutalism design tokens, and modular question data architecture.
          </p>
        </div>
      </main>
    </div>
  )
}
