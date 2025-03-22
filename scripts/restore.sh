#!/bin/bash

# Database Restore Script Wrapper
# This provides a user-friendly interface to the Node.js restore script

echo "==============================================="
echo "      MongoDB Database Restore Utility        "
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

# Check if backups directory exists
if [ ! -d "database-backups" ]; then
  echo "No database-backups directory found."
  echo "Creating database-backups directory..."
  mkdir -p database-backups
  echo "You'll need to run a backup first before you can restore."
  echo "Please run ./scripts/backup-flush.sh to create a backup."
  exit 0
fi

# List all available backups
echo "Available backups:"
echo ""

# Array to store backup directories
backup_dirs=()

# Find all backup directories
i=1
for dir in database-backups/backup-*; do
  if [ -d "$dir" ]; then
    echo "$i) $dir (created: $(stat -f "%Sm" -t "%Y-%m-%d %H:%M:%S" "$dir"))"
    backup_dirs+=("$dir")
    ((i++))
  fi
done

if [ ${#backup_dirs[@]} -eq 0 ]; then
  echo "No backups found in the database-backups directory."
  exit 1
fi

echo ""
echo "$i) Exit"
echo ""

# Get user selection
read -p "Enter your choice (1-$i): " choice

# Validate choice
if ! [[ "$choice" =~ ^[0-9]+$ ]]; then
  echo "Invalid choice. Exiting."
  exit 1
fi

if [ "$choice" -eq "$i" ]; then
  echo "Exiting..."
  exit 0
fi

if [ "$choice" -lt 1 ] || [ "$choice" -gt ${#backup_dirs[@]} ]; then
  echo "Invalid choice. Exiting."
  exit 1
fi

# Get the selected backup directory
selected_backup="${backup_dirs[$((choice-1))]}"

echo ""
echo "You selected: $selected_backup"
echo ""
echo "⚠️  WARNING: This will restore the database from backup and may overwrite existing data! ⚠️"
read -p "Do you want to continue? (y/N): " confirm

if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
  echo ""
  echo "Running database restore..."
  node scripts/db-restore.js "$selected_backup"
else
  echo "Restore cancelled. No changes were made."
fi

echo ""
echo "Script completed!" 