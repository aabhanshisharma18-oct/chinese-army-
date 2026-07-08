const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { formatToExcelArray } = require('../utils/response-formatter');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ranks ORDER BY id');
    const formatted = formatToExcelArray(result.rows, 'ranks', 'PLAGF – OFFICER & ENLISTED RANK STRUCTURE (LOWEST TO HIGHEST)');
    res.json(formatted);
  } catch (error) {
    console.error('Error fetching ranks:', error);
    res.status(500).json({ error: 'Failed to fetch ranks' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM ranks WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Rank not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching rank:', error);
    res.status(500).json({ error: 'Failed to fetch rank' });
  }
});

module.exports = router;
