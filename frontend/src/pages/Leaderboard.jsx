import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Trophy, Flame, Play, Award, Sparkles, Filter, ChevronLeft, ChevronRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getUserStats } from '../lib/userStats'
import soundFx from '../lib/soundFx'

const DEFAULT_HIGH_SCORERS = [
  { rank: 1, name: 'RETRO_NINJA_99', avatar: '🥷', streak: 18, points: 99850, accuracy: 96, medal: '👑 1ST' },
  { rank: 2, name: 'CYBER_ARCHITECT', avatar: '🤖', streak: 14, points: 94200, accuracy: 94, medal: '🥈 2ND' },
  { rank: 3, name: 'PIXEL_VALKYRIE', avatar: '🐱‍👤', streak: 11, points: 88750, accuracy: 92, medal: '🥉 3RD' },
  { rank: 4, name: 'SYNTH_HACKER', avatar: '👨‍🚀', streak: 9, points: 82100, accuracy: 89, medal: '4TH' },
  { rank: 5, name: 'CODE_MAGE_X', avatar: '🧙‍♂️', streak: 8, points: 76500, accuracy: 88, medal: '5TH' },
  { rank: 6, name: 'ARCADE_QUEEN', avatar: '👾', streak: 7, points: 71000, accuracy: 87, medal: '6TH' },
  { rank: 7, name: 'OVERCLOCKER_404', avatar: '⚡', streak: 6, points: 65400, accuracy: 85, medal: '7TH' },
  { rank: 8, name: 'BYTE_WARRIOR', avatar: '🕹️', streak: 5, points: 59800, accuracy: 84, medal: '8TH' },
]

export default function Leaderboard() {
  const { user } = useAuth()
  const [timeframe, setTimeframe] = useState('All Time')

  const myStats = getUserStats(user?.id)
  const myAvatar = user?.avatar || (user?.id && localStorage.getItem(`quizmaster-avatar-${user.id}`)) || '👾'
  const myName = user?.name || (user?.isGuest ? 'PLAYER 1' : 'You')

  // Calculate my real points from stats
  const myPoints = (myStats.correct_solved || 0) * 100 + (myStats.high_score || 0)

  // Integrate current player into the leaderboard
  const fullLeaderboard = useMemo(() => {
    const list = [...DEFAULT_HIGH_SCORERS]
    const userEntry = {
      rank: 0,
      name: `${myName} (YOU)`,
      avatar: myAvatar,
      streak: myStats.current_streak || 0,
      points: Math.max(myPoints, 250),
      accuracy: myStats.accuracy || 85,
      isCurrentUser: true,
    }

    list.push(userEntry)
    list.sort((a, b) => b.points - a.points)

    return list.map((item, idx) => ({
      ...item,
      rank: idx + 1,
      medal: idx === 0 ? '👑 1ST' : idx === 1 ? '🥈 2ND' : idx === 2 ? '🥉 3RD' : `${idx + 1}TH`,
    }))
  }, [myName, myAvatar, myStats, myPoints])

  const top3 = fullLeaderboard.slice(0, 3)

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
            Compete with speed-runners worldwide for the ultimate arcade crown!
          </p>
        </div>

        {/* TIMEFRAME TOGGLES */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {['All Time', 'This Week', 'Today'].map((t) => (
            <button
              key={t}
              onClick={() => {
                soundFx.playSelect()
                setTimeframe(t)
              }}
              className="retro-tool-btn"
              style={{
                background: timeframe === t ? 'var(--neon-yellow)' : 'var(--bg-card)',
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

      {/* TOP 3 PODIUM */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', alignItems: 'end' }}>
        {/* 2ND PLACE */}
        {top3[1] && (
          <div
            className="retro-cartridge-card"
            style={{
              textAlign: 'center',
              padding: '24px 16px',
              borderColor: '#e2e8f0',
              boxShadow: '6px 6px 0px #e2e8f0',
            }}
          >
            <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '12px', color: '#e2e8f0', marginBottom: '8px' }}>
              🥈 2ND PLACE
            </div>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>{top3[1].avatar}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 'bold', color: '#fff' }}>
              {top3[1].name}
            </div>
            <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '14px', color: 'var(--neon-yellow)', marginTop: '8px' }}>
              {top3[1].points.toLocaleString()} PTS
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
              {top3[1].streak} 🔥 • {top3[1].accuracy}% ACC
            </div>
          </div>
        )}

        {/* 1ST PLACE CROWN */}
        {top3[0] && (
          <div
            className="retro-cartridge-card"
            style={{
              textAlign: 'center',
              padding: '32px 16px',
              borderColor: 'var(--neon-yellow)',
              boxShadow: '8px 8px 0px var(--neon-yellow)',
              background: '#000000',
              transform: 'translateY(-12px)',
            }}
          >
            <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '14px', color: 'var(--neon-yellow)', marginBottom: '8px' }}>
              👑 GRAND CHAMPION
            </div>
            <div style={{ fontSize: '48px', marginBottom: '8px' }}>{top3[0].avatar}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: '900', color: '#fff' }}>
              {top3[0].name}
            </div>
            <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '18px', color: 'var(--neon-yellow)', marginTop: '8px' }}>
              {top3[0].points.toLocaleString()} PTS
            </div>
            <div style={{ fontSize: '13px', color: 'var(--neon-cyan)', marginTop: '4px' }}>
              {top3[0].streak} 🔥 Streak • {top3[0].accuracy}% ACC
            </div>
          </div>
        )}

        {/* 3RD PLACE */}
        {top3[2] && (
          <div
            className="retro-cartridge-card"
            style={{
              textAlign: 'center',
              padding: '20px 16px',
              borderColor: '#f97316',
              boxShadow: '6px 6px 0px #f97316',
            }}
          >
            <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '12px', color: '#f97316', marginBottom: '8px' }}>
              🥉 3RD PLACE
            </div>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>{top3[2].avatar}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 'bold', color: '#fff' }}>
              {top3[2].name}
            </div>
            <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '14px', color: 'var(--neon-yellow)', marginTop: '8px' }}>
              {top3[2].points.toLocaleString()} PTS
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
              {top3[2].streak} 🔥 • {top3[2].accuracy}% ACC
            </div>
          </div>
        )}
      </div>

      {/* FULL LEADERBOARD TABLE */}
      <div style={{ background: '#000000', border: '4px solid #000', borderRadius: 'var(--radius-xl)', padding: '24px', boxShadow: '8px 8px 0px #000' }}>
        <table className="highscore-table">
          <thead>
            <tr>
              <th>RANK</th>
              <th>PLAYER TAG</th>
              <th>STREAK</th>
              <th>ACCURACY</th>
              <th>HIGH SCORE</th>
            </tr>
          </thead>
          <tbody>
            {fullLeaderboard.map((player) => (
              <tr
                key={player.rank}
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
                        P1
                      </span>
                    )}
                  </div>
                </td>
                <td style={{ color: 'var(--neon-pink)' }}>{player.streak} 🔥</td>
                <td style={{ color: 'var(--neon-green)' }}>{player.accuracy}%</td>
                <td style={{ fontFamily: 'var(--font-pixel)', color: 'var(--neon-yellow)' }}>
                  {player.points.toLocaleString()} PTS
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
