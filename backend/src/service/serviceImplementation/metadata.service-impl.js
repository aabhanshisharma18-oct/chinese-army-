const fs = require('fs');
const path = require('path');

const MetadataService = require(
  '../service/metadata.service'
);
const metadataDao = require('../../dao/metadata.dao');

class MetadataServiceImpl extends MetadataService {
  constructor() {
    super();

    const configPath = path.join(
      __dirname,
      '../../../config/sections.json'
    );

    try {
      this.sectionsConfig = JSON.parse(
        fs.readFileSync(configPath, 'utf8')
      );
    } catch (error) {
      console.error(
        'Failed to load sections configuration:',
        error
      );

      this.sectionsConfig = {
        sections: [],
        excludedColumns: [],
        longTextFields: []
      };
    }
  }

  getSections() {
    return this.sectionsConfig;
  }

  async getFilters(tableName) {
    const columns = await metadataDao.getColumns(
      tableName
    );

    if (columns.length === 0) {
      const error = new Error('Table not found');
      error.statusCode = 404;
      throw error;
    }

    const excludedColumns =
      this.sectionsConfig.excludedColumns || [];

    const longTextFields =
      this.sectionsConfig.longTextFields || [];

    const filterableColumns = columns
      .filter(column => {
        if (
          excludedColumns.includes(
            column.column_name
          )
        ) {
          return false;
        }

        if (
          longTextFields.includes(
            column.column_name
          )
        ) {
          return false;
        }

        return column.data_type !== 'bytea';
      })
      .map(column => ({
        name: column.column_name,
        type: column.data_type
      }));

    return {
      table: tableName,
      filterableColumns
    };
  }

  async getFilterValues(
    tableName,
    columnName
  ) {
    const values =
      await metadataDao.getDistinctValues(
        tableName,
        columnName
      );

    return {
      table: tableName,
      column: columnName,
      values
    };
  }
}

module.exports = new MetadataServiceImpl();
