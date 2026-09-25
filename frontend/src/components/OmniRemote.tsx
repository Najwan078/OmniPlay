import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  Wifi, Battery, Mic, MicOff, MessageSquare, Users, 
  Send, Gamepad2, Maximize2, X, Smartphone,
  Radio, Zap, ShieldCheck, Monitor
} from 'lucide-react';

export default function OmniRemote() {
  // 1. LOBBY STATE (Default: false)
  const [isActive, setIsActive] = useState<boolean>(false);
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [leftStickMode, setLeftStickMode] = useState<'dpad' | 'analog'>('dpad');
  const [stickOffset, setStickOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDraggingStick, setIsDraggingStick] = useState<boolean>(false);
  const [micMuted, setMicMuted] = useState<boolean>(false);
  const [socialOpen, setSocialOpen] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'Sarah', text: "Hey, ready for Baldur's Gate co-op?", time: '18:40' },
    { sender: 'Alex', text: 'Just beat the boss in Wukong!', time: '18:42' },
  ]);
  const [inputText, setInputText] = useState('');
  const [activeNode] = useState('SG-01');

  const stickRef = useRef<HTMLDivElement | null>(null);

  // Lock body scroll and prevent touch-drag scrolling when active gamepad overlay is mounted
  useEffect(() => {
    if (isActive) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      document.body.style.userSelect = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      document.body.style.userSelect = '';
    };
  }, [isActive]);

  // Haptic feedback & pointer press handlers
  const triggerHaptic = (duration = 15) => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(duration);
      } catch {}
    }
  };

  const handlePointerDownBtn = (btn: string) => {
    setActiveButton(btn);
    triggerHaptic(20);
  };

  const handlePointerUpBtn = () => {
    setActiveButton(null);
  };

  // Keyboard mapping for Laptop / Desktop players
  useEffect(() => {
    if (!isActive) return;

    const keyMap: Record<string, string> = {
      // D-Pad Directionals
      ArrowUp: 'UP',
      KeyW: 'UP',
      w: 'UP',
      W: 'UP',
      ArrowLeft: 'LEFT',
      KeyA: 'LEFT',
      a: 'LEFT',
      A: 'LEFT',
      ArrowDown: 'DOWN',
      KeyS: 'DOWN',
      s: 'DOWN',
      S: 'DOWN',
      ArrowRight: 'RIGHT',
      KeyD: 'RIGHT',
      d: 'RIGHT',
      D: 'RIGHT',

      // ABXY Action Diamond
      KeyJ: 'A',
      j: 'A',
      J: 'A',
      Enter: 'A',
      Space: 'A',
      ' ': 'A',
      KeyK: 'B',
      k: 'B',
      K: 'B',
      KeyU: 'X',
      u: 'X',
      U: 'X',
      KeyI: 'Y',
      i: 'Y',
      I: 'Y',

      // Bumpers & Triggers
      KeyQ: 'L1',
      q: 'L1',
      Q: 'L1',
      KeyE: 'R1',
      e: 'R1',
      E: 'R1',
      Digit1: 'L2',
      '1': 'L2',
      Digit2: 'R2',
      '2': 'R2',

      // System Buttons
      KeyV: 'VIEW',
      v: 'VIEW',
      V: 'VIEW',
      Tab: 'VIEW',
      KeyM: 'MENU',
      m: 'MENU',
      M: 'MENU',
      KeyG: 'GUIDE',
      g: 'GUIDE',
      G: 'GUIDE',

      // Stick Click
      KeyL: 'L3',
      l: 'L3',
      L: 'L3',
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleExitRemote();
        return;
      }
      const mapped = keyMap[e.code] || keyMap[e.key];
      if (mapped) {
        // Prevent browser scrolling with arrow/space
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', ' ', 'Tab'].includes(e.key) || e.code === 'Tab') {
          e.preventDefault();
        }
        setActiveButton(mapped);
        triggerHaptic(15);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const mapped = keyMap[e.code] || keyMap[e.key];
      if (mapped) {
        setActiveButton(prev => (prev === mapped ? null : prev));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isActive]);

  // 1. START OMNIREMOTE (Requests Fullscreen & Landscape Orientation Lock)
  const handleStartRemote = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch (err) {
      console.warn('Fullscreen request bypassed or unsupported:', err);
    }

    try {
      if (screen.orientation && typeof (screen.orientation as any).lock === 'function') {
        await (screen.orientation as any).lock('landscape');
      }
    } catch (err) {
      console.warn('Screen orientation lock bypassed or unsupported:', err);
    }

    setIsActive(true);
  };

  // Exit Gamepad Mode & unlock orientation / exit fullscreen
  const handleExitRemote = async () => {
    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.warn('Exit fullscreen bypassed:', err);
    }

    try {
      if (screen.orientation && typeof (screen.orientation as any).unlock === 'function') {
        (screen.orientation as any).unlock();
      }
    } catch (err) {
      console.warn('Screen orientation unlock bypassed:', err);
    }

    setIsActive(false);
  };

  // Left Thumb Zone: Interactive Analog Stick pointer events
  const handleStickPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDraggingStick(true);
    handlePointerDownBtn('L3');
    updateStickPosition(e);
  };

  const handleStickPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingStick) return;
    updateStickPosition(e);
  };

  const handleStickPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDraggingStick) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}
      setIsDraggingStick(false);
      setStickOffset({ x: 0, y: 0 });
      handlePointerUpBtn();
    }
  };

  const updateStickPosition = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!stickRef.current) return;
    const rect = stickRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const distance = Math.hypot(dx, dy);
    const maxRadius = 36; // px clamp inside ring

    if (distance <= maxRadius) {
      setStickOffset({ x: dx, y: dy });
    } else {
      const angle = Math.atan2(dy, dx);
      setStickOffset({
        x: Math.cos(angle) * maxRadius,
        y: Math.sin(angle) * maxRadius,
      });
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setChatMessages(prev => [...prev, { sender: 'You', text: inputText, time: 'Just now' }]);
    setInputText('');
  };

  // =========================================================================
  // TASK 1: LOBBY STATE UI (when isActive === false)
  // =========================================================================
  if (!isActive) {
    return (
      <div className="omni-remote-lobby-viewport">
        <div className="omni-lobby-card">
          <div className="lobby-bg-glow" />
          
          <div className="lobby-badge">
            <Radio style={{ width: 14, height: 14 }} />
            <span>WEBRTC LOW-LATENCY CONTROLLER ENGINE</span>
          </div>

          <div className="lobby-icon-wrapper">
            <Gamepad2 style={{ width: 44, height: 44 }} />
          </div>

          <div className="lobby-header-text">
            <h1 className="lobby-title">OmniRemote Cloud Gamepad</h1>
            <p className="lobby-subtitle">Zero-driver virtual hardware gamepad bridge</p>
          </div>

          {/* CRITICAL PROMPT REQUIREMENT */}
          <div className="lobby-prompt-box">
            <Smartphone className="lobby-prompt-icon" style={{ width: 22, height: 22 }} />
            <p className="lobby-prompt-text">
              Rotate your device or press start to enter Gamepad Mode.
            </p>
          </div>

          {/* CRITICAL START OMNIREMOTE BUTTON */}
          <button 
            className="lobby-start-btn"
            onClick={handleStartRemote}
            type="button"
            id="start-omniremote-btn"
          >
            <Maximize2 style={{ width: 22, height: 22 }} />
            <span>START OMNIREMOTE</span>
          </button>

          {/* Live Telemetry Chips */}
          <div className="lobby-telemetry-row">
            <div className="lobby-chip">
              <span className="lobby-dot green" />
              <span>NODE: {activeNode}</span>
            </div>
            <div className="lobby-chip">
              <Wifi style={{ width: 13, height: 13, color: 'var(--neon-cyan)' }} />
              <span>LATENCY: 3.2ms</span>
            </div>
            <div className="lobby-chip">
              <Battery style={{ width: 13, height: 13, color: 'var(--neon-emerald)' }} />
              <span>BATTERY: 92%</span>
            </div>
          </div>

          {/* Architectural highlights */}
          <div className="lobby-feature-grid">
            <div className="lobby-feature-pill">
              <Zap style={{ width: 16, height: 16, color: 'var(--neon-cyan)' }} />
              <div>
                <strong>Physical Thumb Zones</strong>
                <p>Natural ergonomics with zero reach fatigue</p>
              </div>
            </div>
            <div className="lobby-feature-pill">
              <Gamepad2 style={{ width: 16, height: 16, color: 'var(--neon-amber)' }} />
              <div>
                <strong>Diamond ABXY & Triggers</strong>
                <p>Strict console mapping with glowing tactile feedback</p>
              </div>
            </div>
            <div className="lobby-feature-pill">
              <ShieldCheck style={{ width: 16, height: 16, color: 'var(--neon-emerald)' }} />
              <div>
                <strong>Fullscreen Lockdown</strong>
                <p>Zero scrollbars, browser UI completely covered</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // =========================================================================
  // TASK 2, 3, 4: ACTIVE GAMEPAD OVERLAY (when isActive === true)
  // Rendered via React Portal directly into document.body to escape any parent
  // layout constraints, sidebars, or CSS transforms, perfectly covering 100vw x 100vh.
  // =========================================================================
  const gamepadOverlayContent = (
    <div 
      className="omni-gamepad-overlay"
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Central Handheld Console Chassis:
          - Responsive: full edge-to-edge on mobile landscape
          - Ergonomic high-end handheld console body on laptops & desktops */}
      <div className="gamepad-stage">
        
        {/* -----------------------------------------------------------------
            TOP CORNERS: L1/L2 (Top-Left) & R1/R2 (Top-Right)
            ----------------------------------------------------------------- */}
        <div className="gamepad-corner-left">
          <button 
            className={`gamepad-trigger-btn ${activeButton === 'L2' ? 'active' : ''}`}
            onPointerDown={() => handlePointerDownBtn('L2')}
            onPointerUp={handlePointerUpBtn}
            onPointerCancel={handlePointerUpBtn}
            type="button"
            aria-label="L2 Trigger"
          >
            <span className="trigger-lbl">L2</span>
            <span className="trigger-sub">TRIG</span>
          </button>
          <button 
            className={`gamepad-bumper-btn ${activeButton === 'L1' ? 'active' : ''}`}
            onPointerDown={() => handlePointerDownBtn('L1')}
            onPointerUp={handlePointerUpBtn}
            onPointerCancel={handlePointerUpBtn}
            type="button"
            aria-label="L1 Bumper"
          >
            L1
          </button>
        </div>

        <div className="gamepad-corner-right">
          <button 
            className={`gamepad-bumper-btn ${activeButton === 'R1' ? 'active' : ''}`}
            onPointerDown={() => handlePointerDownBtn('R1')}
            onPointerUp={handlePointerUpBtn}
            onPointerCancel={handlePointerUpBtn}
            type="button"
            aria-label="R1 Bumper"
          >
            R1
          </button>
          <button 
            className={`gamepad-trigger-btn ${activeButton === 'R2' ? 'active' : ''}`}
            onPointerDown={() => handlePointerDownBtn('R2')}
            onPointerUp={handlePointerUpBtn}
            onPointerCancel={handlePointerUpBtn}
            type="button"
            aria-label="R2 Trigger"
          >
            <span className="trigger-lbl">R2</span>
            <span className="trigger-sub">TRIG</span>
          </button>
        </div>

        {/* -----------------------------------------------------------------
            CENTER HUB: View, Guide, Menu, Small Exit Button
            ----------------------------------------------------------------- */}
        <div className="gamepad-center-hub">
          <button 
            className={`gamepad-sys-btn ${activeButton === 'VIEW' ? 'active' : ''}`}
            onPointerDown={() => handlePointerDownBtn('VIEW')}
            onPointerUp={handlePointerUpBtn}
            onPointerCancel={handlePointerUpBtn}
            type="button"
            aria-label="View Button"
          >
            VIEW
          </button>

          <button 
            className={`gamepad-guide-btn ${activeButton === 'GUIDE' ? 'active' : ''}`}
            onPointerDown={() => handlePointerDownBtn('GUIDE')}
            onPointerUp={handlePointerUpBtn}
            onPointerCancel={handlePointerUpBtn}
            type="button"
            aria-label="Nexus Guide Button"
            title="OmniPlay Nexus Guide"
          >
            <div className="guide-core-glow" />
          </button>

          <button 
            className={`gamepad-sys-btn ${activeButton === 'MENU' ? 'active' : ''}`}
            onPointerDown={() => handlePointerDownBtn('MENU')}
            onPointerUp={handlePointerUpBtn}
            onPointerCancel={handlePointerUpBtn}
            type="button"
            aria-label="Menu Button"
          >
            MENU
          </button>

          {/* Small Exit Button (Resets isActive to false & exits fullscreen) */}
          <button 
            className="gamepad-exit-pill"
            onClick={handleExitRemote}
            type="button"
            aria-label="Exit Gamepad Mode"
            title="Exit Gamepad Mode (Esc)"
          >
            <X style={{ width: 13, height: 13 }} />
            <span>EXIT</span>
          </button>
        </div>

        {/* -----------------------------------------------------------------
            CENTER DISPLAY: Telemetry Bar, Virtual Touchpad Surface & Social HUD
            ----------------------------------------------------------------- */}
        <div className="gamepad-center-display">
          {/* Stream Telemetry Bar */}
          <div className="gamepad-telemetry-bar">
            <div className="gamepad-tele-item">
              <span className="tele-pulse" />
              <span>NODE: {activeNode}</span>
            </div>
            <div className="gamepad-tele-item">
              <Wifi style={{ width: 11, height: 11, color: 'var(--neon-cyan)' }} />
              <span>3.2ms</span>
            </div>
            <div className="gamepad-tele-item">
              <span style={{ color: 'var(--neon-emerald)' }}>60 FPS</span>
            </div>
            <div className="gamepad-tele-item">
              <Battery style={{ width: 12, height: 12, color: 'var(--text-secondary)' }} />
              <span>92%</span>
            </div>
          </div>

          {/* Virtual Touchpad Surface */}
          <div 
            className="gamepad-touchpad"
            onPointerDown={() => handlePointerDownBtn('TOUCHPAD')}
            onPointerUp={handlePointerUpBtn}
            onPointerCancel={handlePointerUpBtn}
          >
            <div className="touchpad-grid" />
            <div className="touchpad-label-wrap">
              <span className="touchpad-sub-title">VIRTUAL TOUCH SURFACE</span>
              <span className="touchpad-hint">Swipe for Mouse Aim • Tap for Primary Click</span>
              <div className="touchpad-status-indicator">
                {activeButton ? `INPUT: ${activeButton}` : 'READY • UDP STREAM OK'}
              </div>
            </div>
          </div>

          {/* Quick Action Macros */}
          <div className="gamepad-quick-actions">
            <button 
              type="button"
              onClick={() => setMicMuted(!micMuted)}
              className={`gamepad-macro-btn ${micMuted ? 'muted' : ''}`}
            >
              {micMuted ? <MicOff style={{ width: 13, height: 13 }} /> : <Mic style={{ width: 13, height: 13 }} />}
              <span>{micMuted ? 'UNMUTE' : 'MUTE MIC'}</span>
            </button>

            <button 
              type="button"
              onClick={() => setSocialOpen(!socialOpen)}
              className={`gamepad-macro-btn ${socialOpen ? 'active' : ''}`}
            >
              <MessageSquare style={{ width: 13, height: 13 }} />
              <span>SOCIAL HUB</span>
            </button>
          </div>

          {/* Expandable Social Overlay */}
          {socialOpen && (
            <div className="gamepad-social-popover">
              <div className="gamepad-social-head">
                <div className="social-head-label">
                  <Users style={{ width: 13, height: 13, color: 'var(--neon-cyan)' }} />
                  <span>OmniPlay Social Chat</span>
                </div>
                <button 
                  type="button" 
                  className="social-close-btn" 
                  onClick={() => setSocialOpen(false)}
                >
                  <X style={{ width: 13, height: 13 }} />
                </button>
              </div>
              <div className="gamepad-chat-list">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`gamepad-chat-msg ${msg.sender === 'You' ? 'me' : 'them'}`}>
                    <span className="msg-sender">{msg.sender} <span className="msg-time">{msg.time}</span></span>
                    <p className="msg-body">{msg.text}</p>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendMessage} className="gamepad-chat-form">
                <input 
                  type="text" 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Send message..."
                  className="gamepad-chat-input"
                />
                <button type="submit" className="gamepad-chat-send">
                  <Send style={{ width: 12, height: 12 }} />
                </button>
              </form>
            </div>
          )}
        </div>

        {/* -----------------------------------------------------------------
            LEFT THUMB ZONE: Circular D-Pad or Analog Stick (L3)
            Positioned strictly at bottom: 20px, left: 20px
            ----------------------------------------------------------------- */}
        <div className="gamepad-left-zone">
          {/* Thumb Control Mode Switcher */}
          <div className="stick-mode-toggle">
            <button 
              type="button" 
              className={`mode-btn ${leftStickMode === 'dpad' ? 'active' : ''}`}
              onClick={() => setLeftStickMode('dpad')}
            >
              D-PAD
            </button>
            <button 
              type="button" 
              className={`mode-btn ${leftStickMode === 'analog' ? 'active' : ''}`}
              onClick={() => setLeftStickMode('analog')}
            >
              ANALOG (L3)
            </button>
          </div>

          {leftStickMode === 'dpad' ? (
            /* Circular D-Pad with central L3 nub */
            <div className="gamepad-dpad-circle">
              <button 
                className={`dpad-disc-btn dpad-up ${activeButton === 'UP' ? 'active' : ''}`}
                onPointerDown={() => handlePointerDownBtn('UP')}
                onPointerUp={handlePointerUpBtn}
                onPointerCancel={handlePointerUpBtn}
                type="button"
                aria-label="D-Pad Up"
              >
                ▲
              </button>
              <button 
                className={`dpad-disc-btn dpad-left ${activeButton === 'LEFT' ? 'active' : ''}`}
                onPointerDown={() => handlePointerDownBtn('LEFT')}
                onPointerUp={handlePointerUpBtn}
                onPointerCancel={handlePointerUpBtn}
                type="button"
                aria-label="D-Pad Left"
              >
                ◀
              </button>
              <button 
                className={`dpad-disc-btn dpad-center-l3 ${activeButton === 'L3' ? 'active' : ''}`}
                onPointerDown={() => handlePointerDownBtn('L3')}
                onPointerUp={handlePointerUpBtn}
                onPointerCancel={handlePointerUpBtn}
                type="button"
                aria-label="L3 Center Click"
              >
                L3
              </button>
              <button 
                className={`dpad-disc-btn dpad-right ${activeButton === 'RIGHT' ? 'active' : ''}`}
                onPointerDown={() => handlePointerDownBtn('RIGHT')}
                onPointerUp={handlePointerUpBtn}
                onPointerCancel={handlePointerUpBtn}
                type="button"
                aria-label="D-Pad Right"
              >
                ▶
              </button>
              <button 
                className={`dpad-disc-btn dpad-down ${activeButton === 'DOWN' ? 'active' : ''}`}
                onPointerDown={() => handlePointerDownBtn('DOWN')}
                onPointerUp={handlePointerUpBtn}
                onPointerCancel={handlePointerUpBtn}
                type="button"
                aria-label="D-Pad Down"
              >
                ▼
              </button>
            </div>
          ) : (
            /* Interactive Analog Stick Track & Draggable Thumb Nub */
            <div 
              className="gamepad-stick-container"
              ref={stickRef}
              onPointerDown={handleStickPointerDown}
              onPointerMove={handleStickPointerMove}
              onPointerUp={handleStickPointerUp}
              onPointerCancel={handleStickPointerUp}
            >
              <div className="stick-track-ring">
                <div 
                  className={`stick-thumb-nub ${activeButton === 'L3' || isDraggingStick ? 'active' : ''}`}
                  style={{
                    transform: `translate(${stickOffset.x}px, ${stickOffset.y}px)`,
                  }}
                >
                  <div className="nub-groove-cross" />
                  <span className="nub-l3-text">L3</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* -----------------------------------------------------------------
            RIGHT THUMB ZONE: Strict Diamond A, B, X, Y buttons
            Positioned strictly at bottom: 20px, right: 20px
            Diamond Arrangement: Y top, A bottom, X left, B right
            ----------------------------------------------------------------- */}
        <div className="gamepad-right-zone">
          <div className="gamepad-diamond-pad">
            {/* Y (Top) */}
            <button 
              className={`abxy-btn btn-y ${activeButton === 'Y' ? 'active' : ''}`}
              onPointerDown={() => handlePointerDownBtn('Y')}
              onPointerUp={handlePointerUpBtn}
              onPointerCancel={handlePointerUpBtn}
              type="button"
              aria-label="Y Button"
            >
              Y
            </button>
            {/* X (Left) */}
            <button 
              className={`abxy-btn btn-x ${activeButton === 'X' ? 'active' : ''}`}
              onPointerDown={() => handlePointerDownBtn('X')}
              onPointerUp={handlePointerUpBtn}
              onPointerCancel={handlePointerUpBtn}
              type="button"
              aria-label="X Button"
            >
              X
            </button>
            {/* Diamond Center Decal */}
            <div className="diamond-center-decal" />
            {/* B (Right) */}
            <button 
              className={`abxy-btn btn-b ${activeButton === 'B' ? 'active' : ''}`}
              onPointerDown={() => handlePointerDownBtn('B')}
              onPointerUp={handlePointerUpBtn}
              onPointerCancel={handlePointerUpBtn}
              type="button"
              aria-label="B Button"
            >
              B
            </button>
            {/* A (Bottom) */}
            <button 
              className={`abxy-btn btn-a ${activeButton === 'A' ? 'active' : ''}`}
              onPointerDown={() => handlePointerDownBtn('A')}
              onPointerUp={handlePointerUpBtn}
              onPointerCancel={handlePointerUpBtn}
              type="button"
              aria-label="A Button"
            >
              A
            </button>
          </div>
        </div>

        {/* -----------------------------------------------------------------
            LAPTOP & DESKTOP KEYBOARD LEGEND BAR (Hidden on Mobile)
            ----------------------------------------------------------------- */}
        <div className="gamepad-keyboard-legend">
          <span className="kbd-badge"><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> D-Pad</span>
          <span className="kbd-divider">•</span>
          <span className="kbd-badge"><kbd>J</kbd><kbd>K</kbd><kbd>U</kbd><kbd>I</kbd> A / B / X / Y</span>
          <span className="kbd-divider">•</span>
          <span className="kbd-badge"><kbd>Q</kbd><kbd>E</kbd> L1 / R1</span>
          <span className="kbd-divider">•</span>
          <span className="kbd-badge"><kbd>1</kbd><kbd>2</kbd> L2 / R2</span>
          <span className="kbd-divider">•</span>
          <span className="kbd-badge"><kbd>Esc</kbd> Exit</span>
        </div>

      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(gamepadOverlayContent, document.body)
    : gamepadOverlayContent;
}
