import { BrdAnswers } from '../App';
import { getApiUrl } from '../config/api';

interface VerifiedFields {
  email: boolean;
  phone: boolean;
}

export interface Template {
  id: string;
  name: string;
  framework: string;
  description: string;
  [key: string]: any;
}

export const saveUserData = async (
  userData: { name: string; email: string; phone: string },
  brdAnswers: BrdAnswers,
  selectedTemplate: Template,
  clerkId?: string,
  verifiedFields?: VerifiedFields,
  pageNotes?: Record<string, string>
) => {
  try {
    console.log('Saving user data:', { userData, brdAnswers, selectedTemplate, clerkId, verifiedFields, pageNotes });
    
    // Prepare the data to send to the server
    const dataToSave = {
      ...userData,
      brdAnswers,
      selectedTemplate,
      clerkId,
      verifiedFields,
      pageNotes
    };
    
    // Make the API call
    const response = await fetch(getApiUrl('save-user-data'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSave),
    });
    
    // Check if the response is OK
    if (!response.ok) {
      console.error('Server returned error status:', response.status);
      
      // Try to parse the error message
      try {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server error: ${response.status}`);
      } catch (parseError) {
        console.error('Error parsing error response:', parseError);
        throw new Error(`Server error: ${response.status}`);
      }
    }
    
    // Parse the response
    const result = await response.json();
    console.log('Server response:', result);
    
    // Ensure we have a project ID
    if (!result.projectId) {
      console.error('No project ID returned from server');
      
      // Generate a temporary project ID
      const tempProjectId = `TEMP-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString(36).slice(-4).toUpperCase()}`;
      
      return {
        ...result,
        projectId: tempProjectId,
        warning: 'Server did not return a project ID, using a temporary ID instead'
      };
    }
    
    return result;
  } catch (error) {
    console.error('Error in saveUserData:', error);
    
    // Generate a temporary project ID
    const tempProjectId = `TEMP-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString(36).slice(-4).toUpperCase()}`;
    
    // Return an object with the temporary project ID and error message
    return {
      success: false,
      projectId: tempProjectId,
      warning: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}; 