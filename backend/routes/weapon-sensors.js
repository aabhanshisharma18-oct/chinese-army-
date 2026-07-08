const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { formatToExcelArray } = require('../utils/response-formatter');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM weapon_sensors ORDER BY id');
    const formatted = formatToExcelArray(result.rows, 'weapon_sensors', 'PLAGF – WEAPONS & SENSOR SYSTEMS: DETECTION vs ENGAGEMENT RANGES');
    res.json(formatted);
  } catch (error) {
    console.error('Error fetching weapon sensors:', error);
    res.status(500).json({ error: 'Failed to fetch weapon sensors' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM weapon_sensors WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Weapon sensor not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching weapon sensor:', error);
    res.status(500).json({ error: 'Failed to fetch weapon sensor' });
  }
});

module.exports = router;
