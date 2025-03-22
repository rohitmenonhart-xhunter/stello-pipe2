// API configuration
export const API_CONFIG = {
  // Node.js server endpoints
  API_BASE_URL: 'http://localhost:8080/api',
  
  // Python FastAPI server endpoints
  PYTHON_API_BASE_URL: 'http://localhost:8000'
};

// Helper functions to get full URLs
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};

export const getPythonApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.PYTHON_API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
}; 