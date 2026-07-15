const LandUnitResourcesService = require(
  '../service/land-unit-resources.service'
);
const dao = require('../../dao/land-unit-resources.dao');
const LandUnitResourcesDto = require(
  '../../dto/land-unit-resources.dto'
);
const LandUnitResourcesEntity = require(
  '../../entity/land-unit-resources.entity'
);

class LandUnitResourcesServiceImpl extends LandUnitResourcesService {
  async getAll() {
    const rows = await dao.findAll();

    return rows.map(
      row => new LandUnitResourcesEntity(row)
    );
  }

  async getById(id) {
    const row = await dao.findById(id);

    return row
      ? new LandUnitResourcesEntity(row)
      : null;
  }

  async create(data) {
    const dto = new LandUnitResourcesDto(data);
    const row = await dao.create(dto.toObject());

    return new LandUnitResourcesEntity(row);
  }

  async update(id, data) {
    const dto = new LandUnitResourcesDto(data);
    const row = await dao.update(
      id,
      dto.toObject()
    );

    return row
      ? new LandUnitResourcesEntity(row)
      : null;
  }

  async delete(id) {
    return dao.delete(id);
  }
}

module.exports = new LandUnitResourcesServiceImpl();
