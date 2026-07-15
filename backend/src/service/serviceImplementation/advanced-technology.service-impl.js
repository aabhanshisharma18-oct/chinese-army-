const AdvancedTechnologyService = require(
  '../service/advanced-technology.service'
);
const dao = require('../../dao/advanced-technology.dao');
const AdvancedTechnologyDto = require(
  '../../dto/advanced-technology.dto'
);
const AdvancedTechnologyEntity = require(
  '../../entity/advanced-technology.entity'
);

class AdvancedTechnologyServiceImpl extends AdvancedTechnologyService {
  async getAll() {
    const rows = await dao.findAll();

    return rows.map(
      row => new AdvancedTechnologyEntity(row)
    );
  }

  async getById(id) {
    const row = await dao.findById(id);

    return row
      ? new AdvancedTechnologyEntity(row)
      : null;
  }

  async create(data) {
    const dto = new AdvancedTechnologyDto(data);
    const row = await dao.create(dto.toObject());

    return new AdvancedTechnologyEntity(row);
  }

  async update(id, data) {
    const dto = new AdvancedTechnologyDto(data);
    const row = await dao.update(
      id,
      dto.toObject()
    );

    return row
      ? new AdvancedTechnologyEntity(row)
      : null;
  }

  async delete(id) {
    return dao.delete(id);
  }
}

module.exports = new AdvancedTechnologyServiceImpl();
