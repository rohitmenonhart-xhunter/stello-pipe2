/**
 * Database Backup and Flush Script
 * 
 * This script will:
 * 1. Connect to MongoDB using the connection string from .env
 * 2. Create a timestamped backup folder
 * 3. Export all collections (Users and Projects) to JSON files
 * 4. Optionally flush (delete all documents from) the database after confirmation
 * 
 * Usage:
 * node scripts/db-backup-and-flush.js [--flush]
 * 
 * Add the --flush flag to actually flush the database after backup
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

// Check if the --flush flag was provided
const shouldFlush = process.argv.includes('--flush');

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

// Backup the database
async function backupDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully!');

    // Create models from schemas
    const User = mongoose.models.User || mongoose.model('User', userSchema);
    const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);

    // Create a timestamped backup folder
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const backupDir = path.join(process.cwd(), 'database-backups', `backup-${timestamp}`);
    
    if (!fs.existsSync(path.join(process.cwd(), 'database-backups'))) {
      fs.mkdirSync(path.join(process.cwd(), 'database-backups'));
    }
    
    fs.mkdirSync(backupDir);
    console.log(`Created backup directory: ${backupDir}`);

    // Backup Users collection
    console.log('Backing up Users collection...');
    const users = await User.find({}).lean();
    fs.writeFileSync(
      path.join(backupDir, 'users.json'),
      JSON.stringify(users, null, 2)
    );
    console.log(`Backed up ${users.length} users to users.json`);

    // Backup Projects collection
    console.log('Backing up Projects collection...');
    const projects = await Project.find({}).lean();
    fs.writeFileSync(
      path.join(backupDir, 'projects.json'),
      JSON.stringify(projects, null, 2)
    );
    console.log(`Backed up ${projects.length} projects to projects.json`);

    console.log(`Backup completed successfully! Files saved to: ${backupDir}`);
    
    return { User, Project, backupDir };
  } catch (error) {
    console.error('Error during backup:', error);
    process.exit(1);
  }
}

// Flush the database
async function flushDatabase(User, Project) {
  try {
    console.log('\n⚠️  WARNING: You are about to delete all data from the database! ⚠️');
    console.log('This action cannot be undone.');
    
    const answer = await new Promise((resolve) => {
      rl.question('Type "DELETE" to confirm you want to flush the database: ', (answer) => {
        resolve(answer);
      });
    });

    if (answer !== 'DELETE') {
      console.log('Flush operation cancelled. Your database remains untouched.');
      return;
    }

    // Delete all documents from collections
    console.log('Flushing Users collection...');
    const userResult = await User.deleteMany({});
    console.log(`Deleted ${userResult.deletedCount} users`);

    console.log('Flushing Projects collection...');
    const projectResult = await Project.deleteMany({});
    console.log(`Deleted ${projectResult.deletedCount} projects`);

    console.log('Database flush completed successfully!');
  } catch (error) {
    console.error('Error during database flush:', error);
  }
}

// Main function to run the script
async function main() {
  try {
    console.log('Starting database backup process...');
    const { User, Project, backupDir } = await backupDatabase();

    if (shouldFlush) {
      await flushDatabase(User, Project);
    } else {
      console.log('\nDatabase backup completed without flushing.');
      console.log('If you want to flush the database, run the script with the --flush flag:');
      console.log('node scripts/db-backup-and-flush.js --flush');
    }

    console.log(`\nBackup files are available at: ${backupDir}`);
    mongoose.connection.close();
    rl.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run the script
main(); 