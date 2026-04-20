@echo off
echo ==============================================
echo   Starting DevOps CI/CD Project Locally
echo ==============================================

echo.
echo [1/2] Installing Backend Dependencies and Starting Server...
cd backend
call npm install
start cmd /k "title Backend Server && echo Starting Backend on port 5000... && node server.js"
cd ..

echo.
echo [2/2] Installing Frontend Dependencies and Starting React App...
cd frontend
call npm install
start cmd /k "title Frontend Server && echo Starting Frontend... && npm run dev"
cd ..

echo.
echo ==============================================
echo Project started! Two new terminal windows should 
echo have opened for the backend and frontend.
echo.
echo You can view the dashboard at: http://localhost:5173
echo ==============================================
pause
