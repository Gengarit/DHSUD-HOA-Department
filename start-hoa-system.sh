#!/bin/bash
# DHSUD HOA Management System - Automated Startup Script (macOS/Linux)

cd "$(dirname "$0")"

echo ""
echo "===================================="
echo "DHSUD HOA Management System"
echo "Starting Backend and Frontend..."
echo "===================================="
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 is not installed"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed"
    exit 1
fi

# Navigate to backend directory
cd backend

echo ""
echo "Installing/Updating Python dependencies..."
pip3 install -q -r requirements.txt

echo "Running Django migrations..."
python3 manage.py migrate

# Start Django backend
echo "Starting Django server on http://localhost:8000..."
python3 manage.py runserver 0.0.0.0:8000 &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Navigate to frontend directory
cd ../frontend

echo ""
echo "Installing/Updating Node.js dependencies..."
npm install -q

# Start Vue.js frontend
echo "Starting Vue.js dev server on http://localhost:5173..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "===================================="
echo "Both servers are starting..."
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:5173"
echo "Admin Panel: http://localhost:8000/admin/"
echo "===================================="
echo ""
echo "Press Ctrl+C to stop the servers"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
