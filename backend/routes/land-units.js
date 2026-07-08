const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { formatToExcelArray, formatFullExcelResponse } = require('../utils/response-formatter');

// GET all land units (formatted for Angular compatibility)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM land_units ORDER BY id');
    const formatted = formatToExcelArray(result.rows, 'land_units', 'CHINESE ARMY (PLAGF) – LAND UNITS DATABASE');
    res.json(formatted);
  } catch (error) {
    console.error('Error fetching land units:', error);
    res.status(500).json({ error: 'Failed to fetch land units' });
  }
});

// GET single land unit by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM land_units WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Land unit not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching land unit:', error);
    res.status(500).json({ error: 'Failed to fetch land unit' });
  }
});

module.exports = router;
