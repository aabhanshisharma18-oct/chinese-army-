# PLA Command Atlas Backend

Node.js + Express backend API for PLA Command Atlas with PostgreSQL database.

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)

## Setup

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your database credentials:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=pla_command_atlas
   DB_USER=postgres
   DB_PASSWORD=your_password
   PORT=3000
   ```

3. **Create PostgreSQL database:**
   ```bash
   createdb pla_command_atlas
   ```

4. **Run schema migration:**
   ```bash
   psql -U postgres -d pla_command_atlas -f schema.sql
   ```

5. **Import Excel data:**
   ```bash
   npm run import
   ```
   
   This will read JSON files from `../src/assets/data/raw/` and import them into PostgreSQL.

6. **Start the server:**
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

## API Endpoints

### Health Check
- `GET /api/health` - Server health status

### Data Endpoints
- `GET /api/land-units` - All land units
- `GET /api/land-units/:id` - Single land unit
- `GET /api/arm-types` - All arm types
- `GET /api/arm-types/:id` - Single arm type
- `GET /api/weapon-categories` - All weapon categories
- `GET /api/weapon-categories/:id` - Single weapon category
- `GET /api/weapon-sensors` - All weapon sensors
- `GET /api/weapon-sensors/:id` - Single weapon sensor
- `GET /api/land-unit-resources` - All land unit resources
- `GET /api/land-unit-resources/:id` - Single land unit resource
- `GET /api/vehicle-speeds` - All vehicle speeds
- `GET /api/vehicle-speeds/:id` - Single vehicle speed
- `GET /api/frontage-depth` - All frontage depth data
- `GET /api/frontage-depth/:id` - Single frontage depth entry
- `GET /api/force-potential` - All force potential metrics
- `GET /api/force-potential/:id` - Single force potential metric
- `GET /api/vehicle-designations` - All vehicle designations
- `GET /api/vehicle-designations/:id` - Single vehicle designation
- `GET /api/ranks` - All ranks
- `GET /api/ranks/:id` - Single rank
- `GET /api/india-china-comparison` - All India-China comparisons
- `GET /api/india-china-comparison/:id` - Single India-China comparison
- `GET /api/theater-capabilities` - All theater capabilities
- `GET /api/theater-capabilities/:id` - Single theater capability
- `GET /api/unit-categories` - All unit categories
- `GET /api/unit-categories/:id` - Single unit category
- `GET /api/advanced-technology` - All advanced technology entries
- `GET /api/advanced-technology/:id` - Single advanced technology entry
- `GET /api/aviation-detailed` - All aviation detailed data
- `GET /api/aviation-detailed/:id` - Single aviation detailed entry
- `GET /api/air-defence-detailed` - All air defence detailed data
- `GET /api/air-defence-detailed/:id` - Single air defence detailed entry

### Raw Data Endpoint (for /data preservation)
- `GET /api/raw/:sheetName` - Returns raw JSON for a specific sheet (e.g., `1_Land_Units`)

## Database Schema

The database contains 16 tables corresponding to Excel sheets 1-14, 16, and 17:
- `land_units` - Sheet 1
- `arm_types` - Sheet 2
- `weapon_categories` - Sheet 3
- `weapon_sensors` - Sheet 4
- `land_unit_resources` - Sheet 5
- `vehicle_speeds` - Sheet 6
- `frontage_depth` - Sheet 7
- `force_potential` - Sheet 8
- `vehicle_designations` - Sheet 9
- `ranks` - Sheet 10
- `india_china_comparison` - Sheet 11
- `theater_capabilities` - Sheet 12
- `unit_categories` - Sheet 13
- `advanced_technology` - Sheet 14
- `aviation_detailed` - Sheet 16
- `air_defence_detailed` - Sheet 17

Note: Sheet 15 (References) is kept as static JSON and not migrated to the database.

## Import Behavior

The import script:
1. Reads JSON files from `../src/assets/data/raw/`
2. Parses array-of-arrays format (skips title and header rows)
3. Maps Excel columns to PostgreSQL table fields
4. Truncates existing tables before import (TRUNCATE ... RESTART IDENTITY CASCADE)
5. Inserts data row by row with error handling

## Angular Integration

The Angular frontend is configured to:
1. Use API mode by default (`ExcelDataService.useApi = true`)
2. Fall back to local JSON if API requests fail
3. Proxy `/api/*` requests to `http://localhost:3000` via `proxy.conf.json`

To run Angular with the backend:
```bash
# Terminal 1: Start backend
cd backend
npm start

# Terminal 2: Start Angular with proxy
ng serve --proxy-config proxy.conf.json
```

## Troubleshooting

**Connection refused:**
- Ensure PostgreSQL is running
- Check database credentials in `.env`
- Verify database exists: `psql -U postgres -l`

**Import fails:**
- Ensure JSON files exist in `../src/assets/data/raw/`
- Check file permissions
- Verify schema is applied: `psql -U postgres -d pla_command_atlas -c "\dt"`

**API returns 404:**
- Check server is running on port 3000
- Verify route is mounted in `server.js`
- Check CORS configuration

**Angular proxy not working:**
- Ensure proxy.conf.json is in project root
- Start Angular with `--proxy-config proxy.conf.json`
- Check backend is running on port 3000
