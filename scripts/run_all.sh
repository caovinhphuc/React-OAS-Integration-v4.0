#!/bin/bash

# Start backend
echo "Starting backend..."
./start_backend.sh &

# Start frontend
echo "Starting frontend..."
npm start &

# Wait for both processes to finish
wait

echo "Both backend and frontend are running."
