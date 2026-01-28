#!/bin/bash
echo "Adding changes..."
git add .

echo "Committing..."
git commit -m "Fix App.tsx and sync with main"

echo "Pushing to cloud..."
git push origin main

echo "Done."
