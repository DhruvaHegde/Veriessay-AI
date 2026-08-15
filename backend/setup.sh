#!/usr/bin/env bash
set -e

echo "🚀 Setting up Python virtual environment for backend..."
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi

echo "📦 Installing Python dependencies..."
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

echo "✅ Backend environment setup complete!"
