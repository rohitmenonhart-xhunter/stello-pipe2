import React, { useEffect, useState } from 'react';
import { getApiUrl } from '../config/api';
import { Alert, Box, Button, CircularProgress, Typography } from '@mui/material';

const ApiStatus: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [apiUrl, setApiUrl] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated
  useEffect(() => {
    const storedAuth = localStorage.getItem('apiDebuggerAuth');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const checkApiConnection = async () => {
    setStatus('loading');
    setError('');
    
    try {
      const url = getApiUrl('');
      setApiUrl(url);
      
      console.log('Checking API connection to:', url);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log('API response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        setStatus('connected');
        setMessage(data.message || 'API is connected');
      } else {
        const errorData = await response.text();
        console.error('API error response:', errorData);
        setStatus('error');
        setError(`API responded with status: ${response.status}`);
      }
    } catch (err) {
      console.error('API connection error:', err);
      setStatus('error');
      setError(`Connection error: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      checkApiConnection();
    }
  }, [isAuthenticated]);

  // If not authenticated, don't render anything
  if (!isAuthenticated) {
    return null;
  }

  return (
    <Box 
      sx={{ 
        p: 2, 
        border: '1px solid', 
        borderColor: status === 'connected' ? 'success.main' : 
                     status === 'error' ? 'error.main' : 'grey.300',
        borderRadius: 1,
        mt: 2,
        mb: 2 
      }}
    >
      <Typography variant="h6" gutterBottom>
        API Connection Status
      </Typography>
      
      {status === 'loading' && (
        <Box display="flex" alignItems="center" gap={2}>
          <CircularProgress size={20} />
          <Typography>Checking API connection...</Typography>
        </Box>
      )}
      
      {status === 'connected' && (
        <Alert severity="success" sx={{ mb: 1 }}>
          Connected successfully!
        </Alert>
      )}
      
      {status === 'error' && (
        <Alert severity="error" sx={{ mb: 1 }}>
          {error}
        </Alert>
      )}
      
      <Typography variant="body2" sx={{ mt: 1 }}>
        API URL: {apiUrl}
      </Typography>
      
      {message && (
        <Typography variant="body2" sx={{ mt: 1 }}>
          Message: {message}
        </Typography>
      )}
      
      <Button 
        variant="outlined" 
        size="small" 
        onClick={checkApiConnection} 
        sx={{ mt: 2 }}
      >
        Retry Connection
      </Button>
    </Box>
  );
};

export default ApiStatus; 