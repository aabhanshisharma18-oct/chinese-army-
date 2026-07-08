import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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

@Component({
  selector: 'app-land',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './land.component.html',
  styleUrls: ['./land.component.scss']
})
export class LandComponent implements OnInit {
  // Subcategory navigation
  activeSubcategory = signal<SubcategoryType>('land-units');
  activeResourceSubcategory = signal<ResourceSubcategoryType>('resources-main');
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
  currentLevel = signal<DrillDownLevel>('categories');
  selectedFilter = signal<string | null>(null);
  
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
  searchQuery = signal<string>('');
  sideFilter = signal<string>('ALL');
  unitTypeFilter = signal<string>('ALL');
  parentFilter = signal<string>('ALL');
  locationFilter = signal<string>('ALL');
  weaponTypeFilter = signal<string>('ALL');
  armTypeFilter = signal<string>('ALL');
  weaponSensorTypeFilter = signal<string>('ALL');
  vehicleCategoryFilter = signal<string>('ALL');
  unitLevelFilter = signal<string>('ALL');

  // Search fields for high-cardinality columns
  formationUnitNameSearch = signal<string>('');
  combatArmTypeSearch = signal<string>('');
  weaponNameSearch = signal<string>('');
  designationSearch = signal<string>('');
  weaponSensorNameSearch = signal<string>('');
  brigadeUnitTypeSearch = signal<string>('');
  vehicleSystemSearch = signal<string>('');
  vehicleDesignationSearch = signal<string>('');
  zoneSearch = signal<string>('');
  vehicleDesignationsDesignationSearch = signal<string>('');

  // New high-priority filters
  weaponCategoriesSideFilter = signal<string>('ALL');
  subCategoryFilter = signal<string>('ALL');
  caliberFilter = signal<string>('ALL');
  weaponSensorsSideFilter = signal<string>('ALL');
  subTypeFilter = signal<string>('ALL');
  classificationCombatRoleFilter = signal<string>('ALL');
  classificationMobilityFilter = signal<string>('ALL');
  terrainSpecialisationFilter = signal<string>('ALL');
  forcePotentialSideFilter = signal<string>('ALL');
  forcePotentialCategoryFilter = signal<string>('ALL');
  metricSystemFilter = signal<string>('ALL');
  vehicleDesignationsSideFilter = signal<string>('ALL');
  familyFilter = signal<string>('ALL');
  vehicleTypeFilter = signal<string>('ALL');
  vehicleDesignationsRoleFilter = signal<string>('ALL');
  frontageDepthSideFilter = signal<string>('ALL');
  operationTypeFilter = signal<string>('ALL');
  vehicleSpeedsSideFilter = signal<string>('ALL');
  
  // Loading states
  loading = true;
  error: string | null = null;

  // Dynamic filter options
  filterOptions: Record<string, string[]> = {};

  constructor(
    private excelDataService: ExcelDataService,
    private metadataService: MetadataService
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.loadFilterOptions();
  }

