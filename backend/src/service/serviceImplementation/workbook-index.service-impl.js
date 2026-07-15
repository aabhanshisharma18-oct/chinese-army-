const WorkbookIndexService = require('../service/workbook-index.service');
const dao = require('../../dao/workbook-index.dao');
const WorkbookIndexDto = require('../../dto/workbook-index.dto');
const WorkbookIndexEntity = require('../../entity/workbook-index.entity');

class WorkbookIndexServiceImpl extends WorkbookIndexService {
  async getAll() {
    return (await dao.findAll()).map(row => new WorkbookIndexEntity(row));
  }

  async getById(id) {
    const row = await dao.findById(id);
    return row ? new WorkbookIndexEntity(row) : null;
  }

  async create(data) {
    const dto = new WorkbookIndexDto(data);
    return new WorkbookIndexEntity(await dao.create(dto.toObject()));
  }

  async update(id, data) {
    const dto = new WorkbookIndexDto(data);
    const row = await dao.update(id, dto.toObject());
    return row ? new WorkbookIndexEntity(row) : null;
  }

  async delete(id) {
    return dao.delete(id);
  }
}

module.exports = new WorkbookIndexServiceImpl();
