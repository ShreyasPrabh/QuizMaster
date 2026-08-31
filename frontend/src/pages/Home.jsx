import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="landing-page-root">
      {/* NAVBAR */}
      <header className="landing-navbar">
        <div className="landing-nav-brand">
          <div className="qm-brand-logo">
            <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="8" fill="#6366F1" />
              <path d="M7 14L14 7L21 14L14 21L7 14Z" fill="white" fillOpacity="0.8" />
              <path d="M14 7V21" stroke="#6366F1" strokeWidth="2" />
              <path d="M7 14H21" stroke="#6366F1" strokeWidth="2" />
            </svg>
          </div>
          <span className="landing-brand-name">QuizMaster</span>
        </div>

        <nav className="landing-nav-links">
          <a href="#home" className="active">Home</a>
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          {user && <Link to="/topics">Topics</Link>}
        </nav>

        <div className="landing-nav-actions">
          {user ? (
            <Link to="/dashboard" className="landing-btn-primary">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="landing-btn-ghost">
                Log in
              </Link>
              <Link to="/signup" className="landing-btn-primary">
                Sign up
              </Link>
            </>
          )}
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="landing-hero" id="home">
        <div className="landing-hero-left">
          <h1 className="landing-hero-title">
            Learn. Quiz.<br />
            <span className="gradient-purple-text">Improve.</span> <span className="gradient-blue-text">Repeat.</span>
          </h1>
          <p className="landing-hero-desc">
            Challenge yourself with thousands of questions across many topics. Track your progress, beat your streaks and become a quiz master! 🔥
          </p>

          <div className="landing-hero-btns">
            <Link to={user ? "/dashboard" : "/signup"} className="landing-btn-hero-primary">
              Get Started
            </Link>
            <a href="#how-it-works" className="landing-btn-hero-secondary">
              How It Works
            </a>
          </div>
        </div>

        {/* HERO RIGHT ILLUSTRATION WITH FLOATING BADGES */}
        <div className="landing-hero-right">
          <div className="hero-illustration-wrapper">
            {/* FLOATING BADGE: STREAK */}
            <div className="floating-badge streak-badge">
              <div className="badge-icon-fire">🔥</div>
              <div>
                <span className="badge-title">Streak</span>
                <div className="badge-val"><strong>12</strong> days</div>
              </div>
            </div>

            {/* FLOATING BADGE: ACCURACY */}
            <div className="floating-badge accuracy-badge">
              <div className="badge-header-acc">
                <span className="badge-title">Accuracy</span>
                <span className="acc-val">85%</span>
              </div>
              <svg width="100" height="28" viewBox="0 0 100 28" fill="none">
                <path
                  d="M2 22L20 18L38 24L56 12L74 16L98 4"
                  stroke="#6366F1"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Center Trophy & Character Graphic */}
            <div className="hero-center-graphic">
              <div className="hero-trophy-card">
                🏆
              </div>
              <div className="hero-char-illustration">
                <div className="char-badge-check">✓</div>
                <div className="char-emoji-visual">🧑‍🎓</div>
                <div className="char-tablet-graphic">📱</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES STRIP */}
      <section className="landing-features-strip" id="features">
        <div className="feature-strip-item">
          <div className="feature-icon bg-indigo">🎯</div>
          <div>
            <h3>Curated Challenges</h3>
            <p>From beginner fundamentals to advanced programming &amp; math.</p>
          </div>
        </div>
        <div className="feature-strip-item">
          <div className="feature-icon bg-amber">⚡</div>
          <div>
            <h3>Instant Feedback</h3>
            <p>Immediate answer validation with clear, concise explanations.</p>
          </div>
        </div>
        <div className="feature-strip-item">
          <div className="feature-icon bg-emerald">📊</div>
          <div>
            <h3>Deep Analytics</h3>
            <p>Monitor your accuracy, streak milestones, and category mastery.</p>
          </div>
        </div>
        <div className="feature-strip-item">
          <div className="feature-icon bg-purple">🏆</div>
          <div>
            <h3>Leaderboards</h3>
            <p>Compete with peers and climb global topic rankings.</p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="landing-how-section" id="how-it-works">
        <div className="landing-section-header">
          <h2>How It Works</h2>
          <p>Get started in three simple steps</p>
        </div>
        <div className="landing-steps-grid">
          <div className="landing-step-card">
            <div className="step-number">1</div>
            <div className="step-icon">📝</div>
            <h3>Create an Account</h3>
            <p>Sign up for free in seconds. Choose your preferred topics and set your learning goals.</p>
          </div>
          <div className="landing-step-card">
            <div className="step-number">2</div>
            <div className="step-icon">🎯</div>
            <h3>Pick a Topic & Module</h3>
            <p>Browse 60+ subtopics across 6 domains. Select a difficulty — Easy, Medium, or Hard.</p>
          </div>
          <div className="landing-step-card">
            <div className="step-number">3</div>
            <div className="step-icon">📈</div>
            <h3>Practice & Track Progress</h3>
            <p>Answer 20 MCQs per module, get instant results, and watch your accuracy climb daily.</p>
          </div>
        </div>
      </section>


      {/* FOOTER CTA */}
      <section className="landing-footer-cta">
        <h2>Ready to become a QuizMaster?</h2>
        <p>Join thousands of learners improving their skills every day.</p>
        <Link to={user ? "/dashboard" : "/signup"} className="landing-btn-hero-primary">
          {user ? 'Go to Dashboard' : 'Sign up for Free'} <ArrowRight size={18} />
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer">
        <div className="landing-footer-brand">
          <span>⬡ QuizMaster</span>
          <span className="landing-footer-tagline">Learn. Quiz. Improve. Repeat.</span>
        </div>
        <div className="landing-footer-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
        </div>
        <p className="landing-footer-copy">© 2026 QuizMaster. All rights reserved.</p>
      </footer>
    </div>
  )
}