  loadData(): void {
    this.loading = true;
    this.error = null;
    let loadedCount = 0;
    const totalSheets = 9;

    const checkComplete = () => {
      loadedCount++;
      if (loadedCount >= totalSheets) {
        this.loading = false;
      }
    };

    // Load all sheets in parallel
    this.excelDataService.getSheet('assets/data/raw/1_Land_Units.json').subscribe({
      next: (data: unknown) => { this.landUnits = this.parseLandUnits(data); checkComplete(); },
      error: (err) => { console.error('Failed to load land units:', err); checkComplete(); }
    });

    this.excelDataService.getSheet('assets/data/raw/2_Arm_Types.json').subscribe({
      next: (data: unknown) => { this.armTypes = this.parseArmTypes(data); checkComplete(); },
      error: (err) => { console.error('Failed to load arm types:', err); checkComplete(); }
    });

    this.excelDataService.getSheet('assets/data/raw/3_Weapon_Categories.json').subscribe({
      next: (data: unknown) => { this.weaponCategories = this.parseWeaponCategories(data); checkComplete(); },
      error: (err) => { console.error('Failed to load weapon categories:', err); checkComplete(); }
    });

    this.excelDataService.getSheet('assets/data/raw/4_Weapon_Sensor.json').subscribe({
      next: (data: unknown) => { this.weaponSensors = this.parseWeaponSensors(data); checkComplete(); },
      error: (err) => { console.error('Failed to load weapon sensors:', err); checkComplete(); }
    });

    this.excelDataService.getSheet('assets/data/raw/5_Land_Unit_Resources.json').subscribe({
      next: (data: unknown) => { this.landUnitResources = this.parseLandUnitResources(data); checkComplete(); },
      error: (err) => { console.error('Failed to load land unit resources:', err); checkComplete(); }
    });

    this.excelDataService.getSheet('assets/data/raw/6_Vehicle_Speeds.json').subscribe({
      next: (data: unknown) => { this.vehicleSpeeds = this.parseVehicleSpeeds(data); checkComplete(); },
      error: (err) => { console.error('Failed to load vehicle speeds:', err); checkComplete(); }
    });

    this.excelDataService.getSheet('assets/data/raw/7_Frontage_Depth.json').subscribe({
      next: (data: unknown) => { this.frontageDepths = this.parseFrontageDepths(data); checkComplete(); },
      error: (err) => { console.error('Failed to load frontage depths:', err); checkComplete(); }
    });

    this.excelDataService.getSheet('assets/data/raw/8_Force_Potential.json').subscribe({
      next: (data: unknown) => { this.forcePotentials = this.parseForcePotentials(data); checkComplete(); },
      error: (err) => { console.error('Failed to load force potentials:', err); checkComplete(); }
    });

    this.excelDataService.getSheet('assets/data/raw/9_Vehicle_Designations.json').subscribe({
      next: (data: unknown) => { this.vehicleDesignations = this.parseVehicleDesignations(data); checkComplete(); },
      error: (err) => { console.error('Failed to load vehicle designations:', err); checkComplete(); }
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
    this.activeSubcategory.set(subcategory);
    this.currentLevel.set('categories');
    this.resetFilters();
  }

  selectFilter(filter: string): void {
    this.selectedFilter.set(filter);
    this.currentLevel.set('results');
  }

  goBack(): void {
    if (this.currentLevel() === 'results') {
      this.currentLevel.set('categories');
      this.selectedFilter.set(null);
    }
  }

  resetToTop(): void {
    this.currentLevel.set('categories');
    this.selectedFilter.set(null);
    this.resetFilters();
  }

  resetFilters(): void {
    this.searchQuery.set('');
    this.sideFilter.set('ALL');
    this.unitTypeFilter.set('ALL');
    this.parentFilter.set('ALL');
    this.locationFilter.set('ALL');
    this.weaponTypeFilter.set('ALL');
    this.armTypeFilter.set('ALL');
    this.weaponSensorTypeFilter.set('ALL');
    this.vehicleCategoryFilter.set('ALL');
    this.unitLevelFilter.set('ALL');

    // New high-priority filters
    this.weaponCategoriesSideFilter.set('ALL');
    this.subCategoryFilter.set('ALL');
    this.caliberFilter.set('ALL');
    this.weaponSensorsSideFilter.set('ALL');
    this.subTypeFilter.set('ALL');
    this.classificationCombatRoleFilter.set('ALL');
    this.classificationMobilityFilter.set('ALL');
    this.terrainSpecialisationFilter.set('ALL');
    this.forcePotentialSideFilter.set('ALL');
    this.forcePotentialCategoryFilter.set('ALL');
    this.metricSystemFilter.set('ALL');
    this.vehicleDesignationsSideFilter.set('ALL');
    this.familyFilter.set('ALL');
    this.vehicleTypeFilter.set('ALL');
    this.vehicleDesignationsRoleFilter.set('ALL');
    this.frontageDepthSideFilter.set('ALL');
    this.operationTypeFilter.set('ALL');
    this.vehicleSpeedsSideFilter.set('ALL');

    // Search fields
    this.formationUnitNameSearch.set('');
    this.combatArmTypeSearch.set('');
    this.weaponNameSearch.set('');
    this.designationSearch.set('');
    this.weaponSensorNameSearch.set('');
    this.brigadeUnitTypeSearch.set('');
    this.vehicleSystemSearch.set('');
    this.vehicleDesignationSearch.set('');
    this.zoneSearch.set('');
    this.vehicleDesignationsDesignationSearch.set('');
  }

  setResourceSubcategory(subcategory: ResourceSubcategoryType): void {
    this.activeResourceSubcategory.set(subcategory);
  }

  // Computed properties for filtered results
  filteredLandUnits = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const side = this.sideFilter();
    const unitType = this.unitTypeFilter();
    const parent = this.parentFilter();
    const location = this.locationFilter();
    const formationUnitName = this.formationUnitNameSearch().toLowerCase();

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
  });

