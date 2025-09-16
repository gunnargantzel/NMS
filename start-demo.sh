#!/bin/bash

echo "Starting NMS Order Registration System Demo..."
echo ""
echo "This will start both the backend server and frontend application."
echo ""
echo "Demo login credentials:"
echo "Username: admin, Password: admin123"
echo "Username: surveyor1, Password: admin123"
echo "Username: surveyor2, Password: admin123"
echo ""
echo "Backend will be available at: http://localhost:5000"
echo "Frontend will be available at: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Start backend in background
npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend
cd client && npm start &
FRONTEND_PID=$!

echo ""
echo "Both servers are starting..."
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for user to stop
wait
