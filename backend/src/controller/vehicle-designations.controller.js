const createCrudController = require(
  './crud-controller.factory'
);
const service = require(
  '../service/serviceImplementation/vehicle-designations.service-impl'
);
const VehicleDesignationsResponseDto = require(
  '../dto/vehicle-designations-response.dto'
);

module.exports = createCrudController({
  service,
  ResponseDto: VehicleDesignationsResponseDto,
  tableName: "vehicle_designations",
  title: "PLAGF – VEHICLE DESIGNATIONS & 'A'/'B' TYPE BREAKDOWN"
});
