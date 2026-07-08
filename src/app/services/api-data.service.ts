import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiDataService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Generic method to get data from API with fallback to local JSON
  private getDataWithFallback<T>(endpoint: string, localPath: string): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}${endpoint}`).pipe(
      catchError(error => {
        console.warn(`API request failed for ${endpoint}, falling back to local JSON`, error);
        return this.http.get<T>(localPath);
      })
    );
  }

  // Land Units
  getLandUnits(): Observable<unknown> {
    return this.getDataWithFallback('/land-units', 'assets/data/raw/1_Land_Units.json');
  }

  // Arm Types
  getArmTypes(): Observable<unknown> {
    return this.getDataWithFallback('/arm-types', 'assets/data/raw/2_Arm_Types.json');
  }

  // Weapon Categories
  getWeaponCategories(): Observable<unknown> {
    return this.getDataWithFallback('/weapon-categories', 'assets/data/raw/3_Weapon_Categories.json');
  }

  // Weapon Sensors
  getWeaponSensors(): Observable<unknown> {
    return this.getDataWithFallback('/weapon-sensors', 'assets/data/raw/4_Weapon_Sensor.json');
  }

  // Land Unit Resources
  getLandUnitResources(): Observable<unknown> {
    return this.getDataWithFallback('/land-unit-resources', 'assets/data/raw/5_Land_Unit_Resources.json');
  }

  // Vehicle Speeds
  getVehicleSpeeds(): Observable<unknown> {
    return this.getDataWithFallback('/vehicle-speeds', 'assets/data/raw/6_Vehicle_Speeds.json');
  }

  // Frontage Depth
  getFrontageDepth(): Observable<unknown> {
    return this.getDataWithFallback('/frontage-depth', 'assets/data/raw/7_Frontage_Depth.json');
  }

  // Force Potential
  getForcePotential(): Observable<unknown> {
    return this.getDataWithFallback('/force-potential', 'assets/data/raw/8_Force_Potential.json');
  }

  // Vehicle Designations
  getVehicleDesignations(): Observable<unknown> {
    return this.getDataWithFallback('/vehicle-designations', 'assets/data/raw/9_Vehicle_Designations.json');
  }

  // Ranks
  getRanks(): Observable<unknown> {
    return this.getDataWithFallback('/ranks', 'assets/data/raw/10_Ranks.json');
  }

  // India China Comparison
  getIndiaChinaComparison(): Observable<unknown> {
    return this.getDataWithFallback('/india-china-comparison', 'assets/data/raw/11_India_China_Comparison.json');
  }

  // Theater Capabilities
  getTheaterCapabilities(): Observable<unknown> {
    return this.getDataWithFallback('/theater-capabilities', 'assets/data/raw/12_Theater_Capabilities.json');
  }

  // Unit Categories
  getUnitCategories(): Observable<unknown> {
    return this.getDataWithFallback('/unit-categories', 'assets/data/raw/13_Unit_Categories.json');
  }

  // Advanced Technology
  getAdvancedTechnology(): Observable<unknown> {
    return this.getDataWithFallback('/advanced-technology', 'assets/data/raw/14_Advanced_Technology.json');
  }

  // Aviation Detailed
  getAviationDetailed(): Observable<unknown> {
    return this.getDataWithFallback('/aviation-detailed', 'assets/data/raw/16_Aviation_Detailed.json');
  }

  // Air Defence Detailed
  getAirDefenceDetailed(): Observable<unknown> {
    return this.getDataWithFallback('/air-defence-detailed', 'assets/data/raw/17_Air_Defence_Detailed.json');
  }

  // Raw data endpoint for /data preservation
  getRawSheet(sheetName: string): Observable<unknown> {
    return this.http.get(`${this.apiUrl}/raw/${sheetName}`);
  }

  // Health check
  healthCheck(): Observable<{ status: string; timestamp: string }> {
    return this.http.get<{ status: string; timestamp: string }>(`${this.apiUrl}/health`);
  }
}
