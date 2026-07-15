const createCrudController = require(
  './crud-controller.factory'
);
const service = require(
  '../service/serviceImplementation/land-unit-resources.service-impl'
);
const LandUnitResourcesResponseDto = require(
  '../dto/land-unit-resources-response.dto'
);

module.exports = createCrudController({
  service,
  ResponseDto: LandUnitResourcesResponseDto,
  tableName: "land_unit_resources",
  title: "PLAGF – LAND UNIT RESOURCES BY BRIGADE TYPE"
});
