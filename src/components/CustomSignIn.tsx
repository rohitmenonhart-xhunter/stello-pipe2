import React from 'react';
import { SignIn, useUser, useClerk } from '@clerk/clerk-react';
import { Box, Container, Typography, Paper, useTheme, Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

const CustomSignIn: React.FC = () => {
  const theme = useTheme();
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();
  
  const handleSignOut = async () => {
    // Clear any project-related data from storage
    localStorage.removeItem('projectId');
    sessionStorage.removeItem('lastProjectId');
    sessionStorage.removeItem('developerName');
    
    // Clear any other app-specific stored data
    localStorage.clear();
    sessionStorage.clear();
    
    // Sign out from Clerk
    await signOut();
    
    // Force page reload to ensure clean state
    window.location.href = '/';
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
      <Container maxWidth="sm">
        {isSignedIn && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<LogoutIcon />}
              onClick={handleSignOut}
              sx={{
                borderRadius: '20px',
                px: 3,
              }}
            >
              Sign Out & Use Different Account
            </Button>
          </Box>
        )}
        
        <Box 
          sx={{ 
            textAlign: 'center', 
            mb: 6,
            animation: 'slideUp 0.8s ease-out'
          }}
        >
          <Box 
            component="div" 
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
              mb: 2
            }}
          >
            Website Generator
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: theme.palette.text.secondary,
              maxWidth: '500px',
              mx: 'auto',
              mb: 4
            }}
          >
            Create beautiful, modern websites in minutes with our AI-powered platform
          </Typography>
        </Box>
        
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            borderRadius: 4,
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
            background: 'rgba(255, 255, 255, 0.9)',
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
            variant="h5" 
            align="center" 
            sx={{ 
              mb: 4, 
              fontWeight: 600,
              color: theme.palette.text.primary
            }}
          >
            Sign in to continue
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            '& .cl-card': { 
              width: '100%',
              boxShadow: 'none',
              border: 'none',
            },
            '& .cl-internal-b3fm6y': {
              display: 'none', // Hide the Clerk dashboard link
            },
            '& .cl-button-primary': {
              backgroundColor: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              }
            },
            '& .cl-socialButtonsIconButton': {
              border: `1px solid ${theme.palette.divider}`,
              '&:hover': {
                backgroundColor: 'rgba(98, 0, 234, 0.05)',
              }
            }
          }}>
            <SignIn 
              redirectUrl={window.location.origin}
              routing="path"
              path="/"
              signUpUrl="/"
              afterSignInUrl={window.location.origin}
              afterSignUpUrl={window.location.origin}
            />
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default CustomSignIn; 