import { useState, useEffect } from 'react';
import { 
  Gamepad2, Activity, Sliders, CheckCircle2, AlertTriangle, 
  Terminal, RefreshCw, Zap, ShieldAlert, Cpu, Wifi
} from 'lucide-react';

interface MappingItem {
  button: string;
  mappedTo: string;
  status: 'ok' | 'calibrated' | 'drift_detected';
  rawValue: string;
}

export default function AdminOmniRemote() {
  const [pollingRate, setPollingRate] = useState(1000);
  const [deadzone, setDeadzone] = useState(5);
  const [invertY, setInvertY] = useState(false);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [isRumbling, setIsRumbling] = useState(false);
  const [activeTestBtn, setActiveTestBtn] = useState<string | null>(null);

  // Live Simulated Axis Values
  const [axisValues, setAxisValues] = useState({
    lx: 0,
    ly: 0,
    rx: 0,
    ry: 0,
    lt: 0,
    rt: 0
  });

  const [mappings, setMappings] = useState<MappingItem[]>([
    { button: 'Button A (Cross)', mappedTo: 'XINPUT_GAMEPAD_A', status: 'ok', rawValue: '0x0001 (0.0ms)' },
    { button: 'Button B (Circle)', mappedTo: 'XINPUT_GAMEPAD_B', status: 'ok', rawValue: '0x0002 (0.0ms)' },
    { button: 'Button X (Square)', mappedTo: 'XINPUT_GAMEPAD_X', status: 'ok', rawValue: '0x0004 (0.0ms)' },
    { button: 'Button Y (Triangle)', mappedTo: 'XINPUT_GAMEPAD_Y', status: 'ok', rawValue: '0x0008 (0.0ms)' },
    { button: 'Left Stick (Analog)', mappedTo: 'AXIS_LX / AXIS_LY', status: 'ok', rawValue: 'X: 0, Y: 0' },
    { button: 'Right Stick (Analog)', mappedTo: 'AXIS_RX / AXIS_RY', status: 'calibrated', rawValue: 'X: +2, Y: -1' },
    { button: 'Left Trigger (LT)', mappedTo: 'BYTE_TRIGGER_L', status: 'ok', rawValue: '0 / 255' },
    { button: 'Right Trigger (RT)', mappedTo: 'BYTE_TRIGGER_R', status: 'ok', rawValue: '0 / 255' },
    { button: 'D-Pad Up/Down/L/R', mappedTo: 'DPAD_BITMASK', status: 'ok', rawValue: '0x0000' }
  ]);

  // Micro-simulation of live stick values when user interacts
  const handleSimulateStick = (type: 'left' | 'right') => {
    setActiveTestBtn(type);
    if (type === 'left') {
      setAxisValues(prev => ({ ...prev, lx: 0.65, ly: -0.42, lt: 180 }));
    } else {
      setAxisValues(prev => ({ ...prev, rx: -0.55, ry: 0.78, rt: 240 }));
    }

    setTimeout(() => {
      setAxisValues({ lx: 0, ly: 0, rx: 0, ry: 0, lt: 0, rt: 0 });
      setActiveTestBtn(null);
    }, 1200);
  };

  const handleCalibrate = () => {
    setIsCalibrating(true);
    setTimeout(() => {
      setIsCalibrating(false);
      setMappings(prev => prev.map(m => ({ ...m, status: 'ok' })));
    }, 1500);
  };

  const handleTestRumble = () => {
    setIsRumbling(true);
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }
    setTimeout(() => setIsRumbling(false), 800);
  };

  return (
    <div className="admin-omni-container">
      {/* 1. Header */}
      <header className="admin-omni-header">
        <div>
          <div className="admin-omni-badge">
            <ShieldAlert style={{ width: 14, height: 14 }} />
            <span>CONTROLLER DIAGNOSTICS</span>
          </div>
          <h1 className="admin-omni-title">Controller Diagnostics</h1>
          <p className="admin-omni-sub">
            Test button inputs, calibrate thumbstick deadzones, and verify vibration rumble.
          </p>
        </div>

        {/* Global Latency KPI */}
        <div className="admin-omni-kpis">
          <div className="omni-kpi-pill">
            <span className="kpi-k">Input Latency:</span>
            <span className="kpi-v cyan">0.9 ms RTT</span>
          </div>
          <div className="omni-kpi-pill">
            <span className="kpi-k">Button Response:</span>
            <span className="kpi-v emerald">{pollingRate} Hz (USB-C High Speed)</span>
          </div>
          <div className="omni-kpi-pill">
            <span className="kpi-k">Signal Jitter:</span>
            <span className="kpi-v green">0.04 ms</span>
          </div>
        </div>
      </header>

      {/* 2. Grid: Live Input Visualizer + Mapping Table */}
      <div className="admin-omni-grid">
        
        {/* Left Column: Visual Controller HUD & Axis Drift Tester */}
        <div className="admin-omni-card">
          <div className="card-top-bar">
            <div>
              <h2 className="admin-card-title">Live Controller Inputs</h2>
              <p className="admin-card-sub">Real-time thumbstick motion and button press detection</p>
            </div>
            <span className="active-driver-chip">
              <Zap style={{ width: 12, height: 12, color: 'var(--neon-cyan)' }} />
              Driver: Virtual X360 Gamepad
            </span>
          </div>

          {/* Interactive Sticks Visualizer */}
          <div className="sticks-visualizer-row">
            {/* Left Stick Box */}
            <div className="stick-box">
              <span className="stick-label">LEFT ANALOG (LS)</span>
              <div className="stick-radial">
                <div 
                  className="stick-puck"
                  style={{
                    transform: `translate(${axisValues.lx * 30}px, ${axisValues.ly * 30}px)`
                  }}
                />
                <div className="deadzone-guide" style={{ width: `${deadzone * 4}%`, height: `${deadzone * 4}%` }} />
              </div>
              <div className="stick-coords mono">
                X: {axisValues.lx.toFixed(2)} | Y: {axisValues.ly.toFixed(2)}
              </div>
              <button 
                type="button" 
                className="stick-test-btn"
                onClick={() => handleSimulateStick('left')}
              >
                Test Left Analog
              </button>
            </div>

            {/* Right Stick Box */}
            <div className="stick-box">
              <span className="stick-label">RIGHT ANALOG (RS)</span>
              <div className="stick-radial">
                <div 
                  className="stick-puck"
                  style={{
                    transform: `translate(${axisValues.rx * 30}px, ${axisValues.ry * 30}px)`
                  }}
                />
                <div className="deadzone-guide" style={{ width: `${deadzone * 4}%`, height: `${deadzone * 4}%` }} />
              </div>
              <div className="stick-coords mono">
                X: {axisValues.rx.toFixed(2)} | Y: {axisValues.ry.toFixed(2)}
              </div>
              <button 
                type="button" 
                className="stick-test-btn"
                onClick={() => handleSimulateStick('right')}
              >
                Test Right Analog
              </button>
            </div>
          </div>

          {/* Trigger Depth Bars */}
          <div className="triggers-meter-group">
            <div className="trigger-row">
              <span className="trig-lbl">Left Trigger (LT): {axisValues.lt} / 255</span>
              <div className="trig-track">
                <div className="trig-fill" style={{ width: `${(axisValues.lt / 255) * 100}%` }} />
              </div>
            </div>
            <div className="trigger-row">
              <span className="trig-lbl">Right Trigger (RT): {axisValues.rt} / 255</span>
              <div className="trig-track">
                <div className="trig-fill" style={{ width: `${(axisValues.rt / 255) * 100}%` }} />
              </div>
            </div>
          </div>

          {/* Quick Diagnostics Action Bar */}
          <div className="admin-omni-actions">
            <button 
              type="button" 
              className={`omni-diag-btn ${isCalibrating ? 'loading' : ''}`}
              onClick={handleCalibrate}
              disabled={isCalibrating}
            >
              <RefreshCw style={{ width: 14, height: 14 }} className={isCalibrating ? 'spin-icon' : ''} />
              <span>{isCalibrating ? 'Calibrating...' : 'Calibrate Gamepad'}</span>
            </button>

            <button 
              type="button" 
              className={`omni-diag-btn rumble ${isRumbling ? 'active-rumble' : ''}`}
              onClick={handleTestRumble}
              disabled={isRumbling}
            >
              <Activity style={{ width: 14, height: 14 }} />
              <span>{isRumbling ? 'Testing...' : 'Test Vibration'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Mapping Matrix & Packet Diagnostics */}
        <div className="admin-omni-card">
          <div className="card-top-bar">
            <div>
              <h2 className="admin-card-title">Gamepad Button Mappings</h2>
              <p className="admin-card-sub">Button mapping status and low-level protocol</p>
            </div>
            <span className="protocol-chip">
              <Wifi style={{ width: 12, height: 12, color: 'var(--neon-emerald)' }} />
              WebRTC SCTP DataChannel
            </span>
          </div>

          {/* Calibration Tuning Controls */}
          <div className="tuning-controls-box">
            <div className="tuning-item">
              <label className="tuning-label">Analog Deadzone: {deadzone}%</label>
              <input 
                type="range" 
                min="0" 
                max="25" 
                value={deadzone}
                onChange={(e) => setDeadzone(Number(e.target.value))}
                className="tuning-slider"
              />
            </div>

            <div className="tuning-item toggle">
              <label className="toggle-label">
                <input 
                  type="checkbox" 
                  checked={invertY} 
                  onChange={(e) => setInvertY(e.target.checked)} 
                />
                <span>Invert Y-Axis (Camera / Flight Mode)</span>
              </label>
            </div>
          </div>

          {/* Mapping Table */}
          <div className="mapping-table-wrap">
            <table className="mapping-table">
              <thead>
                <tr>
                  <th>Physical Button</th>
                  <th>System API</th>
                  <th>Signal Code</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {mappings.map((m) => (
                  <tr key={m.button}>
                    <td><strong>{m.button}</strong></td>
                    <td className="mono cyan">{m.mappedTo}</td>
                    <td className="mono dim">{m.rawValue}</td>
                    <td>
                      <span className={`mapping-badge ${m.status}`}>
                        <CheckCircle2 style={{ width: 12, height: 12 }} />
                        {m.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* HID Raw Packet Log Stream */}
          <div className="hid-terminal-stream">
            <div className="hid-term-header">
              <Terminal style={{ width: 12, height: 12 }} />
              <span>CONTROLLER SIGNAL STREAM (UDP DATACHANNEL)</span>
            </div>
            <div className="hid-term-body mono">
              <p className="term-line dim">[00:00.012] RECV: 0x01 0x00 0x7F 0x80 0x00 0x00 (CRC32: PASS)</p>
              <p className="term-line green">[00:00.013] DISPATCH: XInput Event sent to EA FC 25 pid:8192 (0.1ms)</p>
              <p className="term-line dim">[00:00.014] RECV: 0x01 0x00 0x7E 0x81 0x00 0x00 (CRC32: PASS)</p>
              <p className="term-line cyan">[00:00.015] KERNEL: Zero packet drop detected across last 10,000 frames</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
