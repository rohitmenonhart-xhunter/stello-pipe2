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
  Grid
} from '@mui/material';
import { getApiUrl, API_CONFIG } from '../config/api';

const ApiDebugger: React.FC = () => {
  const [apiUrl, setApiUrl] = useState(API_CONFIG.API_BASE_URL);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [envInfo, setEnvInfo] = useState<any>({});

  // Get environment information
  useEffect(() => {
    setEnvInfo({
      mode: import.meta.env.MODE || 'unknown',
      apiBaseUrl: API_CONFIG.API_BASE_URL,
      pythonApiBaseUrl: API_CONFIG.PYTHON_API_BASE_URL,
      viteApiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'not set',
      vitePythonApiBaseUrl: import.meta.env.VITE_PYTHON_API_BASE_URL || 'not set',
    });
  }, []);

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
      <Typography variant="h5" gutterBottom sx={{ color: 'primary.main' }}>
        API Connection Debugger
      </Typography>
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