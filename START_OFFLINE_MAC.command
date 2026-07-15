#!/bin/zsh
cd "$(dirname "$0")"

if [[ ! -f "frontend/dist/pla-command-atlas/index.html" ]]; then
  echo "ERROR: The compiled Angular frontend is missing."
  echo "Expected: frontend/dist/pla-command-atlas/index.html"
  read "?Press Enter to close."
  exit 1
fi

if [[ ! -d "backend/node_modules/express" ]]; then
  echo "ERROR: Backend dependencies are missing."
  echo "Run npm install inside backend while preparing the package."
  read "?Press Enter to close."
  exit 1
fi

if [[ ! -f "backend/.env" ]]; then
  echo "ERROR: backend/.env is missing."
  read "?Press Enter to close."
  exit 1
fi

(sleep 2; open "http://127.0.0.1:3000") &
node backend/server.js
