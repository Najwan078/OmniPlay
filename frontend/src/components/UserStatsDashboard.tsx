import { useState, useEffect, useMemo } from 'react';
import { 
  Trophy, Calendar, CheckCircle2, Zap
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

interface AchievementItem {
  id: number;
  title: string;
  game: string;
  unlocked: string;
  rarity: string;
  icon: string;
}

interface UserStatsProfile {
  nickname: string;
  steamId: string;
  level: number;
  tier: string;
  totalHours: number;
  totalAchievements: number;
  maxAchievements: number;
  games: PlayedGame[];
  recentAchievements: AchievementItem[];
  nextMilestoneHours: number;
  hoursRemaining: number;
  badgeTitle: string;
}

interface CatalogGame {
  title: string;
  appId: number;
  image: string;
  genre: string;
  trophies: { title: string; rarity: string; icon: string }[];
}

const CATALOG_GAMES: CatalogGame[] = [
  {
    title: 'EA SPORTS FC™ 25',
    appId: 2669320,
    image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2669320/header.jpg',
    genre: 'Sports',
    trophies: [
      { title: 'Division Rivals Champion', rarity: 'Top 8.4%', icon: '🏆' },
      { title: 'Clean Sheet Master', rarity: 'Top 15.0%', icon: '🛡️' },
      { title: 'Ultimate Team Centurion', rarity: 'Top 4.2%', icon: '⚽' },
    ]
  },
  {
    title: 'Cyberpunk 2077',
    appId: 1091500,
    image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/header.jpg',
    genre: 'Action RPG',
    trophies: [
      { title: 'Path of Glory (Level 50)', rarity: 'Top 12.1%', icon: '⭐' },
      { title: 'Legend of The Afterlife', rarity: 'Top 6.8%', icon: '🔥' },
      { title: 'Breathtaking Cyberware', rarity: 'Top 9.5%', icon: '⚡' },
    ]
  },
  {
    title: 'Elden Ring',
    appId: 1245620,
    image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/header.jpg',
    genre: 'Action RPG',
    trophies: [
      { title: 'Elden Lord Ascendant', rarity: 'Top 5.1%', icon: '👑' },
      { title: 'Shardbearer Malenia', rarity: 'Top 7.9%', icon: '⚔️' },
      { title: 'Age of Stars Ending', rarity: 'Top 11.4%', icon: '✨' },
    ]
  },
  {
    title: 'Grand Theft Auto V',
    appId: 271590,
    image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/header.jpg',
    genre: 'Action',
    trophies: [
      { title: 'Los Santos Criminal Mastermind', rarity: 'Top 3.8%', icon: '💎' },
      { title: 'Career Criminal (100%)', rarity: 'Top 4.6%', icon: '🏎️' },
      { title: 'The Diamond Casino Heist', rarity: 'Top 14.2%', icon: '💰' },
    ]
  },
  {
    title: 'Black Myth: Wukong',
    appId: 2358720,
    image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2358720/header.jpg',
    genre: 'Action RPG',
    trophies: [
      { title: 'Destined Triumph', rarity: 'Top 5.6%', icon: '🔥' },
      { title: 'Staff of the Destined One', rarity: 'Top 8.9%', icon: '🐒' },
      { title: 'Sage Awakening', rarity: 'Top 7.2%', icon: '🥋' },
    ]
  },
  {
    title: 'Forza Horizon 5',
    appId: 1551360,
    image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1551360/header.jpg',
    genre: 'Racing',
    trophies: [
      { title: 'Hall of Fame Superstar', rarity: 'Top 6.3%', icon: '🏁' },
      { title: 'Goliath Conqueror (S2 Class)', rarity: 'Top 9.1%', icon: '🚗' },
      { title: 'Unbeatable Drivatar Dominator', rarity: 'Top 10.4%', icon: '🥇' },
    ]
  },
  {
    title: "Baldur's Gate 3",
    appId: 1086940,
    image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1086940/header.jpg',
    genre: 'RPG',
    trophies: [
      { title: 'Hero of the Forgotten Realms', rarity: 'Top 6.2%', icon: '🎲' },
      { title: 'Mind Flayer Slayer', rarity: 'Top 13.0%', icon: '🐙' },
      { title: 'Critical Roll Master', rarity: 'Top 8.7%', icon: '🔮' },
    ]
  },
  {
    title: 'Ghost of Tsushima',
    appId: 2215430,
    image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2215430/header.jpg',
    genre: 'Action',
    trophies: [
      { title: 'Ghost of Legend', rarity: 'Top 7.5%', icon: '🗡️' },
      { title: 'Sword Saint of Tsushima', rarity: 'Top 11.2%', icon: '🌸' },
      { title: 'Stand and Deliver Duelist', rarity: 'Top 14.8%', icon: '⛩️' },
    ]
  },
  {
    title: 'Valorant',
    appId: 730,
    image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/730/header.jpg',
    genre: 'Tactical Shooter',
    trophies: [
      { title: 'Ace of Spades (1v5 Clutch)', rarity: 'Top 3.2%', icon: '🎯' },
      { title: 'Radiant Headshot Surge', rarity: 'Top 8.0%', icon: '💥' },
      { title: 'Flawless Defuse Master', rarity: 'Top 12.3%', icon: '💣' },
    ]
  },
  {
    title: 'Red Dead Redemption 2',
    appId: 1174180,
    image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1174180/header.jpg',
    genre: 'Action',
    trophies: [
      { title: 'Best in the West (100%)', rarity: 'Top 2.9%', icon: '🤠' },
      { title: 'Legend of the East Outlaw', rarity: 'Top 6.4%', icon: '🐎' },
      { title: 'Gold Rush Dead Eye', rarity: 'Top 10.7%', icon: '🪙' },
    ]
  },
  {
    title: 'Helldivers 2',
    appId: 553850,
    image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/553850/header.jpg',
    genre: 'Shooter',
    trophies: [
      { title: 'Galactic Liberator (Helldive)', rarity: 'Top 4.5%', icon: '🚀' },
      { title: 'Spread Managed Democracy', rarity: 'Top 9.8%', icon: '🎖️' },
      { title: 'Super Earth Hero', rarity: 'Top 12.0%', icon: '🦅' },
    ]
  }
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function generateUserStats(rawName: string): UserStatsProfile {
  const name = rawName && rawName.trim() ? rawName.trim() : 'Player1';
  const isDefaultPlayer1 = name.toLowerCase() === 'player1';

  // Check if saved in localStorage for this specific user
  const storageKey = `omniplay_user_stats_${name.toLowerCase()}`;
  try {
    const cached = localStorage.getItem(storageKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && parsed.games && parsed.games.length > 0) {
        parsed.nickname = name; // Keep display name synchronized
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading cached user stats:', e);
  }

  // If Player1, return the classic original stats
  if (isDefaultPlayer1) {
    const p1Stats: UserStatsProfile = {
      nickname: 'Player1',
      steamId: '765611988921890',
      level: 42,
      tier: 'OMNIPLAY PRO MEMBER',
      totalHours: 142.5,
      totalAchievements: 87,
      maxAchievements: 131,
      games: [
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
          appId: 730,
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
      ],
      recentAchievements: [
        { id: 1, title: 'Division Rivals Champion', game: 'EA FC 25', unlocked: 'Today, 17:15', rarity: 'Top 8.4%', icon: '🏆' },
        { id: 2, title: 'Path of Glory (Level 50)', game: 'Cyberpunk 2077', unlocked: 'Yesterday, 22:04', rarity: 'Top 12.1%', icon: '⭐' },
        { id: 3, title: 'Destined Triumph', game: 'Black Myth: Wukong', unlocked: 'Sep 21, 2026', rarity: 'Top 5.6%', icon: '🔥' },
        { id: 4, title: 'Clean Sheet Master', game: 'EA FC 25', unlocked: 'Sep 19, 2026', rarity: 'Top 15.0%', icon: '🛡️' },
      ],
      nextMilestoneHours: 150,
      hoursRemaining: 7.5,
      badgeTitle: 'Cloud Century'
    };
    try {
      localStorage.setItem(storageKey, JSON.stringify(p1Stats));
    } catch {}
    return p1Stats;
  }

  // Generate deterministic personalized dummy stats for any user!
  const h = hashString(name);
  const steamDigits = String(100000000 + (h % 899999999));
  const steamId = `76561198${steamDigits}`;
  const level = 25 + (h % 55); // Level 25 - 79
  const tiers = ['OMNIPLAY PRO MEMBER', 'OMNIPLAY ELITE VIP', 'OMNIPLAY MASTER PASS', 'OMNIPLAY ULTIMATE MEMBER'];
  const tier = tiers[h % tiers.length];

  // Pick 4 to 5 unique games from catalog based on user hash
  const gameCount = 4 + (h % 2); // 4 or 5 games
  const chosenIndices: number[] = [];
  let seed = h;
  while (chosenIndices.length < gameCount && chosenIndices.length < CATALOG_GAMES.length) {
    const idx = seed % CATALOG_GAMES.length;
    if (!chosenIndices.includes(idx)) {
      chosenIndices.push(idx);
    }
    seed = (seed * 1664525 + 1013904223) >>> 0;
  }

  const times = ['2 jam lalu', 'Kemarin', '2 hari lalu', '4 hari lalu', '1 minggu lalu'];

  const games: PlayedGame[] = chosenIndices.map((catIdx, i) => {
    const catGame = CATALOG_GAMES[catIdx];
    // Realistic play hours
    const baseHours = 22.0 + ((h * (i + 2) + i * 53) % 1380) / 10;
    const hours = Math.round(baseHours * 10) / 10;
    const unlocked = 12 + ((h + i * 5) % 25);
    const total = unlocked + 6 + ((h * 2 + i * 3) % 15);
    const trophy = catGame.trophies[i % catGame.trophies.length];

    return {
      title: catGame.title,
      appId: catGame.appId,
      hours,
      lastPlayed: times[i % times.length],
      achievements: { unlocked, total },
      image: catGame.image,
      recentTrophy: trophy.title,
      genre: catGame.genre
    };
  });

  // Sort games by hours descending
  games.sort((a, b) => b.hours - a.hours);

  const totalHours = Math.round(games.reduce((acc, g) => acc + g.hours, 0) * 10) / 10;
  const totalAchievements = games.reduce((acc, g) => acc + g.achievements.unlocked, 0);
  const maxAchievements = games.reduce((acc, g) => acc + g.achievements.total, 0);

  // Generate recent achievements list based on the chosen games
  const recentAchievements: AchievementItem[] = games.slice(0, 4).map((g, idx) => {
    const cat = CATALOG_GAMES.find(c => c.title === g.title) || CATALOG_GAMES[0];
    const trophy = cat.trophies[idx % cat.trophies.length];
    const unlockTimes = ['Hari ini, 18:24', 'Kemarin, 21:10', '24 Sep 2026', '21 Sep 2026'];

    return {
      id: idx + 1,
      title: trophy.title,
      game: g.title.replace('™', '').replace('EA SPORTS ', ''),
      unlocked: unlockTimes[idx % unlockTimes.length],
      rarity: trophy.rarity,
      icon: trophy.icon
    };
  });

  const nextMilestoneHours = Math.ceil((totalHours + 15) / 50) * 50;
  const hoursRemaining = Math.max(2.5, Math.round((nextMilestoneHours - totalHours) * 10) / 10);
  const badgeTitles = ['Cloud Century', 'Stream Vanguard', 'Ultra Latency Elite', 'Cloud Legend', 'HyperStream Master'];
  const badgeTitle = badgeTitles[h % badgeTitles.length];

  const profile: UserStatsProfile = {
    nickname: name,
    steamId,
    level,
    tier,
    totalHours,
    totalAchievements,
    maxAchievements,
    games,
    recentAchievements,
    nextMilestoneHours,
    hoursRemaining,
    badgeTitle
  };

  try {
    localStorage.setItem(storageKey, JSON.stringify(profile));
  } catch (e) {
    console.warn('Failed to cache user stats:', e);
  }

  return profile;
}

export default function UserStatsDashboard() {
  const { nickname: contextNick } = useUser();
  const [currentName, setCurrentName] = useState(() => {
    return contextNick || localStorage.getItem('omniplay_nickname') || localStorage.getItem('omni_operator_nickname') || 'Player1';
  });

  // Sync when UserContext changes
  useEffect(() => {
    if (contextNick && contextNick !== currentName) {
      setCurrentName(contextNick);
    }
  }, [contextNick]);

  // Listen to profile updates (Save Changes in TopNavbar or storage change)
  useEffect(() => {
    const handleProfileUpdate = () => {
      const saved = localStorage.getItem('omniplay_nickname') || localStorage.getItem('omni_operator_nickname') || 'Player1';
      setCurrentName(saved);
    };

    window.addEventListener('omni:user_profile_updated', handleProfileUpdate);
    window.addEventListener('storage', handleProfileUpdate);
    return () => {
      window.removeEventListener('omni:user_profile_updated', handleProfileUpdate);
      window.removeEventListener('storage', handleProfileUpdate);
    };
  }, []);

  // Compute or load personalized stats for the active user
  const userStats = useMemo(() => {
    return generateUserStats(currentName);
  }, [currentName]);

  return (
    <div className="user-stats-container">
      {/* 1. Profile & Header Banner */}
      <header className="user-stats-header">
        <div className="user-profile-summary">
          <div className="user-stats-avatar-wrap">
            <div className="user-stats-avatar">
              <ThreeDIcon type="stats" size={42} glowColor="rgba(168, 85, 247, 0.6)" />
            </div>
            <div className="user-level-badge">LVL {userStats.level}</div>
          </div>

          <div className="user-stats-info">
            <div className="user-verified-row">
              <h1 className="user-display-name">{userStats.nickname}</h1>
              <span className="user-tier-badge">
                <Zap style={{ width: 12, height: 12 }} />
                {userStats.tier}
              </span>
            </div>
            <p className="user-steam-id">Steam ID: {userStats.steamId} • Cloud Account Synchronized</p>
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
              <p className="kpi-number">{userStats.totalHours.toFixed(1)} <span className="unit">Hours</span></p>
            </div>
          </div>

          <div className="user-kpi-card">
            <div className="kpi-icon-wrap purple">
              <ThreeDIcon type="achievements" size={36} glowColor="rgba(245, 158, 11, 0.5)" />
            </div>
            <div>
              <span className="kpi-label">ACHIEVEMENTS</span>
              <p className="kpi-number">{userStats.totalAchievements} <span className="unit">/ {userStats.maxAchievements}</span></p>
            </div>
          </div>

          <div className="user-kpi-card">
            <div className="kpi-icon-wrap cyan">
              <ThreeDIcon type="games" size={36} glowColor="rgba(16, 185, 129, 0.5)" />
            </div>
            <div>
              <span className="kpi-label">GAMES PLAYED</span>
              <p className="kpi-number">{userStats.games.length} <span className="unit">Titles</span></p>
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
            {userStats.games.map((game) => {
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
              {userStats.recentAchievements.map((ach) => (
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
              <h4 className="milestone-title">Next Milestone: {userStats.nextMilestoneHours} Cloud Hours</h4>
              <p className="milestone-desc">
                {userStats.hoursRemaining} hours remaining to unlock the "{userStats.badgeTitle}" Steam Profile Showcase Badge.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
