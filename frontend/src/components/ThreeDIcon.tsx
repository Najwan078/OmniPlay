import React from 'react';
import { 
  Gamepad2, 
  BarChart3, 
  Users, 
  Radio, 
  HelpCircle, 
  Clock, 
  Trophy, 
  Flame,
  type LucideIcon
} from 'lucide-react';

export type Icon3DType = 
  | 'library' 
  | 'stats' 
  | 'community' 
  | 'remote' 
  | 'support' 
  | 'playtime' 
  | 'achievements' 
  | 'games';

interface IconConfig {
  icon: LucideIcon;
  color: string;
  bgGradient: string;
  defaultGlow: string;
  borderColor: string;
}

const ICON_CONFIGS: Record<Icon3DType, IconConfig> = {
  library: {
    icon: Gamepad2,
    color: '#00f0ff',
    bgGradient: 'linear-gradient(135deg, rgba(0, 240, 255, 0.22) 0%, rgba(2, 132, 199, 0.12) 100%)',
    defaultGlow: 'rgba(0, 240, 255, 0.45)',
    borderColor: 'rgba(0, 240, 255, 0.35)'
  },
  stats: {
    icon: BarChart3,
    color: '#c084fc',
    bgGradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.22) 0%, rgba(126, 34, 206, 0.12) 100%)',
    defaultGlow: 'rgba(168, 85, 247, 0.45)',
    borderColor: 'rgba(168, 85, 247, 0.35)'
  },
  community: {
    icon: Users,
    color: '#10b981',
    bgGradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.22) 0%, rgba(5, 150, 105, 0.12) 100%)',
    defaultGlow: 'rgba(16, 185, 129, 0.45)',
    borderColor: 'rgba(16, 185, 129, 0.35)'
  },
  remote: {
    icon: Radio,
    color: '#38bdf8',
    bgGradient: 'linear-gradient(135deg, rgba(56, 189, 248, 0.22) 0%, rgba(29, 78, 216, 0.12) 100%)',
    defaultGlow: 'rgba(56, 189, 248, 0.45)',
    borderColor: 'rgba(56, 189, 248, 0.35)'
  },
  support: {
    icon: HelpCircle,
    color: '#f43f5e',
    bgGradient: 'linear-gradient(135deg, rgba(244, 63, 94, 0.22) 0%, rgba(225, 29, 72, 0.12) 100%)',
    defaultGlow: 'rgba(244, 63, 94, 0.45)',
    borderColor: 'rgba(244, 63, 94, 0.35)'
  },
  playtime: {
    icon: Clock,
    color: '#00f0ff',
    bgGradient: 'linear-gradient(135deg, rgba(0, 240, 255, 0.22) 0%, rgba(14, 116, 144, 0.12) 100%)',
    defaultGlow: 'rgba(0, 240, 255, 0.45)',
    borderColor: 'rgba(0, 240, 255, 0.35)'
  },
  achievements: {
    icon: Trophy,
    color: '#f59e0b',
    bgGradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.22) 0%, rgba(180, 83, 9, 0.12) 100%)',
    defaultGlow: 'rgba(245, 158, 11, 0.45)',
    borderColor: 'rgba(245, 158, 11, 0.35)'
  },
  games: {
    icon: Flame,
    color: '#10b981',
    bgGradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.22) 0%, rgba(4, 120, 87, 0.12) 100%)',
    defaultGlow: 'rgba(16, 185, 129, 0.45)',
    borderColor: 'rgba(16, 185, 129, 0.35)'
  }
};

interface ThreeDIconProps {
  type: Icon3DType;
  size?: number;
  className?: string;
  glowColor?: string;
}

export default function ThreeDIcon({ type, size = 26, className = '', glowColor }: ThreeDIconProps) {
  const config = ICON_CONFIGS[type] || ICON_CONFIGS.library;
  const IconComponent = config.icon;
  const activeGlow = glowColor || config.defaultGlow;
  const iconPixelSize = Math.max(14, Math.round(size * 0.58));

  return (
    <div
      className={`gaming-vector-badge ${className}`}
      style={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        flexShrink: 0,
        borderRadius: size > 32 ? '10px' : '7px',
        background: config.bgGradient,
        border: `1px solid ${config.borderColor}`,
        boxShadow: `0 0 12px ${activeGlow}, inset 0 1px 0 rgba(255, 255, 255, 0.15)`,
        transition: 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.22s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.22s ease'
      }}
    >
      <IconComponent 
        style={{
          width: iconPixelSize,
          height: iconPixelSize,
          color: config.color,
          filter: `drop-shadow(0 0 6px ${config.color})`
        }} 
      />
    </div>
  );
}
