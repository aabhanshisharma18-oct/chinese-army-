const TheaterCapabilitiesService = require(
  '../service/theater-capabilities.service'
);
const dao = require('../../dao/theater-capabilities.dao');
const TheaterCapabilitiesDto = require(
  '../../dto/theater-capabilities.dto'
);
const TheaterCapabilitiesEntity = require(
  '../../entity/theater-capabilities.entity'
);

class TheaterCapabilitiesServiceImpl extends TheaterCapabilitiesService {
  async getAll() {
    const rows = await dao.findAll();

    return rows.map(
      row => new TheaterCapabilitiesEntity(row)
    );
  }

  async getById(id) {
    const row = await dao.findById(id);

    return row
      ? new TheaterCapabilitiesEntity(row)
      : null;
  }

  async create(data) {
    const dto = new TheaterCapabilitiesDto(data);
    const row = await dao.create(dto.toObject());

    return new TheaterCapabilitiesEntity(row);
  }

  async update(id, data) {
    const dto = new TheaterCapabilitiesDto(data);
    const row = await dao.update(
      id,
      dto.toObject()
    );

    return row
      ? new TheaterCapabilitiesEntity(row)
      : null;
  }

  async delete(id) {
    return dao.delete(id);
  }
}

module.exports = new TheaterCapabilitiesServiceImpl();
