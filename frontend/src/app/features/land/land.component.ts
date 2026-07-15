import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ExcelDataService } from '../../services/excel-data.service';
import { MetadataService, FilterColumn } from '../../services/metadata.service';

interface LandUnit {
  side: string;
  formationUnitName: string;
  formationUnitType: string;
  formationUnitParentName: string;
  standardUnitFormation: string;
  unitPotentialTroops: string;
  locationName: string;
  latitude: string;
  longitude: string;
}

interface ArmType {
  number: string;
  combatArmTypeChinese: string;
  combatArmTypeEnglish: string;
  primaryRole: string;
  classificationMobility: string;
  classificationCombatRole: string;
  trainingCategory: string;
  indianArmyEquivalent: string;
  terrainSpecialisation: string;
}

interface WeaponCategory {
  side: string;
  armType: string;
  weaponCategory: string;
  subCategory: string;
  weaponName: string;
  designation: string;
  caliber: string;
  range: string;
  typeGuidance: string;
  roleCapability: string;
  weight: string;
  mainGunNotes: string;
}

interface WeaponSensor {
  side: string;
  type: string;
  weaponSensorName: string;
  subType: string;
  detectionRange: string;
  engagementRange: string;
  altitudeDepth: string;
  guidanceSensor: string;
  latLocation: string;
  nameLocation: string;
  oli: string;
}

interface LandUnitResource {
  side: string;
  brigadeUnitType: string;
  personnel: string;
  tanks: string;
  ifvsApcs: string;
  sphArtillery: string;
  mlrs: string;
  aaSamSystems: string;
  helicopters: string;
  atgms: string;
  trucksLogistics: string;
  detectionRange: string;
  engagementRange: string;
  speedDay: string;
  speedNight: string;
  frontageDefensive: string;
  frontageOffensive: string;
  depth: string;
  aVehicle: string;
  bVehicle: string;
  forcePotential: string;
}

interface VehicleSpeed {
  side: string;
  vehicleCategory: string;
  vehicleSystem: string;
  designation: string;
  roadSpeedDay: string;
  roadSpeedNight: string;
  crossCountryDay: string;
  crossCountryNight: string;
  amphibiousWaterSpeed: string;
  operationalRange: string;
  notes: string;
}

interface FrontageDepth {
  side: string;
  unitLevel: string;
  operationType: string;
  zone: string;
  frontage: string;
  depth: string;
  brigadeDensity: string;
  keyWeaponsNotes: string;
}

interface ForcePotential {
  side: string;
  category: string;
  metricSystem: string;
  value: string;
  globalRank: string;
  comparisonNotes: string;
}

interface VehicleDesignation {
  side: string;
  family: string;
  designation: string;
  fullChineseName: string;
  aOrBType: string;
  vehicleType: string;
  role: string;
  weight: string;
  mainArmament: string;
  roadSpeed: string;
  range: string;
  amphibious: string;
  crew: string;
  troops: string;
  notes: string;
}

type SubcategoryType = 'land-units' | 'arm-type' | 'weapon-category' | 'weapon-sensor' | 'land-unit-resources';
type ResourceSubcategoryType = 'resources-main' | 'vehicle-speeds' | 'frontage-depth' | 'force-potential' | 'vehicle-designations';
type DrillDownLevel = 'categories' | 'subcategory' | 'results';
type LandDatasetKey = 'land-units' | 'arm-type' | 'weapon-category' | 'weapon-sensor' |
  'resources-main' | 'vehicle-speeds' | 'frontage-depth' | 'force-potential' | 'vehicle-designations';

interface ColumnFilterDefinition {
  key: string;
  label: string;
}

@Component({
  selector: 'app-land',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './land.component.html',
  styleUrls: ['./land.component.scss']
})
export class LandComponent implements OnInit {
  // Subcategory navigation
  activeSubcategory: SubcategoryType = 'land-units';
  activeResourceSubcategory: ResourceSubcategoryType = 'resources-main';
  subcategories: { label: string; value: SubcategoryType }[] = [
    { label: 'Land Units', value: 'land-units' },
    { label: 'Arm Type', value: 'arm-type' },
    { label: 'Weapon Category', value: 'weapon-category' },
    { label: 'Weapon / Sensor', value: 'weapon-sensor' },
    { label: 'Land Unit Resources', value: 'land-unit-resources' }
  ];

  resourceSubcategories: { label: string; value: ResourceSubcategoryType }[] = [
    { label: 'Resources', value: 'resources-main' },
    { label: 'Vehicle Speeds', value: 'vehicle-speeds' },
    { label: 'Frontage & Depth', value: 'frontage-depth' },
    { label: 'Force Potential', value: 'force-potential' },
    { label: 'Vehicle Designations', value: 'vehicle-designations' }
  ];

  // Hierarchy state
  currentLevel: DrillDownLevel = 'categories';
  selectedFilter: string | null = null;
  // Data
  landUnits: LandUnit[] = [];
  armTypes: ArmType[] = [];
  weaponCategories: WeaponCategory[] = [];
  weaponSensors: WeaponSensor[] = [];
  landUnitResources: LandUnitResource[] = [];
  vehicleSpeeds: VehicleSpeed[] = [];
  frontageDepths: FrontageDepth[] = [];
  forcePotentials: ForcePotential[] = [];
  vehicleDesignations: VehicleDesignation[] = [];
  
  // Filters
  searchQuery: string = '';
  sideFilter: string = 'ALL';
  unitTypeFilter: string = 'ALL';
  parentFilter: string = 'ALL';
  locationFilter: string = 'ALL';
  weaponTypeFilter: string = 'ALL';
  armTypeFilter: string = 'ALL';
  weaponSensorTypeFilter: string = 'ALL';
  vehicleCategoryFilter: string = 'ALL';
  unitLevelFilter: string = 'ALL';
  // Search fields for high-cardinality columns
  formationUnitNameSearch: string = '';
  combatArmTypeSearch: string = '';
  weaponNameSearch: string = '';
  designationSearch: string = '';
  weaponSensorNameSearch: string = '';
  brigadeUnitTypeSearch: string = '';
  vehicleSystemSearch: string = '';
  vehicleDesignationSearch: string = '';
  zoneSearch: string = '';
  vehicleDesignationsDesignationSearch: string = '';
  // New high-priority filters
  weaponCategoriesSideFilter: string = 'ALL';
  subCategoryFilter: string = 'ALL';
  caliberFilter: string = 'ALL';
  typeGuidanceFilter: string = 'ALL';
  weaponSensorsSideFilter: string = 'ALL';
  subTypeFilter: string = 'ALL';
  classificationCombatRoleFilter: string = 'ALL';
  classificationMobilityFilter: string = 'ALL';
  trainingCategoryFilter: string = 'ALL';
  terrainSpecialisationFilter: string = 'ALL';
  forcePotentialSideFilter: string = 'ALL';
  forcePotentialCategoryFilter: string = 'ALL';
  metricSystemFilter: string = 'ALL';
  vehicleDesignationsSideFilter: string = 'ALL';
  familyFilter: string = 'ALL';
  vehicleTypeFilter: string = 'ALL';
  aOrBTypeFilter: string = 'ALL';
  vehicleDesignationsRoleFilter: string = 'ALL';
  frontageDepthSideFilter: string = 'ALL';
  operationTypeFilter: string = 'ALL';
  vehicleSpeedsSideFilter: string = 'ALL';
  // Loading states
  loading = false;
  error: string | null = null;

