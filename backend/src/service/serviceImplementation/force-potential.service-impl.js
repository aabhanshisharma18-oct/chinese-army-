const ForcePotentialService = require(
  '../service/force-potential.service'
);
const dao = require('../../dao/force-potential.dao');
const ForcePotentialDto = require(
  '../../dto/force-potential.dto'
);
const ForcePotentialEntity = require(
  '../../entity/force-potential.entity'
);

class ForcePotentialServiceImpl extends ForcePotentialService {
  async getAll() {
    const rows = await dao.findAll();

    return rows.map(
      row => new ForcePotentialEntity(row)
    );
  }

  async getById(id) {
    const row = await dao.findById(id);

    return row
      ? new ForcePotentialEntity(row)
      : null;
  }

  async create(data) {
    const dto = new ForcePotentialDto(data);
    const row = await dao.create(dto.toObject());

    return new ForcePotentialEntity(row);
  }

  async update(id, data) {
    const dto = new ForcePotentialDto(data);
    const row = await dao.update(
      id,
      dto.toObject()
    );

    return row
      ? new ForcePotentialEntity(row)
      : null;
  }

  async delete(id) {
    return dao.delete(id);
  }
}

module.exports = new ForcePotentialServiceImpl();
