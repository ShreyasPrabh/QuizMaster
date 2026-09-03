import { useState, useEffect } from 'react'
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
import { Award, Flame, Zap, Trophy, Coins, RotateCcw } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getUserStats, getQuizHistory } from '../lib/userStats'
import soundFx from '../lib/soundFx'

export default function Analytics() {
  const { user } = useAuth()
  const [stats, setStats] = useState(() => getUserStats(user?.id))
  const [history, setHistory] = useState(() => getQuizHistory(user?.id))

  useEffect(() => {
    const handleSync = () => {
      setStats(getUserStats(user?.id))
      setHistory(getQuizHistory(user?.id))
    }
    handleSync()
    window.addEventListener('quizmaster-stats-updated', handleSync)
    return () => window.removeEventListener('quizmaster-stats-updated', handleSync)
  }, [user])

  // Difficulty data
  const easyCount = history.filter((h) => h.difficulty === 'easy').length
  const medCount = history.filter((h) => h.difficulty === 'intermediate').length
  const hardCount = history.filter((h) => h.difficulty === 'hard').length

  const difficultyData = [
    { name: 'EASY', count: Math.max(easyCount, 2), color: 'var(--neon-green)' },
    { name: 'INTERMEDIATE', count: Math.max(medCount, 1), color: 'var(--neon-yellow)' },
    { name: 'HARD', count: Math.max(hardCount, 1), color: 'var(--neon-pink)' },
  ]

  // Timeline data from history or fallback trend
  const timelineData = history.length > 0
    ? [...history].reverse().map((h, i) => ({
        name: `R${i + 1}`,
        accuracy: h.percent || 0,
        score: h.score || 0,
      }))
    : [
        { name: 'R1', accuracy: 70, score: 700 },
        { name: 'R2', accuracy: 85, score: 850 },
        { name: 'R3', accuracy: 80, score: 800 },
        { name: 'R4', accuracy: 95, score: 950 },
        { name: 'R5', accuracy: 90, score: 900 },
      ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* HEADER */}
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

      {/* TOP 4 RETRO STAT CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        <div className="retro-cartridge-card" style={{ padding: '20px' }}>
          <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '8px', color: 'var(--text-muted)' }}>OVERALL ACCURACY</div>
          <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '28px', color: 'var(--neon-cyan)', margin: '8px 0' }}>
            {stats.accuracy || 85}%
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            {stats.correct_solved || 0} correct out of {stats.problems_solved || 0}
          </div>
        </div>

        <div className="retro-cartridge-card" style={{ padding: '20px' }}>
          <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '8px', color: 'var(--text-muted)' }}>TOTAL QUIZZES</div>
          <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '28px', color: 'var(--neon-yellow)', margin: '8px 0' }}>
            {stats.quizzes_completed || 0} RUNS
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Across 6 subject categories
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
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px' }}>
        {/* ACCURACY OVER TIME AREA CHART */}
        <div style={{ background: '#000000', border: '3px solid #000', borderRadius: 'var(--radius-xl)', padding: '24px', boxShadow: '6px 6px 0px #000' }}>
          <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '10px', color: 'var(--neon-cyan)', marginBottom: '16px' }}>
            ACCURACY TIMELINE // SPEED RUNS (%)
          </div>
          <div style={{ height: '260px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData}>
                <defs>
                  <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--neon-cyan)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--neon-cyan)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="name" stroke="#666" style={{ fontSize: '10px', fontFamily: 'var(--font-pixel)' }} />
                <YAxis domain={[0, 100]} stroke="#666" style={{ fontSize: '10px', fontFamily: 'var(--font-pixel)' }} />
                <Tooltip
                  contentStyle={{ background: '#000', border: '2px solid var(--neon-cyan)', borderRadius: '4px', fontFamily: 'var(--font-pixel)', fontSize: '10px' }}
                />
                <Area type="monotone" dataKey="accuracy" stroke="var(--neon-cyan)" strokeWidth={3} fillOpacity={1} fill="url(#colorAcc)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* DIFFICULTY TIERS BAR CHART */}
        <div style={{ background: '#000000', border: '3px solid #000', borderRadius: 'var(--radius-xl)', padding: '24px', boxShadow: '6px 6px 0px #000' }}>
          <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '10px', color: 'var(--neon-yellow)', marginBottom: '16px' }}>
            RUNS BY DIFFICULTY TIER
          </div>
          <div style={{ height: '260px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={difficultyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="name" stroke="#666" style={{ fontSize: '9px', fontFamily: 'var(--font-pixel)' }} />
                <YAxis stroke="#666" style={{ fontSize: '10px', fontFamily: 'var(--font-pixel)' }} />
                <Tooltip
                  contentStyle={{ background: '#000', border: '2px solid var(--neon-yellow)', borderRadius: '4px', fontFamily: 'var(--font-pixel)', fontSize: '10px' }}
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
              {history.map((h) => (
                <tr key={h.id}>
                  <td style={{ color: 'var(--text-muted)' }}>{h.date}</td>
                  <td style={{ color: '#fff', fontWeight: 'bold' }}>{h.topic}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{h.module}</td>
                  <td>
                    <span className="arcade-tag-chip" style={{ background: h.difficulty === 'hard' ? 'var(--neon-pink)' : h.difficulty === 'intermediate' ? 'var(--neon-yellow)' : 'var(--neon-green)', color: '#000', fontSize: '8px' }}>
                      {h.difficulty.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ color: h.percent >= 70 ? 'var(--neon-green)' : 'var(--neon-pink)', fontWeight: 'bold' }}>
                    {h.percent}%
                  </td>
                  <td style={{ color: 'var(--neon-yellow)' }}>
                    {h.score || h.correct * 100} PTS
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
