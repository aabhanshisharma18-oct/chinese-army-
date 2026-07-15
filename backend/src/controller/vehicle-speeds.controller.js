const createCrudController = require(
  './crud-controller.factory'
);
const service = require(
  '../service/serviceImplementation/vehicle-speeds.service-impl'
);
const VehicleSpeedsResponseDto = require(
  '../dto/vehicle-speeds-response.dto'
);

module.exports = createCrudController({
  service,
  ResponseDto: VehicleSpeedsResponseDto,
  tableName: "vehicle_speeds",
  title: "PLAGF – VEHICLE SPEEDS (DAY & NIGHT)"
});
