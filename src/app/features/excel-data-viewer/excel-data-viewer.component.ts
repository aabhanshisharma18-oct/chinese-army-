import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExcelDataService, DataManifest } from '../../services/excel-data.service';

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
  loading = true;
  error: string | null = null;

  constructor(private excelDataService: ExcelDataService) {}

  ngOnInit(): void {
    this.loadAllSheets();
  }

  loadAllSheets(): void {
    this.loading = true;
    this.error = null;

    this.excelDataService.getManifest().subscribe({
      next: (manifest) => {
        this.manifest = manifest;
        this.excelDataService.getAllSheets().subscribe({
          next: (sheetsData) => {
            this.sheetsData = sheetsData;
            this.loading = false;
          },
          error: (err) => {
            this.error = `Failed to load sheets data: ${err.message}`;
            this.loading = false;
          }
        });
      },
      error: (err) => {
        this.error = `Failed to load manifest: ${err.message}`;
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
