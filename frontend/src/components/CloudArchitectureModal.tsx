import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { 
  X, Server, ShieldCheck, Layers, Globe, Database, 
  Cpu, Zap, Cloud, Laptop, Smartphone, CheckCircle2, 
  Activity, ArrowDown, ExternalLink, ShieldAlert
} from 'lucide-react';

// 3D Interactive Cloud Node Cluster Scene
function CloudCluster3D({ isHovered }: { isHovered: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);
  const coreRef = useRef<THREE.Mesh>(null!);
  const ringRef1 = useRef<THREE.Mesh>(null!);
  const ringRef2 = useRef<THREE.Mesh>(null!);
  const node1Ref = useRef<THREE.Mesh>(null!);
  const node2Ref = useRef<THREE.Mesh>(null!);
  const node3Ref = useRef<THREE.Mesh>(null!);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const speed = isHovered ? 1.8 : 0.8;

    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25 * speed;
    }

    if (coreRef.current) {
      coreRef.current.rotation.x += delta * 0.4 * speed;
      coreRef.current.rotation.y += delta * 0.6 * speed;
      const pulse = 1 + Math.sin(t * 2) * 0.06;
      coreRef.current.scale.set(pulse, pulse, pulse);
    }

    if (ringRef1.current) {
      ringRef1.current.rotation.z += delta * 0.5 * speed;
      ringRef1.current.rotation.x += delta * 0.2 * speed;
    }

    if (ringRef2.current) {
      ringRef2.current.rotation.z -= delta * 0.4 * speed;
      ringRef2.current.rotation.y += delta * 0.3 * speed;
    }

    // Orbiting PoP Nodes
    if (node1Ref.current) {
      node1Ref.current.position.x = Math.cos(t * 1.2) * 2.2;
      node1Ref.current.position.z = Math.sin(t * 1.2) * 2.2;
      node1Ref.current.position.y = Math.sin(t * 2.4) * 0.4;
    }

    if (node2Ref.current) {
      node2Ref.current.position.x = Math.cos(t * 1.2 + 2.1) * 2.2;
      node2Ref.current.position.z = Math.sin(t * 1.2 + 2.1) * 2.2;
      node2Ref.current.position.y = Math.cos(t * 2.0) * 0.4;
    }

    if (node3Ref.current) {
      node3Ref.current.position.x = Math.cos(t * 1.2 + 4.2) * 2.2;
      node3Ref.current.position.z = Math.sin(t * 1.2 + 4.2) * 2.2;
      node3Ref.current.position.y = Math.sin(t * 1.8) * 0.4;
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.9} />
      <pointLight position={[6, 6, 6]} intensity={3.5} color="#00f0ff" />
      <pointLight position={[-6, -6, -6]} intensity={2.5} color="#a855f7" />
      <pointLight position={[0, 4, 0]} intensity={2.0} color="#10b981" />

      {/* Central High-Performance Compute Core */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1.1, 1]} />
        <meshPhysicalMaterial
          color="#00d2ff"
          emissive="#0055aa"
          emissiveIntensity={0.6}
          roughness={0.15}
          metalness={0.85}
          clearcoat={1.0}
          wireframe={false}
        />
      </mesh>

      {/* Outer Wireframe Shield */}
      <mesh>
        <icosahedronGeometry args={[1.35, 1]} />
        <meshStandardMaterial
          color="#a855f7"
          wireframe
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* Orbiting Multi-Region Routing Rings */}
      <mesh ref={ringRef1} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[2.0, 0.03, 16, 100]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.65} />
      </mesh>

      <mesh ref={ringRef2} rotation={[-Math.PI / 3, Math.PI / 6, 0]}>
        <torusGeometry args={[2.3, 0.025, 16, 100]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.55} />
      </mesh>

      {/* Orbiting PoP Satellites (JK-01, SG-01, TY-01) */}
      <mesh ref={node1Ref}>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.7} />
      </mesh>

      <mesh ref={node2Ref}>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={0.7} />
      </mesh>

      <mesh ref={node3Ref}>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={0.7} />
      </mesh>
    </group>
  );
}

