import React, { useState } from 'react';
import { 
  Users, UserPlus, Search, MessageSquare, Gamepad2, 
  CheckCircle2, Sparkles, Send, Radio, Volume2, Shield
} from 'lucide-react';
import ThreeDIcon from './ThreeDIcon';
import { useUser } from '../context/UserContext';

interface Friend {
  id: string;
  omniId: string;
  name: string;
  avatarColor: string;
  status: 'in-game' | 'online' | 'away';
  game?: string;
  node?: string;
  activityText: string;
}

interface CommunityMessage {
  id: number;
  sender: string;
  omniId: string;
  text: string;
  time: string;
  isSelf?: boolean;
}

const initialFriends: Friend[] = [
  {
    id: 'f-1',
    omniId: 'Alex#SG01',
    name: 'Alex',
    avatarColor: 'linear-gradient(135deg, #00f0ff, #3b82f6)',
    status: 'in-game',
    game: 'EA SPORTS FC™ 25',
    node: 'SG-01 (RTX 4090)',
    activityText: 'In-Game: Division Rivals (1st Half, 2-1)'
  },
  {
    id: 'f-2',
    omniId: 'Sarah#JK02',
    name: 'Sarah',
    avatarColor: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
    status: 'in-game',
    game: 'Baldur\'s Gate 3',
    node: 'SG-01 (RTX 4090)',
    activityText: 'In-Game: Act II Moonrise Towers Co-op'
  },
  {
    id: 'f-3',
    omniId: 'Elena#TY04',
    name: 'Elena',
    avatarColor: 'linear-gradient(135deg, #f59e0b, #f43f5e)',
    status: 'in-game',
    game: 'Black Myth: Wukong',
    node: 'JK-01 (RTX 4080)',
    activityText: 'In-Game: Chapter 3 Pagoda Realm'
  },
  {
    id: 'f-4',
    omniId: 'Marcus#SG05',
    name: 'Marcus',
    avatarColor: 'linear-gradient(135deg, #10b981, #06b6d4)',
    status: 'online',
    activityText: 'Online: Browsing Cloud Game Library'
  },
  {
    id: 'f-5',
    omniId: 'David#ID08',
    name: 'David',
    avatarColor: 'linear-gradient(135deg, #64748b, #475569)',
    status: 'away',
    activityText: 'Away: Idle for 20 mins'
  }
];

const initialChatMessages: CommunityMessage[] = [
  {
    id: 1,
    sender: 'Alex',
    omniId: 'Alex#SG01',
    text: 'Anyone up for 2v2 co-op on EA FC 25? The Singapore SG-01 node is running at 3.5ms ping tonight!',
    time: '20:15'
  },
  {
    id: 2,
    sender: 'Sarah',
    omniId: 'Sarah#JK02',
    text: 'I just finished my BG3 session, count me in for the next match!',
    time: '20:18'
  },
  {
    id: 3,
    sender: 'Elena',
    omniId: 'Elena#TY04',
    text: 'Black Myth runs crazy smooth on RTX 4090 cloud streaming. Zero input delay with OmniRemote.',
    time: '20:21'
  }
];

