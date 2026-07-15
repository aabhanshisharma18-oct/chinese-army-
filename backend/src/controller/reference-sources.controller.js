const createCrudController = require('./crud-controller.factory');
const service = require('../service/serviceImplementation/reference-sources.service-impl');
const ReferenceSourcesResponseDto = require('../dto/reference-sources-response.dto');

module.exports = createCrudController({
  service,
  ResponseDto: ReferenceSourcesResponseDto,
  tableName: 'reference_sources',
  title: 'COMPLETE REFERENCE LIST – ALL SOURCES'
});
