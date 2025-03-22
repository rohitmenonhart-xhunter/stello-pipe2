import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  CircularProgress, 
  Alert, 
  InputAdornment, 
  IconButton,
  Divider,
  alpha
} from '@mui/material';
import { Visibility, VisibilityOff, Build } from '@mui/icons-material';
import Header from './Header';
import { useAuth } from '../context/AuthContext';

const DeveloperLogin: React.FC = () => {
  const navigate = useNavigate();
  const { login, error: authError, loading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Clear errors when inputs change
  useEffect(() => {
    if (error) setError(null);
  }, [email, password]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email && !password) {
      setError('Please enter your email and password.');
      return;
    }
    
    if (!email) {
      setError('Please enter your email.');
      return;
    }
    
    if (!password) {
      setError('Please enter your password.');
      return;
    }
    
    try {
      const success = await login({ email, password });
      
      if (success) {
        // Get the user from sessionStorage to check role
        const userStr = sessionStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          
          // Check if the user is a developer
          if (user.role === 'developer' || user.role === 'admin') {
            // Store developer name in session storage
            sessionStorage.setItem('developerName', user.name);
            navigate('/developer-portal');
          } else {
            // Not a developer - show error and log the user out
            setError('Access denied. Only developers can log in here.');
            sessionStorage.removeItem('user');
            sessionStorage.removeItem('isAuthenticated');
          }
        }
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
      console.error('Login error:', err);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
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
            <Build sx={{ color: 'primary.main', fontSize: 32 }} />
            <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
              Developer Login
            </Typography>
          </Box>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            This portal is exclusively for developers. If you're a client, please use the regular login page.
          </Typography>

          {(error || authError) && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error || authError}
            </Alert>
          )}

          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              sx={{ mb: 3 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
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
              disabled={loading}
              sx={{ 
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                background: theme => `linear-gradient(90deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                '&:hover': {
                  background: theme => `linear-gradient(90deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.light, 0.8)})`,
                }
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Log In as Developer'}
            </Button>
          </form>

          <Divider sx={{ my: 4 }} />

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Not a developer? 
              <Button 
                variant="text" 
                sx={{ ml: 1 }}
                onClick={() => navigate('/login')}
              >
                Go to Client Login
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </div>
  );
};

export default DeveloperLogin; 