  // Dynamic filter options
  filterOptions: Record<string, string[]> = {};
  columnFilters: Record<string, string> = {};
  readonly columnDefinitions: Record<LandDatasetKey, [string, string][]> = {
    'land-units': [
      ['side', 'Side'], ['formationUnitName', 'Formation Unit Name'], ['formationUnitType', 'Formation Unit Type'],
      ['formationUnitParentName', 'Parent Formation'], ['standardUnitFormation', 'Standard Unit Formation'],
      ['unitPotentialTroops', 'Unit Potential / Troops'], ['locationName', 'Location Name'],
      ['latitude', 'Latitude'], ['longitude', 'Longitude']
    ],
    'arm-type': [
      ['number', 'Number'], ['combatArmTypeChinese', 'Combat Arm Type (Chinese)'],
      ['combatArmTypeEnglish', 'Combat Arm Type (English)'], ['primaryRole', 'Primary Role'],
      ['classificationMobility', 'Classification Mobility'], ['classificationCombatRole', 'Classification Combat Role'],
      ['trainingCategory', 'Training Category'], ['indianArmyEquivalent', 'Indian Army Equivalent'],
      ['terrainSpecialisation', 'Terrain Specialisation']
    ],
    'weapon-category': [
      ['side', 'Side'], ['armType', 'Arm Type'], ['weaponCategory', 'Weapon Category'], ['subCategory', 'Sub Category'],
      ['weaponName', 'Weapon Name'], ['designation', 'Designation'], ['caliber', 'Caliber'], ['range', 'Range'],
      ['typeGuidance', 'Type / Guidance'], ['roleCapability', 'Role / Capability'], ['weight', 'Weight'],
      ['mainGunNotes', 'Main Gun / Notes']
    ],
    'weapon-sensor': [
      ['side', 'Side'], ['type', 'Type'], ['weaponSensorName', 'Weapon / Sensor Name'], ['subType', 'Sub Type'],
      ['detectionRange', 'Detection Range'], ['engagementRange', 'Engagement Range'],
      ['altitudeDepth', 'Altitude / Depth'], ['guidanceSensor', 'Guidance / Sensor'],
      ['latLocation', 'Latitude / Location'], ['nameLocation', 'Location Name'], ['oli', 'OLI']
    ],
    'resources-main': [
      ['side', 'Side'], ['brigadeUnitType', 'Brigade Unit Type'], ['personnel', 'Personnel'], ['tanks', 'Tanks'],
      ['ifvsApcs', 'IFVs / APCs'], ['sphArtillery', 'SPH / Artillery'], ['mlrs', 'MLRS'],
      ['aaSamSystems', 'AA / SAM Systems'], ['helicopters', 'Helicopters'], ['atgms', 'ATGMs'],
      ['trucksLogistics', 'Trucks / Logistics'], ['detectionRange', 'Detection Range'],
      ['engagementRange', 'Engagement Range'], ['speedDay', 'Speed Day'], ['speedNight', 'Speed Night'],
      ['frontageDefensive', 'Frontage Defensive'], ['frontageOffensive', 'Frontage Offensive'],
      ['depth', 'Depth'], ['aVehicle', 'A Vehicle'], ['bVehicle', 'B Vehicle'], ['forcePotential', 'Force Potential']
    ],
    'vehicle-speeds': [
      ['side', 'Side'], ['vehicleCategory', 'Vehicle Category'], ['vehicleSystem', 'Vehicle System'],
      ['designation', 'Designation'], ['roadSpeedDay', 'Road Speed Day'], ['roadSpeedNight', 'Road Speed Night'],
      ['crossCountryDay', 'Cross Country Day'], ['crossCountryNight', 'Cross Country Night'],
      ['amphibiousWaterSpeed', 'Amphibious / Water Speed'], ['operationalRange', 'Operational Range'], ['notes', 'Notes']
    ],
    'frontage-depth': [
      ['side', 'Side'], ['unitLevel', 'Unit Level'], ['operationType', 'Operation Type'], ['zone', 'Zone'],
      ['frontage', 'Frontage'], ['depth', 'Depth'], ['brigadeDensity', 'Brigade Density'], ['keyWeaponsNotes', 'Key Weapons / Notes']
    ],
    'force-potential': [
      ['side', 'Side'], ['category', 'Category'], ['metricSystem', 'Metric / System'], ['value', 'Value'],
      ['globalRank', 'Global Rank'], ['comparisonNotes', 'Comparison / Notes']
    ],
    'vehicle-designations': [
      ['side', 'Side'], ['family', 'Family'], ['designation', 'Designation'], ['fullChineseName', 'Full Chinese Name'],
      ['aOrBType', 'A / B Type'], ['vehicleType', 'Vehicle Type'], ['role', 'Role'], ['weight', 'Weight'],
      ['mainArmament', 'Main Armament'], ['roadSpeed', 'Road Speed'], ['range', 'Range'],
      ['amphibious', 'Amphibious'], ['crew', 'Crew'], ['troops', 'Troops'], ['notes', 'Notes']
    ]
  };
  readonly columnDefinitionViews: Record<LandDatasetKey, ColumnFilterDefinition[]> = Object.fromEntries(
    Object.entries(this.columnDefinitions).map(([dataset, columns]) => [
      dataset,
      columns.map(([key, label]) => ({ key, label }))
    ])
  ) as Record<LandDatasetKey, ColumnFilterDefinition[]>;
  private columnOptionCache: Record<string, string[]> = {};

