import { useState, useEffect, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Play,
  CheckCircle2,
  Trophy,
  Layers,
  Sparkles,
  Zap
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import {
  getCompletedModules,
  getTopicCompletion,
  isStageCompleted,
  getStageTierStats,
} from '../lib/userStats'
import { TOPIC_MODULES } from '../data/topicModules'
import RetroIcon from '../components/RetroIcon'
import soundFx from '../lib/soundFx'

export default function TopicDetail() {
  const { topicId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [completedModules, setCompletedModules] = useState(() => getCompletedModules(user?.id))

  useEffect(() => {
    setCompletedModules(getCompletedModules(user?.id))
    const handleSync = () => setCompletedModules(getCompletedModules(user?.id))
    window.addEventListener('quizmaster-stats-updated', handleSync)
    return () => window.removeEventListener('quizmaster-stats-updated', handleSync)
  }, [user])

  const key = (topicId || 'java').toLowerCase().replace(/[^a-z0-9]/g, '')
  const topic = TOPIC_MODULES[key] || TOPIC_MODULES.java

  const totalQuestions = topic.modules.reduce((acc, m) => {
    const easyCount = m.difficulties?.easy?.length || 20
    const medCount = m.difficulties?.intermediate?.length || 20
    const hardCount = m.difficulties?.hard?.length || 20
    return acc + easyCount + medCount + hardCount
  }, 0)

  const topicCompletion = useMemo(() => {
    return getTopicCompletion(user?.id, topic)
  }, [user, topic, completedModules])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* BACK BUTTON */}
      <button
        onClick={() => {
          soundFx.playSelect()
          navigate('/topics')
        }}
        className="retro-tool-btn"
        style={{ width: 'fit-content' }}
      >
        <ArrowLeft size={14} />
        <span>← BACK TO CARTRIDGES</span>
      </button>

      {/* TOPIC BANNER */}
      <div
        style={{
          background: '#000000',
          border: topicCompletion.isMastered
            ? '4px solid var(--neon-yellow)'
            : '4px solid var(--neon-cyan)',
          boxShadow: topicCompletion.isMastered
            ? '8px 8px 0px var(--neon-yellow)'
            : '8px 8px 0px var(--neon-cyan)',
          borderRadius: 'var(--radius-xl)',
          padding: '32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
            <RetroIcon topicId={topic.id} category={topic.category} size="xl" />
            <span className="arcade-tag-chip" style={{ background: 'var(--neon-yellow)' }}>
              {topic.category}
            </span>
            {topicCompletion.isMastered && (
              <span className="arcade-tag-chip" style={{ background: 'var(--neon-yellow)', color: '#000', fontWeight: 'bold' }}>
                ★ 100% MASTERED
              </span>
            )}
          </div>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: '900', color: '#fff' }}>
            {topic.name}
          </h1>

          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', maxWidth: '600px', marginTop: '6px' }}>
            {topic.description}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {/* MASTERY STAT */}
          <div style={{ background: 'var(--bg-card)', border: '2px solid #333', padding: '14px 20px', borderRadius: 'var(--radius-md)', textAlign: 'center', fontFamily: 'var(--font-pixel)', minWidth: '130px' }}>
            <div style={{ fontSize: '8px', color: 'var(--text-muted)' }}>TOPIC MASTERY</div>
            <div style={{ fontSize: '18px', color: topicCompletion.isMastered ? 'var(--neon-yellow)' : 'var(--neon-green)', marginTop: '4px' }}>
              {topicCompletion.percent}%
            </div>
            <div style={{ fontSize: '8px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {topicCompletion.completedCount}/{topic.modules.length} CLEARED
            </div>
          </div>

          <div style={{ background: 'var(--bg-card)', border: '2px solid #333', padding: '14px 20px', borderRadius: 'var(--radius-md)', textAlign: 'center', fontFamily: 'var(--font-pixel)' }}>
            <div style={{ fontSize: '8px', color: 'var(--text-muted)' }}>MODULES</div>
            <div style={{ fontSize: '18px', color: 'var(--neon-yellow)', marginTop: '4px' }}>
              {topic.modules.length}
            </div>
          </div>

          <div style={{ background: 'var(--bg-card)', border: '2px solid #333', padding: '14px 20px', borderRadius: 'var(--radius-md)', textAlign: 'center', fontFamily: 'var(--font-pixel)' }}>
            <div style={{ fontSize: '8px', color: 'var(--text-muted)' }}>TOTAL MCQS</div>
            <div style={{ fontSize: '18px', color: 'var(--neon-cyan)', marginTop: '4px' }}>
              {totalQuestions}
            </div>
          </div>
        </div>
      </div>

      {/* MODULE LIST */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 'bold' }}>
            STAGE MODULES (SYLLABUS)
          </h2>
          <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '9px', color: 'var(--neon-cyan)' }}>
            {topicCompletion.completedCount} OF {topic.modules.length} STAGES CLEARED
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {topic.modules.map((m) => {
            const easyStats = getStageTierStats(completedModules, topic.id, m, 'easy')
            const medStats = getStageTierStats(completedModules, topic.id, m, 'intermediate')
            const hardStats = getStageTierStats(completedModules, topic.id, m, 'hard')
            const stageDone = isStageCompleted(completedModules, topic.id, m)

            return (
              <div
                key={m.id}
                style={{
                  background: 'var(--bg-card)',
                  border: stageDone ? '3px solid var(--neon-green)' : '3px solid #000000',
                  boxShadow: stageDone ? '4px 4px 0px var(--neon-green)' : '4px 4px 0px #000000',
                  borderRadius: 'var(--radius-lg)',
                  padding: '24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '20px',
                }}
              >
                <div style={{ flex: 1, minWidth: '240px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <RetroIcon stageNumber={m.number} topicId={topic.id} size="md" />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span className="arcade-tag-chip" style={{ background: 'var(--neon-pink)', color: '#fff' }}>
                          STAGE {m.number}
                        </span>
                        {stageDone && (
                          <span
                            className="arcade-tag-chip"
                            style={{
                              background: 'rgba(57, 255, 20, 0.2)',
                              color: 'var(--neon-green)',
                              borderColor: 'var(--neon-green)',
                              fontWeight: 'bold',
                            }}
                          >
                            ✓ CLEARED
                          </span>
                        )}
                      </div>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 'bold', color: '#fff', marginTop: '2px' }}>
                        {m.title}
                      </h3>
                    </div>
                  </div>

                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                    {m.description}
                  </p>

                  {/* Completion status pills */}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                    {easyStats && (
                      <span className="arcade-tag-chip" style={{ background: 'rgba(57, 255, 20, 0.2)', color: 'var(--neon-green)', borderColor: 'var(--neon-green)' }}>
                        ✓ EASY ({easyStats.percent}%)
                      </span>
                    )}
                    {medStats && (
                      <span className="arcade-tag-chip" style={{ background: 'rgba(255, 230, 0, 0.2)', color: 'var(--neon-yellow)', borderColor: 'var(--neon-yellow)' }}>
                        ✓ MED ({medStats.percent}%)
                      </span>
                    )}
                    {hardStats && (
                      <span className="arcade-tag-chip" style={{ background: 'rgba(255, 0, 127, 0.2)', color: 'var(--neon-pink)', borderColor: 'var(--neon-pink)' }}>
                        ✓ HARD ({hardStats.percent}%)
                      </span>
                    )}
                  </div>
                </div>

                {/* LAUNCH DIFFICULTY BUTTONS */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', width: '100%', maxWidth: '380px' }}>
                  <button
                    onClick={() => {
                      soundFx.playCoin()
                      navigate(`/quiz/${topic.id}/${m.id}/easy`)
                    }}
                    className="btn-retro-secondary"
                    style={{
                      flex: 1,
                      minWidth: '95px',
                      justifyContent: 'center',
                      padding: '10px 10px',
                      fontSize: '9px',
                      borderColor: easyStats ? 'var(--neon-green)' : undefined,
                    }}
                  >
                    <span>{easyStats ? `✓ EASY (${easyStats.percent}%)` : 'EASY TIER'}</span>
                  </button>

                  <button
                    onClick={() => {
                      soundFx.playCoin()
                      navigate(`/quiz/${topic.id}/${m.id}/intermediate`)
                    }}
                    className="btn-retro-yellow"
                    style={{
                      flex: 1.2,
                      minWidth: '110px',
                      justifyContent: 'center',
                      padding: '10px 10px',
                      fontSize: '9px',
                      borderColor: medStats ? '#000' : undefined,
                    }}
                  >
                    <span>{medStats ? `✓ MED (${medStats.percent}%)` : 'INTERMEDIATE'}</span>
                  </button>

                  <button
                    onClick={() => {
                      soundFx.playCoin()
                      navigate(`/quiz/${topic.id}/${m.id}/hard`)
                    }}
                    className="btn-retro-primary"
                    style={{
                      flex: 1,
                      minWidth: '105px',
                      justifyContent: 'center',
                      padding: '10px 10px',
                      fontSize: '9px',
                      borderColor: hardStats ? 'var(--neon-pink)' : undefined,
                    }}
                  >
                    <span>{hardStats ? `✓ HARD (${hardStats.percent}%)` : 'HARD 💀'}</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
