import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ExcelDataService } from '../../services/excel-data.service';
import { buildSheetColumnFilters, matchesSheetColumnFilters } from '../../shared/utils/sheet-column-filters';

interface TheaterCapability {
  side:string; command:string; headquarters:string; latitude:string; longitude:string;
  groupArmies:string; focus:string; capabilities:string; responsibility:string; notes:string;
}

@Component({
  selector:'app-theater-capabilities', standalone:true, imports:[CommonModule,FormsModule],
  templateUrl:'./theater-capabilities.component.html', styleUrls:['./theater-capabilities.component.scss']
})
export class TheaterCapabilitiesComponent implements OnInit {
  theaters:TheaterCapability[]=[]; loading=false; error:string|null=null; side=''; query='';
  sheetData: unknown[][] = [];
  sheetFilters = buildSheetColumnFilters(this.sheetData); columnFilters:Record<number,string>={};
  constructor(
    private readonly excelDataService: ExcelDataService
  ) {}

  ngOnInit(): void {
    this.load();
  }
  load(): void {
    this.loading = true;
    this.error = null;

    this.excelDataService
      .getSheet(
        'assets/data/raw/12_Theater_Capabilities.json'
      )
      .subscribe({
        next: data => {
          this.sheetData = data as unknown[][];
          this.sheetFilters =
            buildSheetColumnFilters(this.sheetData);

          this.theaters = this.sheetData
            .slice(2)
            .filter(row => row?.[1])
            .map(row => ({
              side: this.cell(row, 0),
              command: this.cell(row, 1),
              headquarters: this.cell(row, 2),
              latitude: this.cell(row, 3),
              longitude: this.cell(row, 4),
              groupArmies: this.cell(row, 5),
              focus: this.cell(row, 6),
              capabilities: this.cell(row, 7),
              responsibility: this.cell(row, 8),
              notes: this.cell(row, 9)
            }));

          this.loading = false;
        },
        error: error => {
          console.error(
            'Failed to load theater data from PostgreSQL.',
            error
          );
          this.error =
            'Failed to load theater data from PostgreSQL.';
          this.loading = false;
        }
      });
  }

  get sides(){ return [...new Set(this.theaters.map(x=>x.side).filter(Boolean))]; }
  get filtered(){ const q=this.query.toLowerCase().trim(); return this.theaters.filter((x,index)=>matchesSheetColumnFilters(this.sheetData,index,this.columnFilters)&&(!this.side||x.side===this.side)&&(!q||Object.values(x).some(v=>v.toLowerCase().includes(q)))); }
  private cell(row:unknown[],i:number){ const value=row[i]; return value==null?'':String(value); }
}
