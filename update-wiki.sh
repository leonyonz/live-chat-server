#!/bin/bash

# Script to update GitHub Wiki for Live Chat Server
# This script copies documentation from docs/wiki/ to the wiki repository

echo "=== Live Chat Server Wiki Update ==="
echo ""

# Check if wiki repository exists
if [ ! -d "../live-chat-server.wiki" ]; then
    echo "Cloning wiki repository..."
    git clone https://github.com/leonyonz/live-chat-server.wiki.git ../live-chat-server.wiki
    if [ $? -ne 0 ]; then
        echo "Failed to clone wiki repository. Please make sure the wiki is enabled on GitHub."
        exit 1
    fi
else
    echo "Updating existing wiki repository..."
    cd ../live-chat-server.wiki
    git pull
    cd ../live-chat-server
fi

echo "Copying documentation files to wiki..."

# Copy all markdown files from docs/wiki to wiki repository
find docs/wiki -name "*.md" -type f | while read file; do
    filename=$(basename "$file")
    echo "Copying $filename..."
    cp "$file" "../live-chat-server.wiki/$filename"
done

echo "Documentation files copied successfully!"
echo ""
echo "To push changes to GitHub wiki:"
echo "1. cd ../live-chat-server.wiki"
echo "2. git add ."
echo "3. git commit -m \"Update documentation\""
echo "4. git push"
echo ""
echo "Note: You may need to authenticate with GitHub when pushing."
