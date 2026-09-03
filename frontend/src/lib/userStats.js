// Helper utility to get and update real user quiz progress, arcade stats, XP, and achievements

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
    if (saved) {
      const parsed = JSON.parse(saved)
      const correct = parsed.correct_solved || 0
      const quizzes = parsed.quizzes_completed || 0
      const totalXp = correct * 25 + quizzes * 50
      const level = Math.floor(totalXp / 200) + 1
      const xpInLevel = totalXp % 200
      return {
        ...parsed,
        total_xp: totalXp,
        level,
        xp_in_level: xpInLevel,
        xp_needed: 200,
        coins: parsed.coins ?? (correct * 10 + 50),
        high_score: parsed.high_score || 0,
      }
    }
  } catch {}

  return {
    current_streak: 0,
    problems_solved: 0,
    correct_solved: 0,
    accuracy: 0,
    max_streak: 0,
    quizzes_completed: 0,
    last_quiz_date: null,
    total_xp: 0,
    level: 1,
    xp_in_level: 0,
    xp_needed: 200,
    coins: 100,
    high_score: 0,
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

export function recordQuizAttempt(
  topicName,
  moduleTitle,
  difficulty,
  totalQuestions,
  correctQuestions,
  userId,
  topicId,
  moduleId,
  timeBonus = 0
) {
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

  // Session score in arcade points
  const basePoints = correctQuestions * 100
  const streakBonus = Math.min(streak * 25, 250)
  const diffMultiplier = difficulty === 'hard' ? 1.5 : difficulty === 'intermediate' ? 1.2 : 1.0
  const sessionScore = Math.round((basePoints + timeBonus + streakBonus) * diffMultiplier)

  // Arcade coins earned
  const coinsEarned = correctQuestions * 10 + (correctQuestions === totalQuestions ? 50 : 10)
  const newCoins = (currentStats.coins || 0) + coinsEarned

  const newHighScore = Math.max(currentStats.high_score || 0, sessionScore)

  const updatedStats = {
    current_streak: streak,
    problems_solved: newTotalSolved,
    correct_solved: newCorrectSolved,
    accuracy: newAccuracy,
    max_streak: maxStreak,
    quizzes_completed: completedCount,
    last_quiz_date: todayStr,
    coins: newCoins,
    high_score: newHighScore,
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
        arcade_score: sessionScore,
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
      score: sessionScore,
      coins: coinsEarned,
      date: new Date().toLocaleDateString(),
    })
    // Keep last 30
    localStorage.setItem(histKey, JSON.stringify(history.slice(0, 30)))
  } catch {}

  return {
    ...updatedStats,
    sessionScore,
    coinsEarned,
  }
}

export function getQuizHistory(userId) {
  try {
    const key = getHistoryKey(userId)
    return JSON.parse(localStorage.getItem(key) || '[]')
  } catch {
    return []
  }
}

export const RETRO_AVATARS = [
  { id: 'pixel_ninja', emoji: '🥷', name: 'Cyber Ninja', rarity: 'Legendary' },
  { id: 'alien_invader', emoji: '👾', name: '8-Bit Invader', rarity: 'Common' },
  { id: 'retro_wizard', emoji: '🧙‍♂️', name: 'Code Mage', rarity: 'Rare' },
  { id: 'arcade_bot', emoji: '🤖', name: 'Mecha P1', rarity: 'Rare' },
  { id: 'cyber_cat', emoji: '🐱‍👤', name: 'Matrix Neko', rarity: 'Epic' },
  { id: 'astro_gamer', emoji: '👨‍🚀', name: 'Space Cadet', rarity: 'Common' },
  { id: 'skull_punk', emoji: '💀', name: 'Neon Glitch', rarity: 'Epic' },
  { id: 'joystick_hero', emoji: '🕹️', name: 'Retro Pilot', rarity: 'Common' },
  { id: 'pixel_crown', emoji: '👑', name: 'High Scorer', rarity: 'Legendary' },
  { id: 'fire_demon', emoji: '🔥', name: 'Streak Flame', rarity: 'Rare' },
  { id: 'lightning_spark', emoji: '⚡', name: 'Overclocker', rarity: 'Rare' },
  { id: 'target_master', emoji: '🎯', name: 'Bullseye', rarity: 'Epic' },
]

export const RETRO_ACHIEVEMENTS = [
  { id: 'first_quiz', name: 'INSERT COIN', desc: 'Complete your first quiz session', icon: '🪙' },
  { id: 'high_acc', name: 'PERFECTIONIST', desc: 'Score 100% on any module', icon: '🌟' },
  { id: 'streak_3', name: 'ON FIRE', desc: 'Reach a 3-day active streak', icon: '🔥' },
  { id: 'solved_50', name: 'HALF CENTURY', desc: 'Answer 50 questions correctly', icon: '⚡' },
  { id: 'hard_tier', name: 'NIGHTMARE MODE', desc: 'Finish a Hard difficulty quiz', icon: '💀' },
  { id: 'level_5', name: 'ARCADE VETERAN', desc: 'Reach Player Level 5', icon: '👑' },
]
