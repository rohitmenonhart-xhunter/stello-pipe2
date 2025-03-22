import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const MONGODB_URI = import.meta.env.MONGODB_URI || process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
// Define the cached mongoose connection type
interface CachedConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Define the global type with mongoose property
declare global {
  // eslint-disable-next-line no-var
  var mongoose: CachedConnection | undefined;
}

let cached: CachedConnection = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
  cached = global.mongoose;
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// Define types for our data models
export interface UserBrdAnswers {
  businessGoals: string;
  targetAudience: string;
  keyFeatures: string;
  contentTypes: string;
  designPreferences: string;
  technicalRequirements: string;
  timeline: string;
  budget: string;
}

export interface SelectedTemplate {
  id: string;
  name: string;
  framework: string;
  description: string;
}

export interface StatusUpdate {
  status: string;
  message: string;
  timestamp: Date;
  updatedBy: string;
}

export type ProjectStatus = 
  | 'pending' 
  | 'acknowledged' 
  | 'approved' 
  | 'in_progress' 
  | 'adding_assets' 
  | 'consultation' 
  | 'delivered' 
  | 'completed';

export interface UserData {
  name: string;
  email: string;
  phone: string;
  clerkId?: string;
  projectId?: string;
  verifiedFields?: {
    email: boolean;
    phone: boolean;
  };
  brdAnswers: UserBrdAnswers;
  selectedTemplate: SelectedTemplate;
  projectStatus?: ProjectStatus;
  assignedDeveloper?: string;
  statusUpdates?: StatusUpdate[];
}

// Define the User schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  clerkId: String,
  projectId: {
    type: String,
    default: () => uuidv4(),
    unique: true
  },
  verifiedFields: {
    email: Boolean,
    phone: Boolean
  },
  brdAnswers: {
    businessGoals: String,
    targetAudience: String,
    keyFeatures: String,
    contentTypes: String,
    designPreferences: String,
    technicalRequirements: String,
    timeline: String,
    budget: String
  },
  selectedTemplate: {
    id: String,
    name: String,
    framework: String,
    description: String
  },
  projectStatus: {
    type: String,
    enum: ['pending', 'acknowledged', 'approved', 'in_progress', 'adding_assets', 'consultation', 'delivered', 'completed'],
    default: 'pending'
  },
  assignedDeveloper: {
    type: String,
    default: null
  },
  statusUpdates: [{
    status: String,
    message: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    updatedBy: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create the model if it doesn't exist
export const User = mongoose.models.User || mongoose.model('User', userSchema);

// Function to save user data
export async function saveUserData(userData: UserData) {
  try {
    await connectToDatabase();
    
    // Check if user already exists by clerkId or email
    let existingUser = null;
    
    if (userData.clerkId) {
      existingUser = await User.findOne({ clerkId: userData.clerkId }).exec();
    }
    
    if (!existingUser && userData.email) {
      existingUser = await User.findOne({ email: userData.email }).exec();
    }
    
    if (existingUser) {
      // Update existing user
      console.log('Updating existing user:', existingUser._id);
      
      // Create update data as a partial UserData
      const updateData: Partial<UserData> = {};
      
      // Add all fields from userData
      updateData.name = userData.name;
      updateData.phone = userData.phone;
      updateData.clerkId = userData.clerkId;
      updateData.verifiedFields = userData.verifiedFields;
      updateData.brdAnswers = userData.brdAnswers;
      updateData.selectedTemplate = userData.selectedTemplate;
      
      // Only update email if it's different
      if (existingUser.email !== userData.email) {
        updateData.email = userData.email;
      }
      
      // Update the document using findByIdAndUpdate to avoid validation issues
      const updatedUser = await User.findByIdAndUpdate(
        existingUser._id,
        { $set: updateData },
        { new: true, runValidators: false }
      ).exec();
      
      return updatedUser;
    } else {
      // Create new user
      const user = new User(userData);
      
      // Add initial status update
      user.statusUpdates = [{
        status: 'pending',
        message: 'Project request received',
        timestamp: new Date(),
        updatedBy: 'system'
      }];
      
      await user.save();
      return user;
    }
  } catch (error) {
    console.error('Error saving user data:', error);
    throw error;
  }
}

// Function to get user by project ID
export async function getUserByProjectId(projectId: string) {
  try {
    await connectToDatabase();
    return await User.findOne({ projectId }).exec();
  } catch (error) {
    console.error('Error getting user by project ID:', error);
    throw error;
  }
}

// Function to get all projects
export async function getAllProjects() {
  try {
    await connectToDatabase();
    return await User.find({}, {
      name: 1,
      email: 1,
      projectId: 1,
      projectStatus: 1,
      assignedDeveloper: 1,
      selectedTemplate: 1,
      createdAt: 1
    }).sort({ createdAt: -1 }).exec();
  } catch (error) {
    console.error('Error getting all projects:', error);
    throw error;
  }
}

// Function to update project status
export async function updateProjectStatus(
  projectId: string, 
  status: ProjectStatus, 
  message: string, 
  updatedBy: string
) {
  try {
    await connectToDatabase();
    
    const statusUpdate = {
      status,
      message,
      timestamp: new Date(),
      updatedBy
    };
    
    const updatedUser = await User.findOneAndUpdate(
      { projectId },
      { 
        $set: { projectStatus: status },
        $push: { statusUpdates: statusUpdate }
      },
      { new: true }
    ).exec();
    
    return updatedUser;
  } catch (error) {
    console.error('Error updating project status:', error);
    throw error;
  }
}

// Function to assign developer to project
export async function assignDeveloperToProject(projectId: string, developerName: string) {
  try {
    await connectToDatabase();
    
    const statusUpdate = {
      status: 'acknowledged',
      message: `Project assigned to ${developerName}`,
      timestamp: new Date(),
      updatedBy: developerName
    };
    
    const updatedUser = await User.findOneAndUpdate(
      { projectId },
      { 
        $set: { 
          assignedDeveloper: developerName,
          projectStatus: 'acknowledged'
        },
        $push: { statusUpdates: statusUpdate }
      },
      { new: true }
    ).exec();
    
    return updatedUser;
  } catch (error) {
    console.error('Error assigning developer to project:', error);
    throw error;
  }
} 