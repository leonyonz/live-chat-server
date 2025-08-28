#!/bin/bash

# Build script for packaging the WordPress plugin

echo "Building Live Chat WordPress Plugin..."

# Create a temporary directory for the build
mkdir -p temp-build

# Copy plugin files to the temporary directory
cp -r live-chat-wordpress temp-build/

# Remove any unnecessary files
rm -f temp-build/live-chat-wordpress/*.zip

# Create the zip file
cd temp-build
zip -r ../live-chat-wordpress.zip live-chat-wordpress

# Go back to the parent directory
cd ..

# Remove the temporary directory
rm -rf temp-build

echo "Plugin packaged successfully as live-chat-wordpress.zip"
echo "You can now install this plugin in your WordPress site."
