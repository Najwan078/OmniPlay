import React, { useState } from 'react';
import { 
  LifeBuoy, Send, AlertCircle, CheckCircle2, Clock, 
  MessageSquare, HelpCircle, Shield, Wifi, RefreshCw, ChevronRight
} from 'lucide-react';
import { useUser } from '../context/UserContext';

interface Ticket {
  id: string;
  category: string;
  game: string;
  description: string;
  status: 'open' | 'investigating' | 'resolved';
  timestamp: string;
  adminNote?: string;
}

interface ChatMessage {
  id: number;
  sender: 'user' | 'admin' | 'system';
  name: string;
  text: string;
  time: string;
}

const initialTickets: Ticket[] = [
  {
    id: 'OMNI-4821',
    category: 'High Latency / Ping Spike',
    game: 'EA SPORTS FC 25',
    description: 'Experiencing sudden 40ms ping spikes during weekend evening match queue.',
    status: 'investigating',
    timestamp: 'Today, 18:20',
    adminNote: 'Admin Alex (SG-01) is optimizing UDP stream route with local ISP peering.'
  },
  {
    id: 'OMNI-4790',
    category: 'Game Crash / Launch Failure',
    game: 'Cyberpunk 2077',
    description: 'Game threw error code 0x8007 on Steam cloud launch.',
    status: 'resolved',
    timestamp: 'Sep 21, 2026',
    adminNote: 'Cloud node shader cache wiped and rebuilt. Instance rebooted successfully.'
  }
];

const initialChatMessages: ChatMessage[] = [
  {
    id: 1,
    sender: 'system',
    name: 'OmniPlay System',
    text: 'Selamat datang di Layanan Bantuan Cloud Gaming OmniPlay.',
    time: '18:00'
  },
  {
    id: 2,
    sender: 'admin',
    name: 'Admin Alex (SG-01)',
    text: 'Halo! Kami telah menerima laporan Anda. Tim teknis sedang memantau rute jaringan WebRTC agar latensi tetap rendah dan stabil.',
    time: '18:22'
  }
];

