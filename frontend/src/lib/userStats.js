// Helper utility to get and update real user quiz progress and statistics

const STATS_KEY = 'quizmaster_user_stats'
const HISTORY_KEY = 'quizmaster_quiz_history'

export function getUserStats() {
  try {
    const saved = localStorage.getItem(STATS_KEY)
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

export function recordQuizAttempt(topicName, moduleTitle, difficulty, totalQuestions, correctQuestions) {
  const currentStats = getUserStats()
  const todayStr = new Date().toISOString().split('T')[0]

  const newTotalSolved = (currentStats.problems_solved || 0) + totalQuestions
  const newCorrectSolved = (currentStats.correct_solved || 0) + correctQuestions
  const newAccuracy = newTotalSolved > 0 ? Math.round((newCorrectSolved / newTotalSolved) * 100) : 0

  // Calculate Streak
  let streak = currentStats.current_streak || 0
  let maxStreak = currentStats.max_streak || 0

  if (!currentStats.last_quiz_date) {
    streak = 1
  } else if (currentStats.last_quiz_date === todayStr) {
    // Already did a quiz today, keep streak
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
    last_quiz_date: todayStr,
  }

  localStorage.setItem(STATS_KEY, JSON.stringify(updatedStats))

  // Record history
  try {
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]')
    history.unshift({
      id: Date.now(),
      topic: topicName,
      module: moduleTitle,
      difficulty,
      total: totalQuestions,
      correct: correctQuestions,
      date: new Date().toLocaleDateString(),
    })
    // Keep last 30
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 30)))
  } catch {}

  return updatedStats
}

export function getQuizHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]')
  } catch {
    return []
  }
}
