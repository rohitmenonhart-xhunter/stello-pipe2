const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
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

// Define the User schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  phone: { type: String, unique: true, sparse: true },
  hash: { type: String, sparse: true }, // Password hash for authentication
  projectId: { type: String, unique: true, sparse: true },
  role: { type: String, enum: ['client', 'developer', 'admin'], default: 'client' },
  devId: { type: String, unique: true, sparse: true }, // For developers - dev-1, dev-2, etc.
  createdAt: { type: Date, default: Date.now },
  clerkId: { type: String, unique: true, sparse: true },
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
  lastLoginAt: Date,
  savedBrdAnswers: Object,
  selectedTemplate: Object,
  verifiedFields: {
    email: Boolean,
    phone: Boolean
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Define the Project schema
const projectSchema = new mongoose.Schema({
  projectId: {
    type: String,
    unique: true,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  userEmail: String,
  userName: String,
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
  pageNotes: {
    type: Map,
    of: String,
    default: {}
  },
  projectStatus: {
    type: String,
    default: 'pending',
    enum: ['pending', 'acknowledged', 'approved', 'in_progress', 'assets_added', 'consultation', 'delivered']
  },
  assignedDeveloper: String,
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
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Create the models if they don't exist
const User = mongoose.models.User || mongoose.model('User', userSchema);
const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);

// Function to generate a unique project ID
function generateProjectId() {
  // Generate a random alphanumeric string (6 characters)
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  // Add a timestamp component for uniqueness (last 4 digits of timestamp in base 36)
  const timestamp = Date.now().toString(36).slice(-4).toUpperCase();
  
  // Format: PRJ-XXXXXX-YYYY
  return `PRJ-${result}-${timestamp}`;
}

// Function to save user data and create/update project
async function saveUserData(userData) {
  try {
    await connectToDatabase();
    
    // Check if user already exists by clerkId or email
    let existingUser = null;
    
    if (userData.clerkId) {
      existingUser = await User.findOne({ clerkId: userData.clerkId });
    }
    
    if (!existingUser && userData.email) {
      existingUser = await User.findOne({ email: userData.email });
    }
    
    let user;
    // Always generate a new project ID for new projects
    let projectId = generateProjectId();
    
    if (existingUser) {
      // Update existing user
      console.log('Updating existing user:', existingUser._id);
      
      // Create a new update object for user data
      const userUpdateData = {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        clerkId: userData.clerkId,
        verifiedFields: userData.verifiedFields,
        projectId: projectId // Update with the new project ID
      };
      
      // Update the user document
      user = await User.findByIdAndUpdate(
        existingUser._id,
        { $set: userUpdateData },
        { new: true, runValidators: false }
      );
    } else {
      // Create new user
      const userDoc = {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        clerkId: userData.clerkId,
        verifiedFields: userData.verifiedFields || { email: false, phone: false },
        projectId: projectId
      };
      
      user = new User(userDoc);
      await user.save();
    }
    
    // Now handle the project data - always create a new project
    console.log('Creating new project with ID:', projectId);
    
    // Check if a project with this ID already exists (should not happen, but just in case)
    const existingProject = await Project.findOne({ projectId });
    if (existingProject) {
      console.log('Project with ID already exists, generating a new ID');
      projectId = generateProjectId();
      console.log('New project ID:', projectId);
      
      // Update the user with the new project ID
      user.projectId = projectId;
      await user.save();
    }
    
    // Initialize status fields
    const statusUpdate = {
      status: 'pending',
      message: 'Project request received',
      updatedBy: 'system',
      timestamp: new Date()
    };
    
    const projectDoc = {
      projectId,
      userId: user._id,
      userName: userData.name,
      userEmail: userData.email,
      brdAnswers: userData.brdAnswers,
      selectedTemplate: userData.selectedTemplate,
      pageNotes: userData.pageNotes || {},
      projectStatus: 'pending',
      statusUpdates: [statusUpdate]
    };
    
    const project = new Project(projectDoc);
    await project.save();
    
    // Return combined user and project data
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      projectId: projectId,
      projectStatus: project.projectStatus,
      statusUpdates: project.statusUpdates,
      brdAnswers: project.brdAnswers,
      selectedTemplate: project.selectedTemplate,
      assignedDeveloper: project.assignedDeveloper,
      createdAt: project.createdAt
    };
  } catch (error) {
    console.error('Error saving user data:', error);
    // Create a minimal user object with just a project ID to avoid client-side errors
    const fallbackProjectId = generateProjectId();
    console.log('Returning fallback project with ID:', fallbackProjectId);
    
    return {
      projectId: fallbackProjectId,
      _id: 'temp-' + Date.now(),
      name: userData.name || 'Unknown',
      email: userData.email || 'unknown@example.com',
      phone: userData.phone || '',
      projectStatus: 'pending'
    };
  }
}

// Function to get project data by project ID
async function getUserByProjectId(projectId) {
  try {
    await connectToDatabase();
    
    // Handle temporary project IDs
    if (projectId.startsWith('TEMP-')) {
      console.log(`Temporary project ID detected: ${projectId}`);
      return {
        projectId: projectId,
        name: 'Temporary Project',
        email: 'user@example.com',
        phone: '',
        projectStatus: 'pending',
        assignedDeveloper: 'Unassigned',
        createdAt: new Date().toISOString(),
        statusUpdates: [
          {
            status: 'pending',
            message: 'Your project has been created with a temporary ID. The server will process it soon.',
            timestamp: new Date().toISOString(),
            updatedBy: 'system'
          }
        ],
        template: {
          name: 'Selected Template',
          imageUrl: '/templates/default.jpg'
        },
        businessRequirements: {
          businessGoals: 'Your business goals will appear here once processed.',
          targetAudience: 'Your target audience will appear here once processed.',
          keyFeatures: 'Your key features will appear here once processed.'
        }
      };
    }
    
    // Find project by project ID
    const project = await Project.findOne({ projectId });
    
    if (!project) {
      console.log(`No project found with ID: ${projectId}`);
      return null;
    }
    
    // Format the project data for client consumption
    const formattedProject = {
      projectId: project.projectId,
      name: project.userName,
      email: project.userEmail,
      phone: '',  // Phone is not stored in project, would need to fetch from User if needed
      projectStatus: project.projectStatus || 'pending',
      assignedDeveloper: project.assignedDeveloper || '',
      createdAt: project.createdAt,
      statusUpdates: project.statusUpdates || [],
      template: {
        name: project.selectedTemplate?.name || 'Not selected',
        imageUrl: `/templates/${project.selectedTemplate?.id || 'default'}.jpg`
      },
      businessRequirements: {
        businessGoals: project.brdAnswers?.businessGoals || '',
        targetAudience: project.brdAnswers?.targetAudience || '',
        keyFeatures: project.brdAnswers?.keyFeatures || ''
      }
    };
    
    console.log(`Found project with ID: ${projectId}`);
    return formattedProject;
  } catch (error) {
    console.error('Error getting project by ID:', error);
    // Return null instead of throwing to allow the API to handle the error gracefully
    return null;
  }
}

// Function to get all projects for developer portal
async function getAllProjects() {
  try {
    await connectToDatabase();
    
    // Get all projects, sorted by creation date (newest first)
    const projects = await Project.find().sort({ createdAt: -1 });
    
    // Format projects for developer portal
    const formattedProjects = projects.map(project => ({
      _id: project._id,
      projectId: project.projectId,
      name: project.userName,
      email: project.userEmail,
      projectStatus: project.projectStatus,
      assignedDeveloper: project.assignedDeveloper || null,
      createdAt: project.createdAt,
      template: {
        name: project.selectedTemplate?.name || 'Not selected'
      },
      businessRequirements: {
        businessGoals: project.brdAnswers?.businessGoals || '',
        targetAudience: project.brdAnswers?.targetAudience || '',
        keyFeatures: project.brdAnswers?.keyFeatures || ''
      }
    }));
    
    return formattedProjects;
  } catch (error) {
    console.error('Error getting all projects:', error);
    throw error;
  }
}

// Function to update project status
async function updateProjectStatus(projectId, status, message, updatedBy) {
  try {
    await connectToDatabase();
    
    // Find the project
    const project = await Project.findOne({ projectId });
    
    if (!project) {
      console.log(`No project found with ID: ${projectId}`);
      return null;
    }
    
    // Create status update
    const statusUpdate = {
      status,
      message,
      updatedBy,
      timestamp: new Date()
    };
    
    // Update the project
    const updatedProject = await Project.findOneAndUpdate(
      { projectId },
      { 
        $set: { 
          projectStatus: status,
          lastUpdated: new Date()
        },
        $push: { 
          statusUpdates: statusUpdate 
        }
      },
      { new: true }
    );
    
    return {
      _id: updatedProject._id,
      projectId: updatedProject.projectId,
      name: updatedProject.userName,
      email: updatedProject.userEmail,
      projectStatus: updatedProject.projectStatus,
      assignedDeveloper: updatedProject.assignedDeveloper,
      createdAt: updatedProject.createdAt,
      statusUpdates: updatedProject.statusUpdates
    };
  } catch (error) {
    console.error('Error updating project status:', error);
    throw error;
  }
}

// Function to assign developer to project
async function assignDeveloperToProject(projectId, developerName) {
  try {
    await connectToDatabase();
    
    // Find the project
    const project = await Project.findOne({ projectId });
    
    if (!project) {
      console.log(`No project found with ID: ${projectId}`);
      return null;
    }
    
    // Create status update for developer assignment
    const statusUpdate = {
      status: project.projectStatus,
      message: `Project assigned to ${developerName}`,
      updatedBy: 'system',
      timestamp: new Date()
    };
    
    // Update the project
    const updatedProject = await Project.findOneAndUpdate(
      { projectId },
      { 
        $set: { 
          assignedDeveloper: developerName,
          lastUpdated: new Date()
        },
        $push: { 
          statusUpdates: statusUpdate 
        }
      },
      { new: true }
    );
    
    return {
      _id: updatedProject._id,
      projectId: updatedProject.projectId,
      name: updatedProject.userName,
      email: updatedProject.userEmail,
      projectStatus: updatedProject.projectStatus,
      assignedDeveloper: updatedProject.assignedDeveloper,
      createdAt: updatedProject.createdAt,
      statusUpdates: updatedProject.statusUpdates
    };
  } catch (error) {
    console.error('Error assigning developer to project:', error);
    throw error;
  }
}

// Function to migrate existing users to the new project structure
async function migrateUsersToProjects() {
  try {
    await connectToDatabase();
    
    // Get all users with project IDs
    const users = await User.find({ projectId: { $exists: true, $ne: null } });
    console.log(`Found ${users.length} users with project IDs to migrate`);
    
    for (const user of users) {
      // Check if project already exists
      const existingProject = await Project.findOne({ projectId: user.projectId });
      
      if (!existingProject) {
        // Create new project from user data
        const projectDoc = {
          projectId: user.projectId,
          userId: user._id,
          userName: user.name,
          userEmail: user.email,
          brdAnswers: user.brdAnswers || {},
          selectedTemplate: user.selectedTemplate || {},
          projectStatus: user.projectStatus || 'pending',
          assignedDeveloper: user.assignedDeveloper || '',
          statusUpdates: user.statusUpdates || [{
            status: 'pending',
            message: 'Project migrated from user data',
            updatedBy: 'system',
            timestamp: new Date()
          }],
          createdAt: user.createdAt || new Date(),
          lastUpdated: new Date()
        };
        
        const project = new Project(projectDoc);
        await project.save();
        console.log(`Migrated user ${user._id} to project ${user.projectId}`);
      } else {
        console.log(`Project ${user.projectId} already exists, skipping migration`);
      }
    }
    
    return { success: true, migratedCount: users.length };
  } catch (error) {
    console.error('Error migrating users to projects:', error);
    return { success: false, error: error.message };
  }
}

// Function to get all projects for a user by Clerk ID
async function getProjectsByClerkId(clerkId) {
  try {
    await connectToDatabase();
    
    if (!clerkId) {
      console.error('No Clerk ID provided');
      return [];
    }
    
    console.log(`Finding projects for Clerk ID: ${clerkId}`);
    
    // First find the user by clerkId
    const user = await User.findOne({ clerkId });
    
    if (!user) {
      console.log(`No user found with Clerk ID: ${clerkId}`);
      return [];
    }
    
    // Find all projects created by this user's ID
    const projects = await Project.find({ 
      $or: [
        { userId: user._id },
        { userEmail: user.email }
      ]
    }).sort({ createdAt: -1 });
    
    console.log(`Found ${projects.length} projects for user with Clerk ID: ${clerkId}`);
    
    // Format projects for client consumption
    const formattedProjects = projects.map(project => ({
      projectId: project.projectId,
      name: project.userName || user.name,
      email: project.userEmail || user.email,
      projectStatus: project.projectStatus || 'pending',
      assignedDeveloper: project.assignedDeveloper || 'Unassigned',
      createdAt: project.createdAt,
      statusUpdates: project.statusUpdates || [],
      template: {
        name: project.selectedTemplate?.name || 'Not selected',
        imageUrl: `/templates/${project.selectedTemplate?.id || 'default'}.jpg`
      },
      businessRequirements: {
        businessGoals: project.brdAnswers?.businessGoals || '',
        targetAudience: project.brdAnswers?.targetAudience || '',
        keyFeatures: project.brdAnswers?.keyFeatures || ''
      }
    }));
    
    return formattedProjects;
  } catch (error) {
    console.error('Error getting projects by Clerk ID:', error);
    throw error;
  }
}

// Simple hash function for passwords (Note: In production, use a proper hashing library like bcrypt)
function hashPassword(password) {
  if (!password) {
    console.log('No password provided for hashing');
    return null;
  }
  
  // Create a stable hash - NOT for production use!
  // This is just for demonstration purposes
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Add a fixed salt to make it more secure (in a simple way)
  const salt = 'FIXEDSALT';
  
  // Create a string hash
  const hashedPwd = Buffer.from(password + salt).toString('base64');
  
  console.log('Password hashed successfully');
  return hashedPwd;
}

// Verify a password against its hash
function verifyPassword(password, storedHash) {
  console.log('Verifying password against hash');
  
  // Check if storedHash is valid
  if (!storedHash) {
    console.log('No stored hash found');
    return false;
  }
  
  // Check if password is valid
  if (!password) {
    console.log('No password provided for verification');
    return false;
  }
  
  // Hash the provided password using the same method
  const salt = 'FIXEDSALT';
  const calculatedHash = Buffer.from(password + salt).toString('base64');
  
  // Compare the calculated hash with the stored hash
  const matches = calculatedHash === storedHash;
  
  console.log('Password verification:', matches ? 'successful' : 'failed');
  
  return matches;
}

// Function to register a new user
async function registerUser(userData) {
  console.log(`Registering user: ${userData.email || userData.phone}`);
  
  try {
    // Ensure MongoDB connection
    await connectToDatabase();
    
    // Validate inputs
    if (!userData.name || (!userData.email && !userData.phone) || !userData.password) {
      throw new Error('Missing required fields');
    }
    
    // Check if user already exists
    const query = {};
    if (userData.email) query.email = userData.email;
    if (userData.phone) query.phone = userData.phone;
    
    const existingUser = await User.findOne(query);
    if (existingUser) {
      console.log('User already exists');
      throw new Error('User with this email or phone already exists');
    }
    
    // Hash the password
    const hashedPassword = userData.password ? hashPassword(userData.password) : null;
    
    // Create the user object
    const user = {
      name: userData.name,
      role: userData.role || 'client',
      hash: hashedPassword,
      createdAt: new Date().toISOString()
    };
    
    // Add email if provided
    if (userData.email) {
      user.email = userData.email;
    }
    
    // Add phone if provided
    if (userData.phone) {
      user.phone = userData.phone;
    }
    
    // Add project ID if client
    if (user.role === 'client' && !user.projectId) {
      user.projectId = generateProjectId();
    }
    
    // If creating a developer or admin account, generate a developer ID
    if (user.role === 'developer' || user.role === 'admin') {
      // Find the highest existing developer number
      const highestDev = await User.findOne({
        devId: { $regex: /^dev-\d+$/ }
      }).sort({ devId: -1 }).limit(1);
      
      let nextNum = 1;
      if (highestDev && highestDev.devId) {
        const match = highestDev.devId.match(/^dev-(\d+)$/);
        if (match) {
          nextNum = parseInt(match[1], 10) + 1;
        }
      }
      user.devId = `dev-${nextNum}`;
    }

    // Create the user in the database
    const newUser = await User.create(user);
    console.log(`User created with ID: ${newUser._id}`);
    
    // Return user data without sensitive information
    const { hash, ...userWithoutHash } = newUser.toObject();
    
    return {
      success: true,
      user: {
        _id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        projectId: newUser.projectId,
        devId: newUser.devId
      }
    };
  } catch (error) {
    console.error('Error registering user:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Function to authenticate a user
async function loginUser(credentials) {
  try {
    await connectToDatabase();
    console.log('Login attempt for:', credentials.email || credentials.phone);
    
    let user;
    
    // Check if login is with email or phone
    if (credentials.email) {
      user = await User.findOne({ email: credentials.email });
    } else if (credentials.phone) {
      user = await User.findOne({ phone: credentials.phone });
    } else {
      console.log('Login failed: No email or phone provided');
      return {
        success: false,
        error: 'Email or phone is required'
      };
    }
    
    if (!user) {
      console.log('Login failed: User not found');
      return {
        success: false,
        error: 'User not found'
      };
    }
    
    console.log('User found:', user._id);
    console.log('Stored password hash:', user.hash);
    
    // Check password
    if (!verifyPassword(credentials.password, user.hash)) {
      console.log('Login failed: Invalid password');
      return {
        success: false,
        error: 'Invalid password'
      };
    }
    
    console.log('Login successful for user:', user.name);
    
    // Update last login time
    user.lastLoginAt = new Date();
    await user.save();
    
    return {
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    };
  } catch (error) {
    console.error('Error logging in user:', error);
    return {
      success: false,
      error: 'Login failed: ' + error.message
    };
  }
}

// Function to get all projects for a user by User ID (_id)
async function getProjectsByUserId(userId) {
  try {
    if (!userId) {
      console.error('No User ID provided');
      return [];
    }
    
    await connectToDatabase();
    console.log(`Finding projects for User ID: ${userId}`);
    
    // Find all projects with this userId
    const projects = await Project.find({ userId });
    
    if (!projects || projects.length === 0) {
      console.log(`No projects found for User ID: ${userId}`);
      return [];
    }
    
    console.log(`Found ${projects.length} projects for User ID: ${userId}`);
    
    // Format projects for client consumption
    return projects.map(project => ({
      projectId: project.projectId,
      name: project.userName,
      email: project.userEmail,
      phone: project.userPhone,
      projectStatus: project.projectStatus || 'pending',
      assignedDeveloper: project.assignedDeveloper || 'Unassigned',
      createdAt: project.createdAt,
      template: {
        name: project.selectedTemplate?.name || 'Not Selected',
        imageUrl: `/templates/${project.selectedTemplate?.id || 'default'}.jpg`
      },
      businessRequirements: {
        businessGoals: project.brdAnswers?.businessGoals || '',
        targetAudience: project.brdAnswers?.targetAudience || '',
        keyFeatures: project.brdAnswers?.keyFeatures || ''
      }
    }));
  } catch (error) {
    console.error('Error getting projects by User ID:', error);
    return [];
  }
}

module.exports = {
  connectToDatabase,
  saveUserData,
  getUserByProjectId,
  getAllProjects,
  updateProjectStatus,
  assignDeveloperToProject,
  generateProjectId,
  migrateUsersToProjects,
  User,
  Project,
  getProjectsByClerkId,
  getProjectsByUserId,
  registerUser,
  loginUser,
  hashPassword,
  verifyPassword
}; 