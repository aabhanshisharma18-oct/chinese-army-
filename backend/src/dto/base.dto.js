function toSnakeCase(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase();
}

class BaseDto {
  constructor(data = {}) {
    for (const [key, value] of Object.entries(data)) {
      const normalizedKey = toSnakeCase(key);

      if (
        normalizedKey === 'id' ||
        normalizedKey === 'created_at' ||
        normalizedKey === 'updated_at'
      ) {
        continue;
      }

      if (value !== undefined) {
        this[normalizedKey] = value;
      }
    }
  }

  toObject() {
    return { ...this };
  }
}

module.exports = BaseDto;
