const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { formatToExcelArray } = require('../utils/response-formatter');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM force_potential ORDER BY id');
    const formatted = formatToExcelArray(result.rows, 'force_potential', 'PLAGF – FORCE POTENTIAL & STRATEGIC CAPABILITIES');
    res.json(formatted);
  } catch (error) {
    console.error('Error fetching force potential:', error);
    res.status(500).json({ error: 'Failed to fetch force potential' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM force_potential WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Force potential not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching force potential:', error);
    res.status(500).json({ error: 'Failed to fetch force potential' });
  }
});

module.exports = router;
