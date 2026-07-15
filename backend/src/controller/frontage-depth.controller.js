const createCrudController = require(
  './crud-controller.factory'
);
const service = require(
  '../service/serviceImplementation/frontage-depth.service-impl'
);
const FrontageDepthResponseDto = require(
  '../dto/frontage-depth-response.dto'
);

module.exports = createCrudController({
  service,
  ResponseDto: FrontageDepthResponseDto,
  tableName: "frontage_depth",
  title: "PLAGF – FRONTAGE & DEPTH (DEFENSIVE & OFFENSIVE)"
});
