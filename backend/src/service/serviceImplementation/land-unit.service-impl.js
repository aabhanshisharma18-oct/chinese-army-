const LandUnitService = require('../service/land-unit.service');
const landUnitDao = require('../../dao/land-unit.dao');
const LandUnitDto = require('../../dto/land-unit.dto');
const LandUnitEntity = require('../../entity/land-unit.entity');

class LandUnitServiceImpl extends LandUnitService {
  async getAll() {
    const rows = await landUnitDao.findAll();

    return rows.map(row => new LandUnitEntity(row));
  }

  async getById(id) {
    const row = await landUnitDao.findById(id);

    return row ? new LandUnitEntity(row) : null;
  }

  async create(data) {
    const dto = new LandUnitDto(data);
    const errors = dto.validate();

    if (errors.length > 0) {
      const error = new Error('Validation failed');
      error.statusCode = 400;
      error.details = errors;
      throw error;
    }

    const row = await landUnitDao.create(dto);

    return new LandUnitEntity(row);
  }

  async update(id, data) {
    const dto = new LandUnitDto(data);
    const errors = dto.validate();

    if (errors.length > 0) {
      const error = new Error('Validation failed');
      error.statusCode = 400;
      error.details = errors;
      throw error;
    }

    const row = await landUnitDao.update(id, dto);

    return row ? new LandUnitEntity(row) : null;
  }

  async delete(id) {
    return landUnitDao.delete(id);
  }
}

module.exports = new LandUnitServiceImpl();
