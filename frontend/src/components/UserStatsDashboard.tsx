import { useState } from 'react';
import { 
  Trophy, Gamepad2, Award, 
  Calendar, CheckCircle2, Zap
} from 'lucide-react';
import ThreeDIcon from './ThreeDIcon';
import { useUser } from '../context/UserContext';

interface PlayedGame {
  title: string;
  appId: number;
  hours: number;
  lastPlayed: string;
  achievements: { unlocked: number; total: number };
  image: string;
  recentTrophy: string;
  genre: string;
}

const userPlayedGames: PlayedGame[] = [
  {
    title: 'EA SPORTS FC™ 25',
    appId: 2669320,
    hours: 52.4,
    lastPlayed: '2 hours ago',
    achievements: { unlocked: 22, total: 30 },
    image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2669320/header.jpg',
    recentTrophy: 'Division Rivals Champion',
    genre: 'Sports'
  },
  {
    title: 'Cyberpunk 2077',
    appId: 1091500,
    hours: 41.2,
    lastPlayed: 'Yesterday',
    achievements: { unlocked: 34, total: 45 },
    image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/header.jpg',
    recentTrophy: 'Legend of The Afterlife',
    genre: 'Action RPG'
  },
  {
    title: 'Valorant',
    appId: 0,
    hours: 28.0,
    lastPlayed: '3 days ago',
    achievements: { unlocked: 15, total: 20 },
    image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/730/header.jpg',
    recentTrophy: 'Ace of Spades (Clutch)',
    genre: 'Tactical Shooter'
  },
  {
    title: 'Black Myth: Wukong',
    appId: 2358720,
    hours: 20.9,
    lastPlayed: '5 days ago',
    achievements: { unlocked: 16, total: 36 },
    image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2358720/header.jpg',
    recentTrophy: 'Staff of the Destined One',
    genre: 'Action RPG'
  }
];

const recentAchievements = [
  { id: 1, title: 'Division Rivals Champion', game: 'EA FC 25', unlocked: 'Today, 17:15', rarity: 'Top 8.4%', icon: '🏆' },
  { id: 2, title: 'Path of Glory (Level 50)', game: 'Cyberpunk 2077', unlocked: 'Yesterday, 22:04', rarity: 'Top 12.1%', icon: '⭐' },
  { id: 3, title: 'Destined Triumph', game: 'Black Myth: Wukong', unlocked: 'Sep 21, 2026', rarity: 'Top 5.6%', icon: '🔥' },
  { id: 4, title: 'Clean Sheet Master', game: 'EA FC 25', unlocked: 'Sep 19, 2026', rarity: 'Top 15.0%', icon: '🛡️' },
];

