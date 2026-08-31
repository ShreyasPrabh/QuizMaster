import { useEffect, useState, useMemo } from 'react'
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom'
import confetti from 'canvas-confetti'
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Check,
  X,
  RotateCcw,
  Award,
  Layers,
  Sparkles,
  Play,
  Star,
  Zap,
  Trophy,
  BookOpen
} from 'lucide-react'
import { TOPIC_MODULES } from '../data/topicModules'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { recordQuizAttempt } from '../lib/userStats'

const OPTION_LETTERS = ['A', 'B', 'C', 'D']

export default function Quiz() {
  const { topicId, moduleId, difficulty: initialDiff } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  // State hooks always called unconditionally at the top level
  const [difficulty, setDifficulty] = useState(initialDiff || 'easy')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({}) // { [index]: choiceId }
  const [seconds, setSeconds] = useState(15)
  const [isCompleted, setIsCompleted] = useState(false)

  // Synchronize state whenever route parameters change
  useEffect(() => {
    setDifficulty(initialDiff || 'easy')
    setCurrentIndex(0)
    setSelectedAnswers({})
    setSeconds(15)
    setIsCompleted(false)
  }, [topicId, moduleId, initialDiff])

  // Resolve topic and active module
  const safeTopicKey = (topicId || 'java').toLowerCase().replace(/[^a-z0-9]/g, '')
  const topicData = TOPIC_MODULES[safeTopicKey] || TOPIC_MODULES.java

  const activeModule = useMemo(() => {
    if (!topicData || !topicData.modules) return null
    return topicData.modules.find((m) => m.id === moduleId) || topicData.modules[0]
  }, [topicData, moduleId])

  // Questions for this module and difficulty tier (20 questions per quiz session)
  const questions = useMemo(() => {
    if (!activeModule || !activeModule.difficulties) return []
    const fullTierList =
      activeModule.difficulties[difficulty] ||
      activeModule.difficulties.easy ||
      []
    return fullTierList.slice(0, 20)
  }, [activeModule, difficulty])

  const currentQ = questions[currentIndex] || questions[0] || {
    id: 'sample',
    text: 'No question available.',
    choices: [],
  }

  const currentSelectedChoiceId = selectedAnswers[currentIndex]
  const isAnswered = currentSelectedChoiceId !== undefined

  // Countdown timer
  useEffect(() => {
    if (isCompleted || !topicId || !moduleId) return
    const timer = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [currentIndex, isCompleted, topicId, moduleId])

  const [searchParams] = useSearchParams()
  const searchQuery = (searchParams.get('q') || '').toLowerCase().trim()
  const [selectedHubTopic, setSelectedHubTopic] = useState('java')
  const topicsBarRef = useState(null)[0]

  const allTopicList = useMemo(() => Object.values(TOPIC_MODULES), [])

  const filteredTopics = useMemo(() => {
    if (!searchQuery) return allTopicList

    return allTopicList
      .map((topic) => {
        const topicMatches =
          topic.name.toLowerCase().includes(searchQuery) ||
          topic.category.toLowerCase().includes(searchQuery) ||
          topic.description.toLowerCase().includes(searchQuery)

        const matchedModules = topic.modules.filter(
          (m) =>
            topicMatches ||
            m.title.toLowerCase().includes(searchQuery) ||
            (m.description && m.description.toLowerCase().includes(searchQuery))
        )

        if (matchedModules.length > 0) {
          return {
            ...topic,
            modules: matchedModules,
          }
        }
        return null
      })
      .filter(Boolean)
  }, [allTopicList, searchQuery])

  // Active topic object for the Hub
  const activeHubTopic = useMemo(() => {
    if (filteredTopics.length === 0) return null
    const found = filteredTopics.find((t) => t.id === selectedHubTopic)
    return found || filteredTopics[0]
  }, [filteredTopics, selectedHubTopic])

  const scrollTopics = (direction) => {
    const el = document.getElementById('qm-topics-scroll-track')
    if (el) {
      el.scrollBy({
        left: direction === 'left' ? -260 : 260,
        behavior: 'smooth',
      })
    }
  }

  // If no topic/module is specified (i.e. user clicked "Quiz" in sidebar), show Interactive Module Selector Hub
  if (!topicId || !moduleId) {
    return (
      <div className="qm-quiz-hub-page">
        <div className="qm-page-welcome-header">
          <h1>Select a Module to Start Quizzing</h1>
          <p>
            {searchQuery
              ? `Showing modules matching "${searchQuery}"`
              : 'Choose a subject topic below to view its learning modules and select your difficulty level.'}
          </p>
        </div>

        {/* TOPIC SELECTION HORIZONTAL SCROLL CAROUSEL */}
        <div className="qm-hub-carousel-wrapper">
          <button
            type="button"
            className="qm-carousel-arrow left"
            onClick={() => scrollTopics('left')}
            title="Scroll Left"
          >
            ‹
          </button>

          <div className="qm-hub-topics-bar" id="qm-topics-scroll-track">
            {filteredTopics.map((topic) => {
              const isSelected = activeHubTopic?.id === topic.id
              return (
                <button
                  key={topic.id}
                  type="button"
                  className={`qm-hub-topic-tab ${isSelected ? 'active' : ''}`}
                  onClick={() => setSelectedHubTopic(topic.id)}
                >
                  <span className="qm-hub-tab-icon">{topic.icon}</span>
                  <div className="qm-hub-tab-info">
                    <span className="qm-hub-tab-name">{topic.name}</span>
                    <span className="qm-hub-tab-badge">
                      {topic.modules.length} {topic.modules.length === 1 ? 'Module' : 'Modules'}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>

          <button
            type="button"
            className="qm-carousel-arrow right"
            onClick={() => scrollTopics('right')}
            title="Scroll Right"
          >
            ›
          </button>
        </div>

        {/* ACTIVE TOPIC MODULES GRID */}
        {activeHubTopic ? (
          <div className="qm-hub-active-topic-container">
            <div className="qm-hub-topic-banner">
              <div className="qm-hub-banner-left">
                <div className="qm-hub-banner-icon-box">
                  <span className="qm-hub-banner-icon">{activeHubTopic.icon}</span>
                </div>
                <div className="qm-hub-banner-text">
                  <div className="qm-hub-meta-tags-row">
                    <span className="qm-hub-badge-category">{activeHubTopic.category}</span>
                    <span className="qm-hub-badge-modules">
                      <Layers size={13} />
                      <span>{activeHubTopic.modules.length} Learning Modules</span>
                    </span>
                    <span className="qm-hub-badge-questions">
                      <BookOpen size={13} />
                      <span>{activeHubTopic.modules.length * 60} Practice MCQs</span>
                    </span>
                  </div>
                  <h2 className="qm-hub-banner-title">{activeHubTopic.name}</h2>
                  <p className="qm-hub-banner-desc">{activeHubTopic.description}</p>
                </div>
              </div>
            </div>

            <div className="qm-hub-modules-grid">
              {activeHubTopic.modules.map((m) => (
                <div key={m.id} className="qm-hub-module-card">
                  <div className="qm-hub-mod-top-row">
                    <span className="qm-hub-mod-badge">MODULE {m.number}</span>
                    <span className="qm-hub-mod-qcount">60 Questions Total</span>
                  </div>

                  <div className="qm-hub-mod-body">
                    <h3 className="qm-hub-mod-title">{m.title}</h3>
                    {m.description && <p className="qm-hub-mod-desc">{m.description}</p>}
                  </div>

                  <div className="qm-hub-mod-tiers-wrap">
                    <span className="qm-hub-select-diff-label">Select Difficulty Tier:</span>
                    <div className="qm-hub-tier-boxes-grid">
                      <Link
                        to={`/quiz/${activeHubTopic.id}/${m.id}/easy`}
                        className="qm-hub-tier-box easy"
                      >
                        <div className="qm-tier-icon-title">
                          <Star size={14} />
                          <span>Easy</span>
                        </div>
                        <span className="qm-tier-qsubtitle">20 MCQs</span>
                      </Link>

                      <Link
                        to={`/quiz/${activeHubTopic.id}/${m.id}/intermediate`}
                        className="qm-hub-tier-box intermediate"
                      >
                        <div className="qm-tier-icon-title">
                          <Zap size={14} />
                          <span>Medium</span>
                        </div>
                        <span className="qm-tier-qsubtitle">20 MCQs</span>
                      </Link>

                      <Link
                        to={`/quiz/${activeHubTopic.id}/${m.id}/hard`}
                        className="qm-hub-tier-box hard"
                      >
                        <div className="qm-tier-icon-title">
                          <Trophy size={14} />
                          <span>Hard</span>
                        </div>
                        <span className="qm-tier-qsubtitle">20 MCQs</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="qm-card p-8 text-center flex flex-col items-center gap-3 mt-4">
            <span className="text-3xl">🔍</span>
            <h3 className="font-bold text-lg">No modules found</h3>
            <p className="text-sm text-slate-500 max-w-md">
              No topics or learning modules match <strong>"{searchQuery}"</strong>. Try searching for "Java", "Python", "Math", or "Data Structures".
            </p>
            <button
              className="qm-btn-primary-sm"
              onClick={() => navigate('/quiz')}
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    )
  }

  const handleSelectChoice = (choiceId) => {
    if (isAnswered) return
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: choiceId,
    }))
  }

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1)
      setSeconds(15)
    } else {
      handleFinish()
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
      setSeconds(15)
    }
  }

  const handleFinish = () => {
    setIsCompleted(true)
    try {
      confetti({
        particleCount: 160,
        spread: 80,
        origin: { y: 0.6 },
      })
    } catch {}

    // Calculate score
    let scoreCount = 0
    Object.entries(selectedAnswers).forEach(([idx, choiceId]) => {
      const q = questions[Number(idx)]
      const chosen = q?.choices?.find((c) => c.id === choiceId)
      if (chosen?.is_correct) scoreCount++
    })

    // Record to persistent local store & backend
    recordQuizAttempt(
      topicData.name,
      activeModule ? activeModule.title : 'Module',
      difficulty,
      questions.length,
      scoreCount,
      user?.id,
      topicData?.id,
      activeModule?.id
    )

    // Broadcast immediate update so Dashboard, Leaderboard & Analytics sync in real-time
    window.dispatchEvent(new Event('quizmaster-stats-updated'))
    localStorage.removeItem('qm_leaderboard_cache')

    if (user) {
      api.post('/quiz/submit/', {
        subtopic_id: 1,
        topic_name: topicData.name,
        module_title: activeModule ? activeModule.title : 'Module',
        difficulty,
        score: scoreCount,
        total_questions: questions.length,
      }).then(() => {
        window.dispatchEvent(new Event('quizmaster-stats-updated'))
      }).catch(() => {})
    }
  }

  const handleDifficultyChange = (newDiff) => {
    setDifficulty(newDiff)
    setSelectedAnswers({})
    setCurrentIndex(0)
    setSeconds(15)
    setIsCompleted(false)
  }

  // Calculate score
  let scoreCount = 0
  Object.entries(selectedAnswers).forEach(([idx, choiceId]) => {
    const q = questions[Number(idx)]
    const chosen = q?.choices?.find((c) => c.id === choiceId)
    if (chosen?.is_correct) scoreCount++
  })

  const answeredCount = Object.keys(selectedAnswers).length
  const accuracyPercent = answeredCount > 0 ? Math.round((scoreCount / answeredCount) * 100) : 0

  const formatTimer = (sec) => {
    const s = sec < 10 ? `0${sec}` : `${sec}`
    return `00:${s}`
  }

  if (isCompleted) {
    const finalScore = scoreCount
    const total = questions.length
    const finalPercent = total > 0 ? Math.round((finalScore / total) * 100) : 100

    return (
      <div className="qm-quiz-page-container">
        <div className="qm-quiz-result-card">
          <div className="qm-result-badge-top">
            <Award size={48} className="text-indigo" />
          </div>
          <h1>Module Quiz Completed!</h1>
          <p className="qm-result-sub">
            {topicData.name} · {activeModule ? activeModule.title : 'Module'} ({difficulty.toUpperCase()})
          </p>

          <div className="qm-score-big-wrap">
            <span className="qm-score-num">{finalPercent}%</span>
            <span className="qm-score-text">{finalScore} / {total} Questions Correct</span>
          </div>

          <div className="qm-result-stats-row">
            <div className="qm-res-stat-box">
              <span className="stat-value text-emerald">{finalScore}</span>
              <span className="stat-name">Correct</span>
            </div>
            <div className="qm-res-stat-box">
              <span className="stat-value text-rose">{total - finalScore}</span>
              <span className="stat-name">Incorrect</span>
            </div>
            <div className="qm-res-stat-box">
              <span className="stat-value text-indigo">{finalPercent}%</span>
              <span className="stat-name">Accuracy</span>
            </div>
          </div>

          <div className="qm-result-actions-row">
            <button
              className="qm-btn-outline-sm"
              onClick={() => {
                setSelectedAnswers({})
                setCurrentIndex(0)
                setSeconds(15)
                setIsCompleted(false)
              }}
            >
              <RotateCcw size={16} />
              <span>Retry Quiz</span>
            </button>
            <Link to={`/topic/${topicData.id}`} className="qm-btn-primary-sm">
              <Layers size={16} />
              <span>Back to Modules</span>
            </Link>
            <Link to="/dashboard" className="qm-btn-outline-sm">
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="qm-quiz-page-container">
      {/* TOP BAR */}
      <div className="qm-quiz-session-topbar">
        <button
          className="qm-back-to-topics-btn"
          onClick={() => navigate(`/topic/${topicData.id}`)}
        >
          <ArrowLeft size={18} />
          <span>
            {topicData.name} · {activeModule ? activeModule.title : 'Module'} <span className="qm-topbar-tier-tag">({difficulty.toUpperCase()})</span>
          </span>
        </button>

        <div className="flex items-center gap-3">
          <div className="qm-timer-pill">
            <Clock size={15} />
            <span>{formatTimer(seconds)}</span>
          </div>

          <Link to={`/topic/${topicData.id}`} className="qm-leave-quiz-btn">
            Leave Quiz
          </Link>
        </div>
      </div>

      {/* MAIN QUIZ WORKSPACE */}
      <div className="qm-quiz-layout-grid mt-4">
        {/* LEFT QUESTION CARD */}
        <div className="qm-quiz-question-card">
          <div className="qm-question-header-row">
            <span className="qm-qcount-pill">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span className="qm-qtier-label">
              {difficulty.toUpperCase()} TIER
            </span>
          </div>

          <h2 className="qm-question-text">{currentQ.text}</h2>

          {/* CODE SNIPPET */}
          {currentQ.code_snippet && (
            <div className="qm-code-box">
              <code>{currentQ.code_snippet}</code>
            </div>
          )}

          <div className="qm-options-instructions">Select one option</div>

          {/* OPTIONS LIST */}
          <div className="qm-quiz-options-list">
            {currentQ.choices?.map((choice, index) => {
              const letter = OPTION_LETTERS[index] || 'A'
              const isSelected = currentSelectedChoiceId === choice.id
              const isCorrect = choice.is_correct

              let btnClass = 'qm-choice-card-btn'
              if (isAnswered) {
                if (isCorrect) {
                  btnClass += ' correct'
                } else if (isSelected && !isCorrect) {
                  btnClass += ' wrong'
                } else {
                  btnClass += ' dimmed'
                }
              }

              return (
                <button
                  key={choice.id || index}
                  type="button"
                  className={btnClass}
                  onClick={() => handleSelectChoice(choice.id)}
                  disabled={isAnswered}
                >
                  <span className="qm-letter-badge">{letter}</span>
                  <span className="qm-choice-label">{choice.text}</span>

                  {isAnswered && isCorrect && (
                    <div className="qm-choice-status-icon correct">
                      <Check size={16} />
                    </div>
                  )}
                  {isAnswered && isSelected && !isCorrect && (
                    <div className="qm-choice-status-icon wrong">
                      <X size={16} />
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          {/* EXPLANATION NOTE */}
          {isAnswered && currentQ.explanation && (
            <div className="qm-explanation-bubble">
              <strong>Explanation:</strong> {currentQ.explanation}
            </div>
          )}

          {/* BOTTOM BUTTONS */}
          <div className="qm-quiz-footer-nav">
            <button
              className="qm-btn-outline-prev"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
            >
              Previous
            </button>

            <button className="qm-btn-primary-next" onClick={handleNext}>
              {currentIndex + 1 < questions.length ? 'Next' : 'Finish Quiz'}
            </button>
          </div>
        </div>

        {/* RIGHT SIDEBAR WIDGET */}
        <div className="qm-quiz-sidebar-widgets">
          {/* QUIZ INFO */}
          <div className="qm-widget-card">
            <h3 className="qm-widget-title">Quiz Info</h3>
            <div className="qm-info-stat-row">
              <span className="qm-info-label">Score</span>
              <span className="qm-info-value">
                {scoreCount} / {questions.length}
              </span>
            </div>
            <div className="qm-info-stat-row">
              <span className="qm-info-label">Accuracy</span>
              <span className="qm-info-value">{accuracyPercent}%</span>
            </div>
          </div>

          {/* QUESTION NAVIGATOR */}
          <div className="qm-widget-card">
            <h3 className="qm-widget-title">Question Navigator</h3>
            <div className="qm-navigator-grid">
              {questions.map((_, i) => {
                const answered = selectedAnswers[i] !== undefined
                const isCurrent = currentIndex === i

                let navClass = 'qm-nav-num-btn'
                if (isCurrent) navClass += ' current'
                else if (answered) navClass += ' answered'
                else navClass += ' unanswered'

                return (
                  <button
                    key={i}
                    className={navClass}
                    onClick={() => setCurrentIndex(i)}
                  >
                    {i + 1}
                  </button>
                )
              })}
            </div>

            <div className="qm-navigator-legend">
              <div className="qm-legend-item">
                <span className="legend-dot green" />
                <span>Answered</span>
              </div>
              <div className="qm-legend-item">
                <span className="legend-dot blue" />
                <span>Current</span>
              </div>
              <div className="qm-legend-item">
                <span className="legend-dot gray" />
                <span>Unanswered</span>
              </div>
            </div>
          </div>

          {/* TIP CARD */}
          <div className="qm-tip-card">
            <div className="qm-tip-header">
              <Lightbulb size={18} className="text-amber" />
              <span>Tip</span>
            </div>
            <p>
              Practice {difficulty} questions first, then level up to intermediate and hard!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
