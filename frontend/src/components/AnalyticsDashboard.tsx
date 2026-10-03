import { useState, useRef, useEffect, useMemo } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { 
  Download, ChevronDown, FileText, FileJson, Zap, Activity, 
  Clock, Trophy, Target, Crosshair, Gauge, BarChart3, Check,
  Wifi, ShieldCheck, Cpu, HardDrive, PieChart as PieIcon, Flame
} from 'lucide-react';

interface GameShare {
  name: string;
  pct: number;
  color: string;
  hours: string | number;
}

interface NodeLatency {
  id: string;
  name: string;
  flag: string;
  sub: string;
  latency: string;
  latencyVal: number;
  width: string;
  className: string;
  background?: string;
  isUltra?: boolean;
}

interface GameInsightItem {
  game: string;
  stat: string;
  value: string;
  iconType: 'activity' | 'gauge' | 'crosshair' | 'trophy' | 'trophy-green' | 'target';
}

interface TelemetryDataset {
  kpis: {
    totalPlaytime: string;
    totalPlaytimeUnit: string;
    playtimeTrend: string;
    avgFps: number;
    fpsLow: string;
    latency: number;
    latencySub: string;
    bandwidth: number;
    bandwidthSub: string;
  };
  games: GameShare[];
  fpsChart: {
    min: string;
    avg: string;
    max: string;
    frameDrop: string;
    pathArea: string;
    pathLine: string;
    dots: { cx: number; cy: number }[];
  };
  nodes: NodeLatency[];
  insights: GameInsightItem[];
}

