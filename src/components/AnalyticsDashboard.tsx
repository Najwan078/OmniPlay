import { useState, useRef, useEffect } from 'react';
import {
  Download, ChevronDown, FileText, FileJson, Zap, Activity,
  Clock, Flame, Trophy, Target, Crosshair, Gauge, BarChart3, Check
} from 'lucide-react';

export default function AnalyticsDashboard() {
  const [exportOpen, setExportOpen] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setExportOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleExport = (type: 'PDF' | 'JSON') => {
    setExportOpen(false);
    setExportNotice(`Exported analytics report as ${type}`);

    // Trigger download simulation or fetch from backend
    if (type === 'JSON') {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
        platform: "OmniPlay Cloud Computing",
        report: "Performance Analytics",
        totalPlaytime: "847 hrs",
        averageFPS: 118,
        inputLatency: "4.2 ms",
        exportedAt: new Date().toISOString()
      }, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", "omniplay_analytics.json");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } else {
      // PDF download mock
      const blob = new Blob(["%PDF-1.4 Mock OmniPlay Analytics Report"], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "omniplay_analytics.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
    }

    setTimeout(() => {
      setExportNotice(null);
    }, 3500);
  };

  const gameInsights = [
    { game: 'Forza Horizon 5', stat: 'Best Lap Time', value: '1:32.458', icon: <Gauge style={{ width: 16, height: 16, color: 'var(--neon-rose)' }} /> },
    { game: 'Helldivers 2', stat: 'Headshot %', value: '34.2%', icon: <Crosshair style={{ width: 16, height: 16, color: 'var(--neon-amber)' }} /> },
    { game: 'Black Myth: Wukong', stat: 'Bosses Defeated', value: '12 / 28', icon: <Trophy style={{ width: 16, height: 16, color: 'var(--neon-cyan)' }} /> },
    { game: 'Cyberpunk 2077', stat: 'Missions Complete', value: '47 / 65', icon: <Target style={{ width: 16, height: 16, color: 'var(--neon-blue-glow)' }} /> },
    { game: 'EA FC 25', stat: 'FUT Win Rate', value: '68.5%', icon: <Trophy style={{ width: 16, height: 16, color: 'var(--neon-emerald)' }} /> },
    { game: 'Elden Ring', stat: 'Deaths Recorded', value: '247', icon: <Flame style={{ width: 16, height: 16, color: 'var(--neon-rose)' }} /> },
  ];

  return (
    <div className="analytics-page-wrap">

      {/* Analytics Header with STRICT SINGLE EXPORT BUTTON RULE */}
      <header className="analytics-header">
        <div>
          <h1 className="analytics-title">Performance Analytics</h1>
          <p className="analytics-sub">Deep telemetry, framerate distributions, and session metrics.</p>
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
                <FileText style={{ width: 16, height: 16, color: 'var(--neon-rose)' }} />
                <span>PDF</span>
              </button>
              <button
                onClick={() => handleExport('JSON')}
                className="export-option-item"
                type="button"
              >
                <FileJson style={{ width: 16, height: 16, color: 'var(--neon-cyan)' }} />
                <span>JSON</span>
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
      </header>

      {/* Metric Cards Row */}
      <div className="analytics-kpi-grid">
        <div className="analytics-kpi-card">
          <div className="kpi-header">
            <Clock style={{ width: 16, height: 16, color: 'var(--text-muted)' }} />
            <span className="kpi-tag">TOTAL PLAYTIME</span>
          </div>
          <p className="kpi-value">847 <span className="unit">hrs</span></p>
          <p className="kpi-sub green">↑ 12% vs last month</p>
        </div>

        <div className="analytics-kpi-card">
          <div className="kpi-header">
            <Zap style={{ width: 16, height: 16, color: 'var(--neon-cyan)' }} />
            <span className="kpi-tag">AVG STREAM FPS</span>
          </div>
          <p className="kpi-value" style={{ color: 'var(--neon-cyan)' }}>118 <span className="unit">fps</span></p>
          <p className="kpi-sub">1% Low: 94 fps (Stable)</p>
        </div>

        <div className="analytics-kpi-card">
          <div className="kpi-header">
            <Activity style={{ width: 16, height: 16, color: 'var(--neon-emerald)' }} />
            <span className="kpi-tag">INPUT LATENCY</span>
          </div>
          <p className="kpi-value" style={{ color: 'var(--neon-emerald)' }}>4.2 <span className="unit">ms</span></p>
          <p className="kpi-sub">End-to-End Cloud WebRTC</p>
        </div>

        <div className="analytics-kpi-card">
          <div className="kpi-header">
            <BarChart3 style={{ width: 16, height: 16, color: 'var(--neon-blue-glow)' }} />
            <span className="kpi-tag">BANDWIDTH USAGE</span>
          </div>
          <p className="kpi-value">48.5 <span className="unit">Mbps</span></p>
          <p className="kpi-sub">AV1 Codec Hardware-Accelerated</p>
        </div>
      </div>

      {/* Game Telemetry Insights */}
      <div className="insights-panel">
        <h3 className="panel-title">Game-Specific Performance Insights</h3>
        <div className="insights-grid">
          {gameInsights.map(g => (
            <div key={g.game} className="insight-card">
              <div className="insight-top">
                <div className="insight-icon">{g.icon}</div>
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
