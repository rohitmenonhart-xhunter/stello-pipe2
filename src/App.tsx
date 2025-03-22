import React, { useState, useEffect } from 'react';
import { Box, Stepper, Step, StepLabel, Button, Typography, Container, Alert, Snackbar, useTheme, alpha, Paper, StepConnector, stepConnectorClasses } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { BrdForm } from './components/BrdForm';
import { IaPages } from './components/IaPages';
import Templates from './components/Templates';
import UserInfoForm from './components/UserInfoForm';
import Header from './components/Header';
import { saveUserData, Template } from './services/userService';
import './App.css';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { getApiUrl } from './config/api';
import { useAuth } from './context/AuthContext';

// Define the types for our application
export type BrdAnswers = {
  businessGoals: string;
  targetAudience: string;
  keyFeatures: string;
  contentTypes: string;
  designPreferences: string;
  technicalRequirements: string;
  timeline: string;
  budget: string;
};

export interface BrdAnswer {
  question: string;
  answer: string;
}

// Define the steps for the application
const steps = ['Business Requirements', 'Information Architecture', 'Select Template', 'Your Information'];

// Define the custom connector for the stepper
const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: `linear-gradient(95deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.primary.dark} 100%)`,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: `linear-gradient(95deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.primary.dark} 100%)`,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderRadius: 1,
  },
}));

// Define the custom step icon
interface ColorlibStepIconProps {
  active?: boolean;
  completed?: boolean;
  className?: string;
  icon: React.ReactNode;
}

function ColorlibStepIcon(props: ColorlibStepIconProps) {
  const { active, completed, className, icon } = props;
  const theme = useTheme();

  const icons: { [index: string]: React.ReactElement } = {
    1: <span>1</span>,
    2: <span>2</span>,
    3: <span>3</span>,
    4: <span>4</span>,
  };

  return (
    <Box
      className={className}
      sx={{
        backgroundColor: completed
          ? theme.palette.primary.main
          : active
          ? alpha(theme.palette.primary.main, 0.8)
          : theme.palette.mode === 'dark'
          ? theme.palette.grey[700]
          : '#ccc',
        zIndex: 1,
        color: '#fff',
        width: 50,
        height: 50,
        display: 'flex',
        borderRadius: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
      }}
    >
      {completed ? <CheckCircleIcon /> : icons[icon?.toString() || '1']}
    </Box>
  );
}

