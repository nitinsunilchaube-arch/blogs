import { createContext, useContext, useState, useCallback } from 'react';
import { checkPassword, hasPassword, setPassword as storePassword } from '../services/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [passwordExists, setPasswordExists] = useState(hasPassword());

  const login = useCallback((password) => {
    if (!hasPassword()) {
      // First-time setup — set the password
      storePassword(password);
      setPasswordExists(true);
      setIsAdmin(true);
      return true;
    }
    if (checkPassword(password)) {
      setIsAdmin(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAdmin(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAdmin, passwordExists, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
