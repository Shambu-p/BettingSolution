#!/bin/bash

if [ -z "$1" ]; then
    echo "Usage: $0 <download_directory>"
    exit 1
fi

# Set variables
ZIP_URL="https://example.com/file.zip"  # URL of the zip file
DOWNLOAD_DIR="$1"                       # Where to save the zip file
EXTRACT_DIR="$DOWNLOAD_DIR"     # Where to extract the contents
CONTROL_DIR="$EXTRACT_DIR/control"      # Name of the created file
BACKEND_DIR="$EXTRACT_DIR/backend"      # Name of the created file
FRONTEND_DIR="$EXTRACT_DIR/frontend"    # Name of the created file
NODE_VERSION="20.19.0"

BACKEND_CONFIG_NAME="$BACKEND_DIR/ecosystem.config.js"                  # Name of the created file
BACKEND_STARTER_CONFIGURATION=$(cat <<EOF
module.exports = {
	apps: [{
		name: "trading_system_backend",
		script: "$BACKEND_DIR/server.js",
		env: {
			NODE_ENV: "development",
			DATABASE_URL: "mysql://root:@localhost:3306/trading_system_db"
		},
		env_staging: {
			NODE_ENV: "staging",
			PORT: 3005
		},
		env_production: {
			NODE_ENV: "production",
			PORT: 3005
		}
	}]
}
EOF
)  # Dynamic content

CONTROL_CONFIG_NAME="$CONTROL_DIR/ecosystem.config.js"                  # Name of the created file
CONTROL_STARTER_CONFIGURATION=$(cat <<EOF
module.exports = {
	apps: [{
		name: "trading_system_control",
		script: "$CONTROL_DIR/server.js",
		env: {
			NODE_ENV: "development",
		},
		env_staging: {
			NODE_ENV: "staging",
			PORT: 4000,
		},
		env_production: {
			NODE_ENV: "production",
			PORT: 4000,
		}
	}]
}
EOF
)  # Dynamic content

CONTROL_SYS_CONFIG_NAME="$CONTROL_DIR/configuration.json"                  # Name of the created file
CONTROL_CONFIGURATION=$(cat <<EOF
{
    "main_server_location": "$BACKEND_DIR",
    "process_id": "trading_system_backend",
    "main_api_address": "http://localhost:3005"
}
EOF
)  # Dynamic content


# Load NVM
# export NVM_DIR="/root/.nvm"
# if [ -s "$NVM_DIR/nvm.sh" ]; then
#     # This loads nvm
#     . "$NVM_DIR/nvm.sh"
# else
#     echo "Error: NVM is not installed or cannot be found."
#     exit 1
# fi

# # Use the specified Node.js version
# nvm use v$NODE_VERSION
# if [ $? -ne 0 ]; then
#     echo "Error: Failed to switch to Node.js version $NODE_VERSION."
#     exit 1
# fi

######################################################### starting downloading and extraction ################################

# Create directories if they don't exist
# mkdir -p "$DOWNLOAD_DIR"
# mkdir -p "$EXTRACT_DIR"

# Download the ZIP file
# ZIP_PATH="$DOWNLOAD_DIR/$(basename $ZIP_URL)"
# echo "Downloading $ZIP_URL..."
# curl -o "$ZIP_PATH" "$ZIP_URL"

# Extract the ZIP file
# echo "Extracting to $EXTRACT_DIR..."
# unzip -o "$ZIP_PATH" -d "$EXTRACT_DIR"


######################################################### finish downloading and extraction ##################################

######################################################### start updating files ##################################

# Update file with dynamic content
echo "Update : $BACKEND_CONFIG_NAME"
echo "$BACKEND_STARTER_CONFIGURATION" > "$BACKEND_CONFIG_NAME"

echo "Update : $CONTROL_CONFIG_NAME"
echo "$CONTROL_STARTER_CONFIGURATION" > "$CONTROL_CONFIG_NAME"

echo "Update : $CONTROL_SYS_CONFIG_NAME"
echo "$CONTROL_CONFIGURATION" > "$CONTROL_SYS_CONFIG_NAME"

######################################################### updating files is finished ##################################

######################################################### start installing packages ##########################################

echo "installing packages started .... "
# Navigate to the application directory
cd $BACKEND_DIR || { echo "Error: Failed to navigate to $BACKEND_DIR"; exit 1; }

# Install backend packages
pnpm install
if [ $? -eq 0 ]; then
    echo "backend packages installation completed"
	npx prisma generate
else
    echo "Error: backend packages installation failed. try installing the packages manually!"
    # exit 1
fi

# Navigate to the application directory
cd $CONTROL_DIR || { echo "Error: Failed to navigate to $CONTROL_DIR"; exit 1; }

# Install control packages
pnpm install
if [ $? -eq 0 ]; then
    echo "control packages installation completed"
else
    echo "Error: control packages installation failed. try installing the packages manually!"
    # exit 1
fi

# Navigate to the application directory
cd $FRONTEND_DIR || { echo "Error: Failed to navigate to $FRONTEND_DIR"; exit 1; }

# Install frontend packages
pnpm install
if [ $? -eq 0 ]; then
    echo "frontend packages installation completed"
else
    echo "Error: frontend packages installation failed. try installing the packages manually!"
    # exit 1
fi

# Confirmation message
echo "Installation completed!"

######################################################### Finish installing packages #########################################

# Navigate to the application directory
cd $BACKEND_DIR || { echo "Error: Failed to navigate to $BACKEND_DIR"; exit 1; }

# Start the application with PM2
pm2 start ecosystem.config.js
if [ $? -eq 0 ]; then
    echo "Application started successfully with PM2."
else
    echo "Error: Failed to start the application with PM2."
    # exit 1
fi

# Navigate to the application directory
cd $CONTROL_DIR || { echo "Error: Failed to navigate to $CONTROL_DIR"; exit 1; }

# Start the application with PM2
pm2 start ecosystem.config.js
if [ $? -eq 0 ]; then
    echo "Application started successfully with PM2."
else
    echo "Error: Failed to start the application with PM2."
    # exit 1
fi

# Navigate to the application directory
cd $FRONTEND_DIR || { echo "Error: Failed to navigate to $FRONTEND_DIR"; exit 1; }

# Start the application with PM2
pnpm run dev
if [ $? -eq 0 ]; then
    echo "Application started successfully with PM2."
else
    echo "Error: Failed to start the application with PM2."
    # exit 1
fi

