import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import confetti from 'canvas-confetti'
import {
  ShieldAlert,
  Plus,
  Trash2,
  Search,
  Layers,
  HelpCircle,
  Database,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertTriangle,
  X,
  Sparkles,
  BookOpen,
  Code2,
  Check,
  Users,
  Key,
  ShieldCheck,
  CheckSquare,
  Filter
} from 'lucide-react'
import { useQuizCartridges } from '../lib/quizStore'
import { useAuth } from '../context/AuthContext'
import soundFx from '../lib/soundFx'
import api from '../lib/api'
import RetroIcon from '../components/RetroIcon'

const PRESET_ICONS = ['🚀', '💻', '🧠', '⚡', '☕', '🐍', '⚙️', '⚛️', '📐', '🔬', '🌍', '📖', '🎮', '🛡️', '💎', '👾', '🎯', '🔥']
const CATEGORIES = ['Programming', 'Mathematics', 'Science', 'Computer Science', 'General Knowledge', 'English', 'Custom']

export default function Admin() {
  const { user, grantAdminPrivilege } = useAuth()
  const {
    topics,
    stats,
    addQuiz,
    removeQuiz,
    addModule,
    removeModule,
    addQuestion,
    removeQuestion,
    resetDefaults
  } = useQuizCartridges()

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [expandedTopicId, setExpandedTopicId] = useState(null)
  const [expandedStageId, setExpandedStageId] = useState(null)
  const [toastMessage, setToastMessage] = useState(null)

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showAddStageModal, setShowAddStageModal] = useState(false)
  const [targetTopicForStage, setTargetTopicForStage] = useState(null)
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false)
  const [targetForQuestion, setTargetForQuestion] = useState({ topicId: null, moduleId: null })
  const [deleteConfirmation, setDeleteConfirmation] = useState(null) // { type: 'quiz'|'stage'|'question', data: {} }

  // User Privileges Management State
  const [showPrivilegesModal, setShowPrivilegesModal] = useState(false)
  const [usersList, setUsersList] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [promoteEmailInput, setPromoteEmailInput] = useState('')

  // MCQ Manager Modal State
  const [showMcqManagerModal, setShowMcqManagerModal] = useState(false)
  const [mcqManagerTarget, setMcqManagerTarget] = useState({ topicId: null, moduleId: null, stageTitle: '' })
  const [mcqSearchQuery, setMcqSearchQuery] = useState('')
  const [mcqDifficultyFilter, setMcqDifficultyFilter] = useState('all')
  const [isInlineCreatingMcq, setIsInlineCreatingMcq] = useState(false)

  // Create Quiz Form State
  const [newQuizName, setNewQuizName] = useState('')
  const [newQuizCategory, setNewQuizCategory] = useState('Programming')
  const [newQuizIcon, setNewQuizIcon] = useState('🚀')
  const [newQuizDesc, setNewQuizDesc] = useState('')
  const [newQuizStageTitle, setNewQuizStageTitle] = useState('')
  const [newQuizStageDesc, setNewQuizStageDesc] = useState('')
  const [autoGenQuestions, setAutoGenQuestions] = useState(true)

  // Add Stage Form State
  const [stageTitle, setStageTitle] = useState('')
  const [stageDesc, setStageDesc] = useState('')

  // Add Question Form State
  const [questionText, setQuestionText] = useState('')
  const [questionDifficulty, setQuestionDifficulty] = useState('intermediate')
  const [questionCode, setQuestionCode] = useState('')
  const [questionExplanation, setQuestionExplanation] = useState('')
  const [choiceA, setChoiceA] = useState('')
  const [choiceB, setChoiceB] = useState('')
  const [choiceC, setChoiceC] = useState('')
  const [choiceD, setChoiceD] = useState('')
  const [correctChoiceIdx, setCorrectChoiceIdx] = useState(0)

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 4000)
  }

  // Fetch all users for Admin Privileges console
  const fetchAdminUsers = async () => {
    setLoadingUsers(true)
    try {
      const res = await api.get('/admin/users/')
      if (res.data?.users) {
        setUsersList(res.data.users)
      }
    } catch (err) {
      try {
        const raw = localStorage.getItem('quiz_registered_accounts')
        const accounts = raw ? JSON.parse(raw) : []
        setUsersList(
          accounts.map((a) => ({
            id: a.id,
            username: a.email,
            email: a.email,
            name: a.name || a.email.split('@')[0],
            avatar: a.avatar || '👾',
            is_staff: Boolean(a.is_staff || a.isAdmin),
            is_superuser: Boolean(a.is_superuser || a.isAdmin),
            is_admin: Boolean(a.is_staff || a.is_superuser || a.isAdmin),
            problems_solved: a.problems_solved || 0,
            streak: a.current_streak || 0,
            date_joined: 'Local Storage',
          }))
        )
      } catch {}
    } finally {
      setLoadingUsers(false)
    }
  }

  // Toggle user admin privileges
  const handleTogglePrivilege = async (u) => {
    try {
      soundFx.playCoin()
      const res = await api.post(`/admin/users/${u.id}/toggle-admin/`)
      const newAdminStatus = res.data?.is_admin
      setUsersList((prev) =>
        prev.map((item) =>
          item.id === u.id
            ? { ...item, is_staff: newAdminStatus, is_superuser: newAdminStatus, is_admin: newAdminStatus }
            : item
        )
      )
      showToast(`⚡ ${res.data?.message || 'Privileges updated successfully!'}`)
    } catch (err) {
      setUsersList((prev) =>
        prev.map((item) => {
          if (item.id === u.id) {
            const toggled = !item.is_admin
            return { ...item, is_staff: toggled, is_superuser: toggled, is_admin: toggled }
          }
          return item
        })
      )
      showToast(`⚡ Admin privileges toggled for ${u.email}.`)
    }
  }

  // Grant admin privilege by email input
  const handlePromoteEmail = async (e) => {
    e.preventDefault()
    if (!promoteEmailInput.trim()) return
    try {
      soundFx.playLevelUp()
      const res = await api.post('/admin/grant-privilege/', { email: promoteEmailInput.trim() })
      showToast(`⚡ ${res.data?.message || 'Admin privileges granted!'}`)
      setPromoteEmailInput('')
      fetchAdminUsers()
    } catch (err) {
      showToast(`❌ ${err.message}`)
    }
  }

  // Promote current logged in user
  const handlePromoteCurrentAccount = async () => {
    try {
      soundFx.playLevelUp()
      await grantAdminPrivilege()
      showToast(`⚡ Full Admin Privileges activated for your account!`)
      fetchAdminUsers()
    } catch (err) {
      showToast(`❌ ${err.message}`)
    }
  }

  // Active module and questions for MCQ Manager
  const activeMcqModule = useMemo(() => {
    if (!mcqManagerTarget.topicId || !mcqManagerTarget.moduleId) return null
    const t = topics.find((item) => item.id === mcqManagerTarget.topicId)
    if (!t) return null
    return (t.modules || []).find((m) => m.id === mcqManagerTarget.moduleId) || null
  }, [topics, mcqManagerTarget])

  const allQuestionsInActiveStage = useMemo(() => {
    if (!activeMcqModule || !activeMcqModule.difficulties) return []
    const list = []
    const diffs = ['easy', 'intermediate', 'hard']
    diffs.forEach((d) => {
      ;(activeMcqModule.difficulties[d] || []).forEach((q) => {
        list.push({ ...q, difficulty: q.difficulty || d })
      })
    })
    return list
  }, [activeMcqModule])

  const filteredStageMcqs = useMemo(() => {
    return allQuestionsInActiveStage.filter((q) => {
      const matchDiff = mcqDifficultyFilter === 'all' || q.difficulty === mcqDifficultyFilter
      const matchSearch =
        !mcqSearchQuery ||
        q.text.toLowerCase().includes(mcqSearchQuery.toLowerCase()) ||
        (q.explanation || '').toLowerCase().includes(mcqSearchQuery.toLowerCase()) ||
        (q.choices || []).some((c) => (c.text || '').toLowerCase().includes(mcqSearchQuery.toLowerCase()))
      return matchDiff && matchSearch
    })
  }, [allQuestionsInActiveStage, mcqSearchQuery, mcqDifficultyFilter])

  const handleDeleteMcqDirect = async (q) => {
    try {
      soundFx.playWrong()
      await removeQuestion(mcqManagerTarget.topicId, mcqManagerTarget.moduleId, q.difficulty, q.id)
      showToast(`🗑️ Deleted MCQ: "${q.text.slice(0, 32)}..."`)
    } catch (err) {
      showToast(`❌ Error deleting MCQ: ${err.message}`)
    }
  }


  // Filtered topics
  const filteredTopics = useMemo(() => {
    return topics.filter((t) => {
      const matchSearch =
        !searchTerm ||
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.description || '').toLowerCase().includes(searchTerm.toLowerCase())

      const matchCategory =
        selectedCategory === 'ALL' ||
        t.category.toLowerCase() === selectedCategory.toLowerCase()

      return matchSearch && matchCategory
    })
  }, [topics, searchTerm, selectedCategory])

  // Handlers for Add Quiz
  const handleDeployQuiz = async (e) => {
    e.preventDefault()
    if (!newQuizName.trim()) {
      showToast('⚠️ Quiz name is required!')
      return
    }

    try {
      soundFx.playCoin()
      await addQuiz({
        name: newQuizName.trim(),
        category: newQuizCategory,
        icon: newQuizIcon,
        description: newQuizDesc.trim() || `Explore challenging questions on ${newQuizName.trim()}.`,
        modulesData: [
          {
            title: newQuizStageTitle.trim() || `${newQuizName.trim()} Fundamentals`,
            description: newQuizStageDesc.trim() || `Core principles and practical problems for ${newQuizName.trim()}.`,
          },
        ],
      })

      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 },
      })
      soundFx.playLevelUp()
      showToast(`🎮 Cartridge '${newQuizName.trim()}' successfully deployed!`)
      setShowCreateModal(false)

      // Reset form
      setNewQuizName('')
      setNewQuizDesc('')
      setNewQuizStageTitle('')
      setNewQuizStageDesc('')
    } catch (err) {
      showToast(`❌ Error creating quiz: ${err.message}`)
    }
  }

  // Handlers for Add Stage
  const handleAddStageSubmit = async (e) => {
    e.preventDefault()
    if (!stageTitle.trim() || !targetTopicForStage) {
      showToast('⚠️ Stage title is required!')
      return
    }

    try {
      soundFx.playCoin()
      await addModule(targetTopicForStage, {
        title: stageTitle.trim(),
        description: stageDesc.trim() || `Master concepts of ${stageTitle.trim()}.`,
      })
      showToast(`✨ Stage '${stageTitle.trim()}' added!`)
      setShowAddStageModal(false)
      setStageTitle('')
      setStageDesc('')
    } catch (err) {
      showToast(`❌ Error adding stage: ${err.message}`)
    }
  }

  // Handlers for Add Question
  const handleAddQuestionSubmit = async (e) => {
    e.preventDefault()
    if (!questionText.trim()) {
      showToast('⚠️ Question text is required!')
      return
    }
    const targetTopicId = targetForQuestion?.topicId || mcqManagerTarget?.topicId
    const targetModuleId = targetForQuestion?.moduleId || mcqManagerTarget?.moduleId

    if (!targetTopicId || !targetModuleId) {
      showToast('⚠️ No target stage selected for this question!')
      return
    }

    const choices = [
      { text: choiceA.trim() || 'Option A', is_correct: correctChoiceIdx === 0 },
      { text: choiceB.trim() || 'Option B', is_correct: correctChoiceIdx === 1 },
      { text: choiceC.trim() || 'Option C', is_correct: correctChoiceIdx === 2 },
      { text: choiceD.trim() || 'Option D', is_correct: correctChoiceIdx === 3 },
    ]

    try {
      soundFx.playCoin()
      await addQuestion(targetTopicId, targetModuleId, {
        text: questionText.trim(),
        difficulty: questionDifficulty,
        codeSnippet: questionCode.trim() || null,
        explanation: questionExplanation.trim(),
        choices,
      })
      showToast('🎯 Question successfully added to stage bank!')
      setShowAddQuestionModal(false)
      setIsInlineCreatingMcq(false)

      // Reset form
      setQuestionText('')
      setQuestionCode('')
      setQuestionExplanation('')
      setChoiceA('')
      setChoiceB('')
      setChoiceC('')
      setChoiceD('')
    } catch (err) {
      showToast(`❌ Error adding question: ${err.message}`)
    }
  }

  // Execute Deletion
  const executeDelete = async () => {
    if (!deleteConfirmation) return
    const { type, data } = deleteConfirmation

    try {
      soundFx.playWrong()
      if (type === 'quiz') {
        await removeQuiz(data.id)
        showToast(`🗑️ Quiz '${data.name}' has been removed!`)
      } else if (type === 'stage') {
        await removeModule(data.topicId, data.moduleId)
        showToast(`🗑️ Stage '${data.title}' removed!`)
      } else if (type === 'question') {
        await removeQuestion(data.topicId, data.moduleId, data.difficulty, data.questionId)
        showToast('🗑️ Question removed from stage!')
      }
    } catch (err) {
      showToast(`❌ Error deleting item: ${err.message}`)
    } finally {
      setDeleteConfirmation(null)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* FLOATING TOAST FEEDBACK */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            zIndex: 9999,
            background: '#000000',
            border: '2px solid var(--neon-cyan)',
            boxShadow: '0 0 16px rgba(0, 243, 255, 0.4)',
            color: '#fff',
            fontFamily: 'var(--font-pixel)',
            fontSize: '11px',
            padding: '12px 20px',
            borderRadius: 'var(--radius-md)',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* HEADER HERO */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(20, 20, 35, 0.9) 0%, rgba(10, 10, 20, 0.95) 100%)',
          border: '3px solid var(--neon-pink)',
          boxShadow: '6px 6px 0px var(--neon-pink)',
          borderRadius: 'var(--radius-xl)',
          padding: '28px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div>
          <div className="hero-tag-badge" style={{ background: 'rgba(255, 0, 127, 0.15)', borderColor: 'var(--neon-pink)', color: 'var(--neon-pink)' }}>
            <ShieldAlert size={14} />
            <span>ROOT OPERATOR CONSOLE • QUIZMASTER ADMIN</span>
          </div>
          <h1 className="section-retro-title" style={{ marginTop: '8px', color: '#fff' }}>
            CARTRIDGE &amp; QUIZ MANAGER
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '6px', maxWidth: '640px' }}>
            Easily deploy new quiz cartridges, manage stages, insert questions, delete MCQs, and manage operator privileges. All changes synchronize across the arcade in real time!
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginTop: '12px' }}>
            <div
              className="arcade-tag-chip"
              style={{
                background: 'rgba(57, 255, 20, 0.18)',
                borderColor: 'var(--neon-green)',
                color: 'var(--neon-green)',
                fontSize: '9px',
                fontWeight: 'bold',
                padding: '4px 10px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 0 10px rgba(57, 255, 20, 0.25)',
              }}
            >
              <span>⚡</span>
              <span>ADMIN PRIVILEGES: ACTIVE &amp; UNRESTRICTED</span>
            </div>

            {user && (!user.is_staff || !user.is_superuser) && (
              <button
                type="button"
                onClick={handlePromoteCurrentAccount}
                className="retro-tool-btn"
                style={{
                  fontSize: '9px',
                  padding: '4px 10px',
                  borderColor: 'var(--neon-yellow)',
                  color: 'var(--neon-yellow)',
                  background: 'rgba(255, 230, 0, 0.12)',
                }}
              >
                <span>⚡ PROMOTE CURRENT ACCOUNT ({user.email})</span>
              </button>
            )}
          </div>
        </div>

        {/* TOP CTA BUTTONS */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => {
              soundFx.playCoin()
              setShowCreateModal(true)
            }}
            className="btn-retro-primary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              fontSize: '11px',
            }}
          >
            <Plus size={16} />
            <span>DEPLOY NEW QUIZ</span>
          </button>

          <button
            onClick={() => {
              soundFx.playSelect()
              fetchAdminUsers()
              setShowPrivilegesModal(true)
            }}
            className="retro-tool-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 18px',
              fontSize: '10px',
              borderColor: 'var(--neon-yellow)',
              color: 'var(--neon-yellow)',
              background: 'rgba(255, 230, 0, 0.08)',
            }}
          >
            <Users size={14} />
            <span>USER PRIVILEGES</span>
          </button>

          <a
            href="http://localhost:8000/admin/"
            target="_blank"
            rel="noopener noreferrer"
            className="retro-tool-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 18px',
              fontSize: '10px',
              borderColor: 'var(--neon-cyan)',
              color: 'var(--neon-cyan)',
            }}
            onClick={() => soundFx.playSelect()}
          >
            <Database size={14} />
            <span>DJANGO PORTAL</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>


      {/* METRICS STATS TILES */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
        }}
      >
        <div className="retro-stat-tile" style={{ borderLeft: '4px solid var(--neon-cyan)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-pixel)' }}>
              TOTAL CARTRIDGES
            </span>
            <Layers size={16} color="var(--neon-cyan)" />
          </div>
          <div style={{ fontSize: '28px', fontFamily: 'var(--font-pixel)', color: '#fff', marginTop: '6px' }}>
            {stats.totalTopics}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--neon-cyan)', marginTop: '4px' }}>
            Active subjects in catalog
          </div>
        </div>

        <div className="retro-stat-tile" style={{ borderLeft: '4px solid var(--neon-yellow)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-pixel)' }}>
              TOTAL STAGES
            </span>
            <BookOpen size={16} color="var(--neon-yellow)" />
          </div>
          <div style={{ fontSize: '28px', fontFamily: 'var(--font-pixel)', color: '#fff', marginTop: '6px' }}>
            {stats.totalModules}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--neon-yellow)', marginTop: '4px' }}>
            Playable subtopic modules
          </div>
        </div>

        <div className="retro-stat-tile" style={{ borderLeft: '4px solid var(--neon-green)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-pixel)' }}>
              TOTAL QUESTIONS
            </span>
            <HelpCircle size={16} color="var(--neon-green)" />
          </div>
          <div style={{ fontSize: '28px', fontFamily: 'var(--font-pixel)', color: '#fff', marginTop: '6px' }}>
            {stats.totalQuestions.toLocaleString()}+
          </div>
          <div style={{ fontSize: '11px', color: 'var(--neon-green)', marginTop: '4px' }}>
            Balanced MCQ database
          </div>
        </div>

        <div className="retro-stat-tile" style={{ borderLeft: `4px solid ${stats.isBackendConnected ? 'var(--neon-green)' : 'var(--neon-yellow)'}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-pixel)' }}>
              SYNC ENGINE
            </span>
            <Database size={16} color={stats.isBackendConnected ? 'var(--neon-green)' : 'var(--neon-yellow)'} />
          </div>
          <div style={{ fontSize: '16px', fontFamily: 'var(--font-pixel)', color: '#fff', marginTop: '10px' }}>
            {stats.isBackendConnected ? 'DJANGO CLOUD' : 'LOCAL CACHED'}
          </div>
          <div style={{ fontSize: '11px', color: stats.isBackendConnected ? 'var(--neon-green)' : 'var(--neon-yellow)', marginTop: '6px' }}>
            {stats.isBackendConnected ? '● Online API Active' : '● Offline Storage'}
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '2px solid #333',
          borderRadius: 'var(--radius-lg)',
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
        }}
      >
        {/* Search input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '240px' }}>
          <Search size={16} color="var(--neon-cyan)" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search quiz title, subject, or description..."
            style={{
              background: 'transparent',
              border: 'none',
              color: '#fff',
              outline: 'none',
              width: '100%',
              fontSize: '14px',
            }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {['ALL', ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                soundFx.playSelect()
                setSelectedCategory(cat)
              }}
              className="retro-tool-btn"
              style={{
                background: selectedCategory === cat ? 'var(--neon-yellow)' : '#111',
                color: selectedCategory === cat ? '#000' : 'var(--text-secondary)',
                borderColor: selectedCategory === cat ? 'var(--neon-yellow)' : '#333',
                padding: '6px 12px',
                fontSize: '9px',
                whiteSpace: 'nowrap',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* CARTRIDGE MANAGEMENT LIST */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 'bold' }}>
            ACTIVE QUIZ CARTRIDGES ({filteredTopics.length})
          </h2>
          <button
            onClick={() => {
              if (window.confirm('Reset all cartridges to initial system defaults? Custom added quizzes will be reset.')) {
                resetDefaults()
                showToast('🔄 Restored default quiz cartridges.')
              }
            }}
            className="retro-tool-btn"
            style={{ fontSize: '9px', padding: '6px 12px', color: 'var(--text-muted)' }}
          >
            <RefreshCw size={12} />
            <span>RESET TO FACTORY DEFAULTS</span>
          </button>
        </div>

        {filteredTopics.length === 0 ? (
          <div
            style={{
              background: 'var(--bg-card)',
              border: '2px dashed #444',
              borderRadius: 'var(--radius-lg)',
              padding: '48px 24px',
              textAlign: 'center',
              color: 'var(--text-secondary)',
            }}
          >
            <p style={{ fontFamily: 'var(--font-pixel)', fontSize: '13px', color: 'var(--neon-yellow)' }}>
              NO MATCHING QUIZZES FOUND
            </p>
            <p style={{ fontSize: '13px', marginTop: '8px' }}>
              Try searching with another term or click Deploy New Quiz to add one!
            </p>
          </div>
        ) : (
          filteredTopics.map((topic) => {
            const isExpanded = expandedTopicId === topic.id
            const modulesCount = topic.modules?.length || 0
            const totalQuestionsInTopic = (topic.modules || []).reduce((acc, m) => {
              return acc + (m.difficulties?.easy?.length || 20) + (m.difficulties?.intermediate?.length || 20) + (m.difficulties?.hard?.length || 20)
            }, 0)

            return (
              <div
                key={topic.id}
                style={{
                  background: 'var(--bg-card)',
                  border: isExpanded ? '3px solid var(--neon-cyan)' : '2px solid #222',
                  boxShadow: isExpanded ? '4px 4px 0px var(--neon-cyan)' : '3px 3px 0px #000',
                  borderRadius: 'var(--radius-lg)',
                  transition: 'all 0.2s ease',
                  overflow: 'hidden',
                }}
              >
                {/* CARTRIDGE CARD ROW */}
                <div
                  style={{
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: '280px' }}>
                    <div
                      style={{
                        fontSize: '32px',
                        background: '#000',
                        border: '2px solid #333',
                        borderRadius: 'var(--radius-md)',
                        width: '56px',
                        height: '56px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {topic.icon || '⭐'}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span
                          className="arcade-tag-chip"
                          style={{
                            background: 'rgba(0, 243, 255, 0.2)',
                            borderColor: 'var(--neon-cyan)',
                            color: 'var(--neon-cyan)',
                            fontSize: '8px',
                            fontWeight: 'bold',
                            padding: '3px 8px',
                          }}
                        >
                          {topic.category.toUpperCase()}
                        </span>
                        <span
                          className="arcade-tag-chip"
                          style={{
                            background: '#1b1b36',
                            borderColor: '#5a5e94',
                            color: '#d4dcff',
                            fontSize: '8px',
                            fontWeight: 'bold',
                            padding: '3px 8px',
                            letterSpacing: '0.5px',
                          }}
                        >
                          ID: {topic.id}
                        </span>
                      </div>

                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 'bold', color: '#fff', marginTop: '2px' }}>
                        {topic.name}
                      </h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '2px' }}>
                        {topic.description}
                      </p>
                    </div>
                  </div>

                  {/* STAT BADGES & ACTION BUTTONS */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <span
                        className="arcade-tag-chip"
                        style={{
                          background: 'rgba(255, 230, 0, 0.2)',
                          borderColor: 'var(--neon-yellow)',
                          color: 'var(--neon-yellow)',
                          fontSize: '9px',
                          fontWeight: 'bold',
                          padding: '4px 10px',
                          boxShadow: '0 0 8px rgba(255, 230, 0, 0.2)',
                        }}
                      >
                        {modulesCount} STAGES
                      </span>
                      <span
                        className="arcade-tag-chip"
                        style={{
                          background: 'rgba(57, 255, 20, 0.2)',
                          borderColor: 'var(--neon-green)',
                          color: 'var(--neon-green)',
                          fontSize: '9px',
                          fontWeight: 'bold',
                          padding: '4px 10px',
                          boxShadow: '0 0 8px rgba(57, 255, 20, 0.2)',
                        }}
                      >
                        {totalQuestionsInTopic} MCQS
                      </span>
                    </div>

                    {/* Quick Play Link */}
                    <Link
                      to={`/topic/${topic.id}`}
                      className="retro-tool-btn"
                      style={{ fontSize: '10px', padding: '8px 12px', color: 'var(--neon-cyan)', borderColor: 'var(--neon-cyan)' }}
                      onClick={() => soundFx.playSelect()}
                    >
                      <span>VIEW SYLLABUS</span>
                    </Link>

                    {/* Add Stage to this quiz */}
                    <button
                      onClick={() => {
                        soundFx.playSelect()
                        setTargetTopicForStage(topic.id)
                        setShowAddStageModal(true)
                      }}
                      className="retro-tool-btn"
                      style={{ fontSize: '10px', padding: '8px 12px' }}
                    >
                      <Plus size={12} />
                      <span>ADD STAGE</span>
                    </button>

                    {/* Remove Entire Quiz Button */}
                    <button
                      onClick={() => {
                        soundFx.playSelect()
                        setDeleteConfirmation({
                          type: 'quiz',
                          data: { id: topic.id, name: topic.name },
                        })
                      }}
                      className="retro-tool-btn"
                      style={{
                        fontSize: '10px',
                        padding: '8px 12px',
                        borderColor: 'var(--neon-pink)',
                        color: 'var(--neon-pink)',
                      }}
                    >
                      <Trash2 size={12} />
                      <span>REMOVE QUIZ</span>
                    </button>

                    {/* Toggle Stages Accordion */}
                    <button
                      onClick={() => {
                        soundFx.playSelect()
                        setExpandedTopicId(isExpanded ? null : topic.id)
                      }}
                      className="retro-tool-btn"
                      style={{
                        fontSize: '10px',
                        padding: '8px 12px',
                        background: isExpanded ? 'var(--neon-cyan)' : '#111',
                        color: isExpanded ? '#000' : '#fff',
                        borderColor: isExpanded ? 'var(--neon-cyan)' : '#333',
                      }}
                    >
                      <span>{isExpanded ? 'COLLAPSE' : 'INSPECT'}</span>
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </div>
                </div>

                {/* ACCORDION: STAGES & QUESTIONS DETAILS */}
                {isExpanded && (
                  <div
                    style={{
                      background: '#0a0a14',
                      borderTop: '2px solid #222',
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ fontFamily: 'var(--font-pixel)', fontSize: '11px', color: 'var(--neon-cyan)' }}>
                        STAGE MODULES IN {topic.name.toUpperCase()}
                      </h4>
                      <button
                        onClick={() => {
                          soundFx.playSelect()
                          setTargetTopicForStage(topic.id)
                          setShowAddStageModal(true)
                        }}
                        className="btn-retro-secondary"
                        style={{ fontSize: '9px', padding: '6px 12px' }}
                      >
                        <Plus size={12} />
                        <span>ADD NEW STAGE</span>
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {topic.modules?.map((m) => {
                        const isStageExpanded = expandedStageId === m.id
                        const easyQuestions = m.difficulties?.easy || []
                        const medQuestions = m.difficulties?.intermediate || []
                        const hardQuestions = m.difficulties?.hard || []
                        const totalInStage = easyQuestions.length + medQuestions.length + hardQuestions.length

                        return (
                          <div
                            key={m.id}
                            style={{
                              background: '#121220',
                              border: isStageExpanded ? '2px solid var(--neon-yellow)' : '1px solid #28283a',
                              borderRadius: 'var(--radius-md)',
                              padding: '16px 20px',
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span className="arcade-tag-chip" style={{ background: 'var(--neon-pink)', color: '#fff' }}>
                                    STAGE {m.number}
                                  </span>
                                  <h5 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>
                                    {m.title}
                                  </h5>
                                </div>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginTop: '2px' }}>
                                  {m.description}
                                </p>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                <span style={{ fontSize: '10px', fontFamily: 'var(--font-pixel)', color: 'var(--text-secondary)' }}>
                                  {totalInStage} MCQs
                                </span>

                                {/* Manage & Delete MCQs button */}
                                <button
                                  onClick={() => {
                                    soundFx.playSelect()
                                    setMcqManagerTarget({ topicId: topic.id, moduleId: m.id, stageTitle: m.title })
                                    setTargetForQuestion({ topicId: topic.id, moduleId: m.id })
                                    setIsInlineCreatingMcq(false)
                                    setMcqSearchQuery('')
                                    setMcqDifficultyFilter('all')
                                    setShowMcqManagerModal(true)
                                  }}
                                  className="retro-tool-btn"
                                  style={{ fontSize: '9px', padding: '6px 10px', color: 'var(--neon-cyan)', borderColor: 'var(--neon-cyan)', display: 'flex', alignItems: 'center', gap: '4px' }}
                                >
                                  <HelpCircle size={11} />
                                  <span>MANAGE MCQS ({totalInStage})</span>
                                </button>

                                {/* Add Question button */}
                                <button
                                  onClick={() => {
                                    soundFx.playSelect()
                                    setTargetForQuestion({ topicId: topic.id, moduleId: m.id })
                                    setShowAddQuestionModal(true)
                                  }}
                                  className="retro-tool-btn"
                                  style={{ fontSize: '9px', padding: '6px 10px', color: 'var(--neon-green)', borderColor: 'var(--neon-green)' }}
                                >
                                  <Plus size={11} />
                                  <span>ADD MCQ</span>
                                </button>

                                {/* Remove Stage */}
                                <button
                                  onClick={() => {
                                    soundFx.playSelect()
                                    setDeleteConfirmation({
                                      type: 'stage',
                                      data: { topicId: topic.id, moduleId: m.id, title: m.title },
                                    })
                                  }}
                                  className="retro-tool-btn"
                                  style={{ fontSize: '9px', padding: '6px 10px', color: 'var(--neon-pink)', borderColor: 'var(--neon-pink)' }}
                                >
                                  <Trash2 size={11} />
                                  <span>REMOVE STAGE</span>
                                </button>

                                {/* Toggle Question Inspector */}
                                <button
                                  onClick={() => {
                                    soundFx.playSelect()
                                    setExpandedStageId(isStageExpanded ? null : m.id)
                                  }}
                                  className="retro-tool-btn"
                                  style={{ fontSize: '9px', padding: '6px 10px' }}
                                >
                                  <span>{isStageExpanded ? 'HIDE QUESTIONS' : 'VIEW QUESTIONS'}</span>
                                  {isStageExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                </button>
                              </div>
                            </div>

                            {/* INSPECT QUESTIONS IN THIS STAGE */}
                            {isStageExpanded && (
                              <div style={{ marginTop: '16px', borderTop: '1px solid #28283a', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                                  <div style={{ fontSize: '10px', fontFamily: 'var(--font-pixel)', color: 'var(--neon-yellow)' }}>
                                    PREVIEW QUESTIONS (CLICK MANAGE MCQS FOR FULL BANK):
                                  </div>
                                  <button
                                    onClick={() => {
                                      soundFx.playSelect()
                                      setMcqManagerTarget({ topicId: topic.id, moduleId: m.id, stageTitle: m.title })
                                      setTargetForQuestion({ topicId: topic.id, moduleId: m.id })
                                      setIsInlineCreatingMcq(false)
                                      setMcqSearchQuery('')
                                      setMcqDifficultyFilter('all')
                                      setShowMcqManagerModal(true)
                                    }}
                                    className="btn-retro-primary"
                                    style={{ fontSize: '9px', padding: '5px 10px' }}
                                  >
                                    <span>OPEN MCQ MANAGER ({totalInStage} MCQS)</span>
                                  </button>
                                </div>


                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '12px' }}>
                                  {[...easyQuestions.slice(0, 2), ...medQuestions.slice(0, 2), ...hardQuestions.slice(0, 2)].map((q, qIdx) => (
                                    <div
                                      key={q.id || qIdx}
                                      style={{
                                        background: '#090912',
                                        border: '1px solid #333',
                                        borderRadius: 'var(--radius-sm)',
                                        padding: '12px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '8px',
                                      }}
                                    >
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span
                                          className="arcade-tag-chip"
                                          style={{
                                            fontSize: '7px',
                                            background: q.difficulty === 'hard' ? 'rgba(255, 0, 127, 0.2)' : q.difficulty === 'intermediate' ? 'rgba(255, 230, 0, 0.2)' : 'rgba(57, 255, 20, 0.2)',
                                            color: q.difficulty === 'hard' ? 'var(--neon-pink)' : q.difficulty === 'intermediate' ? 'var(--neon-yellow)' : 'var(--neon-green)',
                                          }}
                                        >
                                          {q.difficulty?.toUpperCase()}
                                        </span>

                                        <button
                                          onClick={() => {
                                            soundFx.playSelect()
                                            setDeleteConfirmation({
                                              type: 'question',
                                              data: { topicId: topic.id, moduleId: m.id, difficulty: q.difficulty, questionId: q.id },
                                            })
                                          }}
                                          style={{ background: 'none', border: 'none', color: '#ff4d4f', cursor: 'pointer', padding: '2px' }}
                                          title="Delete question"
                                        >
                                          <Trash2 size={12} />
                                        </button>
                                      </div>

                                      <p style={{ fontSize: '12px', color: '#fff', fontWeight: '500' }}>
                                        {q.text}
                                      </p>

                                      {/* Choices preview */}
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        {q.choices?.map((c, cIdx) => (
                                          <div
                                            key={c.id || cIdx}
                                            style={{
                                              fontSize: '11px',
                                              color: c.is_correct ? 'var(--neon-green)' : 'var(--text-secondary)',
                                              display: 'flex',
                                              alignItems: 'center',
                                              gap: '6px',
                                            }}
                                          >
                                            {c.is_correct ? <Check size={12} color="var(--neon-green)" /> : <span style={{ width: 12 }}>•</span>}
                                            <span>{c.text}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* ================================================================= */}
      {/* MODAL 1: CREATE NEW QUIZ CARTRIDGE */}
      {/* ================================================================= */}
      {showCreateModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(6px)',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            style={{
              background: '#0e0e18',
              border: '3px solid var(--neon-cyan)',
              boxShadow: '8px 8px 0px var(--neon-cyan)',
              borderRadius: 'var(--radius-xl)',
              width: '100%',
              maxWidth: '620px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '28px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <div className="hero-tag-badge">
                  <span>🕹️</span>
                  <span>NEW CARTRIDGE CREATOR</span>
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 'bold', color: '#fff', marginTop: '4px' }}>
                  DEPLOY NEW QUIZ
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="retro-tool-btn"
                style={{ padding: '6px', borderRadius: '50%' }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleDeployQuiz} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '11px', fontFamily: 'var(--font-pixel)', color: 'var(--neon-yellow)' }}>
                  QUIZ NAME *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TypeScript, Machine Learning, World History..."
                  value={newQuizName}
                  onChange={(e) => setNewQuizName(e.target.value)}
                  className="retro-input-field"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: '#000',
                    border: '2px solid #333',
                    color: '#fff',
                    borderRadius: 'var(--radius-md)',
                    marginTop: '6px',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontFamily: 'var(--font-pixel)', color: 'var(--neon-yellow)' }}>
                    SUBJECT CATEGORY
                  </label>
                  <select
                    value={newQuizCategory}
                    onChange={(e) => setNewQuizCategory(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: '#000',
                      border: '2px solid #333',
                      color: '#fff',
                      borderRadius: 'var(--radius-md)',
                      marginTop: '6px',
                    }}
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontFamily: 'var(--font-pixel)', color: 'var(--neon-yellow)' }}>
                    CARTRIDGE ICON
                  </label>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                    {PRESET_ICONS.slice(0, 8).map((ico) => (
                      <button
                        type="button"
                        key={ico}
                        onClick={() => setNewQuizIcon(ico)}
                        style={{
                          fontSize: '18px',
                          padding: '6px',
                          background: newQuizIcon === ico ? 'var(--neon-yellow)' : '#000',
                          border: newQuizIcon === ico ? '2px solid #fff' : '1px solid #333',
                          borderRadius: 'var(--radius-sm)',
                          cursor: 'pointer',
                        }}
                      >
                        {ico}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontFamily: 'var(--font-pixel)', color: 'var(--neon-yellow)' }}>
                  DESCRIPTION
                </label>
                <textarea
                  rows={2}
                  placeholder="Summary of skills or syllabus tested by this quiz cartridge..."
                  value={newQuizDesc}
                  onChange={(e) => setNewQuizDesc(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: '#000',
                    border: '2px solid #333',
                    color: '#fff',
                    borderRadius: 'var(--radius-md)',
                    marginTop: '6px',
                  }}
                />
              </div>

              <div style={{ borderTop: '1px solid #333', paddingTop: '16px' }}>
                <label style={{ fontSize: '11px', fontFamily: 'var(--font-pixel)', color: 'var(--neon-cyan)' }}>
                  INITIAL STAGE / MODULE TITLE
                </label>
                <input
                  type="text"
                  placeholder="e.g. Fundamentals & Basic Syntax"
                  value={newQuizStageTitle}
                  onChange={(e) => setNewQuizStageTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: '#000',
                    border: '2px solid #333',
                    color: '#fff',
                    borderRadius: 'var(--radius-md)',
                    marginTop: '6px',
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  id="autoGen"
                  checked={autoGenQuestions}
                  onChange={(e) => setAutoGenQuestions(e.target.checked)}
                  style={{ width: 18, height: 18, accentColor: 'var(--neon-green)' }}
                />
                <label htmlFor="autoGen" style={{ fontSize: '12px', color: 'var(--neon-green)' }}>
                  ⚡ Auto-generate 20 balanced MCQs per tier (Easy, Medium, Hard) so this quiz is immediately playable!
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="retro-tool-btn"
                  style={{ padding: '10px 18px' }}
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="btn-retro-primary"
                  style={{ padding: '10px 24px', fontSize: '11px' }}
                >
                  DEPLOY CARTRIDGE 🚀
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 2: ADD STAGE / MODULE */}
      {/* ================================================================= */}
      {showAddStageModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(6px)',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            style={{
              background: '#0e0e18',
              border: '3px solid var(--neon-yellow)',
              boxShadow: '8px 8px 0px var(--neon-yellow)',
              borderRadius: 'var(--radius-xl)',
              width: '100%',
              maxWidth: '540px',
              padding: '28px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <div className="hero-tag-badge" style={{ color: 'var(--neon-yellow)', borderColor: 'var(--neon-yellow)' }}>
                  <span>⭐</span>
                  <span>STAGE EXPANSION</span>
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 'bold', color: '#fff', marginTop: '4px' }}>
                  ADD STAGE TO CARTRIDGE
                </h3>
              </div>
              <button
                onClick={() => setShowAddStageModal(false)}
                className="retro-tool-btn"
                style={{ padding: '6px', borderRadius: '50%' }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddStageSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '11px', fontFamily: 'var(--font-pixel)', color: 'var(--neon-yellow)' }}>
                  STAGE TITLE *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Advanced Architecture & Concurrency"
                  value={stageTitle}
                  onChange={(e) => setStageTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: '#000',
                    border: '2px solid #333',
                    color: '#fff',
                    borderRadius: 'var(--radius-md)',
                    marginTop: '6px',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontFamily: 'var(--font-pixel)', color: 'var(--neon-yellow)' }}>
                  STAGE DESCRIPTION
                </label>
                <textarea
                  rows={2}
                  placeholder="Syllabus topics covered in this stage..."
                  value={stageDesc}
                  onChange={(e) => setStageDesc(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: '#000',
                    border: '2px solid #333',
                    color: '#fff',
                    borderRadius: 'var(--radius-md)',
                    marginTop: '6px',
                  }}
                />
              </div>

              <p style={{ fontSize: '11px', color: 'var(--neon-green)' }}>
                ✓ Balanced 20-MCQ question bank will automatically be configured for Easy, Medium, and Hard tiers.
              </p>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddStageModal(false)}
                  className="retro-tool-btn"
                  style={{ padding: '10px 18px' }}
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="btn-retro-yellow"
                  style={{ padding: '10px 24px', fontSize: '11px' }}
                >
                  ADD STAGE ✨
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 3: ADD CUSTOM MCQ QUESTION */}
      {/* ================================================================= */}
      {showAddQuestionModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(6px)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >

          <div
            style={{
              background: '#0e0e18',
              border: '3px solid var(--neon-green)',
              boxShadow: '8px 8px 0px var(--neon-green)',
              borderRadius: 'var(--radius-xl)',
              width: '100%',
              maxWidth: '640px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '28px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <div className="hero-tag-badge" style={{ color: 'var(--neon-green)', borderColor: 'var(--neon-green)' }}>
                  <span>🎯</span>
                  <span>QUESTION BANK EDITOR</span>
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 'bold', color: '#fff', marginTop: '4px' }}>
                  INSERT CUSTOM MCQ QUESTION
                </h3>
              </div>
              <button
                onClick={() => setShowAddQuestionModal(false)}
                className="retro-tool-btn"
                style={{ padding: '6px', borderRadius: '50%' }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddQuestionSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '11px', fontFamily: 'var(--font-pixel)', color: 'var(--neon-green)' }}>
                  DIFFICULTY TIER
                </label>
                <select
                  value={questionDifficulty}
                  onChange={(e) => setQuestionDifficulty(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: '#000',
                    border: '2px solid #333',
                    color: '#fff',
                    borderRadius: 'var(--radius-md)',
                    marginTop: '4px',
                  }}
                >
                  <option value="easy">Easy</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="hard">Hard 💀</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontFamily: 'var(--font-pixel)', color: 'var(--neon-green)' }}>
                  QUESTION TEXT *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="What is the output or mechanism..."
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: '#000',
                    border: '2px solid #333',
                    color: '#fff',
                    borderRadius: 'var(--radius-md)',
                    marginTop: '4px',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontFamily: 'var(--font-pixel)', color: 'var(--text-muted)' }}>
                  CODE SNIPPET (OPTIONAL)
                </label>
                <textarea
                  rows={3}
                  placeholder="const x = [1, 2, 3];"
                  value={questionCode}
                  onChange={(e) => setQuestionCode(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: '#000',
                    border: '1px solid #333',
                    color: 'var(--neon-cyan)',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    borderRadius: 'var(--radius-md)',
                    marginTop: '4px',
                  }}
                />
              </div>

              {/* 4 CHOICES */}
              <div>
                <label style={{ fontSize: '11px', fontFamily: 'var(--font-pixel)', color: 'var(--neon-green)' }}>
                  CHOICES (SELECT RADIO FOR CORRECT ANSWER):
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                  {[
                    { label: 'A', val: choiceA, set: setChoiceA, idx: 0 },
                    { label: 'B', val: choiceB, set: setChoiceB, idx: 1 },
                    { label: 'C', val: choiceC, set: setChoiceC, idx: 2 },
                    { label: 'D', val: choiceD, set: setChoiceD, idx: 3 },
                  ].map((c) => (
                    <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input
                        type="radio"
                        name="correctChoice"
                        checked={correctChoiceIdx === c.idx}
                        onChange={() => setCorrectChoiceIdx(c.idx)}
                        style={{ accentColor: 'var(--neon-green)', width: 18, height: 18 }}
                      />
                      <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '11px', color: correctChoiceIdx === c.idx ? 'var(--neon-green)' : '#888' }}>
                        [{c.label}]
                      </span>
                      <input
                        type="text"
                        required
                        placeholder={`Choice ${c.label}`}
                        value={c.val}
                        onChange={(e) => c.set(e.target.value)}
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          background: '#000',
                          border: correctChoiceIdx === c.idx ? '2px solid var(--neon-green)' : '1px solid #333',
                          color: '#fff',
                          borderRadius: 'var(--radius-sm)',
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontFamily: 'var(--font-pixel)', color: 'var(--text-muted)' }}>
                  EXPLANATION (SHOWN AFTER ANSWERING)
                </label>
                <input
                  type="text"
                  placeholder="Why is this answer correct..."
                  value={questionExplanation}
                  onChange={(e) => setQuestionExplanation(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: '#000',
                    border: '1px solid #333',
                    color: '#fff',
                    borderRadius: 'var(--radius-md)',
                    marginTop: '4px',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddQuestionModal(false)}
                  className="retro-tool-btn"
                  style={{ padding: '10px 18px' }}
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="btn-retro-secondary"
                  style={{ padding: '10px 24px', fontSize: '11px' }}
                >
                  SAVE QUESTION 🎯
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 4: DANGER REMOVAL CONFIRMATION */}
      {/* ================================================================= */}
      {deleteConfirmation && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(8px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            style={{
              background: '#14080e',
              border: '3px solid var(--neon-pink)',
              boxShadow: '0 0 24px rgba(255, 0, 127, 0.4)',
              borderRadius: 'var(--radius-xl)',
              width: '100%',
              maxWidth: '480px',
              padding: '28px',
              textAlign: 'center',
            }}
          >
            <AlertTriangle size={48} color="var(--neon-pink)" style={{ margin: '0 auto 12px auto' }} />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 'bold', color: '#fff' }}>
              CONFIRM REMOVAL
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '8px' }}>
              Are you sure you want to delete {deleteConfirmation.type === 'quiz' ? `quiz '${deleteConfirmation.data.name}'` : deleteConfirmation.type === 'stage' ? `stage '${deleteConfirmation.data.title}'` : 'this question'}?
            </p>
            <p style={{ color: 'var(--neon-pink)', fontSize: '12px', marginTop: '6px', fontFamily: 'var(--font-pixel)' }}>
              ⚠️ THIS WILL BE PERMANENTLY REMOVED FROM ALL PLAYERS.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', marginTop: '24px' }}>
              <button
                onClick={() => setDeleteConfirmation(null)}
                className="retro-tool-btn"
                style={{ padding: '10px 20px', fontSize: '11px' }}
              >
                CANCEL
              </button>
              <button
                onClick={executeDelete}
                className="btn-retro-primary"
                style={{ padding: '10px 20px', fontSize: '11px' }}
              >
                YES, REMOVE NOW
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 5: MCQ MANAGER & QUESTION BANK DELETER */}
      {/* ================================================================= */}
      {showMcqManagerModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(8px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            style={{
              background: '#0c0c18',
              border: '3px solid var(--neon-cyan)',
              boxShadow: '8px 8px 0px var(--neon-cyan)',
              borderRadius: 'var(--radius-xl)',
              width: '100%',
              maxWidth: '920px',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '18px 24px',
                borderBottom: '2px solid #222',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#080812',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div>
                <div className="hero-tag-badge" style={{ color: 'var(--neon-cyan)', borderColor: 'var(--neon-cyan)' }}>
                  <HelpCircle size={13} />
                  <span>STAGE MCQ QUESTION BANK</span>
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 'bold', color: '#fff', marginTop: '4px' }}>
                  MANAGE &amp; DELETE MCQS • {mcqManagerTarget.stageTitle}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginTop: '2px' }}>
                  Total: {allQuestionsInActiveStage.length} Questions • Delete any question instantly or insert new ones right here.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playSelect()
                    setIsInlineCreatingMcq(false)
                  }}
                  className="retro-tool-btn"
                  style={{
                    fontSize: '9px',
                    padding: '7px 12px',
                    background: !isInlineCreatingMcq ? 'var(--neon-cyan)' : '#000',
                    color: !isInlineCreatingMcq ? '#000' : 'var(--text-secondary)',
                    borderColor: !isInlineCreatingMcq ? 'var(--neon-cyan)' : '#333',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <HelpCircle size={12} />
                  <span>QUESTIONS ({allQuestionsInActiveStage.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundFx.playSelect()
                    setIsInlineCreatingMcq(true)
                  }}
                  className="retro-tool-btn"
                  style={{
                    fontSize: '9px',
                    padding: '7px 12px',
                    background: isInlineCreatingMcq ? 'var(--neon-green)' : '#000',
                    color: isInlineCreatingMcq ? '#000' : 'var(--text-secondary)',
                    borderColor: isInlineCreatingMcq ? 'var(--neon-green)' : '#333',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <Plus size={12} />
                  <span>INSERT MCQ</span>
                </button>

                <button
                  onClick={() => {
                    setIsInlineCreatingMcq(false)
                    setShowMcqManagerModal(false)
                  }}
                  className="retro-tool-btn"
                  style={{ padding: '6px', borderRadius: '50%' }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* MODAL BODY: EITHER INLINE CREATOR FORM OR QUESTIONS LIST */}
            {isInlineCreatingMcq ? (
              <div
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '24px',
                  background: '#090915',
                }}
              >
                <div style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="hero-tag-badge" style={{ color: 'var(--neon-green)', borderColor: 'var(--neon-green)' }}>
                      <span>🎯</span>
                      <span>INLINE QUESTION BUILDER</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsInlineCreatingMcq(false)}
                      className="retro-tool-btn"
                      style={{ fontSize: '9px', padding: '5px 10px' }}
                    >
                      ← BACK TO QUESTIONS
                    </button>
                  </div>

                  <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: '#fff', fontWeight: 'bold' }}>
                    INSERT NEW MCQ INTO {mcqManagerTarget.stageTitle.toUpperCase()}
                  </h4>

                  <form onSubmit={handleAddQuestionSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <label style={{ fontSize: '11px', fontFamily: 'var(--font-pixel)', color: 'var(--neon-green)' }}>
                        DIFFICULTY TIER
                      </label>
                      <select
                        value={questionDifficulty}
                        onChange={(e) => setQuestionDifficulty(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          background: '#000',
                          border: '2px solid #333',
                          color: '#fff',
                          borderRadius: 'var(--radius-md)',
                          marginTop: '6px',
                        }}
                      >
                        <option value="easy">Easy</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="hard">Hard 💀</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '11px', fontFamily: 'var(--font-pixel)', color: 'var(--neon-green)' }}>
                        QUESTION TEXT *
                      </label>
                      <textarea
                        rows={2}
                        required
                        placeholder="Enter the question or problem prompt..."
                        value={questionText}
                        onChange={(e) => setQuestionText(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          background: '#000',
                          border: '2px solid #333',
                          color: '#fff',
                          borderRadius: 'var(--radius-md)',
                          marginTop: '6px',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '11px', fontFamily: 'var(--font-pixel)', color: 'var(--text-muted)' }}>
                        CODE SNIPPET (OPTIONAL)
                      </label>
                      <textarea
                        rows={3}
                        placeholder="const result = calculateValues();"
                        value={questionCode}
                        onChange={(e) => setQuestionCode(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          background: '#000',
                          border: '1px solid #333',
                          color: 'var(--neon-cyan)',
                          fontFamily: 'monospace',
                          fontSize: '12px',
                          borderRadius: 'var(--radius-md)',
                          marginTop: '6px',
                        }}
                      />
                    </div>

                    {/* 4 Choices with radio buttons */}
                    <div>
                      <label style={{ fontSize: '11px', fontFamily: 'var(--font-pixel)', color: 'var(--neon-green)' }}>
                        CHOICES (CLICK RADIO BUTTON TO MARK CORRECT ANSWER):
                      </label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                        {[
                          { label: 'A', val: choiceA, set: setChoiceA, idx: 0 },
                          { label: 'B', val: choiceB, set: setChoiceB, idx: 1 },
                          { label: 'C', val: choiceC, set: setChoiceC, idx: 2 },
                          { label: 'D', val: choiceD, set: setChoiceD, idx: 3 },
                        ].map((c) => (
                          <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <input
                              type="radio"
                              name="inlineCorrectChoice"
                              checked={correctChoiceIdx === c.idx}
                              onChange={() => setCorrectChoiceIdx(c.idx)}
                              style={{ accentColor: 'var(--neon-green)', width: 18, height: 18, cursor: 'pointer' }}
                            />
                            <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '11px', color: correctChoiceIdx === c.idx ? 'var(--neon-green)' : '#888' }}>
                              [{c.label}]
                            </span>
                            <input
                              type="text"
                              required
                              placeholder={`Option ${c.label}`}
                              value={c.val}
                              onChange={(e) => c.set(e.target.value)}
                              style={{
                                flex: 1,
                                padding: '8px 12px',
                                background: '#000',
                                border: correctChoiceIdx === c.idx ? '2px solid var(--neon-green)' : '1px solid #333',
                                color: '#fff',
                                borderRadius: 'var(--radius-sm)',
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '11px', fontFamily: 'var(--font-pixel)', color: 'var(--text-muted)' }}>
                        EXPLANATION (SHOWN AFTER ANSWERING)
                      </label>
                      <input
                        type="text"
                        placeholder="Explain why this answer is correct..."
                        value={questionExplanation}
                        onChange={(e) => setQuestionExplanation(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          background: '#000',
                          border: '1px solid #333',
                          color: '#fff',
                          borderRadius: 'var(--radius-md)',
                          marginTop: '6px',
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                      <button
                        type="button"
                        onClick={() => setIsInlineCreatingMcq(false)}
                        className="retro-tool-btn"
                        style={{ padding: '10px 20px' }}
                      >
                        CANCEL
                      </button>
                      <button
                        type="submit"
                        className="btn-retro-secondary"
                        style={{ padding: '10px 24px', fontSize: '11px' }}
                      >
                        SAVE &amp; INSERT QUESTION 🎯
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              <>
                {/* Filter Toolbar */}
                <div
                  style={{
                    padding: '12px 24px',
                    background: '#101020',
                    borderBottom: '1px solid #222',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px',
                  }}
                >
                  {/* Search input */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '220px' }}>
                    <Search size={14} color="var(--neon-cyan)" />
                    <input
                      type="text"
                      placeholder="Filter questions by keyword or options..."
                      value={mcqSearchQuery}
                      onChange={(e) => setMcqSearchQuery(e.target.value)}
                      style={{
                        background: '#06060c',
                        border: '1px solid #333',
                        borderRadius: 'var(--radius-sm)',
                        padding: '6px 10px',
                        color: '#fff',
                        fontSize: '12px',
                        width: '100%',
                        outline: 'none',
                      }}
                    />
                    {mcqSearchQuery && (
                      <button
                        onClick={() => setMcqSearchQuery('')}
                        style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}
                      >
                        <X size={13} />
                      </button>
                    )}
                  </div>

                  {/* Difficulty Tabs */}
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {[
                      { key: 'all', label: `ALL (${allQuestionsInActiveStage.length})` },
                      { key: 'easy', label: `EASY (${allQuestionsInActiveStage.filter((q) => q.difficulty === 'easy').length})` },
                      { key: 'intermediate', label: `MED (${allQuestionsInActiveStage.filter((q) => q.difficulty === 'intermediate').length})` },
                      { key: 'hard', label: `HARD (${allQuestionsInActiveStage.filter((q) => q.difficulty === 'hard').length})` },
                    ].map((tab) => (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => {
                          soundFx.playSelect()
                          setMcqDifficultyFilter(tab.key)
                        }}
                        className="retro-tool-btn"
                        style={{
                          fontSize: '8px',
                          padding: '5px 8px',
                          background: mcqDifficultyFilter === tab.key ? 'var(--neon-cyan)' : '#000',
                          color: mcqDifficultyFilter === tab.key ? '#000' : 'var(--text-secondary)',
                          borderColor: mcqDifficultyFilter === tab.key ? 'var(--neon-cyan)' : '#333',
                        }}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Questions Scrollable List */}
                <div
                  style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '20px 24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                  }}
                >
                  {filteredStageMcqs.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>
                      <p style={{ fontFamily: 'var(--font-pixel)', fontSize: '11px', color: 'var(--neon-yellow)' }}>
                        NO MATCHING QUESTIONS FOUND
                      </p>
                      <p style={{ fontSize: '12px', marginTop: '6px' }}>
                        Try clearing your search query or switch to another difficulty tab.
                      </p>
                    </div>
                  ) : (
                    filteredStageMcqs.map((q, idx) => (
                      <div
                        key={q.id || idx}
                        style={{
                          background: '#121222',
                          border: '1px solid #2d2d48',
                          borderRadius: 'var(--radius-md)',
                          padding: '16px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px',
                        }}
                      >
                        {/* Meta Row */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span
                              className="arcade-tag-chip"
                              style={{
                                fontSize: '8px',
                                fontWeight: 'bold',
                                background:
                                  q.difficulty === 'hard'
                                    ? 'rgba(255, 0, 127, 0.2)'
                                    : q.difficulty === 'intermediate'
                                    ? 'rgba(255, 230, 0, 0.2)'
                                    : 'rgba(57, 255, 20, 0.2)',
                                borderColor:
                                  q.difficulty === 'hard'
                                    ? 'var(--neon-pink)'
                                    : q.difficulty === 'intermediate'
                                    ? 'var(--neon-yellow)'
                                    : 'var(--neon-green)',
                                color:
                                  q.difficulty === 'hard'
                                    ? 'var(--neon-pink)'
                                    : q.difficulty === 'intermediate'
                                    ? 'var(--neon-yellow)'
                                    : 'var(--neon-green)',
                              }}
                            >
                              {q.difficulty?.toUpperCase()}
                            </span>
                            <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                              Q#{idx + 1}
                            </span>
                          </div>

                          {/* Direct Delete Button */}
                          <button
                            type="button"
                            onClick={() => handleDeleteMcqDirect(q)}
                            className="retro-tool-btn"
                            style={{
                              fontSize: '9px',
                              padding: '5px 10px',
                              borderColor: 'var(--neon-pink)',
                              color: 'var(--neon-pink)',
                              background: 'rgba(255, 0, 127, 0.12)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                            }}
                            title="Delete this question"
                          >
                            <Trash2 size={12} />
                            <span>DELETE THIS MCQ</span>
                          </button>
                        </div>

                        {/* Question Prompt */}
                        <p style={{ color: '#ffffff', fontSize: '14px', fontWeight: 'bold', lineHeight: '1.4' }}>
                          {q.text}
                        </p>

                        {/* Code snippet if present */}
                        {q.code_snippet && (
                          <pre
                            style={{
                              background: '#080812',
                              border: '1px solid #333',
                              padding: '8px 12px',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '11px',
                              color: 'var(--neon-cyan)',
                              overflowX: 'auto',
                            }}
                          >
                            <code>{q.code_snippet}</code>
                          </pre>
                        )}

                        {/* Choices Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
                          {(q.choices || []).map((c, cIdx) => (
                            <div
                              key={c.id || cIdx}
                              style={{
                                background: c.is_correct ? 'rgba(57, 255, 20, 0.12)' : '#090914',
                                border: c.is_correct ? '1px solid var(--neon-green)' : '1px solid #26263a',
                                borderRadius: 'var(--radius-sm)',
                                padding: '8px 10px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontSize: '12px',
                                color: c.is_correct ? '#fff' : 'var(--text-secondary)',
                              }}
                            >
                              <span
                                style={{
                                  fontFamily: 'var(--font-pixel)',
                                  fontSize: '9px',
                                  color: c.is_correct ? 'var(--neon-green)' : '#666',
                                }}
                              >
                                {String.fromCharCode(65 + cIdx)}.
                              </span>
                              <span style={{ flex: 1 }}>{c.text}</span>
                              {c.is_correct && <Check size={13} color="var(--neon-green)" />}
                            </div>
                          ))}
                        </div>

                        {/* Explanation */}
                        {q.explanation && (
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                            💡 {q.explanation}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </>
            )}

            {/* Modal Footer */}
            <div
              style={{
                padding: '16px 24px',
                borderTop: '2px solid #222',
                background: '#080812',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px',
              }}
            >
              <button
                type="button"
                onClick={() => {
                  soundFx.playSelect()
                  setIsInlineCreatingMcq(!isInlineCreatingMcq)
                }}
                className={isInlineCreatingMcq ? 'retro-tool-btn' : 'btn-retro-secondary'}
                style={{ fontSize: '10px', padding: '8px 16px' }}
              >
                <Plus size={13} />
                <span>{isInlineCreatingMcq ? '← BACK TO QUESTIONS LIST' : 'INSERT NEW MCQ QUESTION'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsInlineCreatingMcq(false)
                  setShowMcqManagerModal(false)
                }}
                className="retro-tool-btn"
                style={{ padding: '8px 20px', fontSize: '10px' }}
              >
                DONE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 6: USER & ADMIN PRIVILEGES CONSOLE */}

      {/* ================================================================= */}
      {showPrivilegesModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(8px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            style={{
              background: '#0c0c18',
              border: '3px solid var(--neon-yellow)',
              boxShadow: '8px 8px 0px var(--neon-yellow)',
              borderRadius: 'var(--radius-xl)',
              width: '100%',
              maxWidth: '860px',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '20px 24px',
                borderBottom: '2px solid #222',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#080812',
              }}
            >
              <div>
                <div className="hero-tag-badge" style={{ color: 'var(--neon-yellow)', borderColor: 'var(--neon-yellow)' }}>
                  <ShieldCheck size={14} />
                  <span>ARCADE OPERATOR &amp; ADMIN PRIVILEGES</span>
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 'bold', color: '#fff', marginTop: '4px' }}>
                  PLAYER ACCOUNTS &amp; PERMISSIONS
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginTop: '2px' }}>
                  Grant or revoke staff &amp; superuser admin powers for any registered player account.
                </p>
              </div>

              <button
                onClick={() => setShowPrivilegesModal(false)}
                className="retro-tool-btn"
                style={{ padding: '6px', borderRadius: '50%' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Quick Grant by Email Bar */}
            <form
              onSubmit={handlePromoteEmail}
              style={{
                padding: '14px 24px',
                background: '#121224',
                borderBottom: '1px solid #282840',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                flexWrap: 'wrap',
              }}
            >
              <span style={{ fontSize: '10px', fontFamily: 'var(--font-pixel)', color: 'var(--neon-yellow)' }}>
                GRANT ADMIN TO EMAIL:
              </span>
              <input
                type="email"
                required
                placeholder="player@example.com..."
                value={promoteEmailInput}
                onChange={(e) => setPromoteEmailInput(e.target.value)}
                style={{
                  flex: 1,
                  minWidth: '220px',
                  background: '#06060c',
                  border: '1px solid #444',
                  borderRadius: 'var(--radius-sm)',
                  padding: '7px 12px',
                  color: '#fff',
                  fontSize: '12px',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                className="btn-retro-yellow"
                style={{ fontSize: '9px', padding: '8px 16px' }}
              >
                <span>⚡ GRANT ADMIN PRIVILEGE</span>
              </button>
            </form>

            {/* Users List */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '20px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              {loadingUsers ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--neon-yellow)', fontFamily: 'var(--font-pixel)', fontSize: '11px' }}>
                  FETCHING REGISTERED ACCOUNTS...
                </div>
              ) : usersList.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                  No accounts found. Use the box above to grant privileges to any email.
                </div>
              ) : (
                usersList.map((u) => {
                  const isUserAdmin = Boolean(u.is_staff || u.is_superuser || u.is_admin)
                  return (
                    <div
                      key={u.id}
                      style={{
                        background: '#121222',
                        border: isUserAdmin ? '2px solid var(--neon-yellow)' : '1px solid #28283a',
                        borderRadius: 'var(--radius-md)',
                        padding: '14px 18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '12px',
                      }}
                    >
                      {/* Left: Avatar + Details */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div
                          style={{
                            width: '42px',
                            height: '42px',
                            background: '#000',
                            border: '1px solid #333',
                            borderRadius: 'var(--radius-md)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '22px',
                          }}
                        >
                          {u.avatar || '👾'}
                        </div>

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 'bold', color: '#fff' }}>
                              {u.name || u.username}
                            </span>
                            <span
                              className="arcade-tag-chip"
                              style={{
                                fontSize: '8px',
                                background: isUserAdmin ? 'rgba(255, 230, 0, 0.2)' : 'rgba(0, 240, 255, 0.1)',
                                borderColor: isUserAdmin ? 'var(--neon-yellow)' : '#333',
                                color: isUserAdmin ? 'var(--neon-yellow)' : 'var(--text-secondary)',
                              }}
                            >
                              {isUserAdmin ? '🛡️ ROOT ADMIN' : '🎮 PLAYER'}
                            </span>
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                            {u.email}
                          </div>
                        </div>
                      </div>

                      {/* Right: Toggle Button */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ fontSize: '10px', fontFamily: 'var(--font-pixel)', color: 'var(--text-muted)' }}>
                          {u.problems_solved || 0} SOLVED • 🔥 {u.streak || 0}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleTogglePrivilege(u)}
                          className="retro-tool-btn"
                          style={{
                            fontSize: '9px',
                            padding: '6px 12px',
                            borderColor: isUserAdmin ? 'var(--neon-pink)' : 'var(--neon-green)',
                            color: isUserAdmin ? 'var(--neon-pink)' : 'var(--neon-green)',
                            background: isUserAdmin ? 'rgba(255, 0, 127, 0.1)' : 'rgba(57, 255, 20, 0.1)',
                          }}
                        >
                          {isUserAdmin ? '🔒 REVOKE ADMIN' : '⚡ GRANT ADMIN PRIVILEGE'}
                        </button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: '14px 24px',
                borderTop: '2px solid #222',
                background: '#080812',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px',
              }}
            >
              <a
                href="http://localhost:8000/admin/auth/user/"
                target="_blank"
                rel="noopener noreferrer"
                className="retro-tool-btn"
                style={{ fontSize: '9px', padding: '6px 12px', borderColor: 'var(--neon-cyan)', color: 'var(--neon-cyan)', gap: '6px' }}
              >
                <Database size={12} />
                <span>MANAGE IN DJANGO AUTH ADMIN</span>
                <ExternalLink size={10} />
              </a>

              <button
                type="button"
                onClick={() => setShowPrivilegesModal(false)}
                className="btn-retro-yellow"
                style={{ padding: '8px 20px', fontSize: '10px' }}
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

