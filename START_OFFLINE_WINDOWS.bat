@echo off
setlocal
cd /d "%~dp0"
title PLA Command Atlas - Offline

set "NODE_CMD=node"
if exist "runtime\node.exe" set "NODE_CMD=%CD%\runtime\node.exe"

where "%NODE_CMD%" >nul 2>nul
if errorlevel 1 (
  echo.
  echo ERROR: Node.js was not found.
  echo Install Node.js once, or place portable node.exe in the runtime folder.
  echo No internet connection is required after that.
  echo.
  pause
  exit /b 1
)

if not exist "dist\pla-command-atlas\index.html" (
  echo ERROR: The prebuilt application is missing.
  echo Copy the complete project folder again; do not copy individual files.
  pause
  exit /b 1
)

if not exist "backend\node_modules\express\package.json" (
  echo ERROR: Offline server dependencies are missing.
  echo Copy the complete backend\node_modules folder from the prepared package.
  pause
  exit /b 1
)

echo Starting PLA Command Atlas at http://localhost:3000
start "" /b cmd /c "timeout /t 2 /nobreak >nul & start http://localhost:3000"
"%NODE_CMD%" backend\server.js

echo.
echo The local server stopped.
pause
