import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExcelDataService } from '../../services/excel-data.service';

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

interface TheaterCapability {
  side: string;
  theaterCommand: string;
  hqLocation: string;
  latitude: string;
  longitude: string;
  groupArmiesUnderIt: string;
  combatPowerFocus: string;
  keyCapabilities: string;
  areaOfResponsibility: string;
  specialUnitsNotes: string;
}

type SubcategoryType = 'land-units' | 'arm-type' | 'weapon-category' | 'weapon-sensor' | 'land-unit-resources' | 'theater-capabilities';
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
    { label: 'Land Unit Resources', value: 'land-unit-resources' },
    { label: 'Theater Capabilities', value: 'theater-capabilities' }
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
  theaterCapabilities: TheaterCapability[] = [];
  
  // Filters
  searchQuery = signal<string>('');
  sideFilter = signal<string>('ALL');
  unitTypeFilter = signal<string>('ALL');
  parentFilter = signal<string>('ALL');
  locationFilter = signal<string>('ALL');
  weaponTypeFilter = signal<string>('ALL');
  vehicleCategoryFilter = signal<string>('ALL');
  unitLevelFilter = signal<string>('ALL');
  
  // Loading states
  loading = true;
  error: string | null = null;

  constructor(private excelDataService: ExcelDataService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.error = null;
    let loadedCount = 0;
    const totalSheets = 10;

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

    this.excelDataService.getSheet('assets/data/raw/12_Theater_Capabilities.json').subscribe({
      next: (data: unknown) => { this.theaterCapabilities = this.parseTheaterCapabilities(data); checkComplete(); },
      error: (err) => { console.error('Failed to load theater capabilities:', err); checkComplete(); }
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

  private parseTheaterCapabilities(data: unknown): TheaterCapability[] {
    const rows = data as unknown[][];
    if (!Array.isArray(rows) || rows.length < 2) return [];

    const capabilities: TheaterCapability[] = [];
    for (let i = 2; i < rows.length; i++) {
      const row = rows[i] as unknown[];
      if (!Array.isArray(row) || row.length === 0) continue;

      const capability: TheaterCapability = {
        side: this.getCellValue(row, 0) || '',
        theaterCommand: this.getCellValue(row, 1) || '',
        hqLocation: this.getCellValue(row, 2) || '',
        latitude: this.getCellValue(row, 3) || '',
        longitude: this.getCellValue(row, 4) || '',
        groupArmiesUnderIt: this.getCellValue(row, 5) || '',
        combatPowerFocus: this.getCellValue(row, 6) || '',
        keyCapabilities: this.getCellValue(row, 7) || '',
        areaOfResponsibility: this.getCellValue(row, 8) || '',
        specialUnitsNotes: this.getCellValue(row, 9) || ''
      };

      if (capability.theaterCommand) {
        capabilities.push(capability);
      }
    }
    return capabilities;
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
    this.vehicleCategoryFilter.set('ALL');
    this.unitLevelFilter.set('ALL');
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
    if (!query) return this.armTypes;
    return this.armTypes.filter(t => 
      t.combatArmTypeEnglish.toLowerCase().includes(query) ||
      t.classificationCombatRole.toLowerCase().includes(query) ||
      t.terrainSpecialisation.toLowerCase().includes(query)
    );
  });

  filteredWeaponCategories = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const weaponType = this.weaponTypeFilter();
    
    let filtered = this.weaponCategories;
    
    if (weaponType !== 'ALL') {
      filtered = filtered.filter(w => w.weaponCategory === weaponType);
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
    const weaponType = this.weaponTypeFilter();
    
    let filtered = this.weaponSensors;
    
    if (weaponType !== 'ALL') {
      filtered = filtered.filter(w => w.type === weaponType);
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
    if (!query) return this.landUnitResources;
    return this.landUnitResources.filter(r => 
      r.brigadeUnitType.toLowerCase().includes(query) ||
      r.forcePotential.toLowerCase().includes(query)
    );
  });

  filteredVehicleSpeeds = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const vehicleCategory = this.vehicleCategoryFilter();
    
    let filtered = this.vehicleSpeeds;
    
    if (vehicleCategory !== 'ALL') {
      filtered = filtered.filter(v => v.vehicleCategory === vehicleCategory);
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
    
    let filtered = this.frontageDepths;
    
    if (unitLevel !== 'ALL') {
      filtered = filtered.filter(f => f.unitLevel === unitLevel);
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
    if (!query) return this.forcePotentials;
    return this.forcePotentials.filter(f => 
      f.category.toLowerCase().includes(query) ||
      f.metricSystem.toLowerCase().includes(query)
    );
  });

  filteredVehicleDesignations = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query) return this.vehicleDesignations;
    return this.vehicleDesignations.filter(v => 
      v.designation.toLowerCase().includes(query) ||
      v.vehicleType.toLowerCase().includes(query)
    );
  });

  filteredTheaterCapabilities = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query) return this.theaterCapabilities;
    return this.theaterCapabilities.filter(t => 
      t.theaterCommand.toLowerCase().includes(query) ||
      t.hqLocation.toLowerCase().includes(query)
    );
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
      case 'theater-capabilities': return this.filteredTheaterCapabilities();
      default: return [];
    }
  });

  // Get unique filter values
  uniqueSides = computed(() => [...new Set(this.landUnits.map(u => u.side))]);
  uniqueUnitTypes = computed(() => [...new Set(this.landUnits.map(u => u.formationUnitType))]);
  uniqueParents = computed(() => [...new Set(this.landUnits.map(u => u.formationUnitParentName))]);
  uniqueLocations = computed(() => [...new Set(this.landUnits.map(u => u.locationName))]);
  uniqueWeaponTypes = computed(() => [...new Set(this.weaponCategories.map(w => w.weaponCategory))]);
  uniqueVehicleCategories = computed(() => [...new Set(this.vehicleSpeeds.map(v => v.vehicleCategory))]);
  uniqueUnitLevels = computed(() => [...new Set(this.frontageDepths.map(f => f.unitLevel))]);

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

  get theaterCapabilitiesData(): TheaterCapability[] {
    return this.filteredTheaterCapabilities();
  }

  retry(): void {
    this.loadData();
  }

  private getCellValue(row: unknown[], index: number): string {
    const value = row[index];
    return value === null || value === undefined ? '' : String(value);
  }
}
