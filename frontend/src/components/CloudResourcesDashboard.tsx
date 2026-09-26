import { useState } from 'react';
import { 
  Cpu, Zap, HardDrive, Globe, Server, Power, Loader2, 
  Users, ShieldCheck, Database, Laptop, Clock, 
  CheckCircle2, ArrowRight, Shield, Lock, Key, RefreshCw, 
  Download, Cloud, FileText, AlertTriangle, Activity, 
  Wifi, Layers, ShieldAlert, Wrench, Gamepad2, Sparkles,
  TrendingUp, DollarSign, Award
} from 'lucide-react';
import CloudArchitectureModal from './CloudArchitectureModal';

export default function CloudResourcesDashboard() {
  const [rebooting, setRebooting] = useState(false);
  const [rebootStep, setRebootStep] = useState(0);

  // 3D Architecture Blueprint Modal State
  const [showArchModal, setShowArchModal] = useState(false);

  // Auto-Scaling & Rapid Elasticity State
  const [activeWorkerPods, setActiveWorkerPods] = useState(4);
  const [isSimulatingSpike, setIsSimulatingSpike] = useState(false);
  const [spikeNotification, setSpikeNotification] = useState<string | null>(null);
  const [currentCpuLoad, setCurrentCpuLoad] = useState('74%');

  // Backup & Disaster Recovery state
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [lastBackupTime, setLastBackupTime] = useState('2 jam lalu (Otomatis)');
  const [backupSuccessMessage, setBackupSuccessMessage] = useState<string | null>(null);

  // Quick Troubleshooting & Auto-Repair Console state
  const [activeRepairing, setActiveRepairing] = useState<string | null>(null);
  const [repairSuccessMessage, setRepairSuccessMessage] = useState<string | null>(null);

  const handleSimulateSpike = () => {
    if (isSimulatingSpike) return;
    setIsSimulatingSpike(true);
    setCurrentCpuLoad('94%');
    setSpikeNotification('⚠️ Lonjakan Beban Terdeteksi (CPU 94%, VRAM 89%)! Auto-Scaler mendeteksi overload dan memicu Scale-Out...');

    // Phase 1: Rapid Elasticity -> Auto scale-out (+2 pods)
    setTimeout(() => {
      setActiveWorkerPods(6);
      setSpikeNotification('🚀 Rapid Elasticity Berhasil: +2 Worker Pods (JK-02, SG-02) aktif seketika! Beban traffic diratakan.');
      setCurrentCpuLoad('58%');
    }, 2000);

    // Phase 2: Graceful stabilization
    setTimeout(() => {
      setIsSimulatingSpike(false);
      setSpikeNotification('✅ Uji Lonjakan (Spike Test) Selesai: Sistem elastis berhasil menjaga latensi tetap sub-4ms tanpa downtime.');
      setTimeout(() => {
        setSpikeNotification(null);
        setActiveWorkerPods(4);
        setCurrentCpuLoad('74%');
      }, 7000);
    }, 5500);
  };

  const handleReboot = () => {
    setRebooting(true);
    setRebootStep(1);
    setTimeout(() => setRebootStep(2), 2000);
    setTimeout(() => setRebootStep(3), 4000);
    setTimeout(() => {
      setRebooting(false);
      setRebootStep(0);
    }, 6000);
  };

  const handleRunRepair = (repairKey: string, actionName: string, detailMsg: string) => {
    if (activeRepairing) return;
    setActiveRepairing(repairKey);
    setRepairSuccessMessage(null);

    setTimeout(() => {
      setActiveRepairing(null);
      setRepairSuccessMessage(`✅ Berhasil: ${actionName} selesai! ${detailMsg}`);
      setTimeout(() => {
        setRepairSuccessMessage((current) => (current?.includes(actionName) ? null : current));
      }, 7000);
    }, 1200);
  };

  const handleTriggerBackup = () => {
    if (isBackingUp) return;
    setIsBackingUp(true);
    setBackupSuccessMessage(null);

    // Simulate multi-region snapshot creation & S3 replication
    setTimeout(() => {
      setIsBackingUp(false);
      const now = new Date();
      const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastBackupTime(`Baru saja (${timeStr} WIB)`);
      setBackupSuccessMessage(`Snapshot #OMNI-BKP-${Date.now().toString().slice(-6)} berhasil dibuat! Data tersimpan aman dan terenkripsi di S3.`);
      
      // Auto-clear message after 8 seconds
      setTimeout(() => {
        setBackupSuccessMessage(null);
      }, 8000);
    }, 2000);
  };

  const handleDownloadBackup = () => {
    // Generate real JSON export of current cloud infrastructure, security, and sessions state
    const backupData = {
      backup_id: `OMNI-SNAP-${Date.now()}`,
      cluster: "OmniPlay High-Performance Cloud Fleet",
      timestamp: new Date().toISOString(),
      security_matrix: {
        encryption_in_transit: "TLS 1.3 / AES-256-GCM (Enforced)",
        stream_protocol: "WebRTC DTLS-SRTP (Sub-2ms Encrypted Datagrams)",
        authentication: "HttpOnly JWT Cookie Shield (XSS/CSRF Protected)",
        sandbox_isolation: "Docker/KVM Ephemeral Pods (Zero Local Footprint Per Rental)",
        firewall: "Cloudflare Enterprise Layer 3/4/7 DDoS Shield (0 Breaches)",
        anti_cheat_compatibility: "Valve Anti-Cheat (VAC) & Steam Guard Pass-Through Safe"
      },
      disaster_recovery: {
        recovery_time_objective: "< 30 seconds (Automatic Multi-PoP Failover)",
        recovery_point_objective: "0 seconds (Continuous Write-Ahead Log Stream)",
        primary_storage: "NVMe SAN Cluster (10.0 TB Pool, 583.7 GB Distributed Cache)",
        cold_storage_target: "AWS S3 Multi-Region Glacier Vault (ap-southeast-1 & ap-northeast-1)",
        cross_region_sync: "Active (JK-01 <-> SG-01 <-> TY-01)"
      },
      edge_nodes: topologyNodes,
      active_sessions: activeSessions,
      storage_allocations: heavySteamStorage,
      compliance: "Cloud Computing UTS 2026 Audit Ready"
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `omniplay_cluster_backup_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 200);
  };

  const handleDownloadPdf = () => {
    window.open('/api/export?format=pdf', '_blank');
  };

  const topologyNodes = [
    {
      id: 'JK-01',
      name: 'Jakarta Edge PoP',
      subnet: '10.240.12.0/24',
      gpu: '4x NVIDIA RTX 4070 Ti (48GB VRAM)',
      cpu: 'AMD EPYC 7763 (64 Cores / 128 Threads)',
      storage: '2.4 TB Gen5 NVMe Array',
      ping: '1.8ms (Local IX)',
      status: 'active',
      load: '84%'
    },
    {
      id: 'SG-01',
      name: 'Singapore Equinix SG1',
      subnet: '10.241.16.0/24',
      gpu: '2x NVIDIA RTX 4080 (32GB VRAM)',
      cpu: 'Intel Xeon Platinum 8380',
      storage: '3.8 TB Gen5 NVMe Array',
      ping: '3.9ms (Cross-Border)',
      status: 'active',
      load: '78%'
    },
    {
      id: 'TY-01',
      name: 'Tokyo Core Node',
      subnet: '10.242.20.0/24',
      gpu: '2x NVIDIA RTX 4090 (48GB VRAM)',
      cpu: 'AMD EPYC 9654 Genoa',
      storage: '4.2 TB Gen5 NVMe Array',
      ping: '28.4ms (Trans-Pacific)',
      status: 'active',
      load: '62%'
    },
    {
      id: 'US-WEST-01',
      name: 'Oregon Silicon Hub',
      subnet: '10.243.0.0/24',
      gpu: '4x NVIDIA RTX 4090 (96GB VRAM)',
      cpu: 'AMD EPYC 9654 Genoa',
      storage: '8.0 TB Gen5 NVMe Array',
      ping: '142ms (Standby Route)',
      status: 'standby',
      load: '12%'
    }
  ];

  const heavySteamStorage = [
    {
      title: 'Grand Theft Auto V',
      appId: 271590,
      size: '110.4 GB',
      format: 'Ext4 Block Virtual Volume',
      clientsBenefiting: '21 Concurrent Users',
      savings: 'Saved 2.3 TB client storage'
    },
    {
      title: 'Red Dead Redemption 2',
      appId: 1174180,
      size: '119.8 GB',
      format: 'NVMe Striped Direct-IO',
      clientsBenefiting: '14 Concurrent Users',
      savings: 'Saved 1.6 TB client storage'
    },
    {
      title: 'Forza Horizon 5',
      appId: 1551360,
      size: '135.2 GB',
      format: 'Zero-Copy Shared Cache',
      clientsBenefiting: '18 Concurrent Users',
      savings: 'Saved 2.4 TB client storage'
    },
    {
      title: 'Cyberpunk 2077: Phantom Liberty',
      appId: 1091500,
      size: '88.3 GB',
      format: 'Pre-Warmed Shader Cache Pool',
      clientsBenefiting: '29 Concurrent Users',
      savings: 'Saved 2.5 TB client storage'
    },
    {
      title: 'Black Myth: Wukong',
      appId: 2358720,
      size: '130.0 GB',
      format: 'DirectStorage 1.2 Bypass Pool',
      clientsBenefiting: '35 Concurrent Users',
      savings: 'Saved 4.5 TB client storage'
    }
  ];

  const activeSessions = [
    {
      id: 'SES-9921',
      user: 'Budi (JKT-South)',
      game: 'Cyberpunk 2077',
      node: 'JK-01',
      clientSpecs: 'Asus VivoBook 14 • Core i3-1005G1 • 4GB RAM • Intel UHD',
      playtime: '1h 42m',
      vram: '11.8 GB',
      latency: '2.1ms',
      stream: '4K @ 120 FPS'
    },
    {
      id: 'SES-9922',
      user: 'Reyhan (Bandung)',
      game: 'Forza Horizon 5',
      node: 'JK-01',
      clientSpecs: 'Lenovo IdeaPad Slim 3 • Celeron N4020 • 4GB RAM',
      playtime: '0h 58m',
      vram: '14.2 GB',
      latency: '2.4ms',
      stream: '1440p @ 120 FPS'
    },
    {
      id: 'SES-9923',
      user: 'Siti (Surabaya)',
      game: 'Red Dead Redemption 2',
      node: 'SG-01',
      clientSpecs: 'MacBook Air M1 (2020) • 8GB RAM • Safari WebRTC',
      playtime: '2h 15m',
      vram: '15.1 GB',
      latency: '4.2ms',
      stream: '4K @ 120 FPS'
    },
    {
      id: 'SES-9924',
      user: 'Kevin (Medan)',
      game: 'Black Myth: Wukong',
      node: 'SG-01',
      clientSpecs: 'Dell Inspiron 3505 • AMD Ryzen 3 3200U • 8GB RAM',
      playtime: '3h 05m',
      vram: '21.5 GB',
      latency: '3.9ms',
      stream: '4K @ 120 FPS'
    }
  ];

  const recentCloudAuditLogs = [
    {
      time: '20:12:44',
      type: 'DATA_BACKUP_S3',
      target: 'S3-AP-SOUTHEAST-1',
      detail: 'Automated WAL snapshot #BKP-8842 written to S3 Glacier Vault (4.8 GB)',
      badge: 'SYNCED',
      badgeColor: 'green'
    },
    {
      time: '20:08:15',
      type: 'SESSION_PROVISION',
      target: 'JK-01 (RTX 4070 Ti)',
      detail: 'Isolated container instance allocated for user Budi (Zero local footprint)',
      badge: 'ISOLATED',
      badgeColor: 'cyan'
    },
    {
      time: '19:58:30',
      type: 'KEY_ROTATION',
      target: 'CORE-AUTH-SERVICE',
      detail: 'JWT access token signing key & WebRTC DTLS certificates rotated seamlessly',
      badge: 'ENCRYPTED',
      badgeColor: 'purple'
    },
    {
      time: '19:51:15',
      type: 'CLOUD_SAVE_SYNC',
      target: 'SG-01 ⟷ JK-01',
      detail: 'Bidirectional user save state sync verified across edge clusters (RPO=0)',
      badge: 'REPLICATED',
      badgeColor: 'green'
    },
    {
      time: '19:42:00',
      type: 'FIREWALL_PROBE',
      target: 'EDGE-CLOUDFLARE',
      detail: 'Rate limit threshold deflected 14 burst requests from unknown scanner IP',
      badge: 'DEFLECTED',
      badgeColor: 'amber'
    },
    {
      time: '19:30:10',
      type: 'SAN_STORAGE_AUDIT',
      target: 'ALL-EDGE-POPS',
      detail: '583.7 GB distributed Steam game cache verified across 4 cluster nodes',
      badge: 'VERIFIED',
      badgeColor: 'cyan'
    }
  ];

  return (
    <div className="admin-infra-container">
      {/* 1. Infrastructure Manager Header */}
      <header className="infra-header">
        <div>
          <div className="infra-admin-badge">
            <ShieldCheck style={{ width: 14, height: 14 }} />
            MODE ADMIN • INFRASTRUKTUR & SERVER CLOUD
          </div>
          <h1 className="infra-title">Pusat Kendali Server & Keamanan Cloud</h1>
          <p className="infra-sub">
            Status real-time server, keamanan data, backup database otomatis, dan perbaikan sistem.
          </p>
        </div>

        <div className="infra-header-actions">
          <button 
            onClick={() => setShowArchModal(true)}
            className="infra-blueprint-btn"
            type="button"
          >
            <Layers style={{ width: 16, height: 16, color: 'var(--neon-cyan)' }} />
            <span>Lihat Arsitektur Cloud (3D Blueprint)</span>
          </button>

          <button 
            onClick={handleReboot}
            disabled={rebooting}
            className={`infra-reboot-btn ${rebooting ? 'disabled' : ''}`}
            type="button"
          >
            {rebooting ? <Loader2 className="btn-spinner" /> : <Power style={{ width: 16, height: 16 }} />}
            <span>{rebooting ? 'Merestart Server...' : 'Restart Server Node'}</span>
          </button>
        </div>
      </header>

      {/* 2. Quick Cloud Health & Capacity Metrics Strip */}
      <div className="infra-metrics-strip">
        <div className="infra-metric-box">
          <div className="infra-metric-icon-wrap cyan">
            <Server style={{ width: 22, height: 22 }} />
          </div>
          <div className="infra-metric-info">
            <span className="infra-metric-label">Server Cloud</span>
            <span className="infra-metric-value">4 Node Aktif</span>
            <span className="infra-metric-sub">128 vCPU • 512 GB RAM</span>
          </div>
        </div>

        <div className="infra-metric-box">
          <div className="infra-metric-icon-wrap purple">
            <Zap style={{ width: 22, height: 22 }} />
          </div>
          <div className="infra-metric-info">
            <span className="infra-metric-label">Memory GPU (VRAM)</span>
            <span className="infra-metric-value">72 GB / 96 GB</span>
            <span className="infra-metric-sub">Beban 75% • RTX 40-Series</span>
          </div>
        </div>

        <div className="infra-metric-box">
          <div className="infra-metric-icon-wrap emerald">
            <ShieldCheck style={{ width: 22, height: 22 }} />
          </div>
          <div className="infra-metric-info">
            <span className="infra-metric-label">Keamanan & Firewall</span>
            <span className="infra-metric-value">AES-256 GCM</span>
            <span className="infra-metric-sub">TLS 1.3 • 0 Ancaman</span>
          </div>
        </div>

        <div className="infra-metric-box">
          <div className="infra-metric-icon-wrap amber">
            <Database style={{ width: 22, height: 22 }} />
          </div>
          <div className="infra-metric-info">
            <span className="infra-metric-label">Status Backup</span>
            <span className="infra-metric-value">S3 Multi-Region</span>
            <span className="infra-metric-sub">Pemulihan &lt; 30 detik</span>
          </div>
        </div>
      </div>

      {/* 2.5. PUSAT PERBAIKAN & PENGATURAN MASALAH (TROUBLESHOOTING & REPAIR CONSOLE) */}
      <section className="infra-repair-section">
        <div className="infra-repair-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Wrench style={{ width: 20, height: 20, color: 'var(--neon-cyan)' }} />
            <div>
              <h2 className="section-heading" style={{ margin: 0 }}>Pusat Perbaikan & Solusi Masalah Sistem</h2>
              <p style={{ margin: '4px 0 0 0', fontSize: 13, color: 'var(--text-muted)' }}>
                Pengaturan cepat untuk mendiagnosis dan memperbaiki error pada server node, game, keamanan, dan backup data.
              </p>
            </div>
          </div>
          <span className="topology-badge" style={{ borderColor: 'rgba(0, 210, 255, 0.4)', color: 'var(--neon-cyan)' }}>
            <Sparkles style={{ width: 13, height: 13, marginRight: 5, verticalAlign: 'middle' }} />
            Auto-Repair Engine Aktif
          </span>
        </div>

        {repairSuccessMessage && (
          <div className="repair-toast-banner">
            <CheckCircle2 style={{ width: 18, height: 18, flexShrink: 0 }} />
            <span>{repairSuccessMessage}</span>
          </div>
        )}

        <div className="infra-troubleshoot-grid">
          {/* Card 1: Cloud Nodes */}
          <div className="repair-card cyan">
            <div className="repair-card-header">
              <div className="repair-title-group">
                <div className="repair-icon-box">
                  <Server style={{ width: 18, height: 18 }} />
                </div>
                <div>
                  <h3 className="repair-card-title">Perbaikan Cloud Nodes</h3>
                  <p className="repair-desc">Atasi server overload, latency tinggi, atau memory GPU bocor.</p>
                </div>
              </div>
              <span className="repair-status-tag ok">Normal</span>
            </div>
            <div className="repair-buttons-list">
              <button 
                type="button" 
                className="repair-action-btn"
                disabled={!!activeRepairing}
                onClick={() => handleRunRepair('node_balance', 'Ratakan Beban & Restart Worker Node', 'Beban server berhasil diratakan ke node SG-01 dan worker JK-01 telah direstart.')}
              >
                {activeRepairing === 'node_balance' ? <Loader2 className="btn-spinner" /> : <RefreshCw style={{ width: 14, height: 14 }} />}
                <span>{activeRepairing === 'node_balance' ? 'Memperbaiki...' : 'Ratakan Beban & Restart Worker'}</span>
              </button>
              <button 
                type="button" 
                className="repair-action-btn"
                disabled={!!activeRepairing}
                onClick={() => handleRunRepair('gpu_flush', 'Kosongkan Cache VRAM GPU', 'Cache VRAM 72GB berhasil dibersihkan. Performa rendering GPU kembali optimal.')}
              >
                {activeRepairing === 'gpu_flush' ? <Loader2 className="btn-spinner" /> : <Zap style={{ width: 14, height: 14 }} />}
                <span>{activeRepairing === 'gpu_flush' ? 'Mengosongkan...' : 'Kosongkan Cache VRAM GPU'}</span>
              </button>
              <button 
                type="button" 
                className="repair-action-btn"
                disabled={!!activeRepairing}
                onClick={() => handleRunRepair('network_route', 'Reset Rute Jaringan & DNS', 'Rute WebRTC dioptimalkan ulang. Ping turun ke 1.8ms stabil.')}
              >
                {activeRepairing === 'network_route' ? <Loader2 className="btn-spinner" /> : <Wifi style={{ width: 14, height: 14 }} />}
                <span>{activeRepairing === 'network_route' ? 'Mereset...' : 'Reset Jaringan & Flush DNS'}</span>
              </button>
            </div>
          </div>

          {/* Card 2: Game Streaming */}
          <div className="repair-card purple">
            <div className="repair-card-header">
              <div className="repair-title-group">
                <div className="repair-icon-box">
                  <Gamepad2 style={{ width: 18, height: 18 }} />
                </div>
                <div>
                  <h3 className="repair-card-title">Perbaikan Game & Stream</h3>
                  <p className="repair-desc">Atasi game crash, shader error/patah-patah, atau sesi rental macet.</p>
                </div>
              </div>
              <span className="repair-status-tag ok">Optimal</span>
            </div>
            <div className="repair-buttons-list">
              <button 
                type="button" 
                className="repair-action-btn"
                disabled={!!activeRepairing}
                onClick={() => handleRunRepair('shader_recompile', 'Compile Ulang Shader Cache', 'Shader cache Vulkan/DirectX berhasil dibuat ulang. Masalah stuttering teratasi.')}
              >
                {activeRepairing === 'shader_recompile' ? <Loader2 className="btn-spinner" /> : <Layers style={{ width: 14, height: 14 }} />}
                <span>{activeRepairing === 'shader_recompile' ? 'Memproses...' : 'Perbaiki & Buat Ulang Shader'}</span>
              </button>
              <button 
                type="button" 
                className="repair-action-btn"
                disabled={!!activeRepairing}
                onClick={() => handleRunRepair('verify_game_files', 'Verifikasi Integritas File Game', 'Seluruh file game terverifikasi cocok dengan Steam Storage SAN tanpa corrupt.')}
              >
                {activeRepairing === 'verify_game_files' ? <Loader2 className="btn-spinner" /> : <CheckCircle2 style={{ width: 14, height: 14 }} />}
                <span>{activeRepairing === 'verify_game_files' ? 'Memverifikasi...' : 'Verifikasi File Game'}</span>
              </button>
              <button 
                type="button" 
                className="repair-action-btn"
                disabled={!!activeRepairing}
                onClick={() => handleRunRepair('kill_stuck_session', 'Hentikan Sesi Rental Macet', 'Sesi cloud yang membeku telah dihentikan paksa dan pod KVM telah dilepas.')}
              >
                {activeRepairing === 'kill_stuck_session' ? <Loader2 className="btn-spinner" /> : <Power style={{ width: 14, height: 14 }} />}
                <span>{activeRepairing === 'kill_stuck_session' ? 'Menghentikan...' : 'Paksa Tutup Sesi Macet'}</span>
              </button>
            </div>
          </div>

          {/* Card 3: Security & Firewall */}
          <div className="repair-card emerald">
            <div className="repair-card-header">
              <div className="repair-title-group">
                <div className="repair-icon-box">
                  <ShieldCheck style={{ width: 18, height: 18 }} />
                </div>
                <div>
                  <h3 className="repair-card-title">Perbaikan Keamanan Data</h3>
                  <p className="repair-desc">Atasi IP mencurigakan, token kadaluarsa, atau anomali firewall.</p>
                </div>
              </div>
              <span className="repair-status-tag ok">Aman</span>
            </div>
            <div className="repair-buttons-list">
              <button 
                type="button" 
                className="repair-action-btn"
                disabled={!!activeRepairing}
                onClick={() => handleRunRepair('rotate_keys', 'Rotasi Kunci Enkripsi & Token', 'Kunci sesi AES-256 dan token JWT berhasil diperbarui demi keamanan.')}
              >
                {activeRepairing === 'rotate_keys' ? <Loader2 className="btn-spinner" /> : <Key style={{ width: 14, height: 14 }} />}
                <span>{activeRepairing === 'rotate_keys' ? 'Memperbarui...' : 'Perbarui Kunci Enkripsi'}</span>
              </button>
              <button 
                type="button" 
                className="repair-action-btn"
                disabled={!!activeRepairing}
                onClick={() => handleRunRepair('firewall_reset', 'Reset Aturan Firewall & IP', 'Daftar blokir IP dibersihkan dan filter perlindungan DDoS diperbarui.')}
              >
                {activeRepairing === 'firewall_reset' ? <Loader2 className="btn-spinner" /> : <ShieldAlert style={{ width: 14, height: 14 }} />}
                <span>{activeRepairing === 'firewall_reset' ? 'Mereset...' : 'Reset Aturan Firewall'}</span>
              </button>
              <button 
                type="button" 
                className="repair-action-btn"
                disabled={!!activeRepairing}
                onClick={() => handleRunRepair('sandbox_rebuild', 'Isolasi Ulang Container Sandbox', 'Container sandbox pengguna disegel ulang. Tidak ada jejak data lokal tersisa.')}
              >
                {activeRepairing === 'sandbox_rebuild' ? <Loader2 className="btn-spinner" /> : <Lock style={{ width: 14, height: 14 }} />}
                <span>{activeRepairing === 'sandbox_rebuild' ? 'Mengisolasi...' : 'Isolasi Ulang Container'}</span>
              </button>
            </div>
          </div>

          {/* Card 4: Backup & Data Recovery */}
          <div className="repair-card amber">
            <div className="repair-card-header">
              <div className="repair-title-group">
                <div className="repair-icon-box">
                  <Database style={{ width: 18, height: 18 }} />
                </div>
                <div>
                  <h3 className="repair-card-title">Perbaikan Backup Data</h3>
                  <p className="repair-desc">Atasi sinkronisasi tertunda, snapshot error, atau disk storage penuh.</p>
                </div>
              </div>
              <span className="repair-status-tag ok">Sinkron</span>
            </div>
            <div className="repair-buttons-list">
              <button 
                type="button" 
                className="repair-action-btn"
                disabled={!!activeRepairing}
                onClick={() => handleRunRepair('force_s3_sync', 'Paksa Sinkronisasi S3 Cold Vault', 'Sinkronisasi paksa ke bucket S3 Multi-Region selesai. 100% data tersinkron.')}
              >
                {activeRepairing === 'force_s3_sync' ? <Loader2 className="btn-spinner" /> : <Cloud style={{ width: 14, height: 14 }} />}
                <span>{activeRepairing === 'force_s3_sync' ? 'Menyinkronkan...' : 'Paksa Sinkronkan ke S3'}</span>
              </button>
              <button 
                type="button" 
                className="repair-action-btn"
                disabled={!!activeRepairing}
                onClick={() => handleRunRepair('verify_snapshots', 'Periksa & Perbaiki File Snapshot', 'Integritas hash snapshot terverifikasi valid dan siap untuk Disaster Recovery.')}
              >
                {activeRepairing === 'verify_snapshots' ? <Loader2 className="btn-spinner" /> : <CheckCircle2 style={{ width: 14, height: 14 }} />}
                <span>{activeRepairing === 'verify_snapshots' ? 'Memeriksa...' : 'Periksa Integritas Snapshot'}</span>
              </button>
              <button 
                type="button" 
                className="repair-action-btn"
                disabled={!!activeRepairing}
                onClick={() => handleRunRepair('clean_stale_snapshots', 'Bersihkan Snapshot Lama', 'Snapshot usang (>30 hari) berhasil dihapus. Kapasitas NVMe bertambah 48 GB.')}
              >
                {activeRepairing === 'clean_stale_snapshots' ? <Loader2 className="btn-spinner" /> : <RefreshCw style={{ width: 14, height: 14 }} />}
                <span>{activeRepairing === 'clean_stale_snapshots' ? 'Membersihkan...' : 'Bersihkan Snapshot Lama'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2.6. AUTO-SCALING & RAPID ELASTICITY ORCHESTRATOR (UTS POIN 1 / NIST STANDARD) */}
      <section className="infra-autoscaling-section">
        <div className="section-title-strip">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <TrendingUp style={{ width: 18, height: 18, color: 'var(--neon-purple)' }} />
            <h2 className="section-heading">Auto-Scaling & Rapid Elasticity Orchestrator</h2>
          </div>
          <span className="topology-badge" style={{ borderColor: 'rgba(168, 85, 247, 0.4)', color: 'var(--neon-purple)' }}>
            NIST Standard: Rapid Elasticity
          </span>
        </div>

        {spikeNotification && (
          <div className={`spike-notification-banner ${isSimulatingSpike ? 'warning' : 'success'}`}>
            {isSimulatingSpike ? <Loader2 className="btn-spinner" /> : <CheckCircle2 style={{ width: 18, height: 18, flexShrink: 0 }} />}
            <span>{spikeNotification}</span>
          </div>
        )}

        <div className="autoscaling-panel-grid">
          {/* Left: Live Scaling Status & Spike Simulation */}
          <div className="scaling-status-card">
            <div className="scaling-card-top">
              <div>
                <h3 className="scaling-card-title">Status Armada Worker Pods</h3>
                <p className="scaling-card-sub">Manajemen elastisitas pod KVM/Docker GPU secara dinamis</p>
              </div>
              <span className={`scaling-live-tag ${isSimulatingSpike ? 'scaling-up' : 'stable'}`}>
                {isSimulatingSpike ? '⚡ SCALING OUT (+2 PODS)' : 'STABIL (NORMAL)'}
              </span>
            </div>

            <div className="scaling-metrics-row">
              <div className="scale-metric-box">
                <span className="lbl">Worker Pods Aktif</span>
                <span className="val cyan">{activeWorkerPods} / 12 Max</span>
              </div>
              <div className="scale-metric-box">
                <span className="lbl">Cluster CPU Load</span>
                <span className={`val ${isSimulatingSpike ? 'amber' : 'green'}`}>{currentCpuLoad}</span>
              </div>
              <div className="scale-metric-box">
                <span className="lbl">Cooldown Anti-Flap</span>
                <span className="val">180 Detik</span>
              </div>
            </div>

            <div className="scaling-action-bar">
              <button 
                type="button" 
                className="btn-spike-test"
                onClick={handleSimulateSpike}
                disabled={isSimulatingSpike}
              >
                {isSimulatingSpike ? (
                  <>
                    <Loader2 className="btn-spinner" />
                    <span>MENSIMULASIKAN LONJAKAN TRAFFIC...</span>
                  </>
                ) : (
                  <>
                    <Zap style={{ width: 16, height: 16 }} />
                    <span>Simulasi Lonjakan Traffic (Spike Test)</span>
                  </>
                )}
              </button>
              <p className="spike-hint">
                *Klik untuk mendemonstrasikan ke dosen bagaimana sistem otomatis menambah worker pod saat traffic melonjak.
              </p>
            </div>
          </div>

          {/* Right: Elasticity Threshold Rules */}
          <div className="scaling-rules-card">
            <h3 className="scaling-card-title">Aturan Pemicu Elastisitas (Scaling Rules):</h3>
            
            <div className="rules-list">
              <div className="rule-item">
                <div className="rule-info">
                  <strong>Scale-Out (Tambah Kapasitas Otomatis):</strong>
                  <span>Jika CPU &gt; 80% atau GPU VRAM &gt; 85% selama 3 menit berturut-turut.</span>
                </div>
                <span className="rule-pill green">AKTIF (+1 Pod)</span>
              </div>

              <div className="rule-item">
                <div className="rule-info">
                  <strong>Scale-In (Hemat Biaya saat Idle):</strong>
                  <span>Jika server idle selama 15 menit, pod cadangan dimatikan untuk efisiensi FinOps.</span>
                </div>
                <span className="rule-pill cyan">AKTIF (-1 Pod)</span>
              </div>

              <div className="rule-item">
                <div className="rule-info">
                  <strong>Proteksi Anti-Flapping:</strong>
                  <span>Mencegah pembuatan/penghapusan pod berulang-ulang dalam rentang waktu singkat.</span>
                </div>
                <span className="rule-pill purple">AKTIF (180s)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2.7. CLOUD FINOPS & BIAYA INFRASTRUKTUR (UTS POIN 2 / NIST MEASURED SERVICE) */}
      <section className="infra-finops-section">
        <div className="section-title-strip">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <DollarSign style={{ width: 18, height: 18, color: 'var(--neon-emerald)' }} />
            <h2 className="section-heading">Cloud Cost & FinOps Telemetry (Measured Service)</h2>
          </div>
          <span className="topology-badge" style={{ borderColor: 'rgba(16, 185, 129, 0.4)', color: 'var(--neon-emerald)' }}>
            NIST Standard: Pay-As-You-Go
          </span>
        </div>

        <div className="finops-grid">
          {/* OpEx Cards */}
          <div className="finops-card">
            <div className="finops-card-top">
              <span className="finops-label">GPU Cluster Compute</span>
              <span className="finops-rate">$0.85 / jam</span>
            </div>
            <p className="finops-total">$294.50 <span className="unit">/ bln</span></p>
            <p className="finops-sub">RTX 40-Series Dedicated Pools</p>
          </div>

          <div className="finops-card">
            <div className="finops-card-top">
              <span className="finops-label">WebRTC Egress Bandwidth</span>
              <span className="finops-rate">$0.04 / GB</span>
            </div>
            <p className="finops-total">$88.40 <span className="unit">/ bln</span></p>
            <p className="finops-sub">2.21 TB AV1 Encoded Datagrams</p>
          </div>

          <div className="finops-card">
            <div className="finops-card-top">
              <span className="finops-label">AWS S3 Cold Vault Storage</span>
              <span className="finops-rate">$0.023 / GB</span>
            </div>
            <p className="finops-total">$14.80 <span className="unit">/ bln</span></p>
            <p className="finops-sub">Multi-Region Snapshot Replication</p>
          </div>

          <div className="finops-card">
            <div className="finops-card-top">
              <span className="finops-label">Cloudflare Anti-DDoS Shield</span>
              <span className="finops-rate">Flat Tier</span>
            </div>
            <p className="finops-total">$30.00 <span className="unit">/ bln</span></p>
            <p className="finops-sub">Enterprise L3/L4/L7 Defense</p>
          </div>
        </div>

        {/* Financial Summary Strip */}
        <div className="finops-summary-strip">
          <div className="finops-stat-item">
            <span className="lbl">Total Biaya Operasional (OpEx):</span>
            <span className="val red">$427.70 / bulan</span>
          </div>
          <div className="finops-stat-item">
            <span className="lbl">Estimasi Pendapatan Sewa (Rental Rev):</span>
            <span className="val green">$1,340.00 / bulan</span>
          </div>
          <div className="finops-stat-item highlight">
            <span className="lbl">Margin Keuntungan (Gross Margin):</span>
            <span className="val cyan">+68.1% (Sangat Sehat)</span>
          </div>
        </div>
      </section>

      {/* 2.8. SLA COMMITMENT & DATACENTER HIGH AVAILABILITY (UTS POIN 3) */}
      <section className="infra-sla-section">
        <div className="section-title-strip">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Award style={{ width: 18, height: 18, color: 'var(--neon-cyan)' }} />
            <h2 className="section-heading">Service Level Agreement (SLA) & High Availability</h2>
          </div>
          <span className="topology-badge" style={{ borderColor: 'rgba(0, 210, 255, 0.4)', color: 'var(--neon-cyan)' }}>
            Tier-3 Datacenter Standard
          </span>
        </div>

        <div className="sla-dashboard-grid">
          {/* SLA Metric 1 */}
          <div className="sla-metric-box">
            <div className="sla-gauge-row">
              <span className="sla-pct-text">99.98%</span>
              <span className="sla-status-tag active">SLA TERPENUHI</span>
            </div>
            <h4 className="sla-metric-title">Target Uptime Tahunan</h4>
            <p className="sla-metric-desc">Toleransi downtime maksimal &lt; 1.75 jam per tahun (setara &lt; 8.6 menit / bulan).</p>
          </div>

          {/* SLA Metric 2 */}
          <div className="sla-metric-box">
            <div className="sla-gauge-row">
              <span className="sla-pct-text emerald">&lt; 45 Detik</span>
              <span className="sla-status-tag active">SANGAT CEPAT</span>
            </div>
            <h4 className="sla-metric-title">MTTR (Mean Time To Recovery)</h4>
            <p className="sla-metric-desc">Waktu rata-rata pemulihan otomatis jika salah satu worker node mengalami kendala.</p>
          </div>

          {/* SLA Regional PoP List */}
          <div className="sla-regional-card">
            <h4 className="sla-card-title">Ketersediaan Edge PoP per Wilayah:</h4>
            <div className="sla-pops-list">
              <div className="sla-pop-row">
                <span className="pop-name">🇮🇩 Jakarta (JK-01 Core)</span>
                <span className="pop-val">99.99% (0 Insiden)</span>
              </div>
              <div className="sla-pop-row">
                <span className="pop-name">🇸🇬 Singapura (SG-01 Standby)</span>
                <span className="pop-val">99.98% (0 Insiden)</span>
              </div>
              <div className="sla-pop-row">
                <span className="pop-name">🇯🇵 Tokyo (TY-01 Edge)</span>
                <span className="pop-val">99.95% (0 Insiden)</span>
              </div>
              <div className="sla-pop-row">
                <span className="pop-name">🇺🇸 Oregon (US-WEST-01)</span>
                <span className="pop-val standby">100.0% (Standby Route)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CLOUD DATA SECURITY & THREAT SHIELD (UTS POIN 7) */}
      <section className="infra-security-section">
        <div className="section-title-strip">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Shield style={{ width: 18, height: 18, color: 'var(--neon-emerald)' }} />
            <h2 className="section-heading">Cloud Data Security & Threat Shield Architecture</h2>
          </div>
          <span className="topology-badge" style={{ borderColor: 'rgba(16, 185, 129, 0.4)', color: 'var(--neon-emerald)' }}>
            Enterprise Security Level 5
          </span>
        </div>

        <div className="infra-security-grid">
          {/* Pillar 1 */}
          <div className="security-pillar-card active">
            <div className="security-pillar-header">
              <div className="security-pillar-title-group">
                <div className="security-pillar-icon" style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.12)' }}>
                  <Layers style={{ width: 16, height: 16 }} />
                </div>
                <h3 className="security-pillar-title">Zero Local Persistence & Sandbox</h3>
              </div>
              <span className="security-badge-live">ENFORCED</span>
            </div>
            <div className="security-detail-list">
              <div className="security-detail-item">
                <span className="sec-key">Container Engine:</span>
                <span className="sec-val cyan">Docker/KVM Ephemeral Pods</span>
              </div>
              <div className="security-detail-item">
                <span className="sec-key">Client Privacy:</span>
                <span className="sec-val green">Auto-Wiped on Session End</span>
              </div>
              <div className="security-detail-item">
                <span className="sec-key">Anti-Cheat Safety:</span>
                <span className="sec-val">VAC & Steam Guard Safe</span>
              </div>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="security-pillar-card active">
            <div className="security-pillar-header">
              <div className="security-pillar-title-group">
                <div className="security-pillar-icon" style={{ color: '#00d2ff', background: 'rgba(0, 210, 255, 0.12)' }}>
                  <Lock style={{ width: 16, height: 16 }} />
                </div>
                <h3 className="security-pillar-title">End-to-End Cryptography</h3>
              </div>
              <span className="security-badge-live">ENCRYPTED</span>
            </div>
            <div className="security-detail-list">
              <div className="security-detail-item">
                <span className="sec-key">API Transport:</span>
                <span className="sec-val cyan">TLS 1.3 / 256-bit SSL</span>
              </div>
              <div className="security-detail-item">
                <span className="sec-key">Stream Protocol:</span>
                <span className="sec-val green">WebRTC DTLS-SRTP sub-2ms</span>
              </div>
              <div className="security-detail-item">
                <span className="sec-key">Payment Tokens:</span>
                <span className="sec-val">PCI-DSS Gateway Compliant</span>
              </div>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="security-pillar-card active">
            <div className="security-pillar-header">
              <div className="security-pillar-title-group">
                <div className="security-pillar-icon" style={{ color: '#a78bfa', background: 'rgba(139, 92, 246, 0.12)' }}>
                  <Key style={{ width: 16, height: 16 }} />
                </div>
                <h3 className="security-pillar-title">Identity & Access Management</h3>
              </div>
              <span className="security-badge-live">ACTIVE</span>
            </div>
            <div className="security-detail-list">
              <div className="security-detail-item">
                <span className="sec-key">Session Cookie:</span>
                <span className="sec-val green">HttpOnly JWT (XSS Proof)</span>
              </div>
              <div className="security-detail-item">
                <span className="sec-key">RBAC Isolation:</span>
                <span className="sec-val cyan">Admin L5 vs Public User</span>
              </div>
              <div className="security-detail-item">
                <span className="sec-key">Token Expiry:</span>
                <span className="sec-val">24h Auto-Revocation</span>
              </div>
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="security-pillar-card active">
            <div className="security-pillar-header">
              <div className="security-pillar-title-group">
                <div className="security-pillar-icon" style={{ color: '#fbbf24', background: 'rgba(245, 158, 11, 0.12)' }}>
                  <ShieldAlert style={{ width: 16, height: 16 }} />
                </div>
                <h3 className="security-pillar-title">Edge Perimeter & Anti-DDoS</h3>
              </div>
              <span className="security-badge-live">SHIELDED</span>
            </div>
            <div className="security-detail-list">
              <div className="security-detail-item">
                <span className="sec-key">DDoS Defense:</span>
                <span className="sec-val green">Cloudflare Enterprise L3/L4/L7</span>
              </div>
              <div className="security-detail-item">
                <span className="sec-key">Threats Deflected:</span>
                <span className="sec-val green">142 Probes (0 Breaches)</span>
              </div>
              <div className="security-detail-item">
                <span className="sec-key">Rate Limit Threshold:</span>
                <span className="sec-val">100 req/min per IP</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CLOUD BACKUP & DISASTER RECOVERY ORCHESTRATOR (UTS POIN 8) */}
      <section className="infra-backup-section">
        <div className="section-title-strip">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Database style={{ width: 18, height: 18, color: 'var(--neon-cyan)' }} />
            <h2 className="section-heading">Automated Backup & Disaster Recovery Center</h2>
          </div>
          <span className="topology-badge" style={{ borderColor: 'rgba(0, 210, 255, 0.4)', color: '#00d2ff' }}>
            RTO &lt; 30s • RPO = 0s
          </span>
        </div>

        <div className="backup-control-card">
          <div className="backup-header-row">
            <div className="backup-title-wrap">
              <div className="backup-title-icon">
                <Cloud style={{ width: 22, height: 22 }} />
              </div>
              <div>
                <h3 className="backup-title">Sinkronisasi Otomatis Database & Data Cloud</h3>
                <p className="backup-desc">
                  Pencadangan data terus-menerus antara node Jakarta dan Singapore, serta tersimpan aman di S3.
                </p>
              </div>
            </div>

            <div className="backup-actions-row">
              <button 
                type="button" 
                className="btn-backup-trigger"
                onClick={handleTriggerBackup}
                disabled={isBackingUp}
              >
                {isBackingUp ? (
                  <>
                    <Loader2 className="btn-spinner" />
                    <span>Membuat Backup...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw style={{ width: 15, height: 15 }} />
                    <span>Buat Backup Data Sekarang</span>
                  </>
                )}
              </button>

              <button 
                type="button" 
                className="btn-backup-download"
                onClick={handleDownloadBackup}
                title="Download data backup format JSON"
              >
                <Download style={{ width: 14, height: 14 }} />
                <span>Unduh Data Backup (JSON)</span>
              </button>

              <button 
                type="button" 
                className="btn-backup-download"
                onClick={handleDownloadPdf}
                title="Download laporan resmi PDF"
              >
                <FileText style={{ width: 14, height: 14 }} />
                <span>Unduh Laporan (PDF)</span>
              </button>
            </div>
          </div>

          {/* Success Banner when backup triggered */}
          {backupSuccessMessage && (
            <div className="backup-banner-success">
              <CheckCircle2 style={{ width: 18, height: 18, flexShrink: 0 }} />
              <span>{backupSuccessMessage}</span>
            </div>
          )}

          {/* Backup Health & Telemetry Metrics Chips */}
          <div className="backup-metrics-row">
            <div className="backup-status-chip">
              <span className="chip-lbl">Backup Terakhir</span>
              <span className="chip-val green">{lastBackupTime}</span>
            </div>
            <div className="backup-status-chip">
              <span className="chip-lbl">Replikasi Antar Server</span>
              <span className="chip-val cyan">Jakarta ⟷ Singapore Aktif</span>
            </div>
            <div className="backup-status-chip">
              <span className="chip-lbl">Penyimpanan Aman</span>
              <span className="chip-val">AWS S3 Glacier Multi-Region</span>
            </div>
            <div className="backup-status-chip">
              <span className="chip-lbl">Verifikasi Data</span>
              <span className="chip-val green">Valid (SHA-256 Aman)</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. LIVE CLOUD DATA & TELEMETRY AUDIT LOGS */}
      <div className="infra-audit-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Activity style={{ width: 18, height: 18, color: 'var(--neon-purple)' }} />
            <div>
              <h3 className="sessions-title">Catatan Riwayat & Aktivitas Server Real-Time</h3>
              <p className="sessions-sub">Riwayat aktivitas server, pembuatan container game, dan backup data secara langsung</p>
            </div>
          </div>
          <span className="sessions-badge">Status Aktif</span>
        </div>

        <table className="infra-audit-table">
          <thead>
            <tr>
              <th>Waktu</th>
              <th>Jenis Aktivitas</th>
              <th>Target Server</th>
              <th>Deskripsi</th>
              <th>Status Keamanan</th>
            </tr>
          </thead>
          <tbody>
            {recentCloudAuditLogs.map((log, idx) => (
              <tr key={idx}>
                <td className="mono" style={{ color: 'var(--neon-cyan)' }}>{log.time}</td>
                <td className="mono" style={{ fontWeight: 700 }}>{log.type}</td>
                <td className="mono" style={{ color: '#e2e8f0' }}>{log.target}</td>
                <td style={{ color: 'var(--text-muted)' }}>{log.detail}</td>
                <td>
                  <span className={`audit-badge ${log.badgeColor}`}>
                    {log.badge}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 6. Visual Server Topology Grid */}
      <div className="topology-section">
        <div className="section-title-strip">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Server style={{ width: 18, height: 18, color: 'var(--neon-cyan)' }} />
            <h2 className="section-heading">Multi-Region Server Topology & Edge PoPs</h2>
          </div>
          <span className="topology-badge">4 Cloud Edge PoPs Operational</span>
        </div>

        <div className="topology-grid">
          {topologyNodes.map((node) => (
            <div key={node.id} className={`topology-node-card ${node.status}`}>
              <div className="top-node-header">
                <div>
                  <span className="node-id-pill">{node.id}</span>
                  <h3 className="node-name">{node.name}</h3>
                  <p className="node-subnet mono">{node.subnet}</p>
                </div>
                <span className={`node-live-status ${node.status}`}>
                  <span className="status-dot" />
                  {node.status.toUpperCase()}
                </span>
              </div>

              <div className="node-specs-block">
                <div className="spec-row">
                  <span className="spec-k"><Zap style={{ width: 12, height: 12 }} /> GPU Array:</span>
                  <span className="spec-v cyan">{node.gpu}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-k"><Cpu style={{ width: 12, height: 12 }} /> Host CPU:</span>
                  <span className="spec-v">{node.cpu}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-k"><Database style={{ width: 12, height: 12 }} /> Storage Pool:</span>
                  <span className="spec-v">{node.storage}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-k"><Globe style={{ width: 12, height: 12 }} /> Edge RTT:</span>
                  <span className="spec-v emerald">{node.ping}</span>
                </div>
              </div>

              <div className="node-load-meter">
                <div className="load-label-row">
                  <span>Cluster Load</span>
                  <span className="load-pct">{node.load}</span>
                </div>
                <div className="load-track">
                  <div className="load-fill" style={{ width: node.load }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Storage Allocations for Heavy Steam Games (Critical for Low-Spec Clients) */}
      <div className="storage-allocation-card">
        <div className="storage-card-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <HardDrive style={{ width: 18, height: 18, color: 'var(--neon-emerald)' }} />
              <h2 className="section-heading">Cloud Storage Allocations for Heavy Steam Games</h2>
            </div>
            <p className="section-sub">
              Heavy AAA titles pre-cached on NVMe arrays so low-spec clients (with 128GB/256GB SSDs) never need to download or store games locally.
            </p>
          </div>
          <span className="storage-total-pill">
            <strong>583.7 GB</strong> Total Distributed Steam Cache
          </span>
        </div>

        <div className="heavy-games-grid">
          {heavySteamStorage.map((game) => (
            <div key={game.appId} className="heavy-game-item">
              <div className="heavy-game-title-row">
                <span className="heavy-title">{game.title}</span>
                <span className="heavy-size-tag">{game.size}</span>
              </div>
              <div className="heavy-format-row">
                <span className="heavy-format mono">{game.format}</span>
                <span className="heavy-clients">{game.clientsBenefiting}</span>
              </div>
              <div className="heavy-savings-banner">
                <CheckCircle2 style={{ width: 12, height: 12, color: 'var(--neon-emerald)' }} />
                <span>{game.savings}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 8. Active User Sessions with Client PC Specs & Current Playtime */}
      <div className="infra-sessions-card">
        <div className="sessions-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Users style={{ width: 18, height: 18, color: 'var(--neon-cyan)' }} />
            <div>
              <h3 className="sessions-title">Active Playtime Sessions & Client PC Specs</h3>
              <p className="sessions-sub">Hardware specs of user client PCs streaming from cloud nodes</p>
            </div>
          </div>
          <span className="sessions-badge">4 Concurrent Streams</span>
        </div>

        <table className="sessions-table">
          <thead>
            <tr>
              <th>Session ID</th>
              <th>User</th>
              <th>Running Title</th>
              <th>Node</th>
              <th>Client PC Hardware (Low-Spec Device)</th>
              <th>Playtime</th>
              <th>VRAM</th>
              <th>Latency</th>
              <th>Profile</th>
            </tr>
          </thead>
          <tbody>
            {activeSessions.map((sess) => (
              <tr key={sess.id}>
                <td className="mono">{sess.id}</td>
                <td><strong>{sess.user}</strong></td>
                <td>{sess.game}</td>
                <td><span className="node-chip">{sess.node}</span></td>
                <td>
                  <div className="client-specs-wrap">
                    <Laptop style={{ width: 13, height: 13, color: 'var(--neon-cyan)' }} />
                    <span className="specs-text">{sess.clientSpecs}</span>
                  </div>
                </td>
                <td>
                  <div className="playtime-wrap">
                    <Clock style={{ width: 12, height: 12, color: 'var(--neon-amber)' }} />
                    <span className="mono">{sess.playtime}</span>
                  </div>
                </td>
                <td className="cyan mono">{sess.vram}</td>
                <td><span className="lat-chip">{sess.latency}</span></td>
                <td>
                  <span className="status-live-chip">
                    <span className="chip-dot" /> {sess.stream}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cloud Architecture 3D Blueprint Modal (UTS Poin 4) */}
      <CloudArchitectureModal 
        isOpen={showArchModal} 
        onClose={() => setShowArchModal(false)} 
      />

    </div>
  );
}
