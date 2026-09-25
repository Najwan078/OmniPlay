import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, UserRole } from '../types/auth';
import { registerAuthCallbacks, authApi } from '../services/api';

interface UserContextType {
  user: User | null;
  nickname: string;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (role: UserRole, nickname?: string) => void;
  logout: () => Promise<void>;
  clearAuthState: () => void;
  setNickname: (name: string) => void;
  setRole: (role: UserRole) => void;
  setIsAuthenticated: (auth: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  // Non-sensitive UI state (nickname) persisted for convenience
  const [nickname, setNicknameState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('omni_operator_nickname');
      return saved && saved.trim() ? saved.trim() : 'Player1';
    } catch {
      return 'Player1';
    }
  });

  const [role, setRoleState] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem('omni_operator_role');
      return saved === 'admin' || saved === 'user' ? saved : 'user';
    } catch {
      return 'user';
    }
  });

  // Pure memory auth state: JWT token is held strictly by browser in HttpOnly Cookie
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Clear memory auth state on 401 Unauthorized or manual logout
  const clearAuthState = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    try {
      sessionStorage.clear();
      localStorage.removeItem('omni_operator_role');
    } catch {
      // Ignore storage restrictions
    }
  }, []);

  // Register Axios security interceptor callbacks
  useEffect(() => {
    registerAuthCallbacks(
      () => {
        // Invoked automatically when Axios receives a 401 Unauthorized
        clearAuthState();
      },
      () => {
        // Invoked on 403 Forbidden
        console.warn('[UserContext] 403 Forbidden: Insufficient clearance for requested resource.');
      }
    );

    // Also listen to custom security DOM events
    const handleUnauthorizedEvent = () => clearAuthState();
    window.addEventListener('omni:unauthorized', handleUnauthorizedEvent);
    return () => {
      window.removeEventListener('omni:unauthorized', handleUnauthorizedEvent);
    };
  }, [clearAuthState]);

  const setNickname = (name: string) => {
    const clean = name && name.trim() ? name.trim() : 'Player1';
    setNicknameState(clean);
    try {
      localStorage.setItem('omni_operator_nickname', clean);
    } catch (e) {
      console.warn('Failed to save nickname to localStorage:', e);
    }
    if (user) {
      setUser({ ...user, nickname: clean });
    }
  };

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    try {
      localStorage.setItem('omni_operator_role', newRole);
    } catch (e) {
      console.warn('Failed to save role to localStorage:', e);
    }
    if (user) {
      setUser({ ...user, role: newRole });
    }
  };

  const login = (newRole: UserRole, customNickname?: string) => {
    const activeNickname = customNickname && customNickname.trim() ? customNickname.trim() : nickname;
    setRole(newRole);
    setNickname(activeNickname);
    setUser({
      nickname: activeNickname,
      role: newRole,
      tier: newRole === 'admin' ? 'Root Security / Level 5' : 'Tier 1 Operator',
      lastLogin: new Date().toISOString()
    });
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      // Notify backend to clear HttpOnly cookie
      await authApi.logout();
    } catch (e) {
      console.warn('Backend logout encountered error:', e);
    } finally {
      clearAuthState();
    }
  };

  return (
    <UserContext.Provider value={{
      user,
      nickname,
      role,
      isAuthenticated,
      isLoading,
      login,
      logout,
      clearAuthState,
      setNickname,
      setRole,
      setIsAuthenticated
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
