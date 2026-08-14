import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import client from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);

  const setUser = useCallback((userData) => {
    setUserState(userData);
  }, []);

  const logout = useCallback(() => {
    Cookies.remove('lms_token');
    setUserState(null);
  }, []);

  // On mount, try to hydrate user from the token
  useEffect(() => {
    const token = Cookies.get('lms_token');
    if (!token) {
      setLoading(false);
      return;
    }
    client
      .get('/api/members/me')
      .then((res) => setUserState(res.data))
      .catch(() => Cookies.remove('lms_token'))
      .finally(() => setLoading(false));
  }, []);

  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}