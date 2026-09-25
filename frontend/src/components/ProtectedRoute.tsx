import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import type { UserRole } from '../types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

/**
 * Standard Protected Route:
 * Blocks unauthorized users and gracefully redirects to /login.
 * Safely handles null/undefined user context with optional chaining (user?.role).
 */
export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const authContext = useUser();
  const location = useLocation();

  const isLoading = authContext?.isLoading ?? false;
  const isAuthenticated = authContext?.isAuthenticated ?? false;
  const user = authContext?.user;
  const userRole = user?.role || authContext?.role;

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100vw',
        background: '#07090e',
        color: 'var(--neon-cyan)',
        fontFamily: 'var(--font-sans)',
        fontSize: '14px',
        letterSpacing: '0.05em'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="neon-ring-loader" style={{ margin: '0 auto 16px auto' }}>
            <div className="neon-ring-outer" />
            <div className="neon-ring-middle" />
            <div className="neon-ring-inner" />
          </div>
          <span>VERIFYING CRYPTOGRAPHIC CLEARANCE...</span>
        </div>
      </div>
    );
  }

  // Gracefully redirect to /login if user is null or unauthenticated without throwing TypeError
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Guard against insufficient RBAC role using optional chaining
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/library" replace />;
  }

  return <>{children}</>;
}

/**
 * Administrator Protected Route:
 * Validates authentication and verifies user holding 'admin' RBAC clearance using optional chaining (user?.role).
 */
export function AdminRoute({ children }: { children: React.ReactNode }) {
  const authContext = useUser();
  const location = useLocation();

  const isLoading = authContext?.isLoading ?? false;
  const isAuthenticated = authContext?.isAuthenticated ?? false;
  const user = authContext?.user;
  const userRole = user?.role || authContext?.role;

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100vw',
        background: '#07090e',
        color: 'var(--neon-rose)',
        fontFamily: 'var(--font-sans)',
        fontSize: '14px',
        letterSpacing: '0.05em'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="neon-ring-loader" style={{ margin: '0 auto 16px auto' }}>
            <div className="neon-ring-outer" />
            <div className="neon-ring-middle" />
            <div className="neon-ring-inner" />
          </div>
          <span>VALIDATING ROOT RBAC CLEARANCE...</span>
        </div>
      </div>
    );
  }

  // Gracefully redirect to /login if user is null or unauthenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verify admin role safely using optional chaining
  if (userRole !== 'admin') {
    return <Navigate to="/library" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
