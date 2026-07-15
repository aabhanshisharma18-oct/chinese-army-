const RanksService = require(
  '../service/ranks.service'
);
const dao = require('../../dao/ranks.dao');
const RanksDto = require(
  '../../dto/ranks.dto'
);
const RanksEntity = require(
  '../../entity/ranks.entity'
);

class RanksServiceImpl extends RanksService {
  async getAll() {
    const rows = await dao.findAll();

    return rows.map(
      row => new RanksEntity(row)
    );
  }

  async getById(id) {
    const row = await dao.findById(id);

    return row
      ? new RanksEntity(row)
      : null;
  }

  async create(data) {
    const dto = new RanksDto(data);
    const row = await dao.create(dto.toObject());

    return new RanksEntity(row);
  }

  async update(id, data) {
    const dto = new RanksDto(data);
    const row = await dao.update(
      id,
      dto.toObject()
    );

    return row
      ? new RanksEntity(row)
      : null;
  }

  async delete(id) {
    return dao.delete(id);
  }
}

module.exports = new RanksServiceImpl();
