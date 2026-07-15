const express = require('express');

const landUnitService = require(
  '../service/serviceImplementation/land-unit.service-impl'
);
const LandUnitResponseDto = require(
  '../dto/land-unit-response.dto'
);
const {
  formatToExcelArray
} = require('../../utils/response-formatter');

const router = express.Router();

// GET all land units
router.get('/', async (req, res, next) => {
  try {
    const entities = await landUnitService.getAll();

    const rows = entities.map(
      entity => new LandUnitResponseDto(entity)
    );

    const response = formatToExcelArray(
      rows,
      'land_units',
      'CHINESE ARMY (PLAGF) – LAND UNITS DATABASE'
    );

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// GET one land unit
router.get('/:id', async (req, res, next) => {
  try {
    const entity = await landUnitService.getById(
      req.params.id
    );

    if (!entity) {
      return res.status(404).json({
        error: 'Land unit not found'
      });
    }

    return res.json(
      new LandUnitResponseDto(entity)
    );
  } catch (error) {
    return next(error);
  }
});

// CREATE land unit
router.post('/', async (req, res, next) => {
  try {
    const entity = await landUnitService.create(
      req.body
    );

    return res.status(201).json(
      new LandUnitResponseDto(entity)
    );
  } catch (error) {
    return next(error);
  }
});

// UPDATE land unit
router.put('/:id', async (req, res, next) => {
  try {
    const entity = await landUnitService.update(
      req.params.id,
      req.body
    );

    if (!entity) {
      return res.status(404).json({
        error: 'Land unit not found'
      });
    }

    return res.json(
      new LandUnitResponseDto(entity)
    );
  } catch (error) {
    return next(error);
  }
});

// DELETE land unit
router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await landUnitService.delete(
      req.params.id
    );

    if (!deleted) {
      return res.status(404).json({
        error: 'Land unit not found'
      });
    }

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
