import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Formation } from '../models/formation.model';
import { ExcelDataService } from '../../services/excel-data.service';

@Injectable({
  providedIn: 'root'
})
export class FormationService {
  constructor(private excelDataService: ExcelDataService) {}

  getFormations(): Observable<Formation[]> {
    return this.excelDataService.getSheet('assets/data/raw/1_Land_Units.json').pipe(
      map((data: unknown) => this.parseLandUnits(data))
    );
  }

  getFormationById(id: string): Observable<Formation | undefined> {
    return this.getFormations().pipe(
      map(formations => formations.find(f => f.id === id))
    );
  }

  private parseLandUnits(data: unknown): Formation[] {
    const rows = data as unknown[][];
    if (!Array.isArray(rows) || rows.length < 2) return [];

    const formations: Formation[] = [];
    const headers = rows[1] as string[];

    for (let i = 2; i < rows.length; i++) {
      const row = rows[i] as unknown[];
      if (!Array.isArray(row) || row.length === 0) continue;

      const formation: Partial<Formation> = {
        id: this.getCellValue(row, 1) || `formation-${i}`,
        name: this.getCellValue(row, 1) || '',
        tagline: this.getCellValue(row, 2) || '',
        quickSpecs: [
          { label: 'Type', value: this.getCellValue(row, 2) || '' },
          { label: 'Parent', value: this.getCellValue(row, 3) || '' },
          { label: 'Standard Formation', value: this.getCellValue(row, 4) || '' },
          { label: 'Troop Potential', value: this.getCellValue(row, 5) || '' },
          { label: 'Location', value: this.getCellValue(row, 6) || '' }
        ],
        fullSpecs: {
          commandStructure: {
            headquarters: this.getCellValue(row, 6) || '',
            commander: 'N/A',
            deputyCommander: 'N/A',
            chiefOfStaff: 'N/A'
          },
          areaOfResponsibility: {
            region: this.getCellValue(row, 6) || '',
            borders: [],
            strategicImportance: ''
          },
          subordinateUnits: [],
          equipmentOverview: {
            mainBattleTanks: '',
            armoredVehicles: '',
            artillery: '',
            airDefense: '',
            aircraft: '',
            navalAssets: ''
          },
          readiness: {
            trainingLevel: 'N/A',
            modernizationStatus: 'N/A',
            deploymentReadiness: 'N/A',
            exerciseFrequency: 'N/A'
          },
          role: this.getCellValue(row, 2) || '',
          commandRelationships: [],
          supportAssets: [],
          notes: '',
          sourceReferences: []
        },
        video: '',
        category: {
          type: 'formation',
          designation: this.getCellValue(row, 2) || 'Unit'
        }
      };

      formations.push(formation as Formation);
    }

    return formations;
  }

  private getCellValue(row: unknown[], index: number): string {
    const value = row[index];
    return value === null || value === undefined ? '' : String(value);
  }
}