interface CloudArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CloudArchitectureModal({ isOpen, onClose }: CloudArchitectureModalProps) {
  const [activeTier, setActiveTier] = useState<number>(3);
  const [isHovered3D, setIsHovered3D] = useState(false);

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const architectureTiers = [
    {
      tier: 1,
      title: 'Tier 1: Client Edge Layer (Perangkat Pengguna)',
      shortName: 'Client Edge',
      icon: <Laptop style={{ width: 18, height: 18 }} />,
      color: '#00f0ff',
      badge: 'WebRTC & HID',
      components: [
        'Browser Klien / WebRTC HTML5 Player (AV1 / H.264)',
        'Perangkat Low-Spec: Laptop Intel Celeron / HP Android / Tablet',
        'OmniRemote: Virtual Gamepad & Touch Surface via UDP DataChannel',
        'Zero Local Storage footprint: Game tidak diunduh ke PC klien'
      ],
      description: 'Pengguna dapat bermain game AAA (100GB+) menggunakan laptop spek rendah atau smartphone tanpa perlu instalasi game ke perangkat lokal.'
    },
    {
      tier: 2,
      title: 'Tier 2: Edge Perimeter & Security Shield',
      shortName: 'Edge Security',
      icon: <ShieldCheck style={{ width: 18, height: 18 }} />,
      color: '#10b981',
      badge: 'L3/L4/L7 Defense',
      components: [
        'Cloudflare Enterprise DDoS Shield (0 Breaches Deflected)',
        'Enkripsi TLS 1.3 & AES-256-GCM End-to-End',
        'Autentikasi Aman: HttpOnly JWT Cookie Shield (XSS/CSRF Proof)',
        'Rate-Limiting Otomatis: 100 req/menit per IP Address'
      ],
      description: 'Lapisan perlindungan terdepan yang memvalidasi setiap koneksi pengguna dan menangkis ancaman serangan siber sebelum mencapai server.'
    },
    {
      tier: 3,
      title: 'Tier 3: Ingress & Intelligent Global Load Balancer',
      shortName: 'Load Balancer',
      icon: <Globe style={{ width: 18, height: 18 }} />,
      color: '#a855f7',
      badge: 'Anycast DNS',
      components: [
        'Geo-DNS Anycast Routing: Menghubungkan ke PoP terdekat (< 5ms RTT)',
        'Algoritma Least-Connections + GPU VRAM-Aware Balancing',
        'Health Probes Aktif (Setiap 5 detik cek status worker node)',
        'Automatic Failover ke Node Singapura (SG-01) jika Jakarta (JK-01) sibuk'
      ],
      description: 'Mengatur pembagian beban koneksi pemain secara seimbang ke server terdekat dengan latensi terendah dan performa terbaik.'
    },
    {
      tier: 4,
      title: 'Tier 4: Cluster GPU Worker Pods (Rapid Elasticity)',
      shortName: 'Compute Cluster',
      icon: <Cpu style={{ width: 18, height: 18 }} />,
      color: '#fbbf24',
      badge: 'Docker & KVM',
      components: [
        'Armada GPU: NVIDIA RTX 4070 Ti, RTX 4080, RTX 4090 (96GB VRAM Pool)',
        'Host CPU: AMD EPYC 7763 & Genoa (128 vCPU Multi-Thread)',
        'Ephemeral Pod Sandbox: Data pengguna terisolasi & auto-wipe saat sewa selesai',
        'Auto-Scaler Otomatis: Menambah pod saat beban > 85% & mematikan pod saat idle'
      ],
      description: 'Mesin komputasi utama yang merender grafis game secara real-time dan mengalirkan video stream 120 FPS dengan latensi sub-4ms.'
    },
    {
      tier: 5,
      title: 'Tier 5: Distributed Storage & S3 Disaster Recovery',
      shortName: 'Storage & Backup',
      icon: <Database style={{ width: 18, height: 18 }} />,
      color: '#00d2ff',
      badge: 'NVMe + AWS S3',
      components: [
        'Primary Storage: 10.0 TB NVMe Gen5 SAN Cluster (7,200 MB/s Read)',
        'Distributed Steam Cache: 583.7 GB data game siap streaming instan',
        'Replikasi Sinkronus WAL: Jakarta Core (JK-01) ⟷ Singapore Standby (SG-01)',
        'Cold Vault Backup: AWS S3 Glacier Multi-Region (RTO < 30s, RPO = 0s)'
      ],
      description: 'Pusat penyimpanan berkecepatan tinggi yang menyimpan file game dan mencadangkan data secara otomatis ke multi-region cloud storage.'
    }
  ];

