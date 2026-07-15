const createCrudController = require('./crud-controller.factory');
const service = require('../service/serviceImplementation/workbook-index.service-impl');
const WorkbookIndexResponseDto = require('../dto/workbook-index-response.dto');

module.exports = createCrudController({
  service,
  ResponseDto: WorkbookIndexResponseDto,
  tableName: 'workbook_index',
  title: 'CHINESE ARMY DATABASE – INDEX & USER GUIDE'
});
