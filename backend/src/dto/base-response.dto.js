class BaseResponseDto {
  constructor(entity = {}) {
    Object.assign(this, entity);
  }
}

module.exports = BaseResponseDto;
