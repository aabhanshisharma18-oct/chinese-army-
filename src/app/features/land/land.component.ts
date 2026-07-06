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
  unitPotential: string;
  locationName: string;
  latitude: string;
  longitude: string;
}

interface ArmType {
  side: string;
  combatArmTypeEnglish: string;
  combatArmTypeChinese: string;
  classificationCombatRole: string;
  primaryMission: string;
  terrainSpecialization: string;
  trainingEmphasis: string;
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

type SubcategoryType = 'land-units' | 'arm-type' | 'weapon-category' | 'weapon-sensor' | 'land-unit-resources' | 'vehicle-speeds';
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
  subcategories: { label: string; value: SubcategoryType }[] = [
    { label: 'Land Units', value: 'land-units' },
    { label: 'Arm Type', value: 'arm-type' },
    { label: 'Weapon Category', value: 'weapon-category' },
    { label: 'Weapon & Sensor', value: 'weapon-sensor' },
    { label: 'Land Unit Resources', value: 'land-unit-resources' },
    { label: 'Vehicle Speeds', value: 'vehicle-speeds' }
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
  
  // Filters
  searchQuery = signal<string>('');
  sideFilter = signal<string>('ALL');
  unitTypeFilter = signal<string>('ALL');
  parentFilter = signal<string>('ALL');
  locationFilter = signal<string>('ALL');
  weaponTypeFilter = signal<string>('ALL');
  vehicleCategoryFilter = signal<string>('ALL');
  
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

    // Load all sheets in parallel
    this.excelDataService.getSheet('assets/data/raw/1_Land_Units.json').subscribe({
      next: (data: unknown) => {
        this.landUnits = this.parseLandUnits(data);
        this.checkLoadingComplete();
      },
      error: (err) => {
        console.error('Failed to load land units:', err);
        this.checkLoadingComplete();
      }
    });

    this.excelDataService.getSheet('assets/data/raw/2_Arm_Types.json').subscribe({
      next: (data: unknown) => {
        this.armTypes = this.parseArmTypes(data);
        this.checkLoadingComplete();
      },
      error: (err) => {
        console.error('Failed to load arm types:', err);
        this.checkLoadingComplete();
      }
    });

    this.excelDataService.getSheet('assets/data/raw/3_Weapon_Categories.json').subscribe({
      next: (data: unknown) => {
        this.weaponCategories = this.parseWeaponCategories(data);
        this.checkLoadingComplete();
      },
      error: (err) => {
        console.error('Failed to load weapon categories:', err);
        this.checkLoadingComplete();
      }
    });

    this.excelDataService.getSheet('assets/data/raw/4_Weapon_Sensor.json').subscribe({
      next: (data: unknown) => {
        this.weaponSensors = this.parseWeaponSensors(data);
        this.checkLoadingComplete();
      },
      error: (err) => {
        console.error('Failed to load weapon sensors:', err);
        this.checkLoadingComplete();
      }
    });

    this.excelDataService.getSheet('assets/data/raw/5_Land_Unit_Resources.json').subscribe({
      next: (data: unknown) => {
        this.landUnitResources = this.parseLandUnitResources(data);
        this.checkLoadingComplete();
      },
      error: (err) => {
        console.error('Failed to load land unit resources:', err);
        this.checkLoadingComplete();
      }
    });

    this.excelDataService.getSheet('assets/data/raw/6_Vehicle_Speeds.json').subscribe({
      next: (data: unknown) => {
        this.vehicleSpeeds = this.parseVehicleSpeeds(data);
        this.checkLoadingComplete();
      },
      error: (err) => {
        console.error('Failed to load vehicle speeds:', err);
        this.checkLoadingComplete();
      }
    });
  }

  private checkLoadingComplete(): void {
    // Simple check - in production you'd track each load separately
    if (this.landUnits.length > 0 || this.armTypes.length > 0) {
      this.loading = false;
    }
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
        unitPotential: this.getCellValue(row, 5) || '',
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
        side: this.getCellValue(row, 0) || '',
        combatArmTypeEnglish: this.getCellValue(row, 1) || '',
        combatArmTypeChinese: this.getCellValue(row, 2) || '',
        classificationCombatRole: this.getCellValue(row, 3) || '',
        primaryMission: this.getCellValue(row, 4) || '',
        terrainSpecialization: this.getCellValue(row, 5) || '',
        trainingEmphasis: this.getCellValue(row, 6) || ''
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
        roleCapability: this.getCellValue(row, 9) || ''
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
        nameLocation: this.getCellValue(row, 9) || ''
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
      t.terrainSpecialization.toLowerCase().includes(query)
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

  // Get current data based on subcategory
  currentData = computed(() => {
    const subcategory = this.activeSubcategory();
    switch (subcategory) {
      case 'land-units': return this.filteredLandUnits();
      case 'arm-type': return this.filteredArmTypes();
      case 'weapon-category': return this.filteredWeaponCategories();
      case 'weapon-sensor': return this.filteredWeaponSensors();
      case 'land-unit-resources': return this.filteredLandUnitResources();
      case 'vehicle-speeds': return this.filteredVehicleSpeeds();
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

  retry(): void {
    this.loadData();
  }

  private getCellValue(row: unknown[], index: number): string {
    const value = row[index];
    return value === null || value === undefined ? '' : String(value);
  }
}
