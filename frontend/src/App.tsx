import React, { useState, useEffect } from 'react';
import { 
  Routes, Route, Navigate, useNavigate, useLocation 
} from 'react-router-dom';
import { 
  Gamepad2, BarChart3, 
  User, CheckCircle2, ShieldAlert, 
  ShieldCheck, Smartphone, Cpu, LogOut,
  Trophy, LifeBuoy, Layers, SlidersHorizontal, 
  AlertTriangle, Users
} from 'lucide-react';
import CloudResourcesDashboard from './components/CloudResourcesDashboard';
import OmniRemote from './components/OmniRemote';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import PlayerDashboard from './components/PlayerDashboard';
import LoginPage from './components/LoginPage';
import AdminGameLibrary from './components/AdminGameLibrary';
import UserStatsDashboard from './components/UserStatsDashboard';
import UserSupportView from './components/UserSupportView';
import AdminOmniRemote from './components/AdminOmniRemote';
import CommunityView from './components/CommunityView';
import ThreeDIcon from './components/ThreeDIcon';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import { useUser } from './context/UserContext';
import type { UserRole } from './types/auth';
import { supabase } from './supabase';

// --- Navigation Item Component ---
function NavItem({ 
  icon, 
  label, 
  active, 
  onClick, 
  className 
}: { 
  icon: React.ReactNode; 
  label: string; 
  active: boolean; 
  onClick: () => void; 
  className?: string; 
}) {
  return (
    <button
      onClick={onClick}
      className={`omni-nav-item ${active ? 'active' : ''} ${className || ''}`}
      type="button"
    >
      <div className="omni-nav-icon">{icon}</div>
      <span className="omni-nav-label">{label}</span>
    </button>
  );
}

// --- Top Navbar Component ---
interface TopNavbarProps {
  userName: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout?: () => void;
  isAdmin: boolean;
}

function TopNavbar({
  userName,
  activeTab,
  onTabChange,
  onLogout,
  isAdmin
}: TopNavbarProps) {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignOutClick = () => {
    setIsLoggingOut(true);
    setTimeout(async () => {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase sign out notice:', err);
      }
      try {
        localStorage.removeItem('isAdminLoggedIn');
      } catch (e) {
        console.warn(e);
      }
      if (onLogout) {
        await onLogout();
      }
      navigate('/login');
      setIsLoggingOut(false);
    }, 1500);
  };

  return (
    <>
      {/* Fullscreen Sci-Fi Sign Out Loader */}
      {isLoggingOut && (
        <div className="fullscreen-loader" role="status">
          <div className="omni-spinner" />
          <span>TERMINATING NEURAL LINK...</span>
        </div>
      )}

      <header className="omni-topbar">
        <div className="omni-topbar-left">
          <div className="omni-brand-logo" onClick={() => onTabChange('library')}>
            <Gamepad2 className="omni-brand-icon" />
            <span className="omni-brand-text">OmniPlay</span>
          </div>

          <nav className="omni-topbar-menu">
            {isAdmin ? (
              /* STRICT ADMIN TOP MENUS */
              <>
                <span 
                  className={`omni-menu-item ${activeTab === 'library' ? 'active' : ''}`} 
                  onClick={() => onTabChange('library')}
                >
                  Game Library
                </span>
                <span 
                  className={`omni-menu-item ${activeTab === 'infrastructure' ? 'active' : ''}`} 
                  onClick={() => onTabChange('infrastructure')}
                >
                  Cloud Nodes
                </span>
                <span 
                  className={`omni-menu-item ${activeTab === 'analytics' ? 'active' : ''}`} 
                  onClick={() => onTabChange('analytics')}
                >
                  Analytics
                </span>
                <span 
                  className={`omni-menu-item ${activeTab === 'remote' ? 'active' : ''}`} 
                  onClick={() => onTabChange('remote')}
                >
                  OmniRemote (Admin)
                </span>
              </>
            ) : (
              /* STRICT USER / CUSTOMER TOP MENUS */
              <>
                <span 
                  className={`omni-menu-item ${activeTab === 'library' ? 'active' : ''}`} 
                  onClick={() => onTabChange('library')}
                >
                  Game Library
                </span>
                <span 
                  className={`omni-menu-item ${activeTab === 'stats' ? 'active' : ''}`} 
                  onClick={() => onTabChange('stats')}
                >
                  My Stats
                </span>
                <span 
                  className={`omni-menu-item ${activeTab === 'community' ? 'active' : ''}`} 
                  onClick={() => onTabChange('community')}
                >
                  Community
                </span>
                <span 
                  className={`omni-menu-item ${activeTab === 'remote' ? 'active' : ''}`} 
                  onClick={() => onTabChange('remote')}
                >
                  OmniRemote
                </span>
                <span 
                  className={`omni-menu-item ${activeTab === 'support' ? 'active' : ''}`} 
                  onClick={() => onTabChange('support')}
                >
                  Help/Support
                </span>
              </>
            )}
          </nav>
        </div>

        <div className="omni-topbar-right">
          {/* Operator Profile Pill */}
          <div className="omni-profile-pill">
            <div className="omni-avatar">
              {isAdmin ? (
                <ShieldCheck style={{ width: 14, height: 14, color: 'var(--neon-rose)' }} />
              ) : (
                <User style={{ width: 14, height: 14, color: 'var(--neon-cyan)' }} />
              )}
            </div>
            <div className="omni-profile-info" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              <span className="omni-username" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {userName}
              </span>
            </div>
          </div>

          <button 
            className="omni-action-btn omni-signout-btn" 
            onClick={handleSignOutClick}
            title="Terminate Operator Neural Link"
            type="button"
          >
            <LogOut style={{ width: 14, height: 14 }} />
            <span>Sign Out</span>
          </button>
        </div>
      </header>
    </>
  );
}

