import { useState, useRef, useMemo } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  Trophy, Medal, Crown, Star, Flame, Zap, Target,
  Clock, Gamepad2, Globe, ChevronDown, Search, TrendingUp,
  Award, Shield, Sparkles
} from 'lucide-react';
import { useUser } from '../context/UserContext';

// ─── Types ───────────────────────────────────────────────────────────────────

interface LeaderboardPlayer {
  rank: number;
  nickname: string;
  avatarGradient: string;
  region: string;
  nodeId: string;
  totalHours: number;
  gamesPlayed: number;
  achievementsUnlocked: number;
  totalAchievements: number;
  favoriteGame: string;
  tier: string;
  weeklyHours: number;
  streak: number;
  isCurrentUser?: boolean;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'Legendary' | 'Epic' | 'Rare' | 'Common';
  rarityPct: number;
  game: string;
  unlockedBy: number;
  totalPlayers: number;
  isUnlocked?: boolean;
  unlockedDate?: string;
}

interface SeasonInfo {
  name: string;
  endDate: string;
  daysRemaining: number;
  currentTier: string;
  nextTier: string;
  progress: number;
}

// ─── Static Data ─────────────────────────────────────────────────────────────

const LEADERBOARD_PLAYERS: LeaderboardPlayer[] = [
  {
    rank: 1, nickname: 'PhantomStrike', avatarGradient: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
    region: 'APAC', nodeId: 'TY-01', totalHours: 2847, gamesPlayed: 24, achievementsUnlocked: 312, totalAchievements: 350,
    favoriteGame: 'Black Myth: Wukong', tier: 'Grandmaster', weeklyHours: 42, streak: 67
  },
  {
    rank: 2, nickname: 'NeonWraith', avatarGradient: 'linear-gradient(135deg, #c0c0c0, #94a3b8)',
    region: 'Europe', nodeId: 'EU-01', totalHours: 2634, gamesPlayed: 22, achievementsUnlocked: 289, totalAchievements: 350,
    favoriteGame: 'Cyberpunk 2077', tier: 'Grandmaster', weeklyHours: 38, streak: 54
  },
  {
    rank: 3, nickname: 'ArcticFury', avatarGradient: 'linear-gradient(135deg, #cd7f32, #b87333)',
    region: 'Americas', nodeId: 'US-01', totalHours: 2410, gamesPlayed: 20, achievementsUnlocked: 267, totalAchievements: 350,
    favoriteGame: 'Valorant', tier: 'Master', weeklyHours: 35, streak: 41
  },
  {
    rank: 4, nickname: 'CyberSamurai', avatarGradient: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
    region: 'APAC', nodeId: 'SG-01', totalHours: 2198, gamesPlayed: 19, achievementsUnlocked: 245, totalAchievements: 350,
    favoriteGame: 'Sekiro: Shadows Die Twice', tier: 'Master', weeklyHours: 31, streak: 38
  },
  {
    rank: 5, nickname: 'GlitchHunter', avatarGradient: 'linear-gradient(135deg, #10b981, #059669)',
    region: 'APAC', nodeId: 'JK-01', totalHours: 2055, gamesPlayed: 18, achievementsUnlocked: 230, totalAchievements: 350,
    favoriteGame: 'EA FC 26', tier: 'Diamond', weeklyHours: 29, streak: 33
  },
  {
    rank: 6, nickname: 'VoidWalker', avatarGradient: 'linear-gradient(135deg, #f43f5e, #e11d48)',
    region: 'Europe', nodeId: 'EU-02', totalHours: 1987, gamesPlayed: 17, achievementsUnlocked: 218, totalAchievements: 350,
    favoriteGame: 'Control: Resonant', tier: 'Diamond', weeklyHours: 27, streak: 28
  },
  {
    rank: 7, nickname: 'StellarAce', avatarGradient: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    region: 'Americas', nodeId: 'US-01', totalHours: 1823, gamesPlayed: 16, achievementsUnlocked: 201, totalAchievements: 350,
    favoriteGame: 'Destiny 2', tier: 'Diamond', weeklyHours: 25, streak: 22
  },
  {
    rank: 8, nickname: 'OmegaBlitz', avatarGradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
    region: 'APAC', nodeId: 'TY-01', totalHours: 1690, gamesPlayed: 15, achievementsUnlocked: 189, totalAchievements: 350,
    favoriteGame: 'Ace Combat 8', tier: 'Platinum', weeklyHours: 23, streak: 19
  },
  {
    rank: 9, nickname: 'PixelRogue', avatarGradient: 'linear-gradient(135deg, #ec4899, #db2777)',
    region: 'Europe', nodeId: 'EU-01', totalHours: 1544, gamesPlayed: 14, achievementsUnlocked: 176, totalAchievements: 350,
    favoriteGame: 'The Witcher 3', tier: 'Platinum', weeklyHours: 21, streak: 15
  },
  {
    rank: 10, nickname: 'ThunderBolt', avatarGradient: 'linear-gradient(135deg, #06b6d4, #0891b2)',
    region: 'APAC', nodeId: 'JK-01', totalHours: 1420, gamesPlayed: 13, achievementsUnlocked: 162, totalAchievements: 350,
    favoriteGame: 'Counter-Strike 2', tier: 'Gold', weeklyHours: 19, streak: 12
  },
  {
    rank: 11, nickname: 'NovaFlare', avatarGradient: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
    region: 'Americas', nodeId: 'US-01', totalHours: 1305, gamesPlayed: 12, achievementsUnlocked: 148, totalAchievements: 350,
    favoriteGame: 'Forza Horizon 6', tier: 'Gold', weeklyHours: 17, streak: 10
  },
  {
    rank: 12, nickname: 'IronDrake', avatarGradient: 'linear-gradient(135deg, #64748b, #475569)',
    region: 'Europe', nodeId: 'EU-02', totalHours: 1198, gamesPlayed: 11, achievementsUnlocked: 134, totalAchievements: 350,
    favoriteGame: 'Gears of War: E-Day', tier: 'Gold', weeklyHours: 15, streak: 8
  },
];

const GLOBAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-1', title: 'Night Owl Supreme', description: 'Play for 100+ cumulative hours between 00:00–06:00 on cloud nodes',
    icon: '🦉', rarity: 'Legendary', rarityPct: 2.1, game: 'Platform-Wide',
    unlockedBy: 42, totalPlayers: 2000, isUnlocked: true, unlockedDate: '2026-10-15'
  },
  {
    id: 'ach-2', title: 'Cloud Marathon', description: 'Complete a 5-hour maximum rental session without disconnecting',
    icon: '🏃', rarity: 'Epic', rarityPct: 8.4, game: 'Platform-Wide',
    unlockedBy: 168, totalPlayers: 2000, isUnlocked: true, unlockedDate: '2026-10-22'
  },
  {
    id: 'ach-3', title: 'Genre Explorer', description: 'Play at least 1 game from every genre available in the OmniPlay library',
    icon: '🧭', rarity: 'Rare', rarityPct: 14.7, game: 'Platform-Wide',
    unlockedBy: 294, totalPlayers: 2000, isUnlocked: true, unlockedDate: '2026-09-30'
  },
  {
    id: 'ach-4', title: 'Global Traveler', description: 'Play sessions on 3+ different regional cloud nodes (APAC, Europe, Americas)',
    icon: '🌍', rarity: 'Epic', rarityPct: 6.3, game: 'Platform-Wide',
    unlockedBy: 126, totalPlayers: 2000, isUnlocked: false
  },
  {
    id: 'ach-5', title: 'Streak Legend', description: 'Maintain a 30-day consecutive play streak on OmniPlay',
    icon: '🔥', rarity: 'Legendary', rarityPct: 3.2, game: 'Platform-Wide',
    unlockedBy: 64, totalPlayers: 2000, isUnlocked: false
  },
  {
    id: 'ach-6', title: 'First Blood', description: 'Complete your very first cloud gaming rental session',
    icon: '⚔️', rarity: 'Common', rarityPct: 89.5, game: 'Platform-Wide',
    unlockedBy: 1790, totalPlayers: 2000, isUnlocked: true, unlockedDate: '2026-08-01'
  },
  {
    id: 'ach-7', title: 'RTX Ultra Enthusiast', description: 'Complete 10+ sessions on RTX 4090 Tier 3 Ultra cloud nodes',
    icon: '💎', rarity: 'Epic', rarityPct: 9.8, game: 'Platform-Wide',
    unlockedBy: 196, totalPlayers: 2000, isUnlocked: true, unlockedDate: '2026-10-10'
  },
  {
    id: 'ach-8', title: 'Social Butterfly', description: 'Send 50+ messages in OmniPlay Community chat',
    icon: '🦋', rarity: 'Rare', rarityPct: 18.2, game: 'Platform-Wide',
    unlockedBy: 364, totalPlayers: 2000, isUnlocked: false
  },
  {
    id: 'ach-9', title: 'Wukong Conqueror', description: 'Defeat all 6 chapter bosses in Black Myth: Wukong on cloud',
    icon: '🐵', rarity: 'Legendary', rarityPct: 4.1, game: 'Black Myth: Wukong',
    unlockedBy: 82, totalPlayers: 2000, isUnlocked: false
  },
  {
    id: 'ach-10', title: 'Speedrun Demon', description: 'Complete any rental session game with a sub-1-hour clear time',
    icon: '⚡', rarity: 'Rare', rarityPct: 12.0, game: 'Platform-Wide',
    unlockedBy: 240, totalPlayers: 2000, isUnlocked: true, unlockedDate: '2026-10-28'
  },
];

