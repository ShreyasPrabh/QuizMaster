import { useState, useEffect, useCallback, useMemo } from 'react'
import { ALL_TOPIC_MODULES } from '../data/categories'
import { build20Questions, createTopic } from '../data/helpers'
import { TOPIC_MODULES } from '../data/topicModules'
import api from './api'

const CUSTOM_QUIZZES_KEY = 'quizmaster_custom_quizzes'
const DELETED_QUIZZES_KEY = 'quizmaster_deleted_quizzes'
const TOPICS_UPDATED_EVENT = 'quizmaster-topics-updated'

/**
 * Normalizes a topic key into a clean alphanumeric string.
 */
export function normalizeTopicKey(key) {
  return (key || '').toLowerCase().replace(/[^a-z0-9]/g, '')
}

/**
 * Loads custom quizzes saved in localStorage.
 */
function getStoredCustomQuizzes() {
  try {
    const raw = localStorage.getItem(CUSTOM_QUIZZES_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

/**
 * Loads the list of deleted topic IDs from localStorage.
 */
function getStoredDeletedIds() {
  try {
    const raw = localStorage.getItem(DELETED_QUIZZES_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

/**
 * Reconciles the global TOPIC_MODULES object with custom additions and deletions.
 */
export function getLiveTopics() {
  const custom = getStoredCustomQuizzes()
  const deleted = new Set(getStoredDeletedIds())

  const merged = {}

  // Include base cartridges that haven't been deleted
  Object.entries(ALL_TOPIC_MODULES).forEach(([key, topic]) => {
    const normKey = normalizeTopicKey(key)
    const normId = normalizeTopicKey(topic.id)
    if (!deleted.has(normKey) && !deleted.has(normId)) {
      merged[normKey] = topic
    }
  })

  // Include custom created cartridges
  Object.entries(custom).forEach(([key, topic]) => {
    const normKey = normalizeTopicKey(key)
    const normId = normalizeTopicKey(topic.id)
    if (!deleted.has(normKey) && !deleted.has(normId)) {
      merged[normKey] = topic
    }
  })

  // Synchronize mutable global TOPIC_MODULES in place so legacy imports match
  Object.keys(TOPIC_MODULES).forEach((k) => {
    delete TOPIC_MODULES[k]
  })
  Object.entries(merged).forEach(([k, v]) => {
    TOPIC_MODULES[k] = v
  })

  return merged
}

/**
 * Find a topic by id or slug from live store.
 */
export function getLiveTopic(topicId) {
  if (!topicId) return null
  const topics = getLiveTopics()
  const cleanKey = normalizeTopicKey(topicId)
  return topics[cleanKey] || Object.values(topics).find((t) => normalizeTopicKey(t.id) === cleanKey) || null
}

/**
 * Broadcast an update event so all listening components re-render immediately.
 */
function broadcastTopicsUpdated(topics) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(TOPICS_UPDATED_EVENT, { detail: { topics } }))
  }
}

/**
 * Add a new quiz cartridge.
 * Persists locally and synchronizes with Django backend API.
 */
export async function addQuizCartridge({
  name,
  category = 'Programming',
  icon = '⭐',
  description = '',
  color = 'from-blue-500 to-indigo-600',
  modulesData = [],
}) {
  const cleanId = normalizeTopicKey(name) || `quiz-${Date.now()}`
  const initialModules = modulesData.length > 0 ? modulesData : [
    {
      title: `${name} Fundamentals`,
      description: `Core concepts, syntax, and foundational principles of ${name}.`,
    }
  ]

  const newTopic = createTopic(cleanId, name, icon, category, description, initialModules)

  // 1. Update localStorage
  const custom = getStoredCustomQuizzes()
  custom[cleanId] = newTopic
  localStorage.setItem(CUSTOM_QUIZZES_KEY, JSON.stringify(custom))

  // Undelete if it was previously marked deleted
  const deleted = getStoredDeletedIds().filter((id) => id !== cleanId)
  localStorage.setItem(DELETED_QUIZZES_KEY, JSON.stringify(deleted))

  // 2. Sync to Django Backend API (best effort)
  try {
    await api.post('/admin/quizzes/create/', {
      name,
      slug: cleanId,
      icon,
      category,
      description,
      color,
      modules: initialModules.map((m) => ({
        name: m.title,
        description: m.description,
        questions: m.easyQuestions || [],
      })),
    })
  } catch (err) {
    console.warn('Backend API create quiz notice:', err.message)
  }

  const live = getLiveTopics()
  broadcastTopicsUpdated(live)
  return newTopic
}

/**
 * Remove a quiz cartridge completely.
 */
export async function removeQuizCartridge(topicId) {
  const cleanId = normalizeTopicKey(topicId)

  // 1. Remove from custom quizzes if present
  const custom = getStoredCustomQuizzes()
  if (custom[cleanId]) {
    delete custom[cleanId]
    localStorage.setItem(CUSTOM_QUIZZES_KEY, JSON.stringify(custom))
  }

  // 2. Add to deleted IDs set
  const deleted = getStoredDeletedIds()
  if (!deleted.includes(cleanId)) {
    deleted.push(cleanId)
    localStorage.setItem(DELETED_QUIZZES_KEY, JSON.stringify(deleted))
  }

  // 3. Sync to Django Backend API
  try {
    await api.delete(`/admin/quizzes/${cleanId}/delete/`)
  } catch (err) {
    console.warn('Backend API delete quiz notice:', err.message)
  }

  const live = getLiveTopics()
  broadcastTopicsUpdated(live)
  return true
}

/**
 * Add a module/stage to an existing quiz topic.
 */
export async function addModuleToCartridge(topicId, { title, description = '', customQuestions = [] }) {
  const cleanId = normalizeTopicKey(topicId)
  const topic = getLiveTopic(cleanId)
  if (!topic) throw new Error('Topic not found')

  const nextNumber = (topic.modules?.length || 0) + 1
  const moduleId = `${cleanId}-m${nextNumber}`

  const newModule = {
    id: moduleId,
    number: nextNumber,
    title,
    description,
    difficulties: {
      easy: build20Questions(customQuestions.filter((q) => q.difficulty === 'easy'), moduleId, topic.name, title, 'easy'),
      intermediate: build20Questions(customQuestions.filter((q) => q.difficulty === 'intermediate'), moduleId, topic.name, title, 'intermediate'),
      hard: build20Questions(customQuestions.filter((q) => q.difficulty === 'hard'), moduleId, topic.name, title, 'hard'),
    },
  }

  topic.modules = [...(topic.modules || []), newModule]

  // Save in custom store
  const custom = getStoredCustomQuizzes()
  custom[cleanId] = topic
  localStorage.setItem(CUSTOM_QUIZZES_KEY, JSON.stringify(custom))

  // Sync to Backend
  try {
    await api.post('/admin/subtopics/create/', {
      topic_id: cleanId,
      name: title,
      slug: moduleId,
      description,
      questions: customQuestions,
    })
  } catch (err) {
    console.warn('Backend API add subtopic notice:', err.message)
  }

  const live = getLiveTopics()
  broadcastTopicsUpdated(live)
  return newModule
}

/**
 * Remove a module/stage from a quiz topic.
 */
export async function removeModuleFromCartridge(topicId, moduleId) {
  const cleanId = normalizeTopicKey(topicId)
  const topic = getLiveTopic(cleanId)
  if (!topic) return false

  topic.modules = (topic.modules || []).filter((m) => m.id !== moduleId)

  const custom = getStoredCustomQuizzes()
  custom[cleanId] = topic
  localStorage.setItem(CUSTOM_QUIZZES_KEY, JSON.stringify(custom))

  // Sync to Backend
  try {
    await api.delete(`/admin/subtopics/${moduleId}/delete/`)
  } catch (err) {
    console.warn('Backend API delete subtopic notice:', err.message)
  }

  const live = getLiveTopics()
  broadcastTopicsUpdated(live)
  return true
}

/**
 * Add a custom question to a stage.
 */
export async function addQuestionToStage(topicId, moduleId, { text, difficulty = 'easy', explanation = '', codeSnippet = '', choices }) {
  const cleanId = normalizeTopicKey(topicId)
  const topic = getLiveTopic(cleanId)
  if (!topic) throw new Error('Topic not found')

  const moduleObj = (topic.modules || []).find((m) => m.id === moduleId)
  if (!moduleObj) throw new Error('Module not found')

  const diffKey = ['easy', 'intermediate', 'hard'].includes(difficulty) ? difficulty : 'easy'
  const targetList = moduleObj.difficulties?.[diffKey] || []

  const newQ = {
    id: `${moduleId}-${diffKey}-${Date.now()}`,
    text,
    difficulty: diffKey,
    code_snippet: codeSnippet || null,
    explanation: explanation || 'No explanation provided.',
    choices: choices.map((c, i) => ({
      id: String(i + 1),
      text: c.text,
      is_correct: Boolean(c.is_correct),
    })),
  }

  // Prepend new question to front of question bank
  moduleObj.difficulties[diffKey] = [newQ, ...targetList.slice(0, 19)]

  const custom = getStoredCustomQuizzes()
  custom[cleanId] = topic
  localStorage.setItem(CUSTOM_QUIZZES_KEY, JSON.stringify(custom))

  try {
    await api.post('/admin/questions/create/', {
      subtopic_id: moduleId,
      text,
      difficulty: diffKey,
      code_snippet: codeSnippet,
      explanation,
      choices,
    })
  } catch (err) {
    console.warn('Backend API create question notice:', err.message)
  }

  const live = getLiveTopics()
  broadcastTopicsUpdated(live)
  return newQ
}

/**
 * Remove an individual question from a stage.
 */
export async function removeQuestionFromStage(topicId, moduleId, difficulty, questionId) {
  const cleanId = normalizeTopicKey(topicId)
  const topic = getLiveTopic(cleanId)
  if (!topic) return false

  // Clone module list so built-in cartridges can have questions removed too
  const custom = getStoredCustomQuizzes()
  const activeTopic = custom[cleanId] || JSON.parse(JSON.stringify(topic))

  const moduleObj = (activeTopic.modules || []).find((m) => m.id === moduleId)
  if (!moduleObj || !moduleObj.difficulties) return false

  let removed = false
  const targetDiffs = difficulty && moduleObj.difficulties[difficulty]
    ? [difficulty]
    : ['easy', 'intermediate', 'hard']

  targetDiffs.forEach((d) => {
    if (moduleObj.difficulties[d]) {
      const prevLen = moduleObj.difficulties[d].length
      moduleObj.difficulties[d] = moduleObj.difficulties[d].filter((q) => String(q.id) !== String(questionId))
      if (moduleObj.difficulties[d].length < prevLen) {
        removed = true
      }
    }
  })

  if (!removed) return false

  custom[cleanId] = activeTopic
  localStorage.setItem(CUSTOM_QUIZZES_KEY, JSON.stringify(custom))

  try {
    await api.delete(`/admin/questions/${questionId}/delete/`)
  } catch (err) {
    console.warn('Backend API delete question notice:', err.message)
  }

  const live = getLiveTopics()
  broadcastTopicsUpdated(live)
  return true
}


/**
 * Reset all quiz cartridges back to factory defaults.
 */
export function resetToDefaults() {
  localStorage.removeItem(CUSTOM_QUIZZES_KEY)
  localStorage.removeItem(DELETED_QUIZZES_KEY)
  const live = getLiveTopics()
  broadcastTopicsUpdated(live)
  return live
}

/**
 * React Hook for consuming and subscribing to live quiz cartridges.
 */
export function useQuizCartridges() {
  const [topicMap, setTopicMap] = useState(() => getLiveTopics())
  const [isBackendConnected, setIsBackendConnected] = useState(true)

  // Listen for local updates across components & windows
  useEffect(() => {
    const handleUpdate = () => {
      setTopicMap(getLiveTopics())
    }
    window.addEventListener(TOPICS_UPDATED_EVENT, handleUpdate)
    window.addEventListener('storage', handleUpdate)
    return () => {
      window.removeEventListener(TOPICS_UPDATED_EVENT, handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [])

  // Sync with Django Backend API on mount
  useEffect(() => {
    let mounted = true
    api.get('/admin/quizzes/')
      .then((res) => {
        if (mounted && res.data?.topics && Array.isArray(res.data.topics)) {
          setIsBackendConnected(true)
          const custom = getStoredCustomQuizzes()
          let changed = false
          res.data.topics.forEach((bt) => {
            const cleanId = normalizeTopicKey(bt.slug || bt.name)
            if (!custom[cleanId] && !ALL_TOPIC_MODULES[cleanId]) {
              const modulesData = (bt.subtopics || []).map((s) => ({
                title: s.name,
                description: s.description || '',
                easyQuestions: s.questions || [],
              }))
              custom[cleanId] = createTopic(
                cleanId,
                bt.name,
                bt.icon || '⭐',
                bt.category || 'General',
                bt.description || '',
                modulesData
              )
              changed = true
            }
          })
          if (changed) {
            localStorage.setItem(CUSTOM_QUIZZES_KEY, JSON.stringify(custom))
            setTopicMap(getLiveTopics())
          }
        }
      })
      .catch(() => {
        if (mounted) setIsBackendConnected(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  const topicsList = useMemo(() => Object.values(topicMap), [topicMap])

  const stats = useMemo(() => {
    let totalModules = 0
    let totalQuestions = 0

    topicsList.forEach((t) => {
      const mods = t.modules || []
      totalModules += mods.length
      mods.forEach((m) => {
        const easy = m.difficulties?.easy?.length || 0
        const med = m.difficulties?.intermediate?.length || 0
        const hard = m.difficulties?.hard?.length || 0
        totalQuestions += (easy + med + hard)
      })
    })

    return {
      totalTopics: topicsList.length,
      totalModules,
      totalQuestions,
      isBackendConnected,
    }
  }, [topicsList, isBackendConnected])

  return {
    topics: topicsList,
    topicMap,
    stats,
    addQuiz: addQuizCartridge,
    removeQuiz: removeQuizCartridge,
    addModule: addModuleToCartridge,
    removeModule: removeModuleFromCartridge,
    addQuestion: addQuestionToStage,
    removeQuestion: removeQuestionFromStage,
    resetDefaults: resetToDefaults,
  }
}
