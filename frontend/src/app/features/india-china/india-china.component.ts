import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExcelDataService } from '../../services/excel-data.service';
import { buildSheetColumnFilters, matchesSheetColumnFilters } from '../../shared/utils/sheet-column-filters';

interface IndiaChinaComparison {
  level: string;
  indianArmyUnit: string;
  chineseArmyEquivalent: string;
  chineseName: string;
  sizeTroops: string;
  notes: string;
}

@Component({
  selector: 'app-india-china',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './india-china.component.html',
  styleUrls: ['./india-china.component.scss']
})
export class IndiaChinaComponent implements OnInit {
  comparisons: IndiaChinaComparison[] = [];
  loading = false;
  error: string | null = null;
  sheetData: unknown[][] = [];
  sheetFilters = buildSheetColumnFilters(this.sheetData);
  columnFilters: Record<number, string> = {};

  constructor(
    private readonly excelDataService: ExcelDataService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.error = null;

    this.excelDataService
      .getSheet('assets/data/raw/11_India_China_Comparison.json')
      .subscribe({
        next: data => {
          this.sheetData = data as unknown[][];
          this.sheetFilters =
            buildSheetColumnFilters(this.sheetData);

          this.comparisons = this.parseComparisons(data);
          this.loading = false;
        },
        error: error => {
          console.error('Failed to load comparison data from PostgreSQL.', error);
          this.error = 'Failed to load comparison data from PostgreSQL.';
          this.loading = false;
        }
      });
  }

  private parseComparisons(data: unknown): IndiaChinaComparison[] {
    const rows = data as unknown[][];
    if (!Array.isArray(rows) || rows.length < 2) return [];

    const comparisons: IndiaChinaComparison[] = [];

    for (let i = 2; i < rows.length; i++) {
      const row = rows[i] as unknown[];
      if (!Array.isArray(row) || row.length === 0) continue;

      const comparison: IndiaChinaComparison = {
        level: this.getCellValue(row, 0) || '',
        indianArmyUnit: this.getCellValue(row, 1) || '',
        chineseArmyEquivalent: this.getCellValue(row, 2) || '',
        chineseName: this.getCellValue(row, 3) || '',
        sizeTroops: this.getCellValue(row, 4) || '',
        notes: this.getCellValue(row, 5) || ''
      };

      if (comparison.indianArmyUnit) {
        comparisons.push(comparison);
      }
    }

    return comparisons;
  }

  private getCellValue(row: unknown[], index: number): string {
    const value = row[index];
    return value === null || value === undefined ? '' : String(value);
  }

  get filteredComparisons(): IndiaChinaComparison[] {
    return this.comparisons.filter((_, index) =>
      matchesSheetColumnFilters(this.sheetData, index, this.columnFilters));
  }

  retry(): void {
    this.loadData();
  }
}
