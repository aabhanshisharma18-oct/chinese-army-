const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { formatToExcelArray } = require('../utils/response-formatter');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM weapon_categories ORDER BY id');
    const formatted = formatToExcelArray(result.rows, 'weapon_categories', 'PLAGF – COMPLETE WEAPONS CATALOGUE BY ARM TYPE & CATEGORY');
    res.json(formatted);
  } catch (error) {
    console.error('Error fetching weapon categories:', error);
    res.status(500).json({ error: 'Failed to fetch weapon categories' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM weapon_categories WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Weapon category not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching weapon category:', error);
    res.status(500).json({ error: 'Failed to fetch weapon category' });
  }
});

module.exports = router;
