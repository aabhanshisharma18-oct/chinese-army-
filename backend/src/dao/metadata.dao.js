const pool = require('./database');

function validateIdentifier(value) {
  return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(value);
}

class MetadataDao {
  async getColumns(tableName) {
    if (!validateIdentifier(tableName)) {
      const error = new Error('Invalid table name');
      error.statusCode = 400;
      throw error;
    }

    const result = await pool.query(
      `
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = $1
        ORDER BY ordinal_position
      `,
      [tableName]
    );

    return result.rows;
  }

  async getDistinctValues(tableName, columnName) {
    if (
      !validateIdentifier(tableName) ||
      !validateIdentifier(columnName)
    ) {
      const error = new Error(
        'Invalid table or column name'
      );
      error.statusCode = 400;
      throw error;
    }

    const columns = await this.getColumns(tableName);

    if (columns.length === 0) {
      const error = new Error('Table not found');
      error.statusCode = 404;
      throw error;
    }

    const columnExists = columns.some(
      column => column.column_name === columnName
    );

    if (!columnExists) {
      const error = new Error('Column not found');
      error.statusCode = 404;
      throw error;
    }

    const result = await pool.query(
      `
        SELECT DISTINCT "${columnName}" AS value
        FROM "${tableName}"
        WHERE "${columnName}" IS NOT NULL
          AND BTRIM(
            CAST("${columnName}" AS TEXT)
          ) <> ''
        ORDER BY "${columnName}" ASC
      `
    );

    return result.rows.map(row => row.value);
  }
}

module.exports = new MetadataDao();
