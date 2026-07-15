const UnitCategoriesService = require(
  '../service/unit-categories.service'
);
const dao = require('../../dao/unit-categories.dao');
const UnitCategoriesDto = require(
  '../../dto/unit-categories.dto'
);
const UnitCategoriesEntity = require(
  '../../entity/unit-categories.entity'
);

class UnitCategoriesServiceImpl extends UnitCategoriesService {
  async getAll() {
    const rows = await dao.findAll();

    return rows.map(
      row => new UnitCategoriesEntity(row)
    );
  }

  async getById(id) {
    const row = await dao.findById(id);

    return row
      ? new UnitCategoriesEntity(row)
      : null;
  }

  async create(data) {
    const dto = new UnitCategoriesDto(data);
    const row = await dao.create(dto.toObject());

    return new UnitCategoriesEntity(row);
  }

  async update(id, data) {
    const dto = new UnitCategoriesDto(data);
    const row = await dao.update(
      id,
      dto.toObject()
    );

    return row
      ? new UnitCategoriesEntity(row)
      : null;
  }

  async delete(id) {
    return dao.delete(id);
  }
}

module.exports = new UnitCategoriesServiceImpl();
