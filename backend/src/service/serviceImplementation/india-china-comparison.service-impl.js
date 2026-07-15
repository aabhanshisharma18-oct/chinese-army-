const IndiaChinaComparisonService = require(
  '../service/india-china-comparison.service'
);
const dao = require('../../dao/india-china-comparison.dao');
const IndiaChinaComparisonDto = require(
  '../../dto/india-china-comparison.dto'
);
const IndiaChinaComparisonEntity = require(
  '../../entity/india-china-comparison.entity'
);

class IndiaChinaComparisonServiceImpl extends IndiaChinaComparisonService {
  async getAll() {
    const rows = await dao.findAll();

    return rows.map(
      row => new IndiaChinaComparisonEntity(row)
    );
  }

  async getById(id) {
    const row = await dao.findById(id);

    return row
      ? new IndiaChinaComparisonEntity(row)
      : null;
  }

  async create(data) {
    const dto = new IndiaChinaComparisonDto(data);
    const row = await dao.create(dto.toObject());

    return new IndiaChinaComparisonEntity(row);
  }

  async update(id, data) {
    const dto = new IndiaChinaComparisonDto(data);
    const row = await dao.update(
      id,
      dto.toObject()
    );

    return row
      ? new IndiaChinaComparisonEntity(row)
      : null;
  }

  async delete(id) {
    return dao.delete(id);
  }
}

module.exports = new IndiaChinaComparisonServiceImpl();