  return (
    <div className="arch-modal-overlay" onClick={onClose}>
      <div className="arch-modal-card" onClick={(e) => e.stopPropagation()}>
        
        {/* Modal Header */}
        <div className="arch-modal-header">
          <div className="arch-modal-title-group">
            <div className="arch-badge">
              <Layers style={{ width: 14, height: 14 }} />
              BLUEPRINT KOMPUTASI AWAN • STANDAR NIST & ARSITEKTUR CLOUD GAMING
            </div>
            <h2 className="arch-title">Diagram Arsitektur Sistem Cloud OmniPlay</h2>
            <p className="arch-subtitle">
              Visualisasi alur komputasi awan 5-Tier dari perangkat pengguna, perimeter keamanan, load balancer, cluster GPU worker, hingga penyimpanan S3.
            </p>
          </div>

          <button 
            type="button" 
            className="arch-close-btn"
            onClick={onClose}
            aria-label="Tutup blueprint arsitektur"
          >
            <X style={{ width: 20, height: 20 }} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="arch-modal-body">
          
          {/* Top Section: Interactive 3D Three.js Cluster View */}
          <div 
            className="arch-3d-showcase-box"
            onMouseEnter={() => setIsHovered3D(true)}
            onMouseLeave={() => setIsHovered3D(false)}
          >
            <div className="arch-3d-canvas-wrap">
              <Canvas camera={{ position: [0, 0, 5.2], fov: 45 }}>
                <CloudCluster3D isHovered={isHovered3D} />
              </Canvas>
            </div>

            <div className="arch-3d-overlay-info">
              <span className="live-pulse-chip">
                <span className="pulse-dot" /> 3D Live Cluster Core View
              </span>
              <h3 className="arch-core-name">OmniPlay Multi-Region Cloud Fabric</h3>
              <p className="arch-core-meta">
                Arsitektur terdistribusi terhubung melalui Anycast WebRTC sub-4ms antara JK-01 (Jakarta), SG-01 (Singapura), dan TY-01 (Tokyo).
              </p>
              <div className="arch-core-tags">
                <span>NIST Cloud Model: IaaS / PaaS Hybrid</span>
                <span>Deployment: Multi-Cloud Hybrid (Equinix + AWS S3)</span>
                <span>Auto-Scaling: Elastic KVM Pods</span>
              </div>
            </div>
          </div>

          {/* Middle Section: Interactive 5-Tier Pipeline Tabs */}
          <div className="arch-tiers-nav">
            {architectureTiers.map((t) => (
              <button
                key={t.tier}
                type="button"
                className={`arch-tier-tab-btn ${activeTier === t.tier ? 'active' : ''}`}
                onClick={() => setActiveTier(t.tier)}
              >
                <span className="tab-icon" style={{ color: t.color }}>{t.icon}</span>
                <span className="tab-label">{t.shortName}</span>
                <span className="tab-badge" style={{ borderColor: t.color, color: t.color }}>
                  Tier {t.tier}
                </span>
              </button>
            ))}
          </div>

          {/* Active Tier Detailed Card */}
          {(() => {
            const currentTier = architectureTiers.find(t => t.tier === activeTier) || architectureTiers[2];
            return (
              <div className="arch-tier-detail-card" style={{ borderColor: `${currentTier.color}40` }}>
                <div className="tier-card-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div className="tier-icon-circle" style={{ background: `${currentTier.color}20`, color: currentTier.color, border: `1px solid ${currentTier.color}50` }}>
                      {currentTier.icon}
                    </div>
                    <div>
                      <h4 className="tier-full-title">{currentTier.title}</h4>
                      <p className="tier-summary-text">{currentTier.description}</p>
                    </div>
                  </div>
                  <span className="tier-spec-pill" style={{ color: currentTier.color, borderColor: `${currentTier.color}60` }}>
                    {currentTier.badge}
                  </span>
                </div>

                <div className="tier-components-grid">
                  {currentTier.components.map((comp, idx) => (
                    <div key={idx} className="tier-comp-item">
                      <CheckCircle2 style={{ width: 16, height: 16, color: currentTier.color, flexShrink: 0 }} />
                      <span>{comp}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Bottom Flow Pipeline Strip */}
          <div className="arch-flow-strip">
            <h4 className="flow-title">Alur Data Aliran Cloud Gaming (End-to-End Pipeline):</h4>
            <div className="flow-steps-row">
              <div className="flow-step-box">
                <span className="step-num">1</span>
                <strong>Input Klien</strong>
                <span>Gamepad / Mouse (UDP)</span>
              </div>
              <ArrowDown className="flow-arrow" />
              <div className="flow-step-box">
                <span className="step-num">2</span>
                <strong>Cloudflare Shield</strong>
                <span>DDoS Filter & TLS 1.3</span>
              </div>
              <ArrowDown className="flow-arrow" />
              <div className="flow-step-box">
                <span className="step-num">3</span>
                <strong>Load Balancer</strong>
                <span>Pilih PoP Terdekat (JK/SG)</span>
              </div>
              <ArrowDown className="flow-arrow" />
              <div className="flow-step-box">
                <span className="step-num">4</span>
                <strong>GPU Worker Pod</strong>
                <span>Render Game 120 FPS</span>
              </div>
              <ArrowDown className="flow-arrow" />
              <div className="flow-step-box">
                <span className="step-num">5</span>
                <strong>Storage & Backup</strong>
                <span>NVMe SAN & S3 Vault</span>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="arch-modal-footer">
          <div className="footer-compliance-text">
            <ShieldCheck style={{ width: 16, height: 16, color: 'var(--neon-emerald)' }} />
            <span>Dokumentasi Arsitektur Siap Audit untuk Tugas / Ujian Komputasi Awan (UTS 2026)</span>
          </div>

          <button 
            type="button" 
            className="arch-btn-done"
            onClick={onClose}
          >
            Tutup Blueprint
          </button>
        </div>

      </div>
    </div>
  );
}
