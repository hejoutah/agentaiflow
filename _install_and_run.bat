@echo off
REM ============================================================
REM   AGENTFLOW - One-click install & dev server (Windows)
REM ============================================================
REM   Double-click this file to install dependencies and
REM   launch the dev server at http://localhost:3000
REM ============================================================

echo.
echo [AGENTFLOW] Step 1/2 - Installing dependencies (npm install)...
echo This will take ~30-60 seconds on first run.
echo.

call npm install
if errorlevel 1 (
  echo.
  echo [ERROR] npm install failed. Make sure Node.js 18.17+ is installed.
  echo Download from: https://nodejs.org
  pause
  exit /b 1
)

echo.
echo [AGENTFLOW] Step 2/2 - Starting dev server...
echo Open http://localhost:3000 in your browser.
echo Press Ctrl+C to stop.
echo.

call npm run dev
pause