  filteredArmTypes = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const combatRole = this.classificationCombatRoleFilter();
    const mobility = this.classificationMobilityFilter();
    const terrain = this.terrainSpecialisationFilter();
    const combatArmType = this.combatArmTypeSearch().toLowerCase();

    let filtered = this.armTypes;

    if (combatRole !== 'ALL') {
      filtered = filtered.filter(t => t.classificationCombatRole === combatRole);
    }
    if (mobility !== 'ALL') {
      filtered = filtered.filter(t => t.classificationMobility === mobility);
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
  });

  filteredWeaponCategories = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const weaponType = this.weaponTypeFilter();
    const armType = this.armTypeFilter();
    const side = this.weaponCategoriesSideFilter();
    const subCategory = this.subCategoryFilter();
    const caliber = this.caliberFilter();
    const weaponName = this.weaponNameSearch().toLowerCase();
    const designation = this.designationSearch().toLowerCase();

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
  });

  filteredWeaponSensors = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const weaponSensorType = this.weaponSensorTypeFilter();
    const side = this.weaponSensorsSideFilter();
    const subType = this.subTypeFilter();
    const weaponSensorName = this.weaponSensorNameSearch().toLowerCase();

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
  });

  filteredLandUnitResources = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const side = this.sideFilter();
    const brigadeUnitType = this.brigadeUnitTypeSearch().toLowerCase();

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
  });

  filteredVehicleSpeeds = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const vehicleCategory = this.vehicleCategoryFilter();
    const side = this.vehicleSpeedsSideFilter();
    const vehicleSystem = this.vehicleSystemSearch().toLowerCase();
    const designation = this.vehicleDesignationSearch().toLowerCase();

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
  });

  filteredFrontageDepths = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const unitLevel = this.unitLevelFilter();
    const side = this.frontageDepthSideFilter();
    const operationType = this.operationTypeFilter();
    const zone = this.zoneSearch().toLowerCase();

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
  });

  filteredForcePotentials = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const side = this.forcePotentialSideFilter();
    const category = this.forcePotentialCategoryFilter();
    const metricSystem = this.metricSystemFilter();

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
  });

  filteredVehicleDesignations = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const side = this.vehicleDesignationsSideFilter();
    const family = this.familyFilter();
    const vehicleType = this.vehicleTypeFilter();
    const role = this.vehicleDesignationsRoleFilter();
    const designation = this.vehicleDesignationsDesignationSearch().toLowerCase();

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
  });

  // Get current data based on subcategory
  currentData = computed(() => {
    const subcategory = this.activeSubcategory();
    switch (subcategory) {
      case 'land-units': return this.filteredLandUnits();
      case 'arm-type': return this.filteredArmTypes();
      case 'weapon-category': return this.filteredWeaponCategories();
      case 'weapon-sensor': return this.filteredWeaponSensors();
      case 'land-unit-resources':
        const resourceSub = this.activeResourceSubcategory();
        switch (resourceSub) {
          case 'resources-main': return this.filteredLandUnitResources();
          case 'vehicle-speeds': return this.filteredVehicleSpeeds();
          case 'frontage-depth': return this.filteredFrontageDepths();
          case 'force-potential': return this.filteredForcePotentials();
          case 'vehicle-designations': return this.filteredVehicleDesignations();
          default: return [];
        }
      default: return [];
    }
  });

  // Get unique filter values - use dynamic options from metadata service when available, fallback to computed
  uniqueSides = computed(() => {
    const dynamicOptions = this.filterOptions['land_units_side'];
    if (dynamicOptions && dynamicOptions.length > 1) {
      return dynamicOptions.filter(v => v !== 'ALL');
    }
    return [...new Set(this.landUnits.map(u => u.side))];
  });

  uniqueUnitTypes = computed(() => {
    const dynamicOptions = this.filterOptions['land_units_formation_unit_type'];
    if (dynamicOptions && dynamicOptions.length > 1) {
      return dynamicOptions.filter(v => v !== 'ALL');
    }
    return [...new Set(this.landUnits.map(u => u.formationUnitType))];
  });

  uniqueParents = computed(() => {
    return [...new Set(this.landUnits.map(u => u.formationUnitParentName))];
  });

  uniqueLocations = computed(() => {
    return [...new Set(this.landUnits.map(u => u.locationName))];
  });

  uniqueWeaponTypes = computed(() => {
    const dynamicOptions = this.filterOptions['weapon_categories_weapon_category'];
    if (dynamicOptions && dynamicOptions.length > 1) {
      return dynamicOptions.filter(v => v !== 'ALL');
    }
    return [...new Set(this.weaponCategories.map(w => w.weaponCategory))];
  });

  uniqueArmTypes = computed(() => {
    const dynamicOptions = this.filterOptions['weapon_categories_arm_type'];
    if (dynamicOptions && dynamicOptions.length > 1) {
      return dynamicOptions.filter(v => v !== 'ALL');
    }
    return [...new Set(this.weaponCategories.map(w => w.armType))];
  });

  uniqueWeaponSensorTypes = computed(() => {
    const dynamicOptions = this.filterOptions['weapon_sensors_type'];
    if (dynamicOptions && dynamicOptions.length > 1) {
      return dynamicOptions.filter(v => v !== 'ALL');
    }
    return [...new Set(this.weaponSensors.map(w => w.type))];
  });

  uniqueVehicleCategories = computed(() => {
    const dynamicOptions = this.filterOptions['vehicle_speeds_vehicle_category'];
    if (dynamicOptions && dynamicOptions.length > 1) {
      return dynamicOptions.filter(v => v !== 'ALL');
    }
    return [...new Set(this.vehicleSpeeds.map(v => v.vehicleCategory))];
  });

  uniqueUnitLevels = computed(() => {
    const dynamicOptions = this.filterOptions['frontage_depth_unit_level'];
    if (dynamicOptions && dynamicOptions.length > 1) {
      return dynamicOptions.filter(v => v !== 'ALL');
    }
    return [...new Set(this.frontageDepths.map(f => f.unitLevel))];
  });

  // New high-priority filter unique values
  uniqueWeaponCategoriesSides = computed(() => {
    const dynamicOptions = this.filterOptions['weapon_categories_side'];
    if (dynamicOptions && dynamicOptions.length > 1) {
      return dynamicOptions.filter(v => v !== 'ALL');
    }
    return [...new Set(this.weaponCategories.map(w => w.side))];
  });

  uniqueSubCategories = computed(() => {
    const dynamicOptions = this.filterOptions['weapon_categories_sub_category'];
    if (dynamicOptions && dynamicOptions.length > 1) {
      return dynamicOptions.filter(v => v !== 'ALL');
    }
    return [...new Set(this.weaponCategories.map(w => w.subCategory))];
  });

  uniqueCalibers = computed(() => {
    const dynamicOptions = this.filterOptions['weapon_categories_caliber'];
    if (dynamicOptions && dynamicOptions.length > 1) {
      return dynamicOptions.filter(v => v !== 'ALL');
    }
    return [...new Set(this.weaponCategories.map(w => w.caliber))];
  });

  uniqueWeaponSensorsSides = computed(() => {
    const dynamicOptions = this.filterOptions['weapon_sensors_side'];
    if (dynamicOptions && dynamicOptions.length > 1) {
      return dynamicOptions.filter(v => v !== 'ALL');
    }
    return [...new Set(this.weaponSensors.map(w => w.side))];
  });

  uniqueSubTypes = computed(() => {
    const dynamicOptions = this.filterOptions['weapon_sensors_sub_type'];
    if (dynamicOptions && dynamicOptions.length > 1) {
      return dynamicOptions.filter(v => v !== 'ALL');
    }
    return [...new Set(this.weaponSensors.map(w => w.subType))];
  });

  uniqueClassificationCombatRoles = computed(() => {
    const dynamicOptions = this.filterOptions['arm_types_classification_combat_role'];
    if (dynamicOptions && dynamicOptions.length > 1) {
      return dynamicOptions.filter(v => v !== 'ALL');
    }
    return [...new Set(this.armTypes.map(a => a.classificationCombatRole))];
  });

  uniqueClassificationMobilities = computed(() => {
    const dynamicOptions = this.filterOptions['arm_types_classification_mobility'];
    if (dynamicOptions && dynamicOptions.length > 1) {
      return dynamicOptions.filter(v => v !== 'ALL');
    }
    return [...new Set(this.armTypes.map(a => a.classificationMobility))];
  });

  uniqueTerrainSpecialisations = computed(() => {
    const dynamicOptions = this.filterOptions['arm_types_terrain_specialisation'];
    if (dynamicOptions && dynamicOptions.length > 1) {
      return dynamicOptions.filter(v => v !== 'ALL');
    }
    return [...new Set(this.armTypes.map(a => a.terrainSpecialisation))];
  });

  uniqueForcePotentialSides = computed(() => {
    const dynamicOptions = this.filterOptions['force_potential_side'];
    if (dynamicOptions && dynamicOptions.length > 1) {
      return dynamicOptions.filter(v => v !== 'ALL');
    }
    return [...new Set(this.forcePotentials.map(f => f.side))];
  });

  uniqueForcePotentialCategories = computed(() => {
    const dynamicOptions = this.filterOptions['force_potential_category'];
    if (dynamicOptions && dynamicOptions.length > 1) {
      return dynamicOptions.filter(v => v !== 'ALL');
    }
    return [...new Set(this.forcePotentials.map(f => f.category))];
  });

  uniqueMetricSystems = computed(() => {
    const dynamicOptions = this.filterOptions['force_potential_metric_system'];
    if (dynamicOptions && dynamicOptions.length > 1) {
      return dynamicOptions.filter(v => v !== 'ALL');
    }
    return [...new Set(this.forcePotentials.map(f => f.metricSystem))];
  });

  uniqueVehicleDesignationsSides = computed(() => {
    const dynamicOptions = this.filterOptions['vehicle_designations_side'];
    if (dynamicOptions && dynamicOptions.length > 1) {
      return dynamicOptions.filter(v => v !== 'ALL');
    }
    return [...new Set(this.vehicleDesignations.map(v => v.side))];
  });

  uniqueFamilies = computed(() => {
    const dynamicOptions = this.filterOptions['vehicle_designations_family'];
    if (dynamicOptions && dynamicOptions.length > 1) {
      return dynamicOptions.filter(v => v !== 'ALL');
    }
    return [...new Set(this.vehicleDesignations.map(v => v.family))];
  });

  uniqueVehicleTypes = computed(() => {
    const dynamicOptions = this.filterOptions['vehicle_designations_vehicle_type'];
    if (dynamicOptions && dynamicOptions.length > 1) {
      return dynamicOptions.filter(v => v !== 'ALL');
    }
    return [...new Set(this.vehicleDesignations.map(v => v.vehicleType))];
  });

  uniqueVehicleDesignationsRoles = computed(() => {
    const dynamicOptions = this.filterOptions['vehicle_designations_role'];
    if (dynamicOptions && dynamicOptions.length > 1) {
      return dynamicOptions.filter(v => v !== 'ALL');
    }
    return [...new Set(this.vehicleDesignations.map(v => v.role))];
  });

  uniqueFrontageDepthSides = computed(() => {
    const dynamicOptions = this.filterOptions['frontage_depth_side'];
    if (dynamicOptions && dynamicOptions.length > 1) {
      return dynamicOptions.filter(v => v !== 'ALL');
    }
    return [...new Set(this.frontageDepths.map(f => f.side))];
  });

  uniqueOperationTypes = computed(() => {
    const dynamicOptions = this.filterOptions['frontage_depth_operation_type'];
    if (dynamicOptions && dynamicOptions.length > 1) {
      return dynamicOptions.filter(v => v !== 'ALL');
    }
    return [...new Set(this.frontageDepths.map(f => f.operationType))];
  });

  uniqueVehicleSpeedsSides = computed(() => {
    const dynamicOptions = this.filterOptions['vehicle_speeds_side'];
    if (dynamicOptions && dynamicOptions.length > 1) {
      return dynamicOptions.filter(v => v !== 'ALL');
    }
    return [...new Set(this.vehicleSpeeds.map(v => v.side))];
  });

  // Typed getters for each subcategory
  get landUnitsData(): LandUnit[] {
    return this.filteredLandUnits();
  }

  get armTypesData(): ArmType[] {
    return this.filteredArmTypes();
  }

  // Add side property to ArmType for display
  getArmTypeWithSide(arm: ArmType): ArmType & { side: string } {
    return { ...arm, side: 'CHINA' };
  }

  get weaponCategoriesData(): WeaponCategory[] {
    return this.filteredWeaponCategories();
  }

  get weaponSensorsData(): WeaponSensor[] {
    return this.filteredWeaponSensors();
  }

  get landUnitResourcesData(): LandUnitResource[] {
    return this.filteredLandUnitResources();
  }

  get vehicleSpeedsData(): VehicleSpeed[] {
    return this.filteredVehicleSpeeds();
  }

  get frontageDepthsData(): FrontageDepth[] {
    return this.filteredFrontageDepths();
  }

  get forcePotentialsData(): ForcePotential[] {
    return this.filteredForcePotentials();
  }

  get vehicleDesignationsData(): VehicleDesignation[] {
    return this.filteredVehicleDesignations();
  }

  retry(): void {
    this.loadData();
  }

  private getCellValue(row: unknown[], index: number): string {
    const value = row[index];
    return value === null || value === undefined ? '' : String(value);
  }
}
