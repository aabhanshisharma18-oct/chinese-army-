const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { formatToExcelArray } = require('../utils/response-formatter');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM arm_types ORDER BY id');
    const formatted = formatToExcelArray(result.rows, 'arm_types', 'PLAGF – ARM TYPES / BRANCHES OF SERVICE (兵种)');
    res.json(formatted);
  } catch (error) {
    console.error('Error fetching arm types:', error);
    res.status(500).json({ error: 'Failed to fetch arm types' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM arm_types WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Arm type not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching arm type:', error);
    res.status(500).json({ error: 'Failed to fetch arm type' });
  }
});

module.exports = router;