function App() {
  const theme = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [activeStep, setActiveStep] = useState(0);
  const [brdAnswers, setBrdAnswers] = useState<BrdAnswers>({
    businessGoals: '',
    targetAudience: '',
    keyFeatures: '',
    contentTypes: '',
    designPreferences: '',
    technicalRequirements: '',
    timeline: '',
    budget: ''
  });
  
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [hasDeliveredProject, setHasDeliveredProject] = useState(false);
  const [deliveredProjectId, setDeliveredProjectId] = useState('');

  // New state for page notes
  const [pageNotes, setPageNotes] = useState<Record<string, string>>({});
  const [selectedPages, setSelectedPages] = useState<string[]>([]);

  // Check if the user has a delivered project
  useEffect(() => {
    const checkProjectStatus = async () => {
      if (user?._id) {
        try {
          const response = await fetch(getApiUrl(`user/${user._id}/delivered-projects`));
          if (response.ok) {
            const data = await response.json();
            if (data.projects && data.projects.length > 0) {
              setHasDeliveredProject(true);
              setDeliveredProjectId(data.projects[0].projectId);
            } else {
              // User has no delivered projects
              setHasDeliveredProject(false);
              setDeliveredProjectId('');
              
              // Check if user has any projects
              const projectsResponse = await fetch(getApiUrl(`user/${user._id}/projects`));
              if (projectsResponse.ok) {
                const projectsData = await projectsResponse.json();
                if (!projectsData.projects || projectsData.projects.length === 0) {
                  // User has no projects at all - clear any stored project IDs
                  localStorage.removeItem('projectId');
                  sessionStorage.removeItem('lastProjectId');
                }
              }
            }
          }
        } catch (error) {
          console.error("Error checking for delivered projects:", error);
        }
      }
    };
    
    checkProjectStatus();
  }, [user?._id]);

  useEffect(() => {
    // Extract selected pages from the keyFeatures field when BRD form is submitted
    if (brdAnswers.keyFeatures && brdAnswers.keyFeatures.includes('Selected Pages:')) {
      const pagesString = brdAnswers.keyFeatures.split('Selected Pages:')[1].trim();
      const pages = pagesString.split(',').map(page => page.trim());
      setSelectedPages(pages);
    }
  }, [brdAnswers.keyFeatures]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleBrdSubmit = (answers: BrdAnswers) => {
    setBrdAnswers(answers);
    setActiveStep(1);
  };

  const handleUpdatePageNotes = (notes: Record<string, string>) => {
    setPageNotes(notes);
  };

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setActiveStep(3);
  };

  const handleUserInfoSubmit = async (formData: { name: string; email: string; phone: string }) => {
    setUserData(formData);
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if selectedTemplate is null
      if (!selectedTemplate) {
        throw new Error('No template selected');
      }
      
      // Prepare verified fields data
      const verifiedFields = {
        email: user?.email ? true : false,
        phone: user?.phone ? true : false
      };
      
      // Call saveUserData with all required parameters
      const savedData = await saveUserData(
        formData,
        brdAnswers,
        selectedTemplate,
        user?._id,
        verifiedFields,
        pageNotes // Pass the page notes
      );
      
      setProjectId(savedData.projectId);
      // Store the project ID in both localStorage and sessionStorage for persistence
      localStorage.setItem('projectId', savedData.projectId);
      sessionStorage.setItem('lastProjectId', savedData.projectId);
      setSuccess(`Your information has been saved successfully! Your project ID is: ${savedData.projectId}`);
      setActiveStep(4);
    } catch (err) {
      console.error('Error:', err);
      setError('There was an error saving your information. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseNotification = () => {
    setError(null);
    setSuccess(null);
  };

  const navigateToClientDashboard = () => {
    // Save the current project ID to storage before navigating
    if (projectId) {
      localStorage.setItem('projectId', projectId);
      sessionStorage.setItem('lastProjectId', projectId);
    }
    navigate('/client-dashboard');
  };

  const navigateToDeveloperPortal = (developerName: string) => {
    // Save developer name to session storage
    sessionStorage.setItem('developerName', developerName);
    navigate('/developer-portal');
  };

  const startNewProject = () => {
    // Clear the existing project ID
    localStorage.removeItem('projectId');
    sessionStorage.removeItem('lastProjectId');
    
    // Reset the state
    setActiveStep(0);
    setBrdAnswers({
      businessGoals: '',
      targetAudience: '',
      keyFeatures: '',
      contentTypes: '',
      designPreferences: '',
      technicalRequirements: '',
      timeline: '',
      budget: '',
    });
    setSelectedTemplate(null);
    setHasDeliveredProject(false);
    setDeliveredProjectId('');
    
    // Show notification
    setSuccess('You can now start a new project!');
  };

  return (
    <Box className="App">
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        {hasDeliveredProject && (
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              mb: 4, 
              borderRadius: 2,
              border: `1px solid ${theme.palette.success.main}`,
              backgroundColor: alpha(theme.palette.success.main, 0.05)
            }}
          >
            <Typography variant="h6" gutterBottom>
              Your previous project ({deliveredProjectId}) has been delivered!
            </Typography>
            <Typography variant="body1" paragraph>
              You can check its status in the client dashboard or start a new project.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button 
                variant="outlined" 
                color="primary" 
                onClick={navigateToClientDashboard}
              >
                View Delivered Project
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={startNewProject}
              >
                Start New Project
              </Button>
            </Box>
          </Paper>
        )}
        
        <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel StepIconComponent={(props) => <ColorlibStepIcon {...props} icon={index + 1} />}>
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        
        <Box sx={{ mt: 4 }}>
          {activeStep === steps.length ? (
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" gutterBottom>
                Thank you for your submission!
              </Typography>
              <Typography variant="body1" paragraph>
                Your project has been created successfully. You can check the status of your project in the client dashboard.
              </Typography>
              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={navigateToClientDashboard}
                  sx={{ px: 4, py: 1.5 }}
                >
                  Go to Client Dashboard
                </Button>
                {user?.role === 'developer' && (
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    onClick={() => navigateToDeveloperPortal(user.name || 'Developer')}
                    sx={{ px: 4, py: 1.5 }}
                  >
                    Go to Developer Portal
                  </Button>
                )}
              </Box>
            </Box>
          ) : (
            <Box>
              {activeStep === 0 && (
                <Box className="form-container">
                  <BrdForm onSubmit={handleBrdSubmit} />
                </Box>
              )}
              
              {activeStep === 1 && (
                <Box sx={{ 
                  width: '100%',
                  borderRadius: '16px',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.06)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 12px 40px rgba(98, 0, 234, 0.12)',
                  },
                  mb: 8
                }}>
                  <IaPages 
                    selectedPages={selectedPages}
                    onNext={() => handleNext()}
                    onUpdateNotes={handleUpdatePageNotes}
                  />
                </Box>
              )}
              
              {activeStep === 2 && (
                <Box>
                  <Templates 
                    businessType={brdAnswers.keyFeatures.includes('Business Type:') 
                      ? brdAnswers.keyFeatures.split('Business Type:')[1].split(',')[0].trim() 
                      : 'corporate'} 
                    onSelectTemplate={handleTemplateSelect} 
                  />
                </Box>
              )}
              
              {activeStep === 3 && (
                <Box className="form-container">
                  <UserInfoForm 
                    onSubmit={handleUserInfoSubmit}
                    isLoading={isLoading}
                  />
                </Box>
              )}
              
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Button
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />
              </Box>
            </Box>
          )}
        </Box>
      </Container>
      
      <Snackbar 
        open={!!error || !!success} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={error ? 'error' : 'success'} 
          sx={{ width: '100%' }}
        >
          {error || success}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default App;