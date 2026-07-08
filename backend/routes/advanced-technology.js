const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { formatToExcelArray } = require('../utils/response-formatter');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM advanced_technology ORDER BY id');
    const formatted = formatToExcelArray(result.rows, 'advanced_technology', 'PLAGF – ADVANCED TECHNOLOGY CAPABILITIES');
    res.json(formatted);
  } catch (error) {
    console.error('Error fetching advanced technology:', error);
    res.status(500).json({ error: 'Failed to fetch advanced technology' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM advanced_technology WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Advanced technology not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching advanced technology:', error);
    res.status(500).json({ error: 'Failed to fetch advanced technology' });
  }
});

module.exports = router;