export default function CommunityView() {
  const { nickname } = useUser();
  const [friends, setFriends] = useState<Friend[]>(initialFriends);
  const [searchFriend, setSearchFriend] = useState('');
  const [addOmniId, setAddOmniId] = useState('');
  const [addNotice, setAddNotice] = useState<string | null>(null);
  
  // Chat state
  const [activeChannel, setActiveChannel] = useState<'#general-chat' | '#party-lounge' | '#game-matchmaking'>('#general-chat');
  const [messages, setMessages] = useState<CommunityMessage[]>(initialChatMessages);
  const [inputMsg, setInputMsg] = useState('');

  const handleAddFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addOmniId.trim()) return;

    const trimmed = addOmniId.trim();
    setAddNotice(`Friend request sent to "${trimmed}"!`);
    setAddOmniId('');

    setTimeout(() => {
      setAddNotice(null);
    }, 4000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const newMsg: CommunityMessage = {
      id: Date.now(),
      sender: `${nickname} (You)`,
      omniId: `${nickname}#OMNI`,
      text: inputMsg.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSelf: true
    };

    setMessages([...messages, newMsg]);
    setInputMsg('');
  };

  const filteredFriends = friends.filter(f => 
    f.name.toLowerCase().includes(searchFriend.toLowerCase()) ||
    f.omniId.toLowerCase().includes(searchFriend.toLowerCase()) ||
    (f.game && f.game.toLowerCase().includes(searchFriend.toLowerCase()))
  );

  return (
    <div className="community-view-container">
      {/* 1. Community Header Banner */}
      <header className="community-header">
        <div className="community-title-group">
          <div className="community-3d-badge">
            <ThreeDIcon type="community" size={28} glowColor="rgba(16, 185, 129, 0.5)" />
            <span>OMNIPLAY COMMUNITY & SQUAD HUB</span>
          </div>
          <h1 className="community-title">Player Community Hub</h1>
          <p className="community-sub">
            Form multiplayer lobbies, spectate cloud gaming streams, and exchange real-time game strategies with friends.
          </p>
        </div>

        <div className="community-stat-chips">
          <div className="comm-stat-card">
            <span className="stat-k">FRIENDS ONLINE</span>
            <span className="stat-v cyan">5 LIVE</span>
          </div>
          <div className="comm-stat-card">
            <span className="stat-k">IN-GAME SESSIONS</span>
            <span className="stat-v emerald">3 Streaming</span>
          </div>
          <div className="comm-stat-card">
            <span className="stat-k">WEBRTC VOICE HUB</span>
            <span className="stat-v green">
              <Radio style={{ width: 12, height: 12, display: 'inline', marginRight: 4 }} />
              Active
            </span>
          </div>
        </div>
      </header>

      {/* 2. Add Friend via OmniID Bar */}
      <div className="community-add-friend-bar">
        <div className="add-friend-info">
          <UserPlus style={{ width: 20, height: 20, color: 'var(--neon-cyan)' }} />
          <div>
            <h3 className="add-friend-heading">Add Friend via OmniID</h3>
            <p className="add-friend-sub">Connect with any player on the OmniPlay cloud ecosystem</p>
          </div>
        </div>

        <form onSubmit={handleAddFriend} className="add-friend-form">
          <div className="add-input-wrap">
            <Search className="add-input-icon" />
            <input
              type="text"
              className="add-omni-input"
              value={addOmniId}
              onChange={(e) => setAddOmniId(e.target.value)}
              placeholder="Enter OmniID (e.g. RivalGamer#SG01 or SteamID)..."
            />
          </div>
          <button type="submit" className="add-friend-btn" disabled={!addOmniId.trim()}>
            Send Request
          </button>
        </form>

        {addNotice && (
          <div className="add-friend-toast">
            <CheckCircle2 style={{ width: 14, height: 14, color: 'var(--neon-emerald)' }} />
            <span>{addNotice}</span>
          </div>
        )}
      </div>

      {/* 3. Main Grid: Active Friends List + Community Gaming Chat */}
      <div className="community-main-grid">
        
        {/* Left Column: Active Friends List */}
        <div className="community-friends-card">
          <div className="friends-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Users style={{ width: 18, height: 18, color: 'var(--neon-emerald)' }} />
              <div>
                <h2 className="card-heading">Active Friends ({filteredFriends.length})</h2>
                <p className="card-subheading">Live cloud gaming status & running titles</p>
              </div>
            </div>

            {/* Friend Filter/Search */}
            <div className="friends-filter-mini">
              <input
                type="text"
                className="friends-filter-input"
                value={searchFriend}
                onChange={(e) => setSearchFriend(e.target.value)}
                placeholder="Filter friends..."
              />
            </div>
          </div>

          <div className="community-friends-list">
            {filteredFriends.map((friend) => (
              <div key={friend.id} className={`friend-item-card ${friend.status}`}>
                {/* Avatar with Status Pulse */}
                <div className="friend-avatar-wrap">
                  <div className="friend-avatar-circle" style={{ background: friend.avatarColor }}>
                    <span className="friend-initial">{friend.name[0]}</span>
                  </div>
                  <span className={`friend-status-dot ${friend.status}`} />
                </div>

                {/* Friend Details */}
                <div className="friend-details">
                  <div className="friend-name-row">
                    <span className="friend-name">{friend.name}</span>
                    <span className="friend-omni-tag">{friend.omniId}</span>
                    <span className={`friend-badge ${friend.status}`}>
                      {friend.status === 'in-game' ? 'IN-GAME' : friend.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="friend-activity">{friend.activityText}</p>
                  {friend.node && (
                    <span className="friend-node-tag">
                      <Gamepad2 style={{ width: 11, height: 11 }} />
                      Node: {friend.node}
                    </span>
                  )}
                </div>

                {/* Quick Friend Actions */}
                <div className="friend-actions-group">
                  {friend.status === 'in-game' && (
                    <button 
                      type="button" 
                      className="friend-action-btn join-btn"
                      onClick={() => alert(`Sending Co-op / Lobby Join request to ${friend.name}!`)}
                    >
                      Join Lobby
                    </button>
                  )}
                  <button 
                    type="button" 
                    className="friend-action-btn msg-btn"
                    onClick={() => {
                      setInputMsg(`@${friend.name} `);
                    }}
                  >
                    Message
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Chat & Messaging Interface */}
        <div className="community-chat-card">
          <div className="chat-channels-bar">
            {(['#general-chat', '#party-lounge', '#game-matchmaking'] as const).map(channel => (
              <button
                key={channel}
                type="button"
                className={`channel-pill ${activeChannel === channel ? 'active' : ''}`}
                onClick={() => setActiveChannel(channel)}
              >
                <MessageSquare style={{ width: 13, height: 13 }} />
                <span>{channel}</span>
              </button>
            ))}
          </div>

          <div className="community-messages-stream">
            <div className="chat-channel-banner">
              <Sparkles style={{ width: 14, height: 14, color: 'var(--neon-cyan)' }} />
              <span>You are viewing {activeChannel} • End-to-end encrypted WebRTC gaming room</span>
            </div>

            {messages.map((msg) => (
              <div key={msg.id} className={`comm-msg-row ${msg.isSelf ? 'self' : ''}`}>
                <div className="comm-msg-header">
                  <span className="msg-sender-name">{msg.sender}</span>
                  <span className="msg-omni-id mono">{msg.omniId}</span>
                  <span className="msg-time">{msg.time}</span>
                </div>
                <div className={`comm-msg-bubble ${msg.isSelf ? 'self' : ''}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="community-chat-input-bar">
            <input
              type="text"
              className="comm-chat-input"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder={`Message ${activeChannel}...`}
            />
            <button type="submit" className="comm-send-btn" disabled={!inputMsg.trim()}>
              <Send style={{ width: 15, height: 15 }} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
