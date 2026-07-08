# PLA Command Atlas - PostgreSQL Migration Setup Guide

This guide provides step-by-step instructions for setting up the PostgreSQL backend and migrating from Excel JSON files to a database-backed architecture.

## Prerequisites

- **Node.js** v18 or higher
- **PostgreSQL** v12 or higher
- **npm** (comes with Node.js)

## Step 1: Install PostgreSQL

### macOS (Homebrew)
```bash
brew install postgresql@14
brew services start postgresql@14
```

### Ubuntu/Debian
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Windows
Download and install from: https://www.postgresql.org/download/windows/

## Step 2: Create PostgreSQL Database

```bash
# Login to PostgreSQL (default user: postgres)
psql -U postgres

# Create database
CREATE DATABASE pla_command_atlas;

# Exit psql
\q
```

Or in a single command:
```bash
createdb -U postgres pla_command_atlas
```

## Step 3: Configure Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your database credentials
# Default values should work for local PostgreSQL:
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=pla_command_atlas
# DB_USER=postgres
# DB_PASSWORD=postgres
# PORT=3000
# CORS_ORIGIN=http://localhost:4200
```

## Step 4: Apply Database Schema

```bash
# From backend directory
psql -U postgres -d pla_command_atlas -f schema.sql
```

Verify tables were created:
```bash
psql -U postgres -d pla_command_atlas -c "\dt"
```

Expected output: 16 tables (land_units, arm_types, weapon_categories, etc.)

## Step 5: Import Excel Data

```bash
# From backend directory
npm run import
```

This will:
- Read JSON files from `../src/assets/data/raw/`
- Parse array-of-arrays format
- Map columns to PostgreSQL fields
- Import data with explicit null handling
- Print summary of rows imported per table

## Step 6: Start Backend Server

```bash
# From backend directory
npm start
```

Server will start on http://localhost:3000

For development with auto-reload:
```bash
npm run dev
```

## Step 7: Verify Backend Health

```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-07-07T..."
}
```

## Step 8: Start Angular with Proxy

```bash
# From project root (not backend directory)
ng serve --proxy-config proxy.conf.json
```

Angular will start on http://localhost:4200 with `/api/*` requests proxied to backend on port 3000.

## Step 9: Test Integration

Open browser to http://localhost:4200 and verify:
- Land page loads with data from API
- Navigation works
- All components display data correctly

## Troubleshooting

### PostgreSQL Connection Failed

**Error:** `connection refused` or `password authentication failed`

**Solution:**
```bash
# Check PostgreSQL is running
brew services list  # macOS
sudo systemctl status postgresql  # Linux

# Check database exists
psql -U postgres -l

# Reset PostgreSQL password if needed
psql -U postgres -c "ALTER USER postgres PASSWORD 'your_password';"
```

### Import Script Fails

**Error:** `File not found` or `ENOENT`

**Solution:**
- Ensure you're running import from `backend/` directory
- Verify JSON files exist in `../src/assets/data/raw/`
- Check file permissions

### Schema Application Fails

**Error:** `relation already exists` or syntax errors

**Solution:**
```bash
# Drop database and recreate
psql -U postgres -c "DROP DATABASE pla_command_atlas;"
createdb -U postgres pla_command_atlas
psql -U postgres -d pla_command_atlas -f schema.sql
```

### API Returns 404

**Error:** `Cannot GET /api/...`

**Solution:**
- Verify backend is running on port 3000
- Check route is mounted in `server.js`
- Ensure CORS origin matches Angular dev server

### Angular Proxy Not Working

**Error:** CORS errors in browser console

**Solution:**
- Ensure `proxy.conf.json` is in project root
- Start Angular with `--proxy-config proxy.conf.json`
- Verify backend is running on port 3000
- Check CORS_ORIGIN in backend `.env` matches Angular URL

### Data Not Displaying in Angular

**Error:** Components show no data

**Solution:**
- Check browser console for API errors
- Verify backend health check works
- Test API endpoints directly with curl
- Check ExcelDataService has `useApi = true` (default)
- Fallback to local JSON should work if API fails

## Verification Commands

### Check Database Row Counts
```bash
psql -U postgres -d pla_command_atlas -c "
SELECT 
  'land_units' as table_name, COUNT(*) as row_count FROM land_units
UNION ALL
SELECT 'arm_types', COUNT(*) FROM arm_types
UNION ALL
SELECT 'weapon_categories', COUNT(*) FROM weapon_categories
UNION ALL
SELECT 'theater_capabilities', COUNT(*) FROM theater_capabilities;
"
```

### Test Specific API Endpoints
```bash
# Land units
curl http://localhost:3000/api/land-units

# Theater capabilities
curl http://localhost:3000/api/theater-capabilities

# Raw sheet data (for /data preservation)
curl http://localhost:3000/api/raw/1_Land_Units
```

## Data Refresh

To refresh data after Excel file changes:

```bash
# From backend directory
npm run import
```

This will truncate tables and re-import from current JSON files.

## Switching Between API and Local JSON

To use local JSON instead of API:

1. Edit `src/app/services/excel-data.service.ts`
2. Change `private useApi = true;` to `private useApi = false;`
3. Restart Angular dev server

## Production Deployment

For production:

1. Set environment variables:
   ```bash
   export DB_HOST=your-production-db-host
   export DB_PORT=5432
   export DB_NAME=pla_command_atlas
   export DB_USER=your-db-user
   export DB_PASSWORD=your-db-password
   export PORT=3000
   export CORS_ORIGIN=https://your-domain.com
   ```

2. Build Angular:
   ```bash
   ng build --configuration production
   ```

3. Serve backend with process manager (PM2, systemd, etc.)
4. Configure web server (Nginx) to serve Angular static files and proxy API requests

## Security Notes

- Change default PostgreSQL password in production
- Use environment variables for sensitive data
- Restrict CORS origin to your actual domain
- Enable SSL/TLS for production database connections
- Implement rate limiting on API endpoints
- Add authentication/authorization if needed
