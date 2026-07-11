#!/bin/zsh
cd "$(dirname "$0")"

if [[ ! -f "dist/pla-command-atlas/index.html" ]]; then
  echo "ERROR: The prebuilt application is missing."
  read "?Press Enter to close."
  exit 1
fi

if [[ ! -d "backend/node_modules/express" ]]; then
  echo "ERROR: backend dependencies are missing. Run npm install inside backend once."
  read "?Press Enter to close."
  exit 1
fi

(sleep 2; open "http://localhost:3000") &
node backend/server.js
