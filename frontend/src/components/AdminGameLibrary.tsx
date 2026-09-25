import { useState } from 'react';
import { 
  Server, Wrench, RefreshCw, AlertTriangle, CheckCircle2, 
  Search, ShieldAlert, Cpu, Zap, Wifi, Terminal, 
  X, Filter
} from 'lucide-react';

interface AdminGame {
  id: number;
  appId: number;
  title: string;
  genre: string;
  status: 'online' | 'maintenance' | 'lag_warning';
  activeSessions: number;
  assignedNode: string;
  vramUsage: string;
  serverPing: string;
  frameDrop: string;
  shaderStatus: 'Verified' | 'Compiling' | 'Outdated';
  image: string;
  errorLog?: string;
}

const initialAdminGames: AdminGame[] = [
  {
    id: 1,
    appId: 2669320,
    title: 'EA SPORTS FC™ 25',
    genre: 'Sports / Competitive',
    status: 'online',
    activeSessions: 24,
    assignedNode: 'SG-01 (RTX 4090)',
    vramUsage: '16.2 GB',
    serverPing: '3.8 ms',
    frameDrop: '0.01%',
    shaderStatus: 'Verified',
    image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2669320/header.jpg',
    errorLog: '[18:40:12] EA Anti-Cheat service: Handshake OK. Shader cache warmed.'
  },
  {
    id: 2,
    appId: 1091500,
    title: 'Cyberpunk 2077',
    genre: 'RPG / Open World',
    status: 'online',
    activeSessions: 18,
    assignedNode: 'SG-01 (RTX 4090)',
    vramUsage: '21.5 GB',
    serverPing: '4.1 ms',
    frameDrop: '0.04%',
    shaderStatus: 'Verified',
    image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/header.jpg',
    errorLog: '[18:42:05] Ray Tracing Overdrive: DLSS Frame Gen 3.5 pipeline stable.'
  },
  {
    id: 3,
    appId: 2358720,
    title: 'Black Myth: Wukong',
    genre: 'Action RPG',
    status: 'lag_warning',
    activeSessions: 12,
    assignedNode: 'JK-01 (RTX 4080)',
    vramUsage: '18.9 GB',
    serverPing: '14.2 ms',
    frameDrop: '1.25%',
    shaderStatus: 'Compiling',
    image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2358720/header.jpg',
    errorLog: '[18:44:22] WARN: Nanite geometry queue bottleneck detected on JK-01 node. Recommend server restart.'
  },
  {
    id: 4,
    appId: 730,
    title: 'Counter-Strike 2',
    genre: 'Competitive FPS',
    status: 'online',
    activeSessions: 31,
    assignedNode: 'JK-01 (RTX 4080)',
    vramUsage: '11.4 GB',
    serverPing: '2.1 ms',
    frameDrop: '0.00%',
    shaderStatus: 'Verified',
    image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/730/header.jpg',
    errorLog: '[18:45:00] Sub-tick stream packet synchronization: 1000Hz active.'
  },
  {
    id: 5,
    appId: 1245620,
    title: 'Elden Ring',
    genre: 'Action RPG',
    status: 'maintenance',
    activeSessions: 0,
    assignedNode: 'TY-01 (RTX 4090)',
    vramUsage: '0.0 GB',
    serverPing: '28.0 ms',
    frameDrop: 'N/A',
    shaderStatus: 'Outdated',
    image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/header.jpg',
    errorLog: '[18:30:00] MAINTENANCE: Steam Depot Patch v1.13 downloading (18.4 GB). Inbound player queues paused.'
  },
  {
    id: 6,
    appId: 1086940,
    title: 'Baldur\'s Gate 3',
    genre: 'Story RPG',
    status: 'online',
    activeSessions: 9,
    assignedNode: 'SG-01 (RTX 4090)',
    vramUsage: '14.8 GB',
    serverPing: '3.9 ms',
    frameDrop: '0.02%',
    shaderStatus: 'Verified',
    image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1086940/header.jpg',
    errorLog: '[18:41:19] Act III Vulkan render context memory footprint: Nominal.'
  },
  {
    id: 7,
    appId: 1234567,
    title: 'Meccha Chameleon',
    genre: 'Indie / Action',
    status: 'online',
    activeSessions: 48,
    assignedNode: 'JK-01 (RTX 4080)',
    vramUsage: '8.4 GB',
    serverPing: '2.4 ms',
    frameDrop: '0.00%',
    shaderStatus: 'Verified',
    image: '/meccha_chameleon.jpg',
    errorLog: '[18:50:00] Physics tick rate locked at 240Hz. Low memory footprint.'
  },
  {
    id: 8,
    appId: 1623730,
    title: 'Palworld',
    genre: 'Action RPG / Multiplayer',
    status: 'online',
    activeSessions: 36,
    assignedNode: 'SG-01 (RTX 4090)',
    vramUsage: '18.1 GB',
    serverPing: '3.6 ms',
    frameDrop: '0.02%',
    shaderStatus: 'Verified',
    image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1623730/library_600x900.jpg',
    errorLog: '[18:51:10] Dedicated server world instance save synchronized.'
  },
  {
    id: 9,
    appId: 1085660,
    title: 'Destiny 2',
    genre: 'Action MMO',
    status: 'online',
    activeSessions: 22,
    assignedNode: 'SG-01 (RTX 4090)',
    vramUsage: '15.6 GB',
    serverPing: '4.0 ms',
    frameDrop: '0.01%',
    shaderStatus: 'Verified',
    image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1085660/library_600x900.jpg',
    errorLog: '[18:52:00] Bungie BattleEye integration: Clean state.'
  },
  {
    id: 10,
    appId: 292030,
    title: 'The Witcher 3: Wild Hunt',
    genre: 'RPG',
    status: 'online',
    activeSessions: 14,
    assignedNode: 'TY-01 (RTX 4090)',
    vramUsage: '19.4 GB',
    serverPing: '27.4 ms',
    frameDrop: '0.05%',
    shaderStatus: 'Verified',
    image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/292030/library_600x900.jpg',
    errorLog: '[18:53:20] Next-Gen DirectX 12 Ultimate pipeline active.'
  },
  {
    id: 11,
    appId: 814380,
    title: 'Sekiro: Shadows Die Twice',
    genre: 'Action',
    status: 'online',
    activeSessions: 11,
    assignedNode: 'JK-01 (RTX 4080)',
    vramUsage: '9.8 GB',
    serverPing: '2.3 ms',
    frameDrop: '0.00%',
    shaderStatus: 'Verified',
    image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/814380/library_600x900.jpg',
    errorLog: '[18:54:05] Ultra-low input latency pipeline verified at 120 FPS.'
  },
  {
    id: 12,
    appId: 9999992,
    title: 'Windrose',
    genre: 'Indie RPG',
    status: 'online',
    activeSessions: 29,
    assignedNode: 'SG-01 (RTX 4090)',
    vramUsage: '12.0 GB',
    serverPing: '3.7 ms',
    frameDrop: '0.01%',
    shaderStatus: 'Verified',
    image: '/windrose.jpg',
    errorLog: '[18:55:12] Celestial weather particle sim running smoothly.'
  },
  {
    id: 13,
    appId: 641990,
    title: 'The Escapists 2',
    genre: 'Strategy',
    status: 'online',
    activeSessions: 16,
    assignedNode: 'JK-01 (RTX 4080)',
    vramUsage: '4.5 GB',
    serverPing: '2.0 ms',
    frameDrop: '0.00%',
    shaderStatus: 'Verified',
    image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/641990/library_600x900.jpg',
    errorLog: '[18:56:00] Multiplayer prison session state synchronized.'
  }
];

