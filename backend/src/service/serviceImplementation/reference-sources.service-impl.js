const ReferenceSourcesService = require('../service/reference-sources.service');
const dao = require('../../dao/reference-sources.dao');
const ReferenceSourcesDto = require('../../dto/reference-sources.dto');
const ReferenceSourcesEntity = require('../../entity/reference-sources.entity');

class ReferenceSourcesServiceImpl extends ReferenceSourcesService {
  async getAll() {
    return (await dao.findAll()).map(row => new ReferenceSourcesEntity(row));
  }

  async getById(id) {
    const row = await dao.findById(id);
    return row ? new ReferenceSourcesEntity(row) : null;
  }

  async create(data) {
    const dto = new ReferenceSourcesDto(data);
    return new ReferenceSourcesEntity(await dao.create(dto.toObject()));
  }

  async update(id, data) {
    const dto = new ReferenceSourcesDto(data);
    const row = await dao.update(id, dto.toObject());
    return row ? new ReferenceSourcesEntity(row) : null;
  }

  async delete(id) {
    return dao.delete(id);
  }
}

module.exports = new ReferenceSourcesServiceImpl();
