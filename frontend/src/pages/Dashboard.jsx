import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Flame,
  HelpCircle,
  CheckCircle2,
  Trophy,
  ChevronRight,
  Play,
  ArrowRight,
  Layers,
  BookOpen,
  Plus,
  Zap,
  Coins,
  Award,
  Sparkles,
  RotateCcw
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getUserStats, getQuizHistory, RETRO_ACHIEVEMENTS } from '../lib/userStats'
import { TOPIC_MODULES } from '../data/topicModules'
import RetroIcon from '../components/RetroIcon'
import soundFx from '../lib/soundFx'

function getResolvedPreferredTopics() {
  const saved = localStorage.getItem('quizmaster-preferred-topics')
  let list = ['python', 'java', 'dsa', 'algebra']
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed)) list = parsed
    } catch {}
  }

  const allTopics = Object.values(TOPIC_MODULES)
  return list.map((item) => {
    if (typeof item === 'object' && item.topicId) return item
    const str = String(item).toLowerCase().replace(/[^a-z0-9]/g, '')
    const match = allTopics.find(
      (t) =>
        t.id === str ||
        t.name.toLowerCase().replace(/[^a-z0-9]/g, '') === str ||
        t.name.toLowerCase().includes(String(item).toLowerCase())
    )
    if (match) {
      return { name: match.name, icon: match.icon, topicId: match.id, category: match.category }
    }
    return { name: 'Python', icon: '🐍', topicId: 'python', category: 'Programming' }
  })
}

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [stats, setStats] = useState(() => getUserStats(user?.id))
  const [history, setHistory] = useState(() => getQuizHistory(user?.id))
  const [preferredTopics, setPreferredTopics] = useState(() => getResolvedPreferredTopics())

  useEffect(() => {
    const handleSync = () => {
      setStats(getUserStats(user?.id))
      setHistory(getQuizHistory(user?.id))
    }
    window.addEventListener('quizmaster-stats-updated', handleSync)
    return () => window.removeEventListener('quizmaster-stats-updated', handleSync)
  }, [user])

  const avatar = user?.avatar || (user?.id && localStorage.getItem(`quizmaster-avatar-${user.id}`)) || '👾'
  const playerName = user?.name || (user?.isGuest ? 'PLAYER 1' : 'RetroGamer')

  // Calculate XP percentage
  const xpPercent = Math.min(Math.round((stats.xp_in_level / stats.xp_needed) * 100), 100)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* PLAYER 1 ARCADE ID BANNER */}
      <div
        className="dashboard-banner-grid"
        style={{
          background: '#000000',
          border: '4px solid var(--neon-pink)',
          boxShadow: '8px 8px 0px var(--neon-pink)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px',
        }}
      >
        <div
          style={{
            width: '74px',
            height: '74px',
            background: 'var(--bg-card)',
            border: '3px solid var(--neon-cyan)',
            boxShadow: '4px 4px 0px var(--neon-cyan)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '40px',
          }}
        >
          {avatar}
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: '900', color: '#fff' }}>
              {playerName}
            </h1>
            <span className="arcade-tag-chip" style={{ background: 'var(--neon-yellow)' }}>
              PLAYER LEVEL {stats.level}
            </span>
            {user?.isGuest && (
              <span className="arcade-tag-chip" style={{ background: 'var(--neon-green)' }}>
                GUEST MODE
              </span>
            )}
          </div>

          <div style={{ marginTop: '12px', maxWidth: '400px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-pixel)', fontSize: '9px', marginBottom: '6px', color: 'var(--neon-cyan)' }}>
              <span>XP PROGRESS</span>
              <span>{stats.xp_in_level} / {stats.xp_needed} XP</span>
            </div>
            <div style={{ height: '10px', background: '#222', border: '2px solid #000', borderRadius: '4px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${xpPercent}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, var(--neon-pink), var(--neon-cyan))',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>
        </div>

        {/* QUICK JUMP TO QUIZ */}
        <button
          onClick={() => {
            soundFx.playCoin()
            navigate('/quiz/python/python-m1/easy')
          }}
          className="btn-retro-yellow"
          style={{ padding: '14px 20px' }}
        >
          <Play size={16} fill="#000" />
          <span>START SPEED RUN</span>
        </button>
      </div>

      {/* 4 CORE ARCADE METRICS CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        <div className="retro-cartridge-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '9px', color: 'var(--text-muted)' }}>DAILY STREAK</span>
            <Flame size={20} color="var(--neon-pink)" />
          </div>
          <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '24px', color: 'var(--neon-pink)' }}>
            {stats.current_streak} 🔥
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Max: {stats.max_streak} days active
          </div>
        </div>

        <div className="retro-cartridge-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '9px', color: 'var(--text-muted)' }}>ARCADE COINS</span>
            <Coins size={20} color="var(--neon-yellow)" />
          </div>
          <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '24px', color: 'var(--neon-yellow)' }}>
            {stats.coins || 100} 🪙
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Earn +10 per correct answer
          </div>
        </div>

        <div className="retro-cartridge-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '9px', color: 'var(--text-muted)' }}>ACCURACY</span>
            <Award size={20} color="var(--neon-cyan)" />
          </div>
          <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '24px', color: 'var(--neon-cyan)' }}>
            {stats.accuracy || 0}%
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {stats.correct_solved || 0} / {stats.problems_solved || 0} solved
          </div>
        </div>

        <div className="retro-cartridge-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '9px', color: 'var(--text-muted)' }}>HIGH SCORE</span>
            <Trophy size={20} color="var(--neon-green)" />
          </div>
          <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '24px', color: 'var(--neon-green)' }}>
            {stats.high_score || 0} PTS
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {stats.quizzes_completed || 0} runs completed
          </div>
        </div>
      </div>

      {/* FAVORITE TOPICS (CARTRIDGE SHELF) */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>💾</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 'bold' }}>
              CARTRIDGE SHELF
            </h2>
          </div>
          <Link
            to="/topics"
            className="btn-retro-outline"
            style={{ padding: '6px 12px', fontSize: '9px' }}
            onClick={() => soundFx.playSelect()}
          >
            VIEW ALL 60+ CARTRIDGES →
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          {preferredTopics.map((pt, i) => (
            <div
              key={i}
              className="retro-cartridge-card"
              style={{ padding: '20px', cursor: 'pointer' }}
              onClick={() => {
                soundFx.playCoin()
                navigate(`/topic/${pt.topicId}`)
              }}
            >
              <div style={{ marginBottom: '14px' }}>
                <RetroIcon topicId={pt.topicId} category={pt.category} size="lg" />
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 'bold', color: '#fff' }}>
                {pt.name}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 16px' }}>
                {pt.category || 'Topic Domain'}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--neon-cyan)', fontFamily: 'var(--font-pixel)', fontSize: '9px' }}>
                <span>PLAY MODULES</span>
                <ChevronRight size={12} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RECENT RUNS & ACHIEVEMENTS TWO-COLUMN GRID */}
      <div className="dashboard-bottom-grid">
        {/* RECENT MATCHES LOG */}
        <div style={{ background: '#000', border: '3px solid #000', borderRadius: 'var(--radius-xl)', padding: '24px', boxShadow: '6px 6px 0px #000' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid #333', paddingBottom: '12px' }}>
            <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '11px', color: 'var(--neon-yellow)' }}>
              RECENT RUNS LOG
            </div>
            <Link to="/analytics" style={{ color: 'var(--neon-cyan)', fontSize: '12px', textDecoration: 'none' }}>
              Full History →
            </Link>
          </div>

          {history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 0', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '36px', marginBottom: '8px' }}>🕹️</div>
              <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '10px' }}>NO RUNS LOGGED YET</div>
              <p style={{ fontSize: '13px', marginTop: '6px' }}>Play your first quiz to record score history!</p>
              <button
                onClick={() => {
                  soundFx.playCoin()
                  navigate('/quiz')
                }}
                className="btn-retro-yellow"
                style={{ marginTop: '16px', fontSize: '10px', padding: '8px 16px' }}
              >
                INSERT COIN
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {history.slice(0, 5).map((h) => (
                <div
                  key={h.id}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '2px solid #222',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 'bold', color: '#fff' }}>
                      {h.topic} • {h.module}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {h.difficulty.toUpperCase()} • {h.date}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '11px', color: h.percent >= 70 ? 'var(--neon-green)' : 'var(--neon-pink)' }}>
                      {h.percent}% ACC
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--neon-yellow)', marginTop: '2px' }}>
                      {h.score || h.correct * 100} PTS
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RETRO ACHIEVEMENTS SHELF */}
        <div style={{ background: '#000', border: '3px solid #000', borderRadius: 'var(--radius-xl)', padding: '24px', boxShadow: '6px 6px 0px #000' }}>
          <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '11px', color: 'var(--neon-cyan)', marginBottom: '16px', borderBottom: '1px solid #333', paddingBottom: '12px' }}>
            ARCADE ACHIEVEMENTS
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {RETRO_ACHIEVEMENTS.map((ach) => {
              const isUnlocked =
                (ach.id === 'first_quiz' && stats.quizzes_completed > 0) ||
                (ach.id === 'streak_3' && stats.current_streak >= 3) ||
                (ach.id === 'solved_50' && stats.correct_solved >= 50) ||
                (ach.id === 'level_5' && stats.level >= 5) ||
                (ach.id === 'high_acc' && stats.accuracy >= 90 && stats.quizzes_completed > 0)

              return (
                <div
                  key={ach.id}
                  style={{
                    background: isUnlocked ? 'rgba(0, 240, 255, 0.08)' : 'var(--bg-card)',
                    border: `2px solid ${isUnlocked ? 'var(--neon-cyan)' : '#333'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    opacity: isUnlocked ? 1 : 0.5,
                  }}
                >
                  <span style={{ fontSize: '24px' }}>{ach.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '9px', color: isUnlocked ? 'var(--neon-yellow)' : '#fff' }}>
                      {ach.name}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {ach.desc}
                    </div>
                  </div>
                  {isUnlocked && <CheckCircle2 size={16} color="var(--neon-green)" />}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
