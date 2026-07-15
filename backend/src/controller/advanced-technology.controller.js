const createCrudController = require(
  './crud-controller.factory'
);
const service = require(
  '../service/serviceImplementation/advanced-technology.service-impl'
);
const AdvancedTechnologyResponseDto = require(
  '../dto/advanced-technology-response.dto'
);

module.exports = createCrudController({
  service,
  ResponseDto: AdvancedTechnologyResponseDto,
  tableName: "advanced_technology",
  title: "PLAGF – ADVANCED TECHNOLOGY CAPABILITIES"
});
