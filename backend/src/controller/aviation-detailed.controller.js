const createCrudController = require(
  './crud-controller.factory'
);
const service = require(
  '../service/serviceImplementation/aviation-detailed.service-impl'
);
const AviationDetailedResponseDto = require(
  '../dto/aviation-detailed-response.dto'
);

module.exports = createCrudController({
  service,
  ResponseDto: AviationDetailedResponseDto,
  tableName: "aviation_detailed",
  title: "PLAGF/PLA ARMY AVIATION – DETAILED HELICOPTER SPECIFICATIONS (12 MODELS)"
});
