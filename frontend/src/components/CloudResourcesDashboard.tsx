import { useState } from 'react';
import { 
  Cpu, Zap, HardDrive, Globe, Server, Power, Loader2, 
  Users, ShieldCheck, Database, Laptop, Clock, 
  CheckCircle2, ArrowRight, Shield, Lock, Key, RefreshCw, 
  Download, Cloud, FileText, AlertTriangle, Activity, 
  Wifi, Layers, ShieldAlert
} from 'lucide-react';

export default function CloudResourcesDashboard() {
  const [rebooting, setRebooting] = useState(false);
  const [rebootStep, setRebootStep] = useState(0);

  // Backup & Disaster Recovery state
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [lastBackupTime, setLastBackupTime] = useState('2 hours ago (03:00 UTC)');
  const [backupSuccessMessage, setBackupSuccessMessage] = useState<string | null>(null);

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

  const handleTriggerBackup = () => {
    if (isBackingUp) return;
    setIsBackingUp(true);
    setBackupSuccessMessage(null);

    // Simulate multi-region snapshot creation & S3 replication
    setTimeout(() => {
      setIsBackingUp(false);
      const now = new Date();
      const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastBackupTime(`Just now (${timeStr} WIB)`);
      setBackupSuccessMessage(`Snapshot #OMNI-BKP-${Date.now().toString().slice(-6)} created successfully! Encrypted with AES-256 and replicated across S3 Cold Pool & SG-01 Hot Standby.`);
      
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
            ADMINISTRATOR MODE • CLOUD INFRASTRUCTURE & TOPOLOGY
          </div>
          <h1 className="infra-title">Cloud Infrastructure & Security Command Center</h1>
          <p className="infra-sub">
            Real-time server topology, edge security matrix, multi-region database backups, and client hardware telemetry.
          </p>
        </div>

        <button 
          onClick={handleReboot}
          disabled={rebooting}
          className={`infra-reboot-btn ${rebooting ? 'disabled' : ''}`}
          type="button"
        >
          {rebooting ? <Loader2 className="btn-spinner" /> : <Power style={{ width: 16, height: 16 }} />}
          <span>{rebooting ? 'REBOOTING HARDWARE...' : 'REBOOT NODE CLUSTER'}</span>
        </button>
      </header>

      {/* 2. Quick Cloud Health & Capacity Metrics Strip */}
      <div className="infra-metrics-strip">
        <div className="infra-metric-box">
          <div className="infra-metric-icon-wrap cyan">
            <Server style={{ width: 22, height: 22 }} />
          </div>
          <div className="infra-metric-info">
            <span className="infra-metric-label">Compute Fleet</span>
            <span className="infra-metric-value">4 Edge Nodes</span>
            <span className="infra-metric-sub">128 vCPU • 512 GB RAM</span>
          </div>
        </div>

        <div className="infra-metric-box">
          <div className="infra-metric-icon-wrap purple">
            <Zap style={{ width: 22, height: 22 }} />
          </div>
          <div className="infra-metric-info">
            <span className="infra-metric-label">Cluster GPU VRAM</span>
            <span className="infra-metric-value">72 GB / 96 GB</span>
            <span className="infra-metric-sub">75% Load • RTX 40-Series</span>
          </div>
        </div>

        <div className="infra-metric-box">
          <div className="infra-metric-icon-wrap emerald">
            <ShieldCheck style={{ width: 22, height: 22 }} />
          </div>
          <div className="infra-metric-info">
            <span className="infra-metric-label">Security & Firewall</span>
            <span className="infra-metric-value">AES-256 GCM</span>
            <span className="infra-metric-sub">TLS 1.3 • 0 Active Threats</span>
          </div>
        </div>

        <div className="infra-metric-box">
          <div className="infra-metric-icon-wrap amber">
            <Database style={{ width: 22, height: 22 }} />
          </div>
          <div className="infra-metric-info">
            <span className="infra-metric-label">Cloud Backup State</span>
            <span className="infra-metric-value">S3 Multi-Region</span>
            <span className="infra-metric-sub">RTO &lt; 30s • RPO = 0s</span>
          </div>
        </div>
      </div>

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
                <h3 className="backup-title">Continuous Cloud State & Database Synchronization</h3>
                <p className="backup-desc">
                  Multi-region WAL replication between Jakarta Core (JK-01) and Singapore Hot Standby (SG-01) with daily snapshots archived to S3.
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
                    <span>CREATING CLOUD SNAPSHOT...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw style={{ width: 15, height: 15 }} />
                    <span>TRIGGER MANUAL BACKUP SNAPSHOT</span>
                  </>
                )}
              </button>

              <button 
                type="button" 
                className="btn-backup-download"
                onClick={handleDownloadBackup}
                title="Download full cluster state in JSON format"
              >
                <Download style={{ width: 14, height: 14 }} />
                <span>DOWNLOAD SYSTEM AUDIT (.JSON)</span>
              </button>

              <button 
                type="button" 
                className="btn-backup-download"
                onClick={handleDownloadPdf}
                title="Download official PDF report via backend API"
              >
                <FileText style={{ width: 14, height: 14 }} />
                <span>EXPORT REPORT (.PDF)</span>
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
              <span className="chip-lbl">Last Snapshot Archive</span>
              <span className="chip-val green">{lastBackupTime}</span>
            </div>
            <div className="backup-status-chip">
              <span className="chip-lbl">Cross-PoP Replication</span>
              <span className="chip-val cyan">JK-01 ⟷ SG-01 Synchronous</span>
            </div>
            <div className="backup-status-chip">
              <span className="chip-lbl">Target Cold Storage</span>
              <span className="chip-val">AWS S3 Glacier Multi-Region</span>
            </div>
            <div className="backup-status-chip">
              <span className="chip-lbl">Integrity Verification</span>
              <span className="chip-val green">SHA-256 Checksum Passed</span>
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
              <h3 className="sessions-title">Real-Time Cloud Infrastructure & Security Audit Logs</h3>
              <p className="sessions-sub">Live audit trail of cluster events, container provisioning, and backup executions</p>
            </div>
          </div>
          <span className="sessions-badge">Live System Feed</span>
        </div>

        <table className="infra-audit-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Event Type</th>
              <th>Target Server / Service</th>
              <th>Action Description</th>
              <th>Security State</th>
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

    </div>
  );
}
