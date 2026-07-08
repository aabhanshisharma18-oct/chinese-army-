const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { formatToExcelArray } = require('../utils/response-formatter');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM unit_categories ORDER BY id');
    const formatted = formatToExcelArray(result.rows, 'unit_categories', 'PLAGF – UNIT CATEGORIES (CATEGORY A vs B)');
    res.json(formatted);
  } catch (error) {
    console.error('Error fetching unit categories:', error);
    res.status(500).json({ error: 'Failed to fetch unit categories' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM unit_categories WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Unit category not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching unit category:', error);
    res.status(500).json({ error: 'Failed to fetch unit category' });
  }
});

module.exports = router;
