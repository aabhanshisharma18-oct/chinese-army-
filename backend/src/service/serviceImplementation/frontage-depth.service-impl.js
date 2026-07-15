const FrontageDepthService = require(
  '../service/frontage-depth.service'
);
const dao = require('../../dao/frontage-depth.dao');
const FrontageDepthDto = require(
  '../../dto/frontage-depth.dto'
);
const FrontageDepthEntity = require(
  '../../entity/frontage-depth.entity'
);

class FrontageDepthServiceImpl extends FrontageDepthService {
  async getAll() {
    const rows = await dao.findAll();

    return rows.map(
      row => new FrontageDepthEntity(row)
    );
  }

  async getById(id) {
    const row = await dao.findById(id);

    return row
      ? new FrontageDepthEntity(row)
      : null;
  }

  async create(data) {
    const dto = new FrontageDepthDto(data);
    const row = await dao.create(dto.toObject());

    return new FrontageDepthEntity(row);
  }

  async update(id, data) {
    const dto = new FrontageDepthDto(data);
    const row = await dao.update(
      id,
      dto.toObject()
    );

    return row
      ? new FrontageDepthEntity(row)
      : null;
  }

  async delete(id) {
    return dao.delete(id);
  }
}

module.exports = new FrontageDepthServiceImpl();
