import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Paper, Stepper, Step, StepLabel, TextField, Button, Alert, CircularProgress, Divider, List, ListItem, ListItemText, styled, StepIconProps, Chip, Card, CardContent, Grid } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useAuth } from '../context/AuthContext';
import Header from './Header';
import { getApiUrl } from '../config/api';
import WebIcon from '@mui/icons-material/Web';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

// Define interfaces for props and data
type ClientDashboardProps = Record<string, never>;

interface ProjectData {
  projectId: string;
  name: string;
  email: string;
  phone: string;
  projectStatus: string;
  assignedDeveloper: string;
  createdAt: string;
  statusUpdates: {
    status: string;
    message: string;
    timestamp: string;
    updatedBy: string;
  }[];
  template: {
    name: string;
    imageUrl: string;
  };
  businessRequirements: {
    businessGoals: string;
    targetAudience: string;
    keyFeatures: string;
  };
}

// Define status steps and labels
const statusSteps = ['pending', 'acknowledged', 'approved', 'in_progress', 'assets_added', 'consultation', 'delivered'];

const statusLabels: Record<string, string> = {
  pending: 'Pending Review',
  acknowledged: 'Acknowledged',
  approved: 'Approved',
  in_progress: 'In Progress',
  assets_added: 'Assets Added',
  consultation: 'Consultation',
  delivered: 'Delivered'
};

// Custom step icon
const ColorlibStepIconRoot = styled('div')<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...(ownerState.active && {
    backgroundImage: 'linear-gradient(135deg, #6200EA 0%, #B388FF 100%)',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  }),
  ...(ownerState.completed && {
    backgroundImage: 'linear-gradient(135deg, #6200EA 0%, #B388FF 100%)',
  }),
}));

function ColorlibStepIcon(props: StepIconProps) {
  const { active, completed, className, icon } = props;

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {completed ? <CheckIcon /> : active ? <AccessTimeIcon /> : icon}
    </ColorlibStepIconRoot>
  );
}

