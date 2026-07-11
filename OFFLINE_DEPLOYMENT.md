# PLA Command Atlas — Offline Deployment

The application is offline-first. All workbook data used by the interface is
stored under `src/assets/data/raw` and copied into the production build. The
demo does not require PostgreSQL, GitHub, Vercel, Render, or internet access.

## Prepare the package once

On the development computer:

1. Run `npm install` in the project root if `node_modules` is absent.
2. Run `npm install` inside `backend` if `backend/node_modules` is absent.
3. Run `npm run build:offline` in the project root.
4. Confirm `dist/pla-command-atlas/index.html` exists.
5. Copy or ZIP the **entire project folder**. Do not select individual files.

The package must contain:

- `dist/pla-command-atlas` (the complete prebuilt website and data)
- `backend/server.js`
- `backend/routes`
- `backend/config`
- `backend/node_modules`
- `START_OFFLINE_WINDOWS.bat`

The source folders can remain in the package as a recoverable backup.

## Run on a Windows PC

1. Extract the complete ZIP to any normal folder, such as
   `C:\PLA-Command-Atlas`. There are no hardcoded Mac paths.
2. Install Node.js once, or put the Windows portable `node.exe` at
   `runtime\node.exe` inside the project.
3. Double-click `START_OFFLINE_WINDOWS.bat`.
4. The browser opens `http://localhost:3000`.

Keep the black launcher window open while using the application. Close it to
stop the private local server.

## PostgreSQL is optional

PostgreSQL is retained for development and future multi-user deployment, but
it is deliberately not required for an offline demonstration. To test API mode,
change the data service to opt in with `setUseApi(true)` and configure the
backend `.env`. The portable package should remain in offline mode.

## Updating the workbook data

Regenerate the JSON files, run `npm run build:offline` again, and replace the
complete `dist/pla-command-atlas` directory in the portable package. Never mix
files from two different builds because production filenames contain hashes.
