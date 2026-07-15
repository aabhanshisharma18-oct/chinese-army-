const AviationDetailedService = require(
  '../service/aviation-detailed.service'
);
const dao = require('../../dao/aviation-detailed.dao');
const AviationDetailedDto = require(
  '../../dto/aviation-detailed.dto'
);
const AviationDetailedEntity = require(
  '../../entity/aviation-detailed.entity'
);

class AviationDetailedServiceImpl extends AviationDetailedService {
  async getAll() {
    const rows = await dao.findAll();

    return rows.map(
      row => new AviationDetailedEntity(row)
    );
  }

  async getById(id) {
    const row = await dao.findById(id);

    return row
      ? new AviationDetailedEntity(row)
      : null;
  }

  async create(data) {
    const dto = new AviationDetailedDto(data);
    const row = await dao.create(dto.toObject());

    return new AviationDetailedEntity(row);
  }

  async update(id, data) {
    const dto = new AviationDetailedDto(data);
    const row = await dao.update(
      id,
      dto.toObject()
    );

    return row
      ? new AviationDetailedEntity(row)
      : null;
  }

  async delete(id) {
    return dao.delete(id);
  }
}

module.exports = new AviationDetailedServiceImpl();