export default function UserStatsDashboard() {
  const { nickname } = useUser();
  const [selectedGameFilter, setSelectedGameFilter] = useState<string>('All');

  const totalHours = userPlayedGames.reduce((acc, g) => acc + g.hours, 0);
  const totalAchievements = userPlayedGames.reduce((acc, g) => acc + g.achievements.unlocked, 0);
  const maxAchievements = userPlayedGames.reduce((acc, g) => acc + g.achievements.total, 0);

  return (
    <div className="user-stats-container">
      {/* 1. Profile & Header Banner */}
      <header className="user-stats-header">
        <div className="user-profile-summary">
          <div className="user-stats-avatar-wrap">
            <div className="user-stats-avatar">
              <ThreeDIcon type="stats" size={42} glowColor="rgba(168, 85, 247, 0.6)" />
            </div>
            <div className="user-level-badge">LVL 42</div>
          </div>

          <div className="user-stats-info">
            <div className="user-verified-row">
              <h1 className="user-display-name">{nickname}</h1>
              <span className="user-tier-badge">
                <Zap style={{ width: 12, height: 12 }} />
                OMNIPLAY PRO MEMBER
              </span>
            </div>
            <p className="user-steam-id">Steam ID: 765611988921890 • Cloud Account Synchronized</p>
          </div>
        </div>

        {/* 3D KPI Cards with React Three Fiber Canvases */}
        <div className="user-stats-kpi-row">
          <div className="user-kpi-card">
            <div className="kpi-icon-wrap blue">
              <ThreeDIcon type="playtime" size={36} glowColor="rgba(0, 240, 255, 0.5)" />
            </div>
            <div>
              <span className="kpi-label">TOTAL PLAYTIME</span>
              <p className="kpi-number">{totalHours.toFixed(1)} <span className="unit">Hours</span></p>
            </div>
          </div>

          <div className="user-kpi-card">
            <div className="kpi-icon-wrap purple">
              <ThreeDIcon type="achievements" size={36} glowColor="rgba(245, 158, 11, 0.5)" />
            </div>
            <div>
              <span className="kpi-label">ACHIEVEMENTS</span>
              <p className="kpi-number">{totalAchievements} <span className="unit">/ {maxAchievements}</span></p>
            </div>
          </div>

          <div className="user-kpi-card">
            <div className="kpi-icon-wrap cyan">
              <ThreeDIcon type="games" size={36} glowColor="rgba(16, 185, 129, 0.5)" />
            </div>
            <div>
              <span className="kpi-label">GAMES PLAYED</span>
              <p className="kpi-number">{userPlayedGames.length} <span className="unit">Titles</span></p>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Main Content Split: Games Breakdown + Achievements Showcase */}
      <div className="user-stats-main-grid">
        
        {/* Left Column: Personal Games Played */}
        <div className="user-games-breakdown-card">
          <div className="card-header-row">
            <div>
              <h2 className="card-heading">My Played Games</h2>
              <p className="card-subheading">Personal hours logged & progression per title</p>
            </div>
            <span className="sync-chip">
              <CheckCircle2 style={{ width: 12, height: 12, color: 'var(--neon-emerald)' }} />
              Steam Cloud Synced
            </span>
          </div>

          <div className="user-games-list">
            {userPlayedGames.map((game) => {
              const progressPct = Math.round((game.achievements.unlocked / game.achievements.total) * 100);
              return (
                <div key={game.title} className="user-game-row">
                  <img src={game.image} alt={game.title} className="user-game-thumb" />
                  
                  <div className="user-game-details">
                    <div className="user-game-title-row">
                      <h3 className="user-game-name">{game.title}</h3>
                      <span className="user-game-hours">{game.hours} hrs played</span>
                    </div>

                    <div className="user-progress-bar-wrap">
                      <div className="user-progress-bar-fill" style={{ width: `${progressPct}%` }} />
                    </div>

                    <div className="user-game-meta-row">
                      <span className="meta-text">
                        <Trophy style={{ width: 12, height: 12, color: 'var(--neon-amber)' }} />
                        {game.achievements.unlocked} of {game.achievements.total} Achievements ({progressPct}%)
                      </span>
                      <span className="meta-last-played">Last session: {game.lastPlayed}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Achievements & Badges Showcase */}
        <div className="user-achievements-column">
          <div className="user-achievements-card">
            <div className="card-header-row">
              <div>
                <h2 className="card-heading">Steam Achievements</h2>
                <p className="card-subheading">Recently unlocked milestones & rare trophies</p>
              </div>
            </div>

            <div className="achievements-list">
              {recentAchievements.map((ach) => (
                <div key={ach.id} className="achievement-row">
                  <div className="ach-badge-icon">{ach.icon}</div>
                  <div className="ach-info">
                    <h4 className="ach-title">{ach.title}</h4>
                    <span className="ach-game-tag">{ach.game}</span>
                    <span className="ach-time">{ach.unlocked}</span>
                  </div>
                  <span className="ach-rarity-pill">{ach.rarity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Playtime Distribution Widget */}
          <div className="user-milestone-card">
            <div className="milestone-icon-wrap">
              <Calendar style={{ width: 20, height: 20, color: 'var(--neon-cyan)' }} />
            </div>
            <div>
              <h4 className="milestone-title">Next Milestone: 150 Cloud Hours</h4>
              <p className="milestone-desc">7.5 hours remaining to unlock the "Cloud Century" Steam Profile Showcase Badge.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
