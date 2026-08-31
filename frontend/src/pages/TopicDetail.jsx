import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  BookOpen,
  Layers,
  Zap,
  Clock,
  Trophy,
  ChevronRight,
  Play,
  CheckCircle2,
  Star,
  Check,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getCompletedModules } from '../lib/userStats'
import { TOPIC_MODULES } from '../data/topicModules'

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

  // Normalize topic key (e.g., 'java', 'python', 'cpp', 'algebra')
  const key = (topicId || 'java').toLowerCase().replace(/[^a-z0-9]/g, '')
  const topic = TOPIC_MODULES[key] || TOPIC_MODULES.java

  const categorySlugMap = {
    Programming: 'programming',
    Mathematics: 'mathematics',
    Science: 'science',
    'Computer Science': 'computerscience',
    'General Knowledge': 'generalknowledge',
    English: 'english',
  }
  const parentCategorySlug = categorySlugMap[topic?.category] || 'programming'

  const totalQuestions = topic.modules.reduce((acc, m) => {
    const easyCount = m.difficulties.easy?.length || 20
    const medCount = m.difficulties.intermediate?.length || 20
    const hardCount = m.difficulties.hard?.length || 20
    return acc + easyCount + medCount + hardCount
  }, 0)

  return (
    <div className="qm-topic-detail-page">
      {/* BACK BUTTON */}
      <button
        className="qm-back-to-topics-btn mb-4"
        onClick={() => navigate(`/topics/${parentCategorySlug}`)}
      >
        <ArrowLeft size={16} />
        <span>Back to {topic.category} Topics</span>
      </button>

      {/* HERO BANNER FOR TOPIC */}
      <div className="qm-topic-hero-banner mb-6">
        <div className="qm-topic-hero-left">
          <div className="qm-topic-big-icon">{topic.icon}</div>
          <div>
            <div className="qm-topic-meta-tags">
              <span className="qm-badge-level">{topic.category}</span>
              <span className="qm-topic-modules-count">
                <Layers size={14} /> {topic.modules.length} Learning Modules
              </span>
              <span className="qm-topic-questions-count">
                <BookOpen size={14} /> {totalQuestions} Practice Questions Total
              </span>
            </div>
            <h1>{topic.name}</h1>
            <p className="qm-topic-description">{topic.description}</p>
          </div>
        </div>
      </div>

      {/* MODULES SECTION */}
      <div className="qm-modules-container">
        <div className="qm-modules-header mb-4">
          <h2>Learning Modules</h2>
          <p>Choose a learning module below and select your difficulty tier to begin practice.</p>
        </div>

        <div className="qm-modules-list">
          {topic.modules.map((module) => {
            const easyCount = module.difficulties.easy?.length || 20
            const medCount = module.difficulties.intermediate?.length || 20
            const hardCount = module.difficulties.hard?.length || 20

            const easyComp = completedModules[`${topic.id}_${module.id}_easy`]
            const medComp = completedModules[`${topic.id}_${module.id}_intermediate`]
            const hardComp = completedModules[`${topic.id}_${module.id}_hard`]

            return (
              <div key={module.id} className="qm-card qm-module-card">
                <div className="qm-module-top-row">
                  <div className="qm-module-number-pill">MODULE {module.number}</div>
                  <span className="qm-module-total-badge">
                    {easyCount + medCount + hardCount} Questions Total
                  </span>
                </div>

                <div className="qm-module-info">
                  <h3 className="qm-module-title">{module.title}</h3>
                  {module.description && <p className="qm-module-desc">{module.description}</p>}
                </div>

                {/* 3 DIFFICULTY TIERS BOXES */}
                <div className="qm-hub-tier-boxes-grid mt-4">
                  <Link
                    to={`/quiz/${topic.id}/${module.id}/easy`}
                    className={`qm-hub-tier-box easy ${easyComp ? 'completed-tier' : ''}`}
                  >
                    <div className="qm-tier-icon-title">
                      <Star size={14} />
                      <span>Easy</span>
                    </div>
                    <span className="qm-tier-qsubtitle">
                      {easyComp ? `✓ Completed (${easyComp.score}/${easyComp.total})` : `${easyCount} MCQs`}
                    </span>
                  </Link>

                  <Link
                    to={`/quiz/${topic.id}/${module.id}/intermediate`}
                    className={`qm-hub-tier-box intermediate ${medComp ? 'completed-tier' : ''}`}
                  >
                    <div className="qm-tier-icon-title">
                      <Zap size={14} />
                      <span>Medium</span>
                    </div>
                    <span className="qm-tier-qsubtitle">
                      {medComp ? `✓ Completed (${medComp.score}/${medComp.total})` : `${medCount} MCQs`}
                    </span>
                  </Link>

                  <Link
                    to={`/quiz/${topic.id}/${module.id}/hard`}
                    className={`qm-hub-tier-box hard ${hardComp ? 'completed-tier' : ''}`}
                  >
                    <div className="qm-tier-icon-title">
                      <Trophy size={14} />
                      <span>Hard</span>
                    </div>
                    <span className="qm-tier-qsubtitle">
                      {hardComp ? `✓ Completed (${hardComp.score}/${hardComp.total})` : `${hardCount} MCQs`}
                    </span>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
