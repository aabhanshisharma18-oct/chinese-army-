class MetadataService {
  getSections() {
    throw new Error('getSections() must be implemented');
  }

  async getFilters(tableName) {
    throw new Error('getFilters() must be implemented');
  }

  async getFilterValues(tableName, columnName) {
    throw new Error('getFilterValues() must be implemented');
  }
}

module.exports = MetadataService;
