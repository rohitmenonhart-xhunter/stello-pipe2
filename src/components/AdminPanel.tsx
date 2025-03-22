import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  SelectChangeEvent
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LockIcon from '@mui/icons-material/Lock';
import Header from './Header';
import { getApiUrl } from '../config/api';
import { useAuth } from '../context/AuthContext';

interface Developer {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  devId?: string;
}

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedDeveloper, setSelectedDeveloper] = useState<Developer | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('developer');

  useEffect(() => {
    // Check if user has admin role
    if (user && user.role !== 'admin') {
      navigate('/client-dashboard');
    }

    // Fetch developers on component mount
    fetchDevelopers();
  }, [user, navigate]);

  const fetchDevelopers = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(getApiUrl('admin/developers'));
      
      if (!response.ok) {
        throw new Error(`Failed to fetch developers (Status: ${response.status})`);
      }
      
      const data = await response.json();
      
      if (data.success && data.developers) {
        setDevelopers(data.developers);
      } else {
        throw new Error(data.error || 'Failed to fetch developers');
      }
    } catch (error) {
      console.error('Error fetching developers:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      
      // Show mock data for development
      const mockDevelopers: Developer[] = [
        {
          _id: 'dev-1',
          name: 'John Developer',
          email: 'john@example.com',
          role: 'developer',
          createdAt: new Date().toISOString()
        },
        {
          _id: 'dev-2',
          name: 'Sarah Developer',
          email: 'sarah@example.com',
          role: 'developer',
          createdAt: new Date().toISOString()
        }
      ];
      
      setDevelopers(mockDevelopers);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDeveloper = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Validate form
      if (!name || !email || !password || !role) {
        throw new Error('All fields are required');
      }
      
      const response = await fetch(getApiUrl('admin/developers'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create developer (Status: ${response.status})`);
      }
      
      const data = await response.json();
      
      // Add the new developer to the list
      // Make sure we have the devId from the server, or generate a temporary one
      const newDeveloper = {
        ...data.developer,
        devId: data.developer.devId || `dev-temp-${Date.now()}`
      };
      
      setDevelopers([newDeveloper, ...developers]);
      
      setSuccess(`Developer ${name} created successfully`);
      handleCloseCreateDialog();
    } catch (error) {
      console.error('Error creating developer:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDeveloper = async () => {
    if (!selectedDeveloper) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Validate form
      if (!name || !email || !role) {
        throw new Error('Name, email, and role are required');
      }
      
      // Prepare developer data
      const developerData: any = {
        name,
        email,
        role
      };
      
      // Only include password if it's provided
      if (password) {
        developerData.password = password;
      }
      
      // Use MongoDB ObjectId for the API endpoint
      const developerId = selectedDeveloper._id;
      const response = await fetch(getApiUrl(`admin/developers/${developerId}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(developerData),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update developer (Status: ${response.status})`);
      }
      
      const data = await response.json();
      
      // Update the developers list
      fetchDevelopers();
      
      setSuccess(`Developer ${name} updated successfully`);
      handleCloseEditDialog();
    } catch (error) {
      console.error('Error updating developer:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDeveloper = async () => {
    if (!selectedDeveloper) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Use MongoDB ObjectId for the API endpoint
      const developerId = selectedDeveloper._id;
      const response = await fetch(getApiUrl(`admin/developers/${developerId}`), {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete developer (Status: ${response.status})`);
      }
      
      // Update the developers list
      setDevelopers(developers.filter(dev => dev._id !== selectedDeveloper._id));
      
      setSuccess(`Developer ${selectedDeveloper.name} deleted successfully`);
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Error deleting developer:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateDialog = () => {
    resetForm();
    setOpenCreateDialog(true);
  };

  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false);
    resetForm();
  };

  const handleOpenEditDialog = (developer: Developer) => {
    setSelectedDeveloper(developer);
    setName(developer.name);
    setEmail(developer.email);
    setPassword(''); // Don't prefill password
    setRole(developer.role);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    resetForm();
  };

  const handleOpenDeleteDialog = (developer: Developer) => {
    setSelectedDeveloper(developer);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedDeveloper(null);
  };

  const handleRoleChange = (event: SelectChangeEvent) => {
    setRole(event.target.value);
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setRole('developer');
    setSelectedDeveloper(null);
  };

  const clearAdminPassword = () => {
    localStorage.removeItem('adminPassword');
    setSuccess('Admin access revoked. You will need to enter the password again next time.');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const handleAlertClose = () => {
    setError('');
    setSuccess('');
  };

  return (
    <div className="App">
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <AdminPanelSettingsIcon sx={{ mr: 2, fontSize: 40, color: 'primary.main' }} />
            Admin Panel
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="outlined" 
              onClick={fetchDevelopers}
              disabled={loading}
              sx={{ borderRadius: '30px' }}
            >
              Refresh List
            </Button>
            <Button 
              variant="contained" 
              onClick={handleOpenCreateDialog}
              disabled={loading}
              startIcon={<PersonAddIcon />}
              sx={{ 
                borderRadius: '30px',
                background: 'linear-gradient(135deg, #6200EA, #B388FF)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5000C9, #A270FF)',
                }
              }}
            >
              Create Developer
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<LockIcon />}
              onClick={clearAdminPassword}
              sx={{ borderRadius: 2 }}
            >
              Revoke Admin Access
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

        {success && (
          <Alert 
            severity="success" 
            sx={{ mb: 3 }}
            onClose={handleAlertClose}
          >
            {success}
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
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Developer Accounts
          </Typography>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : developers.length === 0 ? (
            <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
              No developers found. Create one to get started.
            </Typography>
          ) : (
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Developer ID</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {developers.map((developer) => (
                    <TableRow key={developer._id}>
                      <TableCell>{developer.name}</TableCell>
                      <TableCell>{developer.email}</TableCell>
                      <TableCell>
                        {developer.role === 'admin' ? (
                          <Typography variant="body2" color="primary" sx={{ fontWeight: 'bold' }}>
                            Admin
                          </Typography>
                        ) : (
                          <Typography variant="body2">
                            Developer
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {developer.devId || '-'}
                      </TableCell>
                      <TableCell>{formatDate(developer.createdAt)}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex' }}>
                          <Tooltip title="Edit">
                            <IconButton onClick={() => handleOpenEditDialog(developer)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton onClick={() => handleOpenDeleteDialog(developer)} color="error">
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        {/* Create Developer Dialog */}
        <Dialog open={openCreateDialog} onClose={handleCloseCreateDialog}>
          <DialogTitle>Create Developer Account</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mb: 2 }}>
              Create a new developer account. Developers will be able to log in using the credentials you provide.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Name"
              type="text"
              fullWidth
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Email"
              type="email"
              fullWidth
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Password"
              type="password"
              fullWidth
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Role</InputLabel>
              <Select
                value={role}
                label="Role"
                onChange={handleRoleChange}
              >
                <MenuItem value="developer">Developer</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseCreateDialog}>Cancel</Button>
            <Button 
              onClick={handleCreateDeveloper} 
              disabled={!name || !email || !password || loading}
              variant="contained"
              sx={{ 
                background: 'linear-gradient(135deg, #6200EA, #B388FF)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5000C9, #A270FF)',
                }
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Developer Dialog */}
        <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
          <DialogTitle>Edit Developer Account</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mb: 2 }}>
              Update developer account details. Leave the password field empty if you don't want to change it.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Name"
              type="text"
              fullWidth
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Email"
              type="email"
              fullWidth
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="New Password (leave empty to keep current)"
              type="password"
              fullWidth
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Role</InputLabel>
              <Select
                value={role}
                label="Role"
                onChange={handleRoleChange}
              >
                <MenuItem value="developer">Developer</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditDialog}>Cancel</Button>
            <Button 
              onClick={handleUpdateDeveloper} 
              disabled={!name || !email || loading}
              variant="contained"
              sx={{ 
                background: 'linear-gradient(135deg, #6200EA, #B388FF)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5000C9, #A270FF)',
                }
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'Update'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Developer Dialog */}
        <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
          <DialogTitle>Delete Developer Account</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete the developer account for {selectedDeveloper?.name}? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
            <Button 
              onClick={handleDeleteDeveloper} 
              disabled={loading}
              variant="contained"
              color="error"
            >
              {loading ? <CircularProgress size={24} /> : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
};

export default AdminPanel; 