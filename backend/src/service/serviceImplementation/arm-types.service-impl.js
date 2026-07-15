const ArmTypesService = require(
  '../service/arm-types.service'
);
const dao = require('../../dao/arm-types.dao');
const ArmTypesDto = require(
  '../../dto/arm-types.dto'
);
const ArmTypesEntity = require(
  '../../entity/arm-types.entity'
);

class ArmTypesServiceImpl extends ArmTypesService {
  async getAll() {
    const rows = await dao.findAll();

    return rows.map(
      row => new ArmTypesEntity(row)
    );
  }

  async getById(id) {
    const row = await dao.findById(id);

    return row
      ? new ArmTypesEntity(row)
      : null;
  }

  async create(data) {
    const dto = new ArmTypesDto(data);
    const row = await dao.create(dto.toObject());

    return new ArmTypesEntity(row);
  }

  async update(id, data) {
    const dto = new ArmTypesDto(data);
    const row = await dao.update(
      id,
      dto.toObject()
    );

    return row
      ? new ArmTypesEntity(row)
      : null;
  }

  async delete(id) {
    return dao.delete(id);
  }
}

module.exports = new ArmTypesServiceImpl();
