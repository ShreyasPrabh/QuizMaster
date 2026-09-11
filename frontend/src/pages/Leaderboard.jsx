import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Trophy, Flame, Play, Award, Sparkles, Filter, ChevronLeft, ChevronRight, RefreshCw, UserCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getUserStats, getCleanAvatar } from '../lib/userStats'
import soundFx from '../lib/soundFx'
import api from '../lib/api'

const PAGE_SIZE = 10

export default function Leaderboard() {
  const { user } = useAuth()
  const [timeframe, setTimeframe] = useState('All Time')
  const [sortBy, setSortBy] = useState('total') // 'total' or 'high_score'
  const [apiPlayers, setApiPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  const myStats = getUserStats(user?.id)
  const myAvatar = getCleanAvatar(user?.avatar || (user?.id && localStorage.getItem(`quizmaster-avatar-${user.id}`)))
  const myName = user?.name || (user?.isGuest ? 'PLAYER 1' : 'You')

  const [dbUserStats, setDbUserStats] = useState(null)

  // Fetch real players from the backend API
  const fetchLeaderboard = async () => {
    setLoading(true)
    try {
      if (user && !user.isGuest) {
        api.get('/user/stats/').then((sRes) => {
          if (sRes.data) {
            setDbUserStats(sRes.data)
            const statsKey = `quizmaster_user_stats_${user.id}`
            const local = JSON.parse(localStorage.getItem(statsKey) || '{}')
            localStorage.setItem(statsKey, JSON.stringify({ ...local, ...sRes.data }))
          }
        }).catch(() => {})
      }

      const res = await api.get(`/leaderboard/?timeframe=${timeframe.toLowerCase().replace(' ', '_')}&sort_by=${sortBy}`)
      if (res.data?.leaderboard && Array.isArray(res.data.leaderboard)) {
        setApiPlayers(res.data.leaderboard)
      } else {
        setApiPlayers([])
      }
    } catch (err) {
      console.warn('Could not fetch server leaderboard, falling back to local accounts:', err)
      try {
        const raw = localStorage.getItem('quiz_registered_accounts')
        if (raw) {
          const accounts = JSON.parse(raw)
          if (Array.isArray(accounts)) {
            const localPlayers = accounts.map((acc) => {
              const stats = getUserStats(acc.id)
              const high = stats.high_score || 0
              const pts = stats.total_score || ((stats.correct_solved || 0) * 100 + (stats.current_streak || 0) * 25)
              return {
                id: acc.id,
                name: acc.name || acc.email?.split('@')[0] || 'Player',
                avatar: getCleanAvatar(acc.avatar),
                streak: stats.current_streak || 0,
                accuracy: stats.accuracy || 0,
                high_score: high,
                total_points: pts,
                points: pts,
                isCurrentUser: user?.id === acc.id,
              }
            })
            setApiPlayers(localPlayers)
          }
        }
      } catch {}
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeaderboard()
    setCurrentPage(1)
  }, [timeframe, sortBy])

  // Integrate current player and compute real leaderboard
  const fullLeaderboard = useMemo(() => {
    const list = [...apiPlayers]

    if (user) {
      const userIndex = list.findIndex(
        (p) =>
          p.isCurrentUser ||
          (p.id && user.id && String(p.id) === String(user.id)) ||
          (p.name && user.name && p.name.toLowerCase().replace(' (you)', '') === user.name.toLowerCase())
      )

      const activeStreak = dbUserStats?.current_streak ?? myStats.current_streak ?? 0
      const activeCorrect = dbUserStats?.correct_solved ?? myStats.correct_solved ?? 0
      const activeAcc = dbUserStats?.accuracy ?? myStats.accuracy ?? 0
      const activeHighScore = dbUserStats?.high_score ?? myStats.high_score ?? 0
      const activeTotalScore = dbUserStats?.total_score ?? myStats.total_score ?? ((activeCorrect * 100) + (activeStreak * 25))
      const computedMyPoints = activeTotalScore

      if (userIndex !== -1) {
        list[userIndex] = {
          ...list[userIndex],
          name: `${user.name || myName} (YOU)`,
          avatar: myAvatar,
          streak: Math.max(list[userIndex].streak || 0, activeStreak),
          high_score: Math.max(list[userIndex].high_score || 0, activeHighScore),
          total_points: Math.max(list[userIndex].total_points || 0, computedMyPoints),
          points: Math.max(list[userIndex].points || 0, computedMyPoints),
          accuracy: list[userIndex].accuracy || activeAcc,
          isCurrentUser: true,
        }
      } else {
        list.push({
          id: user.id || 'current_user',
          name: `${myName} (YOU)`,
          avatar: myAvatar,
          streak: activeStreak,
          high_score: activeHighScore,
          total_points: computedMyPoints,
          points: computedMyPoints,
          accuracy: activeAcc,
          isCurrentUser: true,
        })
      }
    }

    // Sort by selected mode: high_score or total_points
    list.sort((a, b) => {
      if (sortBy === 'high_score') {
        const hA = Number(a.high_score) || 0
        const hB = Number(b.high_score) || 0
        if (hB !== hA) return hB - hA
        const ptsA = Number(a.total_points ?? a.points) || 0
        const ptsB = Number(b.total_points ?? b.points) || 0
        if (ptsB !== ptsA) return ptsB - ptsA
      } else {
        const ptsA = Number(a.total_points ?? a.points) || 0
        const ptsB = Number(b.total_points ?? b.points) || 0
        if (ptsB !== ptsA) return ptsB - ptsA
        const hA = Number(a.high_score) || 0
        const hB = Number(b.high_score) || 0
        if (hB !== hA) return hB - hA
      }
      return (Number(b.streak) || 0) - (Number(a.streak) || 0)
    })

    const medals = ['👑 1ST', '🥈 2ND', '🥉 3RD']
    return list.map((item, idx) => ({
      ...item,
      rank: idx + 1,
      medal: idx < 3 ? medals[idx] : `${idx + 1}TH`,
    }))
  }, [apiPlayers, user, myName, myAvatar, myStats, dbUserStats, sortBy])

  // Top 3 Podium players (from page 1 / global)
  const top1 = fullLeaderboard[0] || null
  const top2 = fullLeaderboard[1] || null
  const top3 = fullLeaderboard[2] || null

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(fullLeaderboard.length / PAGE_SIZE))
  const safePage = Math.min(Math.max(1, currentPage), totalPages)
  const startIndex = (safePage - 1) * PAGE_SIZE
  const pagedPlayers = fullLeaderboard.slice(startIndex, startIndex + PAGE_SIZE)

  // Current user rank detection
  const myRankEntry = fullLeaderboard.find((p) => p.isCurrentUser)
  const isMyRankOnCurrentPage = pagedPlayers.some((p) => p.isCurrentUser)
  const myRankPage = myRankEntry ? Math.ceil(myRankEntry.rank / PAGE_SIZE) : 1

  const handlePageChange = (newPage) => {
    soundFx.playSelect()
    setCurrentPage(newPage)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="hero-tag-badge">
            <span>🏆</span>
            <span>ARCADE HALL OF FAME</span>
          </div>
          <h1 className="section-retro-title">GLOBAL HIGH SCORES</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            Real players competing live across the arcade network!
          </p>
        </div>

        {/* TIMEFRAME & SORT TOGGLES */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => {
              soundFx.playSelect()
              fetchLeaderboard()
            }}
            className="retro-tool-btn"
            title="Refresh Scores"
            style={{
              background: 'var(--bg-card)',
              color: '#fff',
              borderColor: '#000',
              padding: '8px 10px',
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <RefreshCw size={12} className={loading ? 'spin-anim' : ''} />
          </button>

          {/* SORT MODE TOGGLE */}
          <div style={{ display: 'flex', gap: '2px', background: 'var(--bg-card)', padding: '2px', borderRadius: 'var(--radius-sm)', border: '2px solid #000' }}>
            <button
              onClick={() => {
                soundFx.playSelect()
                setSortBy('total')
              }}
              style={{
                background: sortBy === 'total' ? 'var(--neon-yellow)' : 'transparent',
                color: sortBy === 'total' ? '#000' : 'var(--text-muted)',
                border: 'none',
                fontFamily: 'var(--font-pixel)',
                fontSize: '8px',
                padding: '6px 10px',
                cursor: 'pointer',
                borderRadius: '2px',
                fontWeight: 'bold',
              }}
            >
              ⭐ TOTAL PTS
            </button>
            <button
              onClick={() => {
                soundFx.playSelect()
                setSortBy('high_score')
              }}
              style={{
                background: sortBy === 'high_score' ? 'var(--neon-green)' : 'transparent',
                color: sortBy === 'high_score' ? '#000' : 'var(--text-muted)',
                border: 'none',
                fontFamily: 'var(--font-pixel)',
                fontSize: '8px',
                padding: '6px 10px',
                cursor: 'pointer',
                borderRadius: '2px',
                fontWeight: 'bold',
              }}
            >
              🏆 HIGH SCORE
            </button>
          </div>

          {['All Time', 'This Week', 'Today'].map((t) => (
            <button
              key={t}
              onClick={() => {
                soundFx.playSelect()
                setTimeframe(t)
              }}
              className="retro-tool-btn"
              style={{
                background: timeframe === t ? 'var(--neon-cyan)' : 'var(--bg-card)',
                color: timeframe === t ? '#000' : '#fff',
                borderColor: '#000',
                padding: '8px 14px',
                fontSize: '10px',
              }}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* USER OWN RANK PINNED HUD BANNER */}
      {myRankEntry && (
        <div
          style={{
            background: 'rgba(0, 240, 255, 0.08)',
            border: '2px solid var(--neon-cyan)',
            boxShadow: '4px 4px 0px var(--neon-cyan)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: '#000',
                border: '2px solid var(--neon-cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
              }}
            >
              {myRankEntry.avatar}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '13px', color: 'var(--neon-yellow)' }}>
                  YOUR STANDING: RANK #{myRankEntry.rank}
                </span>
                <span className="arcade-tag-chip" style={{ background: 'var(--neon-cyan)', color: '#000', fontSize: '8px' }}>
                  {myRankEntry.rank <= 10 ? 'TOP 10 PLAYER' : `PAGE ${myRankPage}`}
                </span>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '3px' }}>
                {myRankEntry.name} • Best: {(myRankEntry.high_score || 0).toLocaleString()} PTS • Total: {(myRankEntry.total_points || myRankEntry.points || 0).toLocaleString()} PTS
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '12px', fontFamily: 'var(--font-pixel)', fontSize: '10px' }}>
              <span style={{ color: 'var(--neon-pink)' }}>{myRankEntry.streak} 🔥 STREAK</span>
              <span style={{ color: 'var(--neon-green)' }}>🏆 {(myRankEntry.high_score || 0).toLocaleString()} BEST</span>
              <span style={{ color: 'var(--neon-yellow)' }}>⭐ {(myRankEntry.total_points || myRankEntry.points || 0).toLocaleString()} TOTAL</span>
            </div>

            {!isMyRankOnCurrentPage && (
              <button
                onClick={() => handlePageChange(myRankPage)}
                className="retro-tool-btn"
                style={{
                  background: 'var(--neon-cyan)',
                  color: '#000',
                  borderColor: '#000',
                  fontSize: '9px',
                  padding: '6px 12px',
                  fontFamily: 'var(--font-pixel)',
                  cursor: 'pointer',
                }}
              >
                JUMP TO MY RANK (PG {myRankPage}) →
              </button>
            )}
          </div>
        </div>
      )}

      {loading && fullLeaderboard.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--neon-yellow)', fontFamily: 'var(--font-pixel)', fontSize: '12px' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>👾</div>
          LOADING REAL PLAYER SCORES...
        </div>
      ) : fullLeaderboard.length === 0 ? (
        <div
          style={{
            background: '#000',
            border: '3px solid var(--neon-pink)',
            boxShadow: '6px 6px 0px var(--neon-pink)',
            borderRadius: 'var(--radius-xl)',
            padding: '48px 24px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>👑</div>
          <h2 style={{ fontFamily: 'var(--font-pixel)', fontSize: '15px', color: 'var(--neon-yellow)', marginBottom: '12px' }}>
            NO HIGH SCORES RECORDED YET
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '420px', margin: '0 auto 24px' }}>
            Be the very first player to complete a quiz and claim the #1 Grand Champion spot on the leaderboard!
          </p>
          <Link to="/topics" className="btn-retro-primary" onClick={() => soundFx.playCoin()}>
            <Play size={14} />
            <span>PLAY A QUIZ NOW</span>
          </Link>
        </div>
      ) : (
        <>
          {/* TOP 3 PODIUM (Visible on Page 1) */}
          {safePage === 1 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: fullLeaderboard.length === 1 ? '1fr' : fullLeaderboard.length === 2 ? '1fr 1fr' : 'repeat(3, 1fr)',
                gap: '20px',
                alignItems: 'end',
                maxWidth: fullLeaderboard.length === 1 ? '380px' : fullLeaderboard.length === 2 ? '680px' : '100%',
                margin: '0 auto',
                width: '100%',
              }}
            >
              {/* 2ND PLACE (rendered on left if 3 players exist) */}
              {top2 && (
                <div
                  className="retro-cartridge-card"
                  style={{
                    textAlign: 'center',
                    padding: '24px 16px',
                    borderColor: '#e2e8f0',
                    boxShadow: '6px 6px 0px #e2e8f0',
                    order: fullLeaderboard.length >= 3 ? 1 : 2,
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '12px', color: '#e2e8f0', marginBottom: '8px' }}>
                    🥈 2ND PLACE
                  </div>
                  <div style={{ fontSize: '36px', marginBottom: '8px' }}>{top2.avatar}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 'bold', color: '#fff' }}>
                    {top2.name}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '8px' }}>
                    <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '11px', color: 'var(--neon-green)' }}>
                      🏆 {(top2.high_score || 0).toLocaleString()} BEST
                    </div>
                    <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '14px', color: 'var(--neon-yellow)' }}>
                      ⭐ {(top2.total_points || top2.points || 0).toLocaleString()} TOTAL
                    </div>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {top2.streak} 🔥 • {top2.accuracy}% ACC
                  </div>
                </div>
              )}

              {/* 1ST PLACE CROWN (rendered in center if 3 players exist) */}
              {top1 && (
                <div
                  className="retro-cartridge-card"
                  style={{
                    textAlign: 'center',
                    padding: '32px 16px',
                    borderColor: 'var(--neon-yellow)',
                    boxShadow: '8px 8px 0px var(--neon-yellow)',
                    background: '#000000',
                    transform: fullLeaderboard.length >= 3 ? 'translateY(-12px)' : 'none',
                    order: fullLeaderboard.length >= 3 ? 2 : 1,
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '14px', color: 'var(--neon-yellow)', marginBottom: '8px' }}>
                    👑 GRAND CHAMPION
                  </div>
                  <div style={{ fontSize: '48px', marginBottom: '8px' }}>{top1.avatar}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: '900', color: '#fff' }}>
                    {top1.name}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '8px' }}>
                    <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '13px', color: 'var(--neon-green)' }}>
                      🏆 BEST: {(top1.high_score || 0).toLocaleString()} PTS
                    </div>
                    <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '18px', color: 'var(--neon-yellow)' }}>
                      ⭐ TOTAL: {(top1.total_points || top1.points || 0).toLocaleString()} PTS
                    </div>
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--neon-cyan)', marginTop: '4px' }}>
                    {top1.streak} 🔥 Streak • {top1.accuracy}% ACC
                  </div>
                </div>
              )}

              {/* 3RD PLACE */}
              {top3 && (
                <div
                  className="retro-cartridge-card"
                  style={{
                    textAlign: 'center',
                    padding: '20px 16px',
                    borderColor: '#f97316',
                    boxShadow: '6px 6px 0px #f97316',
                    order: 3,
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '12px', color: '#f97316', marginBottom: '8px' }}>
                    🥉 3RD PLACE
                  </div>
                  <div style={{ fontSize: '36px', marginBottom: '8px' }}>{top3.avatar}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 'bold', color: '#fff' }}>
                    {top3.name}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '8px' }}>
                    <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '11px', color: 'var(--neon-green)' }}>
                      🏆 {(top3.high_score || 0).toLocaleString()} BEST
                    </div>
                    <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '14px', color: 'var(--neon-yellow)' }}>
                      ⭐ {(top3.total_points || top3.points || 0).toLocaleString()} TOTAL
                    </div>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {top3.streak} 🔥 • {top3.accuracy}% ACC
                  </div>
                </div>
              )}
            </div>
          )}

          {/* LEADERBOARD TABLE (TOP 10 PER PAGE + USER OWN RANK) */}
          <div style={{ background: '#000000', border: '4px solid #000', borderRadius: 'var(--radius-xl)', padding: '24px', boxShadow: '8px 8px 0px #000' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '10px', color: 'var(--neon-yellow)' }}>
                  {safePage === 1 ? 'TOP 10 PLAYERS' : `RANKS ${startIndex + 1} - ${Math.min(startIndex + PAGE_SIZE, fullLeaderboard.length)}`}
                </span>
                <span className="arcade-tag-chip" style={{ fontSize: '8px' }}>
                  PAGE {safePage} OF {totalPages}
                </span>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Total Contenders: {fullLeaderboard.length}
              </span>
            </div>

            <table className="highscore-table">
              <thead>
                <tr>
                  <th>RANK</th>
                  <th>PLAYER TAG</th>
                  <th>STREAK</th>
                  <th>ACCURACY</th>
                  <th
                    onClick={() => {
                      soundFx.playSelect()
                      setSortBy('high_score')
                    }}
                    style={{ cursor: 'pointer', color: sortBy === 'high_score' ? 'var(--neon-green)' : undefined }}
                    title="Sort by High Score"
                  >
                    HIGH SCORE {sortBy === 'high_score' ? '▼' : ''}
                  </th>
                  <th
                    onClick={() => {
                      soundFx.playSelect()
                      setSortBy('total')
                    }}
                    style={{ cursor: 'pointer', color: sortBy === 'total' ? 'var(--neon-yellow)' : undefined }}
                    title="Sort by Total Points"
                  >
                    TOTAL PTS {sortBy === 'total' ? '▼' : ''}
                  </th>
                </tr>
              </thead>
              <tbody>
                {pagedPlayers.map((player) => (
                  <tr
                    key={player.rank + '-' + (player.id || player.name)}
                    style={{
                      background: player.isCurrentUser ? 'rgba(0, 240, 255, 0.15)' : 'transparent',
                      borderLeft: player.isCurrentUser ? '4px solid var(--neon-cyan)' : 'none',
                    }}
                  >
                    <td style={{ fontFamily: 'var(--font-pixel)' }}>
                      <span className={player.rank === 1 ? 'rank-gold' : player.rank === 2 ? 'rank-silver' : player.rank === 3 ? 'rank-bronze' : ''}>
                        {player.medal}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '18px' }}>{player.avatar}</span>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 'bold', color: player.isCurrentUser ? 'var(--neon-cyan)' : '#fff' }}>
                          {player.name}
                        </span>
                        {player.isCurrentUser && (
                          <span className="arcade-tag-chip" style={{ background: 'var(--neon-cyan)', color: '#000', fontSize: '7px' }}>
                            YOU
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ color: 'var(--neon-pink)' }}>{player.streak} 🔥</td>
                    <td style={{ color: 'var(--neon-green)' }}>{player.accuracy}%</td>
                    <td style={{ fontFamily: 'var(--font-pixel)', color: 'var(--neon-green)' }}>
                      {(player.high_score || 0).toLocaleString()} PTS
                    </td>
                    <td style={{ fontFamily: 'var(--font-pixel)', color: 'var(--neon-yellow)' }}>
                      {(player.total_points || player.points || 0).toLocaleString()} PTS
                    </td>
                  </tr>
                ))}

                {/* IF CURRENT USER IS NOT ON THIS PAGE, PIN USER'S OWN RANK AT THE BOTTOM */}
                {!isMyRankOnCurrentPage && myRankEntry && (
                  <>
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '10px 0', borderTop: '2px dashed #334155' }}>
                        <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '9px', color: 'var(--neon-cyan)', letterSpacing: '2px' }}>
                          ▼ YOUR OWN RANK (PAGE {myRankPage}) ▼
                        </span>
                      </td>
                    </tr>
                    <tr
                      style={{
                        background: 'rgba(0, 240, 255, 0.18)',
                        borderLeft: '4px solid var(--neon-cyan)',
                        borderBottom: '2px solid var(--neon-cyan)',
                      }}
                    >
                      <td style={{ fontFamily: 'var(--font-pixel)' }}>
                        <span style={{ color: 'var(--neon-cyan)' }}>{myRankEntry.medal}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '18px' }}>{myRankEntry.avatar}</span>
                          <span style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 'bold', color: 'var(--neon-cyan)' }}>
                            {myRankEntry.name}
                          </span>
                          <span className="arcade-tag-chip" style={{ background: 'var(--neon-cyan)', color: '#000', fontSize: '7px' }}>
                            YOU
                          </span>
                        </div>
                      </td>
                      <td style={{ color: 'var(--neon-pink)' }}>{myRankEntry.streak} 🔥</td>
                      <td style={{ color: 'var(--neon-green)' }}>{myRankEntry.accuracy}%</td>
                      <td style={{ fontFamily: 'var(--font-pixel)', color: 'var(--neon-green)' }}>
                        {(myRankEntry.high_score || 0).toLocaleString()} PTS
                      </td>
                      <td style={{ fontFamily: 'var(--font-pixel)', color: 'var(--neon-yellow)' }}>
                        {(myRankEntry.total_points || myRankEntry.points || 0).toLocaleString()} PTS
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>

            {/* PAGINATION CONTROLS */}
            {totalPages > 1 && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '20px',
                  paddingTop: '16px',
                  borderTop: '2px solid #1e293b',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Showing {startIndex + 1} - {Math.min(startIndex + PAGE_SIZE, fullLeaderboard.length)} of {fullLeaderboard.length}
                </span>

                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <button
                    disabled={safePage === 1}
                    onClick={() => handlePageChange(safePage - 1)}
                    className="retro-tool-btn"
                    style={{
                      padding: '6px 12px',
                      fontSize: '10px',
                      opacity: safePage === 1 ? 0.4 : 1,
                      cursor: safePage === 1 ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <ChevronLeft size={14} />
                    <span>PREV</span>
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className="retro-tool-btn"
                      style={{
                        padding: '6px 10px',
                        fontSize: '10px',
                        minWidth: '32px',
                        background: safePage === pageNum ? 'var(--neon-yellow)' : 'var(--bg-card)',
                        color: safePage === pageNum ? '#000' : '#fff',
                        borderColor: safePage === pageNum ? '#000' : '#334155',
                        fontWeight: safePage === pageNum ? 'bold' : 'normal',
                      }}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    disabled={safePage === totalPages}
                    onClick={() => handlePageChange(safePage + 1)}
                    className="retro-tool-btn"
                    style={{
                      padding: '6px 12px',
                      fontSize: '10px',
                      opacity: safePage === totalPages ? 0.4 : 1,
                      cursor: safePage === totalPages ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span>NEXT</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
