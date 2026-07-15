const express = require('express');

const metadataService = require(
  '../service/serviceImplementation/metadata.service-impl'
);

const router = express.Router();

router.get('/sections', (req, res, next) => {
  try {
    res.set('Cache-Control', 'public, max-age=3600');
    res.json(metadataService.getSections());
  } catch (error) {
    next(error);
  }
});

router.get('/filters/:table', async (req, res, next) => {
  try {
    const result = await metadataService.getFilters(
      req.params.table
    );

    res.set('Cache-Control', 'public, max-age=3600');
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get(
  '/filter-values/:table/:column',
  async (req, res, next) => {
    try {
      const result =
        await metadataService.getFilterValues(
          req.params.table,
          req.params.column
        );

      res.set(
        'Cache-Control',
        'public, max-age=1800'
      );

      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
