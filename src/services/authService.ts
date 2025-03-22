import { getApiUrl } from '../config/api';

export interface UserData {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
}

export interface LoginCredentials {
  email?: string;
  phone?: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email?: string;
  phone?: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: UserData;
  error?: string;
  message?: string;
}

// Register a new user
export const registerUser = async (userData: RegisterData): Promise<AuthResponse> => {
  try {
    console.log('Registering user with data:', {
      ...userData,
      password: '******' // Hide password in logs
    });
    
    const apiUrl = getApiUrl('auth/register');
    console.log('Registration API URL:', apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    console.log('Registration response status:', response.status);
    const data = await response.json();
    console.log('Registration response data:', data);
    
    if (data.success && data.user) {
      // Store user in session storage
      sessionStorage.setItem('user', JSON.stringify(data.user));
      sessionStorage.setItem('isAuthenticated', 'true');
      
      return {
        success: true,
        user: data.user,
        message: data.message || 'Registration successful'
      };
    }
    
    // Handle specific error cases
    const errorMessage = data.error || 'Registration failed';
    
    // Log the specific error for debugging
    console.error('Registration error from server:', errorMessage);
    
    return {
      success: false,
      error: errorMessage
    };
  } catch (error) {
    console.error('Registration client error:', error);
    const errorMessage = 
      error instanceof Error 
        ? `Registration failed: ${error.message}` 
        : 'Registration service is currently unavailable';
    
    return {
      success: false,
      error: errorMessage
    };
  }
};

// Login a user
export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await fetch(getApiUrl('auth/login'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
    
    if (data.success && data.user) {
      // Store user in session storage
      sessionStorage.setItem('user', JSON.stringify(data.user));
      sessionStorage.setItem('isAuthenticated', 'true');
      
      // Store user's projects if available
      if (data.projects) {
        sessionStorage.setItem('userProjects', JSON.stringify(data.projects));
      }
      
      return {
        success: true,
        user: data.user,
        message: data.message || 'Login successful'
      };
    }
    
    return {
      success: false,
      error: data.error || 'Login failed'
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: 'Login service is currently unavailable'
    };
  }
};

// Log out a user
export const logoutUser = (): void => {
  // Clear all authentication data
  sessionStorage.removeItem('user');
  sessionStorage.removeItem('isAuthenticated');
  sessionStorage.removeItem('userProjects');
  localStorage.removeItem('projectId');
  sessionStorage.removeItem('lastProjectId');
  sessionStorage.removeItem('developerName');
  
  // Clear admin password
  localStorage.removeItem('adminPassword');
  
  // Clear all storage to be safe
  localStorage.clear();
  sessionStorage.clear();
  
  // In a real implementation, you might want to call an API endpoint to invalidate sessions
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return sessionStorage.getItem('isAuthenticated') === 'true';
};

// Get the current user
export const getCurrentUser = (): UserData | null => {
  const userStr = sessionStorage.getItem('user');
  
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr) as UserData;
  } catch (e) {
    console.error('Error parsing user data:', e);
    return null;
  }
}; 