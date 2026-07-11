import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import aviationSheet from '../../../assets/data/raw/16_Aviation_Detailed.json';
import { buildSheetColumnFilters, matchesSheetColumnFilters } from '../../shared/utils/sheet-column-filters';

interface AviationDetailed {
  side: string;
  helicopter: string;
  variant: string;
  typeRole: string;
  manufacturer: string;
  basedOn: string;
  firstFlight: string;
  serviceEntry: string;
  status: string;
  totalBuilt: string;
  unitCost: string;
  crew: string;
  passengersTroops: string;
  length: string;
  rotorDiameter: string;
  height: string;
  emptyWeight: string;
  maxWeight: string;
  maxSpeed: string;
  range: string;
  serviceCeiling: string;
  rateOfClimb: string;
  armament: string;
  notes: string;
}

@Component({
  selector: 'app-aviation-detailed',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './aviation-detailed.component.html',
  styleUrls: ['./aviation-detailed.component.scss']
})
export class AviationDetailedComponent implements OnInit {
  aviation: AviationDetailed[] = [];
  loading = false;
  error: string | null = null;
  roleFilter = '';
  statusFilter = '';
  search = '';
  readonly sheetFilters = buildSheetColumnFilters(aviationSheet as unknown[][]);
  columnFilters: Record<number, string> = {};

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = false;
    this.error = null;
    this.aviation = this.parseAviation(aviationSheet);
  }

  private parseAviation(data: unknown): AviationDetailed[] {
    const rows = data as unknown[][];
    if (!Array.isArray(rows) || rows.length < 2) return [];

    const aviation: AviationDetailed[] = [];

    for (let i = 2; i < rows.length; i++) {
      const row = rows[i] as unknown[];
      if (!Array.isArray(row) || row.length === 0) continue;

      const heli: AviationDetailed = {
        side: this.getCellValue(row, 0) || '',
        helicopter: this.getCellValue(row, 1) || '',
        variant: this.getCellValue(row, 2) || '',
        typeRole: this.getCellValue(row, 3) || '',
        manufacturer: this.getCellValue(row, 4) || '',
        basedOn: this.getCellValue(row, 5) || '',
        firstFlight: this.getCellValue(row, 6) || '',
        serviceEntry: this.getCellValue(row, 7) || '',
        status: this.getCellValue(row, 8) || '',
        totalBuilt: this.getCellValue(row, 9) || '',
        unitCost: this.getCellValue(row, 10) || '',
        crew: this.getCellValue(row, 11) || '',
        passengersTroops: this.getCellValue(row, 12) || '',
        length: this.getCellValue(row, 13) || '',
        rotorDiameter: this.getCellValue(row, 14) || '',
        height: this.getCellValue(row, 15) || '',
        emptyWeight: this.getCellValue(row, 16) || '',
        maxWeight: this.getCellValue(row, 17) || '',
        maxSpeed: this.getCellValue(row, 19) || '',
        range: this.getCellValue(row, 21) || '',
        serviceCeiling: this.getCellValue(row, 23) || '',
        rateOfClimb: this.getCellValue(row, 24) || '',
        armament: [this.getCellValue(row, 26), this.getCellValue(row, 27)].filter(Boolean).join(' · '),
        notes: this.getCellValue(row, 28) || ''
      };

      if (heli.helicopter) {
        aviation.push(heli);
      }
    }

    return aviation;
  }

  private getCellValue(row: unknown[], index: number): string {
    const value = row[index];
    return value === null || value === undefined ? '' : String(value);
  }

  retry(): void {
    this.loadData();
  }
  get roles(): string[] { return [...new Set(this.aviation.map(x=>x.typeRole).filter(Boolean))]; }
  get statuses(): string[] { return [...new Set(this.aviation.map(x=>x.status).filter(Boolean))]; }
  get filteredAviation(): AviationDetailed[] { const q=this.search.toLowerCase().trim(); return this.aviation.filter((x,index)=>matchesSheetColumnFilters(aviationSheet as unknown[][],index,this.columnFilters)&&(!this.roleFilter||x.typeRole===this.roleFilter)&&(!this.statusFilter||x.status===this.statusFilter)&&(!q||[x.helicopter,x.variant,x.manufacturer].some(v=>v.toLowerCase().includes(q)))); }
}
