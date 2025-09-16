import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Mock users for demo
const mockUsers: User[] = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@cargosurvey.com',
    role: 'admin'
  },
  {
    id: 2,
    username: 'surveyor1',
    email: 'surveyor1@cargosurvey.com',
    role: 'user'
  },
  {
    id: 3,
    username: 'surveyor2',
    email: 'surveyor2@cargosurvey.com',
    role: 'user'
  }
];

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Check for existing user on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser && token) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setToken(null);
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (username: string, password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock authentication - accept any password for demo users
    const foundUser = mockUsers.find(u => u.username === username);
    
    if (!foundUser) {
      throw new Error('Invalid credentials');
    }
    
    // For demo purposes, accept any password
    if (password.length < 3) {
      throw new Error('Password must be at least 3 characters');
    }
    
    // Generate mock token
    const mockToken = `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Save to localStorage
    localStorage.setItem('token', mockToken);
    localStorage.setItem('user', JSON.stringify(foundUser));
    
    setToken(mockToken);
    setUser(foundUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