const SEASON_INFO: SeasonInfo = {
  name: 'Season 3: Neon Eclipse',
  endDate: '2026-12-31',
  daysRemaining: 61,
  currentTier: 'Platinum',
  nextTier: 'Diamond',
  progress: 68,
};

const TIER_COLORS: Record<string, string> = {
  'Grandmaster': '#fbbf24',
  'Master': '#a78bfa',
  'Diamond': '#06b6d4',
  'Platinum': '#94a3b8',
  'Gold': '#f59e0b',
  'Silver': '#cbd5e1',
  'Bronze': '#cd7f32',
};

const RARITY_STYLES: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  'Legendary': { bg: 'rgba(251, 191, 36, 0.08)', border: 'rgba(251, 191, 36, 0.4)', text: '#fbbf24', glow: '0 0 20px rgba(251, 191, 36, 0.3)' },
  'Epic': { bg: 'rgba(139, 92, 246, 0.08)', border: 'rgba(139, 92, 246, 0.4)', text: '#a78bfa', glow: '0 0 20px rgba(139, 92, 246, 0.3)' },
  'Rare': { bg: 'rgba(59, 130, 246, 0.08)', border: 'rgba(59, 130, 246, 0.4)', text: '#60a5fa', glow: '0 0 20px rgba(59, 130, 246, 0.3)' },
  'Common': { bg: 'rgba(148, 163, 184, 0.08)', border: 'rgba(148, 163, 184, 0.3)', text: '#94a3b8', glow: 'none' },
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function LeaderboardView() {
  const { nickname: userNickname } = useUser();
  const [activeSection, setActiveSection] = useState<'leaderboard' | 'achievements'>('leaderboard');
  const [regionFilter, setRegionFilter] = useState<'ALL' | 'APAC' | 'Europe' | 'Americas'>('ALL');
  const [sortBy, setSortBy] = useState<'totalHours' | 'achievementsUnlocked' | 'streak' | 'weeklyHours'>('totalHours');
  const [searchQuery, setSearchQuery] = useState('');
  const [achievementFilter, setAchievementFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [rarityFilter, setRarityFilter] = useState<'all' | 'Legendary' | 'Epic' | 'Rare' | 'Common'>('all');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const podiumRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  // Mark current user in leaderboard
  const playersWithUser = useMemo(() => {
    return LEADERBOARD_PLAYERS.map(p => ({
      ...p,
      isCurrentUser: p.nickname === (userNickname || 'Player1') || p.rank === 5 // default highlight rank 5
    }));
  }, [userNickname]);

  // Filter & sort leaderboard
  const filteredPlayers = useMemo(() => {
    let players = [...playersWithUser];
    if (regionFilter !== 'ALL') {
      players = players.filter(p => p.region === regionFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      players = players.filter(p => p.nickname.toLowerCase().includes(q));
    }
    players.sort((a, b) => {
      const val = (b[sortBy] as number) - (a[sortBy] as number);
      return val;
    });
    // Re-rank after filter
    return players.map((p, i) => ({ ...p, rank: i + 1 }));
  }, [playersWithUser, regionFilter, searchQuery, sortBy]);

  // Filter achievements
  const filteredAchievements = useMemo(() => {
    let achs = [...GLOBAL_ACHIEVEMENTS];
    if (achievementFilter === 'unlocked') achs = achs.filter(a => a.isUnlocked);
    if (achievementFilter === 'locked') achs = achs.filter(a => !a.isUnlocked);
    if (rarityFilter !== 'all') achs = achs.filter(a => a.rarity === rarityFilter);
    return achs;
  }, [achievementFilter, rarityFilter]);

  // Achievement stats
  const achievementStats = useMemo(() => {
    const unlocked = GLOBAL_ACHIEVEMENTS.filter(a => a.isUnlocked).length;
    const total = GLOBAL_ACHIEVEMENTS.length;
    const legendary = GLOBAL_ACHIEVEMENTS.filter(a => a.isUnlocked && a.rarity === 'Legendary').length;
    return { unlocked, total, legendary, pct: Math.round((unlocked / total) * 100) };
  }, []);

  // GSAP Entrance Animation
  useGSAP(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current.querySelectorAll('.lb-animate-in'),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power2.out' }
      );
    }
  }, [activeSection, regionFilter, sortBy]);

  // Podium animation
  useGSAP(() => {
    if (podiumRef.current && activeSection === 'leaderboard') {
      gsap.fromTo(podiumRef.current.querySelectorAll('.podium-player'),
        { opacity: 0, y: 40, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.12, ease: 'back.out(1.4)' }
      );
    }
  }, [activeSection]);

  const sortLabels: Record<string, string> = {
    totalHours: 'Total Hours',
    achievementsUnlocked: 'Achievements',
    streak: 'Play Streak',
    weeklyHours: 'Weekly Hours',
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown style={{ width: 18, height: 18, color: '#fbbf24' }} />;
    if (rank === 2) return <Medal style={{ width: 18, height: 18, color: '#c0c0c0' }} />;
    if (rank === 3) return <Medal style={{ width: 18, height: 18, color: '#cd7f32' }} />;
    return <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-secondary)' }}>#{rank}</span>;
  };

  const getPodiumGlow = (rank: number) => {
    if (rank === 1) return '0 0 40px rgba(251, 191, 36, 0.4), 0 0 80px rgba(251, 191, 36, 0.15)';
    if (rank === 2) return '0 0 30px rgba(192, 192, 192, 0.3), 0 0 60px rgba(192, 192, 192, 0.1)';
    if (rank === 3) return '0 0 30px rgba(205, 127, 50, 0.3), 0 0 60px rgba(205, 127, 50, 0.1)';
    return 'none';
  };

  return (
    <div ref={containerRef} className="leaderboard-container">

      {/* ── Header Section ── */}
      <div className="lb-header lb-animate-in">
        <div className="lb-header-text">
          <h1 className="lb-title">
            <Trophy style={{ width: 28, height: 28, color: '#fbbf24' }} />
            Leaderboard & Achievements
          </h1>
          <p className="lb-subtitle">
            Compete with players worldwide • Unlock exclusive badges • Climb the ranks
          </p>
        </div>

        {/* Season Banner */}
        <div className="lb-season-banner lb-animate-in">
          <div className="season-info-left">
            <Sparkles style={{ width: 16, height: 16, color: 'var(--neon-cyan)' }} />
            <span className="season-name">{SEASON_INFO.name}</span>
            <span className="season-days">{SEASON_INFO.daysRemaining} days left</span>
          </div>
          <div className="season-tier-progress">
            <span style={{ color: TIER_COLORS[SEASON_INFO.currentTier], fontWeight: 700, fontSize: 12 }}>
              {SEASON_INFO.currentTier}
            </span>
            <div className="season-progress-bar">
              <div className="season-progress-fill" style={{ width: `${SEASON_INFO.progress}%` }} />
            </div>
            <span style={{ color: TIER_COLORS[SEASON_INFO.nextTier], fontWeight: 700, fontSize: 12 }}>
              {SEASON_INFO.nextTier}
            </span>
          </div>
        </div>
      </div>

      {/* ── Section Toggle ── */}
      <div className="lb-section-toggle lb-animate-in">
        <button
          className={`lb-toggle-btn ${activeSection === 'leaderboard' ? 'active' : ''}`}
          onClick={() => setActiveSection('leaderboard')}
          type="button"
        >
          <TrendingUp style={{ width: 16, height: 16 }} />
          Global Rankings
        </button>
        <button
          className={`lb-toggle-btn ${activeSection === 'achievements' ? 'active' : ''}`}
          onClick={() => setActiveSection('achievements')}
          type="button"
        >
          <Award style={{ width: 16, height: 16 }} />
          Achievements
          <span className="lb-badge-count">{achievementStats.unlocked}/{achievementStats.total}</span>
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          LEADERBOARD SECTION
          ══════════════════════════════════════════════════════════════════════ */}
      {activeSection === 'leaderboard' && (
        <>
          {/* Podium Top 3 */}
          <div ref={podiumRef} className="lb-podium lb-animate-in">
            {[filteredPlayers[1], filteredPlayers[0], filteredPlayers[2]].map((player, idx) => {
              if (!player) return null;
              const visualRank = idx === 0 ? 2 : idx === 1 ? 1 : 3;
              const podiumHeight = visualRank === 1 ? 160 : visualRank === 2 ? 130 : 110;
              return (
                <div
                  key={player.nickname}
                  className={`podium-player podium-rank-${visualRank}`}
                  style={{ '--podium-height': `${podiumHeight}px`, '--podium-glow': getPodiumGlow(visualRank) } as React.CSSProperties}
                >
                  {visualRank === 1 && <div className="podium-crown">👑</div>}
                  <div className="podium-avatar" style={{ background: player.avatarGradient }}>
                    <span>{player.nickname.charAt(0)}</span>
                  </div>
                  <span className="podium-nick">{player.nickname}</span>
                  <span className="podium-hours">{player.totalHours.toLocaleString()} hrs</span>
                  <div className="podium-tier" style={{ color: TIER_COLORS[player.tier] || 'var(--text-secondary)' }}>
                    <Shield style={{ width: 12, height: 12 }} />
                    {player.tier}
                  </div>
                  <div className="podium-pedestal">
                    <span className="podium-rank-label">{visualRank === 1 ? '🥇' : visualRank === 2 ? '🥈' : '🥉'}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Filters Bar */}
          <div className="lb-filters lb-animate-in">
            <div className="lb-search-wrap">
              <Search style={{ width: 14, height: 14, color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="lb-search-input"
                placeholder="Search player..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="lb-filter-group">
              <div className="lb-region-btns">
                {(['ALL', 'APAC', 'Europe', 'Americas'] as const).map(r => (
                  <button
                    key={r}
                    className={`lb-region-btn ${regionFilter === r ? 'active' : ''}`}
                    onClick={() => setRegionFilter(r)}
                    type="button"
                  >
                    {r === 'ALL' && <Globe style={{ width: 13, height: 13 }} />}
                    {r}
                  </button>
                ))}
              </div>

              <div className="lb-sort-dropdown-wrap" style={{ position: 'relative' }}>
                <button
                  className="lb-sort-btn"
                  onClick={() => setShowSortDropdown(p => !p)}
                  type="button"
                >
                  Sort: {sortLabels[sortBy]}
                  <ChevronDown style={{ width: 13, height: 13 }} />
                </button>
                {showSortDropdown && (
                  <div className="lb-sort-dropdown">
                    {(Object.keys(sortLabels) as Array<keyof typeof sortLabels>).map(key => (
                      <button
                        key={key}
                        className={`lb-sort-option ${sortBy === key ? 'active' : ''}`}
                        onClick={() => { setSortBy(key as typeof sortBy); setShowSortDropdown(false); }}
                        type="button"
                      >
                        {sortLabels[key]}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Leaderboard Table */}
          <div ref={tableRef} className="lb-table lb-animate-in">
            <div className="lb-table-header">
              <span className="lb-col-rank">Rank</span>
              <span className="lb-col-player">Player</span>
              <span className="lb-col-tier">Tier</span>
              <span className="lb-col-hours">Hours</span>
              <span className="lb-col-achs">Achievements</span>
              <span className="lb-col-streak">Streak</span>
              <span className="lb-col-fav">Favorite Game</span>
            </div>
            {filteredPlayers.map((player) => (
              <div
                key={player.nickname}
                className={`lb-table-row lb-animate-in ${player.isCurrentUser ? 'is-current-user' : ''} ${player.rank <= 3 ? 'top-three' : ''}`}
              >
                <span className="lb-col-rank">
                  {getRankIcon(player.rank)}
                </span>
                <span className="lb-col-player">
                  <div className="lb-player-avatar" style={{ background: player.avatarGradient }}>
                    {player.nickname.charAt(0)}
                  </div>
                  <div className="lb-player-info">
                    <span className="lb-player-name">
                      {player.nickname}
                      {player.isCurrentUser && <span className="lb-you-badge">YOU</span>}
                    </span>
                    <span className="lb-player-region">
                      {player.region} • {player.nodeId}
                    </span>
                  </div>
                </span>
                <span className="lb-col-tier">
                  <span className="lb-tier-pill" style={{ color: TIER_COLORS[player.tier], borderColor: TIER_COLORS[player.tier] + '60' }}>
                    {player.tier}
                  </span>
                </span>
                <span className="lb-col-hours">
                  <Clock style={{ width: 13, height: 13, color: 'var(--neon-cyan)', opacity: 0.7 }} />
                  {player.totalHours.toLocaleString()}h
                </span>
                <span className="lb-col-achs">
                  <Trophy style={{ width: 13, height: 13, color: '#fbbf24', opacity: 0.7 }} />
                  {player.achievementsUnlocked}/{player.totalAchievements}
                </span>
                <span className="lb-col-streak">
                  <Flame style={{ width: 13, height: 13, color: player.streak >= 30 ? '#f43f5e' : '#f59e0b' }} />
                  {player.streak}d
                </span>
                <span className="lb-col-fav lb-fav-game">
                  <Gamepad2 style={{ width: 12, height: 12, opacity: 0.5 }} />
                  {player.favoriteGame}
                </span>
              </div>
            ))}

            {filteredPlayers.length === 0 && (
              <div className="lb-empty-state">
                <Search style={{ width: 32, height: 32, color: 'var(--text-dim)' }} />
                <span>No players found matching your filters</span>
              </div>
            )}
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          ACHIEVEMENTS SECTION
          ══════════════════════════════════════════════════════════════════════ */}
      {activeSection === 'achievements' && (
        <>
          {/* Achievement Summary Cards */}
          <div className="lb-ach-summary lb-animate-in">
            <div className="lb-ach-stat-card">
              <div className="lb-ach-stat-icon" style={{ background: 'rgba(0, 240, 255, 0.1)' }}>
                <Trophy style={{ width: 20, height: 20, color: 'var(--neon-cyan)' }} />
              </div>
              <div className="lb-ach-stat-info">
                <span className="lb-ach-stat-value">{achievementStats.unlocked}</span>
                <span className="lb-ach-stat-label">Unlocked</span>
              </div>
            </div>
            <div className="lb-ach-stat-card">
              <div className="lb-ach-stat-icon" style={{ background: 'rgba(139, 92, 246, 0.1)' }}>
                <Target style={{ width: 20, height: 20, color: 'var(--neon-purple)' }} />
              </div>
              <div className="lb-ach-stat-info">
                <span className="lb-ach-stat-value">{achievementStats.total}</span>
                <span className="lb-ach-stat-label">Total Available</span>
              </div>
            </div>
            <div className="lb-ach-stat-card">
              <div className="lb-ach-stat-icon" style={{ background: 'rgba(251, 191, 36, 0.1)' }}>
                <Star style={{ width: 20, height: 20, color: '#fbbf24' }} />
              </div>
              <div className="lb-ach-stat-info">
                <span className="lb-ach-stat-value">{achievementStats.legendary}</span>
                <span className="lb-ach-stat-label">Legendary</span>
              </div>
            </div>
            <div className="lb-ach-stat-card">
              <div className="lb-ach-stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                <Zap style={{ width: 20, height: 20, color: 'var(--neon-emerald)' }} />
              </div>
              <div className="lb-ach-stat-info">
                <span className="lb-ach-stat-value">{achievementStats.pct}%</span>
                <span className="lb-ach-stat-label">Completion</span>
              </div>
            </div>
          </div>

          {/* Achievement Filters */}
          <div className="lb-ach-filters lb-animate-in">
            <div className="lb-ach-filter-group">
              {(['all', 'unlocked', 'locked'] as const).map(f => (
                <button
                  key={f}
                  className={`lb-ach-filter-btn ${achievementFilter === f ? 'active' : ''}`}
                  onClick={() => setAchievementFilter(f)}
                  type="button"
                >
                  {f === 'all' ? 'All' : f === 'unlocked' ? '✅ Unlocked' : '🔒 Locked'}
                </button>
              ))}
            </div>
            <div className="lb-ach-filter-group">
              {(['all', 'Legendary', 'Epic', 'Rare', 'Common'] as const).map(r => (
                <button
                  key={r}
                  className={`lb-ach-rarity-btn ${rarityFilter === r ? 'active' : ''}`}
                  onClick={() => setRarityFilter(r)}
                  type="button"
                  style={r !== 'all' ? { color: RARITY_STYLES[r]?.text } : {}}
                >
                  {r === 'all' ? 'All Rarities' : r}
                </button>
              ))}
            </div>
          </div>

          {/* Achievement Grid */}
          <div className="lb-ach-grid">
            {filteredAchievements.map((ach) => {
              const style = RARITY_STYLES[ach.rarity];
              return (
                <div
                  key={ach.id}
                  className={`lb-ach-card lb-animate-in ${ach.isUnlocked ? 'unlocked' : 'locked'}`}
                  style={{
                    background: ach.isUnlocked ? style.bg : 'rgba(30, 30, 40, 0.5)',
                    borderColor: ach.isUnlocked ? style.border : 'rgba(255,255,255,0.06)',
                    boxShadow: ach.isUnlocked ? style.glow : 'none',
                  }}
                >
                  <div className="lb-ach-card-top">
                    <span className="lb-ach-icon" style={{ filter: ach.isUnlocked ? 'none' : 'grayscale(1) opacity(0.4)' }}>
                      {ach.icon}
                    </span>
                    <span className="lb-ach-rarity" style={{ color: style.text, borderColor: style.border }}>
                      {ach.rarity}
                    </span>
                  </div>
                  <h4 className="lb-ach-title" style={{ color: ach.isUnlocked ? 'var(--text-primary)' : 'var(--text-dim)' }}>
                    {ach.title}
                  </h4>
                  <p className="lb-ach-desc">{ach.description}</p>
                  <div className="lb-ach-card-bottom">
                    <span className="lb-ach-game">{ach.game}</span>
                    <div className="lb-ach-rarity-bar">
                      <div className="lb-ach-rarity-fill" style={{ width: `${ach.rarityPct}%`, background: style.text }} />
                    </div>
                    <span className="lb-ach-rarity-pct">{ach.rarityPct}% of players</span>
                  </div>
                  {ach.isUnlocked && ach.unlockedDate && (
                    <div className="lb-ach-unlocked-badge">
                      ✅ Unlocked {ach.unlockedDate}
                    </div>
                  )}
                  {!ach.isUnlocked && (
                    <div className="lb-ach-locked-overlay">
                      <span>🔒</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {filteredAchievements.length === 0 && (
            <div className="lb-empty-state lb-animate-in">
              <Award style={{ width: 32, height: 32, color: 'var(--text-dim)' }} />
              <span>No achievements match your current filters</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
