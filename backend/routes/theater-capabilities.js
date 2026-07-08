const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { formatToExcelArray } = require('../utils/response-formatter');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM theater_capabilities ORDER BY id');
    const formatted = formatToExcelArray(result.rows, 'theater_capabilities', 'PLAGF – THEATER COMMAND CAPABILITIES & STRUCTURE');
    res.json(formatted);
  } catch (error) {
    console.error('Error fetching theater capabilities:', error);
    res.status(500).json({ error: 'Failed to fetch theater capabilities' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM theater_capabilities WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Theater capability not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching theater capability:', error);
    res.status(500).json({ error: 'Failed to fetch theater capability' });
  }
});

module.exports = router;