interface AdminGameLibraryProps {
  onToast?: (msg: string, iconType?: 'success' | 'warn') => void;
}

export default function AdminGameLibrary({ onToast }: AdminGameLibraryProps) {
  const [games, setGames] = useState<AdminGame[]>(initialAdminGames);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'lag_warning' | 'maintenance'>('all');
  const [debugGame, setDebugGame] = useState<AdminGame | null>(null);
  const [restartingId, setRestartingId] = useState<number | null>(null);

  const notify = (msg: string, type: 'success' | 'warn' = 'success') => {
    if (onToast) onToast(msg, type);
  };

  // Restart Cloud Server for a specific game instance
  const handleRestartServer = (game: AdminGame) => {
    setRestartingId(game.id);
    notify(`Initiating cold reboot for ${game.title} cloud container...`, 'warn');

    setTimeout(() => {
      setGames(prev => prev.map(g => {
        if (g.id === game.id) {
          return {
            ...g,
            status: 'online',
            serverPing: '3.2 ms',
            frameDrop: '0.00%',
            shaderStatus: 'Verified',
            errorLog: `[${new Date().toLocaleTimeString()}] Container reboot successful. PCIe link re-negotiated. Shader cache primed.`
          };
        }
        return g;
      }));
      setRestartingId(null);
      notify(`Server for ${game.title} successfully rebooted and stabilized!`, 'success');
    }, 2000);
  };

  // Toggle Maintenance Mode
  const handleToggleMaintenance = (game: AdminGame) => {
    const isEntering = game.status !== 'maintenance';
    setGames(prev => prev.map(g => {
      if (g.id === game.id) {
        return {
          ...g,
          status: isEntering ? 'maintenance' : 'online',
          activeSessions: isEntering ? 0 : 5,
          vramUsage: isEntering ? '0.0 GB' : '15.4 GB',
          errorLog: isEntering 
            ? `[${new Date().toLocaleTimeString()}] ADMIN SET: Server placed in Maintenance Mode. Sessions migrated.`
            : `[${new Date().toLocaleTimeString()}] ADMIN SET: Server maintenance cleared. Accepting player stream sessions.`
        };
      }
      return g;
    }));

    notify(
      isEntering 
        ? `${game.title} is now in Maintenance Mode (Player launches blocked).` 
        : `${game.title} maintenance completed. Live streaming restored!`,
      isEntering ? 'warn' : 'success'
    );
  };

  const filteredGames = games.filter(g => {
    const matchesSearch = g.title.toLowerCase().includes(search.toLowerCase()) || 
                          g.assignedNode.toLowerCase().includes(search.toLowerCase()) ||
                          String(g.appId).includes(search);
    const matchesStatus = statusFilter === 'all' || g.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="admin-gamelib-container">
      {/* 1. Header Banner */}
      <header className="admin-gamelib-header">
        <div>
          <div className="admin-badge-pill">
            <ShieldAlert style={{ width: 14, height: 14 }} />
            <span>ADMIN FLEET MANAGEMENT • GAME INSTANCE ORCHESTRATION</span>
          </div>
          <h1 className="admin-gamelib-title">Game Library (Admin Management)</h1>
          <p className="admin-gamelib-sub">
            Monitor game server health, isolate laggy stream containers, restart malfunctioning instances, and enforce maintenance windows.
          </p>
        </div>

        {/* Global Stats Counter */}
        <div className="admin-stats-pills">
          <div className="admin-stat-pill">
            <span className="lbl">Managed Games</span>
            <span className="val">{games.length} Titles</span>
          </div>
          <div className="admin-stat-pill highlight">
            <span className="lbl">Active Player Streams</span>
            <span className="val cyan">{games.reduce((acc, g) => acc + g.activeSessions, 0)} Streams</span>
          </div>
          <div className="admin-stat-pill">
            <span className="lbl">Lag Warnings</span>
            <span className={`val ${games.some(g => g.status === 'lag_warning') ? 'rose' : 'green'}`}>
              {games.filter(g => g.status === 'lag_warning').length} Warning
            </span>
          </div>
        </div>
      </header>

      {/* 2. Controls & Filter Bar */}
      <div className="admin-gamelib-controls">
        <div className="admin-search-wrap">
          <Search className="admin-search-icon" />
          <input
            type="text"
            className="admin-search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, Steam AppID, or node cluster..."
          />
          {search && (
            <button className="clear-search-btn" onClick={() => setSearch('')}>
              <X style={{ width: 14, height: 14 }} />
            </button>
          )}
        </div>

        <div className="admin-filter-tabs">
          <button
            className={`admin-filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            All Instances ({games.length})
          </button>
          <button
            className={`admin-filter-btn ${statusFilter === 'online' ? 'active green' : ''}`}
            onClick={() => setStatusFilter('online')}
          >
            Healthy ({games.filter(g => g.status === 'online').length})
          </button>
          <button
            className={`admin-filter-btn ${statusFilter === 'lag_warning' ? 'active yellow' : ''}`}
            onClick={() => setStatusFilter('lag_warning')}
          >
            Lag / High Latency ({games.filter(g => g.status === 'lag_warning').length})
          </button>
          <button
            className={`admin-filter-btn ${statusFilter === 'maintenance' ? 'active rose' : ''}`}
            onClick={() => setStatusFilter('maintenance')}
          >
            Maintenance ({games.filter(g => g.status === 'maintenance').length})
          </button>
        </div>
      </div>

      {/* 3. Game Management Grid */}
      <div className="admin-gamelib-grid">
        {filteredGames.map((game) => {
          const isRestarting = restartingId === game.id;
          return (
            <div key={game.id} className={`admin-game-card status-${game.status}`}>
              {/* Card Banner Image & Status Header */}
              <div className="admin-card-media">
                <img 
                  src={game.image} 
                  alt={game.title} 
                  className="admin-game-thumb" 
                  onError={(e) => {
                    const el = e.currentTarget;
                    if (game.appId === 1234567 || game.title.includes('Meccha Chameleon')) {
                      el.src = '/meccha_chameleon.jpg';
                    } else if (game.appId === 9999992 || game.title.includes('Windrose')) {
                      el.src = '/windrose.jpg';
                    } else {
                      el.src = `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${game.appId}/header.jpg`;
                    }
                  }}
                />
                <div className="admin-card-overlay">
                  <span className={`game-health-badge ${game.status}`}>
                    {game.status === 'online' && <CheckCircle2 style={{ width: 12, height: 12 }} />}
                    {game.status === 'lag_warning' && <AlertTriangle style={{ width: 12, height: 12 }} />}
                    {game.status === 'maintenance' && <Wrench style={{ width: 12, height: 12 }} />}
                    {game.status === 'online' ? 'ONLINE (HEALTHY)' : game.status === 'lag_warning' ? 'LATENCY ALERT' : 'MAINTENANCE MODE'}
                  </span>
                  <span className="admin-appid-tag">AppID: {game.appId}</span>
                </div>
              </div>

              {/* Game Metadata & Server Metrics */}
              <div className="admin-card-body">
                <div className="admin-card-title-row">
                  <div>
                    <h3 className="admin-game-title">{game.title}</h3>
                    <p className="admin-game-genre">{game.genre}</p>
                  </div>
                  <span className="admin-sessions-chip">
                    <strong>{game.activeSessions}</strong> Active Streams
                  </span>
                </div>

                {/* Telemetry Matrix */}
                <div className="admin-metrics-matrix">
                  <div className="admin-matrix-col">
                    <span className="mat-lbl"><Server style={{ width: 12, height: 12 }} /> Cluster Node</span>
                    <span className="mat-val">{game.assignedNode}</span>
                  </div>
                  <div className="admin-matrix-col">
                    <span className="mat-lbl"><Zap style={{ width: 12, height: 12 }} /> VRAM Allocated</span>
                    <span className="mat-val cyan">{game.vramUsage}</span>
                  </div>
                  <div className="admin-matrix-col">
                    <span className="mat-lbl"><Wifi style={{ width: 12, height: 12 }} /> Server Ping</span>
                    <span className={`mat-val ${parseFloat(game.serverPing) > 10 ? 'rose' : 'emerald'}`}>{game.serverPing}</span>
                  </div>
                  <div className="admin-matrix-col">
                    <span className="mat-lbl"><Cpu style={{ width: 12, height: 12 }} /> Frame Drop</span>
                    <span className="mat-val">{game.frameDrop}</span>
                  </div>
                </div>

                {/* STRICT ADMIN ACTIONS: Remove Play buttons, replace with Debug, Restart Server, Maintenance Mode */}
                <div className="admin-actions-toolbar">
                  <button
                    type="button"
                    className="admin-action-btn debug-btn"
                    onClick={() => setDebugGame(game)}
                    title="Inspect stream socket, render logs, and diagnostics"
                  >
                    <Terminal style={{ width: 14, height: 14 }} />
                    <span>Debug</span>
                  </button>

                  <button
                    type="button"
                    className={`admin-action-btn restart-btn ${isRestarting ? 'loading' : ''}`}
                    onClick={() => handleRestartServer(game)}
                    disabled={isRestarting}
                    title="Cold restart game instance container"
                  >
                    <RefreshCw style={{ width: 14, height: 14 }} className={isRestarting ? 'spin-icon' : ''} />
                    <span>{isRestarting ? 'Restarting...' : 'Restart Server'}</span>
                  </button>

                  <button
                    type="button"
                    className={`admin-action-btn maintenance-btn ${game.status === 'maintenance' ? 'active-maint' : ''}`}
                    onClick={() => handleToggleMaintenance(game)}
                    title="Toggle game availability for players"
                  >
                    <Wrench style={{ width: 14, height: 14 }} />
                    <span>{game.status === 'maintenance' ? 'End Maint' : 'Maintenance'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Live Debug Modal Dialog */}
      {debugGame && (
        <div className="admin-debug-overlay" onClick={() => setDebugGame(null)}>
          <div className="admin-debug-modal" onClick={e => e.stopPropagation()}>
            <div className="debug-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Terminal style={{ width: 20, height: 20, color: 'var(--neon-cyan)' }} />
                <div>
                  <h3 className="debug-title">Live Debug Stream: {debugGame.title}</h3>
                  <p className="debug-sub">Steam AppID: {debugGame.appId} • Node: {debugGame.assignedNode}</p>
                </div>
              </div>
              <button className="close-debug-btn" onClick={() => setDebugGame(null)}>
                <X style={{ width: 18, height: 18 }} />
              </button>
            </div>

            <div className="debug-modal-content">
              {/* Telemetry Summary Box */}
              <div className="debug-telemetry-strip">
                <div className="debug-tel-item">
                  <span className="tel-k">Status:</span>
                  <span className={`tel-v ${debugGame.status}`}>{debugGame.status.toUpperCase()}</span>
                </div>
                <div className="debug-tel-item">
                  <span className="tel-k">Server RTT:</span>
                  <span className="tel-v cyan">{debugGame.serverPing}</span>
                </div>
                <div className="debug-tel-item">
                  <span className="tel-k">VRAM Locked:</span>
                  <span className="tel-v purple">{debugGame.vramUsage}</span>
                </div>
                <div className="debug-tel-item">
                  <span className="tel-k">Shaders:</span>
                  <span className="tel-v green">{debugGame.shaderStatus}</span>
                </div>
              </div>

              {/* Console Stream Output */}
              <div className="debug-console-terminal">
                <div className="console-line dim">=== OMNIPLAY CONTAINER RUNTIME DIAGNOSTIC v2.4 ===</div>
                <div className="console-line">[INIT] Mounting Steam Depot depotcache/{debugGame.appId}...</div>
                <div className="console-line">[NVIDIA] vGPU RTX 4090 Context Initialized. Driver 560.35.03</div>
                <div className="console-line cyan">[WEBRTC] H.265 / AV1 Hardware NVENC Encoder ready on UDP:5004</div>
                <div className="console-line green">[AUDIO] Opus Low-Latency Audio 48kHz Stereo Buffer: OK</div>
                <div className="console-line yellow">{debugGame.errorLog}</div>
                <div className="console-line dim">[METRICS] Frame delta: 8.33ms (120 FPS Lock) • Jitter: 0.08ms</div>
                <div className="console-line blink">_</div>
              </div>
            </div>

            <div className="debug-modal-footer">
              <button 
                type="button"
                className="debug-quick-btn restart"
                onClick={() => {
                  handleRestartServer(debugGame);
                  setDebugGame(null);
                }}
              >
                <RefreshCw style={{ width: 14, height: 14 }} />
                <span>Restart Instance Now</span>
              </button>
              <button 
                type="button"
                className="debug-quick-btn close"
                onClick={() => setDebugGame(null)}
              >
                Close Debugger
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