// --- Sidebar Navigation Component ---
interface SidebarProps {
  userName: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
  isAdmin: boolean;
}

function Sidebar({
  userName,
  activeTab,
  onTabChange,
  isAdmin
}: SidebarProps) {
  return (
    <aside className={`omni-sidebar ${isAdmin ? 'admin-sidebar' : ''}`}>
      <div>
        <div className="sidebar-role-indicator">
          {isAdmin ? (
            <span className="role-tag admin">ADMINISTRATOR CONSOLE</span>
          ) : (
            <span className="role-tag customer">OPERATOR CONSOLE</span>
          )}
        </div>

        {/* Operator Identity Card in Sidebar */}
        <div className="sidebar-operator-card">
          <div className="sidebar-operator-avatar">
            {isAdmin ? (
              <ShieldCheck style={{ width: 15, height: 15, color: 'var(--neon-rose)' }} />
            ) : (
              <User style={{ width: 15, height: 15, color: 'var(--neon-cyan)' }} />
            )}
          </div>
          <div className="sidebar-operator-meta" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            <span className="sidebar-operator-handle" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {userName}
            </span>
          </div>
        </div>

        <div className="omni-nav-list">
          {isAdmin ? (
            /* STRICT ADMINISTRATOR SIDEBAR TABS */
            <>
              <NavItem 
                className="admin-sidebar-link"
                icon={<Layers style={{ width: 18, height: 18 }} />} 
                label="Game Library" 
                active={activeTab === 'library'} 
                onClick={() => onTabChange('library')} 
              />
              <NavItem 
                className="admin-sidebar-link"
                icon={<Cpu style={{ width: 18, height: 18 }} />} 
                label="Cloud Nodes" 
                active={activeTab === 'infrastructure'} 
                onClick={() => onTabChange('infrastructure')} 
              />
              <NavItem 
                className="admin-sidebar-link"
                icon={<BarChart3 style={{ width: 18, height: 18 }} />} 
                label="Analytics" 
                active={activeTab === 'analytics'} 
                onClick={() => onTabChange('analytics')} 
              />
              <NavItem 
                className="admin-sidebar-link"
                icon={<SlidersHorizontal style={{ width: 18, height: 18 }} />} 
                label="OmniRemote (Admin)" 
                active={activeTab === 'remote'} 
                onClick={() => onTabChange('remote')} 
              />
            </>
          ) : (
            /* STRICT USER SIDEBAR TABS WITH PURE 3D THREE.JS ICONS */
            <>
              <NavItem 
                icon={<ThreeDIcon type="library" size={24} glowColor="rgba(0, 240, 255, 0.5)" />} 
                label="Game Library" 
                active={activeTab === 'library'} 
                onClick={() => onTabChange('library')} 
              />
              <NavItem 
                icon={<ThreeDIcon type="stats" size={24} glowColor="rgba(168, 85, 247, 0.5)" />} 
                label="My Stats" 
                active={activeTab === 'stats'} 
                onClick={() => onTabChange('stats')} 
              />
              <NavItem 
                icon={<ThreeDIcon type="community" size={24} glowColor="rgba(16, 185, 129, 0.5)" />} 
                label="Community" 
                active={activeTab === 'community'} 
                onClick={() => onTabChange('community')} 
              />
              <NavItem 
                icon={<ThreeDIcon type="remote" size={24} glowColor="rgba(59, 130, 246, 0.5)" />} 
                label="OmniRemote" 
                active={activeTab === 'remote'} 
                onClick={() => onTabChange('remote')} 
              />
              <NavItem 
                icon={<ThreeDIcon type="support" size={24} glowColor="rgba(244, 63, 94, 0.5)" />} 
                label="Help/Support" 
                active={activeTab === 'support'} 
                onClick={() => onTabChange('support')} 
              />
            </>
          )}
        </div>
      </div>
    </aside>
  );
}

