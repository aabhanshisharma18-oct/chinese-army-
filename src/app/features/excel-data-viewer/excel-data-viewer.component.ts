import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataManifest } from '../../services/excel-data.service';
import manifestData from '../../../assets/data/manifest.json';
import indexSheet from '../../../assets/data/raw/00_INDEX.json';
import landUnitsSheet from '../../../assets/data/raw/1_Land_Units.json';
import armTypesSheet from '../../../assets/data/raw/2_Arm_Types.json';
import weaponCategoriesSheet from '../../../assets/data/raw/3_Weapon_Categories.json';
import weaponSensorsSheet from '../../../assets/data/raw/4_Weapon_Sensor.json';
import resourcesSheet from '../../../assets/data/raw/5_Land_Unit_Resources.json';
import speedsSheet from '../../../assets/data/raw/6_Vehicle_Speeds.json';
import frontageSheet from '../../../assets/data/raw/7_Frontage_Depth.json';
import forceSheet from '../../../assets/data/raw/8_Force_Potential.json';
import designationsSheet from '../../../assets/data/raw/9_Vehicle_Designations.json';
import ranksSheet from '../../../assets/data/raw/10_Ranks.json';
import comparisonSheet from '../../../assets/data/raw/11_India_China_Comparison.json';
import theaterSheet from '../../../assets/data/raw/12_Theater_Capabilities.json';
import categoriesSheet from '../../../assets/data/raw/13_Unit_Categories.json';
import technologySheet from '../../../assets/data/raw/14_Advanced_Technology.json';
import referencesSheet from '../../../assets/data/raw/15_References.json';
import aviationSheet from '../../../assets/data/raw/16_Aviation_Detailed.json';
import defenceSheet from '../../../assets/data/raw/17_Air_Defence_Detailed.json';

@Component({
  selector: 'app-excel-data-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './excel-data-viewer.component.html',
  styleUrls: ['./excel-data-viewer.component.scss']
})
export class ExcelDataViewerComponent implements OnInit {
  manifest: DataManifest | null = null;
  sheetsData: Record<string, unknown> = {};
  loading = false;
  error: string | null = null;

  ngOnInit(): void {
    this.loadAllSheets();
  }

  loadAllSheets(): void {
    this.loading = false;
    this.error = null;
    this.manifest = manifestData as DataManifest;
    this.sheetsData = {
      '00_INDEX': indexSheet,
      '1_Land_Units': landUnitsSheet,
      '2_Arm_Types': armTypesSheet,
      '3_Weapon_Categories': weaponCategoriesSheet,
      '4_Weapon_Sensor': weaponSensorsSheet,
      '5_Land_Unit_Resources': resourcesSheet,
      '6_Vehicle_Speeds': speedsSheet,
      '7_Frontage_Depth': frontageSheet,
      '8_Force_Potential': forceSheet,
      '9_Vehicle_Designations': designationsSheet,
      '10_Ranks': ranksSheet,
      '11_India_China_Comparison': comparisonSheet,
      '12_Theater_Capabilities': theaterSheet,
      '13_Unit_Categories': categoriesSheet,
      '14_Advanced_Technology': technologySheet,
      '15_References': referencesSheet,
      '16_Aviation_Detailed': aviationSheet,
      '17_Air_Defence_Detailed': defenceSheet
    };
  }

  getSheetData(sheetName: string): unknown[][] {
    const data = this.sheetsData[sheetName] as unknown[][];
    return Array.isArray(data) ? data : [];
  }

  getSheetRowCount(sheetName: string): number {
    return this.getSheetData(sheetName).length;
  }

  getSheetColCount(sheetName: string): number {
    const data = this.getSheetData(sheetName);
    if (data.length === 0) return 0;
    return Array.isArray(data[0]) ? data[0].length : 0;
  }

  formatCellValue(value: unknown): string {
    if (value === null || value === undefined) {
      return '';
    }
    return String(value);
  }

  isNullValue(value: unknown): boolean {
    return value === null || value === undefined;
  }

  retry(): void {
    this.loadAllSheets();
  }
}
