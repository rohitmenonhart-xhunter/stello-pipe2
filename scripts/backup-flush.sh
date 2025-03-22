#!/bin/bash

# Database Backup and Flush Script Wrapper
# This provides a user-friendly interface to the Node.js backup script

echo "==============================================="
echo "   MongoDB Database Backup and Flush Utility   "
echo "==============================================="
echo ""

# Check if scripts directory exists
if [ ! -d "scripts" ]; then
  echo "Error: This script must be run from the project root directory"
  exit 1
fi

# Check for Node.js
if ! command -v node &> /dev/null; then
  echo "Error: Node.js is required but not installed"
  exit 1
fi

# Check for necessary dependencies
if ! node -e "try { require('mongoose'); } catch(e) { process.exit(1); }"; then
  echo "Error: mongoose package is not installed"
  echo "Please run: npm install mongoose"
  exit 1
fi

if ! node -e "try { require('dotenv'); } catch(e) { process.exit(1); }"; then
  echo "Error: dotenv package is not installed"
  echo "Please run: npm install dotenv"
  exit 1
fi

# Main menu
echo "What would you like to do?"
echo ""
echo "1) Backup database only (safe)"
echo "2) Backup and flush database (WARNING: this will delete all data!)"
echo "3) Exit"
echo ""

read -p "Enter your choice (1-3): " choice

case $choice in
  1)
    echo ""
    echo "Running database backup..."
    node scripts/db-backup-and-flush.js
    ;;
  2)
    echo ""
    echo "⚠️  WARNING: You are about to backup and FLUSH (delete all data from) the database! ⚠️"
    echo "This is a destructive operation and cannot be undone."
    echo ""
    read -p "Are you sure you want to continue? (y/N): " confirm
    
    if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
      echo ""
      echo "Running database backup and flush..."
      node scripts/db-backup-and-flush.js --flush
    else
      echo "Operation cancelled. No changes were made."
    fi
    ;;
  3)
    echo "Exiting..."
    exit 0
    ;;
  *)
    echo "Invalid choice. Exiting."
    exit 1
    ;;
esac

echo ""
echo "Script completed!" 