#!/bin/bash

# if [ -z "$1" ]; then
#     echo "Usage: $0 <download_directory>"
#     exit 1
# fi

# Set the Node.js version you want to use
NODE_VERSION="20.11.0"
Main_DIR=$(pwd)
MainBackend="$Main_DIR/backend"
ControlProject="$Main_DIR/control"
FrontendProject="$Main_DIR/frontend"

# Load NVM
export NVM_DIR="/home/shambel/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
    # This loads nvm
    . "$NVM_DIR/nvm.sh"
else
    echo "Error: NVM is not installed or cannot be found."
    exit 1
fi

# Use the specified Node.js version
nvm use v$NODE_VERSION
if [ $? -ne 0 ]; then
    echo "Error: Failed to switch to Node.js version $NODE_VERSION."
    exit 1
fi

# Navigate to the application directory
cd $MainBackend || { echo "Error: Failed to navigate to $MainBackend"; exit 1; }

# Start the application with PM2
pm2 start ecosystem.config.js
if [ $? -eq 0 ]; then
    echo "Application started successfully with PM2."
else
    echo "Error: Failed to start the application with PM2."
    exit 1
fi

# Navigate to the application directory
cd $ControlProject || { echo "Error: Failed to navigate to $ControlProject"; exit 1; }

# Start the application with PM2
pm2 start ecosystem.config.js
if [ $? -eq 0 ]; then
    echo "Application started successfully with PM2."
else
    echo "Error: Failed to start the application with PM2."
    exit 1
fi

# Navigate to the application directory
cd $FrontendProject || { echo "Error: Failed to navigate to $FrontendProject"; exit 1; }

# Start the application with PM2
pnpm run dev
if [ $? -eq 0 ]; then
    echo "Application started successfully with PM2."
else
    echo "Error: Failed to start the application with PM2."
    exit 1
fi

# echo "working";
