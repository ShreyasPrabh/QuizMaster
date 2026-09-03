import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react'
import Navbar from '../components/Navbar'
import RetroMarquee from '../components/RetroMarquee'
import soundFx from '../lib/soundFx'

const FAQ_ITEMS = [
  {
    q: 'What is QuizClub Arcade?',
    a: 'QuizClub Arcade is a colorful, retro-themed assessment and speed-running platform featuring over 60 subtopics and 1,200+ MCQs across Programming, Math, Science, Computer Science, GK, and English.',
  },
  {
    q: 'Can I access the arcade without logging in?',
    a: 'No, access to the quiz arcade is strictly through authenticated login only. Creating an account is free and ensures your high scores, XP progression, and daily streaks are permanently recorded.',
  },
  {
    q: 'How does the 8-bit sound engine work?',
    a: 'All arcade sounds (coins, correct chimes, buzzers, and stage clear fanfares) are generated entirely in real-time using the browser\'s Web Audio API. It requires zero external audio files and can be toggled on/off anytime.',
  },
  {
    q: 'What is the CRT Monitor Filter?',
    a: 'It simulates authentic 80s arcade monitor phosphors, subtle scanlines, and vignette edges. You can toggle it on or off from the top navigation bar or settings.',
  },
  {
    q: 'How does scoring and the streak multiplier work?',
    a: 'Each correct answer awards 100 base points plus a speed timer bonus. Answering questions consecutively activates the COMBO Multiplier (up to 3x points!), and completing runs earns arcade coins.',
  },
  {
    q: 'Are all 60+ topics and questions balanced?',
    a: 'Yes. Answers are deterministically balanced across choices A, B, C, and D, with detailed technical explanations provided for every single question.',
  },
]

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(0)

  const toggle = (i) => {
    soundFx.playSelect()
    setOpenIdx(openIdx === i ? -1 : i)
  }

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
          <span>❓</span>
          <span>ARCADE MANUAL &amp; FAQ</span>
        </div>

        <h1 className="section-retro-title" style={{ fontSize: '42px', marginBottom: '16px' }}>
          FREQUENTLY ASKED QUESTIONS
        </h1>
        <p style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '36px' }}>
          Everything you need to know about coin rewards, difficulty tiers, and gameplay mechanics.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIdx === idx
            return (
              <div
                key={idx}
                style={{
                  background: 'var(--bg-card)',
                  border: '3px solid #000',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: isOpen ? '5px 5px 0px var(--neon-cyan)' : '4px 4px 0px #000',
                  overflow: 'hidden',
                  transition: 'all 0.15s ease',
                }}
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  style={{
                    width: '100%',
                    padding: '18px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'none',
                    border: 'none',
                    color: '#fff',
                    fontFamily: 'var(--font-display)',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span style={{ color: isOpen ? 'var(--neon-yellow)' : '#fff' }}>{item.q}</span>
                  {isOpen ? <ChevronUp size={20} color="var(--neon-yellow)" /> : <ChevronDown size={20} color="#666" />}
                </button>

                {isOpen && (
                  <div style={{ padding: '0 24px 20px', color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.6', borderTop: '1px dashed #333', paddingTop: '14px' }}>
                    {item.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
