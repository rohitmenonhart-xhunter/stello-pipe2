import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Chip,
  alpha,
  SelectChangeEvent,
  Grid,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  List,
  ListItem,
  ListItemText,
  Tab,
  Tabs
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import Header from './Header';
import { getApiUrl } from '../config/api';
import { useAuth } from '../context/AuthContext';

// Define interfaces
interface DeveloperPortalProps {
  developerName?: string;
}

// Define the possible project status values
type ProjectStatus = 
  | 'pending' 
  | 'acknowledged' 
  | 'approved' 
  | 'in_progress' 
  | 'assets_added' 
  | 'consultation' 
  | 'delivered';

interface Project {
  _id: string;
  projectId: string;
  name: string;
  email: string;
  projectStatus: ProjectStatus;
  assignedDeveloper: string | null;
  createdAt: string;
  statusUpdates?: Array<{
    status: ProjectStatus;
    message: string;
    updatedBy: string;
    timestamp: string;
  }>;
  template: {
    id: string;
    name: string;
    framework: string;
    description: string;
  };
  businessRequirements: {
    businessGoals: string;
    targetAudience: string;
    keyFeatures: string;
    contentTypes: string;
    designPreferences: string;
    technicalRequirements: string;
    timeline: string;
    budget: string;
  };
  pageNotes?: Record<string, string>;
}

// For backward compatibility with existing mocks
const defaultTemplate = {
  id: 'default',
  name: 'Unknown Template',
  framework: 'Not specified',
  description: 'No description available'
};

const defaultBusinessRequirements = {
  businessGoals: 'Not specified',
  targetAudience: 'Not specified',
  keyFeatures: 'Not specified',
  contentTypes: 'Not specified',
  designPreferences: 'Not specified',
  technicalRequirements: 'Not specified',
  timeline: 'Not specified',
  budget: 'Not specified'
};

// Status labels and colors
const statusLabels: Record<ProjectStatus, string> = {
  pending: 'Pending Review',
  acknowledged: 'Acknowledged',
  approved: 'Approved',
  in_progress: 'In Progress',
  assets_added: 'Assets Added',
  consultation: 'Consultation',
  delivered: 'Delivered'
};

const statusColors: Record<ProjectStatus, string> = {
  pending: '#FFA726',
  acknowledged: '#42A5F5',
  approved: '#66BB6A',
  in_progress: '#AB47BC',
  assets_added: '#26A69A',
  consultation: '#EC407A',
  delivered: '#5C6BC0'
};

// Project Details Dialog Component
interface ProjectDetailsDialogProps {
  project: Project | null;
  open: boolean;
  onClose: () => void;
}

