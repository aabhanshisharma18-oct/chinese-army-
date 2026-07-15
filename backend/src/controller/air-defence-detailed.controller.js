const createCrudController = require(
  './crud-controller.factory'
);
const service = require(
  '../service/serviceImplementation/air-defence-detailed.service-impl'
);
const AirDefenceDetailedResponseDto = require(
  '../dto/air-defence-detailed-response.dto'
);

module.exports = createCrudController({
  service,
  ResponseDto: AirDefenceDetailedResponseDto,
  tableName: "air_defence_detailed",
  title: "PLAGF AIR DEFENCE – DETAILED SYSTEM SPECIFICATIONS (13 SYSTEMS)"
});