  constructor(
    private excelDataService: ExcelDataService,
    private metadataService: MetadataService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.error = null;

    forkJoin({
      landUnits: this.excelDataService.getSheet(
        'assets/data/raw/1_Land_Units.json'
      ),
      armTypes: this.excelDataService.getSheet(
        'assets/data/raw/2_Arm_Types.json'
      ),
      weaponCategories: this.excelDataService.getSheet(
        'assets/data/raw/3_Weapon_Categories.json'
      ),
      weaponSensors: this.excelDataService.getSheet(
        'assets/data/raw/4_Weapon_Sensor.json'
      ),
      landUnitResources: this.excelDataService.getSheet(
        'assets/data/raw/5_Land_Unit_Resources.json'
      ),
      vehicleSpeeds: this.excelDataService.getSheet(
        'assets/data/raw/6_Vehicle_Speeds.json'
      ),
      frontageDepths: this.excelDataService.getSheet(
        'assets/data/raw/7_Frontage_Depth.json'
      ),
      forcePotentials: this.excelDataService.getSheet(
        'assets/data/raw/8_Force_Potential.json'
      ),
      vehicleDesignations: this.excelDataService.getSheet(
        'assets/data/raw/9_Vehicle_Designations.json'
      )
    }).subscribe({
      next: data => {
        this.landUnits =
          this.parseLandUnits(data.landUnits);
        this.armTypes =
          this.parseArmTypes(data.armTypes);
        this.weaponCategories =
          this.parseWeaponCategories(
            data.weaponCategories
          );
        this.weaponSensors =
          this.parseWeaponSensors(
            data.weaponSensors
          );
        this.landUnitResources =
          this.parseLandUnitResources(
            data.landUnitResources
          );
        this.vehicleSpeeds =
          this.parseVehicleSpeeds(
            data.vehicleSpeeds
          );
        this.frontageDepths =
          this.parseFrontageDepths(
            data.frontageDepths
          );
        this.forcePotentials =
          this.parseForcePotentials(
            data.forcePotentials
          );
        this.vehicleDesignations =
          this.parseVehicleDesignations(
            data.vehicleDesignations
          );

        this.rebuildColumnOptionCache();
        this.loading = false;
      },
      error: error => {
        console.error(
          'Failed to load LAND data from PostgreSQL:',
          error
        );

        this.error =
          'Failed to load LAND data from PostgreSQL.';
        this.loading = false;
      }
    });
  }

  loadFilterOptions(): void {
    // Load filter options for key tables (table, column) pairs
    const tableColumnPairs: [string, string][] = [
      ['land_units', 'side'],
      ['land_units', 'formation_unit_type'],
      ['weapon_categories', 'side'],
      ['weapon_categories', 'arm_type'],
      ['weapon_categories', 'weapon_category'],
      ['weapon_categories', 'sub_category'],
      ['weapon_categories', 'caliber'],
      ['weapon_sensors', 'side'],
      ['weapon_sensors', 'type'],
      ['weapon_sensors', 'sub_type'],
      ['arm_types', 'classification_combat_role'],
      ['arm_types', 'classification_mobility'],
      ['arm_types', 'terrain_specialisation'],
      ['force_potential', 'side'],
      ['force_potential', 'category'],
      ['force_potential', 'metric_system'],
      ['vehicle_designations', 'side'],
      ['vehicle_designations', 'family'],
      ['vehicle_designations', 'vehicle_type'],
      ['vehicle_designations', 'role'],
      ['frontage_depth', 'side'],
      ['frontage_depth', 'operation_type'],
      ['vehicle_speeds', 'side'],
      ['vehicle_speeds', 'vehicle_category'],
      ['frontage_depth', 'unit_level']
    ];

    // Load distinct values for each filter column
    tableColumnPairs.forEach(([table, column]) => {
      this.metadataService.getFilterValues(table, column).subscribe({
        next: (response) => {
          const key = `${table}_${column}`;
          this.filterOptions[key] = ['ALL', ...response.values];
        },
        error: (err) => {
          console.error(`Failed to load filter values for ${table}.${column}:`, err);
        }
      });
    });
  }


  private parseLandUnits(data: unknown): LandUnit[] {
    const rows = data as unknown[][];
    if (!Array.isArray(rows) || rows.length < 2) return [];

    const units: LandUnit[] = [];
    for (let i = 2; i < rows.length; i++) {
      const row = rows[i] as unknown[];
      if (!Array.isArray(row) || row.length === 0) continue;

      const unit: LandUnit = {
        side: this.getCellValue(row, 0) || '',
        formationUnitName: this.getCellValue(row, 1) || '',
        formationUnitType: this.getCellValue(row, 2) || '',
        formationUnitParentName: this.getCellValue(row, 3) || '',
        standardUnitFormation: this.getCellValue(row, 4) || '',
        unitPotentialTroops: this.getCellValue(row, 5) || '',
        locationName: this.getCellValue(row, 6) || '',
        latitude: this.getCellValue(row, 7) || '',
        longitude: this.getCellValue(row, 8) || ''
      };

      if (unit.formationUnitName) {
        units.push(unit);
      }
    }
    return units;
  }

  private parseArmTypes(data: unknown): ArmType[] {
    const rows = data as unknown[][];
    if (!Array.isArray(rows) || rows.length < 2) return [];

    const types: ArmType[] = [];
    for (let i = 2; i < rows.length; i++) {
      const row = rows[i] as unknown[];
      if (!Array.isArray(row) || row.length === 0) continue;

      const type: ArmType = {
        number: this.getCellValue(row, 0) || '',
        combatArmTypeChinese: this.getCellValue(row, 1) || '',
        combatArmTypeEnglish: this.getCellValue(row, 2) || '',
        primaryRole: this.getCellValue(row, 3) || '',
        classificationMobility: this.getCellValue(row, 4) || '',
        classificationCombatRole: this.getCellValue(row, 5) || '',
        trainingCategory: this.getCellValue(row, 6) || '',
        indianArmyEquivalent: this.getCellValue(row, 7) || '',
        terrainSpecialisation: this.getCellValue(row, 8) || ''
      };

      if (type.combatArmTypeEnglish) {
        types.push(type);
      }
    }
    return types;
  }

  private parseWeaponCategories(data: unknown): WeaponCategory[] {
    const rows = data as unknown[][];
    if (!Array.isArray(rows) || rows.length < 2) return [];

    const categories: WeaponCategory[] = [];
    for (let i = 2; i < rows.length; i++) {
      const row = rows[i] as unknown[];
      if (!Array.isArray(row) || row.length === 0) continue;

      const category: WeaponCategory = {
        side: this.getCellValue(row, 0) || '',
        armType: this.getCellValue(row, 1) || '',
        weaponCategory: this.getCellValue(row, 2) || '',
        subCategory: this.getCellValue(row, 3) || '',
        weaponName: this.getCellValue(row, 4) || '',
        designation: this.getCellValue(row, 5) || '',
        caliber: this.getCellValue(row, 6) || '',
        range: this.getCellValue(row, 7) || '',
        typeGuidance: this.getCellValue(row, 8) || '',
        roleCapability: this.getCellValue(row, 9) || '',
        weight: this.getCellValue(row, 10) || '',
        mainGunNotes: this.getCellValue(row, 11) || ''
      };

      if (category.weaponName) {
        categories.push(category);
      }
    }
    return categories;
  }

  private parseWeaponSensors(data: unknown): WeaponSensor[] {
    const rows = data as unknown[][];
    if (!Array.isArray(rows) || rows.length < 2) return [];

    const sensors: WeaponSensor[] = [];
    for (let i = 2; i < rows.length; i++) {
      const row = rows[i] as unknown[];
      if (!Array.isArray(row) || row.length === 0) continue;

      const sensor: WeaponSensor = {
        side: this.getCellValue(row, 0) || '',
        type: this.getCellValue(row, 1) || '',
        weaponSensorName: this.getCellValue(row, 2) || '',
        subType: this.getCellValue(row, 3) || '',
        detectionRange: this.getCellValue(row, 4) || '',
        engagementRange: this.getCellValue(row, 5) || '',
        altitudeDepth: this.getCellValue(row, 6) || '',
        guidanceSensor: this.getCellValue(row, 7) || '',
        latLocation: this.getCellValue(row, 8) || '',
        nameLocation: this.getCellValue(row, 9) || '',
        oli: this.getCellValue(row, 10) || ''
      };

      if (sensor.weaponSensorName) {
        sensors.push(sensor);
      }
    }
    return sensors;
  }

