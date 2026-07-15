const WeaponCategoriesService = require(
  '../service/weapon-categories.service'
);
const dao = require('../../dao/weapon-categories.dao');
const WeaponCategoriesDto = require(
  '../../dto/weapon-categories.dto'
);
const WeaponCategoriesEntity = require(
  '../../entity/weapon-categories.entity'
);

class WeaponCategoriesServiceImpl extends WeaponCategoriesService {
  async getAll() {
    const rows = await dao.findAll();

    return rows.map(
      row => new WeaponCategoriesEntity(row)
    );
  }

  async getById(id) {
    const row = await dao.findById(id);

    return row
      ? new WeaponCategoriesEntity(row)
      : null;
  }

  async create(data) {
    const dto = new WeaponCategoriesDto(data);
    const row = await dao.create(dto.toObject());

    return new WeaponCategoriesEntity(row);
  }

  async update(id, data) {
    const dto = new WeaponCategoriesDto(data);
    const row = await dao.update(
      id,
      dto.toObject()
    );

    return row
      ? new WeaponCategoriesEntity(row)
      : null;
  }

  async delete(id) {
    return dao.delete(id);
  }
}

module.exports = new WeaponCategoriesServiceImpl();
