const createCrudController = require(
  './crud-controller.factory'
);
const service = require(
  '../service/serviceImplementation/arm-types.service-impl'
);
const ArmTypesResponseDto = require(
  '../dto/arm-types-response.dto'
);

module.exports = createCrudController({
  service,
  ResponseDto: ArmTypesResponseDto,
  tableName: "arm_types",
  title: "PLAGF – ARM TYPES / BRANCHES OF SERVICE (兵种)"
});
