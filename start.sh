#!/usr/bin/env bash
set -e

echo "🚀 Starting AI Detector for College Admissions Essays..."

# Ensure backend venv exists
if [ ! -d "backend/venv" ]; then
    echo "Creating backend virtual environment..."
    cd backend && bash setup.sh && cd ..
fi

# Ensure frontend dependencies exist
if [ ! -d "frontend/node_modules" ]; then
    echo "Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

echo "✨ Backend URL:  http://localhost:8000"
echo "✨ Frontend URL: http://localhost:5173"

# Run backend and frontend concurrently
cd backend && source venv/bin/activate && python3 run.py &
BACKEND_PID=$!

cd frontend && npm run dev &
FRONTEND_PID=$!

trap "kill $BACKEND_PID $FRONTEND_PID" EXIT

wait
