import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AnalystNote } from '../models/analyst-note.model';
import { ExcelDataService } from '../../services/excel-data.service';

@Injectable({
  providedIn: 'root'
})
export class AnalystNoteService {
  constructor(private excelDataService: ExcelDataService) {}

  getAnalystNotes(): Observable<AnalystNote[]> {
    return this.excelDataService.getSheet('assets/data/raw/15_References.json').pipe(
      map((data: unknown) => this.parseReferences(data))
    );
  }

  getAnalystNoteById(id: string): Observable<AnalystNote | undefined> {
    return this.getAnalystNotes().pipe(
      map(notes => notes.find(n => n.id === id))
    );
  }

  private parseReferences(data: unknown): AnalystNote[] {
    const rows = data as unknown[][];
    if (!Array.isArray(rows) || rows.length < 2) return [];

    const notes: AnalystNote[] = [];

    for (let i = 2; i < rows.length; i++) {
      const row = rows[i] as unknown[];
      if (!Array.isArray(row) || row.length === 0) continue;

      const note: Partial<AnalystNote> = {
        id: this.getCellValue(row, 0) || `note-${i}`,
        author: this.getCellValue(row, 0) || 'Unknown',
        role: 'Analyst',
        organization: this.getCellValue(row, 1) || '',
        content: this.getCellValue(row, 2) || '',
        date: new Date().toISOString(),
        category: {
          type: 'reference',
          designation: this.getCellValue(row, 3) || 'Reference'
        }
      };

      notes.push(note as AnalystNote);
    }

    return notes;
  }

  private getCellValue(row: unknown[], index: number): string {
    const value = row[index];
    return value === null || value === undefined ? '' : String(value);
  }
}
