class LandUnitDto {
  constructor(data = {}) {
    this.side = String(data.side ?? '').trim();
    this.formationUnitName =
      String(data.formationUnitName ?? '').trim();
    this.formationUnitType =
      String(data.formationUnitType ?? '').trim();
    this.formationUnitParentName =
      String(data.formationUnitParentName ?? '').trim();
    this.standardUnitFormation =
      String(data.standardUnitFormation ?? '').trim();
    this.unitPotentialTroops =
      String(data.unitPotentialTroops ?? '').trim();
    this.locationName =
      String(data.locationName ?? '').trim();
    this.latitude =
      String(data.latitude ?? '').trim();
    this.longitude =
      String(data.longitude ?? '').trim();
  }

  validate() {
    const errors = [];

    if (!this.side) {
      errors.push('Side is required');
    }

    if (!this.formationUnitName) {
      errors.push('Formation unit name is required');
    }

    return errors;
  }
}

module.exports = LandUnitDto;
