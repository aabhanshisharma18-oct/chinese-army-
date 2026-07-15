const VehicleSpeedsService = require(
  '../service/vehicle-speeds.service'
);
const dao = require('../../dao/vehicle-speeds.dao');
const VehicleSpeedsDto = require(
  '../../dto/vehicle-speeds.dto'
);
const VehicleSpeedsEntity = require(
  '../../entity/vehicle-speeds.entity'
);

class VehicleSpeedsServiceImpl extends VehicleSpeedsService {
  async getAll() {
    const rows = await dao.findAll();

    return rows.map(
      row => new VehicleSpeedsEntity(row)
    );
  }

  async getById(id) {
    const row = await dao.findById(id);

    return row
      ? new VehicleSpeedsEntity(row)
      : null;
  }

  async create(data) {
    const dto = new VehicleSpeedsDto(data);
    const row = await dao.create(dto.toObject());

    return new VehicleSpeedsEntity(row);
  }

  async update(id, data) {
    const dto = new VehicleSpeedsDto(data);
    const row = await dao.update(
      id,
      dto.toObject()
    );

    return row
      ? new VehicleSpeedsEntity(row)
      : null;
  }

  async delete(id) {
    return dao.delete(id);
  }
}

module.exports = new VehicleSpeedsServiceImpl();
