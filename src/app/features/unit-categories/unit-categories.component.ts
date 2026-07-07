import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExcelDataService } from '../../services/excel-data.service';

interface UnitCategory {
  side: string;
  category: string;
  description: string;
  trainingLevel: string;
  equipmentLevel: string;
  manningLevel: string;
  readiness: string;
  deploymentTime: string;
  usEquivalent: string;
  percentOfForce: string;
  notes: string;
}

@Component({
  selector: 'app-unit-categories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './unit-categories.component.html',
  styleUrls: ['./unit-categories.component.scss']
})
export class UnitCategoriesComponent implements OnInit {
  categories: UnitCategory[] = [];
  loading = true;
  error: string | null = null;

  constructor(private excelDataService: ExcelDataService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.error = null;

    this.excelDataService.getSheet('assets/data/raw/13_Unit_Categories.json').subscribe({
      next: (data: unknown) => {
        this.categories = this.parseCategories(data);
        this.loading = false;
      },
      error: (err) => {
        this.error = `Failed to load unit categories data: ${err.message}`;
        this.loading = false;
      }
    });
  }

  private parseCategories(data: unknown): UnitCategory[] {
    const rows = data as unknown[][];
    if (!Array.isArray(rows) || rows.length < 2) return [];

    const categories: UnitCategory[] = [];

    for (let i = 2; i < rows.length; i++) {
      const row = rows[i] as unknown[];
      if (!Array.isArray(row) || row.length === 0) continue;

      const category: UnitCategory = {
        side: this.getCellValue(row, 0) || '',
        category: this.getCellValue(row, 1) || '',
        description: this.getCellValue(row, 2) || '',
        trainingLevel: this.getCellValue(row, 3) || '',
        equipmentLevel: this.getCellValue(row, 4) || '',
        manningLevel: this.getCellValue(row, 5) || '',
        readiness: this.getCellValue(row, 6) || '',
        deploymentTime: this.getCellValue(row, 7) || '',
        usEquivalent: this.getCellValue(row, 8) || '',
        percentOfForce: this.getCellValue(row, 9) || '',
        notes: this.getCellValue(row, 10) || ''
      };

      if (category.category) {
        categories.push(category);
      }
    }

    return categories;
  }

  private getCellValue(row: unknown[], index: number): string {
    const value = row[index];
    return value === null || value === undefined ? '' : String(value);
  }

  retry(): void {
    this.loadData();
  }
}
