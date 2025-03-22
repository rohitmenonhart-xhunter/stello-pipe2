import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Tab, 
  Tabs, 
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  useTheme 
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import PhoneIcon from '@mui/icons-material/Phone';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`login-tabpanel-${index}`}
      aria-labelledby={`login-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Login: React.FC = () => {
  const theme = useTheme();
  const { login, error, loading } = useAuth();
  const navigate = useNavigate();
  
  const [tabValue, setTabValue] = useState(0);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setValidationError(null);
  };
  
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  const validatePhone = (phone: string) => {
    const re = /^\+?[0-9]{10,15}$/;
    return re.test(phone);
  };
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    
    // Validate fields
    if (tabValue === 0) {
      // Email login
      if (!email) {
        setValidationError('Email is required');
        return;
      }
      
      if (!validateEmail(email)) {
        setValidationError('Please enter a valid email address');
        return;
      }
    } else {
      // Phone login
      if (!phone) {
        setValidationError('Phone number is required');
        return;
      }
      
      if (!validatePhone(phone)) {
        setValidationError('Please enter a valid phone number');
        return;
      }
    }
    
    if (!password) {
      setValidationError('Password is required');
      return;
    }
    
    // Call login function
    const success = await login({
      email: tabValue === 0 ? email : undefined,
      phone: tabValue === 1 ? phone : undefined,
      password
    });
    
    if (success) {
      // Navigate to client dashboard page
      navigate('/client-dashboard');
    }
  };
  
  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, rgba(98, 0, 234, 0.05), rgba(179, 136, 255, 0.1))',
        py: 8
      }}
      className="fade-in"
    >
      <Box 
        sx={{ 
          width: 80, 
          height: 80, 
          borderRadius: '24px', 
          background: 'linear-gradient(135deg, #6200EA, #B388FF)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mx: 'auto',
          mb: 3,
          boxShadow: '0 10px 30px rgba(98, 0, 234, 0.3)',
        }}
      >
        <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
          W
        </Typography>
      </Box>
      
      <Typography 
        variant="h3" 
        gutterBottom 
        sx={{ 
          fontWeight: 700,
          background: 'linear-gradient(135deg, #6200EA, #B388FF)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 2,
          textAlign: 'center'
        }}
      >
        Website Generator
      </Typography>
      
      <Paper 
        elevation={0} 
        sx={{ 
          width: '100%',
          maxWidth: 400,
          p: 3, 
          borderRadius: 4,
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          overflow: 'hidden',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '4px',
            background: 'linear-gradient(90deg, #6200EA, #B388FF)',
          }
        }}
      >
        <Typography 
          variant="h5" 
          align="center" 
          sx={{ 
            fontWeight: 600,
            color: theme.palette.text.primary,
            mb: 2
          }}
        >
          Sign In
        </Typography>
        
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="fullWidth" 
          sx={{ 
            mb: 2,
            '& .MuiTabs-indicator': {
              backgroundColor: theme.palette.primary.main,
            },
          }}
        >
          <Tab 
            label="Email" 
            icon={<AlternateEmailIcon />} 
            iconPosition="start" 
            sx={{ 
              textTransform: 'none',
              fontWeight: 500
            }}
          />
          <Tab 
            label="Phone" 
            icon={<PhoneIcon />} 
            iconPosition="start" 
            sx={{ 
              textTransform: 'none',
              fontWeight: 500
            }}
          />
        </Tabs>
        
        {(error || validationError) && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {validationError || error}
          </Alert>
        )}
        
        <form onSubmit={handleLogin}>
          <TabPanel value={tabValue} index={0}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="dense"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AlternateEmailIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <TextField
              label="Phone Number"
              variant="outlined"
              fullWidth
              margin="dense"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          </TabPanel>
          
          <Box sx={{ p: 3, pt: 0 }}>
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              margin="dense"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
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
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{ 
                mt: 3, 
                py: 1.5,
                background: 'linear-gradient(90deg, #6200EA, #B388FF)',
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1.1rem',
                '&:hover': {
                  background: 'linear-gradient(90deg, #5000C9, #A270FF)',
                }
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>
            
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="textSecondary">
                Don't have an account?{' '}
                <Button 
                  color="primary" 
                  onClick={() => navigate('/register')}
                  sx={{ 
                    textTransform: 'none',
                    fontWeight: 'bold',
                    p: 0,
                    ml: 0.5
                  }}
                >
                  Sign Up
                </Button>
              </Typography>
            </Box>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default Login; 