  private parseLandUnitResources(data: unknown): LandUnitResource[] {
    const rows = data as unknown[][];
    if (!Array.isArray(rows) || rows.length < 2) return [];

    const resources: LandUnitResource[] = [];
    for (let i = 2; i < rows.length; i++) {
      const row = rows[i] as unknown[];
      if (!Array.isArray(row) || row.length === 0) continue;

      const resource: LandUnitResource = {
        side: this.getCellValue(row, 0) || '',
        brigadeUnitType: this.getCellValue(row, 1) || '',
        personnel: this.getCellValue(row, 2) || '',
        tanks: this.getCellValue(row, 3) || '',
        ifvsApcs: this.getCellValue(row, 4) || '',
        sphArtillery: this.getCellValue(row, 5) || '',
        mlrs: this.getCellValue(row, 6) || '',
        aaSamSystems: this.getCellValue(row, 7) || '',
        helicopters: this.getCellValue(row, 8) || '',
        atgms: this.getCellValue(row, 9) || '',
        trucksLogistics: this.getCellValue(row, 10) || '',
        detectionRange: this.getCellValue(row, 11) || '',
        engagementRange: this.getCellValue(row, 12) || '',
        speedDay: this.getCellValue(row, 13) || '',
        speedNight: this.getCellValue(row, 14) || '',
        frontageDefensive: this.getCellValue(row, 15) || '',
        frontageOffensive: this.getCellValue(row, 16) || '',
        depth: this.getCellValue(row, 17) || '',
        aVehicle: this.getCellValue(row, 18) || '',
        bVehicle: this.getCellValue(row, 19) || '',
        forcePotential: this.getCellValue(row, 20) || ''
      };

      if (resource.brigadeUnitType) {
        resources.push(resource);
      }
    }
    return resources;
  }

  private parseVehicleSpeeds(data: unknown): VehicleSpeed[] {
    const rows = data as unknown[][];
    if (!Array.isArray(rows) || rows.length < 2) return [];

    const speeds: VehicleSpeed[] = [];
    for (let i = 2; i < rows.length; i++) {
      const row = rows[i] as unknown[];
      if (!Array.isArray(row) || row.length === 0) continue;

      const speed: VehicleSpeed = {
        side: this.getCellValue(row, 0) || '',
        vehicleCategory: this.getCellValue(row, 1) || '',
        vehicleSystem: this.getCellValue(row, 2) || '',
        designation: this.getCellValue(row, 3) || '',
        roadSpeedDay: this.getCellValue(row, 4) || '',
        roadSpeedNight: this.getCellValue(row, 5) || '',
        crossCountryDay: this.getCellValue(row, 6) || '',
        crossCountryNight: this.getCellValue(row, 7) || '',
        amphibiousWaterSpeed: this.getCellValue(row, 8) || '',
        operationalRange: this.getCellValue(row, 9) || '',
        notes: this.getCellValue(row, 10) || ''
      };

      if (speed.vehicleSystem) {
        speeds.push(speed);
      }
    }
    return speeds;
  }

  private parseFrontageDepths(data: unknown): FrontageDepth[] {
    const rows = data as unknown[][];
    if (!Array.isArray(rows) || rows.length < 2) return [];

    const depths: FrontageDepth[] = [];
    for (let i = 2; i < rows.length; i++) {
      const row = rows[i] as unknown[];
      if (!Array.isArray(row) || row.length === 0) continue;

      const depth: FrontageDepth = {
        side: this.getCellValue(row, 0) || '',
        unitLevel: this.getCellValue(row, 1) || '',
        operationType: this.getCellValue(row, 2) || '',
        zone: this.getCellValue(row, 3) || '',
        frontage: this.getCellValue(row, 4) || '',
        depth: this.getCellValue(row, 5) || '',
        brigadeDensity: this.getCellValue(row, 6) || '',
        keyWeaponsNotes: this.getCellValue(row, 7) || ''
      };

      if (depth.unitLevel) {
        depths.push(depth);
      }
    }
    return depths;
  }

  private parseForcePotentials(data: unknown): ForcePotential[] {
    const rows = data as unknown[][];
    if (!Array.isArray(rows) || rows.length < 2) return [];

    const potentials: ForcePotential[] = [];
    for (let i = 2; i < rows.length; i++) {
      const row = rows[i] as unknown[];
      if (!Array.isArray(row) || row.length === 0) continue;

      const potential: ForcePotential = {
        side: this.getCellValue(row, 0) || '',
        category: this.getCellValue(row, 1) || '',
        metricSystem: this.getCellValue(row, 2) || '',
        value: this.getCellValue(row, 3) || '',
        globalRank: this.getCellValue(row, 4) || '',
        comparisonNotes: this.getCellValue(row, 5) || ''
      };

      if (potential.metricSystem) {
        potentials.push(potential);
      }
    }
    return potentials;
  }

  private parseVehicleDesignations(data: unknown): VehicleDesignation[] {
    const rows = data as unknown[][];
    if (!Array.isArray(rows) || rows.length < 2) return [];

    const designations: VehicleDesignation[] = [];
    for (let i = 2; i < rows.length; i++) {
      const row = rows[i] as unknown[];
      if (!Array.isArray(row) || row.length === 0) continue;

      const designation: VehicleDesignation = {
        side: this.getCellValue(row, 0) || '',
        family: this.getCellValue(row, 1) || '',
        designation: this.getCellValue(row, 2) || '',
        fullChineseName: this.getCellValue(row, 3) || '',
        aOrBType: this.getCellValue(row, 4) || '',
        vehicleType: this.getCellValue(row, 5) || '',
        role: this.getCellValue(row, 6) || '',
        weight: this.getCellValue(row, 7) || '',
        mainArmament: this.getCellValue(row, 8) || '',
        roadSpeed: this.getCellValue(row, 9) || '',
        range: this.getCellValue(row, 10) || '',
        amphibious: this.getCellValue(row, 11) || '',
        crew: this.getCellValue(row, 12) || '',
        troops: this.getCellValue(row, 13) || '',
        notes: this.getCellValue(row, 14) || ''
      };

      if (designation.designation) {
        designations.push(designation);
      }
    }
    return designations;
  }

  // Navigation methods
  setSubcategory(subcategory: SubcategoryType): void {
    this.activeSubcategory = subcategory;
    this.currentLevel = 'categories';
    this.resetFilters();
  }

  selectFilter(filter: string): void {
    this.selectedFilter = filter;
    this.currentLevel = 'results';
  }

  goBack(): void {
    if (this.currentLevel === 'results') {
      this.currentLevel = 'categories';
      this.selectedFilter = null;
    }
  }

  resetToTop(): void {
    this.currentLevel = 'categories';
    this.selectedFilter = null;
    this.resetFilters();
  }

