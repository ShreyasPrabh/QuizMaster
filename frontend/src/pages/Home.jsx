import { Link, useNavigate } from 'react-router-dom'
import { Flame, Target, TrendingUp, Trophy, ArrowRight, BookOpen, CheckCircle, Sparkles } from 'lucide-react'
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
          <Link to="/topics">Topics</Link>
          <a href="#how-it-works">How It Works</a>
          <a href="#pricing">Pricing</a>
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
            <Link to="/topics" className="landing-btn-hero-secondary">
              Explore Topics
            </Link>
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
              {/* Mini SVG Trend Line */}
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

      {/* QUICK FEATURES STRIP */}
      <section className="landing-features-strip" id="features">
        <div className="feature-strip-item">
          <div className="feature-icon bg-indigo">🎯</div>
          <div>
            <h3>Curated Challenges</h3>
            <p>From beginner fundamentals to advanced programming & math.</p>
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
      </section>
    </div>
  )
}