const ClientDashboard: React.FC<ClientDashboardProps> = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [projectId, setProjectId] = useState('');
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [userProjects, setUserProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showNewProjectButton, setShowNewProjectButton] = useState(false);

  const handleProjectIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProjectId(e.target.value);
  };

  const fetchProjectStatus = async (projectId: string) => {
    if (!projectId.trim()) {
      setError('Please enter a project ID');
      return;
    }

    setLoading(true);
    setError('');
    setProjectData(null);

    try {
      // Check if this is a temporary project ID
      if (projectId.startsWith('TEMP-')) {
        // For temporary project IDs, create a mock project data
        const tempProjectData: ProjectData = {
          projectId: projectId,
          name: 'Temporary Project',
          email: 'user@example.com',
          phone: '',
          projectStatus: 'pending',
          assignedDeveloper: 'Unassigned',
          createdAt: new Date().toISOString(),
          statusUpdates: [
            {
              status: 'pending',
              message: 'Your project has been created with a temporary ID. The server will process it soon.',
              timestamp: new Date().toISOString(),
              updatedBy: 'system'
            }
          ],
          template: {
            name: 'Selected Template',
            imageUrl: '/templates/default.jpg'
          },
          businessRequirements: {
            businessGoals: 'Your business goals will appear here once processed.',
            targetAudience: 'Your target audience will appear here once processed.',
            keyFeatures: 'Your key features will appear here once processed.'
          }
        };
        
        setProjectData(tempProjectData);
        
        // Store the project ID in session storage for convenience
        sessionStorage.setItem('lastProjectId', projectId.trim());
        localStorage.setItem('projectId', projectId.trim());
        
        return;
      }

      // For regular project IDs, fetch from the server
      const response = await fetch(getApiUrl(`project/${encodeURIComponent(projectId.trim())}`));
      
      // Check if the server is running
      if (!response.ok) {
        // Try to parse the response as JSON first
        let errorMessage = `Failed to fetch project status (Status: ${response.status})`;
        
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            errorMessage = errorData.error || errorData.message || errorMessage;
          } else {
            // If not JSON, it might be HTML (like when the server is down)
            errorMessage = 'Server error or not running. Please try again later.';
          }
        } catch (parseError) {
          console.error('Error parsing response:', parseError);
          errorMessage = 'Server error or not running. Please try again later.';
        }
        
        throw new Error(errorMessage);
      }
      
      const data = await response.json();

      if (!data.success || !data.project) {
        throw new Error(data.error || 'No project data returned from server');
      }

      console.log('Project data received:', data.project);
      
      // Format the project data to match our ProjectData interface
      const formattedProject: ProjectData = {
        projectId: data.project.projectId,
        name: data.project.name,
        email: data.project.email,
        phone: data.project.phone || '',
        projectStatus: data.project.projectStatus,
        assignedDeveloper: data.project.assignedDeveloper || 'Unassigned',
        createdAt: data.project.createdAt,
        statusUpdates: data.project.statusUpdates || [],
        template: {
          name: data.project.template?.name || 'Unknown Template',
          imageUrl: data.project.template?.imageUrl || '/templates/default.jpg'
        },
        businessRequirements: {
          businessGoals: data.project.brdAnswers?.businessGoals || 'Not specified',
          targetAudience: data.project.brdAnswers?.targetAudience || 'Not specified',
          keyFeatures: data.project.brdAnswers?.keyFeatures || 'Not specified'
        }
      };
      
      setProjectData(formattedProject);
      
      // Check if the project is delivered or completed
      if (formattedProject.projectStatus === 'delivered' || formattedProject.projectStatus === 'completed') {
        setShowNewProjectButton(true);
      } else {
        setShowNewProjectButton(false);
      }
      
      // Store the project ID in session storage for convenience
      sessionStorage.setItem('lastProjectId', projectId.trim());
      localStorage.setItem('projectId', projectId.trim());
    } catch (error) {
      console.error('Error fetching project status:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all projects for the current user
  const fetchUserProjects = async () => {
    if (!isAuthenticated || !user?._id) {
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(getApiUrl(`user/${user._id}/projects`));
      
      if (!response.ok) {
        console.error(`Failed to fetch user projects (Status: ${response.status})`);
        return;
      }
      
      const data = await response.json();
      
      if (data.success && data.projects && Array.isArray(data.projects)) {
        setUserProjects(data.projects);
        
        // If projects were found, show the most recent one
        if (data.projects.length > 0) {
          setProjectData(data.projects[0]);
          setProjectId(data.projects[0].projectId);
          
          // Update show new project button based on project status
          const mostRecentProject = data.projects[0];
          if (mostRecentProject.projectStatus === 'delivered' || mostRecentProject.projectStatus === 'completed') {
            setShowNewProjectButton(true);
          } else {
            setShowNewProjectButton(false);
          }
          
          // Store this project ID in local storage for convenience
          localStorage.setItem('projectId', data.projects[0].projectId);
          sessionStorage.setItem('lastProjectId', data.projects[0].projectId);
        } else {
          // No projects found, clear any existing project IDs and show the new project button
          localStorage.removeItem('projectId');
          sessionStorage.removeItem('lastProjectId');
          setProjectData(null);
          setProjectId('');
          setShowNewProjectButton(true);
        }
      }
    } catch (error) {
      console.error('Error fetching user projects:', error);
      // Show new project button on error as well
      setShowNewProjectButton(true);
      // Clear any existing project IDs on error
      localStorage.removeItem('projectId');
      sessionStorage.removeItem('lastProjectId');
      setProjectData(null);
      setProjectId('');
    } finally {
      setLoading(false);
    }
  };

  // Load project ID from localStorage or sessionStorage on component mount
  useEffect(() => {
    // Clear any existing project IDs from storage when component mounts
    // to ensure we're not showing projects from previous sessions
    if (isAuthenticated && user?._id) {
      // First, fetch the user's projects
      fetchUserProjects().then(() => {
        // Only look for saved project IDs if no projects were found from the API
        if (userProjects.length === 0) {
          const savedProjectId = localStorage.getItem('projectId') || sessionStorage.getItem('lastProjectId');
          if (savedProjectId) {
            setProjectId(savedProjectId);
            fetchProjectStatus(savedProjectId);
          } else {
            // No projects found and no saved project ID - show new project button
            setShowNewProjectButton(true);
          }
        }
      });
    } else {
      // Not authenticated, clear any existing project IDs
      localStorage.removeItem('projectId');
      sessionStorage.removeItem('lastProjectId');
      setProjectId('');
      setProjectData(null);
    }
  }, [isAuthenticated, user?._id]);

  const handleServerError = (projectId: string) => {
    // Create a fallback project data for server errors
    const fallbackProjectData: ProjectData = {
      projectId: projectId,
      name: 'Unavailable',
      email: 'Unavailable',
      phone: '',
      projectStatus: 'pending',
      assignedDeveloper: 'Unavailable',
      createdAt: new Date().toISOString(),
      statusUpdates: [
        {
          status: 'pending',
          message: 'Unable to connect to the server. Please try again later.',
          timestamp: new Date().toISOString(),
          updatedBy: 'system'
        }
      ],
      template: {
        name: 'Unavailable',
        imageUrl: '/templates/default.jpg'
      },
      businessRequirements: {
        businessGoals: 'Unavailable',
        targetAudience: 'Unavailable',
        keyFeatures: 'Unavailable'
      }
    };
    
    setProjectData(fallbackProjectData);
    setError('Unable to connect to the server. Please try again later.');
  };

  const startNewProject = () => {
    // Clear the existing project ID and all related data
    localStorage.removeItem('projectId');
    sessionStorage.removeItem('lastProjectId');
    sessionStorage.removeItem('userProjects');
    
    // Reset component state
    setProjectData(null);
    setProjectId('');
    setUserProjects([]);
    
    // Navigate to the app page to start the website creation pipeline
    navigate('/app');
  };

  const getActiveStep = () => {
    if (!projectData) return 0;
    const index = statusSteps.indexOf(projectData.projectStatus);
    return index === -1 ? 0 : index;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="App">
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Project Status Dashboard
            </Typography>
            {projectData && (
              <Chip 
                label={`Project ID: ${projectData.projectId}`}
                color="primary"
                sx={{ 
                  fontWeight: 'bold', 
                  fontSize: '0.9rem',
                  background: 'linear-gradient(135deg, #6200EA, #B388FF)',
                  color: 'white',
                  mb: 2
                }}
              />
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {showNewProjectButton && (
              <Button 
                variant="contained" 
                onClick={startNewProject}
                sx={{ 
                  borderRadius: '30px',
                  background: 'linear-gradient(135deg, #6200EA, #B388FF)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5000C9, #A270FF)',
                  }
                }}
              >
                Start New Project
              </Button>
            )}
            <Button 
              variant="outlined" 
              onClick={() => navigate('/')}
              sx={{ borderRadius: '30px' }}
            >
              Back to Home
            </Button>
          </Box>
        </Box>

        {/* Empty state with CTA when no projects exist */}
        {userProjects.length === 0 && !projectData && (
          <Paper 
            elevation={0} 
            sx={{ 
              p: 6, 
              borderRadius: 4,
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              mb: 4,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            className="fade-in"
          >
            <Box 
              sx={{ 
                width: 80, 
                height: 80, 
                borderRadius: '20px', 
                background: 'linear-gradient(135deg, #6200EA, #B388FF)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3,
                boxShadow: '0 10px 20px rgba(98, 0, 234, 0.3)',
              }}
            >
              <WebIcon sx={{ color: 'white', fontSize: '2.5rem' }} />
            </Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              Create Your First Website
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mb: 4 }}>
              You don't have any projects yet. Get started by creating your first website with our easy-to-use AI-powered platform.
            </Typography>
            <Button 
              variant="contained" 
              size="large"
              onClick={startNewProject}
              startIcon={<RocketLaunchIcon />}
              sx={{ 
                py: 1.5,
                px: 4,
                borderRadius: 2,
                fontWeight: 600,
                fontSize: '1.1rem',
                textTransform: 'none',
                boxShadow: '0 4px 14px rgba(98, 0, 234, 0.6)',
                background: 'linear-gradient(90deg, #6200EA, #B388FF)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 6px 20px rgba(98, 0, 234, 0.7)',
                  background: 'linear-gradient(90deg, #5000D6, #A370FF)',
                  transform: 'translateY(-3px)',
                }
              }}
            >
              Start Creating Now
            </Button>
          </Paper>
        )}

        {/* Display user's projects if available */}
        {userProjects.length > 0 && (
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              borderRadius: 4,
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              mb: 4
            }}
            className="fade-in"
          >
            <Typography variant="h6" gutterBottom>
              Your Projects
            </Typography>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              {userProjects.map((project) => (
                <Grid item xs={12} sm={6} md={4} key={project.projectId}>
                  <Card 
                    elevation={0}
                    sx={{ 
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      borderRadius: 2,
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)'
                      },
                      ...(projectData?.projectId === project.projectId && {
                        borderColor: 'primary.main',
                        boxShadow: '0 5px 15px rgba(98, 0, 234, 0.2)'
                      })
                    }}
                    onClick={() => fetchProjectStatus(project.projectId)}
                  >
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom noWrap>
                        {project.template.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        ID: {project.projectId}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Created: {formatDate(project.createdAt)}
                      </Typography>
                      <Chip 
                        label={statusLabels[project.projectStatus] || project.projectStatus}
                        size="small"
                        color={project.projectStatus === 'delivered' ? 'success' : 'primary'}
                        sx={{ mt: 1 }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        )}

        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            borderRadius: 4,
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            mb: 4
          }}
        >
          <Typography variant="h6" gutterBottom>
            Enter your Project ID to check status
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="Project ID"
              variant="outlined"
              value={projectId}
              onChange={handleProjectIdChange}
              placeholder="Enter your project ID"
              sx={{ maxWidth: 400 }}
            />
            <Button 
              variant="contained" 
              onClick={() => fetchProjectStatus(projectId)}
              disabled={loading}
              sx={{ 
                borderRadius: '30px',
                px: 3,
                background: 'linear-gradient(135deg, #6200EA, #B388FF)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5000C9, #A270FF)',
                }
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Check Status'}
            </Button>
          </Box>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Paper>

        {projectData && (
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
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                Project Information
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                <Box sx={{ minWidth: 200 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Project ID
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {projectData.projectId}
                  </Typography>
                </Box>
                <Box sx={{ minWidth: 200 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Client Name
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {projectData.name}
                  </Typography>
                </Box>
                <Box sx={{ minWidth: 200 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Template
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {projectData.template?.name || 'Custom Template'}
                  </Typography>
                </Box>
                <Box sx={{ minWidth: 200 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Created On
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {formatDate(projectData.createdAt)}
                  </Typography>
                </Box>
                <Box sx={{ minWidth: 200 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Assigned Developer
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {projectData.assignedDeveloper || 'Not assigned yet'}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Divider sx={{ my: 4 }} />

            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                Project Progress
              </Typography>
              <Box sx={{ mt: 4, mb: 6 }}>
                <Stepper activeStep={getActiveStep()} alternativeLabel>
                  {statusSteps.map((status) => (
                    <Step key={status}>
                      <StepLabel StepIconComponent={ColorlibStepIcon}>
                        {statusLabels[status]}
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>
            </Box>

            <Divider sx={{ my: 4 }} />

            <Box>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                Status Updates
              </Typography>
              <List>
                {projectData.statusUpdates && projectData.statusUpdates.length > 0 ? (
                  projectData.statusUpdates.map((update, index) => (
                    <ListItem 
                      key={index} 
                      sx={{ 
                        mb: 2, 
                        p: 2, 
                        borderRadius: 2, 
                        bgcolor: 'rgba(0, 0, 0, 0.02)',
                        border: '1px solid rgba(0, 0, 0, 0.05)'
                      }}
                    >
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              {statusLabels[update.status] || update.status}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatDate(update.timestamp)}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body2">{update.message}</Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                              Updated by: {update.updatedBy}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No status updates available yet.
                  </Typography>
                )}
              </List>
            </Box>
          </Paper>
        )}
      </Container>
    </div>
  );
};

export default ClientDashboard; 