  resetFilters(): void {
    this.columnFilters = {};
    this.searchQuery = '';
    this.sideFilter = 'ALL';
    this.unitTypeFilter = 'ALL';
    this.parentFilter = 'ALL';
    this.locationFilter = 'ALL';
    this.weaponTypeFilter = 'ALL';
    this.armTypeFilter = 'ALL';
    this.weaponSensorTypeFilter = 'ALL';
    this.vehicleCategoryFilter = 'ALL';
    this.unitLevelFilter = 'ALL';

    // New high-priority filters
    this.weaponCategoriesSideFilter = 'ALL';
    this.subCategoryFilter = 'ALL';
    this.caliberFilter = 'ALL';
    this.typeGuidanceFilter = 'ALL';
    this.weaponSensorsSideFilter = 'ALL';
    this.subTypeFilter = 'ALL';
    this.classificationCombatRoleFilter = 'ALL';
    this.classificationMobilityFilter = 'ALL';
    this.trainingCategoryFilter = 'ALL';
    this.terrainSpecialisationFilter = 'ALL';
    this.forcePotentialSideFilter = 'ALL';
    this.forcePotentialCategoryFilter = 'ALL';
    this.metricSystemFilter = 'ALL';
    this.vehicleDesignationsSideFilter = 'ALL';
    this.familyFilter = 'ALL';
    this.vehicleTypeFilter = 'ALL';
    this.aOrBTypeFilter = 'ALL';
    this.vehicleDesignationsRoleFilter = 'ALL';
    this.frontageDepthSideFilter = 'ALL';
    this.operationTypeFilter = 'ALL';
    this.vehicleSpeedsSideFilter = 'ALL';

    // Search fields
    this.formationUnitNameSearch = '';
    this.combatArmTypeSearch = '';
    this.weaponNameSearch = '';
    this.designationSearch = '';
    this.weaponSensorNameSearch = '';
    this.brigadeUnitTypeSearch = '';
    this.vehicleSystemSearch = '';
    this.vehicleDesignationSearch = '';
    this.zoneSearch = '';
    this.vehicleDesignationsDesignationSearch = '';
  }

  setResourceSubcategory(subcategory: ResourceSubcategoryType): void {
    this.activeResourceSubcategory = subcategory;
    this.resetFilters();
  }

  activeDatasetKey(): LandDatasetKey {
    if (this.activeSubcategory === 'land-unit-resources') {
      return this.activeResourceSubcategory;
    }
    return this.activeSubcategory as Exclude<SubcategoryType, 'land-unit-resources'>;
  }

  activeColumnDefinitions(): ColumnFilterDefinition[] {
    return this.columnDefinitionViews[this.activeDatasetKey()];
  }

  getColumnFilter(columnKey: string): string {
    return this.columnFilters[`${this.activeDatasetKey()}:${columnKey}`] || 'ALL';
  }

  setColumnFilter(columnKey: string, value: string): void {
    const filterKey = `${this.activeDatasetKey()}:${columnKey}`;
    this.columnFilters = { ...this.columnFilters, [filterKey]: value };
  }

  getColumnOptions(columnKey: string): string[] {
    return this.columnOptionCache[`${this.activeDatasetKey()}:${columnKey}`] || [];
  }

  private rebuildColumnOptionCache(): void {
    const cache: Record<string, string[]> = {};
    (Object.keys(this.columnDefinitions) as LandDatasetKey[]).forEach(dataset => {
      const rows = this.rawRowsForDataset(dataset);
      this.columnDefinitions[dataset].forEach(([columnKey]) => {
        cache[`${dataset}:${columnKey}`] = [...new Set(rows
          .map(row => String(row[columnKey] ?? '').trim())
          .filter(value => value.length > 0))]
          .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
      });
    });
    this.columnOptionCache = cache;
  }

  private rawRowsForDataset(dataset: LandDatasetKey): Record<string, unknown>[] {
    switch (dataset) {
      case 'land-units': return this.landUnits as unknown as Record<string, unknown>[];
      case 'arm-type': return this.armTypes as unknown as Record<string, unknown>[];
      case 'weapon-category': return this.weaponCategories as unknown as Record<string, unknown>[];
      case 'weapon-sensor': return this.weaponSensors as unknown as Record<string, unknown>[];
      case 'resources-main': return this.landUnitResources as unknown as Record<string, unknown>[];
      case 'vehicle-speeds': return this.vehicleSpeeds as unknown as Record<string, unknown>[];
      case 'frontage-depth': return this.frontageDepths as unknown as Record<string, unknown>[];
      case 'force-potential': return this.forcePotentials as unknown as Record<string, unknown>[];
      case 'vehicle-designations': return this.vehicleDesignations as unknown as Record<string, unknown>[];
    }
  }

  private applyColumnFilters<T>(dataset: LandDatasetKey, rows: T[]): T[] {
    const filters = this.columnFilters;
    const definitions = this.columnDefinitions[dataset];
    return rows.filter(row => definitions.every(([columnKey]) => {
      const selected = filters[`${dataset}:${columnKey}`] || 'ALL';
      return selected === 'ALL' || String((row as Record<string, unknown>)[columnKey] ?? '').trim() === selected;
    }));
  }

  // Computed properties for filtered results
  get filteredLandUnits() {
    const query = this.searchQuery.toLowerCase();
    const side = this.sideFilter;
    const unitType = this.unitTypeFilter;
    const parent = this.parentFilter;
    const location = this.locationFilter;
    const formationUnitName = this.formationUnitNameSearch.toLowerCase();

    let filtered = this.landUnits;

    if (side !== 'ALL') {
      filtered = filtered.filter(u => u.side === side);
    }
    if (unitType !== 'ALL') {
      filtered = filtered.filter(u => u.formationUnitType === unitType);
    }
    if (parent !== 'ALL') {
      filtered = filtered.filter(u => u.formationUnitParentName === parent);
    }
    if (location !== 'ALL') {
      filtered = filtered.filter(u => u.locationName === location);
    }
    if (formationUnitName) {
      filtered = filtered.filter(u => u.formationUnitName.toLowerCase().includes(formationUnitName));
    }
    if (query) {
      filtered = filtered.filter(u =>
        u.formationUnitName.toLowerCase().includes(query) ||
        u.formationUnitType.toLowerCase().includes(query) ||
        u.formationUnitParentName.toLowerCase().includes(query) ||
        u.locationName.toLowerCase().includes(query)
      );
    }

    return filtered;
  }

