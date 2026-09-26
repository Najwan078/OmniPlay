import React, { useRef, useState, useEffect, useMemo, Component, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Gamepad2, ShieldAlert, Lock, User, ArrowRight, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import * as THREE from 'three';
import { useUser } from '../context/UserContext';
import { authApi } from '../services/api';
import { supabase } from '../supabase';

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement | string,
        options: {
          sitekey: string;
          theme?: 'light' | 'dark' | 'auto';
          size?: 'normal' | 'compact' | 'flexible';
          callback?: (token: string) => void;
          'error-callback'?: (errorCode: string) => void;
          'expired-callback'?: () => void;
        }
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

// Resilient Error Boundary for WebGL Contexts
class CanvasErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.warn("3D Canvas fallback activated:", error);
  }

  render() {
    if (this.state.hasError) {
      return <div className="login-fallback-bg" />;
    }
    return this.props.children;
  }
}

// 1. Tilted Deep-Blue Planetary Satellite Rings & Rotating Geodesic Sphere
function PlanetarySphereAndSatellites({
  mouse,
  isExiting,
  isMobile,
}: {
  mouse: React.MutableRefObject<{ targetX: number; targetY: number }>;
  isExiting: boolean;
  isMobile: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const innerCoreRef = useRef<THREE.Mesh>(null!);
  const ring1GroupRef = useRef<THREE.Group>(null!);
  const ring2GroupRef = useRef<THREE.Group>(null!);
  const ring1MeshRef = useRef<THREE.Mesh>(null!);
  const ring2MeshRef = useRef<THREE.Mesh>(null!);
  const satNode1Ref = useRef<THREE.Group>(null!);
  const satNode2Ref = useRef<THREE.Group>(null!);
  const mainGroupRef = useRef<THREE.Group>(null!);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const accel = isExiting ? 3.5 : 1.0;

    // Central Sphere continuous rotation
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.16 * accel;
      meshRef.current.rotation.y += delta * 0.22 * accel;
    }
    if (innerCoreRef.current) {
      const scale = 1 + Math.sin(t * 2.5) * 0.08;
      innerCoreRef.current.scale.set(scale, scale, scale);
    }

    // Satellite Ring 1: Smooth planetary orbit on inclined axis (deep dark blue)
    if (ring1MeshRef.current) {
      ring1MeshRef.current.rotation.z += delta * 0.38 * accel;
    }
    if (satNode1Ref.current) {
      satNode1Ref.current.rotation.z += delta * 0.38 * accel;
    }
    if (ring1GroupRef.current) {
      ring1GroupRef.current.rotation.y += delta * 0.06 * accel;
    }

    // Satellite Ring 2: Smooth planetary orbit on secondary tilted axis
    if (ring2MeshRef.current) {
      ring2MeshRef.current.rotation.z -= delta * 0.32 * accel;
    }
    if (satNode2Ref.current) {
      satNode2Ref.current.rotation.z -= delta * 0.32 * accel;
    }
    if (ring2GroupRef.current) {
      ring2GroupRef.current.rotation.y -= delta * 0.05 * accel;
    }

    // Gentle mouse reaction (damped on mobile)
    if (mainGroupRef.current) {
      const factor = isMobile ? 0.2 : 0.45;
      mainGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        mainGroupRef.current.rotation.y,
        mouse.current.targetX * factor,
        0.05
      );
      mainGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        mainGroupRef.current.rotation.x,
        -mouse.current.targetY * (factor * 0.8),
        0.05
      );
      mainGroupRef.current.position.y = (isMobile ? 0.25 : 0.1) + Math.sin(t * 0.8) * (isMobile ? 0.06 : 0.12);
    }
  });

  const groupScale = isMobile ? 0.44 : 1.0;

  return (
    <group 
      ref={mainGroupRef} 
      position={[0, isMobile ? 0.25 : 0.1, 0]}
      scale={[groupScale, groupScale, groupScale]}
    >
      {/* Central Wireframe Geodesic Sphere */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[2.5, 2]} />
        <meshStandardMaterial
          color="#00d2ff"
          emissive="#005577"
          emissiveIntensity={0.32}
          wireframe
          transparent
          opacity={0.4}
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>

      {/* Pulsating Glowing Core */}
      <mesh ref={innerCoreRef}>
        <sphereGeometry args={[1.02, 32, 32]} />
        <meshStandardMaterial
          color="#0a192f"
          emissive="#00d2ff"
          emissiveIntensity={0.8}
          roughness={0.1}
          metalness={0.95}
        />
      </mesh>

      {/* SATELLITE RING 1: Deep Dark Blue (#0f3460) on realistic tilted planetary axis */}
      <group ref={ring1GroupRef} rotation={[0.58, 0.22, 0.35]}>
        <mesh ref={ring1MeshRef}>
          <torusGeometry args={[3.45, 0.038, 16, 120]} />
          <meshStandardMaterial
            color="#0f3460"
            emissive="#16213e"
            emissiveIntensity={1.3}
            roughness={0.2}
            metalness={0.85}
          />
        </mesh>
        {/* Orbiting Planetary Satellite Probe */}
        <group ref={satNode1Ref}>
          <mesh position={[3.45, 0, 0]}>
            <sphereGeometry args={[0.09, 16, 16]} />
            <meshStandardMaterial
              color="#00d2ff"
              emissive="#38bdf8"
              emissiveIntensity={1.8}
            />
          </mesh>
        </group>
      </group>

      {/* SATELLITE RING 2: Deep Dark Blue (#16213e) on cross-tilted planetary axis */}
      <group ref={ring2GroupRef} rotation={[-0.88, -0.3, -0.45]}>
        <mesh ref={ring2MeshRef}>
          <torusGeometry args={[3.9, 0.032, 16, 120]} />
          <meshStandardMaterial
            color="#16213e"
            emissive="#0f3460"
            emissiveIntensity={1.1}
            roughness={0.2}
            metalness={0.85}
          />
        </mesh>
        {/* Orbiting Planetary Satellite Probe */}
        <group ref={satNode2Ref}>
          <mesh position={[-3.9, 0, 0]}>
            <sphereGeometry args={[0.075, 16, 16]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#00d2ff"
              emissiveIntensity={1.6}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
}

// 2. METEOR PARTICLES: Stretched, fast-moving shooting stars with trail effect along velocity vector
interface MeteorSpec {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  length: number;
  radius: number;
  color: THREE.Color;
}

function MeteorParticles() {
  const meteorCount = 42;
  const groupRef = useRef<THREE.Group>(null!);

  const meteorsData = useMemo(() => {
    const list: MeteorSpec[] = [];
    const colors = [
      new THREE.Color('#00d2ff'),
      new THREE.Color('#38bdf8'),
      new THREE.Color('#ffffff'),
      new THREE.Color('#60a5fa'),
      new THREE.Color('#93c5fd'),
    ];

    for (let i = 0; i < meteorCount; i++) {
      const speed = 14 + Math.random() * 16;
      // Trajectory: diagonal downward velocity
      const dir = new THREE.Vector3(
        0.5 + (Math.random() - 0.5) * 0.25,
        -1,
        -0.35 + (Math.random() - 0.5) * 0.3
      ).normalize();

      const vel = dir.clone().multiplyScalar(speed);
      const pos = new THREE.Vector3(
        (Math.random() - 0.5) * 36 - 6,
        (Math.random() - 0.5) * 28 + 8,
        (Math.random() - 0.5) * 20 - 4
      );

      list.push({
        pos,
        vel,
        length: 1.2 + Math.random() * 2.0,
        radius: 0.035 + Math.random() * 0.04,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    return list;
  }, [meteorCount]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const children = groupRef.current.children;

    for (let i = 0; i < children.length; i++) {
      const group = children[i] as THREE.Group;
      const data = meteorsData[i];
      if (!data) continue;

      // Move along velocity vector
      data.pos.addScaledVector(data.vel, delta);

      // Respawn if beyond visible cosmic envelope
      if (data.pos.y < -18 || data.pos.x > 25 || data.pos.z < -22) {
        data.pos.set(
          -22 - Math.random() * 10,
          16 + Math.random() * 8,
          (Math.random() - 0.5) * 16
        );
      }

      group.position.copy(data.pos);
    }
  });

  const upVec = useMemo(() => new THREE.Vector3(0, 1, 0), []);

  return (
    <group ref={groupRef}>
      {meteorsData.map((meteor, idx) => {
        const dir = meteor.vel.clone().normalize();
        const quat = new THREE.Quaternion().setFromUnitVectors(upVec, dir);

        return (
          <group key={idx} position={meteor.pos} quaternion={quat}>
            {/* Glowing Meteor Sphere Head */}
            <mesh position={[0, meteor.length * 0.5, 0]}>
              <sphereGeometry args={[meteor.radius * 1.5, 12, 12]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>

            {/* Stretched Tapered Trail along Velocity Vector */}
            <mesh position={[0, 0, 0]}>
              <coneGeometry args={[meteor.radius * 1.1, meteor.length, 8]} />
              <meshBasicMaterial
                color={meteor.color}
                transparent
                opacity={0.8}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// 3. Ambient Cosmic Stardust Backing
function AmbientStardust() {
  const pointsRef = useRef<THREE.Points>(null!);
  const count = 500;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const palette = [new THREE.Color('#00d2ff'), new THREE.Color('#38bdf8'), new THREE.Color('#1e3a8a')];

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 35;
      pos[i3 + 1] = (Math.random() - 0.5) * 25;
      pos[i3 + 2] = (Math.random() - 0.5) * 20 - 5;

      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i3] = c.r;
      col[i3 + 1] = c.g;
      col[i3 + 2] = c.b;
    }
    return [pos, col];
  }, [count]);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.055}
        vertexColors
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// 4. Glowing Perspective Cyber-Grid
function CyberGrid({
  mouse,
  isMobile,
}: {
  mouse: React.MutableRefObject<{ targetX: number; targetY: number }>;
  isMobile: boolean;
}) {
  const gridRef = useRef<THREE.Group>(null!);

  useFrame(() => {
    if (gridRef.current) {
      const factor = isMobile ? 0.15 : 0.35;
      gridRef.current.position.x = THREE.MathUtils.lerp(gridRef.current.position.x, mouse.current.targetX * factor, 0.04);
      gridRef.current.rotation.z = THREE.MathUtils.lerp(gridRef.current.rotation.z, -mouse.current.targetX * 0.02, 0.04);
    }
  });

  return (
    <group ref={gridRef} position={[0, isMobile ? -2.6 : -3.2, 0]}>
      <gridHelper args={[isMobile ? 32 : 45, isMobile ? 32 : 45, '#00d2ff', '#0f3460']} />
    </group>
  );
}

// 5. STAGE 2: 3D Camera Dive Controller (Deep Forward Dive through the Central Sphere)
function CameraDiveController({
  isExiting,
  mouse,
  isMobile,
}: {
  isExiting: boolean;
  mouse: React.MutableRefObject<{ targetX: number; targetY: number }>;
  isMobile: boolean;
}) {
  const idleZ = isMobile ? 8.6 : 7.2;
  const targetZ = useRef(idleZ);

  useEffect(() => {
    if (!isExiting) {
      targetZ.current = idleZ;
    }
  }, [idleZ, isExiting]);

  useFrame((state, delta) => {
    if (isExiting) {
      // Damped acceleration straight forward through the sphere core
      targetZ.current = THREE.MathUtils.lerp(targetZ.current, -6.5, delta * (isMobile ? 1.8 : 1.55));
      state.camera.position.z = THREE.MathUtils.lerp(
        state.camera.position.z,
        targetZ.current,
        delta * 3.5
      );
      state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, 0, delta * 3.8);
      state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, isMobile ? 0.25 : 0.1, delta * 3.8);
    } else {
      // Gentle idle mouse parallax
      const factor = isMobile ? 0.2 : 0.45;
      state.camera.position.x = THREE.MathUtils.lerp(
        state.camera.position.x,
        mouse.current.targetX * factor,
        delta * 2.5
      );
      state.camera.position.y = THREE.MathUtils.lerp(
        state.camera.position.y,
        mouse.current.targetY * (factor * 0.8),
        delta * 2.5
      );
      state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, idleZ, delta * 2.5);
    }
    state.camera.lookAt(0, isMobile ? 0.25 : 0.1, 0);
  });

  return null;
}

// Cinematic Sci-Fi Scene Composition
function CinematicSciFiScene({
  mouse,
  isExiting,
  isMobile,
}: {
  mouse: React.MutableRefObject<{ targetX: number; targetY: number }>;
  isExiting: boolean;
  isMobile: boolean;
}) {
  const { size, viewport } = useThree();
  const effectiveMobile = isMobile || size.width <= 768 || viewport.aspect < 1.0;

  return (
    <>
      <color attach="background" args={['#05050a']} />
      <fog attach="fog" args={['#05050a', 5, 26]} />

      <ambientLight intensity={0.4} color="#0a192f" />
      <pointLight position={[8, 8, 8]} intensity={2.2} color="#00d2ff" distance={25} />
      <pointLight position={[-8, -6, -4]} intensity={1.8} color="#0f3460" distance={22} />
      <directionalLight position={[0, 6, 4]} intensity={0.6} color="#38bdf8" />

      <CameraDiveController isExiting={isExiting} mouse={mouse} isMobile={effectiveMobile} />
      <PlanetarySphereAndSatellites mouse={mouse} isExiting={isExiting} isMobile={effectiveMobile} />
      <MeteorParticles />
      <AmbientStardust />
      <CyberGrid mouse={mouse} isMobile={effectiveMobile} />
    </>
  );
}

interface LoginPageProps {
  onLogin: (role: 'user' | 'admin') => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const navigate = useNavigate();
  const { setNickname } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 768);
  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [isTurnstileRendered, setIsTurnstileRendered] = useState(false);
  const [isTurnstileVerified, setIsTurnstileVerified] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let pollInterval: ReturnType<typeof setInterval>;

    const renderTurnstile = () => {
      if (!window.turnstile || !turnstileContainerRef.current) return false;

      // Clean up previous widget instance if any
      if (widgetIdRef.current) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // ignore
        }
        widgetIdRef.current = null;
      }

      turnstileContainerRef.current.innerHTML = '';
      setIsTurnstileVerified(false);

      try {
        const id = window.turnstile.render(turnstileContainerRef.current, {
          sitekey: '1x00000000000000000000AA', // Official Cloudflare Always-Pass Test Sitekey
          theme: 'dark',
          size: 'flexible',
          callback: () => {
            if (!isMounted) return;
            setIsTurnstileVerified(true);
            setIsTurnstileRendered(true);
          },
          'error-callback': () => {
            if (!isMounted) return;
            console.warn('Cloudflare Turnstile challenge error');
          },
          'expired-callback': () => {
            if (!isMounted) return;
            setIsTurnstileVerified(false);
          },
        });
        widgetIdRef.current = id;
        setIsTurnstileRendered(true);
        return true;
      } catch (err) {
        console.warn('Turnstile render exception:', err);
        return false;
      }
    };

    if (!renderTurnstile()) {
      pollInterval = setInterval(() => {
        if (renderTurnstile()) {
          clearInterval(pollInterval);
        }
      }, 150);
    }

    return () => {
      isMounted = false;
      if (pollInterval) clearInterval(pollInterval);
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // ignore
        }
        widgetIdRef.current = null;
      }
    };
  }, [isAdminMode, isCreatingAccount]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mouse reaction coordinates normalized to [-1, 1]
  const mouseRef = useRef({ targetX: 0, targetY: 0 });

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      mouseRef.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, []);

  const handleAuth = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isLoading || isSubmitting || isExiting) return;

    setErrorMsg('');
    setIsLoading(true);

    try {
      // 0. Cloudflare Turnstile Verification Gate (Player mode)
      if (!isTurnstileVerified && !isAdminMode && isTurnstileRendered) {
        setErrorMsg('Please complete Cloudflare Turnstile verification.');
        setIsLoading(false);
        return;
      }

      // 1. Brief sci-fi authentication feedback (600ms)
      await new Promise(r => setTimeout(r, 600));

      let roleToLogin: 'user' | 'admin' = 'user';

      // FORK 1: Admin Mode - Validate admin credentials
      if (isAdminMode) {
        if (email.trim() === 'admin1' && password === 'admin123') {
          setErrorMsg('');
          setNickname('admin1');
          localStorage.setItem('isAdminLoggedIn', 'true');
          roleToLogin = 'admin';
        } else {
          setErrorMsg('AUTHORIZATION FAILED: Invalid Admin ID or Passcode.');
          setIsLoading(false);
          return;
        }
      } else {
        // FORK 2: User Mode - Standard user auth logic
        localStorage.removeItem('isAdminLoggedIn');
        const userNickname = email.trim() || 'Player1';
        setNickname(userNickname);
        localStorage.setItem('omniplay_nickname', userNickname);
        localStorage.setItem('omni_operator_nickname', userNickname);
        window.dispatchEvent(new Event('omni:user_profile_updated'));

        // Attempt Supabase client auth if email provided
        if (email.includes('@') && password) {
          try {
            if (isCreatingAccount) {
              await supabase.auth.signUp({ email: email.trim(), password });
            } else {
              await supabase.auth.signInWithPassword({ email: email.trim(), password });
            }
          } catch (supabaseErr) {
            console.warn('Supabase client auth notice:', supabaseErr);
          }
        }

        // Backend sync
        try {
          await authApi.login({ nickname: userNickname, password, role: 'user' });
        } catch (err) {
          console.warn('Backend Supabase sync notice:', err);
        }

        roleToLogin = 'user';
      }

      // 2. Authentication successful -> Trigger cinematic exit transition & dive!
      setIsLoading(false);
      setIsSubmitting(true);
      setIsExiting(true);

      // 3. Multi-stage cinematic transition: 3D camera dive through planetary sphere + cinematic fade-to-black (2000ms)
      setTimeout(() => {
        onLogin(roleToLogin);
        navigate(roleToLogin === 'admin' ? '/admin' : '/library');
      }, 2000);

    } catch (err: unknown) {
      console.error('Authentication error:', err);
      setErrorMsg(err instanceof Error ? err.message : 'Authentication failed.');
      setIsLoading(false);
      setIsSubmitting(false);
      setIsExiting(false);
    }
  };

  return (
    <div className={`login-page-container ${isExiting ? 'page-exiting' : ''}`}>
      {/* STAGE 3: Cinematic Full-Screen Fade to Black Overlay */}
      <div className={`cinematic-fade-overlay ${isExiting ? 'fade-active' : ''}`} />

      {/* Three.js Interactive Sci-Fi Canvas Background */}
      <div className="login-canvas-wrap">
        <CanvasErrorBoundary>
          <Canvas
            camera={{ position: [0, 0, isMobile ? 8.6 : 7.2], fov: 55 }}
            gl={{ antialias: true, alpha: true }}
          >
            <CinematicSciFiScene mouse={mouseRef} isExiting={isExiting} isMobile={isMobile} />
          </Canvas>
        </CanvasErrorBoundary>
      </div>

      {/* Overlay Vignette Gradients */}
      <div className="login-overlay-vignette" />

      {/* STAGE 1: Glassmorphic Auth Card */}
      <div className={`login-card ${isExiting ? 'exit-login' : ''}`}>
        <div className="login-card-header">
          <div className="login-brand-logo">
            <Gamepad2 className="login-brand-icon" />
            <span className="login-brand-text">
              {isCreatingAccount ? "Create New Account" : "OmniPlay"}
            </span>
          </div>
          <p className="login-subtitle">
            {isCreatingAccount
              ? "Create Account • Cloud Gaming Service"
              : "Next-Gen Cloud Gaming & Cloud Computing"}
          </p>
        </div>

        {/* Role Toggle Selector / Mode Tabs */}
        <div className="login-role-selector">
          <button
            type="button"
            className={`login-role-btn ${!isAdminMode ? 'active' : ''}`}
            onClick={() => {
              setIsAdminMode(false);
              setErrorMsg('');
              if (email === 'admin1') setEmail('');
              if (password === 'admin123') setPassword('');
            }}
            disabled={isLoading || isSubmitting || isExiting}
          >
            <Gamepad2 style={{ width: 15, height: 15 }} />
            <span>{isCreatingAccount ? "Register" : "Player Login"}</span>
          </button>
          <button
            type="button"
            className={`login-role-btn ${isAdminMode ? 'active' : ''}`}
            onClick={() => {
              setIsAdminMode(true);
              setIsCreatingAccount(false);
              setErrorMsg('');
              if (!email || email === 'Player1') setEmail('admin1');
              if (!password) setPassword('admin123');
            }}
            disabled={isLoading || isSubmitting || isExiting}
          >
            <ShieldAlert style={{ width: 15, height: 15 }} />
            <span>Admin Login</span>
          </button>
        </div>

        {/* Authorization Failure Warning Banner */}
        {errorMsg && (
          <div className="login-error-banner" role="alert">
            <ShieldAlert className="login-error-icon" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleAuth} className="login-form">
          <div className="login-input-group">
            <label className="login-label">
              {isAdminMode ? "Admin Username" : "Email or Nickname"}
            </label>
            <div className="login-input-wrap">
              <User className="login-input-icon" />
              <input
                type="text"
                className="login-input"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder={isAdminMode ? "Enter admin username" : "Enter email or nickname"}
                required
                disabled={isLoading || isSubmitting || isExiting}
              />
            </div>
          </div>

          <div className="login-input-group">
            <label className="login-label">
              {isAdminMode ? "Admin Password" : "Password"}
            </label>
            <div className="login-input-wrap" style={{ position: 'relative' }}>
              <Lock className="login-input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                className="login-input login-input-passcode"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder={isAdminMode ? "Enter admin password" : "Enter password"}
                required
                disabled={isLoading || isSubmitting || isExiting}
              />
              <button
                type="button"
                className="login-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
                disabled={isLoading || isSubmitting || isExiting}
              >
                {showPassword ? (
                  <EyeOff style={{ width: 17, height: 17 }} />
                ) : (
                  <Eye style={{ width: 17, height: 17 }} />
                )}
              </button>
            </div>
          </div>

          {/* Official Cloudflare Turnstile Verification Container */}
          <div className="cf-turnstile-outer-wrap">
            <div ref={turnstileContainerRef} className="cf-real-turnstile-slot" />
            {!isTurnstileRendered && (
              <div className="cf-turnstile-box verifying">
                <div className="cf-turnstile-left">
                  <div className="cf-checkbox verifying">
                    <div className="cf-spinner" />
                  </div>
                  <div className="cf-label-wrap">
                    <span className="cf-main-label">Connecting to Cloudflare...</span>
                    <span className="cf-sub-label">Loading Turnstile Edge Challenge</span>
                  </div>
                </div>
                <div className="cf-turnstile-right">
                  <div className="cf-brand">
                    <svg className="cf-logo-svg" viewBox="0 0 120 80" fill="none">
                      <path d="M84.2 38.8c-1-11.2-10.4-19.8-21.8-19.8-5.8 0-11.1 2.2-15.1 6-3.3-8.6-11.6-14.7-21.4-14.7-12.5 0-22.7 9.8-23.3 22.1C9.4 33.4 2.9 39.6 2.3 47.4c-.8 8.6 6 16 14.6 16.1h80.5c8.8 0 15.9-7.1 15.9-15.9 0-4.2-1.6-8-4.3-10.8 1-.6 1.9-1.4 2.7-2.3.8 1 1.4 2.3 1.8 3.6.3.9 1.1 1.4 2 1.4h1.5c1.3 0 2.2-1 2.2-2.3 0-.5-.1-1-.5-1.4-2.8-5.2-8.5-8.9-15.3-9.7z" fill="#F38020"/>
                      <path d="M84.2 38.8c-.3 0-.6.1-.9.1 1.7 2.2 2.7 5 2.7 8 0 7.2-5.8 13-13 13H16.9c-.8 0-1.5-.1-2.2-.2 2.3 2.5 5.7 4.1 9.4 4.1h56.4c8.8 0 15.9-7.1 15.9-15.9 0-4.2-1.6-8-4.3-10.8 1-.6 1.9-1.4 2.7-2.3.8 1 1.4 2.3 1.8 3.6.3.9 1.1 1.4 2 1.4h1.5c1.3 0 2.2-1 2.2-2.3 0-.5-.1-1-.5-1.4-2.8-5.2-8.5-8.9-15.3-9.7z" fill="#FAAE40"/>
                    </svg>
                    <div className="cf-brand-text">
                      <span className="cf-brand-title">Cloudflare</span>
                      <span className="cf-brand-turnstile">Turnstile</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            className={`login-submit-btn ${isLoading || isSubmitting ? 'submitting' : ''}`}
            disabled={isLoading || isSubmitting || isExiting}
          >
            {isLoading && <div className="omni-spinner omni-spinner-sm" style={{ marginRight: 8 }} />}
            <span>
              {isLoading || isSubmitting
                ? (isCreatingAccount ? 'Creating account...' : 'Signing in...')
                : (isAdminMode 
                    ? 'Sign In as Admin ->' 
                    : (isCreatingAccount ? 'Create Account Now ->' : 'Sign In as Player ->')
                  )
              }
            </span>
            {!isLoading && <ArrowRight style={{ width: 18, height: 18 }} />}
          </button>

          {/* Account Creation Toggle - Hidden when in Admin Mode */}
          {!isAdminMode && (
            <div className="login-toggle-wrap">
              <button
                type="button"
                className="login-toggle-btn"
                onClick={() => setIsCreatingAccount(!isCreatingAccount)}
                disabled={isSubmitting || isExiting}
              >
                {isCreatingAccount
                  ? "Already have an account? Sign in here."
                  : "Don't have an account? Create one here."}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
