import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, switchMap } from 'rxjs';

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
  constructor(private http: HttpClient) {}

  getManifest(): Observable<DataManifest> {
    return this.http.get<DataManifest>('assets/data/manifest.json');
  }

  getAllSheets(): Observable<Record<string, unknown>> {
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
    return this.http.get(filePath);
  }
}
