import { useEffect, useState, useMemo, useCallback } from 'react'
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
  BookOpen,
  Flag,
  ChevronRight,
  Flame,
  Coins
} from 'lucide-react'
import { TOPIC_MODULES } from '../data/topicModules'
import RetroIcon from '../components/RetroIcon'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { recordQuizAttempt } from '../lib/userStats'
import soundFx from '../lib/soundFx'

const OPTION_LETTERS = ['A', 'B', 'C', 'D']

export default function Quiz() {
  const { topicId, moduleId, difficulty: initialDiff } = useParams()
  const { user, addCoins } = useAuth()
  const navigate = useNavigate()

  const [difficulty, setDifficulty] = useState(initialDiff || 'easy')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({}) // { [index]: choiceId }
  const [flaggedQuestions, setFlaggedQuestions] = useState({}) // { [index]: bool }
  const [seconds, setSeconds] = useState(20)
  const [isCompleted, setIsCompleted] = useState(false)
  const [combo, setCombo] = useState(0)
  const [sessionPoints, setSessionPoints] = useState(0)
  const [reviewMode, setReviewMode] = useState(false)

  // Synchronize state whenever route parameters change
  useEffect(() => {
    setDifficulty(initialDiff || 'easy')
    setCurrentIndex(0)
    setSelectedAnswers({})
    setFlaggedQuestions({})
    setSeconds(20)
    setIsCompleted(false)
    setCombo(0)
    setSessionPoints(0)
    setReviewMode(false)
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
    if (isCompleted || !topicId || !moduleId || isAnswered) return
    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          soundFx.playWrong()
          return 0
        }
        if (prev <= 6) {
          soundFx.playTick(true)
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [currentIndex, isCompleted, topicId, moduleId, isAnswered])

  // Answer handler
  const handleSelectChoice = useCallback((choice) => {
    if (isAnswered || isCompleted) return

    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: choice.id,
    }))

    if (choice.is_correct) {
      soundFx.playCorrect()
      const newCombo = combo + 1
      setCombo(newCombo)
      if (newCombo >= 2) soundFx.playCombo(newCombo)

      const multiplier = newCombo >= 3 ? 2 : newCombo >= 2 ? 1.5 : 1
      const points = Math.round((100 + seconds * 5) * multiplier)
      setSessionPoints((prev) => prev + points)
    } else {
      soundFx.playWrong()
      setCombo(0)
    }
  }, [currentIndex, isAnswered, isCompleted, combo, seconds])

  // Keyboard controls for retro feel (A/B/C/D or 1/2/3/4, Right arrow for next)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isCompleted) return
      const key = e.key.toUpperCase()

      if (!isAnswered && currentQ.choices) {
        if (key === 'A' || key === '1') handleSelectChoice(currentQ.choices[0])
        else if (key === 'B' || key === '2') handleSelectChoice(currentQ.choices[1])
        else if (key === 'C' || key === '3') handleSelectChoice(currentQ.choices[2])
        else if (key === 'D' || key === '4') handleSelectChoice(currentQ.choices[3])
      }

      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        if (isAnswered) handleNext()
      } else if (e.key === 'ArrowLeft') {
        handlePrevious()
      } else if (key === 'F') {
        toggleFlag()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isAnswered, isCompleted, currentQ, handleSelectChoice])

  const toggleFlag = () => {
    soundFx.playSelect()
    setFlaggedQuestions((prev) => ({
      ...prev,
      [currentIndex]: !prev[currentIndex],
    }))
  }

  const handleNext = () => {
    soundFx.playSelect()
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1)
      setSeconds(20)
    } else {
      handleFinish()
    }
  }

  const handlePrevious = () => {
    soundFx.playSelect()
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
      setSeconds(20)
    }
  }

  const handleFinish = () => {
    setIsCompleted(true)
    soundFx.playVictory()

    try {
      confetti({
        particleCount: 180,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#ff007f', '#00f0ff', '#ffe600', '#39ff14', '#9d4edd'],
      })
    } catch {}

    // Calculate score
    let scoreCount = 0
    Object.entries(selectedAnswers).forEach(([idx, choiceId]) => {
      const q = questions[Number(idx)]
      const chosen = q?.choices?.find((c) => c.id === choiceId)
      if (chosen?.is_correct) scoreCount++
    })

    const attemptResult = recordQuizAttempt(
      topicData.name,
      activeModule ? activeModule.title : 'Module',
      difficulty,
      questions.length,
      scoreCount,
      user?.id,
      topicData?.id,
      activeModule?.id,
      sessionPoints
    )

    if (attemptResult.coinsEarned && addCoins) {
      addCoins(attemptResult.coinsEarned)
    }

    window.dispatchEvent(new Event('quizmaster-stats-updated'))
    localStorage.removeItem('qm_leaderboard_cache')

    if (user && !user.isGuest) {
      api.post('/quiz/submit/', {
        subtopic_id: 1,
        topic_name: topicData.name,
        module_title: activeModule ? activeModule.title : 'Module',
        difficulty,
        score: scoreCount,
        total_questions: questions.length,
      }).catch(() => {})
    }
  }

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  // Calculate results
  const finalScore = useMemo(() => {
    let count = 0
    Object.entries(selectedAnswers).forEach(([idx, choiceId]) => {
      const q = questions[Number(idx)]
      const chosen = q?.choices?.find((c) => c.id === choiceId)
      if (chosen?.is_correct) count++
    })
    return count
  }, [selectedAnswers, questions])

  const finalPercent = questions.length > 0 ? Math.round((finalScore / questions.length) * 100) : 0

  const rankBadge = useMemo(() => {
    if (finalPercent >= 90) return { rank: 'S-RANK', label: 'RETRO MASTER 👑', color: 'var(--neon-yellow)' }
    if (finalPercent >= 75) return { rank: 'A-RANK', label: 'ARCADE PRO ⚡', color: 'var(--neon-cyan)' }
    if (finalPercent >= 60) return { rank: 'B-RANK', label: 'SOLID RUN 👾', color: 'var(--neon-green)' }
    return { rank: 'C-RANK', label: 'INSERT COIN TO RETRY 🕹️', color: 'var(--neon-pink)' }
  }, [finalPercent])

  // IF NO TOPIC/MODULE SELECTED (SHOW ARCADE HUB)
  const [searchParams] = useSearchParams()
  const searchQuery = (searchParams.get('q') || '').toLowerCase().trim()
  const [selectedHubTopic, setSelectedHubTopic] = useState('java')

  const allTopicList = useMemo(() => Object.values(TOPIC_MODULES), [])
  const filteredTopics = useMemo(() => {
    if (!searchQuery) return allTopicList
    return allTopicList.filter((topic) =>
      topic.name.toLowerCase().includes(searchQuery) ||
      topic.category.toLowerCase().includes(searchQuery)
    )
  }, [searchQuery, allTopicList])

  const hubActiveTopic = TOPIC_MODULES[selectedHubTopic] || TOPIC_MODULES.java

  if (!topicId || !moduleId) {
    return (
      <div className="retro-quiz-container">
        <div style={{ marginBottom: '28px' }}>
          <div className="hero-tag-badge">
            <span>🕹️</span>
            <span>ARCADE CARTRIDGE SELECTOR</span>
          </div>
          <h1 className="section-retro-title">CHOOSE YOUR CHALLENGE</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '6px' }}>
            Select a subject cartridge, pick a module, and start your 20-MCQ speed run!
          </p>
        </div>

        {/* TOPIC SELECTOR CHIPS */}
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '14px', marginBottom: '24px' }}>
          {filteredTopics.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                soundFx.playSelect()
                setSelectedHubTopic(t.id)
              }}
              className="retro-tool-btn"
              style={{
                background: selectedHubTopic === t.id ? 'var(--neon-yellow)' : 'var(--bg-card)',
                color: selectedHubTopic === t.id ? '#000' : 'var(--text-primary)',
                borderColor: '#000',
                padding: '10px 16px',
                fontSize: '11px',
                whiteSpace: 'nowrap',
              }}
            >
              <RetroIcon topicId={t.id} category={t.category} size="sm" badge={false} />
              <span>{t.name}</span>
            </button>
          ))}
        </div>

        {/* MODULE CARDS FOR SELECTED TOPIC */}
        <div className="quiz-hub-grid">
          {hubActiveTopic.modules.map((m) => (
            <div key={m.id} className="retro-cartridge-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span className="arcade-tag-chip">MODULE {m.number}</span>
                <RetroIcon topicId={hubActiveTopic.id} category={hubActiveTopic.category} size="md" />
              </div>

              <h3 className="cartridge-title" style={{ fontSize: '18px' }}>{m.title}</h3>
              <p className="cartridge-desc" style={{ marginBottom: '20px' }}>{m.description}</p>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <Link
                  to={`/quiz/${hubActiveTopic.id}/${m.id}/easy`}
                  className="btn-retro-secondary"
                  style={{ flex: 1, minWidth: '75px', textAlign: 'center', justifyContent: 'center', padding: '10px 8px', fontSize: '9px' }}
                  onClick={() => soundFx.playCoin()}
                >
                  EASY
                </Link>
                <Link
                  to={`/quiz/${hubActiveTopic.id}/${m.id}/intermediate`}
                  className="btn-retro-yellow"
                  style={{ flex: 1.2, minWidth: '95px', textAlign: 'center', justifyContent: 'center', padding: '10px 8px', fontSize: '9px' }}
                  onClick={() => soundFx.playCoin()}
                >
                  INTERMEDIATE
                </Link>
                <Link
                  to={`/quiz/${hubActiveTopic.id}/${m.id}/hard`}
                  className="btn-retro-primary"
                  style={{ flex: 1, minWidth: '75px', textAlign: 'center', justifyContent: 'center', padding: '10px 8px', fontSize: '9px' }}
                  onClick={() => soundFx.playCoin()}
                >
                  HARD 💀
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // STAGE CLEAR / GAME OVER SCREEN
  if (isCompleted && !reviewMode) {
    return (
      <div className="retro-quiz-container">
        <div className="stage-clear-modal">
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>🏆</div>
          <h1 className="stage-clear-title">STAGE CLEAR!</h1>
          <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-display)', fontSize: '16px' }}>
            {topicData.name} • {activeModule.title} [{difficulty.toUpperCase()}]
          </p>

          <div className="rank-badge-stamp" style={{ borderColor: rankBadge.color, color: rankBadge.color }}>
            {rankBadge.rank}
          </div>

          <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '12px', color: rankBadge.color, marginBottom: '24px' }}>
            {rankBadge.label}
          </div>

          <div className="stage-metrics-grid">
            <div className="stage-metric-card">
              <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>SCORE</div>
              <div className="metric-val" style={{ color: 'var(--neon-yellow)' }}>{sessionPoints} PTS</div>
            </div>
            <div className="stage-metric-card">
              <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>ACCURACY</div>
              <div className="metric-val" style={{ color: 'var(--neon-cyan)' }}>
                {finalPercent}% ({finalScore}/{questions.length})
              </div>
            </div>
            <div className="stage-metric-card">
              <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>COINS EARNED</div>
              <div className="metric-val" style={{ color: 'var(--neon-green)' }}>
                +{finalScore * 10 + (finalPercent === 100 ? 50 : 10)} 🪙
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => setReviewMode(true)}
              className="btn-retro-secondary"
              style={{ fontSize: '10px' }}
            >
              <Lightbulb size={14} />
              <span>REVIEW ANSWERS</span>
            </button>

            <button
              onClick={() => {
                soundFx.playCoin()
                setSelectedAnswers({})
                setFlaggedQuestions({})
                setCurrentIndex(0)
                setSeconds(20)
                setIsCompleted(false)
                setCombo(0)
                setSessionPoints(0)
              }}
              className="btn-retro-yellow"
              style={{ fontSize: '10px' }}
            >
              <RotateCcw size={14} />
              <span>REPLAY RUN</span>
            </button>

            <Link
              to={`/topic/${topicData.id}`}
              className="btn-retro-outline"
              style={{ fontSize: '10px' }}
              onClick={() => soundFx.playSelect()}
            >
              <Layers size={14} />
              <span>MODULES</span>
            </Link>

            <Link
              to="/dashboard"
              className="btn-retro-primary"
              style={{ fontSize: '10px' }}
              onClick={() => soundFx.playSelect()}
            >
              <Trophy size={14} />
              <span>DASHBOARD</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // ACTIVE RETRO QUIZ RUNNER
  return (
    <div className="retro-quiz-container">
      {/* ARCADE HUD HEADER */}
      <div className="arcade-hud-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => {
              soundFx.playSelect()
              if (reviewMode) {
                setReviewMode(false)
              } else {
                navigate(`/topic/${topicData.id}`)
              }
            }}
            className={`retro-tool-btn ${reviewMode ? 'active' : ''}`}
            title={reviewMode ? 'Exit preview' : 'Return to topic syllabus'}
          >
            <ArrowLeft size={14} />
            <span>EXIT</span>
          </button>

          {reviewMode && (
            <span className="arcade-tag-chip" style={{ background: 'var(--neon-cyan)', color: '#000' }}>
              PREVIEW MODE
            </span>
          )}

          <div className="hud-stat-box">
            <span className="hud-label">1UP SCORE</span>
            <span className="hud-val-yellow">{sessionPoints}</span>
          </div>

          <div className="hud-stat-box">
            <span className="hud-label">STAGE</span>
            <span className="hud-val-cyan">{currentIndex + 1} / {questions.length}</span>
          </div>
        </div>

        {/* MIDDLE: COMBO MULTIPLIER */}
        {combo >= 2 && (
          <div className="combo-multiplier-pill">
            🔥 {combo}x STREAK COMBO!
          </div>
        )}

        {/* RIGHT: TIMER & ACTIONS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="hud-timer-wrap">
            <Clock size={14} color="var(--neon-cyan)" />
            <span className={`timer-digits ${seconds <= 5 ? 'urgent' : ''}`}>
              {formatTimer(seconds)}
            </span>
          </div>

          <button
            type="button"
            onClick={toggleFlag}
            className={`retro-tool-btn ${flaggedQuestions[currentIndex] ? 'active' : ''}`}
            title="Flag question for review"
          >
            <Flag size={13} fill={flaggedQuestions[currentIndex] ? '#fff' : 'none'} />
            <span>{flaggedQuestions[currentIndex] ? 'FLAGGED' : 'FLAG'}</span>
          </button>
        </div>
      </div>

      {/* QUESTION CARD */}
      <div className="arcade-question-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div className="q-category-tag" style={{ gap: '10px' }}>
            <RetroIcon topicId={topicData.id} category={topicData.category} size="sm" />
            <span>{topicData.name} • {activeModule.title}</span>
          </div>
          <span className="arcade-tag-chip" style={{ background: difficulty === 'hard' ? 'var(--neon-pink)' : difficulty === 'intermediate' ? 'var(--neon-yellow)' : 'var(--neon-green)', color: '#000' }}>
            {difficulty.toUpperCase()} TIER
          </span>
        </div>

        <h2 className="q-main-title">{currentQ.text}</h2>

        {/* CODE SNIPPET (IF ANY) */}
        {currentQ.code_snippet && (
          <pre className="q-code-snippet">
            <code>{currentQ.code_snippet}</code>
          </pre>
        )}

        {/* CHOICES GRID */}
        <div className="arcade-choices-grid">
          {currentQ.choices?.map((choice, idx) => {
            const letter = OPTION_LETTERS[idx] || 'A'
            const isSelected = currentSelectedChoiceId === choice.id
            const isCorrect = choice.is_correct

            let choiceStatus = ''
            if (isAnswered) {
              if (isCorrect) choiceStatus = 'correct'
              else if (isSelected) choiceStatus = 'wrong'
            } else if (isSelected) {
              choiceStatus = 'selected'
            }

            return (
              <button
                key={choice.id || idx}
                className={`arcade-choice-btn ${choiceStatus}`}
                onClick={() => handleSelectChoice(choice)}
                disabled={isAnswered}
              >
                <div className="choice-key-box">{letter}</div>
                <div style={{ flex: 1 }}>{choice.text}</div>
                {isAnswered && isCorrect && <Check size={18} color="#000" />}
                {isAnswered && isSelected && !isCorrect && <X size={18} color="#fff" />}
              </button>
            )
          })}
        </div>

        {/* RETRO EXPLANATION (REVEALED AFTER ANSWERING) */}
        {isAnswered && (
          <div className="arcade-explanation-box">
            <div className="explanation-header">
              <Lightbulb size={14} />
              <span>EXPLANATION // RETRO INTEL</span>
            </div>
            <p className="explanation-body">
              {currentQ.explanation || 'Reviewing concepts and deterministic logic reinforces long-term retention.'}
            </p>
          </div>
        )}
      </div>

      {/* NAVIGATION CONTROLS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="btn-retro-outline"
          style={{ opacity: currentIndex === 0 ? 0.4 : 1, fontSize: '10px' }}
        >
          ← PREV
        </button>

        <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '9px', color: 'var(--text-muted)' }}>
          PRESS [A, B, C, D] OR [1, 2, 3, 4] • [ENTER] TO ADVANCE
        </div>

        {reviewMode ? (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {currentIndex + 1 < questions.length && (
              <button
                onClick={handleNext}
                className="btn-retro-yellow"
                style={{ fontSize: '10px' }}
              >
                <span>NEXT →</span>
              </button>
            )}
            <button
              onClick={() => {
                soundFx.playSelect()
                setReviewMode(false)
              }}
              className="btn-retro-primary"
              style={{ fontSize: '10px' }}
            >
              <span>EXIT</span>
            </button>
          </div>
        ) : currentIndex + 1 < questions.length ? (
          <button
            onClick={handleNext}
            className="btn-retro-yellow"
            style={{ fontSize: '10px' }}
          >
            <span>NEXT →</span>
          </button>
        ) : (
          <button
            onClick={handleFinish}
            className="btn-retro-primary"
            style={{ fontSize: '10px' }}
          >
            <span>SUBMIT RUN 🏆</span>
          </button>
        )}
      </div>

      {/* 20-QUESTION MATRIX GRID */}
      <div style={{ background: '#000', border: '3px solid #000', borderRadius: 'var(--radius-lg)', padding: '16px' }}>
        <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '9px', color: 'var(--neon-cyan)', marginBottom: '12px', textAlign: 'center' }}>
          QUESTION MATRIX (1 — {questions.length})
        </div>
        <div className="quiz-matrix-bar">
          {questions.map((_, i) => {
            const chosenId = selectedAnswers[i]
            const qObj = questions[i]
            const isQAnswered = chosenId !== undefined
            const isQCorrect = qObj?.choices?.find((c) => c.id === chosenId)?.is_correct

            let matrixClass = 'matrix-btn'
            if (i === currentIndex) matrixClass += ' current'
            if (isQAnswered) {
              matrixClass += isQCorrect ? ' answered-correct' : ' answered-wrong'
            }

            return (
              <button
                key={i}
                className={matrixClass}
                onClick={() => {
                  soundFx.playSelect()
                  setCurrentIndex(i)
                  setSeconds(20)
                }}
                title={`Question ${i + 1}`}
              >
                {flaggedQuestions[i] ? '🚩' : i + 1}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
