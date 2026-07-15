class LandUnitResponseDto {
  constructor(entity = {}) {
    this.id = entity.id ?? null;
    this.side = entity.side ?? '';
    this.formation_unit_name =
      entity.formationUnitName ?? '';
    this.formation_unit_type =
      entity.formationUnitType ?? '';
    this.formation_unit_parent_name =
      entity.formationUnitParentName ?? '';
    this.standard_unit_formation =
      entity.standardUnitFormation ?? '';
    this.unit_potential_troops =
      entity.unitPotentialTroops ?? '';
    this.location_name =
      entity.locationName ?? '';
    this.latitude = entity.latitude ?? '';
    this.longitude = entity.longitude ?? '';
    this.created_at = entity.createdAt ?? null;
    this.updated_at = entity.updatedAt ?? null;
  }
}

module.exports = LandUnitResponseDto;