/**
 * Shell Layout for Authenticated Dashboard Views
 */
function DashboardShell({
  activeTab,
  onTabChange,
  onLogout,
  launchingGame,
  launchStep,
  globalToast,
  children
}: {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  launchingGame: { title: string; steamUri?: string } | null;
  launchStep: number;
  globalToast: { message: string; icon: React.ReactNode } | null;
  children: React.ReactNode;
}) {
  const authContext = useUser();
  const role = authContext?.user?.role || authContext?.role || 'user';
  const isAdmin = role === 'admin';

  const [operatorName, setOperatorName] = useState<string>("Loading...");
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (localStorage.getItem('isAdminLoggedIn') === 'true') {
        setOperatorName('admin1');
        return;
      }
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email) {
          setOperatorName(user.email.split('@')[0]); // Get text before @
        } else if (authContext?.nickname && authContext.nickname !== 'Player1') {
          setOperatorName(authContext.nickname.includes('@') ? authContext.nickname.split('@')[0] : authContext.nickname);
        } else {
          setOperatorName('Guest');
        }
      } catch (err) {
        console.warn('Error fetching Supabase user in DashboardShell:', err);
        if (authContext?.nickname) {
          setOperatorName(authContext.nickname.includes('@') ? authContext.nickname.split('@')[0] : authContext.nickname);
        } else {
          setOperatorName('Guest');
        }
      }
    };
    fetchUser();
  }, [authContext?.nickname]);

  // Menu Click Simulation: Wrap the sidebar navigation logic in a function that sets isPageLoading(true), waits ~600ms via setTimeout, updates the view, and sets isPageLoading(false)
  const handleMenuClick = (tab: string) => {
    if (tab === activeTab) return;
    setIsPageLoading(true);
    setTimeout(() => {
      onTabChange(tab);
      setIsPageLoading(false);
    }, 600);
  };

  return (
    <div className="omni-app enter-dashboard">
      
      {/* 1. TOP NAVBAR */}
      <TopNavbar 
        userName={operatorName} 
        activeTab={activeTab} 
        onTabChange={handleMenuClick} 
        onLogout={onLogout} 
        isAdmin={isAdmin} 
      />

      {/* 2. APP BODY & SIDEBAR */}
      <div className="omni-body">
        <Sidebar 
          userName={operatorName} 
          activeTab={activeTab} 
          onTabChange={handleMenuClick} 
          isAdmin={isAdmin} 
        />

        {/* Main Content View with Page Loading Spinner */}
        <main className="omni-main-content">
          {isPageLoading ? (
            <div className="page-loader-container">
              <div className="omni-spinner" />
              <span>SYNCHRONIZING NEURAL NODE...</span>
            </div>
          ) : (
            <div key={activeTab} className="futuristic-page-container">
              {children}
            </div>
          )}
        </main>
      </div>

      {/* 3. CINEMATIC STEAM CLOUD LAUNCH MODAL */}
      {launchingGame && (
        <div className="omni-launch-overlay">
          <div className="omni-launch-modal">
            <div className="neon-ring-loader">
              <div className="neon-ring-outer" />
              <div className="neon-ring-middle" />
              <div className="neon-ring-inner" />
            </div>

            <div className="omni-launch-badge">
              <span className="live-dot" />
              STEAM CLOUD LAUNCH SEQUENCE ACTIVE
            </div>

            <h3 className="omni-launch-title">{launchingGame.title}</h3>
            <p className="omni-launch-desc">
              {launchStep === 0 && "Locating nearest Edge Cloud Node (SG-01 / JK-01)..."}
              {launchStep === 1 && "Allocating dedicated NVIDIA RTX 4080 Instance..."}
              {launchStep === 2 && "Synchronizing Steam Cloud Save & Shader Caches..."}
              {launchStep === 3 && "Establishing 120 FPS Sub-5ms WebRTC Stream..."}
            </p>

            <div className="launch-progress-bar">
              <div 
                className="launch-progress-fill" 
                style={{ width: `${(launchStep + 1) * 25}%` }} 
              />
            </div>

            <div className="launch-specs-grid">
              <div className="launch-spec-item">
                <span className="launch-spec-label">GPU NODE</span>
                <span className="launch-spec-val">RTX 4080 TIER 2</span>
              </div>
              <div className="launch-spec-item">
                <span className="launch-spec-label">LATENCY</span>
                <span className="launch-spec-val" style={{ color: "var(--neon-emerald)" }}>3.2ms (EDGE)</span>
              </div>
              <div className="launch-spec-item">
                <span className="launch-spec-label">ENCODING</span>
                <span className="launch-spec-val">AV1 4K HDR</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. GLOBAL NOTIFICATION TOAST */}
      {globalToast && (
        <div className="omni-toast">
          <div className="omni-toast-icon">{globalToast.icon}</div>
          <span className="omni-toast-message">{globalToast.message}</span>
        </div>
      )}
    </div>
  );
}

