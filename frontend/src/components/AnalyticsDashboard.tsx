import { useState, useRef, useEffect, useMemo } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { 
  Download, ChevronDown, FileText, FileJson, Zap, Activity, 
  Clock, Trophy, Target, Crosshair, Gauge, BarChart3, Check,
  Wifi, ShieldCheck, Cpu, HardDrive, PieChart as PieIcon, Flame,
  DollarSign, TrendingUp, Layers, SlidersHorizontal, ArrowUpRight,
  Shield, CheckCircle2, RotateCcw, AlertCircle, Save
} from 'lucide-react';
import { 
  getFinancialConfig, 
  saveFinancialConfig, 
  resetFinancialConfig,
  runFinancialSimulation, 
  getStandardScenarios,
  getStoredTransactions,
} from '../services/financialModel';
import type { FinancialConfig, SimulationResult, TransactionRecord } from '../services/financialModel';

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
  // Navigation View: 'telemetry' | 'financial' | 'transactions' | 'pricing'
  const [activeSubView, setActiveSubView] = useState<'telemetry' | 'financial' | 'transactions' | 'pricing'>('financial');

  const [exportOpen, setExportOpen] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');
  
  // Financial Simulation State
  const [financialConfig, setFinancialConfig] = useState<FinancialConfig>(() => getFinancialConfig());
  const [selectedUtilization, setSelectedUtilization] = useState<number>(0.75); // Default 75% Base Scenario
  const [pricingEditForm, setPricingEditForm] = useState<FinancialConfig>(() => getFinancialConfig());
  const [configSaveSuccess, setConfigSaveSuccess] = useState(false);

  // Transactions State
  const [transactions, setTransactions] = useState<TransactionRecord[]>(() => getStoredTransactions());
  const [transactionFilter, setTransactionFilter] = useState<'ALL' | 'LIVE' | 'DEMO'>('ALL');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const analyticsContainerRef = useRef<HTMLDivElement>(null);

  // Listen for config & transaction updates
  useEffect(() => {
    const handleConfigUpdate = () => {
      const cfg = getFinancialConfig();
      setFinancialConfig(cfg);
      setPricingEditForm(cfg);
    };
    const handleTxUpdate = () => {
      setTransactions(getStoredTransactions());
    };
    window.addEventListener('omni:financial_config_updated', handleConfigUpdate);
    window.addEventListener('omni:transactions_updated', handleTxUpdate);
    return () => {
      window.removeEventListener('omni:financial_config_updated', handleConfigUpdate);
      window.removeEventListener('omni:transactions_updated', handleTxUpdate);
    };
  }, []);

  // Compute Active Financial Simulation
  const currentSim: SimulationResult = useMemo(() => {
    return runFinancialSimulation(
      financialConfig, 
      selectedUtilization, 
      `Scenario (${Math.round(selectedUtilization * 100)}% Utilization)`
    );
  }, [financialConfig, selectedUtilization]);

  // Standard scenario comparison
  const standardScenarios = useMemo(() => {
    return getStandardScenarios(financialConfig);
  }, [financialConfig]);

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

  const formatIdr = (val: number) => `Rp ${Math.round(val).toLocaleString('id-ID')}`;

  // Export handler - strictly respects single Export button rule
  const handleExport = async (type: 'PDF' | 'JSON') => {
    setExportOpen(false);
    setExportNotice(`Exporting ${activeSubView.toUpperCase()} report as ${type}...`);
    
    if (activeSubView === 'financial' || activeSubView === 'pricing') {
      const reportPayload = {
        platform: "OmniPlay Cloud Computing",
        reportType: "Financial Model & Business Profitability Audit",
        academicNote: "Estimated academic projection based on 12-GPU infrastructure across 6 Cloud Centers",
        initialInvestment: formatIdr(financialConfig.initialInvestment),
        monthlyOpex: formatIdr(currentSim.monthlyOpex),
        utilizationRate: `${(currentSim.utilizationRate * 100).toFixed(1)}%`,
        soldCapacityHours: `${currentSim.soldCapacityHours} hrs / 8,640 hrs`,
        revenue: {
          gaming: formatIdr(currentSim.gamingRevenue),
          compute: formatIdr(currentSim.computeRevenue),
          subscription: formatIdr(currentSim.subscriptionRevenue),
          addons: formatIdr(currentSim.addonRevenue),
          totalMonthly: formatIdr(currentSim.totalMonthlyRevenue),
          annual: formatIdr(currentSim.annualRevenue),
        },
        profitability: {
          operatingProfitMonthly: formatIdr(currentSim.operatingProfit),
          operatingMargin: `${currentSim.operatingMarginPct.toFixed(2)}%`,
          revenuePerGpuHour: formatIdr(currentSim.revenuePerGpuHour),
          breakEvenUtilization: `${currentSim.breakEvenUtilizationPct.toFixed(1)}%`,
          annualOperatingProfit: formatIdr(currentSim.annualOperatingProfit),
        },
        regionalBreakdown: currentSim.regions.map(r => ({
          region: r.location,
          gpu: `${r.gpuCount}x ${r.gpuModel}`,
          revenue: formatIdr(r.totalRevenue),
          opex: formatIdr(r.allocatedOpex),
          profit: formatIdr(r.operatingProfit),
          margin: `${r.marginPct.toFixed(1)}%`,
        })),
        generatedAt: new Date().toISOString()
      };

      if (type === 'JSON') {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportPayload, null, 2));
        const dl = document.createElement('a');
        dl.setAttribute("href", dataStr);
        dl.setAttribute("download", `omniplay_financial_model_${Math.round(selectedUtilization * 100)}pct.json`);
        document.body.appendChild(dl);
        dl.click();
        dl.remove();
      } else {
        const textContent = `%PDF-1.4 OmniPlay Financial Profitability Audit Report\n` +
          `Monthly Revenue: ${formatIdr(currentSim.totalMonthlyRevenue)}\n` +
          `Monthly OPEX: ${formatIdr(currentSim.monthlyOpex)}\n` +
          `Operating Profit: ${formatIdr(currentSim.operatingProfit)} (Margin: ${currentSim.operatingMarginPct.toFixed(1)}%)\n` +
          `Utilization: ${(currentSim.utilizationRate * 100).toFixed(1)}%\n` +
          `Generated via OmniPlay Client Engine`;
        const blob = new Blob([textContent], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const dl = document.createElement('a');
        dl.href = url;
        dl.download = `omniplay_financial_model_${Math.round(selectedUtilization * 100)}pct.pdf`;
        document.body.appendChild(dl);
        dl.click();
        dl.remove();
        URL.revokeObjectURL(url);
      }
    } else {
      // Telemetry / General Export
      const blob = new Blob([JSON.stringify(telemetryDatasets[timeRange], null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const dl = document.createElement('a');
      dl.href = url;
      dl.download = `omniplay_telemetry_${timeRange}.${type.toLowerCase()}`;
      document.body.appendChild(dl);
      dl.click();
      dl.remove();
      URL.revokeObjectURL(url);
    }

    setExportNotice(`Exported ${type} report successfully!`);
    setTimeout(() => setExportNotice(null), 3000);
  };

  // Telemetry Datasets (24H, 7D, 30D)
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
        { id: 'JK-01', name: 'JK-01 (Jakarta)', flag: '🇮🇩', sub: 'RTX 4070 • Direct Fiber', latency: '1.9 ms', latencyVal: 1.9, width: '13%', className: 'jk', isUltra: true },
        { id: 'SG-01', name: 'SG-01 (Singapore)', flag: '🇸🇬', sub: 'RTX 4080 • Equinix Direct', latency: '3.4 ms', latencyVal: 3.4, width: '18%', className: 'sg' },
        { id: 'US-01', name: 'US-01 (California)', flag: '🇺🇸', sub: 'RTX 4090 • Silicon Hub', latency: '9.2 ms', latencyVal: 9.2, width: '28%', className: 'us', background: 'linear-gradient(90deg, #3b82f6, #00f0ff)' },
        { id: 'EU-02', name: 'EU-02 (Frankfurt)', flag: '🇩🇪', sub: 'RTX 4080 • DE-CIX Telehouse', latency: '11.6 ms', latencyVal: 11.6, width: '36%', className: 'fra', background: 'linear-gradient(90deg, #10b981, #00f0ff)' },
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
        { id: 'JK-01', name: 'JK-01 (Jakarta)', flag: '🇮🇩', sub: 'RTX 4070 • Direct Fiber', latency: '2.0 ms', latencyVal: 2.0, width: '13.5%', className: 'jk', isUltra: true },
        { id: 'SG-01', name: 'SG-01 (Singapore)', flag: '🇸🇬', sub: 'RTX 4080 • Equinix Direct', latency: '3.6 ms', latencyVal: 3.6, width: '19%', className: 'sg' },
        { id: 'US-01', name: 'US-01 (California)', flag: '🇺🇸', sub: 'RTX 4090 • Silicon Hub', latency: '9.6 ms', latencyVal: 9.6, width: '29%', className: 'us', background: 'linear-gradient(90deg, #3b82f6, #00f0ff)' },
        { id: 'EU-02', name: 'EU-02 (Frankfurt)', flag: '🇩🇪', sub: 'RTX 4080 • DE-CIX Telehouse', latency: '12.0 ms', latencyVal: 12.0, width: '37%', className: 'fra', background: 'linear-gradient(90deg, #10b981, #00f0ff)' },
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
        { id: 'JK-01', name: 'JK-01 (Jakarta)', flag: '🇮🇩', sub: 'RTX 4070 • Direct Fiber', latency: '2.1 ms', latencyVal: 2.1, width: '14%', className: 'jk', isUltra: true },
        { id: 'SG-01', name: 'SG-01 (Singapore)', flag: '🇸🇬', sub: 'RTX 4080 • Equinix Direct', latency: '3.8 ms', latencyVal: 3.8, width: '20%', className: 'sg' },
        { id: 'US-01', name: 'US-01 (California)', flag: '🇺🇸', sub: 'RTX 4090 • Silicon Hub', latency: '9.8 ms', latencyVal: 9.8, width: '30%', className: 'us', background: 'linear-gradient(90deg, #3b82f6, #00f0ff)' },
        { id: 'EU-02', name: 'EU-02 (Frankfurt)', flag: '🇩🇪', sub: 'RTX 4080 • DE-CIX Telehouse', latency: '12.2 ms', latencyVal: 12.2, width: '38%', className: 'fra', background: 'linear-gradient(90deg, #10b981, #00f0ff)' },
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

  // Heatmap configuration
  const heatmapDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const heatmapHours = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22];
  const intensityClasses = ['idle', 'low', 'med', 'high', 'peak'] as const;
  const intensityLabels = ['Idle (0)', 'Low (1)', 'Moderate (2)', 'High (3)', 'Peak (4)'] as const;

  const heatmapMatrices: Record<'24h' | '7d' | '30d', number[][]> = useMemo(() => ({
    '24h': [
      [0, 0, 0, 0, 1, 2, 2, 1, 2, 4, 4, 3],
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

  // Handle saving pricing configuration
  const handleSavePricingConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveFinancialConfig(pricingEditForm);
    setConfigSaveSuccess(true);
    setTimeout(() => setConfigSaveSuccess(false), 3000);
  };

  const handleResetPricing = () => {
    const res = resetFinancialConfig();
    setPricingEditForm(res);
  };

  // GSAP Smooth Mount Transition
  useGSAP(() => {
    if (analyticsContainerRef.current) {
      gsap.fromTo('.financial-kpi-card, .analytics-kpi-card, .financial-banner-card', 
        { y: 6, opacity: 0.8 }, 
        { y: 0, opacity: 1, duration: 0.3, stagger: 0.04, ease: 'power2.out', clearProps: 'all' }
      );
    }
  }, [activeSubView, selectedUtilization, timeRange]);

  const filteredTransactions = useMemo(() => {
    if (transactionFilter === 'LIVE') return transactions.filter(t => !t.isDemo);
    if (transactionFilter === 'DEMO') return transactions.filter(t => t.isDemo);
    return transactions;
  }, [transactions, transactionFilter]);

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
      
      {/* 1. Header with View Selector & Single Export Button */}
      <header className="analytics-header">
        <div className="analytics-header-titles">
          <div className="analytics-badge">
            <ShieldCheck style={{ width: 14, height: 14 }} />
            <span>CLOUD INFRASTRUCTURE & BUSINESS ENGINE</span>
          </div>
          <h1 className="analytics-title">
            {activeSubView === 'financial' && 'Financial Model & Profitability Overview'}
            {activeSubView === 'telemetry' && 'Cloud Performance Analytics'}
            {activeSubView === 'transactions' && 'Financial Transaction Audit Log'}
            {activeSubView === 'pricing' && 'Pricing & Cost Control Settings'}
          </h1>
          <p className="analytics-sub">
            {activeSubView === 'financial' && 'Simulated academic financial projection across 12 GPUs, multi-revenue streams, and profitability metrics.'}
            {activeSubView === 'telemetry' && 'Playtime metrics, FPS stability, network latency, and cloud instance telemetry.'}
            {activeSubView === 'transactions' && 'Real-time record of customer gaming sessions, compute workloads, and cloud pass payments.'}
            {activeSubView === 'pricing' && 'Adjust gaming rates, compute rates, bundles, Day Pass, subscriptions, and OPEX assumptions.'}
          </p>
        </div>

        <div className="analytics-header-actions">
          {/* Telemetry Time Filter Pills (Visible when in Telemetry view) */}
          {activeSubView === 'telemetry' && (
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
          )}

          {/* EXACTLY ONE "Export" Button revealing dropdown with PDF and JSON */}
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

      {/* 2. Primary Subnavigation Bar */}
      <nav className="financial-subnav-bar" aria-label="Analytics Sections">
        <button
          type="button"
          className={`financial-subnav-btn ${activeSubView === 'financial' ? 'active' : ''}`}
          onClick={() => setActiveSubView('financial')}
        >
          <TrendingUp style={{ width: 16, height: 16, color: 'var(--neon-emerald)' }} />
          <span>Financial Overview & Profitability</span>
        </button>

        <button
          type="button"
          className={`financial-subnav-btn ${activeSubView === 'telemetry' ? 'active' : ''}`}
          onClick={() => setActiveSubView('telemetry')}
        >
          <Activity style={{ width: 16, height: 16, color: 'var(--neon-cyan)' }} />
          <span>Telemetry & Cloud Fleet</span>
        </button>

        <button
          type="button"
          className={`financial-subnav-btn ${activeSubView === 'transactions' ? 'active' : ''}`}
          onClick={() => setActiveSubView('transactions')}
        >
          <Clock style={{ width: 16, height: 16, color: 'var(--neon-purple)' }} />
          <span>Transaction Audit Log ({transactions.length})</span>
        </button>

        <button
          type="button"
          className={`financial-subnav-btn ${activeSubView === 'pricing' ? 'active' : ''}`}
          onClick={() => setActiveSubView('pricing')}
        >
          <SlidersHorizontal style={{ width: 16, height: 16, color: 'var(--neon-amber)' }} />
          <span>Pricing & Cost Settings (Admin)</span>
        </button>
      </nav>

      {/* =========================================================================
          VIEW A: FINANCIAL MODEL & PROFITABILITY DASHBOARD
          ========================================================================= */}
      {activeSubView === 'financial' && (
        <>
          {/* Academic Estimation Banner */}
          <div className="financial-banner-card">
            <div className="financial-banner-left">
              <Shield style={{ width: 28, height: 28, color: 'var(--neon-cyan)', flexShrink: 0, marginTop: 4 }} />
              <div>
                <span className="financial-badge-tag">SIMULATED FINANCIAL MODEL • BUSINESS PROJECTION</span>
                <h3 style={{ fontSize: 16, fontWeight: 800, margin: '2px 0 6px 0', color: '#ffffff' }}>
                  OmniPlay Global Cloud Infrastructure & Profitability Projection
                </h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0, lineHeight: 1.45 }}>
                  Based on academic project estimate: 12 GPUs distributed across 6 global data centers (Jakarta 2x RTX 4070, Singapore 2x RTX 4080, Tokyo 2x RTX 4090, Frankfurt 2x RTX 4080, London 2x RTX 4090, California 2x RTX 4090).
                </p>
              </div>
            </div>

            <div className="financial-banner-stats">
              <div className="banner-stat-box">
                <div className="banner-stat-label">Initial Investment</div>
                <div className="banner-stat-val cyan">{formatIdr(financialConfig.initialInvestment)}</div>
              </div>
              <div className="banner-stat-box">
                <div className="banner-stat-label">Monthly OPEX</div>
                <div className="banner-stat-val">{formatIdr(currentSim.monthlyOpex)}</div>
              </div>
              <div className="banner-stat-box">
                <div className="banner-stat-label">Break-Even Utilization</div>
                <div className="banner-stat-val profit">{currentSim.breakEvenUtilizationPct.toFixed(1)}%</div>
              </div>
            </div>
          </div>

          {/* Interactive Utilization Scenario Bar */}
          <div className="utilization-control-panel">
            <div>
              <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Simulate Fleet Utilization Rate
              </span>
              <p style={{ margin: '2px 0 0 0', fontSize: 14, fontWeight: 700, color: '#ffffff' }}>
                Active Scenario: <strong style={{ color: 'var(--neon-cyan)' }}>{Math.round(selectedUtilization * 100)}% Utilization</strong> ({currentSim.soldCapacityHours.toLocaleString()} / 8,640 GPU-hours sold)
              </p>
            </div>

            <div className="utilization-pills-row">
              {[0.50, 0.60, 0.70, 0.75, 0.80, 0.90, 1.00].map(rate => (
                <button
                  key={rate}
                  type="button"
                  className={`utilization-pill-btn ${selectedUtilization === rate ? 'active' : ''}`}
                  onClick={() => setSelectedUtilization(rate)}
                >
                  {Math.round(rate * 100)}% {rate === 0.75 ? '(Base)' : rate === 0.50 ? '(Min)' : rate === 0.90 ? '(High)' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* 10 Key Performance Indicators (KPI) Grid */}
          <div className="financial-kpi-grid">
            <div className="financial-kpi-card highlight-revenue">
              <div className="kpi-header">
                <span className="kpi-tag">MONTHLY REVENUE</span>
                <DollarSign style={{ width: 16, height: 16, color: 'var(--neon-cyan)' }} />
              </div>
              <p className="kpi-value cyan">{formatIdr(currentSim.totalMonthlyRevenue)}</p>
              <p className="kpi-sub green">Annualized: {formatIdr(currentSim.annualRevenue)}</p>
            </div>

            <div className="financial-kpi-card">
              <div className="kpi-header">
                <span className="kpi-tag">MONTHLY OPEX</span>
                <HardDrive style={{ width: 16, height: 16, color: 'var(--text-muted)' }} />
              </div>
              <p className="kpi-value">{formatIdr(currentSim.monthlyOpex)}</p>
              <p className="kpi-sub">Facility, Power, Bandwidth & Security</p>
            </div>

            <div className="financial-kpi-card highlight-profit">
              <div className="kpi-header">
                <span className="kpi-tag">OPERATING PROFIT</span>
                <TrendingUp style={{ width: 16, height: 16, color: 'var(--neon-emerald)' }} />
              </div>
              <p className="kpi-value emerald">
                {currentSim.operatingProfit >= 0 ? `+${formatIdr(currentSim.operatingProfit)}` : formatIdr(currentSim.operatingProfit)}
              </p>
              <p className="kpi-sub green">
                Annual Profit: {formatIdr(currentSim.annualOperatingProfit)}
              </p>
            </div>

            <div className="financial-kpi-card">
              <div className="kpi-header">
                <span className="kpi-tag">OPERATING MARGIN</span>
                <PieIcon style={{ width: 16, height: 16, color: 'var(--neon-emerald)' }} />
              </div>
              <p className="kpi-value emerald">{currentSim.operatingMarginPct.toFixed(1)}<span className="unit">%</span></p>
              <p className="kpi-sub">Target Range: 20.0% – 40.0%</p>
            </div>

            <div className="financial-kpi-card">
              <div className="kpi-header">
                <span className="kpi-tag">FLEET UTILIZATION</span>
                <Cpu style={{ width: 16, height: 16, color: 'var(--neon-cyan)' }} />
              </div>
              <p className="kpi-value cyan">{(currentSim.utilizationRate * 100).toFixed(0)}<span className="unit">%</span></p>
              <p className="kpi-sub">{currentSim.soldCapacityHours} of 8,640 GPU-hours</p>
            </div>

            <div className="financial-kpi-card">
              <div className="kpi-header">
                <span className="kpi-tag">REVENUE PER GPU-HOUR</span>
                <Zap style={{ width: 16, height: 16, color: 'var(--neon-amber)' }} />
              </div>
              <p className="kpi-value">{formatIdr(currentSim.revenuePerGpuHour)}</p>
              <p className="kpi-sub">Weighted across 3 GPU Tiers</p>
            </div>

            <div className="financial-kpi-card">
              <div className="kpi-header">
                <span className="kpi-tag">GAMING REVENUE</span>
                <Flame style={{ width: 16, height: 16, color: 'var(--neon-cyan)' }} />
              </div>
              <p className="kpi-value cyan">{formatIdr(currentSim.gamingRevenue)}</p>
              <p className="kpi-sub">{currentSim.gamingHours} hrs • 55% Capacity</p>
            </div>

            <div className="financial-kpi-card">
              <div className="kpi-header">
                <span className="kpi-tag">CLOUD COMPUTE REV</span>
                <Cpu style={{ width: 16, height: 16, color: 'var(--neon-purple)' }} />
              </div>
              <p className="kpi-value purple">{formatIdr(currentSim.computeRevenue)}</p>
              <p className="kpi-sub">{currentSim.computeHours} hrs • AI & 3D Render</p>
            </div>

            <div className="financial-kpi-card">
              <div className="kpi-header">
                <span className="kpi-tag">SUBSCRIPTIONS</span>
                <ShieldCheck style={{ width: 16, height: 16, color: 'var(--neon-emerald)' }} />
              </div>
              <p className="kpi-value emerald">{formatIdr(currentSim.subscriptionRevenue)}</p>
              <p className="kpi-sub">OmniPlay Pro & Ultra Recurring</p>
            </div>

            <div className="financial-kpi-card">
              <div className="kpi-header">
                <span className="kpi-tag">ADD-ONS REVENUE</span>
                <Layers style={{ width: 16, height: 16, color: 'var(--neon-amber)' }} />
              </div>
              <p className="kpi-value">{formatIdr(currentSim.addonRevenue)}</p>
              <p className="kpi-sub">Priority Queue & Cloud Storage</p>
            </div>
          </div>

          {/* Revenue Breakdown & GPU Tier Contribution */}
          <div className="analytics-charts-grid">
            {/* Revenue Stream Breakdown */}
            <div className="analytics-chart-card">
              <div className="chart-card-header">
                <div>
                  <h3 className="chart-card-title">Revenue Streams Contribution</h3>
                  <p className="chart-card-sub">Diversified revenue beyond pure cloud gaming</p>
                </div>
                <span className="chart-badge-tag">Total: {formatIdr(currentSim.totalMonthlyRevenue)}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '10px 0' }}>
                {[
                  { label: 'Cloud Gaming (Premium Hourly & Bundles)', amount: currentSim.gamingRevenue, color: 'var(--neon-cyan)', share: (currentSim.gamingRevenue / currentSim.totalMonthlyRevenue) * 100 },
                  { label: 'Cloud Compute (AI/ML, 3D Rendering, Dev)', amount: currentSim.computeRevenue, color: 'var(--neon-purple)', share: (currentSim.computeRevenue / currentSim.totalMonthlyRevenue) * 100 },
                  { label: 'Recurring Subscriptions (Pro & Ultra)', amount: currentSim.subscriptionRevenue, color: 'var(--neon-emerald)', share: (currentSim.subscriptionRevenue / currentSim.totalMonthlyRevenue) * 100 },
                  { label: 'Premium Add-ons (Priority Queue, Storage)', amount: currentSim.addonRevenue, color: 'var(--neon-amber)', share: (currentSim.addonRevenue / currentSim.totalMonthlyRevenue) * 100 }
                ].map(stream => (
                  <div key={stream.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                      <span style={{ fontWeight: 600, color: '#ffffff' }}>{stream.label}</span>
                      <span style={{ fontWeight: 700, color: stream.color }}>{formatIdr(stream.amount)} ({stream.share.toFixed(1)}%)</span>
                    </div>
                    <div style={{ width: '100%', height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ width: `${stream.share}%`, height: '100%', background: stream.color, borderRadius: 4, transition: 'width 0.4s ease' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* GPU Tier Weighted Revenue */}
            <div className="analytics-chart-card">
              <div className="chart-card-header">
                <div>
                  <h3 className="chart-card-title">Revenue by GPU Fleet Tier</h3>
                  <p className="chart-card-sub">Actual 12-GPU fleet distribution weighting</p>
                </div>
                <span className="chart-badge-tag">Fleet: 12 GPUs</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '10px 0' }}>
                {[
                  { tier: 'RTX 4070 (2 GPUs • Jakarta)', rev: currentSim.gpuTierRevenue.rtx4070.totalRev, hours: currentSim.gpuTierRevenue.rtx4070.hours, color: 'var(--neon-cyan)', share: (currentSim.gpuTierRevenue.rtx4070.totalRev / (currentSim.gamingRevenue + currentSim.computeRevenue)) * 100 },
                  { tier: 'RTX 4080 (4 GPUs • Singapore & Frankfurt)', rev: currentSim.gpuTierRevenue.rtx4080.totalRev, hours: currentSim.gpuTierRevenue.rtx4080.hours, color: 'var(--neon-blue)', share: (currentSim.gpuTierRevenue.rtx4080.totalRev / (currentSim.gamingRevenue + currentSim.computeRevenue)) * 100 },
                  { tier: 'RTX 4090 (6 GPUs • Tokyo, London, California)', rev: currentSim.gpuTierRevenue.rtx4090.totalRev, hours: currentSim.gpuTierRevenue.rtx4090.hours, color: 'var(--neon-purple)', share: (currentSim.gpuTierRevenue.rtx4090.totalRev / (currentSim.gamingRevenue + currentSim.computeRevenue)) * 100 },
                ].map(item => (
                  <div key={item.tier}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                      <span style={{ fontWeight: 600, color: '#ffffff' }}>{item.tier}</span>
                      <span style={{ fontWeight: 700, color: item.color }}>{formatIdr(item.rev)} ({item.hours}h)</span>
                    </div>
                    <div style={{ width: '100%', height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ width: `${item.share}%`, height: '100%', background: item.color, borderRadius: 4, transition: 'width 0.4s ease' }} />
                    </div>
                  </div>
                ))}

                <div style={{ marginTop: 12, padding: 12, borderRadius: 8, background: 'rgba(0, 240, 255, 0.04)', border: '1px solid rgba(0, 240, 255, 0.15)', fontSize: 12, color: 'var(--text-muted)' }}>
                  💡 <strong>Weighted Pricing Model:</strong> RTX 4090 nodes account for 50% of total fleet capacity (6 GPUs) and generate the highest operating margin due to high-value esports and AI compute workloads.
                </div>
              </div>
            </div>
          </div>

          {/* Regional Profitability Table (Section 16) */}
          <div className="analytics-chart-card" style={{ marginTop: 24 }}>
            <div className="chart-card-header">
              <div>
                <h3 className="chart-card-title">Regional Data Center Profitability</h3>
                <p className="chart-card-sub">Operating profit & margin across all 6 OmniPlay Cloud Centers</p>
              </div>
              <div className="node-active-count">
                <span className="node-status-dot" /> 6 Global PoPs Active
              </div>
            </div>

            <div className="financial-table-wrapper">
              <table className="financial-table">
                <thead>
                  <tr>
                    <th>Cloud Center</th>
                    <th>GPU Tier</th>
                    <th>Count</th>
                    <th>Sold Capacity</th>
                    <th>Gaming Rev</th>
                    <th>Compute Rev</th>
                    <th>Total Revenue</th>
                    <th>Allocated OPEX</th>
                    <th>Operating Profit</th>
                    <th>Margin</th>
                  </tr>
                </thead>
                <tbody>
                  {currentSim.regions.map(r => (
                    <tr key={r.nodeId}>
                      <td style={{ fontWeight: 700 }}>
                        <span style={{ marginRight: 6 }}>{r.flag}</span>
                        {r.location} ({r.nodeId})
                      </td>
                      <td>
                        <span className="node-tier-tag">{r.gpuModel}</span>
                      </td>
                      <td>{r.gpuCount}x</td>
                      <td>{r.soldHours}h ({(r.utilizationPct).toFixed(0)}%)</td>
                      <td>{formatIdr(r.gamingRevenue)}</td>
                      <td>{formatIdr(r.computeRevenue)}</td>
                      <td style={{ fontWeight: 700, color: 'var(--neon-cyan)' }}>{formatIdr(r.totalRevenue)}</td>
                      <td>{formatIdr(r.allocatedOpex)}</td>
                      <td style={{ fontWeight: 800, color: r.operatingProfit >= 0 ? 'var(--neon-emerald)' : '#ef4444' }}>
                        {r.operatingProfit >= 0 ? `+${formatIdr(r.operatingProfit)}` : formatIdr(r.operatingProfit)}
                      </td>
                      <td>
                        <span className="status-badge paid">
                          {r.marginPct.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Scenario Comparison Table (Section 11 & 20) */}
          <div className="analytics-chart-card" style={{ marginTop: 24 }}>
            <div className="chart-card-header">
              <div>
                <h3 className="chart-card-title">Scenario Simulation Comparison</h3>
                <p className="chart-card-sub">Stress-test business viability from 50% to 100% capacity utilization</p>
              </div>
              <span className="chart-badge-tag">Academic Model</span>
            </div>

            <div className="financial-table-wrapper">
              <table className="financial-table">
                <thead>
                  <tr>
                    <th>Scenario</th>
                    <th>Utilization</th>
                    <th>Sold Hours</th>
                    <th>Monthly Revenue</th>
                    <th>Monthly OPEX</th>
                    <th>Operating Profit</th>
                    <th>Margin</th>
                    <th>Annualized Profit</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {standardScenarios.map(sc => (
                    <tr 
                      key={sc.scenarioName}
                      style={{ background: Math.abs(sc.utilizationRate - selectedUtilization) < 0.01 ? 'rgba(0, 240, 255, 0.08)' : 'transparent' }}
                    >
                      <td style={{ fontWeight: 700, color: Math.abs(sc.utilizationRate - selectedUtilization) < 0.01 ? 'var(--neon-cyan)' : '#ffffff' }}>
                        {sc.scenarioName}
                      </td>
                      <td>{(sc.utilizationRate * 100).toFixed(0)}%</td>
                      <td>{sc.soldCapacityHours.toLocaleString()}h</td>
                      <td>{formatIdr(sc.totalMonthlyRevenue)}</td>
                      <td>{formatIdr(sc.monthlyOpex)}</td>
                      <td style={{ fontWeight: 800, color: sc.operatingProfit >= 0 ? 'var(--neon-emerald)' : '#ef4444' }}>
                        {sc.operatingProfit >= 0 ? `+${formatIdr(sc.operatingProfit)}` : formatIdr(sc.operatingProfit)}
                      </td>
                      <td>{sc.operatingMarginPct.toFixed(1)}%</td>
                      <td style={{ fontWeight: 700 }}>{formatIdr(sc.annualOperatingProfit)}</td>
                      <td>
                        <span className={`status-badge ${sc.operatingProfit >= 0 ? 'paid' : 'failed'}`}>
                          {sc.operatingProfit >= 0 ? 'PROFITABLE' : 'DEFICIT'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* =========================================================================
          VIEW B: TELEMETRY & CLOUD FLEET (EXISTING COMPLETE DASHBOARD)
          ========================================================================= */}
      {activeSubView === 'telemetry' && (
        <>
          {/* Key Performance Indicators (KPI) Grid */}
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

          {/* Heatmaps & Donut Chart Grid */}
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

            {/* Most Frequently Played Games Donut Chart */}
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
                <div className="pie-svg-wrap">
                  <svg viewBox="0 0 200 200" className="pie-donut-svg">
                    <circle cx="100" cy="100" r="70" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="26" />
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
                    <text x="100" y="95" textAnchor="middle" fill="#ffffff" fontSize="18" fontWeight="800" fontFamily="sans-serif">
                      {currentData.kpis.totalPlaytime}h
                    </text>
                    <text x="100" y="112" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="700" letterSpacing="0.5" fontFamily="sans-serif">
                      TOTAL PLAYTIME
                    </text>
                  </svg>
                </div>

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

          {/* Stream Framerate Stability & Node Latency */}
          <div className="analytics-charts-grid">
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
                  <line x1="0" y1="30" x2="700" y2="30" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                  <line x1="0" y1="70" x2="700" y2="70" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                  <line x1="0" y1="110" x2="700" y2="110" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                  <line x1="0" y1="30" x2="700" y2="30" stroke="rgba(34, 211, 238, 0.4)" strokeWidth="1.5" />
                  <path d={currentData.fpsChart.pathArea} fill="url(#fpsGradient)" style={{ transition: 'd 0.4s ease' }} />
                  <path d={currentData.fpsChart.pathLine} fill="none" stroke="#00f0ff" strokeWidth="2.5" strokeLinecap="round" style={{ transition: 'd 0.4s ease' }} />
                  {currentData.fpsChart.dots.map((dot, idx) => (
                    <circle key={idx} cx={dot.cx} cy={dot.cy} r="4" fill="#00f0ff" filter="drop-shadow(0 0 6px #00f0ff)" />
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
                      <div className={`node-bar-fill ${node.className}`} style={{ width: node.width, ...(node.background ? { background: node.background } : {}) }} />
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

          {/* Per-Game Insights */}
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
        </>
      )}

      {/* =========================================================================
          VIEW C: TRANSACTION AUDIT LOG
          ========================================================================= */}
      {activeSubView === 'transactions' && (
        <div className="analytics-chart-card">
          <div className="chart-card-header">
            <div>
              <h3 className="chart-card-title">Transaction & Rental Audit Log</h3>
              <p className="chart-card-sub">Recorded rental payments, subscriptions, and GPU compute sessions</p>
            </div>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div className="analytics-time-pills">
                <button
                  type="button"
                  className={`time-pill ${transactionFilter === 'ALL' ? 'active' : ''}`}
                  onClick={() => setTransactionFilter('ALL')}
                >
                  All ({transactions.length})
                </button>
                <button
                  type="button"
                  className={`time-pill ${transactionFilter === 'LIVE' ? 'active' : ''}`}
                  onClick={() => setTransactionFilter('LIVE')}
                >
                  Live Flow ({transactions.filter(t => !t.isDemo).length})
                </button>
                <button
                  type="button"
                  className={`time-pill ${transactionFilter === 'DEMO' ? 'active' : ''}`}
                  onClick={() => setTransactionFilter('DEMO')}
                >
                  Simulation ({transactions.filter(t => t.isDemo).length})
                </button>
              </div>
            </div>
          </div>

          <div className="financial-table-wrapper">
            <table className="financial-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Customer / User</th>
                  <th>Item / Workload</th>
                  <th>Category</th>
                  <th>Node & GPU</th>
                  <th>Duration</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Payment Status</th>
                  <th>Type</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map(tx => (
                  <tr key={tx.id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--neon-cyan)' }}>{tx.id}</td>
                    <td style={{ fontWeight: 600 }}>{tx.user}</td>
                    <td>{tx.itemTitle}</td>
                    <td>
                      <span className="node-tier-tag">{tx.category}</span>
                    </td>
                    <td>{tx.gpuTier}</td>
                    <td>{tx.durationHours} hrs</td>
                    <td style={{ fontWeight: 800 }}>{formatIdr(tx.amountIdr)}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{tx.paymentMethod}</td>
                    <td>
                      <span className={`status-badge ${tx.paymentStatus.toLowerCase()}`}>
                        {tx.paymentStatus}
                      </span>
                    </td>
                    <td>
                      <span className={`type-badge ${tx.isDemo ? 'demo' : 'live'}`}>
                        {tx.isDemo ? 'SIMULATION' : 'LIVE USER'}
                      </span>
                    </td>
                    <td style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      {new Date(tx.date).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW D: PRICING & COST SETTINGS (ADMIN)
          ========================================================================= */}
      {activeSubView === 'pricing' && (
        <form onSubmit={handleSavePricingConfig}>
          <div className="pricing-config-grid">
            {/* Gaming Hourly Rates */}
            <div className="pricing-section-card">
              <h4 className="pricing-section-title">
                <Flame style={{ width: 18, height: 18, color: 'var(--neon-cyan)' }} />
                Cloud Gaming Hourly Rates (IDR)
              </h4>
              <div className="pricing-input-row">
                <label className="pricing-input-label">RTX 4070 (Tier 1)</label>
                <input
                  type="number"
                  className="pricing-input-field"
                  value={pricingEditForm.pricing.rtx4070Gaming}
                  onChange={e => setPricingEditForm({
                    ...pricingEditForm,
                    pricing: { ...pricingEditForm.pricing, rtx4070Gaming: parseInt(e.target.value) || 0 }
                  })}
                />
              </div>
              <div className="pricing-input-row">
                <label className="pricing-input-label">RTX 4080 (Tier 2)</label>
                <input
                  type="number"
                  className="pricing-input-field"
                  value={pricingEditForm.pricing.rtx4080Gaming}
                  onChange={e => setPricingEditForm({
                    ...pricingEditForm,
                    pricing: { ...pricingEditForm.pricing, rtx4080Gaming: parseInt(e.target.value) || 0 }
                  })}
                />
              </div>
              <div className="pricing-input-row">
                <label className="pricing-input-label">RTX 4090 (Tier 3)</label>
                <input
                  type="number"
                  className="pricing-input-field"
                  value={pricingEditForm.pricing.rtx4090Gaming}
                  onChange={e => setPricingEditForm({
                    ...pricingEditForm,
                    pricing: { ...pricingEditForm.pricing, rtx4090Gaming: parseInt(e.target.value) || 0 }
                  })}
                />
              </div>
            </div>

            {/* Compute Hourly Rates */}
            <div className="pricing-section-card">
              <h4 className="pricing-section-title">
                <Cpu style={{ width: 18, height: 18, color: 'var(--neon-purple)' }} />
                Cloud Compute Rates (IDR / GPU-hr)
              </h4>
              <div className="pricing-input-row">
                <label className="pricing-input-label">RTX 4070 Compute</label>
                <input
                  type="number"
                  className="pricing-input-field"
                  value={pricingEditForm.pricing.rtx4070Compute}
                  onChange={e => setPricingEditForm({
                    ...pricingEditForm,
                    pricing: { ...pricingEditForm.pricing, rtx4070Compute: parseInt(e.target.value) || 0 }
                  })}
                />
              </div>
              <div className="pricing-input-row">
                <label className="pricing-input-label">RTX 4080 Compute</label>
                <input
                  type="number"
                  className="pricing-input-field"
                  value={pricingEditForm.pricing.rtx4080Compute}
                  onChange={e => setPricingEditForm({
                    ...pricingEditForm,
                    pricing: { ...pricingEditForm.pricing, rtx4080Compute: parseInt(e.target.value) || 0 }
                  })}
                />
              </div>
              <div className="pricing-input-row">
                <label className="pricing-input-label">RTX 4090 Compute</label>
                <input
                  type="number"
                  className="pricing-input-field"
                  value={pricingEditForm.pricing.rtx4090Compute}
                  onChange={e => setPricingEditForm({
                    ...pricingEditForm,
                    pricing: { ...pricingEditForm.pricing, rtx4090Compute: parseInt(e.target.value) || 0 }
                  })}
                />
              </div>
            </div>

            {/* Day Pass Rates */}
            <div className="pricing-section-card">
              <h4 className="pricing-section-title">
                <Clock style={{ width: 18, height: 18, color: 'var(--neon-emerald)' }} />
                24-Hour Day Pass (IDR)
              </h4>
              <div className="pricing-input-row">
                <label className="pricing-input-label">RTX 4070 Day Pass</label>
                <input
                  type="number"
                  className="pricing-input-field"
                  value={pricingEditForm.pricing.dayPass4070}
                  onChange={e => setPricingEditForm({
                    ...pricingEditForm,
                    pricing: { ...pricingEditForm.pricing, dayPass4070: parseInt(e.target.value) || 0 }
                  })}
                />
              </div>
              <div className="pricing-input-row">
                <label className="pricing-input-label">RTX 4080 Day Pass</label>
                <input
                  type="number"
                  className="pricing-input-field"
                  value={pricingEditForm.pricing.dayPass4080}
                  onChange={e => setPricingEditForm({
                    ...pricingEditForm,
                    pricing: { ...pricingEditForm.pricing, dayPass4080: parseInt(e.target.value) || 0 }
                  })}
                />
              </div>
              <div className="pricing-input-row">
                <label className="pricing-input-label">RTX 4090 Day Pass</label>
                <input
                  type="number"
                  className="pricing-input-field"
                  value={pricingEditForm.pricing.dayPass4090}
                  onChange={e => setPricingEditForm({
                    ...pricingEditForm,
                    pricing: { ...pricingEditForm.pricing, dayPass4090: parseInt(e.target.value) || 0 }
                  })}
                />
              </div>
            </div>

            {/* Subscriptions & Dynamic Pricing */}
            <div className="pricing-section-card">
              <h4 className="pricing-section-title">
                <ShieldCheck style={{ width: 18, height: 18, color: 'var(--neon-amber)' }} />
                Subscriptions & Dynamic Pricing
              </h4>
              <div className="pricing-input-row">
                <label className="pricing-input-label">OmniPlay Pro (Monthly)</label>
                <input
                  type="number"
                  className="pricing-input-field"
                  value={pricingEditForm.pricing.subProMonthly}
                  onChange={e => setPricingEditForm({
                    ...pricingEditForm,
                    pricing: { ...pricingEditForm.pricing, subProMonthly: parseInt(e.target.value) || 0 }
                  })}
                />
              </div>
              <div className="pricing-input-row">
                <label className="pricing-input-label">OmniPlay Ultra (Monthly)</label>
                <input
                  type="number"
                  className="pricing-input-field"
                  value={pricingEditForm.pricing.subUltraMonthly}
                  onChange={e => setPricingEditForm({
                    ...pricingEditForm,
                    pricing: { ...pricingEditForm.pricing, subUltraMonthly: parseInt(e.target.value) || 0 }
                  })}
                />
              </div>
              <div className="pricing-input-row">
                <label className="pricing-input-label">Peak Markup (%)</label>
                <input
                  type="number"
                  className="pricing-input-field"
                  value={pricingEditForm.pricing.peakMarkupPct}
                  onChange={e => setPricingEditForm({
                    ...pricingEditForm,
                    pricing: { ...pricingEditForm.pricing, peakMarkupPct: parseInt(e.target.value) || 0 }
                  })}
                />
              </div>
              <div className="pricing-input-row">
                <label className="pricing-input-label">Off-Peak Discount (%)</label>
                <input
                  type="number"
                  className="pricing-input-field"
                  value={pricingEditForm.pricing.offPeakDiscountPct}
                  onChange={e => setPricingEditForm({
                    ...pricingEditForm,
                    pricing: { ...pricingEditForm.pricing, offPeakDiscountPct: parseInt(e.target.value) || 0 }
                  })}
                />
              </div>
            </div>

            {/* Monthly OPEX Breakdown (± Rp399.000.000) */}
            <div className="pricing-section-card" style={{ gridColumn: 'span 2' }}>
              <h4 className="pricing-section-title">
                <HardDrive style={{ width: 18, height: 18, color: 'var(--neon-emerald)' }} />
                Monthly Operating Cost (OPEX Breakdown) — Total: {formatIdr(
                  pricingEditForm.opex.facilityColocation +
                  pricingEditForm.opex.electricityPower +
                  pricingEditForm.opex.bandwidthPeering +
                  pricingEditForm.opex.hardwareMaintenance +
                  pricingEditForm.opex.cloudStorageSan +
                  pricingEditForm.opex.securityDdos +
                  pricingEditForm.opex.officeOperations
                )}
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px 24px' }}>
                <div className="pricing-input-row">
                  <label className="pricing-input-label">Colocation / 6 Data Centers</label>
                  <input
                    type="number"
                    className="pricing-input-field"
                    value={pricingEditForm.opex.facilityColocation}
                    onChange={e => setPricingEditForm({
                      ...pricingEditForm,
                      opex: { ...pricingEditForm.opex, facilityColocation: parseInt(e.target.value) || 0 }
                    })}
                  />
                </div>
                <div className="pricing-input-row">
                  <label className="pricing-input-label">Power & Electricity (12 GPUs)</label>
                  <input
                    type="number"
                    className="pricing-input-field"
                    value={pricingEditForm.opex.electricityPower}
                    onChange={e => setPricingEditForm({
                      ...pricingEditForm,
                      opex: { ...pricingEditForm.opex, electricityPower: parseInt(e.target.value) || 0 }
                    })}
                  />
                </div>
                <div className="pricing-input-row">
                  <label className="pricing-input-label">Bandwidth & IX Direct Peering</label>
                  <input
                    type="number"
                    className="pricing-input-field"
                    value={pricingEditForm.opex.bandwidthPeering}
                    onChange={e => setPricingEditForm({
                      ...pricingEditForm,
                      opex: { ...pricingEditForm.opex, bandwidthPeering: parseInt(e.target.value) || 0 }
                    })}
                  />
                </div>
                <div className="pricing-input-row">
                  <label className="pricing-input-label">Hardware Maintenance & Aging</label>
                  <input
                    type="number"
                    className="pricing-input-field"
                    value={pricingEditForm.opex.hardwareMaintenance}
                    onChange={e => setPricingEditForm({
                      ...pricingEditForm,
                      opex: { ...pricingEditForm.opex, hardwareMaintenance: parseInt(e.target.value) || 0 }
                    })}
                  />
                </div>
                <div className="pricing-input-row">
                  <label className="pricing-input-label">Storage SAN & S3 Vault</label>
                  <input
                    type="number"
                    className="pricing-input-field"
                    value={pricingEditForm.opex.cloudStorageSan}
                    onChange={e => setPricingEditForm({
                      ...pricingEditForm,
                      opex: { ...pricingEditForm.opex, cloudStorageSan: parseInt(e.target.value) || 0 }
                    })}
                  />
                </div>
                <div className="pricing-input-row">
                  <label className="pricing-input-label">Security, DDoS & VAC Shield</label>
                  <input
                    type="number"
                    className="pricing-input-field"
                    value={pricingEditForm.opex.securityDdos}
                    onChange={e => setPricingEditForm({
                      ...pricingEditForm,
                      opex: { ...pricingEditForm.opex, securityDdos: parseInt(e.target.value) || 0 }
                    })}
                  />
                </div>
                <div className="pricing-input-row">
                  <label className="pricing-input-label">NOC & Administrative Operations</label>
                  <input
                    type="number"
                    className="pricing-input-field"
                    value={pricingEditForm.opex.officeOperations}
                    onChange={e => setPricingEditForm({
                      ...pricingEditForm,
                      opex: { ...pricingEditForm.opex, officeOperations: parseInt(e.target.value) || 0 }
                    })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'flex-end', marginTop: 12 }}>
            <button
              type="button"
              onClick={handleResetPricing}
              className="time-pill"
              style={{ padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <RotateCcw style={{ width: 14, height: 14 }} />
              <span>Reset to Academic Defaults</span>
            </button>
            <button
              type="submit"
              className="export-trigger-btn"
              style={{ background: 'var(--neon-blue)', color: '#ffffff', borderColor: 'var(--neon-cyan)' }}
            >
              <Save style={{ width: 16, height: 16 }} />
              <span>Save & Apply Financial Model</span>
            </button>
          </div>

          {configSaveSuccess && (
            <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--neon-emerald)', fontSize: 13, justifyContent: 'flex-end' }}>
              <CheckCircle2 style={{ width: 16, height: 16 }} />
              <span>Financial settings saved! Simulation, pricing, and dashboards updated live.</span>
            </div>
          )}
        </form>
      )}

    </div>
  );
}
