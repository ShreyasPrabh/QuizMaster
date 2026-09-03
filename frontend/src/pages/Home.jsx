import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Zap, Trophy, Play, CheckCircle2, Flame, Award, Layers, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import RetroMarquee from '../components/RetroMarquee'
import RetroIcon from '../components/RetroIcon'
import soundFx from '../lib/soundFx'

const SAMPLE_DEMO_QUESTIONS = [
  {
    topic: 'Python 🐍',
    q: 'What is the output of print(2 ** 4)?',
    choices: [
      { id: 'A', text: '8', correct: false },
      { id: 'B', text: '16', correct: true },
      { id: 'C', text: '64', correct: false },
      { id: 'D', text: '32', correct: false },
    ],
    exp: 'In Python, ** is the exponentiation operator. 2 raised to 4 = 16.',
  },
  {
    topic: 'JavaScript 🟨',
    q: 'Which keyword declares a block-scoped reassignable variable?',
    choices: [
      { id: 'A', text: 'var', correct: false },
      { id: 'B', text: 'const', correct: false },
      { id: 'C', text: 'let', correct: true },
      { id: 'D', text: 'static', correct: false },
    ],
    exp: 'let declared variables have block scope and can be reassigned.',
  },
]

export default function Home() {
  const { user, guestSignIn } = useAuth()
  const navigate = useNavigate()

  // Interactive demo cabinet on hero
  const [demoIndex, setDemoIndex] = useState(0)
  const [selectedDemoChoice, setSelectedDemoChoice] = useState(null)
  const [demoScore, setDemoScore] = useState(100)
  const [demoStreak, setDemoStreak] = useState(1)

  const currentDemo = SAMPLE_DEMO_QUESTIONS[demoIndex]

  const handleDemoChoice = (choice) => {
    if (selectedDemoChoice) return
    setSelectedDemoChoice(choice)
    if (choice.correct) {
      soundFx.playCorrect()
      setDemoScore((prev) => prev + 100 * demoStreak)
      setDemoStreak((prev) => prev + 1)
    } else {
      soundFx.playWrong()
      setDemoStreak(1)
    }

    setTimeout(() => {
      setSelectedDemoChoice(null)
      setDemoIndex((prev) => (prev + 1) % SAMPLE_DEMO_QUESTIONS.length)
    }, 1800)
  }

  const handleStartGame = () => {
    soundFx.playCoin()
    if (!user) {
      navigate('/login')
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div className="landing-page-root">
      {/* RETRO MARQUEE */}
      <RetroMarquee />

      {/* NAVBAR */}
      <Navbar />

      {/* HERO SECTION */}
      <section className="landing-hero" id="home">
        <div className="landing-hero-left">
          <div className="hero-tag-badge">
            <span>👾</span>
            <span>COLORFUL RETRO ARCADE EXPERIENCE</span>
          </div>

          <h1 className="landing-hero-title">
            LEVEL UP.<br />
            <span className="retro-gradient-pink">QUIZ HARD.</span><br />
            <span className="retro-gradient-cyan">BREAK HIGH SCORES.</span>
          </h1>

          <p className="landing-hero-desc">
            Revisit the golden age of arcade gaming with <strong>QuizClub</strong>!
            Conquer 60+ subtopics across Programming, Math, Science &amp; more.
            Log in to save your runs, earn arcade coins, and immortalize your tag on the global leaderboard.
          </p>

          <div className="landing-hero-btns">
            {user ? (
              <Link to="/dashboard" className="btn-retro-primary">
                <Play size={14} fill="#fff" />
                <span>ENTER DASHBOARD</span>
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn-retro-primary">
                  <Play size={14} fill="#fff" />
                  <span>LOG IN TO PLAY</span>
                </Link>
                <Link to="/signup" className="btn-retro-secondary">
                  <span>CREATE ACCOUNT</span>
                </Link>
              </>
            )}
          </div>

          <div style={{ display: 'flex', gap: '24px', marginTop: '36px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '24px' }}>🔒</span>
              <div>
                <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '11px', color: 'var(--neon-yellow)' }}>LOGIN REQUIRED</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Secure Authenticated Runs</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '24px' }}>🕹️</span>
              <div>
                <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '11px', color: 'var(--neon-cyan)' }}>60+ TOPICS</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Easy, Med, Hard</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '24px' }}>🔥</span>
              <div>
                <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '11px', color: 'var(--neon-pink)' }}>STREAK MULTIPLIER</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Earn x2 &amp; x3 Bonuses</div>
              </div>
            </div>
          </div>
        </div>

        {/* HERO RIGHT: INTERACTIVE MINI-CABINET */}
        <div className="landing-hero-right">
          <div className="hero-cabinet-wrapper">
            <div className="cabinet-header">
              <div className="cabinet-lights">
                <div className="light-dot light-red" />
                <div className="light-dot light-yellow" />
                <div className="light-dot light-green" />
              </div>
              <div className="cabinet-marquee-title">🕹️ RETRO TEST CABINET</div>
              <div style={{ color: 'var(--neon-yellow)' }}>1UP</div>
            </div>

            <div className="hero-mini-quiz-card">
              <div className="hero-quiz-hud">
                <span>{currentDemo.topic}</span>
                <span>SCORE: {demoScore}</span>
                <span>🔥 {demoStreak}x COMBO</span>
              </div>

              <div className="hero-quiz-q">{currentDemo.q}</div>

              <div className="hero-quiz-choices">
                {currentDemo.choices.map((c) => {
                  let statusClass = ''
                  if (selectedDemoChoice) {
                    if (c.correct) statusClass = 'correct'
                    else if (selectedDemoChoice.id === c.id) statusClass = 'wrong'
                  }
                  return (
                    <button
                      key={c.id}
                      className={`mini-choice-btn ${statusClass}`}
                      onClick={() => handleDemoChoice(c)}
                      disabled={Boolean(selectedDemoChoice)}
                    >
                      <span className="mini-choice-badge">{c.id}</span>
                      <span>{c.text}</span>
                    </button>
                  )
                })}
              </div>

              {selectedDemoChoice && (
                <div
                  style={{
                    marginTop: '12px',
                    fontSize: '12px',
                    padding: '8px 12px',
                    background: '#000',
                    border: '1px solid var(--neon-yellow)',
                    borderRadius: '4px',
                    color: 'var(--neon-yellow)',
                    fontFamily: 'var(--font-pixel)',
                    fontSize: '9px',
                    lineHeight: '1.4',
                  }}
                >
                  {selectedDemoChoice.correct ? '🎉 EXCELLENT! ' : '⚡ WHOOPS! '}
                  {currentDemo.exp}
                </div>
              )}
            </div>

            <div className="hero-floating-badges">
              <div className="hero-stat-badge">
                <div className="hero-stat-lbl">DIFFICULTIES</div>
                <div className="hero-stat-val">3 TIERS</div>
              </div>
              <div className="hero-stat-badge">
                <div className="hero-stat-lbl">MCQS / RUN</div>
                <div className="hero-stat-val">20 QUESTIONS</div>
              </div>
              <div className="hero-stat-badge">
                <div className="hero-stat-lbl">AUDIO SYNTH</div>
                <div className="hero-stat-val">8-BIT CHIP</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RETRO CARTRIDGE FEATURES */}
      <section className="landing-features-section" id="features">
        <div className="section-retro-header">
          <div className="section-tag">⭐ ARCADE ARSENAL ⭐</div>
          <h2 className="section-retro-title">RETRO GAME CARTRIDGES</h2>
        </div>

        <div className="retro-cartridge-grid">
          <div className="retro-cartridge-card">
            <div style={{ marginBottom: '18px' }}>
              <RetroIcon category="Programming" size="lg" />
            </div>
            <h3 className="cartridge-title">Programming &amp; CS</h3>
            <p className="cartridge-desc">
              Master Python, Java, C++, JavaScript, Data Structures, Operating Systems, Networks, and Databases.
            </p>
          </div>

          <div className="retro-cartridge-card">
            <div style={{ marginBottom: '18px' }}>
              <RetroIcon category="Mathematics" size="lg" />
            </div>
            <h3 className="cartridge-title">Mathematics &amp; Logic</h3>
            <p className="cartridge-desc">
              Tackle Calculus, Linear Algebra, Probability, Statistics, Trigonometry, and Number Theory.
            </p>
          </div>

          <div className="retro-cartridge-card">
            <div style={{ marginBottom: '18px' }}>
              <RetroIcon category="Science" size="lg" />
            </div>
            <h3 className="cartridge-title">Science &amp; Physics</h3>
            <p className="cartridge-desc">
              Explore Quantum Mechanics, Chemistry reactions, Biology ecosystems, and Astronomy mysteries.
            </p>
          </div>

          <div className="retro-cartridge-card">
            <div style={{ marginBottom: '18px' }}>
              <RetroIcon category="General Knowledge" size="lg" />
            </div>
            <h3 className="cartridge-title">General Knowledge</h3>
            <p className="cartridge-desc">
              Test your mastery on World History, Geography, Global Economics, Inventions, and Pop Culture.
            </p>
          </div>

          <div className="retro-cartridge-card">
            <div style={{ marginBottom: '18px' }}>
              <RetroIcon category="English" size="lg" />
            </div>
            <h3 className="cartridge-title">English &amp; Vocab</h3>
            <p className="cartridge-desc">
              Sharpen grammar, vocabulary, idioms, reading comprehension, and rhetoric techniques.
            </p>
          </div>

          <div className="retro-cartridge-card">
            <div style={{ marginBottom: '18px' }}>
              <RetroIcon topicId="algorithms" size="lg" />
            </div>
            <h3 className="cartridge-title">Instant Evaluation</h3>
            <p className="cartridge-desc">
              Real-time answer reveals, 8-bit sound effects, detailed explanations, and question review matrix.
            </p>
          </div>
        </div>
      </section>

      {/* HOW TO PLAY IN 3 STEPS */}
      <section className="landing-steps-section" id="how-it-works">
        <div className="section-retro-header">
          <div className="section-tag">🕹️ HOW TO PLAY 🕹️</div>
          <h2 className="section-retro-title">THREE STEPS TO RETRO GLORY</h2>
        </div>

        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number-tag">STEP 01</div>
            <div style={{ marginTop: '12px', marginBottom: '14px' }}>
              <RetroIcon topicId="dsa" size="lg" />
            </div>
            <h3>SELECT A TOPIC</h3>
            <p>Choose from 6 domains and 60+ specialized subtopics with curated modules.</p>
          </div>

          <div className="step-card">
            <div className="step-number-tag">STEP 02</div>
            <div style={{ marginTop: '12px', marginBottom: '14px' }}>
              <RetroIcon topicId="algorithms" size="lg" />
            </div>
            <h3>ANSWER 20 MCQS</h3>
            <p>Beat the timer, maintain your combo streak multiplier, and earn bonus arcade coins.</p>
          </div>

          <div className="step-card">
            <div className="step-number-tag">STEP 03</div>
            <div style={{ marginTop: '12px', marginBottom: '14px' }}>
              <RetroIcon topicId="worldhistory" size="lg" />
            </div>
            <h3>CLIMB HIGH SCORES</h3>
            <p>Achieve S-Rank grades, unlock retro pixel achievements, and claim your crown.</p>
          </div>
        </div>
      </section>

      {/* RETRO HIGH SCORES HALL OF FAME TEASER */}
      <section className="landing-highscores-teaser">
        <div className="highscore-header">
          <div className="highscore-title">
            <span>🏆</span>
            <span>HIGH SCORES // HALL OF FAME</span>
          </div>
          <Link to="/leaderboard" className="btn-retro-yellow" style={{ padding: '6px 12px', fontSize: '9px' }}>
            VIEW FULL BOARD →
          </Link>
        </div>

        <table className="highscore-table">
          <thead>
            <tr>
              <th>RANK</th>
              <th>PLAYER TAG</th>
              <th>FAV TOPIC</th>
              <th>STREAK</th>
              <th>HIGH SCORE</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="rank-gold">👑 1ST</td>
              <td>RETRO_NINJA_99</td>
              <td>Python Fundamentals</td>
              <td>18 🔥</td>
              <td className="rank-gold">99,850 PTS</td>
            </tr>
            <tr>
              <td className="rank-silver">🥈 2ND</td>
              <td>CYBER_ARCHITECT</td>
              <td>Algorithms &amp; Graphs</td>
              <td>14 🔥</td>
              <td className="rank-silver">94,200 PTS</td>
            </tr>
            <tr>
              <td className="rank-bronze">🥉 3RD</td>
              <td>PIXEL_VALKYRIE</td>
              <td>Quantum Physics</td>
              <td>11 🔥</td>
              <td className="rank-bronze">88,750 PTS</td>
            </tr>
            <tr>
              <td>4TH</td>
              <td>SYNTH_HACKER</td>
              <td>JavaScript ES6</td>
              <td>9 🔥</td>
              <td>82,100 PTS</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* BIG CTA BANNER */}
      <section className="landing-cta-banner">
        <h2>READY TO BEAT THE CLOCK?</h2>
        <p>Log in or create your player account today to record scores and compete on global leaderboards.</p>
        <button onClick={handleStartGame} className="btn-retro-yellow" style={{ fontSize: '13px', padding: '16px 32px' }}>
          <Play size={16} fill="#000" />
          <span>{user ? 'ENTER DASHBOARD' : 'LOG IN TO PLAY NOW'}</span>
        </button>
      </section>

      {/* RETRO FOOTER */}
      <footer className="landing-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/logo.svg" alt="QuizClub Logo" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 'bold' }}>QuizClub</span>
          <span className="arcade-tag-chip">ARCADE</span>
        </div>

        <div className="landing-footer-links">
          <Link to="/">Home</Link>
          <Link to="/topics">Topics</Link>
          <Link to="/leaderboard">Leaderboard</Link>
          <Link to="/about">About</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms">Terms</Link>
        </div>

        <p className="landing-footer-copy">
          © 2026 QuizClub Arcade (www.quizclub.in) • Recreated with colorful retro arcade design.
        </p>
      </footer>
    </div>
  )
}
