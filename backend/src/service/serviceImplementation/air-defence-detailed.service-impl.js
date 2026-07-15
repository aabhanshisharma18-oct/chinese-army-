const AirDefenceDetailedService = require(
  '../service/air-defence-detailed.service'
);
const dao = require('../../dao/air-defence-detailed.dao');
const AirDefenceDetailedDto = require(
  '../../dto/air-defence-detailed.dto'
);
const AirDefenceDetailedEntity = require(
  '../../entity/air-defence-detailed.entity'
);

class AirDefenceDetailedServiceImpl extends AirDefenceDetailedService {
  async getAll() {
    const rows = await dao.findAll();

    return rows.map(
      row => new AirDefenceDetailedEntity(row)
    );
  }

  async getById(id) {
    const row = await dao.findById(id);

    return row
      ? new AirDefenceDetailedEntity(row)
      : null;
  }

  async create(data) {
    const dto = new AirDefenceDetailedDto(data);
    const row = await dao.create(dto.toObject());

    return new AirDefenceDetailedEntity(row);
  }

  async update(id, data) {
    const dto = new AirDefenceDetailedDto(data);
    const row = await dao.update(
      id,
      dto.toObject()
    );

    return row
      ? new AirDefenceDetailedEntity(row)
      : null;
  }

  async delete(id) {
    return dao.delete(id);
  }
}

module.exports = new AirDefenceDetailedServiceImpl();
