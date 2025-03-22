import React, { useEffect } from 'react';
import { Box, Container, Typography, Button, Stack, useTheme, useMediaQuery, Grid, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import SpeedIcon from '@mui/icons-material/Speed';
import LockIcon from '@mui/icons-material/Lock';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import CodeIcon from '@mui/icons-material/Code';
import DevicesIcon from '@mui/icons-material/Devices';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
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

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <Box sx={{ 
      overflowX: 'hidden',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e8edf2 100%)'
    }}>
      {/* Hero Section */}
      <Box 
        className="hero-section"
        sx={{
          pt: { xs: 10, md: 14 },
          pb: { xs: 10, md: 16 },
          position: 'relative'
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
                  className="title-highlight"
                  sx={{ 
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    fontWeight: 700,
                    lineHeight: 1.2,
                    mb: 3
                  }}
                >
                  Transform Your <span className="gradient-text">Business Requirements</span> Into Reality
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
                  Generate intelligent wireframes, information architecture, and 
                  technical specifications automatically from your business requirements.
                </Typography>
                
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={2}
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
                      backgroundColor: theme.palette.primary.main,
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark
                      }
                    }}
                    component={Link}
                    to="/register"
                    endIcon={<KeyboardArrowRightIcon />}
                  >
                    Get Started Free
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
                      fontSize: '1rem'
                    }}
                    component={Link}
                    to="/login"
                  >
                    Sign In
                  </Button>
                </Stack>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <Box 
                  component="img"
                  src="/dashboard-preview.png" 
                  alt="Dashboard Preview"
                  sx={{
                    width: '100%',
                    borderRadius: 3,
                    boxShadow: '0 20px 80px rgba(0,0,0,0.12)',
                  }}
                  className="pulse-animation"
                />
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Features Section */}
      <Box 
        sx={{ 
          py: { xs: 8, md: 12 },
          background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)'
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeIn}
          >
            <Typography 
              variant="h2" 
              align="center" 
              sx={{ 
                mb: 2,
                fontWeight: 700
              }}
            >
              Key Features
            </Typography>
            
            <Typography 
              variant="h5" 
              align="center" 
              color="text.secondary" 
              sx={{ mb: 8 }}
            >
              Everything you need to bring your project ideas to life
            </Typography>
          </motion.div>
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            <Grid container spacing={4}>
              {[
                {
                  icon: <AutoGraphIcon fontSize="large" sx={{ color: theme.palette.primary.main }} />,
                  title: "AI-Powered Analysis",
                  description: "Our advanced AI analyzes your business requirements to create detailed project specifications."
                },
                {
                  icon: <DevicesIcon fontSize="large" sx={{ color: theme.palette.secondary.main }} />,
                  title: "Interactive Wireframes",
                  description: "Generate interactive wireframes and mockups directly from your requirements."
                },
                {
                  icon: <CodeIcon fontSize="large" sx={{ color: theme.palette.info.main }} />,
                  title: "Developer-Ready Specs",
                  description: "Create technical specifications that developers can immediately implement."
                },
                {
                  icon: <SpeedIcon fontSize="large" sx={{ color: theme.palette.warning.main }} />,
                  title: "Accelerated Development",
                  description: "Reduce development time by up to 60% with clear, AI-generated specifications."
                },
                {
                  icon: <LockIcon fontSize="large" sx={{ color: theme.palette.error.main }} />,
                  title: "Secure Collaboration",
                  description: "Share your project securely with team members and stakeholders."
                },
                {
                  icon: <EmojiObjectsIcon fontSize="large" sx={{ color: theme.palette.success.main }} />,
                  title: "Smart Suggestions",
                  description: "Get intelligent suggestions to improve your business requirements."
                }
              ].map((feature, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <motion.div variants={fadeIn}>
                    <Paper 
                      elevation={0}
                      className="feature-card hover-3d"
                      sx={{ 
                        p: 4, 
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 3,
                        backgroundColor: '#ffffff'
                      }}
                    >
                      <Box sx={{ mb: 2 }}>
                        {feature.icon}
                      </Box>
                      <Typography variant="h5" component="h3" sx={{ mb: 2, fontWeight: 600 }}>
                        {feature.title}
                      </Typography>
                      <Typography color="text.secondary" sx={{ flex: 1 }}>
                        {feature.description}
                      </Typography>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>
      
      {/* CTA Section */}
      <Box 
        sx={{ 
          py: { xs: 8, md: 12 },
          textAlign: 'center',
          background: 'linear-gradient(135deg, #6200EA 0%, #B388FF 100%)',
          color: 'white'
        }}
      >
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Typography 
              variant="h2" 
              component="h2" 
              gutterBottom
              sx={{ 
                fontWeight: 700,
                mb: 3
              }}
            >
              Ready to Streamline Your Development Process?
            </Typography>
            
            <Typography 
              variant="h5" 
              component="div" 
              sx={{ 
                mb: 6,
                opacity: 0.9
              }}
            >
              Join thousands of businesses that have accelerated their development with our platform.
            </Typography>
            
            <Button 
              variant="contained" 
              size="large"
              sx={{ 
                py: 1.5,
                px: 4,
                fontWeight: 600,
                borderRadius: 2,
                fontSize: '1.1rem',
                backgroundColor: 'white',
                color: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.9)'
                }
              }}
              component={Link}
              to="/register"
              endIcon={<KeyboardArrowRightIcon />}
            >
              Start Your Free Trial
            </Button>
          </motion.div>
        </Container>
      </Box>
      
      {/* Footer */}
      <Box 
        component="footer"
        sx={{ 
          py: 6,
          backgroundColor: '#1a1a2e',
          color: 'rgba(255,255,255,0.7)'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" color="white" sx={{ mb: 2 }}>
                Stello Pipe
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Transforming business requirements into development-ready specifications with AI.
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="h6" color="white" sx={{ mb: 2 }}>
                Quick Links
              </Typography>
              <Stack spacing={1}>
                {['Home', 'Features', 'Pricing', 'Contact'].map((link) => (
                  <Link 
                    key={link} 
                    to="#" 
                    className="animated-underline"
                    style={{ 
                      color: 'inherit', 
                      textDecoration: 'none',
                      display: 'inline-block',
                      marginBottom: '0.5rem'
                    }}
                  >
                    {link}
                  </Link>
                ))}
              </Stack>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="h6" color="white" sx={{ mb: 2 }}>
                Connect With Us
              </Typography>
              <Typography variant="body2">
                Email: support@stellopipe.com
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Phone: +1 (555) 123-4567
              </Typography>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 6, pt: 3, borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
            <Typography variant="body2">
              © {new Date().getFullYear()} Stello Pipe. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage; 