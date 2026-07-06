import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExcelDataService } from '../../services/excel-data.service';

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

interface IndiaChinaComparison {
  level: string;
  indianArmyUnit: string;
  chineseArmyEquivalent: string;
  chineseName: string;
  sizeTroops: string;
  notes: string;
}

@Component({
  selector: 'app-doctrine-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './doctrine-overview.component.html',
  styleUrls: ['./doctrine-overview.component.scss']
})
export class DoctrineOverviewComponent implements OnInit {
  videoSrc = 'assets/videos/doctrine-bg.mp4';
  armTypes: ArmType[] = [];
  weaponCategories: WeaponCategory[] = [];
  weaponSensors: WeaponSensor[] = [];
  indiaChinaComparisons: IndiaChinaComparison[] = [];
  activeTab = 'armTypes';
  loading = true;
  error: string | null = null;

  constructor(private excelDataService: ExcelDataService) {}

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData(): void {
    this.loading = true;
    this.error = null;

    // Load all three data sources in sequence
    this.excelDataService.getSheet('assets/data/raw/2_Arm_Types.json').subscribe({
      next: (data: unknown) => {
        this.armTypes = this.parseArmTypes(data);
        this.loadWeaponCategories();
      },
      error: (err) => {
        this.error = `Failed to load arm types data: ${err.message}`;
        this.loading = false;
      }
    });
  }

  loadWeaponCategories(): void {
    this.excelDataService.getSheet('assets/data/raw/3_Weapon_Categories.json').subscribe({
      next: (data: unknown) => {
        this.weaponCategories = this.parseWeaponCategories(data);
        this.loadWeaponSensors();
      },
      error: (err) => {
        this.error = `Failed to load weapon categories data: ${err.message}`;
        this.loading = false;
      }
    });
  }

  loadWeaponSensors(): void {
    this.excelDataService.getSheet('assets/data/raw/4_Weapon_Sensor.json').subscribe({
      next: (data: unknown) => {
        this.weaponSensors = this.parseWeaponSensors(data);
        this.loading = false;
      },
      error: (err) => {
        this.error = `Failed to load weapon sensors data: ${err.message}`;
        this.loading = false;
      }
    });
  }

  private parseArmTypes(data: unknown): ArmType[] {
    const rows = data as unknown[][];
    if (!Array.isArray(rows) || rows.length < 2) return [];

    const types: ArmType[] = [];

    for (let i = 2; i < rows.length; i++) {
      const row = rows[i] as unknown[];
      if (!Array.isArray(row) || row.length === 0) continue;

      const armType: ArmType = {
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

      if (armType.combatArmTypeEnglish) {
        types.push(armType);
      }
    }

    return types;
  }

  private getCellValue(row: unknown[], index: number): string {
    const value = row[index];
    return value === null || value === undefined ? '' : String(value);
  }

  private parseWeaponCategories(data: unknown): WeaponCategory[] {
    const rows = data as unknown[][];
    if (!Array.isArray(rows) || rows.length < 2) return [];

    const categories: WeaponCategory[] = [];

    for (let i = 2; i < rows.length; i++) {
      const row = rows[i] as unknown[];
      if (!Array.isArray(row) || row.length === 0) continue;

      const weapon: WeaponCategory = {
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

      if (weapon.weaponName) {
        categories.push(weapon);
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

  retry(): void {
    this.loadAllData();
  }
}
