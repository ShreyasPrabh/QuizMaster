import { useState, useMemo, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Play,
  CheckCircle2,
  Filter,
  Sparkles,
  Layers,
  Search
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getCompletedModules, getTopicCompletion } from '../lib/userStats'
import { TOPIC_MODULES } from '../data/topicModules'
import RetroIcon from '../components/RetroIcon'
import soundFx from '../lib/soundFx'

const DOMAINS = [
  { id: 'all', name: 'ALL SUBJECTS', icon: '⭐', color: 'var(--neon-yellow)' },
  { id: 'Programming', name: 'PROGRAMMING', icon: '☕', color: 'var(--neon-pink)' },
  { id: 'Mathematics', name: 'MATHEMATICS', icon: '📐', color: 'var(--neon-cyan)' },
  { id: 'Science', name: 'SCIENCE', icon: '🔬', color: 'var(--neon-green)' },
  { id: 'Computer Science', name: 'COMPUTER SCI', icon: '💻', color: 'var(--neon-purple)' },
  { id: 'General Knowledge', name: 'GENERAL KNOWLEDGE', icon: '🌍', color: 'var(--neon-yellow)' },
  { id: 'English', name: 'ENGLISH', icon: '📖', color: 'var(--neon-orange)' },
]

export default function Topics() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const currentSearch = searchParams.get('q') || ''
  const [selectedDomain, setSelectedDomain] = useState('all')
  const [completionFilter, setCompletionFilter] = useState('all') // 'all', 'in_progress', 'mastered'

  const [completedModules, setCompletedModules] = useState(() => getCompletedModules(user?.id))

  useEffect(() => {
    setCompletedModules(getCompletedModules(user?.id))
    const handleSync = () => setCompletedModules(getCompletedModules(user?.id))
    window.addEventListener('quizmaster-stats-updated', handleSync)
    return () => window.removeEventListener('quizmaster-stats-updated', handleSync)
  }, [user])

  const allTopics = useMemo(() => Object.values(TOPIC_MODULES), [])

  const filteredTopics = useMemo(() => {
    return allTopics.filter((topic) => {
      const matchesSearch =
        !currentSearch ||
        topic.name.toLowerCase().includes(currentSearch.toLowerCase()) ||
        topic.category.toLowerCase().includes(currentSearch.toLowerCase()) ||
        topic.description.toLowerCase().includes(currentSearch.toLowerCase())

      const matchesDomain =
        selectedDomain === 'all' ||
        topic.category.toLowerCase() === selectedDomain.toLowerCase()

      if (!matchesSearch || !matchesDomain) return false

      if (completionFilter !== 'all') {
        const comp = getTopicCompletion(user?.id, topic)
        if (completionFilter === 'mastered' && !comp.isMastered) return false
        if (completionFilter === 'in_progress' && (comp.completedCount === 0 || comp.isMastered)) return false
      }

      return true
    })
  }, [allTopics, currentSearch, selectedDomain, completionFilter, completedModules, user])

  const statsSummary = useMemo(() => {
    let masteredCount = 0
    let inProgressCount = 0
    allTopics.forEach((t) => {
      const c = getTopicCompletion(user?.id, t)
      if (c.isMastered) masteredCount++
      else if (c.completedCount > 0) inProgressCount++
    })
    return { masteredCount, inProgressCount, totalCount: allTopics.length }
  }, [allTopics, user, completedModules])

  const handleDomainSelect = (domainId) => {
    soundFx.playSelect()
    setSelectedDomain(domainId)
  }

  const handleCompletionFilterSelect = (filterId) => {
    soundFx.playSelect()
    setCompletionFilter(filterId)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="hero-tag-badge">
            <span>💾</span>
            <span>60+ SUBTOPICS • 1,200+ MCQS • CLOUD SYNC ACTIVE</span>
          </div>
          <h1 className="section-retro-title">CARTRIDGE LIBRARY</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            Choose a subject cartridge to explore modules and test your mastery.
          </p>
        </div>

        {/* COMPLETION QUICK COUNTERS */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ background: 'var(--bg-card)', border: '2px solid #333', padding: '8px 14px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-pixel)', fontSize: '9px' }}>
            <span style={{ color: 'var(--neon-green)' }}>⚡</span>
            <span>IN PROGRESS: <strong style={{ color: 'var(--neon-cyan)' }}>{statsSummary.inProgressCount}</strong></span>
          </div>
          <div style={{ background: 'var(--bg-card)', border: '2px solid #333', padding: '8px 14px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-pixel)', fontSize: '9px' }}>
            <span style={{ color: 'var(--neon-yellow)' }}>★</span>
            <span>MASTERED: <strong style={{ color: 'var(--neon-yellow)' }}>{statsSummary.masteredCount}</strong></span>
          </div>
        </div>
      </div>

      {/* FILTER CONTROLS BAR */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* DOMAIN FILTERS */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {DOMAINS.map((dom) => (
            <button
              key={dom.id}
              onClick={() => handleDomainSelect(dom.id)}
              className="retro-tool-btn"
              style={{
                background: selectedDomain === dom.id ? dom.color : 'var(--bg-card)',
                color: selectedDomain === dom.id ? '#000' : '#fff',
                borderColor: '#000',
                padding: '8px 14px',
                fontSize: '10px',
              }}
            >
              <span>{dom.icon}</span>
              <span>{dom.name}</span>
            </button>
          ))}
        </div>

        {/* STATUS FILTER PILLS */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '8px', color: 'var(--text-muted)', marginRight: '4px' }}>
            STATUS:
          </span>
          <button
            onClick={() => handleCompletionFilterSelect('all')}
            className="retro-tool-btn"
            style={{
              padding: '6px 12px',
              fontSize: '9px',
              background: completionFilter === 'all' ? 'var(--neon-cyan)' : 'var(--bg-card)',
              color: completionFilter === 'all' ? '#000' : '#fff',
              borderColor: completionFilter === 'all' ? 'var(--neon-cyan)' : '#333',
            }}
          >
            <span>ALL CARTRIDGES ({allTopics.length})</span>
          </button>
          <button
            onClick={() => handleCompletionFilterSelect('in_progress')}
            className="retro-tool-btn"
            style={{
              padding: '6px 12px',
              fontSize: '9px',
              background: completionFilter === 'in_progress' ? 'var(--neon-pink)' : 'var(--bg-card)',
              color: completionFilter === 'in_progress' ? '#fff' : 'var(--text-secondary)',
              borderColor: completionFilter === 'in_progress' ? 'var(--neon-pink)' : '#333',
            }}
          >
            <span>⚡ IN PROGRESS ({statsSummary.inProgressCount})</span>
          </button>
          <button
            onClick={() => handleCompletionFilterSelect('mastered')}
            className="retro-tool-btn"
            style={{
              padding: '6px 12px',
              fontSize: '9px',
              background: completionFilter === 'mastered' ? 'var(--neon-yellow)' : 'var(--bg-card)',
              color: completionFilter === 'mastered' ? '#000' : 'var(--text-secondary)',
              borderColor: completionFilter === 'mastered' ? 'var(--neon-yellow)' : '#333',
            }}
          >
            <span>★ MASTERED ({statsSummary.masteredCount})</span>
          </button>
        </div>
      </div>

      {/* TOPICS CARTRIDGE GRID */}
      {filteredTopics.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', background: 'var(--bg-card)', border: '3px solid #000', borderRadius: 'var(--radius-xl)' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔍</div>
          <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '14px', color: 'var(--neon-yellow)' }}>
            NO CARTRIDGES FOUND
          </div>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
            No topics matched your search or status filter. Try resetting filters.
          </p>
          <button
            onClick={() => {
              setSearchParams({})
              setSelectedDomain('all')
              setCompletionFilter('all')
            }}
            className="btn-retro-yellow"
            style={{ marginTop: '16px', fontSize: '10px' }}
          >
            RESET FILTERS
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '22px' }}>
          {filteredTopics.map((topic) => {
            const moduleCount = topic.modules?.length || 0
            const totalMCQs = moduleCount * 20
            const comp = getTopicCompletion(user?.id, topic)

            return (
              <div
                key={topic.id}
                className="retro-cartridge-card"
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: comp.isMastered
                    ? '3px solid var(--neon-yellow)'
                    : comp.completedCount > 0
                    ? '3px solid var(--neon-cyan)'
                    : '3px solid #000',
                  boxShadow: comp.isMastered
                    ? '5px 5px 0px var(--neon-yellow)'
                    : comp.completedCount > 0
                    ? '5px 5px 0px var(--neon-cyan)'
                    : '5px 5px 0px #000',
                }}
                onClick={() => {
                  soundFx.playCoin()
                  navigate(`/topic/${topic.id}`)
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <span className="arcade-tag-chip" style={{ background: 'var(--neon-yellow)' }}>
                        {topic.category}
                      </span>
                      {comp.isMastered && (
                        <span className="arcade-tag-chip" style={{ background: 'var(--neon-yellow)', color: '#000', fontWeight: 'bold' }}>
                          ★ MASTERED
                        </span>
                      )}
                      {!comp.isMastered && comp.completedCount > 0 && (
                        <span className="arcade-tag-chip" style={{ background: 'rgba(0, 240, 255, 0.2)', color: 'var(--neon-cyan)', borderColor: 'var(--neon-cyan)' }}>
                          ⚡ {comp.completedCount}/{moduleCount}
                        </span>
                      )}
                    </div>
                    <RetroIcon topicId={topic.id} category={topic.category} size="lg" />
                  </div>

                  <h3 className="cartridge-title" style={{ fontSize: '20px' }}>
                    {topic.name}
                  </h3>

                  <p className="cartridge-desc" style={{ marginBottom: '18px' }}>
                    {topic.description}
                  </p>
                </div>

                <div>
                  {/* COMPLETION PROGRESS BAR */}
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'var(--font-pixel)', fontSize: '8px', marginBottom: '5px' }}>
                      <span style={{ color: comp.isMastered ? 'var(--neon-yellow)' : 'var(--text-muted)' }}>
                        {comp.isMastered ? '★ 100% CLEARED' : `${comp.completedCount}/${moduleCount} STAGES CLEARED`}
                      </span>
                      <span style={{ color: comp.percent > 0 ? 'var(--neon-green)' : 'var(--text-muted)' }}>
                        {comp.percent}%
                      </span>
                    </div>
                    <div style={{ height: '5px', background: '#1c1c24', borderRadius: '3px', overflow: 'hidden', border: '1px solid #333' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${comp.percent}%`,
                          background: comp.isMastered ? 'var(--neon-yellow)' : 'var(--neon-green)',
                          boxShadow: comp.percent > 0 ? '0 0 8px var(--neon-green)' : 'none',
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px dashed #333', paddingTop: '10px', marginBottom: '12px', fontFamily: 'var(--font-pixel)', fontSize: '9px', color: 'var(--neon-cyan)' }}>
                    <span>{moduleCount} MODULES</span>
                    <span>{totalMCQs} MCQS</span>
                  </div>

                  {comp.isMastered ? (
                    <button
                      className="btn-retro-yellow"
                      style={{ width: '100%', padding: '10px', fontSize: '10px' }}
                      onClick={(e) => {
                        e.stopPropagation()
                        soundFx.playCoin()
                        navigate(`/topic/${topic.id}`)
                      }}
                    >
                      <CheckCircle2 size={13} />
                      <span>REVIEW MASTERED ✓</span>
                    </button>
                  ) : comp.completedCount > 0 ? (
                    <button
                      className="btn-retro-primary"
                      style={{ width: '100%', padding: '10px', fontSize: '10px' }}
                      onClick={(e) => {
                        e.stopPropagation()
                        soundFx.playCoin()
                        navigate(`/topic/${topic.id}`)
                      }}
                    >
                      <Play size={13} />
                      <span>CONTINUE RUN ({comp.percent}%) →</span>
                    </button>
                  ) : (
                    <button
                      className="btn-retro-yellow"
                      style={{ width: '100%', padding: '10px', fontSize: '10px' }}
                      onClick={(e) => {
                        e.stopPropagation()
                        soundFx.playCoin()
                        navigate(`/topic/${topic.id}`)
                      }}
                    >
                      <Play size={13} fill="#000" />
                      <span>EXPLORE MODULES</span>
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
