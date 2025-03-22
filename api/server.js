const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const { ObjectId } = require('mongodb');

// Create a log file
const logFile = fs.createWriteStream('api/server.log', { flags: 'a' });

// Custom logging function
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  logFile.write(logMessage);
  console.log(message);
}

log('Starting server...');

try {
  // Load environment variables first
  dotenv.config({ path: path.resolve(process.cwd(), '.env') });
  log('Environment variables loaded');
  
  log('MongoDB URI: ' + (process.env.MONGODB_URI ? 'Defined' : 'Not defined'));
  
  const { 
    connectToDatabase, 
    saveUserData, 
    getUserByProjectId, 
    generateProjectId,
    User,
    Project,
    migrateUsersToProjects,
    getProjectsByClerkId,
    getProjectsByUserId,
    registerUser,
    loginUser,
    hashPassword
  } = require('../src/services/mongodb.js');
  
  log('MongoDB module loaded successfully');

  // Create Express app
  const app = express();
  const PORT = process.env.PORT || 8080;

  // Middleware
  app.use(cors());
  app.use(express.json());
  log('Middleware configured');

  // Add a health check endpoint for Render
  app.get('/health', (req, res) => {
    log('Health check endpoint called');
    res.status(200).json({ status: 'ok' });
  });

  // Connect to MongoDB
  connectToDatabase()
    .then(() => log('Connected to MongoDB'))
    .catch(err => {
      log('Failed to connect to MongoDB: ' + err.message);
      fs.writeFileSync('api/mongodb-error.log', JSON.stringify(err, null, 2));
    });

  // API Routes
  app.use('/api', (req, res, next) => {
    log(`API Request: ${req.method} ${req.path}`);
    next();
  });

  // Save user data endpoint
  app.post('/api/save-user-data', async (req, res) => {
    try {
      const userData = req.body;
      log('Received user data: ' + JSON.stringify(userData));

      // Validate the user data - only name and email are required
      if (!userData.name || !userData.email) {
        log('Missing required fields: name and email are required');
        return res.status(400).json({ error: 'Missing required fields: name and email are required' });
      }

      // Save the user data to the database
      log('Calling saveUserData function...');
      const savedUser = await saveUserData(userData);
      log('saveUserData function returned with project ID: ' + savedUser.projectId);
      
      // Ensure project ID exists
      if (!savedUser.projectId) {
        log('No project ID generated - generating one now');
        savedUser.projectId = generateProjectId();
        try {
          await User.findByIdAndUpdate(savedUser._id, { projectId: savedUser.projectId });
          log('Updated user with new project ID: ' + savedUser.projectId);
        } catch (updateError) {
          log('Error updating user with project ID: ' + updateError.message);
          // Continue even if update fails - we'll still return the generated ID
        }
      }
      
      log('User data saved successfully with project ID: ' + savedUser.projectId);

      // Return the saved user data with project ID
      return res.status(200).json({ 
        success: true, 
        user: {
          name: savedUser.name,
          email: savedUser.email,
          phone: savedUser.phone
        },
        projectId: savedUser.projectId,
        message: 'Your information has been saved successfully! Your project ID is: ' + savedUser.projectId
      });
    } catch (error) {
      log('Error saving user data: ' + error.message);
      fs.writeFileSync('api/save-error.log', JSON.stringify(error, null, 2));
      
      // Since our saveUserData function now handles existing users,
      // this duplicate key error handling is a fallback
      if (error.code === 11000) {
        log('Duplicate key error - attempting to update existing record');
        try {
          // Try to update the existing record
          const key = Object.keys(error.keyValue)[0];
          const value = error.keyValue[key];
          
          // Find the existing user and update
          const existingUser = await User.findOne({ [key]: value });
          if (existingUser) {
            // Update the existing user with new data
            Object.assign(existingUser, req.body);
            
            // Ensure project ID exists
            if (!existingUser.projectId) {
              existingUser.projectId = generateProjectId();
              log('Generated new project ID for existing user: ' + existingUser.projectId);
            }
            
            await existingUser.save();
            
            log('Existing user updated successfully with project ID: ' + existingUser.projectId);
            return res.status(200).json({ 
              success: true, 
              user: {
                name: existingUser.name,
                email: existingUser.email,
                phone: existingUser.phone
              },
              projectId: existingUser.projectId,
              message: 'Your information has been updated successfully! Your project ID is: ' + existingUser.projectId
            });
          }
        } catch (updateError) {
          log('Error updating existing user: ' + updateError.message);
        }
      }
      
      // If we reach here, we couldn't save or update the user
      // Generate a temporary project ID to avoid client-side errors
      const tempProjectId = generateProjectId();
      log('Returning temporary project ID due to error: ' + tempProjectId);
      
      return res.status(200).json({ 
        success: false, 
        warning: 'There was an issue saving your data, but you can still use this temporary project ID',
        projectId: tempProjectId,
        message: 'Your information has been processed. Your temporary project ID is: ' + tempProjectId
      });
    }
  });

  // Client dashboard endpoint - Get project status by project ID
  app.get('/api/project/:projectId', async (req, res) => {
    try {
      const { projectId } = req.params;
      log(`Getting project status for project ID: ${projectId}`);
      
      if (!projectId) {
        return res.status(400).json({ error: 'Project ID is required' });
      }
      
      // Handle temporary project IDs
      if (projectId.startsWith('TEMP-')) {
        log(`Temporary project ID detected: ${projectId}`);
        return res.status(200).json({
          success: true,
          project: {
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
          }
        });
      }
      
      const project = await getUserByProjectId(projectId);
      
      if (!project) {
        log(`Project not found with ID: ${projectId}`);
        return res.status(404).json({ 
          error: 'Project not found',
          message: 'No project found with the provided ID. Please check the ID and try again.'
        });
      }
      
      log(`Project found with ID: ${projectId}, status: ${project.projectStatus}`);
      
      // Return project details for client dashboard
      return res.status(200).json({
        success: true,
        project
      });
    } catch (error) {
      log(`Error getting project status: ${error.message}`);
      return res.status(500).json({ 
        error: 'Failed to get project status',
        message: 'There was a problem retrieving the project. Please try again later.'
      });
    }
  });

  // Get all projects (for developer portal)
  app.get('/api/projects', async (req, res) => {
    console.log('GET /api/projects - Fetching all projects');
    
    try {
      await connectToDatabase();
      
      // Find all projects, sort by creation date (newest first)
      const projects = await Project.find({}).sort({ createdAt: -1 });
      
      console.log(`Found ${projects.length} projects`);
      
      res.json({ 
        success: true, 
        projects: projects.map(project => ({
          _id: project._id.toString(),
          projectId: project.projectId,
          name: project.userName || 'Unknown',
          email: project.userEmail || 'No email',
          projectStatus: project.projectStatus || 'pending',
          assignedDeveloper: project.assignedDeveloper || null,
          createdAt: project.createdAt,
          statusUpdates: project.statusUpdates || [],
          template: {
            id: project.selectedTemplate?.id || 'default',
            name: project.selectedTemplate?.name || 'Unknown Template',
            framework: project.selectedTemplate?.framework || '',
            description: project.selectedTemplate?.description || '',
            // Include other template properties as needed
          },
          businessRequirements: {
            businessGoals: project.brdAnswers?.businessGoals || 'Not specified',
            targetAudience: project.brdAnswers?.targetAudience || 'Not specified',
            keyFeatures: project.brdAnswers?.keyFeatures || 'Not specified',
            contentTypes: project.brdAnswers?.contentTypes || 'Not specified',
            designPreferences: project.brdAnswers?.designPreferences || 'Not specified',
            technicalRequirements: project.brdAnswers?.technicalRequirements || 'Not specified',
            timeline: project.brdAnswers?.timeline || 'Not specified',
            budget: project.brdAnswers?.budget || 'Not specified'
          },
          pageNotes: project.pageNotes || {}
        }))
      });
    } catch (error) {
      console.error('Error fetching projects:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch projects', 
        message: error.message 
      });
    }
  });

  // Get project by ID
  app.get('/api/projects/:projectId', async (req, res) => {
    const { projectId } = req.params;
    console.log(`GET /api/projects/${projectId} - Fetching project`);
    
    try {
      await connectToDatabase();
      
      // Find the project by projectId
      const project = await Project.findOne({ projectId });
      
      if (!project) {
        console.log(`Project with ID ${projectId} not found`);
        return res.status(404).json({ 
          success: false, 
          error: 'Project not found' 
        });
      }
      
      console.log(`Found project: ${project.projectId}`);
      
      res.json({ 
        success: true, 
        project: {
          projectId: project.projectId,
          name: project.userName,
          email: project.userEmail,
          phone: project.userPhone,
          projectStatus: project.projectStatus,
          assignedDeveloper: project.assignedDeveloper,
          createdAt: project.createdAt,
          lastUpdated: project.lastUpdated,
          statusUpdates: project.statusUpdates || [],
          template: project.selectedTemplate,
          brdAnswers: project.brdAnswers,
          pageNotes: project.pageNotes || {}
        }
      });
    } catch (error) {
      console.error(`Error fetching project ${projectId}:`, error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch project', 
        message: error.message 
      });
    }
  });

  // Assign developer to project
  app.post('/api/projects/:projectId/assign', async (req, res) => {
    const { projectId } = req.params;
    const { developerName } = req.body;
    
    console.log(`POST /api/projects/${projectId}/assign - Assigning developer: ${developerName}`);
    
    if (!developerName) {
      return res.status(400).json({ 
        success: false, 
        error: 'Developer name is required' 
      });
    }
    
    try {
      await connectToDatabase();
      
      // Find the project by projectId
      const project = await Project.findOne({ projectId });
      
      if (!project) {
        console.log(`Project with ID ${projectId} not found`);
        return res.status(404).json({ 
          success: false, 
          error: 'Project not found' 
        });
      }
      
      // Update the project with the assigned developer
      project.assignedDeveloper = developerName;
      
      // If the project is in pending status, update it to acknowledged
      if (project.projectStatus === 'pending') {
        project.projectStatus = 'acknowledged';
        
        // Add a status update
        project.statusUpdates = project.statusUpdates || [];
        project.statusUpdates.push({
          status: 'acknowledged',
          message: `Project assigned to ${developerName}`,
          updatedBy: developerName,
          timestamp: new Date().toISOString()
        });
      }
      
      project.lastUpdated = new Date().toISOString();
      await project.save();
      
      console.log(`Project ${projectId} assigned to ${developerName}`);
      
      res.json({ 
        success: true, 
        message: `Project assigned to ${developerName}`,
        project: {
          projectId: project.projectId,
          projectStatus: project.projectStatus,
          assignedDeveloper: project.assignedDeveloper,
          statusUpdates: project.statusUpdates
        }
      });
    } catch (error) {
      console.error(`Error assigning developer to project ${projectId}:`, error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to assign developer', 
        message: error.message 
      });
    }
  });

  // Update project status
  app.post('/api/projects/:projectId/status', async (req, res) => {
    const { projectId } = req.params;
    const { status, message, updatedBy } = req.body;
    
    console.log(`POST /api/projects/${projectId}/status - Updating status: ${status}`);
    
    if (!status || !message || !updatedBy) {
      return res.status(400).json({ 
        success: false, 
        error: 'Status, message, and updatedBy are required' 
      });
    }
    
    try {
      await connectToDatabase();
      
      // Find the project by projectId
      const project = await Project.findOne({ projectId });
      
      if (!project) {
        console.log(`Project with ID ${projectId} not found`);
        return res.status(404).json({ 
          success: false, 
          error: 'Project not found' 
        });
      }
      
      // Update the project status
      project.projectStatus = status;
      
      // Add a status update
      project.statusUpdates = project.statusUpdates || [];
      project.statusUpdates.push({
        status,
        message,
        updatedBy,
        timestamp: new Date().toISOString()
      });
      
      project.lastUpdated = new Date().toISOString();
      await project.save();
      
      console.log(`Project ${projectId} status updated to ${status}`);
      
      res.json({ 
        success: true, 
        message: `Project status updated to ${status}`,
        project: {
          projectId: project.projectId,
          projectStatus: project.projectStatus,
          statusUpdates: project.statusUpdates
        }
      });
    } catch (error) {
      console.error(`Error updating project ${projectId} status:`, error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to update project status', 
        message: error.message 
      });
    }
  });

  // Migrate users to projects
  app.post('/api/migrate-projects', async (req, res) => {
    console.log('POST /api/migrate-projects - Starting migration');
    
    try {
      await connectToDatabase();
      
      const result = await migrateUsersToProjects();
      
      console.log(`Migration completed: ${result.migratedCount} users migrated`);
      
      res.json({ 
        success: true, 
        message: `Migration completed: ${result.migratedCount} users migrated`,
        migratedCount: result.migratedCount
      });
    } catch (error) {
      console.error('Error migrating users to projects:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to migrate users to projects', 
        message: error.message 
      });
    }
  });

  // Get user projects by Clerk ID
  app.get('/api/user/:clerkId/projects', async (req, res) => {
    const { clerkId } = req.params;
    log(`GET /api/user/${clerkId}/projects - Fetching projects for user`);
    
    try {
      const projects = await getProjectsByClerkId(clerkId);
      
      log(`Found ${projects.length} projects for Clerk ID: ${clerkId}`);
      
      res.json({ 
        success: true, 
        projects
      });
    } catch (error) {
      log(`Error fetching projects for Clerk ID ${clerkId}: ${error.message}`);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch user projects', 
        message: error.message 
      });
    }
  });

  // Get user projects by User ID (_id)
  app.get('/api/user/:userId/projects', async (req, res) => {
    const { userId } = req.params;
    log(`GET /api/user/${userId}/projects - Fetching projects for user by ID`);
    
    try {
      const projects = await getProjectsByUserId(userId);
      
      log(`Found ${projects.length} projects for User ID: ${userId}`);
      
      res.json({ 
        success: true, 
        projects
      });
    } catch (error) {
      log(`Error fetching projects for User ID ${userId}: ${error.message}`);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch user projects', 
        message: error.message 
      });
    }
  });

  // User registration endpoint
  app.post('/api/auth/register', async (req, res) => {
    try {
      log('Received registration request');
      const userData = req.body;
      
      // Debug log the request body
      log('Registration request body: ' + JSON.stringify(userData));
      
      // Validate required fields
      if (!userData.name || !userData.password || (!userData.email && !userData.phone)) {
        log('Missing required fields for registration');
        return res.status(400).json({ 
          success: false, 
          error: 'Name, password, and either email or phone are required' 
        });
      }
      
      // Register the user
      const result = await registerUser(userData);
      
      if (result.success) {
        log(`User registered successfully: ${result.user.name}`);
        return res.status(201).json({
          success: true,
          user: result.user,
          message: 'Registration successful'
        });
      } else {
        log(`Registration failed: ${result.error}`);
        return res.status(400).json({
          success: false,
          error: result.error
        });
      }
    } catch (error) {
      log(`Error during registration: ${error.message}`);
      return res.status(500).json({
        success: false,
        error: 'Registration failed due to server error'
      });
    }
  });

  // User login endpoint
  app.post('/api/auth/login', async (req, res) => {
    try {
      log('Received login request');
      const credentials = req.body;
      
      // Validate required fields
      if ((!credentials.email && !credentials.phone) || !credentials.password) {
        log('Missing required fields for login');
        return res.status(400).json({ 
          success: false, 
          error: 'Email/phone and password are required' 
        });
      }
      
      // Authenticate the user
      const result = await loginUser(credentials);
      
      if (result.success) {
        log(`User logged in successfully: ${result.user.name}`);
        
        // Get user's projects if available
        let userProjects = [];
        try {
          userProjects = await getProjectsByUserId(result.user._id);
        } catch (projectError) {
          log(`Error fetching user projects: ${projectError.message}`);
        }
        
        return res.status(200).json({
          success: true,
          user: result.user,
          projects: userProjects,
          message: 'Login successful'
        });
      } else {
        log(`Login failed: ${result.error}`);
        return res.status(401).json({
          success: false,
          error: result.error
        });
      }
    } catch (error) {
      log(`Error during login: ${error.message}`);
      return res.status(500).json({
        success: false,
        error: 'Login failed due to server error'
      });
    }
  });

  // Admin routes for managing developers
  app.get('/api/admin/developers', async (req, res) => {
    try {
      log('Received request to get all developers');
      
      // Verify admin authentication here
      // This would typically check for a valid admin session/token
      
      const developers = await User.find({ 
        role: { $in: ['developer', 'admin'] } 
      }).select('-password -hash').exec();
      
      log(`Found ${developers.length} developers`);
      
      res.json({ success: true, developers });
    } catch (error) {
      log(`Error getting developers: ${error.message}`);
      res.status(500).json({ success: false, error: 'Failed to fetch developers' });
    }
  });

  // Get developer by ID endpoint
  app.get('/api/admin/developers/:id', async (req, res) => {
    try {
      const developerId = req.params.id;
      log(`Received request to get developer: ${developerId}`);
      
      // Try to find the developer using either ObjectId or a custom ID field
      let developer;
      
      try {
        // First try using the ID as MongoDB ObjectId
        if (ObjectId.isValid(developerId)) {
          developer = await User.findById(developerId).select('-password -hash');
        }
      } catch (err) {
        log(`Error when trying to find by ObjectId: ${err.message}`);
      }
      
      // If ObjectId approach didn't work, try using a custom ID field
      if (!developer) {
        // Check if it's a dev-ID format or another custom ID
        if (developerId.startsWith('dev-')) {
          developer = await User.findOne({ devId: developerId }).select('-password -hash');
        } else {
          // Try looking up by email as a fallback
          developer = await User.findOne({ email: developerId }).select('-password -hash');
        }
      }
      
      if (!developer) {
        return res.status(404).json({ 
          success: false, 
          error: 'Developer not found' 
        });
      }
      
      log(`Found developer: ${developerId}`);
      
      res.json({ 
        success: true, 
        developer
      });
    } catch (error) {
      log(`Error getting developer: ${error.message}`);
      res.status(500).json({ success: false, error: 'Failed to fetch developer' });
    }
  });

  app.post('/api/admin/developers', async (req, res) => {
    try {
      log('Received request to create developer');
      const { name, email, password, role = 'developer' } = req.body;
      
      // Validate inputs
      if (!name || !email || !password) {
        return res.status(400).json({ 
          success: false, 
          error: 'Name, email, and password are required' 
        });
      }
      
      // Check if email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ 
          success: false, 
          error: 'Email already in use' 
        });
      }
      
      // Hash the password - hashPassword is synchronous, so don't use await
      const hashedPassword = hashPassword(password);
      
      // If creating a developer or admin account, generate a developer ID
      let devId;
      
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
      devId = `dev-${nextNum}`;
      
      // Create the developer account
      const developer = {
        name,
        email,
        hash: hashedPassword,
        role: role === 'admin' ? 'admin' : 'developer', // Ensure role is valid
        devId,
        createdAt: new Date().toISOString()
      };
      
      const result = await User.create(developer);
      log(`Created developer with ID: ${result._id} and devId: ${result.devId}`);
      
      // Return the created developer (without password)
      const { hash, ...developerWithoutPassword } = result.toObject();
      developerWithoutPassword._id = result._id;
      
      res.status(201).json({ 
        success: true, 
        developer: developerWithoutPassword,
        message: `Developer ${name} created successfully` 
      });
    } catch (error) {
      log(`Error creating developer: ${error.message}`);
      res.status(500).json({ success: false, error: 'Failed to create developer account' });
    }
  });

  app.put('/api/admin/developers/:id', async (req, res) => {
    try {
      log(`Received request to update developer: ${req.params.id}`);
      const { name, email, password, role } = req.body;
      const developerId = req.params.id;
      
      // Validate inputs
      if (!name || !email) {
        return res.status(400).json({ 
          success: false, 
          error: 'Name and email are required' 
        });
      }
      
      // Prepare update object
      const updateData = {
        name,
        email,
        role: role === 'admin' ? 'admin' : 'developer', // Ensure role is valid
      };
      
      // Only update password if provided
      if (password) {
        updateData.hash = hashPassword(password); // No await here either
      }
      
      // Try to find and update the developer using either ObjectId or a custom ID field
      let result;
      try {
        // First try using the ID as MongoDB ObjectId
        if (ObjectId.isValid(developerId)) {
          result = await User.findByIdAndUpdate(developerId, updateData, { new: true });
        }
      } catch (err) {
        log(`Error when trying to update by ObjectId: ${err.message}`);
      }
      
      // If ObjectId approach didn't work, try using a custom ID field
      if (!result) {
        // Check if it's a dev-ID format or another custom ID
        if (developerId.startsWith('dev-')) {
          result = await User.findOneAndUpdate({ devId: developerId }, updateData, { new: true });
        } else {
          // Try looking up by email as a fallback
          result = await User.findOneAndUpdate({ email: developerId }, updateData, { new: true });
        }
      }
      
      if (!result) {
        return res.status(404).json({ 
          success: false, 
          error: 'Developer not found' 
        });
      }
      
      log(`Updated developer: ${developerId}`);
      
      res.json({ 
        success: true, 
        message: `Developer updated successfully` 
      });
    } catch (error) {
      log(`Error updating developer: ${error.message}`);
      res.status(500).json({ success: false, error: 'Failed to update developer account' });
    }
  });

  app.delete('/api/admin/developers/:id', async (req, res) => {
    try {
      log(`Received request to delete developer: ${req.params.id}`);
      const developerId = req.params.id;
      
      // Try to find and delete the developer using either ObjectId or a custom ID field
      let result;
      
      try {
        // First try using the ID as MongoDB ObjectId
        if (ObjectId.isValid(developerId)) {
          result = await User.findByIdAndDelete(developerId);
        }
      } catch (err) {
        log(`Error when trying to delete by ObjectId: ${err.message}`);
      }
      
      // If ObjectId approach didn't work, try using a custom ID field
      if (!result) {
        // Check if it's a dev-ID format or another custom ID
        if (developerId.startsWith('dev-')) {
          result = await User.findOneAndDelete({ devId: developerId });
        } else {
          // Try looking up by email as a fallback
          result = await User.findOneAndDelete({ email: developerId });
        }
      }
      
      if (!result) {
        return res.status(404).json({ 
          success: false, 
          error: 'Developer not found' 
        });
      }
      
      log(`Deleted developer: ${developerId}`);
      
      res.json({ 
        success: true, 
        message: 'Developer deleted successfully' 
      });
    } catch (error) {
      log(`Error deleting developer: ${error.message}`);
      res.status(500).json({ success: false, error: 'Failed to delete developer account' });
    }
  });

  // Start the server
  app.listen(PORT, () => {
    log(`Server running on port ${PORT}`);
    // Output a message that's clearly visible in logs
    console.log('==============================');
    console.log(`🚀 SERVER READY ON PORT ${PORT}`);
    console.log('==============================');
  });
} catch (error) {
  log('Error starting server: ' + error.message);
  fs.writeFileSync('api/server-error.log', JSON.stringify(error, null, 2));
} 