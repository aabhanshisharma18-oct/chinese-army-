class BaseEntity {
  constructor(data = {}) {
    Object.assign(this, data);
  }
}

module.exports = BaseEntity;
