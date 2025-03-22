import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import ClientDashboard from './components/ClientDashboard';
import DeveloperPortal from './components/DeveloperPortal';
import Login from './components/Login';
import DeveloperLogin from './components/DeveloperLogin';
import Register from './components/Register';
import AdminPanel from './components/AdminPanel';
import AdminAccess from './components/AdminAccess';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './components/LandingPage';

// Protected route component
const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { isAuthenticated, loading } = useAuth();
  
  // Show loading state if auth is still being checked
  if (loading) {
    return <div>Loading...</div>;
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Render the protected component if authenticated
  return element;
};

// Developer route component that checks for developer role
const DeveloperRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { isAuthenticated, loading, user } = useAuth();
  
  // Show loading state if auth is still being checked
  if (loading) {
    return <div>Loading...</div>;
  }
  
  // Redirect to developer login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/developer-login" replace />;
  }
  
  // Check if user has developer or admin role
  if (!user || (user.role !== 'developer' && user.role !== 'admin')) {
    // Not a developer, redirect to client dashboard
    return <Navigate to="/client-dashboard" replace />;
  }
  
  // Render the developer portal component if authenticated and has developer role
  return element;
};

// Admin route component that checks for admin role
const AdminRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { isAuthenticated, loading, user } = useAuth();
  
  // Show loading state if auth is still being checked
  if (loading) {
    return <div>Loading...</div>;
  }
  
  // Check if admin password is stored in localStorage
  const hasAdminPassword = localStorage.getItem('adminPassword') === 'iamunique7$';
  
  // Allow access if the user has the correct admin password, OR if they're authenticated with admin role
  if (hasAdminPassword || (isAuthenticated && user && user.role === 'admin')) {
    return element;
  }
  
  // Check if the admin path is requested for the password-based access
  if (window.location.pathname === '/admin' && !hasAdminPassword) {
    // Redirect to admin access page to enter password
    return <Navigate to="/admin-access" replace />;
  }
  
  // Redirect to login if not authenticated at all
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // User is authenticated but not admin and doesn't have the password
  return <Navigate to="/client-dashboard" replace />;
};

// Auth routes that redirect to home if already authenticated
const AuthRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { isAuthenticated, loading } = useAuth();
  
  // Show loading state if auth is still being checked
  if (loading) {
    return <div>Loading...</div>;
  }
  
  // Redirect to client dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/client-dashboard" replace />;
  }
  
  // Render the auth component if not authenticated
  return element;
};

const AppRoutes = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Auth routes - redirect to home if already logged in */}
          <Route path="/login" element={<AuthRoute element={<Login />} />} />
          <Route path="/developer-login" element={<AuthRoute element={<DeveloperLogin />} />} />
          <Route path="/register" element={<AuthRoute element={<Register />} />} />
          
          {/* Admin access page - public */}
          <Route path="/admin-access" element={<AdminAccess />} />
          
          {/* Protected routes - require authentication */}
          <Route path="/app" element={<ProtectedRoute element={<App />} />} />
          <Route path="/client-dashboard" element={<ProtectedRoute element={<ClientDashboard />} />} />
          
          {/* Developer routes - require developer role */}
          <Route path="/developer-portal" element={<DeveloperRoute element={<DeveloperPortal />} />} />
          
          {/* Admin routes - require admin role */}
          <Route path="/admin" element={<AdminRoute element={<AdminPanel />} />} />
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default AppRoutes; 