  get filteredArmTypes() {
    const query = this.searchQuery.toLowerCase();
    const combatRole = this.classificationCombatRoleFilter;
    const mobility = this.classificationMobilityFilter;
    const training = this.trainingCategoryFilter;
    const terrain = this.terrainSpecialisationFilter;
    const combatArmType = this.combatArmTypeSearch.toLowerCase();

    let filtered = this.armTypes;

    if (combatRole !== 'ALL') {
      filtered = filtered.filter(t => t.classificationCombatRole === combatRole);
    }
    if (mobility !== 'ALL') {
      filtered = filtered.filter(t => t.classificationMobility === mobility);
    }
    if (training !== 'ALL') {
      filtered = filtered.filter(t => t.trainingCategory === training);
    }
    if (terrain !== 'ALL') {
      filtered = filtered.filter(t => t.terrainSpecialisation === terrain);
    }
    if (combatArmType) {
      filtered = filtered.filter(t => t.combatArmTypeEnglish.toLowerCase().includes(combatArmType));
    }
    if (query) {
      filtered = filtered.filter(t =>
        t.combatArmTypeEnglish.toLowerCase().includes(query) ||
        t.classificationCombatRole.toLowerCase().includes(query) ||
        t.terrainSpecialisation.toLowerCase().includes(query)
      );
    }
    return filtered;
  }

  get filteredWeaponCategories() {
    const query = this.searchQuery.toLowerCase();
    const weaponType = this.weaponTypeFilter;
    const armType = this.armTypeFilter;
    const side = this.weaponCategoriesSideFilter;
    const subCategory = this.subCategoryFilter;
    const caliber = this.caliberFilter;
    const typeGuidance = this.typeGuidanceFilter;
    const weaponName = this.weaponNameSearch.toLowerCase();
    const designation = this.designationSearch.toLowerCase();

    let filtered = this.weaponCategories;

    if (weaponType !== 'ALL') {
      filtered = filtered.filter(w => w.weaponCategory === weaponType);
    }
    if (armType !== 'ALL') {
      filtered = filtered.filter(w => w.armType === armType);
    }
    if (side !== 'ALL') {
      filtered = filtered.filter(w => w.side === side);
    }
    if (subCategory !== 'ALL') {
      filtered = filtered.filter(w => w.subCategory === subCategory);
    }
    if (caliber !== 'ALL') {
      filtered = filtered.filter(w => w.caliber === caliber);
    }
    if (typeGuidance !== 'ALL') {
      filtered = filtered.filter(w => w.typeGuidance === typeGuidance);
    }
    if (weaponName) {
      filtered = filtered.filter(w => w.weaponName.toLowerCase().includes(weaponName));
    }
    if (designation) {
      filtered = filtered.filter(w => w.designation.toLowerCase().includes(designation));
    }
    if (query) {
      filtered = filtered.filter(w =>
        w.weaponName.toLowerCase().includes(query) ||
        w.weaponCategory.toLowerCase().includes(query) ||
        w.designation.toLowerCase().includes(query)
      );
    }

    return filtered;
  }

  get filteredWeaponSensors() {
    const query = this.searchQuery.toLowerCase();
    const weaponSensorType = this.weaponSensorTypeFilter;
    const side = this.weaponSensorsSideFilter;
    const subType = this.subTypeFilter;
    const weaponSensorName = this.weaponSensorNameSearch.toLowerCase();

    let filtered = this.weaponSensors;

    if (weaponSensorType !== 'ALL') {
      filtered = filtered.filter(w => w.type === weaponSensorType);
    }
    if (side !== 'ALL') {
      filtered = filtered.filter(w => w.side === side);
    }
    if (subType !== 'ALL') {
      filtered = filtered.filter(w => w.subType === subType);
    }
    if (weaponSensorName) {
      filtered = filtered.filter(w => w.weaponSensorName.toLowerCase().includes(weaponSensorName));
    }
    if (query) {
      filtered = filtered.filter(w =>
        w.weaponSensorName.toLowerCase().includes(query) ||
        w.type.toLowerCase().includes(query) ||
        w.subType.toLowerCase().includes(query)
      );
    }

    return filtered;
  }

  get filteredLandUnitResources() {
    const query = this.searchQuery.toLowerCase();
    const side = this.sideFilter;
    const brigadeUnitType = this.brigadeUnitTypeSearch.toLowerCase();

    let filtered = this.landUnitResources;

    if (side !== 'ALL') {
      filtered = filtered.filter(r => r.side === side);
    }
    if (brigadeUnitType) {
      filtered = filtered.filter(r => r.brigadeUnitType.toLowerCase().includes(brigadeUnitType));
    }
    if (query) {
      filtered = filtered.filter(r =>
        r.brigadeUnitType.toLowerCase().includes(query) ||
        r.forcePotential.toLowerCase().includes(query)
      );
    }
    return filtered;
  }

  get filteredVehicleSpeeds() {
    const query = this.searchQuery.toLowerCase();
    const vehicleCategory = this.vehicleCategoryFilter;
    const side = this.vehicleSpeedsSideFilter;
    const vehicleSystem = this.vehicleSystemSearch.toLowerCase();
    const designation = this.vehicleDesignationSearch.toLowerCase();

    let filtered = this.vehicleSpeeds;

    if (vehicleCategory !== 'ALL') {
      filtered = filtered.filter(v => v.vehicleCategory === vehicleCategory);
    }
    if (side !== 'ALL') {
      filtered = filtered.filter(v => v.side === side);
    }
    if (vehicleSystem) {
      filtered = filtered.filter(v => v.vehicleSystem.toLowerCase().includes(vehicleSystem));
    }
    if (designation) {
      filtered = filtered.filter(v => v.designation.toLowerCase().includes(designation));
    }
    if (query) {
      filtered = filtered.filter(v =>
        v.vehicleSystem.toLowerCase().includes(query) ||
        v.designation.toLowerCase().includes(query)
      );
    }

    return filtered;
  }

  get filteredFrontageDepths() {
    const query = this.searchQuery.toLowerCase();
    const unitLevel = this.unitLevelFilter;
    const side = this.frontageDepthSideFilter;
    const operationType = this.operationTypeFilter;
    const zone = this.zoneSearch.toLowerCase();

    let filtered = this.frontageDepths;

    if (unitLevel !== 'ALL') {
      filtered = filtered.filter(f => f.unitLevel === unitLevel);
    }
    if (side !== 'ALL') {
      filtered = filtered.filter(f => f.side === side);
    }
    if (operationType !== 'ALL') {
      filtered = filtered.filter(f => f.operationType === operationType);
    }
    if (zone) {
      filtered = filtered.filter(f => f.zone.toLowerCase().includes(zone));
    }
    if (query) {
      filtered = filtered.filter(f =>
        f.unitLevel.toLowerCase().includes(query) ||
        f.zone.toLowerCase().includes(query)
      );
    }

    return filtered;
  }

  get filteredForcePotentials() {
    const query = this.searchQuery.toLowerCase();
    const side = this.forcePotentialSideFilter;
    const category = this.forcePotentialCategoryFilter;
    const metricSystem = this.metricSystemFilter;

    let filtered = this.forcePotentials;

    if (side !== 'ALL') {
      filtered = filtered.filter(f => f.side === side);
    }
    if (category !== 'ALL') {
      filtered = filtered.filter(f => f.category === category);
    }
    if (metricSystem !== 'ALL') {
      filtered = filtered.filter(f => f.metricSystem === metricSystem);
    }

    if (query) {
      filtered = filtered.filter(f =>
        f.category.toLowerCase().includes(query) ||
        f.metricSystem.toLowerCase().includes(query)
      );
    }

    return filtered;
  }

