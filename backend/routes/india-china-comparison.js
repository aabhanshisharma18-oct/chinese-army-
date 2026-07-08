const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { formatToExcelArray } = require('../utils/response-formatter');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM india_china_comparison ORDER BY id');
    const formatted = formatToExcelArray(result.rows, 'india_china_comparison', 'INDIA-CHINA UNIT HIERARCHY COMPARISON');
    res.json(formatted);
  } catch (error) {
    console.error('Error fetching India-China comparisons:', error);
    res.status(500).json({ error: 'Failed to fetch India-China comparisons' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM india_china_comparison WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'India-China comparison not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching India-China comparison:', error);
    res.status(500).json({ error: 'Failed to fetch India-China comparison' });
  }
});

module.exports = router;
