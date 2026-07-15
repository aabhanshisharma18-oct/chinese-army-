import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import {
  DataManifest,
  ExcelDataService
} from '../../services/excel-data.service';

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

  constructor(
    private readonly excelDataService: ExcelDataService
  ) {}

  ngOnInit(): void {
    this.loadAllSheets();
  }

  loadAllSheets(): void {
    this.loading = true;
    this.error = null;

    forkJoin({
      manifest: this.excelDataService.getManifest(),
      sheets: this.excelDataService.getAllSheets()
    }).subscribe({
      next: ({ manifest, sheets }) => {
        this.manifest = manifest;
        this.sheetsData = sheets;
        this.loading = false;
      },
      error: error => {
        console.error(
          'Failed to load workbook data from PostgreSQL.',
          error
        );
        this.error =
          'Failed to load workbook data from PostgreSQL.';
        this.loading = false;
      }
    });
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

    if (data.length === 0) {
      return 0;
    }

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
