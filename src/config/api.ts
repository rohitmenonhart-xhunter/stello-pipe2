// API configuration
const isDevelopment = import.meta.env.MODE === 'development';

// Default API endpoints
const DEFAULT_API_BASE_URL = isDevelopment 
  ? 'http://localhost:8080/api' 
  : 'https://stello-pipe2.onrender.com/api';

const DEFAULT_PYTHON_API_BASE_URL = isDevelopment
  ? 'http://localhost:8000'
  : 'https://stello-pipe2.onrender.com';

export const API_CONFIG = {
  // Node.js server endpoints - prioritize env variables, then use defaults
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL,
  
  // Python FastAPI server endpoints
  PYTHON_API_BASE_URL: import.meta.env.VITE_PYTHON_API_BASE_URL || DEFAULT_PYTHON_API_BASE_URL
};

console.log('API Config:', {
  mode: import.meta.env.MODE,
  isDevelopment,
  API_BASE_URL: API_CONFIG.API_BASE_URL,
  PYTHON_API_BASE_URL: API_CONFIG.PYTHON_API_BASE_URL
});

// Helper functions to get full URLs
export const getApiUrl = (endpoint: string): string => {
  // Handle the case where endpoint is empty (for base API URL)
  if (!endpoint || endpoint === '/') {
    return API_CONFIG.API_BASE_URL;
  }
  // Otherwise add the endpoint to the base URL
  return `${API_CONFIG.API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};

export const getPythonApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.PYTHON_API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
}; 