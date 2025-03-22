import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box, Avatar, Menu, MenuItem, useTheme, Container, IconButton, Chip, Tooltip } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BuildIcon from '@mui/icons-material/Build';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [projectId, setProjectId] = useState<string | null>(null);
  const open = Boolean(anchorEl);

  // Load project ID from localStorage on component mount and when location changes
  useEffect(() => {
    const checkForProjectId = () => {
      const savedProjectId = localStorage.getItem('projectId') || sessionStorage.getItem('lastProjectId');
      if (savedProjectId && savedProjectId !== projectId) {
        setProjectId(savedProjectId);
      }
    };
    
    // Check immediately
    checkForProjectId();
    
    // Set up an interval to check for project ID changes
    const intervalId = setInterval(checkForProjectId, 1000);
    
    // Clean up the interval on unmount
    return () => clearInterval(intervalId);
  }, [location.pathname, projectId]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    logout();
    handleClose();
  };

  // Function to get user's initials for avatar
  const getUserInitials = (): string => {
    if (!user || !user.name) return '?';
    
    const nameParts = user.name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
    }
    
    return nameParts[0][0].toUpperCase();
  };

  return (
    <AppBar 
      position="sticky" 
      color="default" 
      elevation={0} 
      sx={{ 
        backgroundColor: 'white',
        borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
        backdropFilter: 'blur(8px)',
        zIndex: theme.zIndex.drawer + 1,
      }}
      className="fade-in"
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ py: 1, px: { xs: 1, sm: 2 } }}>
          <Box 
            component="div" 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              cursor: 'pointer' 
            }}
            onClick={() => navigate('/')}
          >
            <Box 
              component="div" 
              sx={{ 
                width: 40, 
                height: 40, 
                borderRadius: '12px', 
                background: 'linear-gradient(135deg, #6200EA, #B388FF)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
                boxShadow: '0 4px 10px rgba(98, 0, 234, 0.2)',
              }}
            >
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                W
              </Typography>
            </Box>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                flexGrow: 1, 
                fontWeight: 700,
                background: 'linear-gradient(135deg, #6200EA, #B388FF)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: { xs: 'none', sm: 'block' }
              }}
            >
              Website Generator
            </Typography>
          </Box>
          
          <Box sx={{ flexGrow: 1 }} />
          
          {/* Display Project ID if available */}
          {projectId && (
            <Chip 
              label={`Project ID: ${projectId}`}
              color="primary"
              sx={{ 
                mr: 2,
                fontWeight: 'bold', 
                fontSize: '0.85rem',
                background: 'linear-gradient(135deg, #6200EA, #B388FF)',
                color: 'white',
                display: { xs: 'none', md: 'flex' }
              }}
            />
          )}
          
          {isAuthenticated && user ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box 
                sx={{ 
                  display: { xs: 'none', md: 'flex' }, 
                  alignItems: 'center',
                  mr: 2,
                  py: 0.5,
                  px: 2,
                  borderRadius: '30px',
                  backgroundColor: 'rgba(98, 0, 234, 0.05)',
                }}
              >
                <Typography variant="body2" sx={{ color: theme.palette.primary.main, fontWeight: 500 }}>
                  {user.name || user.email || 'User'}
                </Typography>
              </Box>
              
              <IconButton
                onClick={handleClick}
                sx={{ 
                  p: 0.5,
                  border: '2px solid transparent',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    border: `2px solid ${theme.palette.primary.main}`,
                  }
                }}
                aria-controls={open ? 'user-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
              >
                <Avatar 
                  sx={{ 
                    width: 36, 
                    height: 36,
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                    bgcolor: theme.palette.primary.main
                  }}
                >
                  {getUserInitials()}
                </Avatar>
              </IconButton>
              
              <Menu
                id="user-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'user-button',
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                  elevation: 2,
                  sx: {
                    mt: 1.5,
                    borderRadius: '12px',
                    minWidth: 180,
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
              >
                <MenuItem 
                  onClick={() => {
                    navigate('/client-dashboard');
                    handleClose();
                  }}
                  sx={{ 
                    borderRadius: '8px', 
                    mx: 1, 
                    my: 0.5,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(98, 0, 234, 0.08)',
                    }
                  }}
                >
                  My Dashboard
                </MenuItem>
                
                {/* Admin Panel Link */}
                {user.role === 'admin' && (
                  <MenuItem 
                    onClick={() => {
                      navigate('/admin');
                      handleClose();
                    }}
                    sx={{ 
                      borderRadius: '8px', 
                      mx: 1, 
                      my: 0.5,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(98, 0, 234, 0.08)',
                      }
                    }}
                  >
                    Admin Panel
                  </MenuItem>
                )}
                
                {/* Developer Portal Link */}
                {(user.role === 'developer' || user.role === 'admin') && (
                  <MenuItem 
                    onClick={() => {
                      navigate('/developer-portal');
                      handleClose();
                    }}
                    sx={{ 
                      borderRadius: '8px', 
                      mx: 1, 
                      my: 0.5,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(98, 0, 234, 0.08)',
                      }
                    }}
                  >
                    Developer Portal
                  </MenuItem>
                )}
                
                <MenuItem 
                  onClick={handleSignOut}
                  sx={{ 
                    borderRadius: '8px', 
                    mx: 1, 
                    my: 0.5,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(98, 0, 234, 0.08)',
                    }
                  }}
                >
                  Sign Out
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Tooltip title="Admin Access">
                <IconButton
                  color="primary"
                  sx={{ 
                    p: 1,
                    borderRadius: '50%',
                    bgcolor: 'rgba(98, 0, 234, 0.08)',
                  }}
                  onClick={() => navigate('/admin-access')}
                >
                  <AdminPanelSettingsIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Developer Portal">
                <IconButton
                  color="primary"
                  sx={{ 
                    p: 1,
                    borderRadius: '50%',
                    bgcolor: 'rgba(98, 0, 234, 0.08)',
                  }}
                  onClick={() => navigate('/developer-login')}
                >
                  <BuildIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              
              <IconButton
                color="primary"
                sx={{ ml: 1 }}
                onClick={() => navigate('/login')}
              >
                <Typography variant="button" sx={{ fontWeight: 'medium' }}>
                  Login
                </Typography>
              </IconButton>
              <IconButton
                color="primary"
                sx={{ 
                  ml: 1,
                  bgcolor: 'rgba(98, 0, 234, 0.08)',
                  '&:hover': {
                    bgcolor: 'rgba(98, 0, 234, 0.15)',
                  }
                }}
                onClick={() => navigate('/register')}
              >
                <Typography variant="button" sx={{ fontWeight: 'medium' }}>
                  Register
                </Typography>
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header; 