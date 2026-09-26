import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/authService';

export const AuthContext = createContext(null);

const normalizeUser = (userData) => {
  if (!userData) return userData;
  const role = (userData.role === 'SUPERADMIN' || userData.username === 'superadmin') 
    ? 'SUPER_ADMIN' 
    : userData.role;
  return { ...userData, role };
};

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('pos_user');
    return savedUser ? normalizeUser(JSON.parse(savedUser)) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('pos_token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      const storedToken = localStorage.getItem('pos_token');
      if (storedToken) {
        try {
          const rawUserData = await authService.getCurrentUser();
          const userData = normalizeUser(rawUserData);
          setUser(userData);
          localStorage.setItem('pos_user', JSON.stringify(userData));
        } catch {
          logout();
        }
      }
      setIsLoading(false);
    };

    verifySession();
  }, []);

  const login = async (username, password) => {
    const response = await authService.login(username, password);
    const jwtToken = response?.token;
    const rawUserData = response?.user || response;
    const userData = normalizeUser(rawUserData);

    if (jwtToken) {
      localStorage.setItem('pos_token', jwtToken);
    }
    if (userData) {
      localStorage.setItem('pos_user', JSON.stringify(userData));
    }

    setToken(jwtToken);
    setUser(userData);

    // Clear stale cached queries so fresh data is fetched immediately
    queryClient.clear();

    return userData;
  };

  const logout = () => {
    localStorage.removeItem('pos_token');
    localStorage.removeItem('pos_user');
    setToken(null);
    setUser(null);
    queryClient.clear();
  };

  const loginWithToken = async (rawToken) => {
    if (!rawToken) return null;
    localStorage.setItem('pos_token', rawToken);
    setToken(rawToken);
    try {
      const rawUserData = await authService.getCurrentUser();
      const userData = normalizeUser(rawUserData);
      setUser(userData);
      localStorage.setItem('pos_user', JSON.stringify(userData));
      queryClient.clear();
      return userData;
    } catch (err) {
      logout();
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        loginWithToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};
