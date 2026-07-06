import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Formation } from '../../core/models/formation.model';
import { FormationService } from '../../core/services/formation.service';
import { ExcelDataService } from '../../services/excel-data.service';
import { UnitDetailDrawerComponent } from '../../shared/components/unit-detail-drawer/unit-detail-drawer.component';

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

@Component({
  selector: 'app-formation-specs',
  standalone: true,
  imports: [CommonModule, UnitDetailDrawerComponent],
  templateUrl: './formation-specs.component.html',
  styleUrls: ['./formation-specs.component.scss']
})
export class FormationSpecsComponent implements OnInit {
  formations$: Observable<Formation[]> | null = null;
  selectedFormation: Formation | null = null;
  drawerOpen = false;
  landUnitResources: LandUnitResource[] = [];
  vehicleSpeeds: VehicleSpeed[] = [];
  frontageDepths: FrontageDepth[] = [];
  vehicleDesignations: VehicleDesignation[] = [];
  loadingResources = true;
  errorResources: string | null = null;
  
  constructor(private formationService: FormationService, private excelDataService: ExcelDataService) {}
  
  ngOnInit(): void {
    this.formations$ = this.formationService.getFormations();
    this.loadLandUnitResources();
    this.loadVehicleSpeeds();
    this.loadFrontageDepths();
    this.loadVehicleDesignations();
  }

  loadVehicleDesignations(): void {
    this.excelDataService.getSheet('assets/data/raw/9_Vehicle_Designations.json').subscribe({
      next: (data: unknown) => {
        this.vehicleDesignations = this.parseVehicleDesignations(data);
      },
      error: (err) => {
        console.error('Failed to load vehicle designations:', err);
      }
    });
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

  loadFrontageDepths(): void {
    this.excelDataService.getSheet('assets/data/raw/7_Frontage_Depth.json').subscribe({
      next: (data: unknown) => {
        this.frontageDepths = this.parseFrontageDepths(data);
      },
      error: (err) => {
        console.error('Failed to load frontage depths:', err);
      }
    });
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

  loadVehicleSpeeds(): void {
    this.excelDataService.getSheet('assets/data/raw/6_Vehicle_Speeds.json').subscribe({
      next: (data: unknown) => {
        this.vehicleSpeeds = this.parseVehicleSpeeds(data);
      },
      error: (err) => {
        console.error('Failed to load vehicle speeds:', err);
      }
    });
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

  loadLandUnitResources(): void {
    this.loadingResources = true;
    this.errorResources = null;

    this.excelDataService.getSheet('assets/data/raw/5_Land_Unit_Resources.json').subscribe({
      next: (data: unknown) => {
        this.landUnitResources = this.parseLandUnitResources(data);
        this.loadingResources = false;
      },
      error: (err) => {
        this.errorResources = `Failed to load land unit resources: ${err.message}`;
        this.loadingResources = false;
      }
    });
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

  private getCellValue(row: unknown[], index: number): string {
    const value = row[index];
    return value === null || value === undefined ? '' : String(value);
  }
  
  openDrawer(formation: Formation): void {
    this.selectedFormation = formation;
    this.drawerOpen = true;
  }
  
  closeDrawer(): void {
    this.drawerOpen = false;
    setTimeout(() => {
      this.selectedFormation = null;
    }, 300);
  }
}
