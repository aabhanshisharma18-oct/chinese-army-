const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { formatToExcelArray } = require('../utils/response-formatter');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM air_defence_detailed ORDER BY id');
    const formatted = formatToExcelArray(result.rows, 'air_defence_detailed', 'PLAGF AIR DEFENCE – DETAILED SYSTEM SPECIFICATIONS (13 SYSTEMS)');
    res.json(formatted);
  } catch (error) {
    console.error('Error fetching air defence detailed:', error);
    res.status(500).json({ error: 'Failed to fetch air defence detailed' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM air_defence_detailed WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Air defence detailed not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching air defence detailed:', error);
    res.status(500).json({ error: 'Failed to fetch air defence detailed' });
  }
});

module.exports = router;
