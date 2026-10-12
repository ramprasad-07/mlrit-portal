import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

export type UserRole = 'STUDENT' | 'FACULTY' | 'ADMIN';

export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  profile?: any;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string, role?: string) => Promise<User>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('mlrit_token');
    const savedUser = localStorage.getItem('mlrit_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (err) {
        localStorage.removeItem('mlrit_token');
        localStorage.removeItem('mlrit_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string, role?: string): Promise<User> => {
    const response = await api.post('/auth/login', { username, password, role });
    const data = response.data;

    const loggedUser: User = {
      id: data.id,
      username: data.username,
      email: data.email,
      fullName: data.fullName,
      role: data.role as UserRole,
      profile: data.profile,
    };

    localStorage.setItem('mlrit_token', data.token);
    localStorage.setItem('mlrit_user', JSON.stringify(loggedUser));

    setToken(data.token);
    setUser(loggedUser);

    return loggedUser;
  };

  const logout = () => {
    localStorage.removeItem('mlrit_token');
    localStorage.removeItem('mlrit_user');
    setToken(null);
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
