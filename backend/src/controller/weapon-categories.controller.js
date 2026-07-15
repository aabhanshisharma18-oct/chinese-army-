const createCrudController = require(
  './crud-controller.factory'
);
const service = require(
  '../service/serviceImplementation/weapon-categories.service-impl'
);
const WeaponCategoriesResponseDto = require(
  '../dto/weapon-categories-response.dto'
);

module.exports = createCrudController({
  service,
  ResponseDto: WeaponCategoriesResponseDto,
  tableName: "weapon_categories",
  title: "PLAGF – COMPLETE WEAPONS CATALOGUE BY ARM TYPE & CATEGORY"
});
