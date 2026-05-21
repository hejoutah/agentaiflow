@echo off
REM ============================================================
REM   AGENTFLOW - Build & ZIP for upload (Windows)
REM ============================================================
REM   Builds the production bundle, verifies it works, then
REM   creates AGENTFLOW.zip (excluding node_modules + .next).
REM ============================================================

echo.
echo [AGENTFLOW] Step 1/3 - Installing dependencies...
call npm install
if errorlevel 1 (
  echo [ERROR] npm install failed.
  pause
  exit /b 1
)

echo.
echo [AGENTFLOW] Step 2/3 - Building production bundle...
call npm run build
if errorlevel 1 (
  echo [ERROR] Build failed - check errors above.
  pause
  exit /b 1
)

echo.
echo [AGENTFLOW] Step 3/3 - Creating AGENTFLOW.zip...
REM Use PowerShell's Compress-Archive (no node_modules/.next inside)
powershell -NoProfile -Command "Get-ChildItem -Path '.' -Exclude 'node_modules','.next','AGENTFLOW.zip','_check.txt' | Compress-Archive -DestinationPath 'AGENTFLOW.zip' -Force"

if exist AGENTFLOW.zip (
  echo.
  echo [SUCCESS] AGENTFLOW.zip created in this folder.
  echo Upload it to GitHub or share as needed.
) else (
  echo [ERROR] ZIP creation failed.
)

echo.
pause