const ProjectDetailsDialog: React.FC<ProjectDetailsDialogProps> = ({ project, open, onClose }) => {
  if (!project) return null;
  
  // Extract pages from keyFeatures
  const extractPages = (keyFeatures: string): string[] => {
    if (keyFeatures.includes('Selected Pages:')) {
      const pagesString = keyFeatures.split('Selected Pages:')[1].trim();
      return pagesString.split(',').map(page => page.trim());
    }
    return [];
  };
  
  const selectedPages = extractPages(project.businessRequirements.keyFeatures);
  
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle>
        <Typography variant="h5" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
          <InfoIcon sx={{ mr: 1, color: 'primary.main' }} />
          Project Details: {project.projectId}
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ border: '1px solid rgba(0,0,0,0.12)', height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Client Information</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">Name</Typography>
                    <Typography variant="body1">{project.name}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                    <Typography variant="body1">{project.email}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                    <Chip 
                      label={statusLabels[project.projectStatus]} 
                      size="small"
                      sx={{ 
                        bgcolor: alpha(statusColors[project.projectStatus], 0.1),
                        color: statusColors[project.projectStatus]
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">Created</Typography>
                    <Typography variant="body1">
                      {new Date(project.createdAt).toLocaleString()}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ border: '1px solid rgba(0,0,0,0.12)', height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Template Information</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">Name</Typography>
                    <Typography variant="body1">{project.template.name}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">Framework</Typography>
                    <Typography variant="body1">{project.template.framework}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                    <Typography variant="body1">{project.template.description}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Business Requirements</Typography>
            
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Business Goals & Target Audience</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">Business Goals</Typography>
                    <Typography variant="body1" style={{ whiteSpace: 'pre-line' }}>
                      {project.businessRequirements.businessGoals}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">Target Audience</Typography>
                    <Typography variant="body1" style={{ whiteSpace: 'pre-line' }}>
                      {project.businessRequirements.targetAudience}
                    </Typography>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Content & Design</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">Key Features</Typography>
                    <Typography variant="body1" style={{ whiteSpace: 'pre-line' }}>
                      {project.businessRequirements.keyFeatures}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">Content Types</Typography>
                    <Typography variant="body1" style={{ whiteSpace: 'pre-line' }}>
                      {project.businessRequirements.contentTypes}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">Design Preferences</Typography>
                    <Typography variant="body1" style={{ whiteSpace: 'pre-line' }}>
                      {project.businessRequirements.designPreferences}
                    </Typography>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Technical Requirements & Timeline</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">Technical Requirements</Typography>
                    <Typography variant="body1" style={{ whiteSpace: 'pre-line' }}>
                      {project.businessRequirements.technicalRequirements}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">Timeline</Typography>
                    <Typography variant="body1" style={{ whiteSpace: 'pre-line' }}>
                      {project.businessRequirements.timeline}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">Budget</Typography>
                    <Typography variant="body1" style={{ whiteSpace: 'pre-line' }}>
                      {project.businessRequirements.budget}
                    </Typography>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
          
          {selectedPages.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Information Architecture</Typography>
              <Card elevation={0} sx={{ border: '1px solid rgba(0,0,0,0.12)' }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>Selected Pages & Notes</Typography>
                  
                  {selectedPages.map((page, index) => (
                    <Accordion key={index}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>{page}</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        {project.pageNotes && project.pageNotes[page] ? (
                          <Typography variant="body1" style={{ whiteSpace: 'pre-line' }}>
                            {project.pageNotes[page]}
                          </Typography>
                        ) : (
                          <Typography variant="body2" color="text.secondary" fontStyle="italic">
                            No notes provided for this page.
                          </Typography>
                        )}
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

const DeveloperPortal: React.FC<DeveloperPortalProps> = ({ developerName: propDeveloperName }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [developerName, setDeveloperName] = useState(propDeveloperName || '');
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [openAssignDialog, setOpenAssignDialog] = useState(false);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [newStatus, setNewStatus] = useState<ProjectStatus>('pending');
  const [statusMessage, setStatusMessage] = useState('');
  const [tabValue, setTabValue] = useState<'all' | 'assigned'>('assigned');

  useEffect(() => {
    // Use the user's name from auth context instead of session storage
    if (user && user.name && !developerName) {
      setDeveloperName(user.name);
    }
    
    // Fetch projects on component mount
    fetchProjects();
  }, [user, developerName]);

  useEffect(() => {
    // Filter projects based on the selected tab
    if (tabValue === 'assigned') {
      setFilteredProjects(projects.filter(project => 
        project.assignedDeveloper === developerName
      ));
    } else {
      setFilteredProjects(projects);
    }
  }, [tabValue, projects, developerName]);

  const fetchProjects = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(getApiUrl('projects'));
      
      if (!response.ok) {
        // Try to parse the response as JSON first
        let errorMessage = `Failed to fetch projects (Status: ${response.status})`;
        
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
      
      if (!data.projects || !Array.isArray(data.projects)) {
        throw new Error('Invalid response format from server');
      }
      
      setProjects(data.projects);
      
      // Filter projects based on the selected tab
      if (tabValue === 'assigned' && developerName) {
        setFilteredProjects(data.projects.filter((project: Project) => 
          project.assignedDeveloper === developerName
        ));
      } else {
        setFilteredProjects(data.projects);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      
      // Show mock data if server is down
      const mockProjects: Project[] = [
        {
          _id: 'mock-1',
          projectId: 'PRJ-MOCK01-DEMO',
          name: 'Demo Project',
          email: 'demo@example.com',
          projectStatus: 'pending' as ProjectStatus,
          assignedDeveloper: null,
          createdAt: new Date().toISOString(),
          template: {
            ...defaultTemplate,
            name: 'Corporate Modern'
          },
          businessRequirements: {
            ...defaultBusinessRequirements,
            businessGoals: 'This is a mock project for demonstration purposes.',
            targetAudience: 'Developers testing the application',
            keyFeatures: 'Mock features'
          },
          pageNotes: {}
        }
      ];
      
      setProjects(mockProjects);
      
      // Filter mock projects based on the selected tab
      if (tabValue === 'assigned' && developerName) {
        setFilteredProjects(mockProjects.filter(project => 
          project.assignedDeveloper === developerName
        ));
      } else {
        setFilteredProjects(mockProjects);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAssignProject = async () => {
    if (!selectedProject || !developerName) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(getApiUrl(`projects/${selectedProject.projectId}/assign`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ developerName }),
      });
      
      if (!response.ok) {
        // Try to parse the response as JSON first
        let errorMessage = `Failed to assign project (Status: ${response.status})`;
        
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
      
      // Update the project in the list
      setProjects(projects.map(project => 
        project.projectId === selectedProject.projectId 
          ? { 
              ...project, 
              assignedDeveloper: developerName,
              projectStatus: data.project?.projectStatus || project.projectStatus
            } 
          : project
      ));
      
      // Update filtered projects
      const updatedProjects = projects.map(project => 
        project.projectId === selectedProject.projectId 
          ? { 
              ...project, 
              assignedDeveloper: developerName,
              projectStatus: data.project?.projectStatus || project.projectStatus
            } 
          : project
      );
      
      if (tabValue === 'assigned') {
        setFilteredProjects(updatedProjects.filter(project => 
          project.assignedDeveloper === developerName
        ));
      } else {
        setFilteredProjects(updatedProjects);
      }
      
      setUpdateSuccess(`Project assigned to ${developerName}`);
      setOpenAssignDialog(false);
    } catch (error) {
      console.error('Error assigning project:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      
      // Update UI anyway for better UX
      const updatedProjects = projects.map(project => 
        project.projectId === selectedProject.projectId 
          ? { ...project, assignedDeveloper: developerName } 
          : project
      );
      
      setProjects(updatedProjects);
      
      if (tabValue === 'assigned') {
        setFilteredProjects(updatedProjects.filter(project => 
          project.assignedDeveloper === developerName
        ));
      } else {
        setFilteredProjects(updatedProjects);
      }
      
      setUpdateSuccess(`Project assigned to ${developerName} (offline mode)`);
      setOpenAssignDialog(false);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedProject || !newStatus || !statusMessage) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(getApiUrl(`projects/${selectedProject.projectId}/status`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: newStatus, 
          message: statusMessage,
          updatedBy: developerName 
        }),
      });
      
      if (!response.ok) {
        // Try to parse the response as JSON first
        let errorMessage = `Failed to update project status (Status: ${response.status})`;
        
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
      
      // Update the project in the list with all data from the response
      const updatedProjects = projects.map(project => 
        project.projectId === selectedProject.projectId 
          ? { 
              ...project, 
              projectStatus: newStatus,
              statusUpdates: data.project?.statusUpdates || project.statusUpdates
            } 
          : project
      );
      
      setProjects(updatedProjects);
      
      if (tabValue === 'assigned') {
        setFilteredProjects(updatedProjects.filter(project => 
          project.assignedDeveloper === developerName
        ));
      } else {
        setFilteredProjects(updatedProjects);
      }
      
      setUpdateSuccess(`Project status updated to ${statusLabels[newStatus]}`);
      setOpenStatusDialog(false);
      setNewStatus('pending');
      setStatusMessage('');
    } catch (error) {
      console.error('Error updating project status:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      
      // Update UI anyway for better UX
      const updatedProjects = projects.map(project => 
        project.projectId === selectedProject.projectId 
          ? { ...project, projectStatus: newStatus } 
          : project
      );
      
      setProjects(updatedProjects);
      
      if (tabValue === 'assigned') {
        setFilteredProjects(updatedProjects.filter(project => 
          project.assignedDeveloper === developerName
        ));
      } else {
        setFilteredProjects(updatedProjects);
      }
      
      setUpdateSuccess(`Project status updated to ${statusLabels[newStatus]} (offline mode)`);
      setOpenStatusDialog(false);
      setNewStatus('pending');
      setStatusMessage('');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: 'all' | 'assigned') => {
    setTabValue(newValue);
  };

  const handleOpenAssignDialog = (project: Project) => {
    setSelectedProject(project);
    setOpenAssignDialog(true);
  };

  const handleOpenStatusDialog = (project: Project) => {
    setSelectedProject(project);
    setOpenStatusDialog(true);
  };

  const handleCloseAssignDialog = () => {
    setOpenAssignDialog(false);
  };

  const handleCloseStatusDialog = () => {
    setOpenStatusDialog(false);
    setNewStatus('pending');
    setStatusMessage('');
  };

  const handleAlertClose = () => {
    setError('');
    setUpdateSuccess('');
  };

  const handleStatusChange = (event: SelectChangeEvent) => {
    setNewStatus(event.target.value as ProjectStatus);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const handleOpenDetailsDialog = (project: Project) => {
    setSelectedProject(project);
    setOpenDetailsDialog(true);
  };

  return (
    <div className="App">
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Developer Portal
            {developerName && (
              <Typography component="span" variant="h5" sx={{ ml: 2, color: 'primary.main' }}>
                - {developerName}
              </Typography>
            )}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="outlined" 
              onClick={fetchProjects}
              disabled={loading}
              sx={{ borderRadius: '30px' }}
            >
              Refresh Projects
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/')}
              sx={{ borderRadius: '30px' }}
            >
              Back to Home
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
            onClose={handleAlertClose}
          >
            {error}
          </Alert>
        )}

        {updateSuccess && (
          <Alert 
            severity="success" 
            sx={{ mb: 3 }}
            onClose={handleAlertClose}
          >
            {updateSuccess}
          </Alert>
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
          }}
        >
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              aria-label="project tabs"
            >
              <Tab 
                value="assigned" 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AssignmentTurnedInIcon />
                    <span>My Projects</span>
                  </Box>
                }
              />
              <Tab 
                value="all" 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AssignmentIcon />
                    <span>All Projects</span>
                  </Box>
                } 
              />
            </Tabs>
          </Box>

          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            {tabValue === 'assigned' ? 'My Projects' : 'All Project Requests'}
          </Typography>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : filteredProjects.length === 0 ? (
            <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
              {tabValue === 'assigned' 
                ? 'You have no assigned projects. You can assign yourself to a project from the "All Projects" tab.' 
                : 'No projects found. Check back later.'}
            </Typography>
          ) : (
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Project ID</TableCell>
                    <TableCell>Client</TableCell>
                    <TableCell>Template</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>Developer</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredProjects.map((project) => (
                    <TableRow key={project._id}>
                      <TableCell>{project.projectId}</TableCell>
                      <TableCell>{project.name}</TableCell>
                      <TableCell>{project.template.name}</TableCell>
                      <TableCell>
                        <Chip 
                          label={statusLabels[project.projectStatus]} 
                          sx={{ 
                            bgcolor: alpha(statusColors[project.projectStatus], 0.1),
                            color: statusColors[project.projectStatus],
                            fontWeight: 500,
                            borderRadius: '16px',
                            border: `1px solid ${alpha(statusColors[project.projectStatus], 0.3)}`
                          }}
                        />
                      </TableCell>
                      <TableCell>{formatDate(project.createdAt)}</TableCell>
                      <TableCell>{project.assignedDeveloper || 'Unassigned'}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button 
                            variant="outlined" 
                            size="small"
                            onClick={() => handleOpenDetailsDialog(project)}
                            sx={{ 
                              minWidth: 'auto',
                              borderRadius: '16px',
                              fontWeight: 500,
                              borderColor: alpha('#6200EA', 0.5),
                              color: '#6200EA',
                              '&:hover': {
                                borderColor: '#6200EA',
                                backgroundColor: alpha('#6200EA', 0.08)
                              }
                            }}
                          >
                            Details
                          </Button>
                          <Button 
                            variant="outlined" 
                            size="small"
                            color="primary"
                            onClick={() => handleOpenAssignDialog(project)}
                            disabled={!!project.assignedDeveloper && project.assignedDeveloper !== developerName}
                            sx={{ 
                              minWidth: 'auto',
                              borderRadius: '16px',
                              fontWeight: 500
                            }}
                          >
                            {!project.assignedDeveloper ? 'Assign' : project.assignedDeveloper === developerName ? 'Reassign' : 'Assigned'}
                          </Button>
                          <Button 
                            variant="outlined" 
                            size="small"
                            color="secondary"
                            onClick={() => handleOpenStatusDialog(project)}
                            disabled={!developerName || (project.assignedDeveloper !== developerName && project.assignedDeveloper !== null)}
                            sx={{ 
                              minWidth: 'auto',
                              borderRadius: '16px',
                              fontWeight: 500
                            }}
                          >
                            Update
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        {/* Assign Project Dialog */}
        <Dialog open={openAssignDialog} onClose={handleCloseAssignDialog}>
          <DialogTitle>Assign Project</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mb: 2 }}>
              Assign this project to yourself or another developer.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Developer Name"
              type="text"
              fullWidth
              variant="outlined"
              value={developerName}
              onChange={(e) => setDeveloperName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAssignDialog}>Cancel</Button>
            <Button 
              onClick={handleAssignProject} 
              disabled={!developerName || loading}
              variant="contained"
              sx={{ 
                background: 'linear-gradient(135deg, #6200EA, #B388FF)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5000C9, #A270FF)',
                }
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'Assign'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Update Status Dialog */}
        <Dialog open={openStatusDialog} onClose={handleCloseStatusDialog}>
          <DialogTitle>Update Project Status</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mb: 2 }}>
              Update the status of this project and provide a message for the client.
            </DialogContentText>
            {selectedProject && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Project: {selectedProject.name} ({selectedProject.projectId})
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Current Status: {statusLabels[selectedProject.projectStatus]}
                </Typography>
              </Box>
            )}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={newStatus}
                label="Status"
                onChange={handleStatusChange}
              >
                {Object.entries(statusLabels).map(([value, label]) => (
                  <MenuItem key={value} value={value}>{label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Status Message"
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              value={statusMessage}
              onChange={(e) => setStatusMessage(e.target.value)}
              placeholder="Provide details about this status update for the client"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseStatusDialog}>Cancel</Button>
            <Button 
              onClick={handleUpdateStatus} 
              disabled={!newStatus || !statusMessage || loading}
              variant="contained"
              sx={{ 
                background: 'linear-gradient(135deg, #6200EA, #B388FF)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5000C9, #A270FF)',
                }
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'Update Status'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Project Details Dialog */}
        <ProjectDetailsDialog
          project={selectedProject}
          open={openDetailsDialog}
          onClose={() => setOpenDetailsDialog(false)}
        />
      </Container>
    </div>
  );
};

export default DeveloperPortal; 