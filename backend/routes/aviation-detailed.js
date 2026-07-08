const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { formatToExcelArray } = require('../utils/response-formatter');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM aviation_detailed ORDER BY id');
    const formatted = formatToExcelArray(result.rows, 'aviation_detailed', 'PLAGF/PLA ARMY AVIATION – DETAILED HELICOPTER SPECIFICATIONS (12 MODELS)');
    res.json(formatted);
  } catch (error) {
    console.error('Error fetching aviation detailed:', error);
    res.status(500).json({ error: 'Failed to fetch aviation detailed' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM aviation_detailed WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Aviation detailed not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching aviation detailed:', error);
    res.status(500).json({ error: 'Failed to fetch aviation detailed' });
  }
});

module.exports = router;
