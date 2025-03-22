import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  TextField, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  CardActions, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  IconButton, 
  Stack, 
  Chip, 
  Alert, 
  CircularProgress, 
  Snackbar, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Divider,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Tabs,
  Tab
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { getApiUrl } from '../config/api';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

// Define template interface
interface Template {
  id: string;
  name: string;
  description: string;
  tags: string[];
  framework: 'react' | 'nextjs';
  version: string;
  author: string;
  imageUrl: string;
  relativePath?: string;
  editableComponents?: {
    id: string;
    name: string;
    path: string;
    type: string;
  }[];
}

// Styled components
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const TemplateEditor: React.FC = () => {
  // State for authentication
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authKey, setAuthKey] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);
  
  // State for templates
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // State for dialogs
  const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false);
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  
  // State for form
  const [newTemplate, setNewTemplate] = useState<Partial<Template>>({
    id: '',
    name: '',
    description: '',
    tags: [],
    framework: 'react',
    version: '1.0.0',
    author: 'Your Company'
  });
  const [tagInput, setTagInput] = useState<string>('');
  const [activeTab, setActiveTab] = useState<number>(0);

  // Check if user already has access key in localStorage
  useEffect(() => {
    const savedKey = localStorage.getItem('templateEditorKey');
    if (savedKey === 'iamunique7$') {
      setAuthKey(savedKey);
      setIsAuthenticated(true);
    }
  }, []);

  // Load templates when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchTemplates();
    }
  }, [isAuthenticated]);

  // Handle authentication
  const handleAuthenticate = () => {
    if (authKey === 'iamunique7$') {
      setIsAuthenticated(true);
      setAuthError(null);
      localStorage.setItem('templateEditorKey', authKey);
    } else {
      setAuthError('Invalid access key');
    }
  };

  // Fetch all templates
  const fetchTemplates = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(getApiUrl('templates'));
      
      if (!response.ok) {
        throw new Error(`Failed to fetch templates: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setTemplates(data.templates);
      } else {
        throw new Error(data.error || 'Failed to fetch templates');
      }
    } catch (err) {
      setError(`Error fetching templates: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  // Add a new template
  const handleAddTemplate = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(getApiUrl('templates'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authKey
        },
        body: JSON.stringify(newTemplate)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess(`Template '${newTemplate.name}' created successfully`);
        setAddDialogOpen(false);
        resetForm();
        fetchTemplates();
      } else {
        throw new Error(data.message || 'Failed to create template');
      }
    } catch (err) {
      setError(`Error creating template: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  // Update an existing template
  const handleUpdateTemplate = async () => {
    if (!selectedTemplate) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(getApiUrl(`templates/${selectedTemplate.id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authKey
        },
        body: JSON.stringify(newTemplate)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess(`Template '${newTemplate.name}' updated successfully`);
        setEditDialogOpen(false);
        resetForm();
        fetchTemplates();
      } else {
        throw new Error(data.message || 'Failed to update template');
      }
    } catch (err) {
      setError(`Error updating template: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  // Delete a template
  const handleDeleteTemplate = async () => {
    if (!selectedTemplate) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(getApiUrl(`templates/${selectedTemplate.id}`), {
        method: 'DELETE',
        headers: {
          'Authorization': authKey
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess(`Template '${selectedTemplate.name}' deleted successfully`);
        setDeleteDialogOpen(false);
        fetchTemplates();
      } else {
        throw new Error(data.message || 'Failed to delete template');
      }
    } catch (err) {
      setError(`Error deleting template: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  // Open edit dialog and populate form
  const openEditDialog = (template: Template) => {
    setSelectedTemplate(template);
    setNewTemplate({
      id: template.id,
      name: template.name,
      description: template.description,
      tags: [...template.tags],
      framework: template.framework,
      version: template.version || '1.0.0',
      author: template.author || 'Your Company'
    });
    setEditDialogOpen(true);
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (template: Template) => {
    setSelectedTemplate(template);
    setDeleteDialogOpen(true);
  };

  // Reset form fields
  const resetForm = () => {
    setNewTemplate({
      id: '',
      name: '',
      description: '',
      tags: [],
      framework: 'react',
      version: '1.0.0',
      author: 'Your Company'
    });
    setTagInput('');
  };

  // Add a tag to the template
  const handleAddTag = () => {
    if (tagInput.trim() && !newTemplate.tags?.includes(tagInput.trim().toLowerCase())) {
      setNewTemplate({
        ...newTemplate,
        tags: [...(newTemplate.tags || []), tagInput.trim().toLowerCase()]
      });
      setTagInput('');
    }
  };

  // Remove a tag from the template
  const handleRemoveTag = (tagToRemove: string) => {
    setNewTemplate({
      ...newTemplate,
      tags: newTemplate.tags?.filter(tag => tag !== tagToRemove) || []
    });
  };

  // Handle changes to form fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setNewTemplate({
        ...newTemplate,
        [name]: value
      });
    }
  };

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // If not authenticated, show login form
  if (!isAuthenticated) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Template Editor Access
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 4 }} align="center">
            Enter the access key to manage templates
          </Typography>
          
          {authError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {authError}
            </Alert>
          )}
          
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Access Key"
              type="password"
              value={authKey}
              onChange={(e) => setAuthKey(e.target.value)}
              autoFocus
            />
            
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleAuthenticate}
            >
              Access Template Editor
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Template Editor
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Templates Gallery" />
          <Tab label="Templates Table" />
        </Tabs>
      </Box>
      
      {/* Show error/success notifications */}
      <Snackbar 
        open={!!success} 
        autoHideDuration={6000} 
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setSuccess(null)} severity="success">
          {success}
        </Alert>
      </Snackbar>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Add Template Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => setAddDialogOpen(true)}
        >
          Add Template
        </Button>
      </Box>
      
      {/* Loading indicator */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}
      
      {/* Templates Gallery View */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          {templates.map((template) => (
            <Grid item xs={12} sm={6} md={4} key={template.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={template.imageUrl || '/placeholder-template.png'}
                  alt={template.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {template.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {template.description}
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Framework: {template.framework}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                    {template.tags?.map((tag) => (
                      <Chip key={tag} label={tag} size="small" />
                    ))}
                  </Stack>
                </CardContent>
                <CardActions>
                  <IconButton aria-label="edit" onClick={() => openEditDialog(template)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton aria-label="delete" onClick={() => openDeleteDialog(template)}>
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* Templates Table View */}
      {activeTab === 1 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Framework</TableCell>
                <TableCell>Tags</TableCell>
                <TableCell>Version</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {templates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell>{template.id}</TableCell>
                  <TableCell>{template.name}</TableCell>
                  <TableCell>{template.framework}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                      {template.tags?.map((tag) => (
                        <Chip key={tag} label={tag} size="small" />
                      ))}
                    </Stack>
                  </TableCell>
                  <TableCell>{template.version}</TableCell>
                  <TableCell>
                    <IconButton aria-label="edit" onClick={() => openEditDialog(template)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton aria-label="delete" onClick={() => openDeleteDialog(template)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
      {/* Add Template Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Template</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                margin="normal"
                label="Template ID"
                name="id"
                value={newTemplate.id}
                onChange={handleChange}
                helperText="Unique identifier for the template (URL-friendly)"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                margin="normal"
                label="Template Name"
                name="name"
                value={newTemplate.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                margin="normal"
                label="Description"
                name="description"
                value={newTemplate.description}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Framework</InputLabel>
                <Select
                  name="framework"
                  value={newTemplate.framework}
                  onChange={handleChange}
                  label="Framework"
                >
                  <MenuItem value="react">React</MenuItem>
                  <MenuItem value="nextjs">Next.js</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Version"
                name="version"
                value={newTemplate.version}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Author"
                name="author"
                value={newTemplate.author}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>Tags</Divider>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TextField
                  fullWidth
                  label="Add Tag"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <Button 
                  variant="contained" 
                  onClick={handleAddTag} 
                  sx={{ ml: 1, height: 56 }}
                >
                  Add
                </Button>
              </Box>
              <Paper variant="outlined" sx={{ p: 2, minHeight: 100 }}>
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                  {newTemplate.tags?.map((tag) => (
                    <Chip 
                      key={tag} 
                      label={tag} 
                      onDelete={() => handleRemoveTag(tag)} 
                    />
                  ))}
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleAddTemplate} 
            variant="contained" 
            disabled={!newTemplate.id || !newTemplate.name || !newTemplate.framework}
          >
            Add Template
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Edit Template Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Template: {selectedTemplate?.name}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                disabled
                fullWidth
                margin="normal"
                label="Template ID"
                name="id"
                value={newTemplate.id}
                helperText="ID cannot be changed"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                margin="normal"
                label="Template Name"
                name="name"
                value={newTemplate.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                margin="normal"
                label="Description"
                name="description"
                value={newTemplate.description}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Framework</InputLabel>
                <Select
                  name="framework"
                  value={newTemplate.framework}
                  onChange={handleChange}
                  label="Framework"
                >
                  <MenuItem value="react">React</MenuItem>
                  <MenuItem value="nextjs">Next.js</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Version"
                name="version"
                value={newTemplate.version}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Author"
                name="author"
                value={newTemplate.author}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>Tags</Divider>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TextField
                  fullWidth
                  label="Add Tag"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <Button 
                  variant="contained" 
                  onClick={handleAddTag} 
                  sx={{ ml: 1, height: 56 }}
                >
                  Add
                </Button>
              </Box>
              <Paper variant="outlined" sx={{ p: 2, minHeight: 100 }}>
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                  {newTemplate.tags?.map((tag) => (
                    <Chip 
                      key={tag} 
                      label={tag} 
                      onDelete={() => handleRemoveTag(tag)} 
                    />
                  ))}
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleUpdateTemplate} 
            variant="contained" 
            disabled={!newTemplate.name || !newTemplate.framework}
          >
            Update Template
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Template</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete template "{selectedTemplate?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteTemplate} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TemplateEditor; 