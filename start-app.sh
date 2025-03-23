#!/bin/bash

# Find your local IP address
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS
  IP=$(ipconfig getifaddr en0)
else
  # Linux
  IP=$(hostname -I | awk '{print $1}')
fi

echo "======================================================"
echo "Starting College Portal Application"
echo "======================================================"
echo "Your local IP address is: $IP"
echo "Frontend will be accessible at: http://$IP:3000"
echo "Backend will be accessible at: http://$IP:5000"
echo "======================================================"

# Start backend server
echo "Starting backend server..."
cd backend
npm install
PORT=5000 npm run dev &
BACKEND_PID=$!

# Start frontend server
echo "Starting frontend server..."
cd ../frontend
npm install
npm start &
FRONTEND_PID=$!

# Handle shutdown
function cleanup {
  echo "Shutting down servers..."
  kill $BACKEND_PID
  kill $FRONTEND_PID
  exit
}

trap cleanup INT

# Keep script running
wait 