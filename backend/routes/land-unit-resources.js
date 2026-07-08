const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { formatToExcelArray } = require('../utils/response-formatter');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM land_unit_resources ORDER BY id');
    const formatted = formatToExcelArray(result.rows, 'land_unit_resources', 'PLAGF – LAND UNIT RESOURCES BY BRIGADE TYPE');
    res.json(formatted);
  } catch (error) {
    console.error('Error fetching land unit resources:', error);
    res.status(500).json({ error: 'Failed to fetch land unit resources' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM land_unit_resources WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Land unit resource not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching land unit resource:', error);
    res.status(500).json({ error: 'Failed to fetch land unit resource' });
  }
});

module.exports = router;
