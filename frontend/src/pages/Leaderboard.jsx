import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ChevronLeft, ChevronRight, Trophy, Flame, Play, Award, Sparkles, UserCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getUserStats } from '../lib/userStats'
import api from '../lib/api'

const PAGE_SIZE = 20
const LEADERBOARD_CACHE_KEY = 'qm_leaderboard_cache'

export default function Leaderboard() {
  const { user } = useAuth()
  const [filter, setFilter] = useState('All Time')
  const [currentPage, setCurrentPage] = useState(1)

  // Instant zero-delay load from cache or local statistics
  const [leaders, setLeaders] = useState(() => {
    try {
      const cached = localStorage.getItem(LEADERBOARD_CACHE_KEY)
      if (cached) return JSON.parse(cached)
    } catch {
      // ignore
    }
    const localStats = getUserStats(user?.id)
    const myAvatar = user?.avatar || (user?.id && localStorage.getItem(`quizmaster-avatar-${user.id}`)) || '🧑‍🎓'
    const myRawName = user?.name || 'You'
    const myPoints = ((localStats.correct_solved || 0) * 10) + ((localStats.problems_solved || 0) * 2)
    return [
      {
        rank: 1,
        name: myRawName,
        avatar: myAvatar,
        streak: localStats.current_streak || 0,
        points: myPoints,
        medal: '🥇',
        isCurrentUser: true,
      },
    ]
  })

  useEffect(() => {
    const localStats = getUserStats(user?.id)
    const myAvatar = user?.avatar || (user?.id && localStorage.getItem(`quizmaster-avatar-${user.id}`)) || '🧑‍🎓'
    const myRawName = user?.name || 'You'
    const myPoints = ((localStats.correct_solved || 0) * 10) + ((localStats.problems_solved || 0) * 2)

    api.get('/leaderboard/')
      .then((res) => {
        if (res.data?.leaderboard && res.data.leaderboard.length > 0) {
          let list = res.data.leaderboard.map((item) => {
            const cleanAvatar = (item.avatar && item.avatar.length <= 2) ? item.avatar : '🧑‍🎓'
            if (item.isCurrentUser) {
              return {
                ...item,
                avatar: myAvatar,
                name: myRawName,
                streak: Math.max(item.streak || 0, localStats.current_streak || 0),
                points: Math.max(item.points || 0, myPoints),
              }
            }
            return {
              ...item,
              avatar: cleanAvatar,
            }
          })

          const hasMe = list.some((i) => i.isCurrentUser)
          if (!hasMe) {
            list.push({
              name: myRawName,
              avatar: savedAvatar,
              streak: localStats.current_streak || 0,
              points: myPoints,
              isCurrentUser: true,
            })
          }

          // Sort descending by points, then streak
          list.sort((a, b) => {
            if ((b.points || 0) !== (a.points || 0)) {
              return (b.points || 0) - (a.points || 0)
            }
            return (b.streak || 0) - (a.streak || 0)
          })

          const medals = ['🥇', '🥈', '🥉']
          list = list.map((item, idx) => ({
            ...item,
            rank: idx + 1,
            medal: idx < 3 ? medals[idx] : null,
          }))

          setLeaders(list)
          try {
            localStorage.setItem(LEADERBOARD_CACHE_KEY, JSON.stringify(list))
          } catch {
            // ignore
          }
        }
      })
      .catch(() => {
        // Keep current state
      })
  }, [user])

  // Always guarantee current user's name and avatar match their own authenticated user profile
  const displayLeaders = useMemo(() => {
    const currentName = user?.name || 'You'
    const currentAvatar = user?.avatar || (user?.id && localStorage.getItem(`quizmaster-avatar-${user.id}`)) || '🧑‍🎓'
    return leaders.map((item) => {
      if (item.isCurrentUser) {
        return {
          ...item,
          name: currentName,
          avatar: currentAvatar,
        }
      }
      return item
    })
  }, [leaders, user])

  // Current user's individual entry
  const currentUserEntry = useMemo(() => {
    return displayLeaders.find((i) => i.isCurrentUser) || displayLeaders[0]
  }, [displayLeaders])

  // Paginated 20 users per page
  const totalPages = Math.ceil(displayLeaders.length / PAGE_SIZE) || 1
  const paginatedLeaders = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return displayLeaders.slice(start, start + PAGE_SIZE)
  }, [displayLeaders, currentPage])

  return (
    <div className="qm-leaderboard-page">
      {/* HEADER */}
      <div className="qm-analytics-header-row">
        <div className="qm-page-welcome-header">
          <h1>Leaderboard</h1>
          <p>Top 20 rankings based on verified quiz performance, XP points, and streaks</p>
        </div>

        <div className="qm-time-select-pill">
          <span>{filter}</span>
          <ChevronDown size={16} />
        </div>
      </div>

      {/* PINNED CURRENT USER RANK CARD */}
      {currentUserEntry && (
        <div className="qm-user-rank-highlight-card mb-4">
          <div className="qm-user-rank-left">
            <div className="qm-rank-badge-box">
              {currentUserEntry.medal ? (
                <span className="text-2xl">{currentUserEntry.medal}</span>
              ) : (
                <span className="font-bold text-lg text-indigo">#{currentUserEntry.rank}</span>
              )}
              <span className="qm-rank-subtitle">Your Rank</span>
            </div>

            <div className="qm-user-avatar-circle">{currentUserEntry.avatar}</div>

            <div className="qm-user-rank-details">
              <h3>{currentUserEntry.name.replace(/\(You\)/gi, '').trim()} (You)</h3>
              <p>Active learner · Top performer</p>
            </div>
          </div>

          <div className="qm-user-rank-right">
            <div className="qm-rank-metric-box">
              <span className="metric-label">Streak</span>
              <span className="metric-value text-amber">
                {currentUserEntry.streak || 0} <Flame size={16} className="inline" />
              </span>
            </div>

            <div className="qm-rank-metric-box">
              <span className="metric-label">Total Points</span>
              <span className="metric-value text-indigo">
                {(currentUserEntry.points || 0).toLocaleString()} XP
              </span>
            </div>
          </div>
        </div>
      )}

      {/* LEADERBOARD TABLE CARD */}
      <div className="qm-card qm-leaderboard-card">
        <div className="qm-leaderboard-table-header">
          <span className="col-rank">Rank</span>
          <span className="col-user">User</span>
          <span className="col-streak text-center">Streak</span>
          <span className="col-points text-right">Points (XP)</span>
        </div>

        <div className="qm-leaderboard-list">
          {paginatedLeaders.map((item) => {
            const isMe = item.isCurrentUser
            const cleanName = item.name.replace(/\(You\)/gi, '').trim()
            const displayName = isMe ? `${cleanName || 'You'} (You)` : cleanName

            return (
              <div
                key={item.rank}
                className={`qm-leaderboard-row ${isMe ? 'highlight-user' : ''}`}
              >
                <div className="col-rank">
                  {item.medal ? (
                    <span className="rank-medal">{item.medal}</span>
                  ) : (
                    <span className="rank-number">#{item.rank}</span>
                  )}
                </div>

                <div className="col-user user-info-cell">
                  <div className="user-avatar-circle">{item.avatar}</div>
                  <span className="user-full-name">{displayName}</span>
                </div>

                <div className="col-streak text-center">
                  <span className="streak-badge-inline">
                    <strong>{item.streak || 0}</strong>{' '}
                    <Flame size={14} className="text-amber inline" />
                  </span>
                </div>

                <div className="col-points text-right">
                  <span className="points-bold">{(item.points || 0).toLocaleString()} XP</span>
                </div>
              </div>
            )
          })}

          {/* EMPTY / CALL TO ACTION FOOTER */}
          {leaders.every((l) => (l.points || 0) === 0) && (
            <div className="qm-leaderboard-cta-banner">
              <Sparkles size={24} className="text-amber" />
              <p>
                Complete your first quiz module to earn XP and claim the #1 spot!
              </p>
              <Link to="/topics" className="qm-btn-primary-sm">
                <Play size={14} fill="currentColor" />
                <span>Start Practicing</span>
              </Link>
            </div>
          )}
        </div>

        {/* TOP 20 PAGINATION FOOTER */}
        {leaders.length > PAGE_SIZE && (
          <div className="qm-leaderboard-pagination">
            <span className="qm-pagination-count">
              Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, leaders.length)} of {leaders.length} players
            </span>

            <div className="qm-pagination-btns">
              <button
                className="qm-page-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              >
                <ChevronLeft size={16} />
                <span>Previous</span>
              </button>

              <span className="qm-page-indicator">
                Page {currentPage} of {totalPages}
              </span>

              <button
                className="qm-page-btn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              >
                <span>Next</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
