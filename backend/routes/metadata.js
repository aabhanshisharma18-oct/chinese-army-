const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const fs = require('fs');
const path = require('path');

// Load sections configuration
const sectionsConfigPath = path.join(__dirname, '../config/sections.json');
let sectionsConfig;

try {
  sectionsConfig = JSON.parse(fs.readFileSync(sectionsConfigPath, 'utf8'));
} catch (error) {
  console.error('Failed to load sections config:', error);
  sectionsConfig = { sections: [], excludedColumns: [], longTextFields: [] };
}

// GET /api/metadata/sections - Return section structure
router.get('/sections', (req, res) => {
  // Set cache header (1 hour)
  res.set('Cache-Control', 'public, max-age=3600');
  res.json(sectionsConfig);
});

// GET /api/metadata/filters/:table - Return filterable columns for a table
router.get('/filters/:table', async (req, res) => {
  try {
    const tableName = req.params.table;
    
    // Get table columns from PostgreSQL
    const columnsQuery = `
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = $1 
      AND table_schema = 'public'
      ORDER BY ordinal_position
    `;
    
    const result = await pool.query(columnsQuery, [tableName]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Table not found' });
    }
    
    // Filter out excluded columns and long text fields
    const excludedColumns = sectionsConfig.excludedColumns || [];
    const longTextFields = sectionsConfig.longTextFields || [];
    
    const filterableColumns = result.rows
      .filter(col => {
        // Exclude system columns
        if (excludedColumns.includes(col.column_name)) return false;
        
        // Exclude long text fields
        if (longTextFields.includes(col.column_name)) return false;
        
        // Exclude TEXT data type fields (unless they're short)
        if (col.data_type === 'text' && !longTextFields.includes(col.column_name)) {
          // Allow TEXT fields that aren't in the long text list
          return true;
        }
        
        // Exclude large object types
        if (col.data_type === 'bytea') return false;
        
        return true;
      })
      .map(col => ({
        name: col.column_name,
        type: col.data_type
      }));
    
    // Set cache header (1 hour)
    res.set('Cache-Control', 'public, max-age=3600');
    res.json({
      table: tableName,
      filterableColumns: filterableColumns
    });
  } catch (error) {
    console.error('Error fetching filter metadata:', error);
    res.status(500).json({ error: 'Failed to fetch filter metadata' });
  }
});

// GET /api/metadata/filter-values/:table/:column - Get distinct values for a filter column
router.get('/filter-values/:table/:column', async (req, res) => {
  try {
    const tableName = req.params.table;
    const columnName = req.params.column;
    
    // Validate column name to prevent SQL injection
    const validColumnName = /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(columnName);
    if (!validColumnName) {
      return res.status(400).json({ error: 'Invalid column name' });
    }
    
    // Query distinct values, sorted alphabetically
    const query = `
      SELECT DISTINCT ${columnName}
      FROM ${tableName}
      WHERE ${columnName} IS NOT NULL
      AND ${columnName} != ''
      ORDER BY ${columnName} ASC
    `;
    
    const result = await pool.query(query);
    
    const values = result.rows.map(row => row[columnName]).filter(v => v !== null && v !== '');
    
    // Set cache header (30 minutes - values may change less frequently)
    res.set('Cache-Control', 'public, max-age=1800');
    res.json({
      table: tableName,
      column: columnName,
      values: values
    });
  } catch (error) {
    console.error('Error fetching filter values:', error);
    
    // Check if table or column doesn't exist
    if (error.code === '42P01') {
      return res.status(404).json({ error: 'Table not found' });
    }
    if (error.code === '42703') {
      return res.status(404).json({ error: 'Column not found' });
    }
    
    res.status(500).json({ error: 'Failed to fetch filter values' });
  }
});

module.exports = router;