export default function UserSupportView() {
  const { nickname: userNickname } = useUser();
  const activeName = userNickname || localStorage.getItem('omniplay_nickname') || 'Player1';

  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [category, setCategory] = useState('High Latency / Ping Spike');
  const [selectedGame, setSelectedGame] = useState('EA SPORTS FC™ 25');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [inputChat, setInputChat] = useState('');

  // Diagnostic Test state
  const [isTestingNet, setIsTestingNet] = useState(false);
  const [testResult, setTestResult] = useState<{ ping: string; jitter: string; packetLoss: string } | null>(null);

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newTicketId = `OMNI-${Math.floor(1000 + Math.random() * 9000)}`;
      const newTicket: Ticket = {
        id: newTicketId,
        category,
        game: selectedGame,
        description,
        status: 'open',
        timestamp: 'Baru saja',
        adminNote: 'Diteruskan ke tim admin SG-01 untuk investigasi.'
      };

      setTickets([newTicket, ...tickets]);
      setIsSubmitting(false);
      setDescription('');
      setSubmitSuccess(`Tiket #${newTicketId} berhasil dibuat! Tim teknisi cloud kami telah diberi tahu.`);
      
      // Auto reply from admin in chat
      setTimeout(() => {
        setChatMessages(prev => [
          ...prev,
          {
            id: Date.now(),
            sender: 'admin',
            name: 'Admin Queue (Auto-ACK)',
            text: `Tiket #${newTicketId} mengenai "${selectedGame}" telah tercatat. Kami sedang memeriksa container stream Anda.`,
            time: 'Baru saja'
          }
        ]);
      }, 1500);

      setTimeout(() => setSubmitSuccess(null), 5000);
    }, 800);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputChat.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      name: activeName,
      text: inputChat,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages([...chatMessages, userMsg]);
    setInputChat('');

    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'admin',
          name: 'Admin Live Desk',
          text: 'Message received. We are monitoring node telemetry and ensuring your connection maintains sub-5ms latency.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1200);
  };

  const handleRunDiagnostics = () => {
    setIsTestingNet(true);
    setTestResult(null);
    setTimeout(() => {
      setIsTestingNet(false);
      setTestResult({
        ping: '3.6 ms',
        jitter: '0.12 ms',
        packetLoss: '0.00%'
      });
    }, 1500);
  };

  return (
    <div className="user-support-container">
      {/* 1. Header */}
      <header className="user-support-header">
        <div>
          <div className="support-badge-pill">
            <LifeBuoy style={{ width: 14, height: 14 }} />
            <span>24/7 CLOUD TECHNICAL DESK • ADMIN DISPATCH</span>
          </div>
          <h1 className="user-support-title">Help & Technical Support</h1>
          <p className="user-support-sub">
            Directly report game crashes, stream stutter, or controller mapping issues to the Infrastructure Administrators.
          </p>
        </div>

        {/* Quick Diagnostic Test Button */}
        <div className="support-diag-box">
          <button 
            type="button" 
            className="diag-test-btn"
            onClick={handleRunDiagnostics}
            disabled={isTestingNet}
          >
            <RefreshCw style={{ width: 14, height: 14 }} className={isTestingNet ? 'spin-icon' : ''} />
            <span>{isTestingNet ? 'TESTING PEERING...' : 'RUN NETWORK HEALTH TEST'}</span>
          </button>

          {testResult && (
            <div className="diag-result-strip">
              <span>Ping: <strong className="cyan">{testResult.ping}</strong></span>
              <span>Jitter: <strong className="green">{testResult.jitter}</strong></span>
              <span>Loss: <strong className="green">{testResult.packetLoss}</strong></span>
            </div>
          )}
        </div>
      </header>

      {/* 2. Main Two-Column Layout: Ticket Creation Form + Live Support Chat */}
      <div className="user-support-grid">
        
        {/* Left Column: Submit New Ticket */}
        <div className="support-form-card">
          <div className="card-title-wrap">
            <AlertCircle style={{ width: 18, height: 18, color: 'var(--neon-cyan)' }} />
            <div>
              <h2 className="card-heading">Submit Incident Ticket</h2>
              <p className="card-subheading">Sends a high-priority diagnostic payload to the Admin</p>
            </div>
          </div>

          {submitSuccess && (
            <div className="support-toast-success">
              <CheckCircle2 style={{ width: 16, height: 16, color: 'var(--neon-emerald)' }} />
              <span>{submitSuccess}</span>
            </div>
          )}

          <form onSubmit={handleSubmitTicket} className="ticket-form">
            <div className="ticket-field-group">
              <label className="ticket-label">Issue Category</label>
              <select
                className="ticket-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="High Latency / Ping Spike">High Latency / Ping Spike</option>
                <option value="Game Crash / Launch Failure">Game Crash / Launch Failure</option>
                <option value="Input Lag & Virtual Gamepad">Input Lag & Virtual Gamepad</option>
                <option value="Audio / Video Artifacts">Audio / Video Artifacts (Stream Blur)</option>
                <option value="Steam Cloud Save Sync">Steam Cloud Save Sync Error</option>
              </select>
            </div>

            <div className="ticket-field-group">
              <label className="ticket-label">Affected Game</label>
              <select
                className="ticket-select"
                value={selectedGame}
                onChange={(e) => setSelectedGame(e.target.value)}
              >
                <option value="EA SPORTS FC™ 25">EA SPORTS FC™ 25</option>
                <option value="Cyberpunk 2077">Cyberpunk 2077</option>
                <option value="Valorant">Valorant</option>
                <option value="Black Myth: Wukong">Black Myth: Wukong</option>
                <option value="Counter-Strike 2">Counter-Strike 2</option>
                <option value="Other / General Launcher">Other / General Launcher</option>
              </select>
            </div>

            <div className="ticket-field-group">
              <label className="ticket-label">Describe What Happened</label>
              <textarea
                className="ticket-textarea"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your issue (e.g., FPS dropped from 120 to 30 after 15 minutes, or controller right trigger unmapped)..."
                required
              />
            </div>

            <button
              type="submit"
              className="ticket-submit-btn"
              disabled={isSubmitting}
            >
              <Send style={{ width: 16, height: 16 }} />
              <span>{isSubmitting ? 'DISPATCHING TICKET...' : 'DISPATCH TICKET TO ADMIN'}</span>
            </button>
          </form>

          {/* User's Existing Tickets Section */}
          <div className="existing-tickets-section">
            <h3 className="sub-heading-text">Your Submitted Tickets</h3>
            <div className="ticket-items-list">
              {tickets.map((t) => (
                <div key={t.id} className={`ticket-row status-${t.status}`}>
                  <div className="ticket-top-row">
                    <span className="ticket-id">{t.id}</span>
                    <span className="ticket-game-tag">{t.game}</span>
                    <span className={`ticket-status-pill ${t.status}`}>
                      {t.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="ticket-desc">{t.description}</p>
                  {t.adminNote && (
                    <div className="ticket-admin-note">
                      <Shield style={{ width: 12, height: 12, color: 'var(--neon-cyan)' }} />
                      <span>{t.adminNote}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Chat with Admin Support Desk */}
        <div className="support-chat-card">
          <div className="chat-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <MessageSquare style={{ width: 18, height: 18, color: 'var(--neon-emerald)' }} />
              <div>
                <h2 className="card-heading">Live Support Channel</h2>
                <p className="card-subheading">Direct link to active node shift engineer</p>
              </div>
            </div>
            <span className="live-status-dot">
              <span className="green-pulse" />
              ADMIN ONLINE (SG-01)
            </span>
          </div>

          <div className="support-chat-feed">
            {chatMessages.map((msg) => (
              <div key={msg.id} className={`chat-bubble-wrap ${msg.sender}`}>
                <div className="chat-bubble-meta">
                  <span className="bubble-sender">{msg.name}</span>
                  <span className="bubble-time">{msg.time}</span>
                </div>
                <div className={`chat-bubble-content ${msg.sender}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendChat} className="support-chat-input-bar">
            <input
              type="text"
              className="chat-input-field"
              value={inputChat}
              onChange={(e) => setInputChat(e.target.value)}
              placeholder="Ask Administrator for quick help..."
            />
            <button type="submit" className="chat-send-btn" disabled={!inputChat.trim()}>
              <Send style={{ width: 14, height: 14 }} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