  get filteredVehicleDesignations() {
    const query = this.searchQuery.toLowerCase();
    const side = this.vehicleDesignationsSideFilter;
    const family = this.familyFilter;
    const vehicleType = this.vehicleTypeFilter;
    const aOrBType = this.aOrBTypeFilter;
    const role = this.vehicleDesignationsRoleFilter;
    const designation = this.vehicleDesignationsDesignationSearch.toLowerCase();

    let filtered = this.vehicleDesignations;

    if (side !== 'ALL') {
      filtered = filtered.filter(v => v.side === side);
    }
    if (family !== 'ALL') {
      filtered = filtered.filter(v => v.family === family);
    }
    if (vehicleType !== 'ALL') {
      filtered = filtered.filter(v => v.vehicleType === vehicleType);
    }
    if (aOrBType !== 'ALL') {
      filtered = filtered.filter(v => v.aOrBType === aOrBType);
    }
    if (role !== 'ALL') {
      filtered = filtered.filter(v => v.role === role);
    }
    if (designation) {
      filtered = filtered.filter(v => v.designation.toLowerCase().includes(designation));
    }
    if (query) {
      filtered = filtered.filter(v =>
        v.designation.toLowerCase().includes(query) ||
        v.vehicleType.toLowerCase().includes(query)
      );
    }

    return filtered;
  }

  // Get current data based on subcategory
  get currentData() {
    const subcategory = this.activeSubcategory;
    switch (subcategory) {
      case 'land-units': return this.applyColumnFilters('land-units', this.filteredLandUnits);
      case 'arm-type': return this.applyColumnFilters('arm-type', this.filteredArmTypes);
      case 'weapon-category': return this.applyColumnFilters('weapon-category', this.filteredWeaponCategories);
      case 'weapon-sensor': return this.applyColumnFilters('weapon-sensor', this.filteredWeaponSensors);
      case 'land-unit-resources':
        const resourceSub = this.activeResourceSubcategory;
        switch (resourceSub) {
          case 'resources-main': return this.applyColumnFilters('resources-main', this.filteredLandUnitResources);
          case 'vehicle-speeds': return this.applyColumnFilters('vehicle-speeds', this.filteredVehicleSpeeds);
          case 'frontage-depth': return this.applyColumnFilters('frontage-depth', this.filteredFrontageDepths);
          case 'force-potential': return this.applyColumnFilters('force-potential', this.filteredForcePotentials);
          case 'vehicle-designations': return this.applyColumnFilters('vehicle-designations', this.filteredVehicleDesignations);
          default: return [];
        }
      default: return [];
    }
  }

  // Get unique filter values - use dynamic options from metadata service when available, fallback to computed
  get uniqueSides() {
    const dynamicOptions = this.filterOptions['land_units_side'];
    if (dynamicOptions && dynamicOptions.length > 1) {
      return dynamicOptions.filter(v => v !== 'ALL');
    }
    return [...new Set(this.landUnits.map(u => u.side))];
  }

  get uniqueUnitTypes() {
    const dynamicOptions = this.filterOptions['land_units_formation_unit_type'];
    if (dynamicOptions && dynamicOptions.length > 1) {
      return dynamicOptions.filter(v => v !== 'ALL');
    }
    return [...new Set(this.landUnits.map(u => u.formationUnitType))];
  }

  get uniqueParents() {
    return [...new Set(this.landUnits.map(u => u.formationUnitParentName))];
  }

  get uniqueLocations() {
    return [...new Set(this.landUnits.map(u => u.locationName))];
  }

  get uniqueWeaponTypes() {
    const dynamicOptions = this.filterOptions['weapon_categories_weapon_category'];
    if (dynamicOptions && dynamicOptions.length > 1) {
      return dynamicOptions.filter(v => v !== 'ALL');
    }
    return [...new Set(this.weaponCategories.map(w => w.weaponCategory))];
  }

  get uniqueArmTypes() {
    const dynamicOptions = this.filterOptions['weapon_categories_arm_type'];
    if (dynamicOptions && dynamicOptions.length > 1) {
      return dynamicOptions.filter(v => v !== 'ALL');
    }
    return [...new Set(this.weaponCategories.map(w => w.armType))];
  }

  get uniqueWeaponSensorTypes() {
    const dynamicOptions = this.filterOptions['weapon_sensors_type'];
    if (dynamicOptions && dynamicOptions.length > 1) {
      return dynamicOptions.filter(v => v !== 'ALL');
    }
    return [...new Set(this.weaponSensors.map(w => w.type))];
  }

  get uniqueVehicleCategories() {
    const dynamicOptions = this.filterOptions['vehicle_speeds_vehicle_category'];
    if (dynamicOptions && dynamicOptions.length > 1) {
      return dynamicOptions.filter(v => v !== 'ALL');
    }
    return [...new Set(this.vehicleSpeeds.map(v => v.vehicleCategory))];
  }

  get uniqueUnitLevels() {
    const dynamicOptions = this.filterOptions['frontage_depth_unit_level'];
    if (dynamicOptions && dynamicOptions.length > 1) {
      return dynamicOptions.filter(v => v !== 'ALL');
    }
    return [...new Set(this.frontageDepths.map(f => f.unitLevel))];
  }

  // New high-priority filter unique values
  get uniqueWeaponCategoriesSides() {
    const dynamicOptions = this.filterOptions['weapon_categories_side'];
    if (dynamicOptions && dynamicOptions.length > 1) {
      return dynamicOptions.filter(v => v !== 'ALL');
    }
    return [...new Set(this.weaponCategories.map(w => w.side))];
  }

  get uniqueSubCategories() {
    const dynamicOptions = this.filterOptions['weapon_categories_sub_category'];
    if (dynamicOptions && dynamicOptions.length > 1) {
      return dynamicOptions.filter(v => v !== 'ALL');
    }
    return [...new Set(this.weaponCategories.map(w => w.subCategory))];
  }

  get uniqueCalibers() {
    const dynamicOptions = this.filterOptions['weapon_categories_caliber'];
    if (dynamicOptions && dynamicOptions.length > 1) {
      return dynamicOptions.filter(v => v !== 'ALL');
    }
    return [...new Set(this.weaponCategories.map(w => w.caliber))];
  }

  get uniqueTypeGuidances() {
    const dynamicOptions = this.filterOptions['weapon_categories_type_guidance'];
    if (dynamicOptions && dynamicOptions.length > 1) {
      return dynamicOptions.filter(v => v !== 'ALL');
    }
    return [...new Set(this.weaponCategories.map(w => w.typeGuidance))];
  }

  get uniqueWeaponSensorsSides() {
    const dynamicOptions = this.filterOptions['weapon_sensors_side'];
    if (dynamicOptions && dynamicOptions.length > 1) {
      return dynamicOptions.filter(v => v !== 'ALL');
    }
    return [...new Set(this.weaponSensors.map(w => w.side))];
  }

