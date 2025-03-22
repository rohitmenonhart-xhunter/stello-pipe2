import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  UserData, 
  LoginCredentials, 
  RegisterData, 
  loginUser as login, 
  registerUser as register,
  logoutUser as logout,
  isAuthenticated as checkAuth,
  getCurrentUser
} from '../services/authService';

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserData | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
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

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(checkAuth());
  const [user, setUser] = useState<UserData | null>(getCurrentUser());
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Effect to load user from session storage on mount
  useEffect(() => {
    const checkAuthentication = () => {
      const isAuthed = checkAuth();
      setIsAuthenticated(isAuthed);
      
      if (isAuthed) {
        const currentUser = getCurrentUser();
        setUser(currentUser);
      }
    };
    
    checkAuthentication();
  }, []);

  // Login function
  const handleLogin = async (credentials: LoginCredentials): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      // First, clear any existing project data from previous sessions
      localStorage.removeItem('projectId');
      sessionStorage.removeItem('lastProjectId');
      sessionStorage.removeItem('userProjects');
      
      const response = await login(credentials);
      
      if (response.success && response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
        setLoading(false);
        return true;
      } else {
        setError(response.error || 'Login failed');
        setLoading(false);
        return false;
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
      return false;
    }
  };

  // Register function
  const handleRegister = async (userData: RegisterData): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      // First, clear any existing project data from previous sessions
      localStorage.removeItem('projectId');
      sessionStorage.removeItem('lastProjectId');
      sessionStorage.removeItem('userProjects');
      
      const response = await register(userData);
      
      if (response.success && response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
        setLoading(false);
        return true;
      } else {
        setError(response.error || 'Registration failed');
        setLoading(false);
        return false;
      }
    } catch (err) {
      console.error('Auth context registration error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      setLoading(false);
      return false;
    }
  };

  // Logout function
  const handleLogout = () => {
    logout();
    setUser(null);
    setIsAuthenticated(false);
    
    // Force reload to clear any remaining state
    window.location.href = '/';
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 