export default function AnalyticsDashboard() {
  const [exportOpen, setExportOpen] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const analyticsContainerRef = useRef<HTMLDivElement>(null);

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

  // Comprehensive Telemetry Datasets for 24H, 7D, and 30D
  const telemetryDatasets: Record<'24h' | '7d' | '30d', TelemetryDataset> = useMemo(() => ({
    '24h': {
      kpis: {
        totalPlaytime: '18.5',
        totalPlaytimeUnit: 'hrs',
        playtimeTrend: '↑ +2.4 hrs vs yesterday',
        avgFps: 119,
        fpsLow: '1% Low: 104 fps (Ultra Smooth)',
        latency: 3.2,
        latencySub: 'Sub 3.5ms Direct Tunnel',
        bandwidth: 52.4,
        bandwidthSub: 'Peak: 64.2 Mbps • AV1 Codec',
      },
      games: [
        { name: 'EA SPORTS FC™ 25', pct: 39, color: '#00f0ff', hours: '7.2' },
        { name: 'Valorant', pct: 28, color: '#10b981', hours: '5.2' },
        { name: 'Cyberpunk 2077', pct: 18, color: '#3b82f6', hours: '3.3' },
        { name: 'Black Myth: Wukong', pct: 10, color: '#8b5cf6', hours: '1.8' },
        { name: "Baldur's Gate 3", pct: 5, color: '#f59e0b', hours: '1.0' },
      ],
      fpsChart: {
        min: '112 FPS',
        avg: '119.2 FPS',
        max: '120 FPS',
        frameDrop: '0.00%',
        pathArea: 'M 0,33 Q 70,30 140,32 T 280,31 T 420,33 T 560,31 T 700,32 L 700,150 L 0,150 Z',
        pathLine: 'M 0,33 Q 70,30 140,32 T 280,31 T 420,33 T 560,31 T 700,32',
        dots: [{ cx: 280, cy: 31 }, { cx: 560, cy: 31 }],
      },
      nodes: [
        { id: 'JK-01', name: 'JK-01 (Jakarta)', flag: '🇮🇩', sub: 'RTX 4070 Ti • Direct Fiber', latency: '1.9 ms', latencyVal: 1.9, width: '13%', className: 'jk', isUltra: true },
        { id: 'SG-01', name: 'SG-01 (Singapore)', flag: '🇸🇬', sub: 'RTX 4080 • Equinix Direct', latency: '3.4 ms', latencyVal: 3.4, width: '18%', className: 'sg' },
        { id: 'US-01', name: 'US-01 (California)', flag: '🇺🇸', sub: 'RTX 4090 • Silicon Hub', latency: '9.2 ms', latencyVal: 9.2, width: '28%', className: 'us', background: 'linear-gradient(90deg, #3b82f6, #00f0ff)' },
        { id: 'EU-02', name: 'EU-02 (Frankfurt)', flag: '🇩🇪', sub: 'RTX 4080 Super • DE-CIX Telehouse', latency: '11.6 ms', latencyVal: 11.6, width: '36%', className: 'fra', background: 'linear-gradient(90deg, #10b981, #00f0ff)' },
        { id: 'EU-01', name: 'EU-01 (London)', flag: '🇬🇧', sub: 'RTX 4090 • LINX Direct', latency: '14.0 ms', latencyVal: 14.0, width: '40%', className: 'ld', background: 'linear-gradient(90deg, #8b5cf6, #3b82f6)' },
        { id: 'TY-01', name: 'TY-01 (Tokyo)', flag: '🇯🇵', sub: 'RTX 4090 • Trans Pacific', latency: '21.2 ms', latencyVal: 21.2, width: '52%', className: 'ty' },
      ],
      insights: [
        { game: 'Valorant', stat: 'Esports Reflex Latency', value: '1.9 ms (JK-01)', iconType: 'activity' },
        { game: 'Forza Horizon 5', stat: 'Session Lap Record', value: '1:31.890', iconType: 'gauge' },
        { game: 'Helldivers 2', stat: 'Headshot Accuracy', value: '36.8%', iconType: 'crosshair' },
        { game: 'Black Myth: Wukong', stat: 'Bosses Cleared', value: '2 / 28 Today', iconType: 'trophy' },
        { game: 'Cyberpunk 2077', stat: 'Path Tracing Lock', value: '100% Stability', iconType: 'target' },
        { game: 'EA FC 25', stat: 'FUT Win Rate', value: '72.0%', iconType: 'trophy-green' },
      ],
    },
    '7d': {
      kpis: {
        totalPlaytime: '142',
        totalPlaytimeUnit: 'hrs',
        playtimeTrend: '↑ 8.4% vs previous week',
        avgFps: 117,
        fpsLow: '1% Low: 96 fps (Optimal)',
        latency: 3.6,
        latencySub: 'Sub 4ms Cloud WebRTC Pipeline',
        bandwidth: 49.8,
        bandwidthSub: 'Average Stream Bitrate',
      },
      games: [
        { name: 'EA SPORTS FC™ 25', pct: 36, color: '#00f0ff', hours: '51' },
        { name: 'Cyberpunk 2077', pct: 26, color: '#3b82f6', hours: '37' },
        { name: 'Valorant', pct: 20, color: '#10b981', hours: '29' },
        { name: 'Black Myth: Wukong', pct: 11, color: '#8b5cf6', hours: '16' },
        { name: "Baldur's Gate 3", pct: 7, color: '#f59e0b', hours: '9' },
      ],
      fpsChart: {
        min: '96 FPS',
        avg: '117.6 FPS',
        max: '120 FPS',
        frameDrop: '0.01%',
        pathArea: 'M 0,36 Q 80,42 160,34 T 320,40 T 480,33 T 600,38 T 700,35 L 700,150 L 0,150 Z',
        pathLine: 'M 0,36 Q 80,42 160,34 T 320,40 T 480,33 T 600,38 T 700,35',
        dots: [{ cx: 160, cy: 34 }, { cx: 480, cy: 33 }],
      },
      nodes: [
        { id: 'JK-01', name: 'JK-01 (Jakarta)', flag: '🇮🇩', sub: 'RTX 4070 Ti • Direct Fiber', latency: '2.0 ms', latencyVal: 2.0, width: '13.5%', className: 'jk', isUltra: true },
        { id: 'SG-01', name: 'SG-01 (Singapore)', flag: '🇸🇬', sub: 'RTX 4080 • Equinix Direct', latency: '3.6 ms', latencyVal: 3.6, width: '19%', className: 'sg' },
        { id: 'US-01', name: 'US-01 (California)', flag: '🇺🇸', sub: 'RTX 4090 • Silicon Hub', latency: '9.6 ms', latencyVal: 9.6, width: '29%', className: 'us', background: 'linear-gradient(90deg, #3b82f6, #00f0ff)' },
        { id: 'EU-02', name: 'EU-02 (Frankfurt)', flag: '🇩🇪', sub: 'RTX 4080 Super • DE-CIX Telehouse', latency: '12.0 ms', latencyVal: 12.0, width: '37%', className: 'fra', background: 'linear-gradient(90deg, #10b981, #00f0ff)' },
        { id: 'EU-01', name: 'EU-01 (London)', flag: '🇬🇧', sub: 'RTX 4090 • LINX Direct', latency: '14.3 ms', latencyVal: 14.3, width: '41%', className: 'ld', background: 'linear-gradient(90deg, #8b5cf6, #3b82f6)' },
        { id: 'TY-01', name: 'TY-01 (Tokyo)', flag: '🇯🇵', sub: 'RTX 4090 • Trans Pacific', latency: '21.8 ms', latencyVal: 21.8, width: '54%', className: 'ty' },
      ],
      insights: [
        { game: 'Valorant', stat: 'Weekly Reflex Average', value: '2.0 ms (JK-01)', iconType: 'activity' },
        { game: 'Forza Horizon 5', stat: 'Fastest Weekly Lap', value: '1:32.102', iconType: 'gauge' },
        { game: 'Helldivers 2', stat: 'Headshot Accuracy', value: '35.4%', iconType: 'crosshair' },
        { game: 'Black Myth: Wukong', stat: 'Bosses Cleared', value: '5 / 28 This Week', iconType: 'trophy' },
        { game: 'Cyberpunk 2077', stat: 'Ray Tracing Stability', value: '99.9% Uptime', iconType: 'target' },
        { game: 'EA FC 25', stat: 'FUT Division Rank', value: 'Division 1 (69.2% WR)', iconType: 'trophy-green' },
      ],
    },
    '30d': {
      kpis: {
        totalPlaytime: '847',
        totalPlaytimeUnit: 'hrs',
        playtimeTrend: '↑ 12% vs last month',
        avgFps: 118,
        fpsLow: '1% Low: 94 fps (Rock Solid)',
        latency: 3.8,
        latencySub: 'Sub 4ms Cloud WebRTC Pipeline',
        bandwidth: 48.5,
        bandwidthSub: 'AV1 Codec Hardware Accelerated',
      },
      games: [
        { name: 'EA SPORTS FC™ 25', pct: 34, color: '#00f0ff', hours: '288' },
        { name: 'Cyberpunk 2077', pct: 26, color: '#3b82f6', hours: '220' },
        { name: 'Valorant', pct: 20, color: '#10b981', hours: '170' },
        { name: 'Black Myth: Wukong', pct: 12, color: '#8b5cf6', hours: '101' },
        { name: "Baldur's Gate 3", pct: 8, color: '#f59e0b', hours: '68' },
      ],
      fpsChart: {
        min: '94 FPS',
        avg: '118.4 FPS',
        max: '120 FPS',
        frameDrop: '0.02%',
        pathArea: 'M 0,35 Q 80,32 140,36 T 280,33 T 420,38 T 560,34 T 700,35 L 700,150 L 0,150 Z',
        pathLine: 'M 0,35 Q 80,32 140,36 T 280,33 T 420,38 T 560,34 T 700,35',
        dots: [{ cx: 280, cy: 33 }, { cx: 560, cy: 34 }],
      },
      nodes: [
        { id: 'JK-01', name: 'JK-01 (Jakarta)', flag: '🇮🇩', sub: 'RTX 4070 Ti • Direct Fiber', latency: '2.1 ms', latencyVal: 2.1, width: '14%', className: 'jk', isUltra: true },
        { id: 'SG-01', name: 'SG-01 (Singapore)', flag: '🇸🇬', sub: 'RTX 4080 • Equinix Direct', latency: '3.8 ms', latencyVal: 3.8, width: '20%', className: 'sg' },
        { id: 'US-01', name: 'US-01 (California)', flag: '🇺🇸', sub: 'RTX 4090 • Silicon Hub', latency: '9.8 ms', latencyVal: 9.8, width: '30%', className: 'us', background: 'linear-gradient(90deg, #3b82f6, #00f0ff)' },
        { id: 'EU-02', name: 'EU-02 (Frankfurt)', flag: '🇩🇪', sub: 'RTX 4080 Super • DE-CIX Telehouse', latency: '12.2 ms', latencyVal: 12.2, width: '38%', className: 'fra', background: 'linear-gradient(90deg, #10b981, #00f0ff)' },
        { id: 'EU-01', name: 'EU-01 (London)', flag: '🇬🇧', sub: 'RTX 4090 • LINX Direct', latency: '14.5 ms', latencyVal: 14.5, width: '42%', className: 'ld', background: 'linear-gradient(90deg, #8b5cf6, #3b82f6)' },
        { id: 'TY-01', name: 'TY-01 (Tokyo)', flag: '🇯🇵', sub: 'RTX 4090 • Trans Pacific', latency: '22.0 ms', latencyVal: 22.0, width: '55%', className: 'ty' },
      ],
      insights: [
        { game: 'Valorant', stat: 'Reflex Esports Latency', value: '2.1 ms (JK-01)', iconType: 'activity' },
        { game: 'Forza Horizon 5', stat: 'Best Lap Time', value: '1:32.458', iconType: 'gauge' },
        { game: 'Helldivers 2', stat: 'Headshot Accuracy', value: '34.2%', iconType: 'crosshair' },
        { game: 'Black Myth: Wukong', stat: 'Bosses Defeated', value: '12 / 28', iconType: 'trophy' },
        { game: 'Cyberpunk 2077', stat: 'Path Tracing Stability', value: '99.8% (SG-01)', iconType: 'target' },
        { game: 'EA FC 25', stat: 'FUT Win Rate', value: '68.5%', iconType: 'trophy-green' },
      ],
    },
  }), []);

  const currentData = telemetryDatasets[timeRange];

  // Export handler - strictly respects single Export button rule
  const handleExport = async (type: 'PDF' | 'JSON') => {
    setExportOpen(false);
    setExportNotice(`Exporting analytics report (${timeRange.toUpperCase()}) as ${type}...`);
    
    try {
      const res = await fetch(`/api/export?format=${type.toLowerCase()}&timeRange=${timeRange}`);
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `omniplay_analytics_${timeRange}.${type.toLowerCase()}`;
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
          report: "Cloud Performance Analytics & Telemetry Audit",
          timeRange: timeRange.toUpperCase(),
          totalPlaytime: `${currentData.kpis.totalPlaytime} ${currentData.kpis.totalPlaytimeUnit}`,
          averageFPS: currentData.kpis.avgFps,
          inputLatency: `${currentData.kpis.latency} ms`,
          bandwidth: `${currentData.kpis.bandwidth} Mbps`,
          gameDistribution: currentData.games.map(g => ({
            game: g.name,
            share: `${g.pct}%`,
            hours: g.hours
          })),
          nodes: currentData.nodes.map(n => ({
            id: n.id,
            name: n.name,
            latency: n.latency,
            spec: n.sub
          })),
          exportedAt: new Date().toISOString()
        }, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `omniplay_analytics_${timeRange}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
      } else {
        const blob = new Blob([
          `%PDF-1.4 OmniPlay Cloud Computing Analytics Audit Report (${timeRange.toUpperCase()})\n` +
          `Total Playtime: ${currentData.kpis.totalPlaytime} ${currentData.kpis.totalPlaytimeUnit}\n` +
          `Average Framerate: ${currentData.kpis.avgFps} FPS\n` +
          `Input Latency: ${currentData.kpis.latency} ms\n` +
          `Generated via OmniPlay Client Engine`
        ], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `omniplay_analytics_${timeRange}.pdf`;
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

  // Heatmap configuration
  const heatmapDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const heatmapHours = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22];
  const intensityClasses = ['idle', 'low', 'med', 'high', 'peak'] as const;
  const intensityLabels = ['Idle (0)', 'Low (1)', 'Moderate (2)', 'High (3)', 'Peak (4)'] as const;

  // Dynamic Heatmap Matrices reflecting 24H, 7D, and 30D usage patterns
  const heatmapMatrices: Record<'24h' | '7d' | '30d', number[][]> = useMemo(() => ({
    '24h': [
      [0, 0, 0, 0, 1, 2, 2, 1, 2, 4, 4, 3], // Today: active peak hours
      [0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 3, 2],
      [0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 3, 1],
      [0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 2, 1],
      [0, 0, 0, 0, 1, 1, 2, 2, 3, 4, 4, 3],
      [1, 0, 0, 0, 1, 2, 3, 3, 3, 4, 4, 3],
      [1, 0, 0, 0, 1, 2, 2, 2, 3, 4, 4, 2],
    ],
    '7d': [
      [0, 0, 0, 0, 1, 2, 2, 2, 2, 4, 4, 3],
      [0, 0, 0, 0, 1, 2, 2, 2, 3, 3, 4, 3],
      [0, 0, 0, 0, 1, 1, 2, 2, 2, 4, 4, 2],
      [0, 0, 0, 0, 1, 2, 2, 3, 3, 4, 4, 3],
      [0, 0, 0, 0, 1, 2, 3, 3, 4, 4, 4, 4],
      [1, 0, 0, 0, 1, 2, 3, 3, 4, 4, 4, 4],
      [1, 0, 0, 0, 1, 2, 3, 2, 3, 4, 4, 3],
    ],
    '30d': [
      [1, 0, 0, 0, 1, 2, 3, 2, 3, 4, 4, 3],
      [1, 0, 0, 0, 1, 3, 3, 2, 3, 4, 4, 3],
      [0, 0, 0, 0, 1, 2, 3, 2, 3, 4, 4, 3],
      [0, 0, 0, 0, 1, 2, 3, 3, 3, 4, 4, 3],
      [1, 0, 0, 0, 1, 3, 3, 3, 4, 4, 4, 4],
      [2, 0, 0, 0, 2, 3, 3, 3, 4, 4, 4, 4],
      [1, 0, 0, 0, 2, 3, 3, 3, 4, 4, 4, 3],
    ],
  }), []);

  const activeHeatmap = heatmapMatrices[timeRange];

  // Dynamic SVG Donut Calculations for Segments
  const CIRCUMFERENCE = 2 * Math.PI * 70; // ≈ 439.82
  const donutSlices = useMemo(() => {
    let accumulatedPct = 0;
    return currentData.games.map(game => {
      const sliceLength = (game.pct / 100) * CIRCUMFERENCE;
      const strokeDasharray = `${sliceLength} ${CIRCUMFERENCE}`;
      const strokeDashoffset = -((accumulatedPct / 100) * CIRCUMFERENCE);
      accumulatedPct += game.pct;
      return {
        ...game,
        strokeDasharray,
        strokeDashoffset,
      };
    });
  }, [currentData.games, CIRCUMFERENCE]);

  // Initial Page Mount Animation
  useGSAP(() => {
    if (analyticsContainerRef.current) {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from('.analytics-header', { opacity: 0, y: 14, duration: 0.4 })
        .from('.analytics-kpi-card', { opacity: 0, y: 12, stagger: 0.06, duration: 0.35 }, '-=0.25')
        .from('.analytics-chart-card, .insights-panel', { opacity: 0, y: 14, stagger: 0.05, duration: 0.35 }, '-=0.2');
    }
  }, { scope: analyticsContainerRef });

  // Interactive Time Range Switch Transition (GSAP)
  useGSAP(() => {
    if (analyticsContainerRef.current) {
      gsap.fromTo('.analytics-kpi-card', 
        { y: 5, opacity: 0.8 }, 
        { y: 0, opacity: 1, duration: 0.28, stagger: 0.04, ease: 'power2.out', clearProps: 'all' }
      );
      gsap.fromTo('.pie-donut-svg', 
        { scale: 0.94, rotate: -6 }, 
        { scale: 1, rotate: 0, duration: 0.35, ease: 'back.out(1.5)', clearProps: 'all' }
      );
      gsap.fromTo('.telemetry-svg', 
        { opacity: 0.75, y: 3 }, 
        { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out', clearProps: 'all' }
      );
      gsap.fromTo('.heat-cell',
        { scale: 0.75, opacity: 0.6 },
        { scale: 1, opacity: 1, duration: 0.22, stagger: { amount: 0.15, from: 'center' }, ease: 'power1.out', clearProps: 'all' }
      );
    }
  }, [timeRange]);

  const renderInsightIcon = (type: GameInsightItem['iconType']) => {
    switch (type) {
      case 'activity':
        return <Activity style={{ width: 16, height: 16, color: 'var(--neon-cyan)' }} />;
      case 'gauge':
        return <Gauge style={{ width: 16, height: 16, color: 'var(--neon-amber)' }} />;
      case 'crosshair':
        return <Crosshair style={{ width: 16, height: 16, color: 'var(--neon-cyan)' }} />;
      case 'trophy':
        return <Trophy style={{ width: 16, height: 16, color: 'var(--neon-purple)' }} />;
      case 'trophy-green':
        return <Trophy style={{ width: 16, height: 16, color: 'var(--neon-emerald)' }} />;
      case 'target':
      default:
        return <Target style={{ width: 16, height: 16, color: 'var(--neon-blue)' }} />;
    }
  };

  return (
    <div ref={analyticsContainerRef} className="analytics-page-wrap">
      
      {/* 1. Analytics Header with Interactive Time Pills & Strict Single Export Button */}
      <header className="analytics-header">
        <div className="analytics-header-titles">
          <div className="analytics-badge">
            <ShieldCheck style={{ width: 14, height: 14 }} />
            <span>CLOUD PERFORMANCE & TELEMETRY</span>
          </div>
          <h1 className="analytics-title">Cloud Performance Analytics</h1>
          <p className="analytics-sub">Playtime metrics, FPS stability, network latency, and cloud instance telemetry.</p>
        </div>

        <div className="analytics-header-actions">
          {/* Interactive Time Filter Pills */}
          <div className="analytics-time-pills">
            {(['24h', '7d', '30d'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTimeRange(t)}
                className={`time-pill ${timeRange === t ? 'active' : ''}`}
                type="button"
                aria-pressed={timeRange === t}
                aria-label={`View ${t.toUpperCase()} telemetry data`}
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

      {/* 2. Key Performance Indicators (KPI) Grid - Fully Reactive */}
      <div className="analytics-kpi-grid">
        <div className="analytics-kpi-card">
          <div className="kpi-header">
            <span className="kpi-tag">TOTAL PLAYTIME</span>
            <Clock style={{ width: 16, height: 16, color: 'var(--text-muted)' }} />
          </div>
          <p className="kpi-value">{currentData.kpis.totalPlaytime} <span className="unit">{currentData.kpis.totalPlaytimeUnit}</span></p>
          <p className="kpi-sub green">{currentData.kpis.playtimeTrend}</p>
        </div>

        <div className="analytics-kpi-card">
          <div className="kpi-header">
            <span className="kpi-tag">AVERAGE FPS</span>
            <Zap style={{ width: 16, height: 16, color: 'var(--neon-cyan)' }} />
          </div>
          <p className="kpi-value cyan">{currentData.kpis.avgFps} <span className="unit">fps</span></p>
          <p className="kpi-sub">{currentData.kpis.fpsLow}</p>
        </div>

        <div className="analytics-kpi-card">
          <div className="kpi-header">
            <span className="kpi-tag">INPUT LATENCY</span>
            <Activity style={{ width: 16, height: 16, color: 'var(--neon-emerald)' }} />
          </div>
          <p className="kpi-value emerald">{currentData.kpis.latency} <span className="unit">ms</span></p>
          <p className="kpi-sub">{currentData.kpis.latencySub}</p>
        </div>

        <div className="analytics-kpi-card">
          <div className="kpi-header">
            <span className="kpi-tag">BANDWIDTH USAGE</span>
            <BarChart3 style={{ width: 16, height: 16, color: 'var(--neon-purple)' }} />
          </div>
          <p className="kpi-value purple">{currentData.kpis.bandwidth} <span className="unit">Mbps</span></p>
          <p className="kpi-sub">{currentData.kpis.bandwidthSub}</p>
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
                <h3 className="chart-card-title">Player Activity Heatmap</h3>
                <p className="chart-card-sub">Active concurrent players by day and hour</p>
              </div>
            </div>
            <div className="heatmap-legend">
              <span className="heat-cell-sample idle" /> <span>0: Idle</span>
              <span className="heat-cell-sample low" /> <span>1: Low</span>
              <span className="heat-cell-sample med" /> <span>2: Moderate</span>
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
                {activeHeatmap.map((dayRow, dayIdx) => {
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
                <h3 className="chart-card-title">Most Played Game Distribution</h3>
                <p className="chart-card-sub">Percentage of playtime across cloud nodes</p>
              </div>
            </div>
            <span className="chart-badge-tag">Total: {currentData.kpis.totalPlaytime} hrs</span>
          </div>

          <div className="pie-chart-content-row">
            {/* SVG Donut Chart - Dynamically Computed */}
            <div className="pie-svg-wrap">
              <svg viewBox="0 0 200 200" className="pie-donut-svg">
                {/* Background Track */}
                <circle cx="100" cy="100" r="70" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="26" />
                
                {/* Dynamic Slices */}
                {donutSlices.map((slice) => (
                  <circle
                    key={slice.name}
                    cx="100"
                    cy="100"
                    r="70"
                    fill="none"
                    stroke={slice.color}
                    strokeWidth="26"
                    strokeDasharray={slice.strokeDasharray}
                    strokeDashoffset={slice.strokeDashoffset}
                    transform="rotate(-90 100 100)"
                    style={{ transition: 'stroke-dasharray 0.4s ease, stroke-dashoffset 0.4s ease' }}
                  />
                ))}
                
                {/* Center text */}
                <text x="100" y="95" textAnchor="middle" fill="#ffffff" fontSize="18" fontWeight="800" fontFamily="sans-serif">
                  {currentData.kpis.totalPlaytime}h
                </text>
                <text x="100" y="112" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="700" letterSpacing="0.5" fontFamily="sans-serif">
                  TOTAL PLAYTIME
                </text>
              </svg>
            </div>

            {/* Legend & Details */}
            <div className="pie-legend-list">
              {currentData.games.map((game) => (
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
              <h3 className="chart-card-title">Streaming FPS Stability (Live Telemetry)</h3>
              <p className="chart-card-sub">Target framerate baseline: 120 FPS</p>
            </div>
            <div className="chart-legend">
              <span className="legend-dot target" /> <span>Target 120 FPS</span>
              <span className="legend-dot actual" /> <span>Current FPS</span>
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
                d={currentData.fpsChart.pathArea}
                fill="url(#fpsGradient)"
                style={{ transition: 'd 0.4s ease' }}
              />

              {/* Actual FPS Line */}
              <path
                d={currentData.fpsChart.pathLine}
                fill="none"
                stroke="#00f0ff"
                strokeWidth="2.5"
                strokeLinecap="round"
                style={{ transition: 'd 0.4s ease' }}
              />

              {/* Data Point Glow Dots */}
              {currentData.fpsChart.dots.map((dot, idx) => (
                <circle 
                  key={idx}
                  cx={dot.cx} 
                  cy={dot.cy} 
                  r="4" 
                  fill="#00f0ff" 
                  filter="drop-shadow(0 0 6px #00f0ff)" 
                />
              ))}
            </svg>
          </div>

          <div className="chart-footer-metrics">
            <span className="metric-pill">Min: <strong>{currentData.fpsChart.min}</strong></span>
            <span className="metric-pill">Avg: <strong>{currentData.fpsChart.avg}</strong></span>
            <span className="metric-pill">Max: <strong>{currentData.fpsChart.max}</strong></span>
            <span className="metric-pill green">Frame Drop: <strong>{currentData.fpsChart.frameDrop}</strong></span>
          </div>
        </div>

        {/* Cloud Edge Node Latency & Health */}
        <div className="analytics-chart-card">
          <div className="chart-card-header">
            <div>
              <h3 className="chart-card-title">Edge Node Server Latency</h3>
              <p className="chart-card-sub">Round trip response times across global regions</p>
            </div>
            <div className="node-active-count">
              <span className="node-status-dot" /> 6 Global Nodes Connected
            </div>
          </div>

          <div className="node-latency-list">
            {currentData.nodes.map(node => (
              <div key={node.id} className="node-latency-row">
                <div className="node-row-info">
                  <span className="node-flag">{node.flag} {node.name}</span>
                  <span className="node-sub">{node.sub}</span>
                </div>
                <div className="node-bar-track">
                  <div 
                    className={`node-bar-fill ${node.className}`} 
                    style={{ 
                      width: node.width,
                      ...(node.background ? { background: node.background } : {})
                    }} 
                  />
                </div>
                <span className={`node-ms-val ${node.isUltra ? 'ultra' : ''}`}>{node.latency}</span>
              </div>
            ))}
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
            <h3 className="panel-title">Per-Game Performance Metrics</h3>
            <p className="panel-sub">Real-time telemetry benchmarks across active cloud instances.</p>
          </div>
        </div>

        <div className="insights-grid">
          {currentData.insights.map(g => (
            <div key={g.game} className="insight-card">
              <div className="insight-top">
                <div className="insight-icon-box">{renderInsightIcon(g.iconType)}</div>
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
