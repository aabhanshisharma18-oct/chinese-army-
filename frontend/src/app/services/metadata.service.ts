import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Section {
  id: string;
  name: string;
  tables: Table[];
}

export interface Table {
  id: string;
  name: string;
  tableName: string;
  apiEndpoint: string;
  subsections?: Subsection[];
}

export interface Subsection {
  id: string;
  name: string;
  tableName: string;
  apiEndpoint: string;
}

export interface SectionsResponse {
  sections: Section[];
  excludedColumns: string[];
  longTextFields: string[];
}

export interface FilterMetadata {
  table: string;
  filterableColumns: FilterColumn[];
}

export interface FilterColumn {
  name: string;
  type: string;
}

export interface FilterValues {
  table: string;
  column: string;
  values: string[];
}

@Injectable({
  providedIn: 'root'
})
export class MetadataService {
  private apiUrl = '/api/metadata';

  constructor(private http: HttpClient) {}

  // Get section structure
  getSections(): Observable<SectionsResponse> {
    return this.http.get<SectionsResponse>(`${this.apiUrl}/sections`).pipe(
      catchError(error => {
        console.error('Failed to fetch sections metadata:', error);
        // Return empty structure on error to prevent app breakage
        return of({ sections: [], excludedColumns: [], longTextFields: [] });
      })
    );
  }

  // Get filterable columns for a specific table
  getFilters(tableName: string): Observable<FilterMetadata> {
    return this.http.get<FilterMetadata>(`${this.apiUrl}/filters/${tableName}`).pipe(
      catchError(error => {
        console.error(`Failed to fetch filters for ${tableName}:`, error);
        // Return empty filters on error
        return of({ table: tableName, filterableColumns: [] });
      })
    );
  }

  // Get distinct values for a specific filter column
  getFilterValues(tableName: string, columnName: string): Observable<FilterValues> {
    return this.http.get<FilterValues>(`${this.apiUrl}/filter-values/${tableName}/${columnName}`).pipe(
      catchError(error => {
        console.error(`Failed to fetch filter values for ${tableName}.${columnName}:`, error);
        // Return empty values on error
        return of({ table: tableName, column: columnName, values: [] });
      })
    );
  }
}
