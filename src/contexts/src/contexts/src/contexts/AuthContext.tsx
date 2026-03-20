import React, { createContext, useContext, useState } from 'react';

export type UserName = 'Dr Guilherme' | 'Karla' | 'Jodele' | 'Carlise' | 'Rafael';

const USERS: Record<UserName, string> = {
  'Dr Guilherme': 'gui123',
  'Karla': 'karla123',
  'Jodele': 'jodele123',
  'Carlise': 'carlise123',
  'Rafael': 'rafael123',
};

const STORAGE_KEY = 'triage_user';

interface AuthContextType {
  currentUser: UserName | null;
  login: (user: UserName, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserName | null>(() => {
    try { return localStorage.getItem(STORAGE_KEY) as UserName | null; } catch { return null; }
  });

  const login = (user: UserName, password: string): boolean => {
    if (USERS[user] === password) {
      setCurrentUser(user);
      try { localStorage.setItem(STORAGE_KEY, user); } catch {}
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
