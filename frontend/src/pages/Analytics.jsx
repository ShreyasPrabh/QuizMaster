import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts'
import { Award, Flame, Zap, Trophy, Coins, Play, RefreshCw } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getUserStats, getQuizHistory } from '../lib/userStats'
import soundFx from '../lib/soundFx'
import api from '../lib/api'

export default function Analytics() {
  const { user } = useAuth()
  const [stats, setStats] = useState(() => getUserStats(user?.id))
  const [history, setHistory] = useState(() => getQuizHistory(user?.id))
  const [dbDifficultyCounts, setDbDifficultyCounts] = useState(null)
  const [loading, setLoading] = useState(false)

  // Fetch real telemetry and session history directly from database API
  const fetchAnalytics = async () => {
    if (!user || user.isGuest) return
    setLoading(true)
    try {
      const res = await api.get('/analytics/')
      if (res.data) {
        if (res.data.difficulty_counts) {
          setDbDifficultyCounts(res.data.difficulty_counts)
        }
        if (res.data.stats) {
          setStats((prev) => ({
            ...prev,
            ...res.data.stats,
          }))
          const key = `quizmaster_user_stats_${user.id}`
          const local = JSON.parse(localStorage.getItem(key) || '{}')
          localStorage.setItem(key, JSON.stringify({ ...local, ...res.data.stats }))
        }
        if (Array.isArray(res.data.sessions) && res.data.sessions.length > 0) {
          setHistory(res.data.sessions)
          const histKey = `quizmaster_quiz_history_${user.id}`
          localStorage.setItem(histKey, JSON.stringify(res.data.sessions))
        }
      }
    } catch (err) {
      console.warn('Could not fetch server analytics, using local state:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
    const handleSync = () => {
      setStats(getUserStats(user?.id))
      setHistory(getQuizHistory(user?.id))
    }
    window.addEventListener('quizmaster-stats-updated', handleSync)
    return () => window.removeEventListener('quizmaster-stats-updated', handleSync)
  }, [user?.id])

  // Count distinct subject categories from history
  const uniqueTopics = new Set(history.map((h) => h.topic).filter(Boolean))
  const uniqueTopicsCount = uniqueTopics.size

  // Real difficulty counts from actual run logs or backend
  const easyCount = dbDifficultyCounts?.easy !== undefined
    ? dbDifficultyCounts.easy
    : history.filter((h) => String(h.difficulty || '').toLowerCase() === 'easy').length
  const medCount = dbDifficultyCounts?.intermediate !== undefined
    ? dbDifficultyCounts.intermediate
    : history.filter((h) => {
        const d = String(h.difficulty || '').toLowerCase()
        return d === 'intermediate' || d === 'medium'
      }).length
  const hardCount = dbDifficultyCounts?.hard !== undefined
    ? dbDifficultyCounts.hard
    : history.filter((h) => String(h.difficulty || '').toLowerCase() === 'hard').length

  const difficultyData = [
    { name: 'EASY', count: easyCount, color: '#39ff14' },
    { name: 'INTERMEDIATE', count: medCount, color: '#ffe600' },
    { name: 'HARD', count: hardCount, color: '#ff007f' },
  ]

  // Real timeline data from quiz session history
  const timelineData = history.map((h, i) => ({
    name: `R${history.length - i}`,
    accuracy: h.percent ?? 0,
    score: h.score ?? 0,
    topic: h.topic,
    module: h.module,
    date: h.date,
  })).reverse()

  const overallAccuracy = stats.problems_solved > 0
    ? (stats.accuracy ?? Math.round(((stats.correct_solved || 0) / stats.problems_solved) * 100))
    : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="hero-tag-badge">
            <span>📊</span>
            <span>ARCADE TELEMETRY &amp; METRICS</span>
          </div>
          <h1 className="section-retro-title">PLAYER ANALYTICS</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            Real-time performance tracking, difficulty distribution, and accuracy milestones.
          </p>
        </div>

        <button
          onClick={() => {
            soundFx.playSelect()
            fetchAnalytics()
          }}
          className="retro-tool-btn"
          title="Refresh Telemetry"
          style={{
            background: 'var(--bg-card)',
            color: '#fff',
            borderColor: '#000',
            padding: '8px 12px',
            fontSize: '11px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <RefreshCw size={12} className={loading ? 'spin-anim' : ''} />
          <span>SYNC TELEMETRY</span>
        </button>
      </div>

      {/* TOP 4 RETRO STAT CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        <div className="retro-cartridge-card" style={{ padding: '20px' }}>
          <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '8px', color: 'var(--text-muted)' }}>OVERALL ACCURACY</div>
          <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '28px', color: 'var(--neon-cyan)', margin: '8px 0' }}>
            {overallAccuracy}%
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            {stats.correct_solved || 0} correct out of {stats.problems_solved || 0}
          </div>
        </div>

        <div className="retro-cartridge-card" style={{ padding: '20px' }}>
          <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '8px', color: 'var(--text-muted)' }}>TOTAL QUIZZES</div>
          <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '28px', color: 'var(--neon-yellow)', margin: '8px 0' }}>
            {stats.quizzes_completed || history.length || 0} RUNS
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Across {uniqueTopicsCount > 0 ? uniqueTopicsCount : (stats.problems_solved > 0 ? 1 : 0)} subject {uniqueTopicsCount === 1 ? 'category' : 'categories'}
          </div>
        </div>

        <div className="retro-cartridge-card" style={{ padding: '20px' }}>
          <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '8px', color: 'var(--text-muted)' }}>PLAYER LEVEL</div>
          <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '28px', color: 'var(--neon-green)', margin: '8px 0' }}>
            LVL {stats.level || 1}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            {stats.total_xp || 0} Total XP earned
          </div>
        </div>

        <div className="retro-cartridge-card" style={{ padding: '20px' }}>
          <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '8px', color: 'var(--text-muted)' }}>MAX STREAK</div>
          <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '28px', color: 'var(--neon-pink)', margin: '8px 0' }}>
            {stats.max_streak || 0} 🔥
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Current streak: {stats.current_streak || 0} days
          </div>
        </div>
      </div>

      {/* CHARTS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* ACCURACY OVER TIME AREA CHART */}
        <div style={{ background: '#000000', border: '3px solid #000', borderRadius: 'var(--radius-xl)', padding: '24px', boxShadow: '6px 6px 0px #000', minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '10px', color: 'var(--neon-cyan)' }}>
              ACCURACY TIMELINE // SPEED RUNS (%)
            </div>
            {timelineData.length > 0 && (
              <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '8px', color: 'var(--text-muted)' }}>
                LAST {timelineData.length} SESSIONS
              </span>
            )}
          </div>

          {timelineData.length === 0 ? (
            <div style={{ height: '260px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '2px dashed #333', padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>📈</div>
              <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '9px', color: '#fff', marginBottom: '4px' }}>
                NO QUIZ RUNS LOGGED YET
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '14px', maxWidth: '300px' }}>
                Complete quiz modules to start plotting your accuracy timeline!
              </p>
              <Link to="/topics" className="btn-retro-yellow" style={{ fontSize: '9px', padding: '6px 14px' }}>
                START A QUIZ
              </Link>
            </div>
          ) : (
            <div style={{ height: '260px', width: '100%' }}>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={timelineData}>
                  <defs>
                    <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.7}/>
                      <stop offset="95%" stopColor="#00f0ff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                  <XAxis dataKey="name" stroke="#666" style={{ fontSize: '10px', fontFamily: 'var(--font-pixel)' }} />
                  <YAxis domain={[0, 100]} stroke="#666" style={{ fontSize: '10px', fontFamily: 'var(--font-pixel)' }} unit="%" />
                  <Tooltip
                    contentStyle={{ background: '#000', border: '2px solid #00f0ff', borderRadius: '4px', fontFamily: 'var(--font-pixel)', fontSize: '10px', color: '#fff' }}
                    formatter={(value) => [`${value}%`, 'Accuracy']}
                  />
                  <Area
                    type="monotone"
                    dataKey="accuracy"
                    stroke="#00f0ff"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorAcc)"
                    dot={{ r: 4, fill: '#00f0ff', stroke: '#000', strokeWidth: 1 }}
                    activeDot={{ r: 6, fill: '#ffe600' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* DIFFICULTY TIERS BAR CHART */}
        <div style={{ background: '#000000', border: '3px solid #000', borderRadius: 'var(--radius-xl)', padding: '24px', boxShadow: '6px 6px 0px #000', minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '10px', color: 'var(--neon-yellow)', marginBottom: '16px' }}>
            RUNS BY DIFFICULTY TIER
          </div>
          <div style={{ height: '260px', width: '100%' }}>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={difficultyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="name" stroke="#666" style={{ fontSize: '9px', fontFamily: 'var(--font-pixel)' }} />
                <YAxis stroke="#666" style={{ fontSize: '10px', fontFamily: 'var(--font-pixel)' }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: '#000', border: '2px solid #ffe600', borderRadius: '4px', fontFamily: 'var(--font-pixel)', fontSize: '10px', color: '#fff' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {difficultyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* RECENT RUNS TABLE */}
      <div style={{ background: '#000000', border: '3px solid #000', borderRadius: 'var(--radius-xl)', padding: '24px', boxShadow: '6px 6px 0px #000' }}>
        <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '11px', color: 'var(--neon-pink)', marginBottom: '16px', borderBottom: '1px solid #333', paddingBottom: '12px' }}>
          COMPREHENSIVE RUN LOG
        </div>

        {history.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)' }}>
            No history yet! Complete a quiz module to view session telemetry.
          </div>
        ) : (
          <table className="highscore-table">
            <thead>
              <tr>
                <th>DATE</th>
                <th>TOPIC</th>
                <th>MODULE</th>
                <th>TIER</th>
                <th>ACCURACY</th>
                <th>SCORE</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h, idx) => {
                const diffLower = String(h.difficulty || 'intermediate').toLowerCase()
                const tierColor = diffLower === 'hard' ? '#ff007f' : diffLower === 'easy' ? '#39ff14' : '#ffe600'
                return (
                  <tr key={h.id || idx}>
                    <td style={{ color: 'var(--text-muted)' }}>{h.date}</td>
                    <td style={{ color: '#fff', fontWeight: 'bold' }}>{h.topic}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{h.module}</td>
                    <td>
                      <span className="arcade-tag-chip" style={{ background: tierColor, color: '#000', fontSize: '8px' }}>
                        {diffLower.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ color: (h.percent ?? 0) >= 70 ? 'var(--neon-green)' : 'var(--neon-pink)', fontWeight: 'bold' }}>
                      {h.percent ?? 0}%
                    </td>
                    <td style={{ color: 'var(--neon-yellow)' }}>
                      {(h.score || 0).toLocaleString()} PTS
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
