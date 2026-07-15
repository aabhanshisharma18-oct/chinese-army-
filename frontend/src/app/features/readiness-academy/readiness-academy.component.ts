import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExcelDataService } from '../../services/excel-data.service';

interface ForceMetric {
  side: string;
  category: string;
  metricSystem: string;
  value: string;
  globalRank: string;
  comparisonNotes: string;
}

@Component({
  selector: 'app-readiness-academy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './readiness-academy.component.html',
  styleUrls: ['./readiness-academy.component.scss']
})
export class ReadinessAcademyComponent implements OnInit {
  videoSrc = 'assets/videos/training-bg.mp4';
  forceMetrics: ForceMetric[] = [];
  loading = true;
  error: string | null = null;

  constructor(private excelDataService: ExcelDataService) {}

  ngOnInit(): void {
    this.loadForceData();
  }

  loadForceData(): void {
    this.loading = true;
    this.error = null;

    this.excelDataService.getSheet('assets/data/raw/8_Force_Potential.json').subscribe({
      next: (data: unknown) => {
        this.forceMetrics = this.parseForceData(data);
        this.loading = false;
      },
      error: (err) => {
        this.error = `Failed to load force potential data: ${err.message}`;
        this.loading = false;
      }
    });
  }

  private parseForceData(data: unknown): ForceMetric[] {
    const rows = data as unknown[][];
    if (!Array.isArray(rows) || rows.length < 2) return [];

    const metrics: ForceMetric[] = [];

    for (let i = 2; i < rows.length; i++) {
      const row = rows[i] as unknown[];
      if (!Array.isArray(row) || row.length === 0) continue;

      const metric: ForceMetric = {
        side: this.getCellValue(row, 0) || '',
        category: this.getCellValue(row, 1) || '',
        metricSystem: this.getCellValue(row, 2) || '',
        value: this.getCellValue(row, 3) || '',
        globalRank: this.getCellValue(row, 4) || '',
        comparisonNotes: this.getCellValue(row, 5) || ''
      };

      if (metric.metricSystem) {
        metrics.push(metric);
      }
    }

    return metrics;
  }

  private getCellValue(row: unknown[], index: number): string {
    const value = row[index];
    return value === null || value === undefined ? '' : String(value);
  }

  getMetricsByCategory(category: string): ForceMetric[] {
    return this.forceMetrics.filter(m => m.category === category);
  }

  getCategories(): string[] {
    const categories = new Set(this.forceMetrics.map(m => m.category));
    return Array.from(categories);
  }

  retry(): void {
    this.loadForceData();
  }
}
