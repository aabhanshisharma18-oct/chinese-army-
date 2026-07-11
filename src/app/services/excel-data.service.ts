import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, switchMap, of } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

export interface DataManifest {
  workbook: string;
  generatedAt: string;
  sheets: {
    originalSheetName: string;
    file: string;
    rows: number;
    format?: string;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class ExcelDataService {
  // Offline-first by default. Every sheet is bundled with the application, so
  // a demo PC does not need PostgreSQL, internet access, or a Mac-specific path.
  // Development environments may opt into PostgreSQL with setUseApi(true).
  private useApi = false;
  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  setUseApi(useApi: boolean): void {
    this.useApi = useApi;
  }

  getManifest(): Observable<DataManifest> {
    return this.http.get<DataManifest>('assets/data/manifest.json');
  }

  getAllSheets(): Observable<Record<string, unknown>> {
    if (this.useApi) {
      // In API mode, fetch all sheets from API endpoints
      const apiEndpoints = {
        '1_Land_Units': this.http.get(`${this.apiUrl}/land-units`),
        '2_Arm_Types': this.http.get(`${this.apiUrl}/arm-types`),
        '3_Weapon_Categories': this.http.get(`${this.apiUrl}/weapon-categories`),
        '4_Weapon_Sensor': this.http.get(`${this.apiUrl}/weapon-sensors`),
        '5_Land_Unit_Resources': this.http.get(`${this.apiUrl}/land-unit-resources`),
        '6_Vehicle_Speeds': this.http.get(`${this.apiUrl}/vehicle-speeds`),
        '7_Frontage_Depth': this.http.get(`${this.apiUrl}/frontage-depth`),
        '8_Force_Potential': this.http.get(`${this.apiUrl}/force-potential`),
        '9_Vehicle_Designations': this.http.get(`${this.apiUrl}/vehicle-designations`),
        '10_Ranks': this.http.get(`${this.apiUrl}/ranks`),
        '11_India_China_Comparison': this.http.get(`${this.apiUrl}/india-china-comparison`),
        '12_Theater_Capabilities': this.http.get(`${this.apiUrl}/theater-capabilities`),
        '13_Unit_Categories': this.http.get(`${this.apiUrl}/unit-categories`),
        '14_Advanced_Technology': this.http.get(`${this.apiUrl}/advanced-technology`),
        '16_Aviation_Detailed': this.http.get(`${this.apiUrl}/aviation-detailed`),
        '17_Air_Defence_Detailed': this.http.get(`${this.apiUrl}/air-defence-detailed`)
      };
      return forkJoin(apiEndpoints);
    }
    
    // Local JSON mode
    return this.getManifest().pipe(
      switchMap((manifest) => {
        const requests: Record<string, Observable<unknown>> = {};
        for (const sheet of manifest.sheets) {
          requests[sheet.originalSheetName] = this.http.get(sheet.file);
        }
        return forkJoin(requests);
      })
    );
  }

  getSheet(filePath: string): Observable<unknown> {
    // Try API first if enabled, then fall back to local JSON
    if (this.useApi) {
      const sheetName = this.extractSheetName(filePath);
      const apiEndpoint = this.mapSheetToApiEndpoint(sheetName);
      
      if (apiEndpoint) {
        return this.http.get(`${this.apiUrl}${apiEndpoint}`).pipe(
          // A running backend can still stall while PostgreSQL is unavailable.
          // Do not leave the page spinner waiting forever; use the bundled sheet.
          timeout(5000),
          catchError(error => {
            console.warn(`API request failed for ${sheetName}, falling back to local JSON`, error);
            return this.http.get(filePath);
          })
        );
      }
    }
    
    return this.http.get(filePath);
  }

  private extractSheetName(filePath: string): string {
    const parts = filePath.split('/');
    const fileName = parts[parts.length - 1];
    return fileName.replace('.json', '');
  }

  private mapSheetToApiEndpoint(sheetName: string): string | null {
    const mapping: Record<string, string> = {
      '1_Land_Units': '/land-units',
      '2_Arm_Types': '/arm-types',
      '3_Weapon_Categories': '/weapon-categories',
      '4_Weapon_Sensor': '/weapon-sensors',
      '5_Land_Unit_Resources': '/land-unit-resources',
      '6_Vehicle_Speeds': '/vehicle-speeds',
      '7_Frontage_Depth': '/frontage-depth',
      '8_Force_Potential': '/force-potential',
      '9_Vehicle_Designations': '/vehicle-designations',
      '10_Ranks': '/ranks',
      '11_India_China_Comparison': '/india-china-comparison',
      '12_Theater_Capabilities': '/theater-capabilities',
      '13_Unit_Categories': '/unit-categories',
      '14_Advanced_Technology': '/advanced-technology',
      '16_Aviation_Detailed': '/aviation-detailed',
      '17_Air_Defence_Detailed': '/air-defence-detailed'
    };
    
    return mapping[sheetName] || null;
  }
}
