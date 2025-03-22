import React, { useEffect, useState } from 'react';
import { getApiUrl } from '../config/api';

const ApiStatus: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  const [message, setMessage] = useState<string>('Checking connection...');

  useEffect(() => {
    const checkApiConnection = async () => {
      try {
        // Try to connect to the health endpoint
        const response = await fetch(getApiUrl('health'));
        
        if (response.ok) {
          const data = await response.json();
          setStatus('connected');
          setMessage(`Connected to API! Server responded with: ${JSON.stringify(data)}`);
        } else {
          setStatus('error');
          setMessage(`API responded with status: ${response.status}`);
        }
      } catch (error) {
        setStatus('error');
        setMessage(`Failed to connect to API: ${error instanceof Error ? error.message : String(error)}`);
        console.error('API connection error:', error);
      }
    };

    checkApiConnection();
  }, []);

  return (
    <div className="api-status-container" style={{ padding: '1rem', margin: '1rem 0', borderRadius: '4px', border: '1px solid #ccc' }}>
      <h3>API Connection Status</h3>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.5rem',
        color: status === 'connected' ? 'green' : status === 'error' ? 'red' : 'orange'
      }}>
        <div style={{ 
          width: '12px', 
          height: '12px', 
          borderRadius: '50%', 
          backgroundColor: status === 'connected' ? 'green' : status === 'error' ? 'red' : 'orange' 
        }}></div>
        <span>
          {status === 'connected' ? 'Connected' : status === 'error' ? 'Error' : 'Connecting...'}
        </span>
      </div>
      <p>{message}</p>
      <div>
        <strong>API URL:</strong> {getApiUrl('')}
      </div>
    </div>
  );
};

export default ApiStatus; 