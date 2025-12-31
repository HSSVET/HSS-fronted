#!/bin/bash
# Absolute path for the log file
LOG_FILE="/Users/sevketugurel/Desktop/HSS/HSS/git_sync.log"

echo "Starting git synchronization..."
echo "Starting git synchronization..." > "$LOG_FILE"

# 1. Stash changes
echo "Step 1: Stashing local changes..."
echo "Step 1: Stashing local changes..." >> "$LOG_FILE"
git stash save "Antigravity sync $(date)" >> "$LOG_FILE" 2>&1

# 2. Pull from remote
echo "Step 2: Pulling from remote..."
echo "Step 2: Pulling from remote..." >> "$LOG_FILE"
git pull --tags origin main >> "$LOG_FILE" 2>&1

# 3. Pop stash
echo "Step 3: Restoring local changes (pop stash)..."
echo "Step 3: Restoring local changes (pop stash)..." >> "$LOG_FILE"
git stash pop >> "$LOG_FILE" 2>&1

echo "Done. Please check for conflicts in src/App.tsx if 'git stash pop' reported any."
echo "Done." >> "$LOG_FILE"
