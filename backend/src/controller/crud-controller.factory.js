const express = require('express');
const {
  formatToExcelArray
} = require('../../utils/response-formatter');

function parseId(value) {
  const id = Number(value);

  return Number.isInteger(id) && id > 0
    ? id
    : null;
}

function createCrudController({
  service,
  ResponseDto,
  tableName,
  title
}) {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    try {
      const entities = await service.getAll();

      const rows = entities.map(
        entity => new ResponseDto(entity)
      );

      return res.json(
        formatToExcelArray(rows, tableName, title)
      );
    } catch (error) {
      return next(error);
    }
  });

  router.get('/:id', async (req, res, next) => {
    try {
      const id = parseId(req.params.id);

      if (!id) {
        return res.status(400).json({
          error: 'Invalid ID'
        });
      }

      const entity = await service.getById(id);

      if (!entity) {
        return res.status(404).json({
          error: 'Record not found'
        });
      }

      return res.json(new ResponseDto(entity));
    } catch (error) {
      return next(error);
    }
  });

  router.post('/', async (req, res, next) => {
    try {
      const entity = await service.create(req.body);

      return res.status(201).json(
        new ResponseDto(entity)
      );
    } catch (error) {
      return next(error);
    }
  });

  router.put('/:id', async (req, res, next) => {
    try {
      const id = parseId(req.params.id);

      if (!id) {
        return res.status(400).json({
          error: 'Invalid ID'
        });
      }

      const entity = await service.update(
        id,
        req.body
      );

      if (!entity) {
        return res.status(404).json({
          error: 'Record not found'
        });
      }

      return res.json(new ResponseDto(entity));
    } catch (error) {
      return next(error);
    }
  });

  router.delete('/:id', async (req, res, next) => {
    try {
      const id = parseId(req.params.id);

      if (!id) {
        return res.status(400).json({
          error: 'Invalid ID'
        });
      }

      const deleted = await service.delete(id);

      if (!deleted) {
        return res.status(404).json({
          error: 'Record not found'
        });
      }

      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  });

  return router;
}

module.exports = createCrudController;
