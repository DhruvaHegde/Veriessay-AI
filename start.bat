@echo off
echo Starting Backend and Frontend services...

cd /d "%~dp0"

echo Starting Backend...
start "Backend Service" cmd /k "cd backend && ".\.venv\Scripts\python.exe" run.py"

echo Starting Frontend...
start "Frontend Service" cmd /k "cd frontend && npm run dev"

echo Both services have been started in separate windows.
pause
