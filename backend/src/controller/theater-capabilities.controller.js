const createCrudController = require(
  './crud-controller.factory'
);
const service = require(
  '../service/serviceImplementation/theater-capabilities.service-impl'
);
const TheaterCapabilitiesResponseDto = require(
  '../dto/theater-capabilities-response.dto'
);

module.exports = createCrudController({
  service,
  ResponseDto: TheaterCapabilitiesResponseDto,
  tableName: "theater_capabilities",
  title: "PLAGF – THEATER COMMAND CAPABILITIES & STRUCTURE"
});
