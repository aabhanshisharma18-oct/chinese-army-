const createCrudController = require(
  './crud-controller.factory'
);
const service = require(
  '../service/serviceImplementation/force-potential.service-impl'
);
const ForcePotentialResponseDto = require(
  '../dto/force-potential-response.dto'
);

module.exports = createCrudController({
  service,
  ResponseDto: ForcePotentialResponseDto,
  tableName: "force_potential",
  title: "PLAGF – FORCE POTENTIAL & STRATEGIC CAPABILITIES"
});
