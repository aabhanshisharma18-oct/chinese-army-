const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { formatToExcelArray } = require('../utils/response-formatter');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM vehicle_designations ORDER BY id');
    const formatted = formatToExcelArray(result.rows, 'vehicle_designations', 'PLAGF – VEHICLE DESIGNATIONS & \'A\'/\'B\' TYPE BREAKDOWN');
    res.json(formatted);
  } catch (error) {
    console.error('Error fetching vehicle designations:', error);
    res.status(500).json({ error: 'Failed to fetch vehicle designations' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM vehicle_designations WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Vehicle designation not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching vehicle designation:', error);
    res.status(500).json({ error: 'Failed to fetch vehicle designation' });
  }
});

module.exports = router;
