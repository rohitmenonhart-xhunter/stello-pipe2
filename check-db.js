const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Define the User schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  clerkId: String,
  projectId: {
    type: String,
    sparse: true
  },
  verifiedFields: {
    email: {
      type: Boolean,
      default: false
    },
    phone: {
      type: Boolean,
      default: false
    }
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

// Create the models
const User = mongoose.model('User', userSchema);
const Project = mongoose.model('Project', projectSchema);

async function checkDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find users with email test@example.com
    const users = await User.find({ email: 'test@example.com' });
    console.log('Users with email test@example.com:');
    console.log(JSON.stringify(users, null, 2));

    // Find projects with email test@example.com
    const projects = await Project.find({ userEmail: 'test@example.com' });
    console.log('Projects with email test@example.com:');
    console.log(JSON.stringify(projects, null, 2));

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error checking database:', error);
  }
}

checkDatabase(); 