import React, { useEffect, useRef, useState } from 'react';
import { Box, Container, Typography, Button, Stack, useTheme, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import SpeedIcon from '@mui/icons-material/Speed';
import LockIcon from '@mui/icons-material/Lock';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import './LandingPage.css';
import * as THREE from 'three';

const LandingPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const threeContainerRef = useRef<HTMLDivElement>(null);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // Redirect to client dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/client-dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!threeContainerRef.current) return;

    // Set up Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    const containerWidth = threeContainerRef.current.clientWidth;
    const containerHeight = threeContainerRef.current.clientHeight;
    
    renderer.setSize(containerWidth, containerHeight);
    renderer.setClearColor(0xffffff, 0);
    threeContainerRef.current.appendChild(renderer.domElement);

    // Create a group to hold all stars
    const starsGroup = new THREE.Group();
    scene.add(starsGroup);
    
    // Star particle materials
    const starMaterial = new THREE.PointsMaterial({
      color: 0x6200EA,
      size: 0.5,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      depthWrite: false
    });

    const brightStarMaterial = new THREE.PointsMaterial({
      color: 0xB388FF,
      size: 0.7,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      depthWrite: false
    });

    const glowingStarMaterial = new THREE.PointsMaterial({
      color: 0xFFFFFFF,
      size: 1,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      depthWrite: false
    });

    // Create multiple star fields with different properties
    const createStarField = (count: number, radius: number, material: THREE.PointsMaterial) => {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      const velocities = new Float32Array(count);
      const sizes = new Float32Array(count);
      
      for (let i = 0; i < count; i++) {
        // Create positions in a sphere
        const distance = Math.random() * radius;
        const phi = Math.acos(-1 + Math.random() * 2);
        const theta = Math.random() * Math.PI * 2;
        
        positions[i * 3] = distance * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = distance * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = distance * Math.cos(phi);
        
        // Random velocities for twinkling
        velocities[i] = Math.random() * 0.02;
        
        // Random sizes for visual variety
        sizes[i] = Math.random() * 1.5;
      }
      
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 1));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
      
      const particles = new THREE.Points(geometry, material);
      return { particles, geometry };
    };
    
    // Create different star layers
    const { particles: smallStars, geometry: smallStarGeometry } = createStarField(800, 50, starMaterial);
    const { particles: mediumStars, geometry: mediumStarGeometry } = createStarField(200, 40, brightStarMaterial);
    const { particles: brightStars, geometry: brightStarGeometry } = createStarField(50, 30, glowingStarMaterial);
    
    starsGroup.add(smallStars);
    starsGroup.add(mediumStars);
    starsGroup.add(brightStars);
    
    // Create a few larger stars with custom geometry (star shape)
    const createStarShape = (size: number, color: number, x: number, y: number, z: number) => {
      // Create star geometry
      const starGeometry = new THREE.BufferGeometry();
      const vertices = [];
      
      // Inner and outer points of the star
      const innerRadius = size * 0.4;
      const outerRadius = size;
      const numPoints = 5;
      
      for (let i = 0; i < numPoints * 2; i++) {
        const angle = (Math.PI / numPoints) * i;
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        
        vertices.push(
          radius * Math.sin(angle),
          radius * Math.cos(angle),
          0
        );
      }
      
      // Add center point to close the star
      vertices.push(0, 0, 0);
      
      starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      
      // Create faces - triangles from the center to each adjacent pair of points
      const indices = [];
      const centerIndex = numPoints * 2;
      
      for (let i = 0; i < numPoints * 2; i++) {
        const nextIndex = (i + 1) % (numPoints * 2);
        indices.push(centerIndex, i, nextIndex);
      }
      
      starGeometry.setIndex(indices);
      starGeometry.computeVertexNormals();
      
      // Create star mesh
      const starMaterial = new THREE.MeshPhongMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.5,
        side: THREE.DoubleSide,
        shininess: 100,
        transparent: true,
        opacity: 0.9
      });
      
      const star = new THREE.Mesh(starGeometry, starMaterial);
      star.position.set(x, y, z);
      
      return { star, geometry: starGeometry };
    };
    
    // Add a few prominent stars
    const starPositions = [
      { x: 15, y: 10, z: -20, size: 1.5, color: 0xB388FF },
      { x: -10, y: -8, z: -15, size: 2, color: 0x6200EA },
      { x: 5, y: -12, z: -10, size: 1, color: 0x7C4DFF },
      { x: -15, y: 15, z: -25, size: 2.5, color: 0x3700B3 },
      { x: 20, y: -5, z: -30, size: 1.8, color: 0xD1C4E9 }
    ];
    
    const customStars = starPositions.map(pos => {
      const { star, geometry } = createStarShape(pos.size, pos.color, pos.x, pos.y, pos.z);
      starsGroup.add(star);
      return { star, geometry };
    });
    
    // Position the entire star field
    starsGroup.position.set(10, 0, -30);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);
    
    const light1 = new THREE.PointLight(0x6200EA, 2, 100);
    light1.position.set(10, 10, 10);
    scene.add(light1);
    
    const light2 = new THREE.PointLight(0xB388FF, 1.5, 100);
    light2.position.set(-10, -10, 10);
    scene.add(light2);
    
    // Position camera
    camera.position.z = 5;
    
    // Animation loop
    let frame = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      frame += 0.01;
      
      // Rotate the entire star field slowly
      starsGroup.rotation.y += 0.001;
      starsGroup.rotation.x = Math.sin(frame * 0.2) * 0.05;
      
      // Animate individual star types differently
      if (isHovering) {
        // Interactive mode when mouse is hovering
        const offsetX = mousePosition.x * 0.2;
        const offsetY = mousePosition.y * 0.2;
        
        starsGroup.rotation.y += offsetX * 0.002;
        starsGroup.rotation.x += offsetY * 0.002;
        
        // Make stars twinkle faster and more dramatically
        const smallStarPositions = smallStarGeometry.attributes.position.array;
        const smallStarVelocities = smallStarGeometry.attributes.velocity.array;
        const smallStarSizes = smallStarGeometry.attributes.size.array;
        
        for (let i = 0; i < smallStarPositions.length / 3; i++) {
          const velocity = smallStarVelocities[i];
          
          // Create pulsating effect
          const scale = Math.sin(frame * velocity * 10) * 0.3 + 1;
          smallStarSizes[i] = Math.max(0.1, Math.random() * 1.5 * scale);
          
          // Add slight movement in the direction of the mouse
          smallStarPositions[i * 3] += offsetX * velocity * 0.05;
          smallStarPositions[i * 3 + 1] += offsetY * velocity * 0.05;
          
          // Reset if they move too far
          if (Math.abs(smallStarPositions[i * 3]) > 60) {
            smallStarPositions[i * 3] *= -0.8;
          }
          if (Math.abs(smallStarPositions[i * 3 + 1]) > 60) {
            smallStarPositions[i * 3 + 1] *= -0.8;
          }
        }
        
        // Update custom stars
        customStars.forEach(({ star }, i) => {
          star.rotation.z += 0.01 + (i % 3) * 0.01;
          
          // Pulse with mouse movement
          const pulseScale = 1 + Math.sin(frame * 3 + i) * 0.1;
          star.scale.set(pulseScale, pulseScale, pulseScale);
          
          // Apply slight movement toward mouse
          star.position.x += offsetX * 0.01;
          star.position.y += offsetY * 0.01;
          
          // Limit movement
          if (Math.abs(star.position.x) > 30) star.position.x *= 0.95;
          if (Math.abs(star.position.y) > 30) star.position.y *= 0.95;
        });
        
        smallStarGeometry.attributes.position.needsUpdate = true;
        smallStarGeometry.attributes.size.needsUpdate = true;
      } else {
        // Gentle animation when not interacting
        // Twinkle effect for small stars
        const smallStarSizes = smallStarGeometry.attributes.size.array;
        const mediumStarSizes = mediumStarGeometry.attributes.size.array;
        const brightStarSizes = brightStarGeometry.attributes.size.array;
        
        for (let i = 0; i < smallStarSizes.length; i++) {
          // Gentle twinkling
          smallStarSizes[i] = Math.max(0.1, Math.random() * 1.5);
        }
        
        for (let i = 0; i < mediumStarSizes.length; i++) {
          // Medium stars twinkle slower
          if (Math.random() > 0.95) {
            mediumStarSizes[i] = Math.max(0.2, Math.random() * 1.8);
          }
        }
        
        for (let i = 0; i < brightStarSizes.length; i++) {
          // Bright stars twinkle with a pattern
          brightStarSizes[i] = 1 + Math.sin(frame * 2 + i) * 0.5;
        }
        
        // Rotate custom stars gently
        customStars.forEach(({ star }, i) => {
          star.rotation.z += 0.005 + (i % 3) * 0.005;
          
          // Gentle pulsing
          const pulseScale = 1 + Math.sin(frame + i) * 0.05;
          star.scale.set(pulseScale, pulseScale, pulseScale);
        });
        
        smallStarGeometry.attributes.size.needsUpdate = true;
        mediumStarGeometry.attributes.size.needsUpdate = true;
        brightStarGeometry.attributes.size.needsUpdate = true;
      }
      
      // Occasionally create a shooting star effect
      if (Math.random() > 0.995) {
        createShootingStar();
      }
      
      renderer.render(scene, camera);
    };
    
    // Function to create shooting stars
    const createShootingStar = () => {
      // Create a line geometry for the shooting star
      const points = [];
      
      // Random starting position in the visible part of the scene
      const startX = (Math.random() - 0.5) * 60;
      const startY = (Math.random() - 0.5) * 60;
      const startZ = -30 - Math.random() * 20;
      
      // Direction vector - always moving downward and to the right
      const dirX = 3 + Math.random() * 5;
      const dirY = -3 - Math.random() * 5;
      
      // Create the trail
      const trailLength = 10 + Math.random() * 10;
      for (let i = 0; i < trailLength; i++) {
        points.push(
          new THREE.Vector3(
            startX - dirX * i * 0.5,
            startY - dirY * i * 0.5,
            startZ
          )
        );
      }
      
      const shootingStarGeometry = new THREE.BufferGeometry().setFromPoints(points);
      
      // Create a gradient material with a bright head and fading tail
      const shootingStarMaterial = new THREE.LineBasicMaterial({
        color: 0xB388FF,
        opacity: 0.8,
        transparent: true,
        linewidth: 2
      });
      
      const shootingStar = new THREE.Line(shootingStarGeometry, shootingStarMaterial);
      scene.add(shootingStar);
      
      // Animate the shooting star
      const animateShootingStar = () => {
        // Move the shooting star
        shootingStar.position.x += dirX * 0.2;
        shootingStar.position.y += dirY * 0.2;
        
        // Fade out
        shootingStarMaterial.opacity -= 0.02;
        
        // Remove when it's no longer visible
        if (shootingStarMaterial.opacity <= 0) {
          scene.remove(shootingStar);
          shootingStarGeometry.dispose();
          shootingStarMaterial.dispose();
          return;
        }
        
        requestAnimationFrame(animateShootingStar);
      };
      
      animateShootingStar();
    };
    
    animate();
    
    // Event listeners for interactivity
    const handleMouseMove = (event: MouseEvent) => {
      if (!threeContainerRef.current) return;
      
      const rect = threeContainerRef.current.getBoundingClientRect();
      // Normalize mouse coordinates to be between -1 and 1
      setMousePosition({
        x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
        y: -((event.clientY - rect.top) / rect.height) * 2 + 1
      });
    };
    
    const handleMouseEnter = () => {
      setIsHovering(true);
    };
    
    const handleMouseLeave = () => {
      setIsHovering(false);
    };
    
    // Handle window resize
    const handleResize = () => {
      if (!threeContainerRef.current) return;
      
      const containerWidth = threeContainerRef.current.clientWidth;
      const containerHeight = threeContainerRef.current.clientHeight;
      
      camera.aspect = containerWidth / containerHeight;
      camera.updateProjectionMatrix();
      
      renderer.setSize(containerWidth, containerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    threeContainerRef.current.addEventListener('mousemove', handleMouseMove);
    threeContainerRef.current.addEventListener('mouseenter', handleMouseEnter);
    threeContainerRef.current.addEventListener('mouseleave', handleMouseLeave);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (threeContainerRef.current) {
        threeContainerRef.current.removeEventListener('mousemove', handleMouseMove);
        threeContainerRef.current.removeEventListener('mouseenter', handleMouseEnter);
        threeContainerRef.current.removeEventListener('mouseleave', handleMouseLeave);
        threeContainerRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose all geometries and materials
      scene.remove(starsGroup);
      
      smallStarGeometry.dispose();
      mediumStarGeometry.dispose();
      brightStarGeometry.dispose();
      
      starMaterial.dispose();
      brightStarMaterial.dispose();
      glowingStarMaterial.dispose();
      
      customStars.forEach(({ geometry }) => {
        geometry.dispose();
      });
      
      renderer.dispose();
    };
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
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
      bgcolor: 'background.default', 
      color: 'text.primary',
      overflow: 'hidden',
      minHeight: '100vh',
      position: 'relative'
    }}>
      {/* White Hero Section with Star Animation */}
      <Box 
        sx={{ 
          background: 'white',
          pt: { xs: 10, md: 0 },
          pb: { xs: 12, md: 0 },
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
        className="hero-section"
      >
        {/* Star Animation Container (absolutely positioned on the right side) */}
            <Box
          ref={threeContainerRef}
              sx={{
                          position: 'absolute',
            width: { xs: '100%', md: '50%' },
            height: '100%',
                          top: 0,
                          right: 0,
                        zIndex: 1,
            cursor: 'grab',
            background: 'linear-gradient(to right, transparent, rgba(248, 250, 252, 0.5))'
                      }}
          className={isHovering ? 'grabbing' : ''}
                    />
                    
        {/* Gradient Overlay */}
                    <Box 
                      sx={{
                        position: 'absolute',
            width: '100%',
            height: '100%',
                      top: 0,
                      left: 0,
            background: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0) 0%, rgba(255,255,255,0.7) 60%, rgba(255,255,255,1) 100%)',
            zIndex: 2
          }}
        />

        <Container 
          maxWidth="lg" 
              sx={{ 
                  position: 'relative',
            zIndex: 3,
            py: { xs: 4, md: 0 }
          }}
        >
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={{ xs: 6, md: 4 }}
            alignItems="center"
            justifyContent="space-between"
            sx={{ minHeight: '85vh' }}
          >
                  <Box 
                    sx={{ 
                width: { xs: '100%', md: '55%' },
                pr: { md: 4 }
              }}
            >
            <motion.div
              initial="hidden"
                animate="visible"
              variants={fadeIn}
              >
                    <Typography 
                  variant="h1"
                  className="stello-text"
                      sx={{ 
                    fontWeight: 800,
                    fontSize: { xs: '3.5rem', sm: '4rem', md: '5rem', lg: '6rem' },
                    lineHeight: 1.1,
                    mb: 2,
                    letterSpacing: '-0.02em'
                  }}
                >
                  Stello
                    </Typography>
            </motion.div>

                <motion.div
                  initial="hidden"
                animate="visible"
                  variants={fadeIn}
                transition={{ delay: 0.2 }}
              >
                <Typography 
                  variant="h6"
                  sx={{ 
                  color: 'text.secondary',
                    mb: 4,
                    fontSize: { xs: '1rem', md: '1.1rem' },
                    maxWidth: '90%',
                    lineHeight: 1.6
                  }}
                >
                  Transform your ideas into digital reality with our cutting-edge platform. Build, deploy, and scale your applications with ease.
              </Typography>
          </motion.div>

              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2}
                  sx={{ mb: 6 }}
                >
                  <motion.div variants={fadeIn}>
              <Button 
                      component={Link}
                      to="/register"
                variant="contained" 
                size="large"
                      endIcon={<KeyboardArrowRightIcon />}
                sx={{ 
                  py: 1.5,
                        px: 3,
                  fontSize: '1rem',
                        background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                        boxShadow: '0 10px 20px rgba(98, 0, 234, 0.2)',
                        width: { xs: '100%', sm: 'auto' }
                      }}
                      className="hover-3d"
                    >
                      Get Started
              </Button>
          </motion.div>

            <motion.div variants={fadeIn}>
                    <Button
                      component={Link}
                      to="/developer-login"
                      variant="outlined"
                      size="large"
                sx={{ 
                        py: 1.5,
                  px: 3,
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
                    >
                      Developer Portal
                    </Button>
            </motion.div>
                </Stack>
          </motion.div>

                  <motion.div
                    initial="hidden"
                animate="visible"
                    variants={fadeIn}
                transition={{ delay: 0.5 }}
              >
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
                      
                <Stack direction="row" spacing={3} sx={{ mt: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    Already have an account?{' '}
                    <Link to="/login" style={{ 
                            color: theme.palette.primary.main,
                      textDecoration: 'none',
                      fontWeight: 600
                    }}>
                      Sign In
                    </Link>
                </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <Link to="/admin-access" style={{ 
                    color: theme.palette.primary.main,
                      textDecoration: 'none',
                      fontWeight: 600
                    }}>
                      Admin Access
                    </Link>
                  </Typography>
                </Stack>
          </motion.div>
      </Box>

            {/* Empty space for star animation on small screens */}
            {isSmallScreen && (
              <Box sx={{ height: 200 }} />
            )}
              </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage; 