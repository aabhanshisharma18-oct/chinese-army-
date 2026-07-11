import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExcelDataService } from '../../services/excel-data.service';

interface AirDefenceDetailed {
  side: string;
  system: string;
  typeCategory: string;
  basedOn: string;
  serviceEntry: string;
  status: string;
  exportName: string;
  missileMunitionLength: string;
  missileMunitionDiameter: string;
  missileMunitionWeight: string;
  launcherConfig: string;
  radar: string;
  range: string;
  altitude: string;
  radarRange: string;
  engagementTime: string;
  speed: string;
  gunCaliber: string;
  gunRate: string;
  notes: string;
}

@Component({
  selector: 'app-air-defence-detailed',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './air-defence-detailed.component.html',
  styleUrls: ['./air-defence-detailed.component.scss']
})
export class AirDefenceDetailedComponent implements OnInit {
  defences: AirDefenceDetailed[] = [];
  loading = true;
  error: string | null = null;
  typeFilter = '';
  statusFilter = '';
  search = '';

  constructor(private excelDataService: ExcelDataService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.error = null;

    this.excelDataService.getSheet('assets/data/raw/17_Air_Defence_Detailed.json').subscribe({
      next: (data: unknown) => {
        this.defences = this.parseDefences(data);
        this.loading = false;
      },
      error: (err) => {
        this.error = `Failed to load air defence detailed data: ${err.message}`;
        this.loading = false;
      }
    });
  }

  private parseDefences(data: unknown): AirDefenceDetailed[] {
    const rows = data as unknown[][];
    if (!Array.isArray(rows) || rows.length < 2) return [];

    const defences: AirDefenceDetailed[] = [];

    for (let i = 2; i < rows.length; i++) {
      const row = rows[i] as unknown[];
      if (!Array.isArray(row) || row.length === 0) continue;

      const defence: AirDefenceDetailed = {
        side: this.getCellValue(row, 0) || '',
        system: this.getCellValue(row, 1) || '',
        typeCategory: this.getCellValue(row, 2) || '',
        basedOn: this.getCellValue(row, 3) || '',
        serviceEntry: this.getCellValue(row, 4) || '',
        status: this.getCellValue(row, 5) || '',
        exportName: this.getCellValue(row, 6) || '',
        missileMunitionLength: this.getCellValue(row, 7) || '',
        missileMunitionDiameter: this.getCellValue(row, 8) || '',
        missileMunitionWeight: this.getCellValue(row, 9) || '',
        launcherConfig: this.getCellValue(row, 10) || '',
        radar: this.getCellValue(row, 11) || '',
        range: this.getCellValue(row, 12) || '',
        altitude: this.getCellValue(row, 13) || '',
        radarRange: this.getCellValue(row, 14) || '',
        engagementTime: this.getCellValue(row, 15) || '',
        speed: this.getCellValue(row, 16) || '',
        gunCaliber: this.getCellValue(row, 17) || '',
        gunRate: this.getCellValue(row, 18) || '',
        notes: [this.getCellValue(row,23),this.getCellValue(row,24),this.getCellValue(row,25),this.getCellValue(row,26)].filter(Boolean).join(' · ')
      };

      if (defence.system) {
        defences.push(defence);
      }
    }

    return defences;
  }

  private getCellValue(row: unknown[], index: number): string {
    const value = row[index];
    return value === null || value === undefined ? '' : String(value);
  }

  retry(): void {
    this.loadData();
  }
  get types(): string[] { return [...new Set(this.defences.map(x=>x.typeCategory).filter(Boolean))]; }
  get statuses(): string[] { return [...new Set(this.defences.map(x=>x.status).filter(Boolean))]; }
  get filteredDefences(): AirDefenceDetailed[] { const q=this.search.toLowerCase().trim(); return this.defences.filter(x=>(!this.typeFilter||x.typeCategory===this.typeFilter)&&(!this.statusFilter||x.status===this.statusFilter)&&(!q||[x.system,x.radar,x.exportName].some(v=>v.toLowerCase().includes(q)))); }
}
