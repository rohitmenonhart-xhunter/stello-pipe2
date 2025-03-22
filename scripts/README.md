# Database Management Scripts

This directory contains scripts for managing the MongoDB database, including backup, restore, and flush operations.

## Prerequisites

Before using these scripts, make sure you have:

1. Node.js installed (v14 or higher recommended)
2. Required NPM packages installed:
   ```
   npm install mongoose dotenv
   ```
   
   If you encounter dependency conflicts, use:
   ```
   npm install mongoose dotenv --legacy-peer-deps
   ```
3. A valid `.env` file in the project root with your MongoDB connection string:
   ```
   MONGODB_URI=mongodb://localhost:27017/your-database
   ```

## Scripts Overview

### Backup and Flush

The `backup-flush.sh` script provides an interactive way to back up your database and optionally flush (delete all data from) it.

#### Usage

```bash
./scripts/backup-flush.sh
```

This will:
1. Backup all data from the database to JSON files in a timestamped directory under `database-backups/`
2. Optionally flush the database (delete all data) if you choose that option

The backup files (users.json and projects.json) contain all the data from your database, so you can restore it later if needed.

### Restore

The `restore.sh` script allows you to restore your database from a previous backup.

#### Usage

```bash
./scripts/restore.sh
```

This will:
1. Show a list of available backups
2. Let you select which backup to restore
3. Restore the selected backup to your database

**Warning:** Restoring will overwrite any existing data with the same IDs.

## Direct Script Usage

If you prefer to use the Node.js scripts directly:

### Backup Only

```bash
node scripts/db-backup-and-flush.js
```

### Backup and Flush

```bash
node scripts/db-backup-and-flush.js --flush
```

### Restore from Specific Backup

```bash
node scripts/db-restore.js ./database-backups/backup-2023-05-10T15-30-00.000Z
```

## Safety Precautions

1. **Always create a backup before flushing the database**
2. The scripts will ask for confirmation before any destructive operation
3. Backup files are stored in `database-backups/` with timestamps, so you can restore from any point
4. You must type "DELETE" or "RESTORE" to confirm destructive operations
5. Consider making additional copies of important backups to external storage

## Troubleshooting

If you encounter issues:

1. Check your MongoDB connection string in the `.env` file
2. Ensure you have proper permissions to the database
3. Make sure MongoDB is running and accessible
4. Check for any error messages in the console output

For restore errors:
- If some documents fail to restore, check the error messages - this is often due to duplicate key conflicts
- You may need to modify the backup JSON files if there are schema changes

## File Structure

```
scripts/
├── backup-flush.sh       # Interactive script for backup and flush operations
├── restore.sh            # Interactive script for database restoration
├── db-backup-and-flush.js # Node.js script for backup and flush
├── db-restore.js         # Node.js script for restoration
└── README.md             # This documentation file

database-backups/
├── backup-20230510T153000/ # Example backup directory
│   ├── users.json          # Backup of users collection
│   └── projects.json       # Backup of projects collection
└── ...
``` 