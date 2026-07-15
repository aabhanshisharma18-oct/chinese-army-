const createCrudController = require(
  './crud-controller.factory'
);
const service = require(
  '../service/serviceImplementation/ranks.service-impl'
);
const RanksResponseDto = require(
  '../dto/ranks-response.dto'
);

module.exports = createCrudController({
  service,
  ResponseDto: RanksResponseDto,
  tableName: "ranks",
  title: "PLAGF – OFFICER & ENLISTED RANK STRUCTURE (LOWEST TO HIGHEST)"
});
