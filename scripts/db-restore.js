/**
 * Database Restore Script
 * 
 * This script will:
 * 1. Connect to MongoDB using the connection string from .env
 * 2. Import Users and Projects from JSON backup files
 * 
 * Usage:
 * node scripts/db-restore.js /path/to/backup/folder
 * 
 * Example:
 * node scripts/db-restore.js ./database-backups/backup-2023-05-10T15-30-00.000Z
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const readline = require('readline');

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Error: Please define the MONGODB_URI environment variable in .env file');
  process.exit(1);
}

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Define the User and Project schemas (same as in mongodb.js)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  phone: { type: String, unique: true, sparse: true },
  hash: { type: String, sparse: true },
  projectId: { type: String, unique: true, sparse: true },
  role: { type: String, enum: ['client', 'developer', 'admin'], default: 'client' },
  devId: { type: String, unique: true, sparse: true },
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
  userPhone: String,
  projectStatus: {
    type: String,
    enum: ['pending', 'acknowledged', 'approved', 'in_progress', 'assets_added', 'consultation', 'delivered'],
    default: 'pending'
  },
  assignedDeveloper: String,
  statusUpdates: [{
    status: String,
    message: String,
    updatedBy: String,
    timestamp: Date
  }],
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
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Restore the database
async function restoreDatabase(backupDir) {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully!');

    // Create models from schemas
    const User = mongoose.models.User || mongoose.model('User', userSchema);
    const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);

    // Check if the backup directory exists
    if (!fs.existsSync(backupDir)) {
      console.error(`Error: Backup directory does not exist: ${backupDir}`);
      process.exit(1);
    }

    // Check if the users and projects files exist
    const usersFile = path.join(backupDir, 'users.json');
    const projectsFile = path.join(backupDir, 'projects.json');

    if (!fs.existsSync(usersFile)) {
      console.error(`Error: Users backup file not found: ${usersFile}`);
      process.exit(1);
    }

    if (!fs.existsSync(projectsFile)) {
      console.error(`Error: Projects backup file not found: ${projectsFile}`);
      process.exit(1);
    }

    // Ask for confirmation
    console.log('\n⚠️  WARNING: You are about to restore the database from backup! ⚠️');
    console.log('This will OVERWRITE existing data with the same IDs.');
    console.log(`Backup directory: ${backupDir}`);
    
    const answer = await new Promise((resolve) => {
      rl.question('Type "RESTORE" to confirm you want to restore the database: ', (answer) => {
        resolve(answer);
      });
    });

    if (answer !== 'RESTORE') {
      console.log('Restore operation cancelled.');
      return;
    }

    // Read backup files
    console.log('Reading backup files...');
    const users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
    const projects = JSON.parse(fs.readFileSync(projectsFile, 'utf8'));

    console.log(`Found ${users.length} users and ${projects.length} projects in backup files.`);

    // Import users
    console.log('Importing Users...');
    let userSuccess = 0;
    let userErrors = 0;

    for (const user of users) {
      try {
        // Convert string _id back to ObjectId
        if (user._id && typeof user._id === 'string') {
          user._id = new mongoose.Types.ObjectId(user._id);
        }
        
        // Convert projects array items to ObjectIds
        if (user.projects && Array.isArray(user.projects)) {
          user.projects = user.projects.map(id => 
            typeof id === 'string' ? new mongoose.Types.ObjectId(id) : id
          );
        }
        
        await User.findByIdAndUpdate(
          user._id,
          { $set: user },
          { upsert: true, new: true }
        );
        userSuccess++;
      } catch (error) {
        console.error(`Error importing user ${user._id || user.email}: ${error.message}`);
        userErrors++;
      }
    }

    // Import projects
    console.log('Importing Projects...');
    let projectSuccess = 0;
    let projectErrors = 0;

    for (const project of projects) {
      try {
        // Convert string _id back to ObjectId
        if (project._id && typeof project._id === 'string') {
          project._id = new mongoose.Types.ObjectId(project._id);
        }
        
        // Convert userId to ObjectId if it exists and is a string
        if (project.userId && typeof project.userId === 'string') {
          project.userId = new mongoose.Types.ObjectId(project.userId);
        }
        
        await Project.findByIdAndUpdate(
          project._id,
          { $set: project },
          { upsert: true, new: true }
        );
        projectSuccess++;
      } catch (error) {
        console.error(`Error importing project ${project._id || project.projectId}: ${error.message}`);
        projectErrors++;
      }
    }

    console.log('\nRestore completed!');
    console.log(`Users: ${userSuccess} imported successfully, ${userErrors} errors`);
    console.log(`Projects: ${projectSuccess} imported successfully, ${projectErrors} errors`);

    if (userErrors > 0 || projectErrors > 0) {
      console.log('\nWarning: Some records could not be imported. Check the logs above for details.');
    }
  } catch (error) {
    console.error('Error during restore:', error);
    process.exit(1);
  }
}

// Main function to run the script
async function main() {
  try {
    // Get backup directory from command line args
    const backupDir = process.argv[2];
    
    if (!backupDir) {
      console.error('Error: No backup directory specified');
      console.log('Usage: node scripts/db-restore.js /path/to/backup/folder');
      process.exit(1);
    }

    // Resolve the backup directory path
    const resolvedBackupDir = path.resolve(process.cwd(), backupDir);
    console.log(`Using backup directory: ${resolvedBackupDir}`);

    await restoreDatabase(resolvedBackupDir);

    mongoose.connection.close();
    rl.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run the script
main(); 