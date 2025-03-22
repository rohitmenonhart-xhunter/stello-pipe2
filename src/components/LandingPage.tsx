import React, { useEffect } from 'react';
import { Box, Container, Typography, Button, Stack, useTheme, useMediaQuery, Grid, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import SpeedIcon from '@mui/icons-material/Speed';
import LockIcon from '@mui/icons-material/Lock';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import './LandingPage.css';

const LandingPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  // Redirect to client dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/client-dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Fade-in animation variants for elements
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <Box sx={{ 
      overflowX: 'hidden',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e8edf2 100%)'
    }}>
      {/* Hero Section */}
      <Box 
        className="hero-section"
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          pt: { xs: 10, md: 0 },
          pb: { xs: 10, md: 0 },
          position: 'relative',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeIn}
              >
                <Typography 
                  variant="h1" 
                  component="h1" 
                  gutterBottom
                  className="stello-text"
                  sx={{ 
                    fontSize: { xs: '3.5rem', sm: '4rem', md: '5rem', lg: '6rem' },
                    fontWeight: 800,
                    lineHeight: 1.1,
                    mb: 2,
                    letterSpacing: '-0.02em'
                  }}
                >
                  Stello
                </Typography>
                
                <Typography 
                  variant="h5" 
                  component="div" 
                  sx={{ 
                    mb: 4,
                    color: 'text.secondary',
                    lineHeight: 1.6
                  }}
                >
                  Transform your business requirements into digital reality with our cutting-edge platform. 
                  Build, deploy, and scale your applications with ease.
                </Typography>
                
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={2}
                  sx={{ mb: 4 }}
                >
                  <Button 
                    variant="contained" 
                    size="large"
                    className="hover-scale btn-hover-effect"
                    sx={{ 
                      py: 1.5,
                      px: 4,
                      fontWeight: 600,
                      borderRadius: 2,
                      fontSize: '1rem',
                      background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                      boxShadow: '0 10px 20px rgba(98, 0, 234, 0.2)',
                      width: { xs: '100%', sm: 'auto' }
                    }}
                    component={Link}
                    to="/register"
                    endIcon={<KeyboardArrowRightIcon />}
                  >
                    Get Started
                  </Button>
                  
                  <Button 
                    variant="outlined" 
                    size="large"
                    className="hover-scale"
                    sx={{ 
                      py: 1.5,
                      px: 4,
                      fontWeight: 600,
                      borderRadius: 2,
                      fontSize: '1rem',
                      borderWidth: 2,
                      color: theme.palette.primary.main,
                      borderColor: theme.palette.primary.main,
                      '&:hover': {
                        borderWidth: 2,
                        borderColor: theme.palette.primary.dark,
                        background: 'rgba(98, 0, 234, 0.05)'
                      },
                      width: { xs: '100%', sm: 'auto' }
                    }}
                    component={Link}
                    to="/login"
                  >
                    Sign In
                  </Button>
                </Stack>
                
                <Stack 
                  direction="row" 
                  spacing={3}
                  sx={{ 
                    flexWrap: 'wrap', 
                    mt: 2,
                    '& > *': {
                      display: 'flex',
                      alignItems: 'center',
                      color: 'text.secondary',
                      fontSize: '0.9rem',
                      mr: 2,
                      mb: 2
                    }
                  }}
                >
                  <Box>
                    <SpeedIcon sx={{ fontSize: 20, mr: 0.7, color: 'primary.main' }} />
                    Lightning Fast
                  </Box>
                  <Box>
                    <LockIcon sx={{ fontSize: 20, mr: 0.7, color: 'primary.main' }} />
                    Enterprise Security
                  </Box>
                  <Box>
                    <AutoGraphIcon sx={{ fontSize: 20, mr: 0.7, color: 'primary.main' }} />
                    Advanced Analytics
                  </Box>
                </Stack>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="dashboard-preview-container"
              >
                <div className="dashboard-preview">
                  {/* Dashboard Header */}
                  <div className="dashboard-header">
                    <div className="dashboard-logo"></div>
                    <div className="dashboard-nav">
                      <div className="nav-item"></div>
                      <div className="nav-item"></div>
                      <div className="nav-item"></div>
                    </div>
                    <div className="dashboard-profile"></div>
                  </div>
                  
                  {/* Dashboard Content */}
                  <div className="dashboard-content">
                    <div className="dashboard-sidebar">
                      <div className="sidebar-item active"></div>
                      <div className="sidebar-item"></div>
                      <div className="sidebar-item"></div>
                      <div className="sidebar-item"></div>
                      <div className="sidebar-item"></div>
                    </div>
                    
                    <div className="dashboard-main">
                      <div className="dashboard-title"></div>
                      
                      <div className="dashboard-stats">
                        <div className="stat-card"></div>
                        <div className="stat-card"></div>
                        <div className="stat-card"></div>
                      </div>
                      
                      <div className="dashboard-chart"></div>
                      
                      <div className="dashboard-table">
                        <div className="table-header">
                          <div className="table-cell"></div>
                          <div className="table-cell"></div>
                          <div className="table-cell"></div>
                        </div>
                        <div className="table-row">
                          <div className="table-cell"></div>
                          <div className="table-cell"></div>
                          <div className="table-cell"></div>
                        </div>
                        <div className="table-row">
                          <div className="table-cell"></div>
                          <div className="table-cell"></div>
                          <div className="table-cell"></div>
                        </div>
                        <div className="table-row">
                          <div className="table-cell"></div>
                          <div className="table-cell"></div>
                          <div className="table-cell"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage; 