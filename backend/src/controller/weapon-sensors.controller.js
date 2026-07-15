const createCrudController = require(
  './crud-controller.factory'
);
const service = require(
  '../service/serviceImplementation/weapon-sensors.service-impl'
);
const WeaponSensorsResponseDto = require(
  '../dto/weapon-sensors-response.dto'
);

module.exports = createCrudController({
  service,
  ResponseDto: WeaponSensorsResponseDto,
  tableName: "weapon_sensors",
  title: "PLAGF – WEAPONS & SENSOR SYSTEMS: DETECTION vs ENGAGEMENT RANGES"
});
