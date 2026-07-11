const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
  credentials: true
}));
app.use(express.json());

// Serve static files for raw data endpoint
const ASSETS_PATH = path.join(__dirname, '../src/assets/data/raw');

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Raw data endpoint for /data preservation
app.get('/api/raw/:sheetName', (req, res) => {
  const sheetName = req.params.sheetName;
  const filePath = path.join(ASSETS_PATH, `${sheetName}.json`);
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Sheet not found' });
  }
  
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read sheet data' });
  }
});

// Import route handlers
const landUnitsRoutes = require('./routes/land-units');
const armTypesRoutes = require('./routes/arm-types');
const weaponCategoriesRoutes = require('./routes/weapon-categories');
const weaponSensorsRoutes = require('./routes/weapon-sensors');
const landUnitResourcesRoutes = require('./routes/land-unit-resources');
const vehicleSpeedsRoutes = require('./routes/vehicle-speeds');
const frontageDepthRoutes = require('./routes/frontage-depth');
const forcePotentialRoutes = require('./routes/force-potential');
const vehicleDesignationsRoutes = require('./routes/vehicle-designations');
const ranksRoutes = require('./routes/ranks');
const indiaChinaComparisonRoutes = require('./routes/india-china-comparison');
const theaterCapabilitiesRoutes = require('./routes/theater-capabilities');
const unitCategoriesRoutes = require('./routes/unit-categories');
const advancedTechnologyRoutes = require('./routes/advanced-technology');
const aviationDetailedRoutes = require('./routes/aviation-detailed');
const airDefenceDetailedRoutes = require('./routes/air-defence-detailed');
const metadataRoutes = require('./routes/metadata');

// Mount routes
app.use('/api/land-units', landUnitsRoutes);
app.use('/api/arm-types', armTypesRoutes);
app.use('/api/weapon-categories', weaponCategoriesRoutes);
app.use('/api/weapon-sensors', weaponSensorsRoutes);
app.use('/api/land-unit-resources', landUnitResourcesRoutes);
app.use('/api/vehicle-speeds', vehicleSpeedsRoutes);
app.use('/api/frontage-depth', frontageDepthRoutes);
app.use('/api/force-potential', forcePotentialRoutes);
app.use('/api/vehicle-designations', vehicleDesignationsRoutes);
app.use('/api/ranks', ranksRoutes);
app.use('/api/india-china-comparison', indiaChinaComparisonRoutes);
app.use('/api/theater-capabilities', theaterCapabilitiesRoutes);
app.use('/api/unit-categories', unitCategoriesRoutes);
app.use('/api/advanced-technology', advancedTechnologyRoutes);
app.use('/api/aviation-detailed', aviationDetailedRoutes);
app.use('/api/air-defence-detailed', airDefenceDetailedRoutes);
app.use('/api/metadata', metadataRoutes);

// Serve the prebuilt Angular application for portable/offline deployments.
// API routes above remain available when PostgreSQL is configured, while the
// frontend itself uses its bundled data and therefore works without it.
const FRONTEND_DIST = path.join(__dirname, '../dist/pla-command-atlas');
if (fs.existsSync(FRONTEND_DIST)) {
  app.use(express.static(FRONTEND_DIST));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(FRONTEND_DIST, 'index.html'));
  });
}

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, '127.0.0.1', () => {
  console.log(`PLA Command Atlas API server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
