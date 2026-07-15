const WeaponSensorsService = require(
  '../service/weapon-sensors.service'
);
const dao = require('../../dao/weapon-sensors.dao');
const WeaponSensorsDto = require(
  '../../dto/weapon-sensors.dto'
);
const WeaponSensorsEntity = require(
  '../../entity/weapon-sensors.entity'
);

class WeaponSensorsServiceImpl extends WeaponSensorsService {
  async getAll() {
    const rows = await dao.findAll();

    return rows.map(
      row => new WeaponSensorsEntity(row)
    );
  }

  async getById(id) {
    const row = await dao.findById(id);

    return row
      ? new WeaponSensorsEntity(row)
      : null;
  }

  async create(data) {
    const dto = new WeaponSensorsDto(data);
    const row = await dao.create(dto.toObject());

    return new WeaponSensorsEntity(row);
  }

  async update(id, data) {
    const dto = new WeaponSensorsDto(data);
    const row = await dao.update(
      id,
      dto.toObject()
    );

    return row
      ? new WeaponSensorsEntity(row)
      : null;
  }

  async delete(id) {
    return dao.delete(id);
  }
}

module.exports = new WeaponSensorsServiceImpl();