  get uniqueSubTypes() {
    const dynamicOptions = this.filterOptions['weapon_sensors_sub_type'];
    if (dynamicOptions && dynamicOptions.length > 1) {
      return dynamicOptions.filter(v => v !== 'ALL');
    }
    return [...new Set(this.weaponSensors.map(w => w.subType))];
  }

  get uniqueClassificationCombatRoles() {
    const dynamicOptions = this.filterOptions['arm_types_classification_combat_role'];
    if (dynamicOptions && dynamicOptions.length > 1) {
      return dynamicOptions.filter(v => v !== 'ALL');
    }
    return [...new Set(this.armTypes.map(a => a.classificationCombatRole))];
  }

  get uniqueClassificationMobilities() {
    const dynamicOptions = this.filterOptions['arm_types_classification_mobility'];
    if (dynamicOptions && dynamicOptions.length > 1) {
      return dynamicOptions.filter(v => v !== 'ALL');
    }
    return [...new Set(this.armTypes.map(a => a.classificationMobility))];
  }

  get uniqueTrainingCategories() {
    const dynamicOptions = this.filterOptions['arm_types_training_category'];
    if (dynamicOptions && dynamicOptions.length > 1) {
      return dynamicOptions.filter(v => v !== 'ALL');
    }
    return [...new Set(this.armTypes.map(a => a.trainingCategory))];
  }

  get uniqueTerrainSpecialisations() {
    const dynamicOptions = this.filterOptions['arm_types_terrain_specialisation'];
    if (dynamicOptions && dynamicOptions.length > 1) {
      return dynamicOptions.filter(v => v !== 'ALL');
    }
    return [...new Set(this.armTypes.map(a => a.terrainSpecialisation))];
  }

  get uniqueForcePotentialSides() {
    const dynamicOptions = this.filterOptions['force_potential_side'];
    if (dynamicOptions && dynamicOptions.length > 1) {
      return dynamicOptions.filter(v => v !== 'ALL');
    }
    return [...new Set(this.forcePotentials.map(f => f.side))];
  }

  get uniqueForcePotentialCategories() {
    const dynamicOptions = this.filterOptions['force_potential_category'];
    if (dynamicOptions && dynamicOptions.length > 1) {
      return dynamicOptions.filter(v => v !== 'ALL');
    }
    return [...new Set(this.forcePotentials.map(f => f.category))];
  }

  get uniqueMetricSystems() {
    const dynamicOptions = this.filterOptions['force_potential_metric_system'];
    if (dynamicOptions && dynamicOptions.length > 1) {
      return dynamicOptions.filter(v => v !== 'ALL');
    }
    return [...new Set(this.forcePotentials.map(f => f.metricSystem))];
  }

  get uniqueVehicleDesignationsSides() {
    const dynamicOptions = this.filterOptions['vehicle_designations_side'];
    if (dynamicOptions && dynamicOptions.length > 1) {
      return dynamicOptions.filter(v => v !== 'ALL');
    }
    return [...new Set(this.vehicleDesignations.map(v => v.side))];
  }

  get uniqueFamilies() {
    const dynamicOptions = this.filterOptions['vehicle_designations_family'];
    if (dynamicOptions && dynamicOptions.length > 1) {
      return dynamicOptions.filter(v => v !== 'ALL');
    }
    return [...new Set(this.vehicleDesignations.map(v => v.family))];
  }

  get uniqueVehicleTypes() {
    const dynamicOptions = this.filterOptions['vehicle_designations_vehicle_type'];
    if (dynamicOptions && dynamicOptions.length > 1) {
      return dynamicOptions.filter(v => v !== 'ALL');
    }
    return [...new Set(this.vehicleDesignations.map(v => v.vehicleType))];
  }

  get uniqueAOrBTypes() {
    const dynamicOptions = this.filterOptions['vehicle_designations_a_or_b_type'];
    if (dynamicOptions && dynamicOptions.length > 1) {
      return dynamicOptions.filter(v => v !== 'ALL');
    }
    return [...new Set(this.vehicleDesignations.map(v => v.aOrBType))];
  }

  get uniqueVehicleDesignationsRoles() {
    const dynamicOptions = this.filterOptions['vehicle_designations_role'];
    if (dynamicOptions && dynamicOptions.length > 1) {
      return dynamicOptions.filter(v => v !== 'ALL');
    }
    return [...new Set(this.vehicleDesignations.map(v => v.role))];
  }

  get uniqueFrontageDepthSides() {
    const dynamicOptions = this.filterOptions['frontage_depth_side'];
    if (dynamicOptions && dynamicOptions.length > 1) {
      return dynamicOptions.filter(v => v !== 'ALL');
    }
    return [...new Set(this.frontageDepths.map(f => f.side))];
  }

  get uniqueOperationTypes() {
    const dynamicOptions = this.filterOptions['frontage_depth_operation_type'];
    if (dynamicOptions && dynamicOptions.length > 1) {
      return dynamicOptions.filter(v => v !== 'ALL');
    }
    return [...new Set(this.frontageDepths.map(f => f.operationType))];
  }

  get uniqueVehicleSpeedsSides() {
    const dynamicOptions = this.filterOptions['vehicle_speeds_side'];
    if (dynamicOptions && dynamicOptions.length > 1) {
      return dynamicOptions.filter(v => v !== 'ALL');
    }
    return [...new Set(this.vehicleSpeeds.map(v => v.side))];
  }

  // Typed getters for each subcategory
  get landUnitsData(): LandUnit[] {
    return this.applyColumnFilters('land-units', this.filteredLandUnits);
  }

  get armTypesData(): ArmType[] {
    return this.applyColumnFilters('arm-type', this.filteredArmTypes);
  }

  // Add side property to ArmType for display
  getArmTypeWithSide(arm: ArmType): ArmType & { side: string } {
    return { ...arm, side: 'CHINA' };
  }

  get weaponCategoriesData(): WeaponCategory[] {
    return this.applyColumnFilters('weapon-category', this.filteredWeaponCategories);
  }

  get weaponSensorsData(): WeaponSensor[] {
    return this.applyColumnFilters('weapon-sensor', this.filteredWeaponSensors);
  }

  get landUnitResourcesData(): LandUnitResource[] {
    return this.applyColumnFilters('resources-main', this.filteredLandUnitResources);
  }

  get vehicleSpeedsData(): VehicleSpeed[] {
    return this.applyColumnFilters('vehicle-speeds', this.filteredVehicleSpeeds);
  }

  get frontageDepthsData(): FrontageDepth[] {
    return this.applyColumnFilters('frontage-depth', this.filteredFrontageDepths);
  }

  get forcePotentialsData(): ForcePotential[] {
    return this.applyColumnFilters('force-potential', this.filteredForcePotentials);
  }

  get vehicleDesignationsData(): VehicleDesignation[] {
    return this.applyColumnFilters('vehicle-designations', this.filteredVehicleDesignations);
  }

  retry(): void {
    this.loadData();
  }

  private getCellValue(row: unknown[], index: number): string {
    const value = row[index];
    return value === null || value === undefined ? '' : String(value);
  }
}