/**
 * Main Application Routing Component with Protected & Admin Routes
 */
export default function OmniPlayApp() {
  const authContext = useUser();
  const isAuthenticated = authContext?.isAuthenticated ?? false;
  const user = authContext?.user;
  const role = user?.role || authContext?.role || 'user';
  const login = authContext?.login;
  const logout = authContext?.logout;
  const nickname = authContext?.nickname || 'Player1';

  const navigate = useNavigate();
  const location = useLocation();

  const [launchingGame, setLaunchingGame] = useState<{ title: string; steamUri?: string } | null>(null);
  const [launchStep, setLaunchStep] = useState(0);
  const [globalToast, setGlobalToast] = useState<{ message: string; icon: React.ReactNode } | null>(null);

  const isAdmin = role === 'admin';

  // Compute activeTab from pathname (e.g. /library -> 'library')
  const currentTab = location.pathname.replace(/^\//, '') || 'library';

  const handleTabChange = (tab: string) => {
    // Guard: Prevent User from accessing Admin routes
    if (!isAdmin && (tab === 'infrastructure' || tab === 'analytics')) {
      navigate('/library');
      return;
    }
    // Guard: Prevent Admin from accessing User-only routes
    if (isAdmin && (tab === 'stats' || tab === 'community' || tab === 'support')) {
      navigate('/library');
      return;
    }
    navigate(`/${tab}`);
  };

  const handleLogin = (userRole: UserRole) => {
    if (login) {
      login(userRole);
    }
    // Redirect to attempted route if available, otherwise default to /library
    const fromPath = (location.state as { from?: { pathname: string } })?.from?.pathname;
    const destination = fromPath && fromPath !== '/login' ? fromPath : '/library';
    navigate(destination, { replace: true });

    setGlobalToast({
      message: userRole === 'admin' ? `Signed in as Administrator (${nickname})` : `Signed in as ${nickname}`,
      icon: userRole === 'admin' 
        ? <ShieldAlert style={{ color: "var(--neon-rose)", width: 18, height: 18 }} /> 
        : <Gamepad2 style={{ color: "var(--neon-cyan)", width: 18, height: 18 }} />
    });
    setTimeout(() => setGlobalToast(null), 3500);
  };

  const handleLogout = async () => {
    if (logout) {
      await logout();
    }
    navigate('/login', { replace: true });
  };

  const handleLaunchGame = (gameTitle: string, steamUri?: string) => {
    setLaunchingGame({ title: gameTitle, steamUri });
    setLaunchStep(0);
    setTimeout(() => setLaunchStep(1), 1200);
    setTimeout(() => setLaunchStep(2), 2800);
    setTimeout(() => {
      setLaunchStep(3);
      setTimeout(() => {
        setLaunchingGame(null);
        setGlobalToast({ 
          message: `Active Steam Stream: ${gameTitle}`, 
          icon: <CheckCircle2 style={{ color: "var(--neon-emerald)", width: 20, height: 20 }} /> 
        });
        setTimeout(() => setGlobalToast(null), 4000);
      }, 1400);
    }, 4500);
  };

  return (
    <Routes>
      {/* Public Login Route - EXPLICITLY UNPROTECTED to prevent redirect loops */}
      <Route 
        path="/login" 
        element={<LoginPage onLogin={handleLogin} />} 
      />

      {/* Root & Dashboard redirects: Direct to /library if authenticated, or /login if unauthenticated */}
      <Route path="/" element={<Navigate to={isAuthenticated && user ? "/library" : "/login"} replace />} />
      <Route path="/dashboard" element={<Navigate to={isAuthenticated && user ? "/library" : "/login"} replace />} />
      <Route path="/admin" element={<Navigate to={isAuthenticated && user ? "/library" : "/login"} replace />} />
      <Route path="/operator" element={<Navigate to={isAuthenticated && user ? "/library" : "/login"} replace />} />

      {/* Protected: Game Library */}
      <Route 
        path="/library" 
        element={
          <ProtectedRoute>
            <DashboardShell
              activeTab="library"
              onTabChange={handleTabChange}
              onLogout={handleLogout}
              launchingGame={launchingGame}
              launchStep={launchStep}
              globalToast={globalToast}
            >
              {isAdmin ? (
                <AdminGameLibrary onToast={(msg, type) => {
                  setGlobalToast({
                    message: msg,
                    icon: type === 'warn' 
                      ? <AlertTriangle style={{ color: "var(--neon-amber)", width: 18, height: 18 }} /> 
                      : <CheckCircle2 style={{ color: "var(--neon-emerald)", width: 18, height: 18 }} />
                  });
                  setTimeout(() => setGlobalToast(null), 3500);
                }} />
              ) : (
                <PlayerDashboard onLaunchGame={handleLaunchGame} />
              )}
            </DashboardShell>
          </ProtectedRoute>
        } 
      />

      {/* Protected: User Stats */}
      <Route 
        path="/stats" 
        element={
          <ProtectedRoute>
            <DashboardShell
              activeTab="stats"
              onTabChange={handleTabChange}
              onLogout={handleLogout}
              launchingGame={launchingGame}
              launchStep={launchStep}
              globalToast={globalToast}
            >
              <UserStatsDashboard />
            </DashboardShell>
          </ProtectedRoute>
        } 
      />

      {/* Protected: Community */}
      <Route 
        path="/community" 
        element={
          <ProtectedRoute>
            <DashboardShell
              activeTab="community"
              onTabChange={handleTabChange}
              onLogout={handleLogout}
              launchingGame={launchingGame}
              launchStep={launchStep}
              globalToast={globalToast}
            >
              <CommunityView />
            </DashboardShell>
          </ProtectedRoute>
        } 
      />

      {/* Protected: Remote */}
      <Route 
        path="/remote" 
        element={
          <ProtectedRoute>
            <DashboardShell
              activeTab="remote"
              onTabChange={handleTabChange}
              onLogout={handleLogout}
              launchingGame={launchingGame}
              launchStep={launchStep}
              globalToast={globalToast}
            >
              {isAdmin ? <AdminOmniRemote /> : <OmniRemote />}
            </DashboardShell>
          </ProtectedRoute>
        } 
      />

      {/* Protected: Support */}
      <Route 
        path="/support" 
        element={
          <ProtectedRoute>
            <DashboardShell
              activeTab="support"
              onTabChange={handleTabChange}
              onLogout={handleLogout}
              launchingGame={launchingGame}
              launchStep={launchStep}
              globalToast={globalToast}
            >
              <UserSupportView />
            </DashboardShell>
          </ProtectedRoute>
        } 
      />

      {/* Admin Protected: Cloud Nodes */}
      <Route 
        path="/infrastructure" 
        element={
          <AdminRoute>
            <DashboardShell
              activeTab="infrastructure"
              onTabChange={handleTabChange}
              onLogout={handleLogout}
              launchingGame={launchingGame}
              launchStep={launchStep}
              globalToast={globalToast}
            >
              <CloudResourcesDashboard />
            </DashboardShell>
          </AdminRoute>
        } 
      />

      {/* Admin Protected: Analytics */}
      <Route 
        path="/analytics" 
        element={
          <AdminRoute>
            <DashboardShell
              activeTab="analytics"
              onTabChange={handleTabChange}
              onLogout={handleLogout}
              launchingGame={launchingGame}
              launchStep={launchStep}
              globalToast={globalToast}
            >
              <AnalyticsDashboard />
            </DashboardShell>
          </AdminRoute>
        } 
      />

      {/* Catch-all route: redirects unauthorized visitors to /login, authorized to /library */}
      <Route 
        path="*" 
        element={<Navigate to={isAuthenticated && user ? "/library" : "/login"} replace />} 
      />
    </Routes>
  );
}
