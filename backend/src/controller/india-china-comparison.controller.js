const createCrudController = require(
  './crud-controller.factory'
);
const service = require(
  '../service/serviceImplementation/india-china-comparison.service-impl'
);
const IndiaChinaComparisonResponseDto = require(
  '../dto/india-china-comparison-response.dto'
);

module.exports = createCrudController({
  service,
  ResponseDto: IndiaChinaComparisonResponseDto,
  tableName: "india_china_comparison",
  title: "INDIA-CHINA UNIT HIERARCHY COMPARISON"
});
