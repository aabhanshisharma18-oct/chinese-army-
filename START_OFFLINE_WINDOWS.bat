@echo off
setlocal EnableExtensions EnableDelayedExpansion
cd /d "%~dp0"
title PLA Command Atlas - Offline

set "NODE_CMD=node"

if exist "runtime\node.exe" (
  set "NODE_CMD=%CD%\runtime\node.exe"
) else (
  where node >nul 2>nul
  if errorlevel 1 (
    echo.
    echo ERROR: Node.js was not found.
    echo Install Node.js or place portable node.exe in the runtime folder.
    echo.
    pause
    exit /b 1
  )
)

if not exist "frontend\dist\pla-command-atlas\index.html" (
  echo.
  echo ERROR: The compiled Angular frontend is missing.
  echo Expected: frontend\dist\pla-command-atlas\index.html
  echo.
  pause
  exit /b 1
)

if not exist "backend\node_modules\express\package.json" (
  echo.
  echo ERROR: Backend dependencies are missing.
  echo Windows-compatible backend dependencies must be included.
  echo.
  pause
  exit /b 1
)

if not exist "backend\.env" (
  echo.
  echo ERROR: backend\.env is missing.
  echo.
  pause
  exit /b 1
)

if not exist "database\pla_command_atlas.backup" (
  echo.
  echo ERROR: PostgreSQL backup is missing.
  echo Expected: database\pla_command_atlas.backup
  echo.
  pause
  exit /b 1
)

set "DB_HOST=127.0.0.1"
set "DB_PORT=5432"
set "DB_USER=postgres"
set "DB_PASSWORD=postgres"
set "DB_NAME=pla_command_atlas"

for /f "usebackq tokens=1,* delims==" %%A in ("backend\.env") do (
  if /i "%%A"=="DB_HOST" set "DB_HOST=%%B"
  if /i "%%A"=="DB_PORT" set "DB_PORT=%%B"
  if /i "%%A"=="DB_USER" set "DB_USER=%%B"
  if /i "%%A"=="DB_PASSWORD" set "DB_PASSWORD=%%B"
  if /i "%%A"=="DB_NAME" set "DB_NAME=%%B"
)

set "PSQL=psql"
set "CREATEDB=createdb"
set "PGRESTORE=pg_restore"

where psql >nul 2>nul
if errorlevel 1 (
  set "PG_BIN="

  for /d %%D in ("%ProgramFiles%\PostgreSQL\*") do (
    if exist "%%~fD\bin\psql.exe" set "PG_BIN=%%~fD\bin"
  )

  if not defined PG_BIN (
    echo.
    echo ERROR: PostgreSQL command-line tools were not found.
    echo Install PostgreSQL or add its bin folder to PATH.
    echo.
    pause
    exit /b 1
  )

  set "PSQL=!PG_BIN!\psql.exe"
  set "CREATEDB=!PG_BIN!\createdb.exe"
  set "PGRESTORE=!PG_BIN!\pg_restore.exe"
)

set "PGPASSWORD=!DB_PASSWORD!"

"!PSQL!" -h "!DB_HOST!" -p "!DB_PORT!" -U "!DB_USER!" ^
  -d postgres -tAc "SELECT 1;" >nul 2>nul

if errorlevel 1 (
  echo.
  echo ERROR: PostgreSQL is not running or the login details are incorrect.
  echo Host: !DB_HOST!
  echo Port: !DB_PORT!
  echo User: !DB_USER!
  echo.
  pause
  exit /b 1
)

if not exist "database\.restored" (
  echo.
  echo Preparing the PostgreSQL database for first use...

  "!CREATEDB!" -h "!DB_HOST!" -p "!DB_PORT!" ^
    -U "!DB_USER!" "!DB_NAME!" >nul 2>nul

  "!PGRESTORE!" -h "!DB_HOST!" -p "!DB_PORT!" ^
    -U "!DB_USER!" ^
    --clean --if-exists --no-owner --no-privileges ^
    -d "!DB_NAME!" "database\pla_command_atlas.backup"

  if errorlevel 1 (
    echo.
    echo ERROR: The database backup could not be restored.
    echo.
    pause
    exit /b 1
  )

  >"database\.restored" echo Database restored successfully.
  echo Database restored successfully.
)

echo.
echo Starting PLA Command Atlas...
echo Address: http://127.0.0.1:3000
echo.

start "" /b cmd /c ^
  "timeout /t 3 /nobreak >nul & start http://127.0.0.1:3000"

"!NODE_CMD!" backend\server.js

echo.
echo The local server stopped.
pause
