#!/bin/bash
# Quick Start Script for Campus Notification System
# This script helps set up and run both frontend and backend

set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║   Campus Notification System - Quick Start Setup           ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v14 or higher."
    exit 1
fi

echo "✅ Node.js is installed: $(node -v)"
echo "✅ npm is installed: $(npm -v)"
echo ""

# Setup Backend
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Setting up Backend..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -d "notification_app_be" ]; then
    cd notification_app_be
    echo "📦 Installing backend dependencies..."
    npm install
    cd ..
    echo "✅ Backend setup complete"
else
    echo "❌ Backend folder not found"
    exit 1
fi

echo ""

# Setup Frontend
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Setting up Frontend..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -d "notification_app_fe" ]; then
    cd notification_app_fe
    echo "📦 Installing frontend dependencies..."
    npm install
    cd ..
    echo "✅ Frontend setup complete"
else
    echo "❌ Frontend folder not found"
    exit 1
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║              ✅ Setup Complete!                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "Next steps:"
echo ""
echo "1️⃣  Start the Backend (in Terminal 1):"
echo "    cd notification_app_be"
echo "    npm start"
echo "    → Backend will run on http://localhost:5000"
echo ""
echo "2️⃣  Start the Frontend (in Terminal 2):"
echo "    cd notification_app_fe"
echo "    npm start"
echo "    → Frontend will open on http://localhost:3000"
echo ""
echo "3️⃣  View the Application:"
echo "    Open browser to http://localhost:3000"
echo ""
echo "4️⃣  Test Backend Health:"
echo "    curl http://localhost:5000/health"
echo ""
echo "────────────────────────────────────────────────────────────"
echo "Documentation:"
echo "  - Setup Guide: README.md"
echo "  - Design Doc: notification_system_design.md"
echo "  - Frontend Guide: notification_app_fe/README.md"
echo "  - Backend Guide: notification_app_be/README.md"
echo "  - Logging Guide: logging_middleware/README.md"
echo "────────────────────────────────────────────────────────────"
