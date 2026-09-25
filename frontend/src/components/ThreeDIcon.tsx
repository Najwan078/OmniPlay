import { useRef, useState, Component, type ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Resilient Fallback Error Boundary
class ThreeDErrorBoundary extends Component<{ children: ReactNode; fallbackColor?: string }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(err: unknown) { console.warn('Mini 3D WebGL context fallback:', err); }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          background: this.props.fallbackColor || 'rgba(0, 240, 255, 0.2)',
          boxShadow: `0 0 10px ${this.props.fallbackColor || '#00f0ff'}`
        }} />
      );
    }
    return this.props.children;
  }
}

export type Icon3DType = 
  | 'library' 
  | 'stats' 
  | 'community' 
  | 'remote' 
  | 'support' 
  | 'playtime' 
  | 'achievements' 
  | 'games';

interface SceneProps {
  type: Icon3DType;
  hovered: boolean;
}

function GeometryMesh({ type, hovered }: SceneProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const meshRef2 = useRef<THREE.Mesh>(null!);
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((state, delta) => {
    const speed = hovered ? 3.0 : 1.2;
    const targetScale = hovered ? 1.22 : 1.0;

    if (groupRef.current) {
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 6);
    }

    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.4 * speed;
      meshRef.current.rotation.y += delta * 0.7 * speed;
    }

    if (meshRef2.current) {
      meshRef2.current.rotation.y -= delta * 0.6 * speed;
      meshRef2.current.rotation.z += delta * 0.5 * speed;
    }

    // Special type-specific animations
    if (type === 'stats' && meshRef.current) {
      // Pulsing torus scale
      const pulse = 1 + Math.sin(state.clock.elapsedTime * (hovered ? 5 : 2.5)) * 0.08;
      meshRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  switch (type) {
    case 'library':
      // Rotating glowing Icosahedron
      return (
        <group ref={groupRef}>
          <ambientLight intensity={0.7} />
          <pointLight position={[5, 5, 5]} intensity={2.5} color="#00f0ff" />
          <pointLight position={[-5, -5, -5]} intensity={1.5} color="#3b82f6" />
          <mesh ref={meshRef}>
            <icosahedronGeometry args={[1.2, 0]} />
            <meshPhysicalMaterial
              color="#00f0ff"
              emissive="#00f0ff"
              emissiveIntensity={0.5}
              roughness={0.1}
              metalness={0.9}
              clearcoat={1.0}
              clearcoatRoughness={0.1}
            />
          </mesh>
          <mesh ref={meshRef2}>
            <icosahedronGeometry args={[1.4, 0]} />
            <meshStandardMaterial
              color="#3b82f6"
              wireframe
              transparent
              opacity={0.4}
            />
          </mesh>
        </group>
      );

    case 'stats':
      // Pulsing glass Torus
      return (
        <group ref={groupRef}>
          <ambientLight intensity={0.6} />
          <pointLight position={[4, 4, 4]} intensity={2.2} color="#c084fc" />
          <pointLight position={[-4, -4, -4]} intensity={1.8} color="#8b5cf6" />
          <mesh ref={meshRef}>
            <torusGeometry args={[0.9, 0.35, 16, 32]} />
            <meshPhysicalMaterial
              color="#8b5cf6"
              emissive="#a855f7"
              emissiveIntensity={0.5}
              roughness={0.08}
              metalness={0.8}
              clearcoat={1.0}
            />
          </mesh>
        </group>
      );

    case 'community':
      // Overlapping glass spheres
      return (
        <group ref={groupRef}>
          <ambientLight intensity={0.7} />
          <pointLight position={[5, 5, 5]} intensity={2} color="#10b981" />
          <pointLight position={[-5, -5, -5]} intensity={2} color="#00f0ff" />
          <group ref={meshRef}>
            <mesh position={[-0.45, 0, 0]}>
              <sphereGeometry args={[0.7, 24, 24]} />
              <meshPhysicalMaterial
                color="#10b981"
                emissive="#059669"
                emissiveIntensity={0.4}
                roughness={0.15}
                metalness={0.7}
                transparent
                opacity={0.85}
                clearcoat={0.9}
              />
            </mesh>
            <mesh position={[0.45, 0, 0]}>
              <sphereGeometry args={[0.7, 24, 24]} />
              <meshPhysicalMaterial
                color="#00f0ff"
                emissive="#0284c7"
                emissiveIntensity={0.4}
                roughness={0.15}
                metalness={0.7}
                transparent
                opacity={0.85}
                clearcoat={0.9}
              />
            </mesh>
          </group>
        </group>
      );

    case 'remote':
      // Hovering metallic Box
      return (
        <group ref={groupRef}>
          <ambientLight intensity={0.6} />
          <pointLight position={[4, 4, 5]} intensity={2.5} color="#38bdf8" />
          <pointLight position={[-4, -4, -4]} intensity={1.5} color="#1d4ed8" />
          <mesh ref={meshRef}>
            <boxGeometry args={[1.2, 1.2, 1.2]} />
            <meshPhysicalMaterial
              color="#3b82f6"
              emissive="#00f0ff"
              emissiveIntensity={0.35}
              roughness={0.15}
              metalness={0.95}
              clearcoat={1.0}
              clearcoatRoughness={0.1}
            />
          </mesh>
        </group>
      );

    case 'support':
      // Glowing dual-cone / octahedron
      return (
        <group ref={groupRef}>
          <ambientLight intensity={0.7} />
          <pointLight position={[4, 4, 4]} intensity={2.5} color="#f43f5e" />
          <pointLight position={[-4, -4, -4]} intensity={1.5} color="#f59e0b" />
          <mesh ref={meshRef}>
            <octahedronGeometry args={[1.2, 0]} />
            <meshPhysicalMaterial
              color="#f43f5e"
              emissive="#f43f5e"
              emissiveIntensity={0.5}
              roughness={0.1}
              metalness={0.85}
              clearcoat={1.0}
            />
          </mesh>
        </group>
      );

    case 'playtime':
      // 3D Glass Hourglass / Chrono Cylinder Disc
      return (
        <group ref={groupRef}>
          <ambientLight intensity={0.8} />
          <pointLight position={[4, 4, 4]} intensity={2.5} color="#00f0ff" />
          <mesh ref={meshRef}>
            <cylinderGeometry args={[1.1, 1.1, 0.4, 24]} />
            <meshPhysicalMaterial
              color="#00f0ff"
              emissive="#0284c7"
              emissiveIntensity={0.5}
              roughness={0.1}
              metalness={0.9}
              clearcoat={1.0}
            />
          </mesh>
          <mesh ref={meshRef2}>
            <torusGeometry args={[1.3, 0.08, 16, 32]} />
            <meshStandardMaterial color="#60a5fa" emissive="#3b82f6" emissiveIntensity={0.8} />
          </mesh>
        </group>
      );

    case 'achievements':
      // 3D Faceted Diamond / Trophy Polyhedron
      return (
        <group ref={groupRef}>
          <ambientLight intensity={0.8} />
          <pointLight position={[4, 4, 4]} intensity={3} color="#f59e0b" />
          <pointLight position={[-4, -4, -4]} intensity={1.5} color="#a855f7" />
          <mesh ref={meshRef}>
            <dodecahedronGeometry args={[1.1, 0]} />
            <meshPhysicalMaterial
              color="#f59e0b"
              emissive="#d97706"
              emissiveIntensity={0.6}
              roughness={0.08}
              metalness={0.9}
              clearcoat={1.0}
            />
          </mesh>
        </group>
      );

    case 'games':
      // 3D Stacked Gaming Prism
      return (
        <group ref={groupRef}>
          <ambientLight intensity={0.8} />
          <pointLight position={[4, 5, 4]} intensity={2.5} color="#10b981" />
          <pointLight position={[-4, -3, -4]} intensity={1.5} color="#00f0ff" />
          <mesh ref={meshRef}>
            <coneGeometry args={[1.0, 1.4, 5]} />
            <meshPhysicalMaterial
              color="#10b981"
              emissive="#059669"
              emissiveIntensity={0.5}
              roughness={0.15}
              metalness={0.85}
              clearcoat={1.0}
            />
          </mesh>
        </group>
      );

    default:
      return null;
  }
}

interface ThreeDIconProps {
  type: Icon3DType;
  size?: number;
  className?: string;
  glowColor?: string;
}

export default function ThreeDIcon({ type, size = 26, className = '', glowColor }: ThreeDIconProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`mini-3d-icon-wrap ${className}`}
      style={{
        width: size,
        height: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        flexShrink: 0,
        filter: glowColor ? `drop-shadow(0 0 6px ${glowColor})` : undefined
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <ThreeDErrorBoundary fallbackColor={glowColor}>
        <Canvas
          camera={{ position: [0, 0, 3.4], fov: 45 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
          style={{ width: '100%', height: '100%' }}
        >
          <GeometryMesh type={type} hovered={hovered} />
        </Canvas>
      </ThreeDErrorBoundary>
    </div>
  );
}
