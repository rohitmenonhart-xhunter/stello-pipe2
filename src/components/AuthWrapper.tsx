import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Container, Typography } from '@mui/material';
import Login from './Login';

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Show loading state while authentication is initializing
  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Loading...
        </Typography>
      </Container>
    );
  }

  // If user is not authenticated, show the login component
  if (!isAuthenticated) {
    return <Login />;
  }

  // If user is authenticated, render the children
  return <>{children}</>;
};

export default AuthWrapper; 