const pool = require('./database');

class BaseDao {
  constructor(tableName) {
    if (!/^[a-z_]+$/.test(tableName)) {
      throw new Error('Invalid database table name');
    }

    this.tableName = tableName;
    this.columnCache = null;
  }

  async getColumns() {
    if (this.columnCache) {
      return this.columnCache;
    }

    const result = await pool.query(
      `SELECT column_name
       FROM information_schema.columns
       WHERE table_schema = 'public'
         AND table_name = $1`,
      [this.tableName]
    );

    this.columnCache = new Set(
      result.rows.map(row => row.column_name)
    );

    return this.columnCache;
  }

  async sanitizeWriteData(data) {
    const columns = await this.getColumns();
    const sanitized = {};

    for (const [key, value] of Object.entries(data || {})) {
      if (
        columns.has(key) &&
        !['id', 'created_at', 'updated_at'].includes(key) &&
        value !== undefined
      ) {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  async findAll() {
    const result = await pool.query(
      `SELECT * FROM "${this.tableName}" ORDER BY id`
    );

    return result.rows;
  }

  async findById(id) {
    const result = await pool.query(
      `SELECT * FROM "${this.tableName}" WHERE id = $1`,
      [id]
    );

    return result.rows[0] || null;
  }

  async create(data) {
    const sanitized = await this.sanitizeWriteData(data);
    const columns = Object.keys(sanitized);

    if (columns.length === 0) {
      const error = new Error('No valid fields were supplied');
      error.statusCode = 400;
      throw error;
    }

    const placeholders = columns.map(
      (_, index) => `$${index + 1}`
    );

    const values = columns.map(
      column => sanitized[column]
    );

    const query = `
      INSERT INTO "${this.tableName}"
        (${columns.map(column => `"${column}"`).join(', ')})
      VALUES
        (${placeholders.join(', ')})
      RETURNING *
    `;

    const result = await pool.query(query, values);

    return result.rows[0];
  }

  async update(id, data) {
    const sanitized = await this.sanitizeWriteData(data);
    const columns = Object.keys(sanitized);

    if (columns.length === 0) {
      const error = new Error('No valid fields were supplied');
      error.statusCode = 400;
      throw error;
    }

    const assignments = columns.map(
      (column, index) => `"${column}" = $${index + 1}`
    );

    const tableColumns = await this.getColumns();

    if (tableColumns.has('updated_at')) {
      assignments.push('updated_at = NOW()');
    }

    const values = columns.map(
      column => sanitized[column]
    );

    values.push(id);

    const query = `
      UPDATE "${this.tableName}"
      SET ${assignments.join(', ')}
      WHERE id = $${values.length}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    return result.rows[0] || null;
  }

  async delete(id) {
    const result = await pool.query(
      `DELETE FROM "${this.tableName}"
       WHERE id = $1
       RETURNING id`,
      [id]
    );

    return result.rows[0] || null;
  }
}

module.exports = BaseDao;
