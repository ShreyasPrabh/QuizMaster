import React from 'react'

export default function RetroMarquee() {
  return (
    <div className="retro-marquee-wrap">
      <div className="retro-marquee-content">
        <span className="marquee-coin">🪙 INSERT COIN TO PLAY</span>
        <span>•</span>
        <span className="marquee-pill">OVER 60+ SUBTOPICS</span>
        <span>•</span>
        <span className="marquee-coin">⚡ 1,200+ MCQS READY</span>
        <span>•</span>
        <span className="marquee-pill">CLIMB THE ARCADE LEADERBOARD</span>
        <span>•</span>
        <span className="marquee-coin">🔥 EXTEND YOUR DAILY STREAK</span>
        <span>•</span>
        <span className="marquee-pill">RETRO 8-BIT AUDIO SYNTHESIZER</span>
        <span>•</span>
        <span className="marquee-coin">👑 HIGH SCORE: 99,990 (P1)</span>
        <span>•</span>
        {/* Duplicate for infinite loop */}
        <span className="marquee-coin">🪙 INSERT COIN TO PLAY</span>
        <span>•</span>
        <span className="marquee-pill">OVER 60+ SUBTOPICS</span>
        <span>•</span>
        <span className="marquee-coin">⚡ 1,200+ MCQS READY</span>
        <span>•</span>
        <span className="marquee-pill">CLIMB THE ARCADE LEADERBOARD</span>
        <span>•</span>
        <span className="marquee-coin">🔥 EXTEND YOUR DAILY STREAK</span>
      </div>
    </div>
  )
}
