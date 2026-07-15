const VehicleDesignationsService = require(
  '../service/vehicle-designations.service'
);
const dao = require('../../dao/vehicle-designations.dao');
const VehicleDesignationsDto = require(
  '../../dto/vehicle-designations.dto'
);
const VehicleDesignationsEntity = require(
  '../../entity/vehicle-designations.entity'
);

class VehicleDesignationsServiceImpl extends VehicleDesignationsService {
  async getAll() {
    const rows = await dao.findAll();

    return rows.map(
      row => new VehicleDesignationsEntity(row)
    );
  }

  async getById(id) {
    const row = await dao.findById(id);

    return row
      ? new VehicleDesignationsEntity(row)
      : null;
  }

  async create(data) {
    const dto = new VehicleDesignationsDto(data);
    const row = await dao.create(dto.toObject());

    return new VehicleDesignationsEntity(row);
  }

  async update(id, data) {
    const dto = new VehicleDesignationsDto(data);
    const row = await dao.update(
      id,
      dto.toObject()
    );

    return row
      ? new VehicleDesignationsEntity(row)
      : null;
  }

  async delete(id) {
    return dao.delete(id);
  }
}

module.exports = new VehicleDesignationsServiceImpl();
