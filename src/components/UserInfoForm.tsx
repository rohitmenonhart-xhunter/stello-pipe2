import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, CircularProgress, Chip, Stack, Tooltip, Switch, FormControlLabel, useTheme, alpha, Card } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import TimerIcon from '@mui/icons-material/Timer';
import CancelIcon from '@mui/icons-material/Cancel';

interface UserInfoFormProps {
  onSubmit: (userData: { name: string; email: string; phone: string }) => void;
  isLoading: boolean;
}

const UserInfoForm: React.FC<UserInfoFormProps> = ({ onSubmit, isLoading }) => {
  const theme = useTheme();
  const { user } = useAuth();
  
  // Initialize form with user data if available
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  // Track verification status - in our custom auth, we don't have verification statuses yet
  // so we'll assume email is always verified if it exists
  const isEmailVerified = !!user?.email;
  const isPhoneVerified = !!user?.phone;
  
  // Auto-submission settings
  const [enableAutoSubmit, setEnableAutoSubmit] = useState(true);
  const canAutoSubmit = enableAutoSubmit && !!user?.name && isEmailVerified;
  const [autoSubmitTriggered, setAutoSubmitTriggered] = useState(false);

  // Update form data if user data changes
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone
      }));
    }
  }, [user]);

  // Effect for auto-submission
  useEffect(() => {
    if (canAutoSubmit && !autoSubmitTriggered && !isLoading) {
      const timer = setTimeout(() => {
        if (validateForm()) {
          setAutoSubmitTriggered(true);
          onSubmit(formData);
        }
      }, 3000); // Longer delay to give user time to disable auto-submit if desired
      
      return () => clearTimeout(timer);
    }
  }, [canAutoSubmit, autoSubmitTriggered, isLoading]);

  const [errors, setErrors] = useState({
    name: false,
    email: false,
    phone: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Don't allow changes to verified fields
    if ((name === 'email' && isEmailVerified) || 
        (name === 'phone' && isPhoneVerified)) {
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: false
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: !formData.name.trim(),
      email: !isEmailVerified && !/^\S+@\S+\.\S+$/.test(formData.email),
      phone: false // Phone is now optional
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleAutoSubmitToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEnableAutoSubmit(e.target.checked);
    // Reset auto-submit trigger if disabled
    if (!e.target.checked) {
      setAutoSubmitTriggered(false);
    }
  };

  return (
    <Box 
      sx={{ 
        py: 6, 
        background: 'linear-gradient(135deg, rgba(98, 0, 234, 0.03), rgba(179, 136, 255, 0.07))'
      }}
      className="fade-in"
    >
      <Card 
        elevation={0} 
        sx={{ 
          p: 4, 
          maxWidth: 500, 
          mx: 'auto', 
          borderRadius: 4,
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
          background: alpha(theme.palette.background.paper, 0.9),
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          animation: 'slideUp 1s ease-out',
          position: 'relative',
          overflow: 'hidden',
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
          variant="h4" 
          component="h2" 
          gutterBottom 
          align="center"
          sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(135deg, #6200EA, #B388FF)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2
          }}
        >
          Your Contact Information
        </Typography>
        
        <Typography 
          variant="body1" 
          color="text.secondary" 
          paragraph 
          align="center"
          sx={{ mb: 4 }}
        >
          Please confirm your contact details to complete the template selection process.
          Only email is required for contact.
        </Typography>
        
        <Box sx={{ mb: 4 }}>
          <Stack 
            direction="row" 
            spacing={1} 
            justifyContent="center" 
            flexWrap="wrap" 
            gap={1}
          >
            {user?._id && (
              <Chip 
                icon={<VerifiedUserIcon />} 
                label="Authenticated" 
                color="success" 
                sx={{
                  fontWeight: 500,
                  backgroundColor: alpha(theme.palette.success.main, 0.1),
                  color: theme.palette.success.main,
                  border: 'none',
                  '& .MuiChip-icon': {
                    color: theme.palette.success.main,
                  }
                }}
              />
            )}
            {canAutoSubmit && !autoSubmitTriggered && (
              <Chip 
                icon={<TimerIcon />} 
                label="Auto-submitting with verified data" 
                color="primary" 
                sx={{
                  fontWeight: 500,
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  border: 'none',
                  '& .MuiChip-icon': {
                    color: theme.palette.primary.main,
                  }
                }}
              />
            )}
          </Stack>
        </Box>
        
        {isEmailVerified && (
          <Box 
            sx={{ 
              mb: 4, 
              p: 2, 
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            }}
          >
            <FormControlLabel
              control={
                <Switch 
                  checked={enableAutoSubmit} 
                  onChange={handleAutoSubmitToggle}
                  disabled={isLoading || autoSubmitTriggered}
                  color="primary"
                />
              }
              label={
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Auto-submit with my verified data
                </Typography>
              }
              sx={{
                mx: 'auto',
                display: 'flex',
                justifyContent: 'center'
              }}
            />
          </Box>
        )}
        
        {canAutoSubmit && !autoSubmitTriggered && (
          <Box 
            sx={{ 
              mb: 4, 
              p: 3, 
              borderRadius: 2,
              background: 'linear-gradient(135deg, rgba(98, 0, 234, 0.9), rgba(179, 136, 255, 0.9))',
              color: 'white',
              boxShadow: '0 4px 20px rgba(98, 0, 234, 0.3)',
              animation: 'pulse 2s infinite',
            }}
          >
            <Typography variant="body1" align="center" sx={{ fontWeight: 500 }}>
              Your verified information will be automatically submitted in a moment...
            </Typography>
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button 
                variant="outlined" 
                size="medium" 
                startIcon={<CancelIcon />}
                sx={{ 
                  color: 'white', 
                  borderColor: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'white',
                  }
                }}
                onClick={() => setEnableAutoSubmit(false)}
              >
                Cancel Auto-Submit
              </Button>
            </Box>
          </Box>
        )}
        
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Full Name"
            name="name"
            autoComplete="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            helperText={errors.name ? "Name is required" : ""}
            disabled={isLoading}
            InputProps={{
              endAdornment: user?.name ? (
                <Tooltip title="Name from your profile">
                  <InfoIcon color="primary" fontSize="small" sx={{ ml: 1 }} />
                </Tooltip>
              ) : null,
              sx: {
                borderRadius: 2,
                '&.Mui-focused': {
                  boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`
                }
              }
            }}
            sx={{ mb: 2 }}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            helperText={errors.email ? "Valid email is required" : isEmailVerified ? "Email verified" : ""}
            disabled={isLoading || isEmailVerified}
            InputProps={{
              endAdornment: isEmailVerified ? (
                <Tooltip title="Email verified">
                  <CheckCircleIcon color="success" fontSize="small" sx={{ ml: 1 }} />
                </Tooltip>
              ) : null,
              sx: {
                borderRadius: 2,
                backgroundColor: isEmailVerified ? alpha(theme.palette.success.main, 0.05) : 'transparent',
                '&.Mui-focused': {
                  boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`
                }
              }
            }}
            sx={{ mb: 2 }}
          />
          
          <TextField
            margin="normal"
            fullWidth
            id="phone"
            label="Phone Number (Optional)"
            name="phone"
            autoComplete="tel"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            helperText={isPhoneVerified ? "Phone verified" : ""}
            disabled={isLoading || isPhoneVerified}
            InputProps={{
              endAdornment: isPhoneVerified ? (
                <Tooltip title="Phone verified">
                  <CheckCircleIcon color="success" fontSize="small" sx={{ ml: 1 }} />
                </Tooltip>
              ) : null,
              sx: {
                borderRadius: 2,
                backgroundColor: isPhoneVerified ? alpha(theme.palette.success.main, 0.05) : 'transparent',
                '&.Mui-focused': {
                  boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`
                }
              }
            }}
            sx={{ mb: 3 }}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
            sx={{
              py: 1.5,
              mt: 2,
              mb: 1,
              borderRadius: 2,
              fontWeight: 600,
              fontSize: '1rem',
              textTransform: 'none',
              boxShadow: '0 4px 14px rgba(98, 0, 234, 0.4)',
              background: 'linear-gradient(90deg, #6200EA, #B388FF)',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 6px 20px rgba(98, 0, 234, 0.5)',
                background: 'linear-gradient(90deg, #5000D6, #A370FF)',
              }
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Submit and Download Template"
            )}
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

export default UserInfoForm; 