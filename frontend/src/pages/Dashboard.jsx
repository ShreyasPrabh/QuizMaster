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
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getUserStats, getQuizHistory } from '../lib/userStats'
import { TOPIC_MODULES } from '../data/topicModules'
import api from '../lib/api'

function getResolvedPreferredTopics() {
  const saved = localStorage.getItem('quizmaster-preferred-topics')
  let list = ['Java', 'Python', 'Data Structures & Algorithms', 'Algebra & Equations']
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
        t.name.toLowerCase().includes(String(item).toLowerCase()) ||
        String(item).toLowerCase().includes(t.name.toLowerCase())
    )

    if (match) {
      return { name: match.name, icon: match.icon, topicId: match.id }
    }

    return { name: String(item), icon: '📚', topicId: 'java' }
  })
}

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [stats, setStats] = useState(() => getUserStats())
  const [history, setHistory] = useState(() => getQuizHistory())
  const [preferredTopics, setPreferredTopics] = useState(() => getResolvedPreferredTopics())

  useEffect(() => {
    // Sync local live work stats & preferred topics
    const currentLocal = getUserStats()
    setStats(currentLocal)
    setHistory(getQuizHistory())
    setPreferredTopics(getResolvedPreferredTopics())

    const handleSync = () => {
      setPreferredTopics(getResolvedPreferredTopics())
    }
    window.addEventListener('storage', handleSync)
    window.addEventListener('focus', handleSync)

    if (user) {
      api
        .get('/user/stats/')
        .then((res) => {
          if (res.data && res.data.problems_solved > 0) {
            setStats({
              current_streak: res.data.current_streak ?? currentLocal.current_streak,
              problems_solved: res.data.problems_solved ?? currentLocal.problems_solved,
              accuracy: res.data.accuracy ?? currentLocal.accuracy,
              max_streak: res.data.max_streak ?? currentLocal.max_streak,
            })
          }
        })
        .catch(() => {})
    }

    return () => {
      window.removeEventListener('storage', handleSync)
      window.removeEventListener('focus', handleSync)
    }
  }, [user])

  const firstName = (user?.name || localStorage.getItem('quizmaster-name') || 'Learner').split(' ')[0]

  const recommendedQuizzes = [
    { title: 'Java', level: '5 Modules · 300 MCQs', icon: '☕', topicId: 'java' },
    { title: 'Python', level: '5 Modules · 300 MCQs', icon: '🐍', topicId: 'python' },
    { title: 'Data Structures', level: '4 Modules · 240 MCQs', icon: '🌳', topicId: 'datastructures' },
  ]

  const lastQuiz = history[0]

  return (
    <div className="qm-dashboard-page">
      {/* WELCOME HEADER */}
      <div className="qm-page-welcome-header">
        <h1>Welcome back, {firstName}! 👋</h1>
        <p>Here is your real-time quiz performance, streak, and recent work.</p>
      </div>

      {/* 4 STAT CARDS (REAL STATS ONLY) */}
      <div className="qm-stats-row">
        <div className="qm-stat-pill-card">
          <div className="qm-stat-top">
            <span className="qm-stat-icon-wrap text-amber">🔥</span>
            <span className="qm-stat-label">Current Streak</span>
          </div>
          <div className="qm-stat-bottom">
            <span className="qm-stat-number">{stats.current_streak || 0}</span>
            <span className="qm-stat-unit">days</span>
          </div>
        </div>

        <div className="qm-stat-pill-card">
          <div className="qm-stat-top">
            <span className="qm-stat-icon-wrap text-indigo">❓</span>
            <span className="qm-stat-label">Questions Solved</span>
          </div>
          <div className="qm-stat-bottom">
            <span className="qm-stat-number">{(stats.problems_solved || 0).toLocaleString()}</span>
          </div>
        </div>

        <div className="qm-stat-pill-card">
          <div className="qm-stat-top">
            <span className="qm-stat-icon-wrap text-emerald">🎯</span>
            <span className="qm-stat-label">Accuracy Rate</span>
          </div>
          <div className="qm-stat-bottom">
            <span className="qm-stat-number">{stats.accuracy || 0}%</span>
          </div>
        </div>

        <div className="qm-stat-pill-card">
          <div className="qm-stat-top">
            <span className="qm-stat-icon-wrap text-purple">⚡</span>
            <span className="qm-stat-label">Longest Streak</span>
          </div>
          <div className="qm-stat-bottom">
            <span className="qm-stat-number">{stats.max_streak || 0}</span>
            <span className="qm-stat-unit">days</span>
          </div>
        </div>
      </div>

      {/* 2-COLUMN SECTION: CONTINUE PRACTICE & PREFERRED TOPICS */}
      <div className="qm-two-col-grid">
        {/* CONTINUE PRACTICE */}
        <div className="qm-card qm-continue-card">
          <div className="qm-card-header-actions">
            <h2 className="qm-card-title">Continue Practice</h2>
            <Link to="/quiz" className="qm-btn-text-sm">
              View All Quizzes
            </Link>
          </div>

          <div className="qm-continue-body">
            {lastQuiz ? (
              <div className="qm-continue-item-row">
                <div className="qm-topic-round-icon bg-indigo">
                  {lastQuiz.topic?.toLowerCase().includes('python')
                    ? '🐍'
                    : lastQuiz.topic?.toLowerCase().includes('c++')
                    ? '⚙️'
                    : lastQuiz.topic?.toLowerCase().includes('algo') ||
                      lastQuiz.topic?.toLowerCase().includes('algebra')
                    ? '📐'
                    : '☕'}
                </div>
                <div className="qm-continue-text">
                  <h3>
                    {lastQuiz.topic} - {lastQuiz.module}
                  </h3>
                  <span className="qm-subtext">
                    {lastQuiz.difficulty.toUpperCase()} Tier · Scored {lastQuiz.correct} /{' '}
                    {lastQuiz.total} on {lastQuiz.date}
                  </span>
                </div>
                <Link to="/quiz" className="qm-btn-primary-sm">
                  Practice Again
                </Link>
              </div>
            ) : (
              <div className="qm-continue-item-row">
                <div className="qm-topic-round-icon bg-indigo">☕</div>
                <div className="qm-continue-text">
                  <h3>Java - Module 1: Java Basics & Syntax</h3>
                  <span className="qm-subtext">Easy Tier · 20 MCQs Available</span>
                </div>
                <Link to="/quiz/java/java-m1/easy" className="qm-btn-primary-sm">
                  Start Quiz
                </Link>
              </div>
            )}

            <div className="qm-progress-bar-wrap">
              <div
                className="qm-progress-bar-fill"
                style={{
                  width:
                    stats.problems_solved > 0
                      ? `${Math.min(stats.problems_solved * 10, 100)}%`
                      : '20%',
                }}
              />
            </div>
          </div>
        </div>

        {/* YOUR PREFERRED TOPICS */}
        <div className="qm-card qm-preferred-topics-card">
          <div className="qm-card-header-actions">
            <h2 className="qm-card-title">Your Preferred Topics</h2>
            <Link to="/profile" className="qm-btn-text-sm">
              Edit
            </Link>
          </div>

          <div className="qm-preferred-topics-list">
            {preferredTopics.length > 0 ? (
              preferredTopics.map((topic, index) => (
                <div
                  key={`${topic.topicId}-${index}`}
                  className="qm-preferred-topic-row"
                  onClick={() => navigate(`/topic/${topic.topicId}`)}
                >
                  <div className="qm-topic-left">
                    <span className="qm-topic-emoji">{topic.icon}</span>
                    <span className="qm-topic-name">{topic.name}</span>
                  </div>
                  <div className="qm-topic-right-pill">
                    <span>Explore</span>
                    <ChevronRight size={15} className="qm-chevron" />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-xs text-slate-400 mb-2">No preferred topics selected.</p>
                <Link to="/profile" className="qm-btn-outline-sm">
                  <Plus size={13} />
                  <span>Add Topics</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RECOMMENDED FOR YOU */}
      <div className="qm-recommended-section">
        <div className="qm-card-header-actions mb-3">
          <h2 className="qm-card-title">Recommended For You</h2>
          <Link to="/topics" className="qm-btn-text-sm">
            Browse All Topics <ArrowRight size={14} className="inline ml-1" />
          </Link>
        </div>

        <div className="qm-recommended-grid">
          {recommendedQuizzes.map((quiz) => (
            <div
              key={quiz.title}
              className="qm-card qm-rec-card"
              onClick={() => navigate(`/topic/${quiz.topicId}`)}
            >
              <div className="qm-rec-icon">{quiz.icon}</div>
              <div className="qm-rec-info">
                <h3>{quiz.title}</h3>
                <span className="qm-badge-level">{quiz.level}</span>
              </div>
              <div className="qm-rec-action">
                <Play size={16} fill="currentColor" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
