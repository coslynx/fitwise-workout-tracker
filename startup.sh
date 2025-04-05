#!/bin/sh

# Exit immediately if a command exits with a non-zero status.
set -e

# --- Helper Functions ---
log_info() {
    echo "[INFO] $1"
}

log_error() {
    echo "[ERROR] $1" >&2
}

# --- Prerequisite Checks ---
log_info "Checking prerequisites..."

# Check for Node.js
if ! command -v node > /dev/null 2>&1; then
    log_error "Node.js is not installed or not found in PATH."
    log_error "Please install Node.js (v18.x or later recommended) from https://nodejs.org/"
    exit 1
fi
log_info "Node.js found: $(node -v)"

# Check for npm
if ! command -v npm > /dev/null 2>&1; then
    log_error "npm is not installed or not found in PATH."
    log_error "npm usually comes with Node.js. Please ensure your Node.js installation is correct."
    exit 1
fi
log_info "npm found: $(npm -v)"

# --- Dependency Installation ---
log_info "Installing dependencies..."
if npm install; then
    log_info "Dependencies installed successfully."
else
    log_error "Failed to install dependencies using 'npm install'. Please check the output above for errors."
    exit 1
fi

# --- Environment Configuration Check ---
log_info "Checking for .env file..."
if [ ! -f .env ]; then
    log_error ".env file not found in the project root."
    log_error "Please copy '.env.example' to '.env' and fill in your Supabase credentials."
    log_error "Refer to the 'Installation' section in README.md for detailed instructions."
    exit 1
else
    log_info ".env file found."
fi

# --- Development Server Launch ---
log_info "Starting development server..."
# Execute the 'dev' script defined in package.json
npm run dev

# If npm run dev exits (e.g., user presses Ctrl+C), the script will terminate here.
# set -e ensures if npm run dev fails immediately, the script also exits with an error.
log_info "Development server stopped."

exit 0