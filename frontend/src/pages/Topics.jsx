import { useState, useMemo } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import {
  ChevronRight,
  Layers,
  Search,
  Play,
  Zap,
  BookOpen,
  Filter
} from 'lucide-react'
import { TOPIC_MODULES } from '../data/topicModules'
import RetroIcon from '../components/RetroIcon'
import soundFx from '../lib/soundFx'

const DOMAINS = [
  { id: 'all', name: 'ALL CARTRIDGES', icon: '⭐', color: 'var(--neon-yellow)' },
  { id: 'Programming', name: 'PROGRAMMING', icon: '☕', color: 'var(--neon-pink)' },
  { id: 'Mathematics', name: 'MATHEMATICS', icon: '📐', color: 'var(--neon-cyan)' },
  { id: 'Science', name: 'SCIENCE', icon: '🔬', color: 'var(--neon-green)' },
  { id: 'Computer Science', name: 'COMPUTER SCI', icon: '💻', color: 'var(--neon-purple)' },
  { id: 'General Knowledge', name: 'GENERAL KNOWLEDGE', icon: '🌍', color: 'var(--neon-yellow)' },
  { id: 'English', name: 'ENGLISH', icon: '📖', color: 'var(--neon-orange)' },
]

export default function Topics() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const currentSearch = searchParams.get('q') || ''
  const [selectedDomain, setSelectedDomain] = useState('all')

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

      return matchesSearch && matchesDomain
    })
  }, [allTopics, currentSearch, selectedDomain])

  const handleDomainSelect = (domainId) => {
    soundFx.playSelect()
    setSelectedDomain(domainId)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="hero-tag-badge">
            <span>💾</span>
            <span>60+ SUBTOPICS • 1,200+ MCQS</span>
          </div>
          <h1 className="section-retro-title">CARTRIDGE LIBRARY</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            Choose a subject cartridge to explore modules and test your mastery.
          </p>
        </div>

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
      </div>

      {/* TOPICS CARTRIDGE GRID */}
      {filteredTopics.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', background: 'var(--bg-card)', border: '3px solid #000', borderRadius: 'var(--radius-xl)' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔍</div>
          <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '14px', color: 'var(--neon-yellow)' }}>
            NO CARTRIDGES FOUND
          </div>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
            No topics matched "{currentSearch}". Try clearing your search or picking another domain.
          </p>
          <button
            onClick={() => {
              setSearchParams({})
              setSelectedDomain('all')
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

            return (
              <div
                key={topic.id}
                className="retro-cartridge-card"
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
                onClick={() => {
                  soundFx.playCoin()
                  navigate(`/topic/${topic.id}`)
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <span className="arcade-tag-chip" style={{ background: 'var(--neon-yellow)' }}>
                      {topic.category}
                    </span>
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px dashed #333', paddingTop: '12px', marginBottom: '14px', fontFamily: 'var(--font-pixel)', fontSize: '9px', color: 'var(--neon-cyan)' }}>
                    <span>{moduleCount} MODULES</span>
                    <span>{totalMCQs} MCQS</span>
                  </div>

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
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
