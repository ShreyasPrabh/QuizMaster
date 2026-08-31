// Helper utility to get and update real user quiz progress and statistics strictly per authenticated account

function getCurrentUserId(explicitUserId) {
  if (explicitUserId) return String(explicitUserId)
  try {
    const userStr = localStorage.getItem('quiz-user')
    if (userStr) {
      const u = JSON.parse(userStr)
      if (u?.id) return String(u.id)
      if (u?.email) return String(u.email)
    }
  } catch {}
  return 'guest'
}

function getStatsKey(userId) {
  return `quizmaster_user_stats_${getCurrentUserId(userId)}`
}

function getHistoryKey(userId) {
  return `quizmaster_quiz_history_${getCurrentUserId(userId)}`
}

export function getUserStats(userId) {
  try {
    const key = getStatsKey(userId)
    const saved = localStorage.getItem(key)
    if (saved) return JSON.parse(saved)
  } catch {}

  return {
    current_streak: 0,
    problems_solved: 0,
    correct_solved: 0,
    accuracy: 0,
    max_streak: 0,
    last_quiz_date: null,
  }
}

function getCompletedModulesKey(userId) {
  return `quizmaster_completed_modules_${getCurrentUserId(userId)}`
}

export function getCompletedModules(userId) {
  try {
    const key = getCompletedModulesKey(userId)
    return JSON.parse(localStorage.getItem(key) || '{}')
  } catch {
    return {}
  }
}

export function recordQuizAttempt(topicName, moduleTitle, difficulty, totalQuestions, correctQuestions, userId, topicId, moduleId) {
  const currentStats = getUserStats(userId)
  const todayStr = new Date().toISOString().split('T')[0]

  const newTotalSolved = (currentStats.problems_solved || 0) + totalQuestions
  const newCorrectSolved = (currentStats.correct_solved || 0) + correctQuestions
  const newAccuracy = newTotalSolved > 0 ? Math.round((newCorrectSolved / newTotalSolved) * 100) : 0
  const completedCount = (currentStats.quizzes_completed || 0) + 1

  // Calculate Streak
  let streak = currentStats.current_streak || 0
  let maxStreak = currentStats.max_streak || 0

  if (!currentStats.last_quiz_date) {
    streak = 1
  } else if (currentStats.last_quiz_date === todayStr) {
    if (streak === 0) streak = 1
  } else {
    const lastDate = new Date(currentStats.last_quiz_date)
    const today = new Date(todayStr)
    const diffDays = Math.round((today - lastDate) / (1000 * 60 * 60 * 24))

    if (diffDays === 1) {
      streak += 1
    } else if (diffDays > 1) {
      streak = 1
    }
  }

  if (streak > maxStreak) {
    maxStreak = streak
  }

  const updatedStats = {
    current_streak: streak,
    problems_solved: newTotalSolved,
    correct_solved: newCorrectSolved,
    accuracy: newAccuracy,
    max_streak: maxStreak,
    quizzes_completed: completedCount,
    last_quiz_date: todayStr,
  }

  const statsKey = getStatsKey(userId)
  localStorage.setItem(statsKey, JSON.stringify(updatedStats))

  // Record completed module
  if (topicId && moduleId && difficulty) {
    try {
      const compKey = getCompletedModulesKey(userId)
      const modules = JSON.parse(localStorage.getItem(compKey) || '{}')
      const tag = `${topicId}_${moduleId}_${difficulty}`
      modules[tag] = {
        score: correctQuestions,
        total: totalQuestions,
        percent: Math.round((correctQuestions / totalQuestions) * 100),
        date: todayStr,
      }
      localStorage.setItem(compKey, JSON.stringify(modules))
    } catch {}
  }

  // Record history per user
  try {
    const histKey = getHistoryKey(userId)
    const history = JSON.parse(localStorage.getItem(histKey) || '[]')
    history.unshift({
      id: Date.now(),
      topic: topicName,
      module: moduleTitle,
      difficulty,
      total: totalQuestions,
      correct: correctQuestions,
      percent: Math.round((correctQuestions / totalQuestions) * 100),
      date: new Date().toLocaleDateString(),
    })
    // Keep last 30
    localStorage.setItem(histKey, JSON.stringify(history.slice(0, 30)))
  } catch {}

  return updatedStats
}

export function getQuizHistory(userId) {
  try {
    const key = getHistoryKey(userId)
    return JSON.parse(localStorage.getItem(key) || '[]')
  } catch {
    return []
  }
}
