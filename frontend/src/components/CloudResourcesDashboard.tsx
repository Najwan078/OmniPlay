import { useState } from 'react';
import { 
  Cpu, Zap, HardDrive, Globe, Server, Power, Loader2, 
  Terminal, Users, ShieldCheck, Database, Laptop, Clock, 
  CheckCircle2, ArrowRight
} from 'lucide-react';

export default function CloudResourcesDashboard() {
  const [rebooting, setRebooting] = useState(false);
  const [rebootStep, setRebootStep] = useState(0);

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

  // Server Topology Data
  const topologyNodes = [
    {
      id: 'SG-01',
      name: 'Singapore Primary Hub',
      subnet: 'ap-southeast-1a',
      gpu: '8x NVIDIA RTX 4090 (24GB)',
      cpu: 'AMD EPYC 9654 (96C/192T)',
      storage: '32 TB NVMe SAN',
      ping: '3.8 ms',
      load: '76%',
      status: 'active'
    },
    {
      id: 'JK-01',
      name: 'Jakarta Edge Cluster',
      subnet: 'id-jkt-edge',
      gpu: '4x NVIDIA RTX 4080 (16GB)',
      cpu: 'AMD EPYC 9554 (64C/128T)',
      storage: '16 TB NVMe Gen5',
      ping: '2.1 ms',
      load: '58%',
      status: 'active'
    },
    {
      id: 'TY-01',
      name: 'Tokyo Supercluster',
      subnet: 'ap-northeast-1b',
      gpu: '4x NVIDIA H100 NVLink (80GB)',
      cpu: 'Intel Xeon Platinum 8480+',
      storage: '64 TB All-Flash Lustre',
      ping: '28.0 ms',
      load: '42%',
      status: 'active'
    },
    {
      id: 'HK-01',
      name: 'Hong Kong Relay Node',
      subnet: 'ap-east-1a',
      gpu: '4x RTX 4090 vGPU',
      cpu: 'AMD EPYC 9354 (32C/64T)',
      storage: '16 TB NVMe Tier',
      ping: '18.5 ms',
      load: '20%',
      status: 'standby'
    }
  ];

  // Storage Allocations for Heavy Steam Games (Saves storage for low-spec clients)
  const heavySteamStorage = [
    {
      title: 'Baldur\'s Gate 3',
      appId: 1086940,
      size: '152.0 GB',
      format: 'DirectStorage NVMe',
      clientsBenefiting: '24 Low-Spec Clients',
      savings: 'Clients save 152GB local disk'
    },
    {
      title: 'Cyberpunk 2077',
      appId: 1091500,
      size: '142.4 GB',
      format: 'NVLink Fast Cache',
      clientsBenefiting: '38 Low-Spec Clients',
      savings: 'Clients save 142GB local disk'
    },
    {
      title: 'Black Myth: Wukong',
      appId: 2358720,
      size: '130.2 GB',
      format: 'High-Throughput SAN',
      clientsBenefiting: '19 Low-Spec Clients',
      savings: 'Clients save 130GB local disk'
    },
    {
      title: 'EA SPORTS FC™ 25',
      appId: 2669320,
      size: '98.6 GB',
      format: 'PCIe 5.0 Tier 1',
      clientsBenefiting: '42 Low-Spec Clients',
      savings: 'Clients save 98GB local disk'
    },
    {
      title: 'Elden Ring',
      appId: 1245620,
      size: '60.5 GB',
      format: 'ZFS Instant Snapshot',
      clientsBenefiting: '15 Low-Spec Clients',
      savings: 'Clients save 60GB local disk'
    }
  ];

  // Active Sessions with Client PC Specs & Current Playtime
  const activeSessions = [
    {
      id: 'sess-801',
      user: 'Player 1 (Active User)',
      game: 'EA SPORTS FC™ 25',
      node: 'SG-01',
      clientSpecs: 'Intel Core i3-7100 • 8GB RAM • Intel HD Graphics 620',
      playtime: '2h 14m',
      vram: '16.2 GB',
      latency: '3.8ms',
      stream: '4K @ 120 FPS'
    },
    {
      id: 'sess-802',
      user: 'Sarah_99',
      game: 'Baldur\'s Gate 3',
      node: 'SG-01',
      clientSpecs: 'MacBook Air 2017 • 8GB LPDDR3 • Intel HD 6000',
      playtime: '1h 48m',
      vram: '14.8 GB',
      latency: '4.2ms',
      stream: '1440p @ 60 FPS'
    },
    {
      id: 'sess-803',
      user: 'Alex_Pro',
      game: 'Black Myth: Wukong',
      node: 'JK-01',
      clientSpecs: 'Lenovo ThinkPad T480 • 8GB • Intel UHD 620',
      playtime: '0h 52m',
      vram: '18.9 GB',
      latency: '2.1ms',
      stream: '4K @ 60 FPS'
    },
    {
      id: 'sess-804',
      user: 'David_Gamer',
      game: 'Cyberpunk 2077',
      node: 'SG-01',
      clientSpecs: 'Dell Inspiron 3505 • AMD Ryzen 3 3200U • 8GB RAM',
      playtime: '3h 05m',
      vram: '21.5 GB',
      latency: '3.9ms',
      stream: '4K @ 120 FPS'
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
          <h1 className="infra-title">Cloud Nodes & Fleet Topology</h1>
          <p className="infra-sub">
            Real-time server topology, shared cloud storage allocations for 100GB+ AAA games, and connected client PC hardware telemetry.
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

      {/* 2. Visual Server Topology Grid */}
      <div className="topology-section">
        <div className="section-title-strip">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Server style={{ width: 18, height: 18, color: 'var(--neon-cyan)' }} />
            <h2 className="section-heading">Multi-Region Server Topology</h2>
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

      {/* 3. Storage Allocations for Heavy Steam Games (Critical for Low-Spec Clients) */}
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

      {/* 4. Active User Sessions with Client PC Specs & Current Playtime */}
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
