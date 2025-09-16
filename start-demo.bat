@echo off
echo Starting NMS Order Registration System Demo...
echo.
echo This will start both the backend server and frontend application.
echo.
echo Demo login credentials:
echo Username: admin, Password: admin123
echo Username: surveyor1, Password: admin123
echo Username: surveyor2, Password: admin123
echo.
echo Backend will be available at: http://localhost:5000
echo Frontend will be available at: http://localhost:3000
echo.
echo Press Ctrl+C to stop both servers
echo.

start "NMS Backend" cmd /k "npm run dev"
timeout /t 3 /nobreak > nul
start "NMS Frontend" cmd /k "cd client && npm start"

echo.
echo Both servers are starting...
echo Check the opened terminal windows for status.
echo.
pause
