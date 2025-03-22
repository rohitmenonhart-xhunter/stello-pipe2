const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Create a log file
const logFile = fs.createWriteStream('api/db-check.log', { flags: 'a' });

// Custom logging function
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  logFile.write(logMessage);
  console.log(message);
}

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

log('MongoDB URI: ' + (MONGODB_URI ? MONGODB_URI.substring(0, 20) + '...' : 'Not defined'));

async function checkDatabase() {
  try {
    log('Connecting to MongoDB...');
    const conn = await mongoose.connect(MONGODB_URI);
    log('Connected to MongoDB');

    // Get all collections
    const collections = await conn.connection.db.listCollections().toArray();
    log('Collections: ' + collections.map(c => c.name).join(', '));

    // Check indexes on all collections
    for (const collection of collections) {
      log(`Checking indexes on ${collection.name} collection...`);
      const indexes = await conn.connection.db.collection(collection.name).indexes();
      log(`Indexes on ${collection.name} collection: ${JSON.stringify(indexes, null, 2)}`);
      
      // Look for problematic indexes
      const problematicIndexes = indexes.filter(idx => 
        idx.key && idx.key.username === 1 && idx.unique === true
      );
      
      if (problematicIndexes.length > 0) {
        log(`Found ${problematicIndexes.length} problematic username index(es) in ${collection.name}, dropping them...`);
        for (const idx of problematicIndexes) {
          await conn.connection.db.collection(collection.name).dropIndex(idx.name);
          log(`Index ${idx.name} dropped successfully from ${collection.name}`);
        }
      }
    }

    await mongoose.disconnect();
    log('Disconnected from MongoDB');
  } catch (error) {
    log('Error checking database: ' + error.message);
    fs.writeFileSync('api/db-error.log', JSON.stringify(error, null, 2));
  }
}

checkDatabase(); 