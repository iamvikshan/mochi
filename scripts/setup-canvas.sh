#!/bin/bash

# Setup script for Canvas system dependencies
# Run this script on new development environments

echo "Installing Canvas system dependencies..."

# Detect OS
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux (Ubuntu/Debian)
    if command -v apt-get &> /dev/null; then
        echo "Detected Ubuntu/Debian system"
        sudo apt-get update
        sudo apt-get install -y pkg-config libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
    elif command -v yum &> /dev/null; then
        echo "Detected RHEL/CentOS system"
        sudo yum install -y pkgconfig cairo-devel pango-devel libjpeg-devel giflib-devel librsvg2-devel
    elif command -v pacman &> /dev/null; then
        echo "Detected Arch Linux system"
        sudo pacman -S pkg-config cairo pango libjpeg-turbo giflib librsvg
    else
        echo "Unsupported Linux distribution"
        exit 1
    fi
elif [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    echo "Detected macOS system"
    if command -v brew &> /dev/null; then
        brew install pkg-config cairo pango libpng jpeg giflib librsvg
    else
        echo "Homebrew not found. Please install Homebrew first: https://brew.sh/"
        exit 1
    fi
else
    echo "Unsupported operating system: $OSTYPE"
    exit 1
fi

echo "Canvas system dependencies installed successfully!"
echo "You can now run: bun install"
