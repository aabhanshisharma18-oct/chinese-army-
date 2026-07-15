const createCrudController = require(
  './crud-controller.factory'
);
const service = require(
  '../service/serviceImplementation/unit-categories.service-impl'
);
const UnitCategoriesResponseDto = require(
  '../dto/unit-categories-response.dto'
);

module.exports = createCrudController({
  service,
  ResponseDto: UnitCategoriesResponseDto,
  tableName: "unit_categories",
  title: "PLAGF – UNIT CATEGORIES (CATEGORY A vs B)"
});
