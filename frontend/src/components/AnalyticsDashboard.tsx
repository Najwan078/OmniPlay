import { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Download, ChevronDown, FileText, FileJson, Zap, Activity, 
  Clock, Trophy, Target, Crosshair, Gauge, BarChart3, Check,
  Wifi, ShieldCheck, Cpu, HardDrive, PieChart as PieIcon, Flame
} from 'lucide-react';

export default function AnalyticsDashboard() {
  const [exportOpen, setExportOpen] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close export dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setExportOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Export handler - strictly respects single Export button rule
  const handleExport = async (type: 'PDF' | 'JSON') => {
    setExportOpen(false);
    setExportNotice(`Exporting analytics report as ${type}...`);
    
    try {
      const res = await fetch(`/api/export?format=${type.toLowerCase()}`);
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `omniplay_analytics.${type.toLowerCase()}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setExportNotice(`Successfully exported ${type} report!`);
    } catch {
      // Robust client-side fallback
      if (type === 'JSON') {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
          platform: "OmniPlay Cloud Computing",
          report: "Performance Analytics & Telemetry Audit",
          timeRange,
          totalPlaytime: "847 hrs",
          averageFPS: 118,
          inputLatency: "3.8 ms",
          packetLoss: "0.001%",
          gameShare: [
            { game: "EA SPORTS FC 25", share: "34%", hours: 288 },
            { game: "Cyberpunk 2077", share: "26%", hours: 220 },
            { game: "Valorant", share: "20%", hours: 170 },
            { game: "Black Myth: Wukong", share: "12%", hours: 101 },
            { game: "Baldur's Gate 3", share: "8%", hours: 68 }
          ],
          nodes: [
            { id: "SG-01", latency: "3.8ms", gpu: "RTX 4090", uptime: "99.99%" },
            { id: "JK-01", latency: "2.1ms", gpu: "RTX 4080", uptime: "99.98%" },
            { id: "TY-01", latency: "28ms", gpu: "H100 NVLink", uptime: "99.95%" }
          ],
          exportedAt: new Date().toISOString()
        }, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", "omniplay_analytics.json");
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
      } else {
        const blob = new Blob(["%PDF-1.4 Mock OmniPlay Analytics Audit Report\nGenerated via OmniPlay Client Engine"], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "omniplay_analytics.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      }
      setExportNotice(`Exported analytics report as ${type}`);
    }

    setTimeout(() => {
      setExportNotice(null);
    }, 3500);
  };

  // Pie chart data for most played games
  const mostPlayedGames = [
    { name: 'EA SPORTS FC™ 25', pct: 34, color: '#00f0ff', hours: 288 },
    { name: 'Cyberpunk 2077', pct: 26, color: '#3b82f6', hours: 220 },
    { name: 'Valorant', pct: 20, color: '#10b981', hours: 170 },
    { name: 'Black Myth: Wukong', pct: 12, color: '#8b5cf6', hours: 101 },
    { name: 'Baldur\'s Gate 3', pct: 8, color: '#f59e0b', hours: 68 },
  ];

  // 7-day x 24-hour heatmap activity schedule (0: Idle, 1: Low, 2: Med, 3: High, 4: Peak)
  const heatmapDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const heatmapHours = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22];

  // Intensity metadata mappings
  const intensityClasses = ['idle', 'low', 'med', 'high', 'peak'] as const;
  const intensityLabels = ['Idle (0)', 'Low (1)', 'Medium (2)', 'High (3)', 'Peak (4)'] as const;

  /**
   * TASK 1: Realistic Dummy Data Generator
   * Generates a 2D array representing 7 days (rows) and available hours (columns).
   * Patterns:
   * - Night/Morning (02:00 to 08:00): Mostly 0 or 1.
   * - Evening/Prime Time (18:00 to 22:00): Mostly 3 or 4.
   * - Daytime (10:00 to 16:00): Randomized between 1, 2, and 3.
   */
  const generateRealisticHeatmapData = (daysCount: number, hours: number[]): number[][] => {
    return Array.from({ length: daysCount }, (_, dayIdx) => {
      const isWeekend = dayIdx === 5 || dayIdx === 6; // Saturday or Sunday
      const isFriday = dayIdx === 4;

      return hours.map(hour => {
        // 1. Night / Early Morning (02:00 to 08:00): mostly 0 or 1
        if (hour >= 2 && hour <= 8) {
          const lowChance = isWeekend && hour <= 4 ? 0.35 : 0.15;
          return Math.random() < lowChance ? 1 : 0;
        }

        // 2. Evening / Prime Time (18:00 to 22:00): mostly 3 or 4
        if (hour >= 18 && hour <= 22) {
          if (isFriday || isWeekend) {
            return Math.random() < 0.85 ? 4 : 3;
          }
          return Math.random() < 0.6 ? 4 : 3;
        }

        // 3. Daytime (10:00 to 16:00): randomize between 1, 2, and 3
        if (hour >= 10 && hour <= 16) {
          if (isWeekend) {
            const rand = Math.random();
            return rand < 0.2 ? 1 : rand < 0.65 ? 2 : 3;
          }
          const rand = Math.random();
          return rand < 0.45 ? 1 : rand < 0.85 ? 2 : 3;
        }

        // 4. Midnight (00:00) & Late hours:
        if (hour === 0) {
          if (isFriday || isWeekend) return Math.random() < 0.5 ? 3 : 2;
          return Math.random() < 0.6 ? 1 : 2;
        }

        // Transition fallback (08:00-10:00 or 16:00-18:00):
        if (hour >= 16 && hour < 18) {
          return isWeekend ? 3 : (Math.random() < 0.5 ? 2 : 3);
        }
        return Math.random() < 0.6 ? 1 : 2;
      });
    });
  };

  // Generate 2D array matrix: 7 days x 12 hours
  const heatmapMatrix = useMemo(
    () => generateRealisticHeatmapData(heatmapDays.length, heatmapHours),
    []
  );

  const gameInsights = [
    { game: 'Valorant', stat: 'Reflex E-Sports Latency', value: '2.1 ms (JK-01)', icon: <Activity style={{ width: 16, height: 16, color: 'var(--neon-cyan)' }} /> },
    { game: 'Forza Horizon 5', stat: 'Best Lap Time', value: '1:32.458', icon: <Gauge style={{ width: 16, height: 16, color: 'var(--neon-amber)' }} /> },
    { game: 'Helldivers 2', stat: 'Headshot Accuracy', value: '34.2%', icon: <Crosshair style={{ width: 16, height: 16, color: 'var(--neon-cyan)' }} /> },
    { game: 'Black Myth: Wukong', stat: 'Bosses Defeated', value: '12 / 28', icon: <Trophy style={{ width: 16, height: 16, color: 'var(--neon-purple)' }} /> },
    { game: 'Cyberpunk 2077', stat: 'Path Tracing Stability', value: '99.8% (SG-01)', icon: <Target style={{ width: 16, height: 16, color: 'var(--neon-blue)' }} /> },
    { game: 'EA FC 25', stat: 'FUT Win Rate', value: '68.5%', icon: <Trophy style={{ width: 16, height: 16, color: 'var(--neon-emerald)' }} /> },
  ];

  return (
    <div className="analytics-page-wrap">
      
      {/* 1. Analytics Header with STRICT SINGLE EXPORT BUTTON RULE */}
      <header className="analytics-header">
        <div className="analytics-header-titles">
          <div className="analytics-badge">
            <ShieldCheck style={{ width: 14, height: 14 }} />
            <span>REAL-TIME STREAM TELEMETRY & HARDWARE AUDIT</span>
          </div>
          <h1 className="analytics-title">Performance Analytics</h1>
          <p className="analytics-sub">Deep telemetry, framerate distributions, usage heatmaps, and cloud edge node performance.</p>
        </div>

        <div className="analytics-header-actions">
          {/* Time Filter Pills */}
          <div className="analytics-time-pills">
            {(['24h', '7d', '30d'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTimeRange(t)}
                className={`time-pill ${timeRange === t ? 'active' : ''}`}
                type="button"
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>

          {/* EXACTLY ONE "Export" Button revealing a dropdown with "PDF" and "JSON" */}
          <div className="export-dropdown-wrapper" ref={dropdownRef}>
            <button
              onClick={() => setExportOpen(!exportOpen)}
              className="export-trigger-btn"
              type="button"
              aria-haspopup="true"
              aria-expanded={exportOpen}
            >
              <Download style={{ width: 16, height: 16 }} />
              <span>Export</span>
              <ChevronDown 
                style={{ 
                  width: 14, 
                  height: 14, 
                  transform: exportOpen ? 'rotate(180deg)' : 'none', 
                  transition: 'transform 0.2s ease' 
                }} 
              />
            </button>

            {exportOpen && (
              <div className="export-dropdown-menu">
                <button 
                  onClick={() => handleExport('PDF')} 
                  className="export-option-item"
                  type="button"
                >
                  <FileText style={{ width: 16, height: 16, color: 'var(--neon-cyan)' }} />
                  <span>Export as PDF</span>
                </button>
                <button 
                  onClick={() => handleExport('JSON')} 
                  className="export-option-item"
                  type="button"
                >
                  <FileJson style={{ width: 16, height: 16, color: 'var(--neon-emerald)' }} />
                  <span>Export as JSON</span>
                </button>
              </div>
            )}

            {exportNotice && (
              <div className="export-toast-notice">
                <Check style={{ width: 14, height: 14, color: 'var(--neon-emerald)' }} />
                <span>{exportNotice}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. Key Performance Indicators (KPI) Grid */}
      <div className="analytics-kpi-grid">
        <div className="analytics-kpi-card">
          <div className="kpi-header">
            <span className="kpi-tag">TOTAL PLAYTIME</span>
            <Clock style={{ width: 16, height: 16, color: 'var(--text-muted)' }} />
          </div>
          <p className="kpi-value">847 <span className="unit">hrs</span></p>
          <p className="kpi-sub green">↑ 12% vs last month</p>
        </div>

        <div className="analytics-kpi-card">
          <div className="kpi-header">
            <span className="kpi-tag">AVG STREAM FPS</span>
            <Zap style={{ width: 16, height: 16, color: 'var(--neon-cyan)' }} />
          </div>
          <p className="kpi-value cyan">118 <span className="unit">fps</span></p>
          <p className="kpi-sub">1% Low: 94 fps (Rock-Solid)</p>
        </div>

        <div className="analytics-kpi-card">
          <div className="kpi-header">
            <span className="kpi-tag">INPUT LATENCY</span>
            <Activity style={{ width: 16, height: 16, color: 'var(--neon-emerald)' }} />
          </div>
          <p className="kpi-value emerald">3.8 <span className="unit">ms</span></p>
          <p className="kpi-sub">Sub-4ms Cloud WebRTC Pipeline</p>
        </div>

        <div className="analytics-kpi-card">
          <div className="kpi-header">
            <span className="kpi-tag">BANDWIDTH USAGE</span>
            <BarChart3 style={{ width: 16, height: 16, color: 'var(--neon-purple)' }} />
          </div>
          <p className="kpi-value purple">48.5 <span className="unit">Mbps</span></p>
          <p className="kpi-sub">AV1 Codec Hardware-Accelerated</p>
        </div>
      </div>

      {/* 3. Heatmaps & Most Frequently Played Games Pie Chart Grid */}
      <div className="analytics-charts-grid">
        
        {/* Stream Usage Peak Heatmap */}
        <div className="analytics-chart-card">
          <div className="chart-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Flame style={{ width: 20, height: 20, color: 'var(--neon-amber)' }} />
              <div>
                <h3 className="chart-card-title">Peak Cloud Stream Usage Heatmap</h3>
                <p className="chart-card-sub">Concurrent player stream sessions by day and hour</p>
              </div>
            </div>
            <div className="heatmap-legend">
              <span className="heat-cell-sample idle" /> <span>0: Idle</span>
              <span className="heat-cell-sample low" /> <span>1: Low</span>
              <span className="heat-cell-sample med" /> <span>2: Med</span>
              <span className="heat-cell-sample high" /> <span>3: High</span>
              <span className="heat-cell-sample peak" /> <span>4: Peak</span>
            </div>
          </div>

          <div className="heatmap-table-wrap">
            <table className="heatmap-table">
              <thead>
                <tr>
                  <th className="heat-corner">Day</th>
                  {heatmapHours.map(h => (
                    <th key={h} className="heat-th">{h}:00</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* TASK 2: Render 2D array dynamically with React .map() */}
                {heatmapMatrix.map((dayRow, dayIdx) => {
                  const day = heatmapDays[dayIdx];
                  return (
                    <tr key={day}>
                      <td className="heat-day-label">{day}</td>
                      {dayRow.map((intensityLevel, hourIdx) => {
                        const hour = heatmapHours[hourIdx];
                        const intensityClass = intensityClasses[intensityLevel] || 'idle';
                        const intensityLabel = intensityLabels[intensityLevel] || 'Idle';
                        const hourFormatted = `${hour.toString().padStart(2, '0')}:00`;

                        return (
                          <td key={hour} className="heat-td">
                            <div 
                              className={`heat-cell ${intensityClass} level-${intensityLevel}`}
                              title={`${day} ${hourFormatted} — Level ${intensityLevel}: ${intensityLabel}`}
                              role="gridcell"
                              aria-label={`${day} ${hourFormatted}, ${intensityLabel}`}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Most Frequently Played Games Pie / Donut Chart */}
        <div className="analytics-chart-card">
          <div className="chart-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <PieIcon style={{ width: 20, height: 20, color: 'var(--neon-cyan)' }} />
              <div>
                <h3 className="chart-card-title">Most Played Games Distribution</h3>
                <p className="chart-card-sub">Share of total server playtime hours</p>
              </div>
            </div>
            <span className="chart-badge-tag">Total: 847 hrs</span>
          </div>

          <div className="pie-chart-content-row">
            {/* SVG Donut Chart */}
            <div className="pie-svg-wrap">
              <svg viewBox="0 0 200 200" className="pie-donut-svg">
                {/* Background Track */}
                <circle cx="100" cy="100" r="70" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="26" />
                
                {/* Segments: circumference = 2 * pi * 70 ≈ 439.8 */}
                {/* EA FC: 34% -> 149.5 */}
                <circle
                  cx="100"
                  cy="100"
                  r="70"
                  fill="none"
                  stroke="#00f0ff"
                  strokeWidth="26"
                  strokeDasharray="149.5 439.8"
                  strokeDashoffset="0"
                  transform="rotate(-90 100 100)"
                  filter="drop-shadow(0 0 4px rgba(0,240,255,0.4))"
                />
                {/* Cyberpunk: 26% -> 114.3 */}
                <circle
                  cx="100"
                  cy="100"
                  r="70"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="26"
                  strokeDasharray="114.3 439.8"
                  strokeDashoffset="-149.5"
                  transform="rotate(-90 100 100)"
                />
                {/* Valorant: 20% -> 88.0 */}
                <circle
                  cx="100"
                  cy="100"
                  r="70"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="26"
                  strokeDasharray="88.0 439.8"
                  strokeDashoffset="-263.8"
                  transform="rotate(-90 100 100)"
                />
                {/* Black Myth: 12% -> 52.8 */}
                <circle
                  cx="100"
                  cy="100"
                  r="70"
                  fill="none"
                  stroke="#8b5cf6"
                  strokeWidth="26"
                  strokeDasharray="52.8 439.8"
                  strokeDashoffset="-351.8"
                  transform="rotate(-90 100 100)"
                />
                {/* Baldur's Gate: 8% -> 35.2 */}
                <circle
                  cx="100"
                  cy="100"
                  r="70"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="26"
                  strokeDasharray="35.2 439.8"
                  strokeDashoffset="-404.6"
                  transform="rotate(-90 100 100)"
                />
                
                {/* Center text */}
                <text x="100" y="95" textAnchor="middle" fill="#ffffff" fontSize="18" fontWeight="800" fontFamily="sans-serif">
                  847h
                </text>
                <text x="100" y="112" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">
                  TOTAL PLAY
                </text>
              </svg>
            </div>

            {/* Legend & Details */}
            <div className="pie-legend-list">
              {mostPlayedGames.map((game) => (
                <div key={game.name} className="pie-legend-row">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="pie-legend-dot" style={{ background: game.color, boxShadow: `0 0 8px ${game.color}` }} />
                    <span className="pie-game-name">{game.name}</span>
                  </div>
                  <div className="pie-stats-meta">
                    <span className="pie-hours">{game.hours} hrs</span>
                    <span className="pie-pct-chip" style={{ color: game.color, borderColor: game.color }}>{game.pct}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* 4. Stream Framerate Stability & Node Latency */}
      <div className="analytics-charts-grid">
        {/* Framerate Consistency Timeline */}
        <div className="analytics-chart-card">
          <div className="chart-card-header">
            <div>
              <h3 className="chart-card-title">Stream Framerate Stability (Last 60 Seconds)</h3>
              <p className="chart-card-sub">Dynamic adaptive WebRTC stream target: 120 FPS</p>
            </div>
            <div className="chart-legend">
              <span className="legend-dot target" /> <span>120 FPS Target</span>
              <span className="legend-dot actual" /> <span>Actual Stream</span>
            </div>
          </div>

          <div className="svg-chart-container">
            <svg viewBox="0 0 700 160" className="telemetry-svg">
              <defs>
                <linearGradient id="fpsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="30" x2="700" y2="30" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
              <line x1="0" y1="70" x2="700" y2="70" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
              <line x1="0" y1="110" x2="700" y2="110" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
              
              {/* Target 120 FPS Reference Line */}
              <line x1="0" y1="30" x2="700" y2="30" stroke="rgba(34, 211, 238, 0.4)" strokeWidth="1.5" />

              {/* Area Fill */}
              <path
                d="M 0,35 Q 80,32 140,36 T 280,33 T 420,38 T 560,34 T 700,35 L 700,150 L 0,150 Z"
                fill="url(#fpsGradient)"
              />

              {/* Actual FPS Line */}
              <path
                d="M 0,35 Q 80,32 140,36 T 280,33 T 420,38 T 560,34 T 700,35"
                fill="none"
                stroke="#00f0ff"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Data Point Glow Dots */}
              <circle cx="280" cy="33" r="4" fill="#00f0ff" filter="drop-shadow(0 0 6px #00f0ff)" />
              <circle cx="560" cy="34" r="4" fill="#00f0ff" filter="drop-shadow(0 0 6px #00f0ff)" />
            </svg>
          </div>

          <div className="chart-footer-metrics">
            <span className="metric-pill">Min: <strong>94 FPS</strong></span>
            <span className="metric-pill">Avg: <strong>118.4 FPS</strong></span>
            <span className="metric-pill">Max: <strong>120 FPS</strong></span>
            <span className="metric-pill green">Frame Drop: <strong>0.00%</strong></span>
          </div>
        </div>

        {/* Cloud Edge Node Latency & Health */}
        <div className="analytics-chart-card">
          <div className="chart-card-header">
            <div>
              <h3 className="chart-card-title">Edge Node Infrastructure Latency</h3>
              <p className="chart-card-sub">Active regional cluster routing & hardware health</p>
            </div>
            <div className="node-active-count">
              <span className="node-status-dot" /> 3 Nodes Synchronized
            </div>
          </div>

          <div className="node-latency-list">
            <div className="node-latency-row">
              <div className="node-row-info">
                <span className="node-flag">🇸🇬 SG-01 (Singapore)</span>
                <span className="node-sub">RTX 4090 • NVLink 4.0</span>
              </div>
              <div className="node-bar-track">
                <div className="node-bar-fill sg" style={{ width: '22%' }} />
              </div>
              <span className="node-ms-val">3.8 ms</span>
            </div>

            <div className="node-latency-row">
              <div className="node-row-info">
                <span className="node-flag">🇮🇩 JK-01 (Jakarta)</span>
                <span className="node-sub">RTX 4080 • Direct Fiber</span>
              </div>
              <div className="node-bar-track">
                <div className="node-bar-fill jk" style={{ width: '14%' }} />
              </div>
              <span className="node-ms-val ultra">2.1 ms</span>
            </div>

            <div className="node-latency-row">
              <div className="node-row-info">
                <span className="node-flag">🇯🇵 TY-01 (Tokyo)</span>
                <span className="node-sub">H100 NVLink • Supercloud</span>
              </div>
              <div className="node-bar-track">
                <div className="node-bar-fill ty" style={{ width: '65%' }} />
              </div>
              <span className="node-ms-val">28.0 ms</span>
            </div>
          </div>

          <div className="node-summary-pills">
            <span className="summary-pill"><Wifi style={{ width: 12, height: 12 }} /> Direct Peering</span>
            <span className="summary-pill"><Cpu style={{ width: 12, height: 12 }} /> GPU Kernel: 100% Lock</span>
            <span className="summary-pill"><HardDrive style={{ width: 12, height: 12 }} /> NVMe Tier: 7,200 MB/s</span>
          </div>
        </div>
      </div>

      {/* 5. Game Performance Insights Grid */}
      <div className="insights-panel">
        <div className="insights-panel-header">
          <div>
            <h3 className="panel-title">Game-Specific Performance Telemetry</h3>
            <p className="panel-sub">Verified benchmarks across active Steam cloud gaming titles.</p>
          </div>
        </div>

        <div className="insights-grid">
          {gameInsights.map(g => (
            <div key={g.game} className="insight-card">
              <div className="insight-top">
                <div className="insight-icon-box">{g.icon}</div>
                <span className="insight-game">{g.game}</span>
              </div>
              <p className="insight-stat">{g.stat}</p>
              <p className="insight-val">{g.value}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
