import { useState, useEffect } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts'
import { ChevronDown, CheckCircle2, Award, Calendar, Layers } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getUserStats, getQuizHistory } from '../lib/userStats'

export default function Analytics() {
  const { user } = useAuth()
  const [stats, setStats] = useState(() => getUserStats(user?.id))
  const [history, setHistory] = useState(() => getQuizHistory(user?.id))
  const [timeRange, setTimeRange] = useState('All Time')

  useEffect(() => {
    const handleSync = () => {
      setStats(getUserStats(user?.id))
      setHistory(getQuizHistory(user?.id))
    }
    handleSync()
    window.addEventListener('quizmaster-stats-updated', handleSync)
    return () => window.removeEventListener('quizmaster-stats-updated', handleSync)
  }, [user])

  // Calculate difficulty breakdown from real history or defaults
  const totalSolved = stats.problems_solved || 0
  const easyCount = history.filter((h) => h.difficulty === 'easy').reduce((acc, h) => acc + h.total, 0)
  const medCount = history.filter((h) => h.difficulty === 'intermediate' || h.difficulty === 'medium').reduce((acc, h) => acc + h.total, 0)
  const hardCount = history.filter((h) => h.difficulty === 'hard').reduce((acc, h) => acc + h.total, 0)

  const difficultyData = totalSolved > 0
    ? [
        { name: 'Easy', value: Math.max(easyCount, 0), color: '#10B981' },
        { name: 'Medium', value: Math.max(medCount, 0), color: '#F59E0B' },
        { name: 'Hard', value: Math.max(hardCount, 0), color: '#EF4444' },
      ].filter((d) => d.value > 0)
    : [
        { name: 'Easy', value: 1, color: '#10B981' },
        { name: 'Medium', value: 1, color: '#F59E0B' },
        { name: 'Hard', value: 1, color: '#EF4444' },
      ]

  // Topics breakdown
  const topicCounts = {}
  history.forEach((h) => {
    const key = h.topic || 'Other'
    topicCounts[key] = (topicCounts[key] || 0) + h.total
  })

  const topicData = Object.keys(topicCounts).length > 0
    ? Object.entries(topicCounts).map(([name, count], i) => ({
        name,
        count,
        fill: ['#6366F1', '#EC4899', '#F59E0B', '#10B981', '#06B6D4'][i % 5],
      }))
    : [
        { name: 'Java', count: 0, fill: '#6366F1' },
        { name: 'Python', count: 0, fill: '#EC4899' },
        { name: 'Math', count: 0, fill: '#F59E0B' },
      ]

  const activityTimelineData = history.length > 0
    ? history.slice(0, 7).reverse().map((h) => ({
        name: h.date || 'Recent',
        solved: h.total,
      }))
    : [
        { name: 'Today', solved: totalSolved },
      ]

  return (
    <div className="qm-analytics-page">
      {/* HEADER */}
      <div className="qm-analytics-header-row">
        <div className="qm-page-welcome-header">
          <h1>Performance Analytics</h1>
          <p>Your real-time quiz performance, accuracy, and subject breakdown based on completed quizzes.</p>
        </div>

        <div className="qm-time-select-pill">
          <span>{timeRange}</span>
          <ChevronDown size={16} />
        </div>
      </div>

      {/* OVERALL SUMMARY 4-BOX METRICS */}
      <div className="qm-overall-summary-card mb-6">
        <h3 className="qm-summary-title">Overall Summary</h3>
        <div className="qm-summary-metrics-grid">
          <div className="qm-summary-stat-box">
            <span className="stat-label">Total Questions Solved</span>
            <strong className="stat-number">{stats.problems_solved || 0}</strong>
          </div>
          <div className="qm-summary-stat-box">
            <span className="stat-label">Average Accuracy</span>
            <strong className="stat-number">{stats.accuracy || 0}%</strong>
          </div>
          <div className="qm-summary-stat-box">
            <span className="stat-label">Current Streak</span>
            <strong className="stat-number">{stats.current_streak || 0} days</strong>
          </div>
          <div className="qm-summary-stat-box">
            <span className="stat-label">Best Streak</span>
            <strong className="stat-number">{stats.max_streak || 0} days</strong>
          </div>
        </div>
      </div>

      {/* 3 CHARTS ROW */}
      <div className="qm-analytics-charts-grid">
        {/* CHART 1: QUESTIONS OVER TIME */}
        <div className="qm-chart-card">
          <h3 className="qm-chart-title">Questions Solved Over Time</h3>
          <div className="qm-chart-container">
            <ResponsiveContainer width="100%" height={210}>
              <AreaChart data={activityTimelineData}>
                <defs>
                  <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" tick={{ fontSize: 11 }} />
                <YAxis stroke="var(--text-muted)" tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="solved"
                  stroke="#6366F1"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#purpleGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: SOLVED BY DIFFICULTY */}
        <div className="qm-chart-card">
          <h3 className="qm-chart-title">Solved by Difficulty</h3>
          <div className="qm-donut-wrapper">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={difficultyData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={3}
                >
                  {difficultyData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="qm-donut-legend">
              <div className="legend-row">
                <span className="dot green" />
                <span>Easy · {easyCount}</span>
              </div>
              <div className="legend-row">
                <span className="dot amber" />
                <span>Medium · {medCount}</span>
              </div>
              <div className="legend-row">
                <span className="dot red" />
                <span>Hard · {hardCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* CHART 3: SOLVED BY TOPIC */}
        <div className="qm-chart-card">
          <h3 className="qm-chart-title">Solved by Topic</h3>
          <div className="qm-chart-container">
            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={topicData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" tick={{ fontSize: 11 }} />
                <YAxis stroke="var(--text-muted)" tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {topicData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* COMPLETED QUIZZES LOG */}
      <div className="qm-card mt-6" style={{ padding: '1.5rem' }}>
        <h3 className="qm-summary-title mb-3">Completed Quizzes History</h3>
        {history.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {history.map((h, idx) => (
              <div
                key={h.id || idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.85rem 1rem',
                  background: 'var(--bg-app)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.2rem' }}>🎯</span>
                  <div>
                    <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>
                      {h.topic} · {h.module}
                    </strong>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', gap: '8px', marginTop: '2px' }}>
                      <span style={{ textTransform: 'capitalize' }}>{h.difficulty} Tier</span>
                      <span>•</span>
                      <span>{h.date}</span>
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '0.25rem 0.65rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.82rem',
                      fontWeight: '700',
                      background: 'var(--primary-light)',
                      color: 'var(--primary-dark)',
                    }}
                  >
                    {h.correct}/{h.total} ({h.percent || Math.round((h.correct / h.total) * 100)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            No quizzes completed yet. Complete a quiz to view your historical analytics!
          </p>
        )}
      </div>
    </div>
  )
}
