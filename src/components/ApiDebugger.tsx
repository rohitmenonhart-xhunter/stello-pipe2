import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  TextField, 
  Stack, 
  Alert, 
  Divider, 
  CircularProgress,
  Grid,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { getApiUrl, API_CONFIG } from '../config/api';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LockIcon from '@mui/icons-material/Lock';

const ACCESS_KEY = "iamunique7$";

const ApiDebugger: React.FC = () => {
  const [apiUrl, setApiUrl] = useState(API_CONFIG.API_BASE_URL);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [envInfo, setEnvInfo] = useState<any>({});
  
  // States for access control
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessKeyInput, setAccessKeyInput] = useState('');
  const [showAccessKey, setShowAccessKey] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  // Get environment information
  useEffect(() => {
    setEnvInfo({
      mode: import.meta.env.MODE || 'unknown',
      apiBaseUrl: API_CONFIG.API_BASE_URL,
      pythonApiBaseUrl: API_CONFIG.PYTHON_API_BASE_URL,
      viteApiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'not set',
      vitePythonApiBaseUrl: import.meta.env.VITE_PYTHON_API_BASE_URL || 'not set',
    });
    
    // Check localStorage for authenticated state
    const storedAuth = localStorage.getItem('apiDebuggerAuth');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const validateAccessKey = () => {
    if (accessKeyInput === ACCESS_KEY) {
      setIsAuthenticated(true);
      localStorage.setItem('apiDebuggerAuth', 'true');
      setShowAuthDialog(false);
    } else {
      setError('Invalid access key');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      validateAccessKey();
    }
  };

  const resetAuthentication = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('apiDebuggerAuth');
    setAccessKeyInput('');
  };

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    setStatusCode(null);
    
    try {
      const url = apiUrl.endsWith('/') ? apiUrl : `${apiUrl}/`;
      console.log(`Testing connection to: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      setStatusCode(response.status);
      
      if (response.ok) {
        try {
          const data = await response.json();
          setResponse(data);
        } catch (e) {
          const text = await response.text();
          setResponse({ text });
          setError('Response not in JSON format');
        }
      } else {
        setError(`Server responded with status: ${response.status}`);
        try {
          const errorData = await response.json();
          setResponse(errorData);
        } catch {
          const text = await response.text();
          setResponse({ text });
        }
      }
    } catch (err) {
      console.error('Connection error:', err);
      setError(`Connection error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const testApiEndpoint = async (endpoint: string) => {
    setLoading(true);
    setError(null);
    setResponse(null);
    setStatusCode(null);
    
    try {
      const url = getApiUrl(endpoint);
      console.log(`Testing endpoint: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      setStatusCode(response.status);
      
      if (response.ok) {
        const data = await response.json();
        setResponse(data);
      } else {
        setError(`Server responded with status: ${response.status}`);
        try {
          const errorData = await response.json();
          setResponse(errorData);
        } catch {
          const text = await response.text();
          setResponse({ text });
        }
      }
    } catch (err) {
      console.error('Connection error:', err);
      setError(`Connection error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  // Only render a button if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        <Button 
          variant="outlined" 
          size="small" 
          color="primary"
          onClick={() => setShowAuthDialog(true)}
          sx={{ 
            my: 2, 
            display: import.meta.env.DEV ? 'inline-flex' : 'none',
            alignItems: 'center', 
            gap: 1,
            borderRadius: 2
          }}
        >
          <LockIcon fontSize="small" />
          Show API Debugger
        </Button>
        
        <Dialog open={showAuthDialog} onClose={() => setShowAuthDialog(false)}>
          <DialogTitle>API Debugger Access</DialogTitle>
          <DialogContent>
            <Alert severity="info" sx={{ mb: 2 }}>
              Enter the access key to view the API debugger
            </Alert>
            <TextField
              autoFocus
              margin="dense"
              label="Access Key"
              type={showAccessKey ? 'text' : 'password'}
              fullWidth
              variant="outlined"
              value={accessKeyInput}
              onChange={(e) => setAccessKeyInput(e.target.value)}
              onKeyPress={handleKeyPress}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={() => setShowAccessKey(!showAccessKey)}
                    >
                      {showAccessKey ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowAuthDialog(false)}>Cancel</Button>
            <Button onClick={validateAccessKey}>Access</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  // Render the full debugger when authenticated
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        my: 3, 
        maxWidth: '100%',
        display: import.meta.env.DEV ? 'block' : 'none' 
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', mb: 0 }}>
          API Connection Debugger
        </Typography>
        <Button 
          variant="outlined" 
          size="small" 
          color="error" 
          onClick={resetAuthentication}
        >
          Lock Debugger
        </Button>
      </Box>
      
      <Typography variant="body2" color="text.secondary" paragraph>
        This tool is only visible in development mode and helps test API connectivity.
      </Typography>

      <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
        <Typography variant="subtitle2" gutterBottom>Environment Information:</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2">
              <strong>Mode:</strong> {envInfo.mode}
            </Typography>
            <Typography variant="body2">
              <strong>API Base URL:</strong> {envInfo.apiBaseUrl}
            </Typography>
            <Typography variant="body2">
              <strong>Python API Base URL:</strong> {envInfo.pythonApiBaseUrl}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2">
              <strong>VITE_API_BASE_URL:</strong> {envInfo.viteApiBaseUrl}
            </Typography>
            <Typography variant="body2">
              <strong>VITE_PYTHON_API_BASE_URL:</strong> {envInfo.vitePythonApiBaseUrl}
            </Typography>
          </Grid>
        </Grid>
      </Box>
      
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <TextField
          label="API URL"
          value={apiUrl}
          onChange={(e) => setApiUrl(e.target.value)}
          fullWidth
          variant="outlined"
          size="small"
        />
        <Button 
          variant="contained" 
          onClick={testConnection}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Test Connection'}
        </Button>
      </Stack>
      
      <Divider sx={{ my: 2 }} />
      
      <Typography variant="subtitle1" gutterBottom>Quick Tests:</Typography>
      <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
        <Button 
          variant="outlined" 
          size="small" 
          onClick={() => testApiEndpoint('')}
          disabled={loading}
        >
          Test Base API
        </Button>
        <Button 
          variant="outlined" 
          size="small" 
          onClick={() => testApiEndpoint('health')}
          disabled={loading}
        >
          Test Health Endpoint
        </Button>
        <Button 
          variant="outlined" 
          size="small" 
          onClick={() => testApiEndpoint('projects')}
          disabled={loading}
        >
          Test Projects Endpoint
        </Button>
      </Stack>
      
      {loading && (
        <Box display="flex" justifyContent="center" my={3}>
          <CircularProgress />
        </Box>
      )}
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      {statusCode !== null && (
        <Alert 
          severity={statusCode >= 200 && statusCode < 300 ? "success" : "warning"}
          sx={{ mb: 2 }}
        >
          Status Code: {statusCode}
        </Alert>
      )}
      
      {response && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>Response:</Typography>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              bgcolor: 'grey.100',
              maxHeight: '300px',
              overflow: 'auto',
              whiteSpace: 'pre-wrap',
              fontFamily: 'monospace',
              fontSize: '0.875rem'
            }}
          >
            {JSON.stringify(response, null, 2)}
          </Paper>
        </Box>
      )}
    </Paper>
  );
};

export default ApiDebugger; 