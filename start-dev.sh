#!/bin/bash

echo "🗳️  Starting Election Process Assistant..."
echo ""

# Start backend in background
echo "Starting backend server..."
cd backend
npm run dev &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 3

# Start frontend
echo "Starting frontend server..."
cd ../frontend
npm run dev

# Cleanup on exit
trap "kill $BACKEND_PID" EXIT
