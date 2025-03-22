import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Container,
  Alert,
  InputAdornment,
  IconButton,
  useTheme
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

const AdminAccess: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Check if the admin password is already in localStorage
  useEffect(() => {
    const adminPassword = localStorage.getItem('adminPassword');
    if (adminPassword === 'iamunique7$') {
      // Already has admin access, redirect to admin panel
      navigate('/admin');
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password) {
      setError('Please enter the admin password');
      return;
    }
    
    // Check if password matches the special admin password
    if (password === 'iamunique7$') {
      // Store the admin password in localStorage
      localStorage.setItem('adminPassword', password);
      setSuccess(true);
      
      // Redirect to admin panel after a short delay
      setTimeout(() => {
        navigate('/admin');
      }, 1500);
    } else {
      setError('Invalid admin password');
    }
  };

  return (
    <div className="App">
      <Header />
      <Container maxWidth="sm" sx={{ mt: 8, mb: 8 }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            borderRadius: 4,
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
          className="fade-in"
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 3, 
            gap: 1.5,
            pb: 2,
            borderBottom: '1px solid',
            borderColor: 'divider' 
          }}>
            <AdminPanelSettingsIcon sx={{ color: 'primary.main', fontSize: 32 }} />
            <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
              Admin Access
            </Typography>
          </Box>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Enter the admin password to access the administration panel.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Access granted! Redirecting to admin panel...
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Admin Password"
              variant="outlined"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              margin="normal"
              sx={{ mb: 3 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <Button 
              type="submit" 
              fullWidth 
              variant="contained" 
              size="large"
              disabled={success}
              sx={{ 
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                background: theme => `linear-gradient(90deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                '&:hover': {
                  background: theme => `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                }
              }}
            >
              Access Admin Panel
            </Button>
          </form>

          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="body2" color="text.secondary">
              Don't have the admin password? 
              <Button 
                variant="text" 
                sx={{ ml: 1 }}
                onClick={() => navigate('/')}
              >
                Return to Home
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </div>
  );
};

export default AdminAccess; 