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
const landUnitsRoutes = require('./src/controller/land-unit.controller');
const armTypesRoutes = require('./src/controller/arm-types.controller');
const weaponCategoriesRoutes = require('./src/controller/weapon-categories.controller');
const weaponSensorsRoutes = require('./src/controller/weapon-sensors.controller');
const landUnitResourcesRoutes = require('./src/controller/land-unit-resources.controller');
const vehicleSpeedsRoutes = require('./src/controller/vehicle-speeds.controller');
const frontageDepthRoutes = require('./src/controller/frontage-depth.controller');
const forcePotentialRoutes = require('./src/controller/force-potential.controller');
const vehicleDesignationsRoutes = require('./src/controller/vehicle-designations.controller');
const ranksRoutes = require('./src/controller/ranks.controller');
const indiaChinaComparisonRoutes = require('./src/controller/india-china-comparison.controller');
const theaterCapabilitiesRoutes = require('./src/controller/theater-capabilities.controller');
const unitCategoriesRoutes = require('./src/controller/unit-categories.controller');
const advancedTechnologyRoutes = require('./src/controller/advanced-technology.controller');
const aviationDetailedRoutes = require('./src/controller/aviation-detailed.controller');
const airDefenceDetailedRoutes = require('./src/controller/air-defence-detailed.controller');
const metadataRoutes = require('./src/controller/metadata.controller');
const workbookIndexRoutes = require('./src/controller/workbook-index.controller');
const referenceSourcesRoutes = require('./src/controller/reference-sources.controller');

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
app.use('/api/workbook-index', workbookIndexRoutes);
app.use('/api/reference-sources', referenceSourcesRoutes);

// Serve the prebuilt Angular application for portable/offline deployments.
// API routes above remain available when PostgreSQL is configured, while the
// frontend itself uses its bundled data and therefore works without it.
const FRONTEND_DIST = path.join(__dirname, '../frontend/dist/pla-command-atlas');
if (fs.existsSync(FRONTEND_DIST)) {
  app.use(express.static(FRONTEND_DIST));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(FRONTEND_DIST, 'index.html'));
  });
}

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack || err);

  const statusCode = err.statusCode || 500;
  const response = {
    error: statusCode === 500
      ? 'Internal server error'
      : err.message
  };

  if (err.details) {
    response.details = err.details;
  }

  res.status(statusCode).json(response);
});

// Start server
app.listen(PORT, '127.0.0.1', () => {
  console.log(`PLA Command Atlas API server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
