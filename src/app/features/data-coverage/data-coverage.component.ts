import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExcelDataService } from '../../services/excel-data.service';

interface SheetIndex {
  sheetTab: string;
  sheetName: string;
  contents: string;
  rowsOfData: string;
}

@Component({
  selector: 'app-data-coverage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-coverage.component.html',
  styleUrls: ['./data-coverage.component.scss']
})
export class DataCoverageComponent implements OnInit {
  videoSrc = 'assets/videos/command-center.mp4';
  sheetIndices: SheetIndex[] = [];
  loading = true;
  error: string | null = null;

  constructor(private excelDataService: ExcelDataService) {}

  ngOnInit(): void {
    this.loadIndexData();
  }

  loadIndexData(): void {
    this.loading = true;
    this.error = null;

    this.excelDataService.getSheet('assets/data/raw/00_INDEX.json').subscribe({
      next: (data: unknown) => {
        this.sheetIndices = this.parseIndexData(data);
        this.loading = false;
      },
      error: (err) => {
        this.error = `Failed to load index data: ${err.message}`;
        this.loading = false;
      }
    });
  }

  private parseIndexData(data: unknown): SheetIndex[] {
    const rows = data as unknown[][];
    if (!Array.isArray(rows) || rows.length < 2) return [];

    const indices: SheetIndex[] = [];

    for (let i = 2; i < rows.length; i++) {
      const row = rows[i] as unknown[];
      if (!Array.isArray(row) || row.length === 0) continue;

      const index: SheetIndex = {
        sheetTab: this.getCellValue(row, 0) || '',
        sheetName: this.getCellValue(row, 1) || '',
        contents: this.getCellValue(row, 2) || '',
        rowsOfData: this.getCellValue(row, 3) || ''
      };

      if (index.sheetTab) {
        indices.push(index);
      }
    }

    return indices;
  }

  private getCellValue(row: unknown[], index: number): string {
    const value = row[index];
    return value === null || value === undefined ? '' : String(value);
  }

  retry(): void {
    this.loadIndexData();
  }
}
