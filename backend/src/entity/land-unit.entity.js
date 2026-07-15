class LandUnitEntity {
  constructor(data = {}) {
    this.id = data.id ?? null;
    this.side = data.side ?? '';
    this.formationUnitName =
      data.formation_unit_name ?? data.formationUnitName ?? '';
    this.formationUnitType =
      data.formation_unit_type ?? data.formationUnitType ?? '';
    this.formationUnitParentName =
      data.formation_unit_parent_name ??
      data.formationUnitParentName ??
      '';
    this.standardUnitFormation =
      data.standard_unit_formation ??
      data.standardUnitFormation ??
      '';
    this.unitPotentialTroops =
      data.unit_potential_troops ??
      data.unitPotentialTroops ??
      '';
    this.locationName =
      data.location_name ?? data.locationName ?? '';
    this.latitude = data.latitude ?? '';
    this.longitude = data.longitude ?? '';
    this.createdAt =
      data.created_at ?? data.createdAt ?? null;
    this.updatedAt =
      data.updated_at ?? data.updatedAt ?? null;
  }
}

module.exports = LandUnitEntity;
