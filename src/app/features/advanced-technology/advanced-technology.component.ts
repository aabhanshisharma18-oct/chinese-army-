import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import technologySheet from '../../../assets/data/raw/14_Advanced_Technology.json';
import { buildSheetColumnFilters, matchesSheetColumnFilters } from '../../shared/utils/sheet-column-filters';

interface AdvancedTechnology {
  side: string;
  technologyDomain: string;
  systemName: string;
  description: string;
  rangeCapability: string;
  status2025: string;
  strategicImpact: string;
  notes: string;
}

@Component({
  selector: 'app-advanced-technology',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './advanced-technology.component.html',
  styleUrls: ['./advanced-technology.component.scss']
})
export class AdvancedTechnologyComponent implements OnInit {
  technologies: AdvancedTechnology[] = [];
  loading = false;
  error: string | null = null;
  domainFilter = '';
  statusFilter = '';
  search = '';
  readonly sheetFilters = buildSheetColumnFilters(technologySheet as unknown[][]);
  columnFilters: Record<number, string> = {};

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = false;
    this.error = null;
    this.technologies = this.parseTechnologies(technologySheet);
  }

  private parseTechnologies(data: unknown): AdvancedTechnology[] {
    const rows = data as unknown[][];
    if (!Array.isArray(rows) || rows.length < 2) return [];

    const technologies: AdvancedTechnology[] = [];

    for (let i = 2; i < rows.length; i++) {
      const row = rows[i] as unknown[];
      if (!Array.isArray(row) || row.length === 0) continue;

      const technology: AdvancedTechnology = {
        side: this.getCellValue(row, 0) || '',
        technologyDomain: this.getCellValue(row, 1) || '',
        systemName: this.getCellValue(row, 2) || '',
        description: this.getCellValue(row, 3) || '',
        rangeCapability: this.getCellValue(row, 4) || '',
        status2025: this.getCellValue(row, 5) || '',
        strategicImpact: this.getCellValue(row, 6) || '',
        notes: this.getCellValue(row, 7) || ''
      };

      if (technology.systemName) {
        technologies.push(technology);
      }
    }

    return technologies;
  }

  private getCellValue(row: unknown[], index: number): string {
    const value = row[index];
    return value === null || value === undefined ? '' : String(value);
  }

  retry(): void {
    this.loadData();
  }
  get domains(): string[] { return [...new Set(this.technologies.map(x => x.technologyDomain).filter(Boolean))]; }
  get statuses(): string[] { return [...new Set(this.technologies.map(x => x.status2025).filter(Boolean))]; }
  get filteredTechnologies(): AdvancedTechnology[] { const q=this.search.toLowerCase().trim(); return this.technologies.filter((x,index)=>matchesSheetColumnFilters(technologySheet as unknown[][],index,this.columnFilters)&&(!this.domainFilter||x.technologyDomain===this.domainFilter)&&(!this.statusFilter||x.status2025===this.statusFilter)&&(!q||[x.systemName,x.description,x.rangeCapability].some(v=>v.toLowerCase().includes(q)))); }
}
