import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import theaterSheet from '../../../assets/data/raw/12_Theater_Capabilities.json';
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
  readonly sheetFilters=buildSheetColumnFilters(theaterSheet as unknown[][]); columnFilters:Record<number,string>={};
  ngOnInit(){ this.load(); }
  load(){ this.loading=false; const rows=theaterSheet as unknown[][]; this.theaters=(rows||[]).slice(2).filter(r=>r?.[1]).map(r=>({
      side:this.cell(r,0),command:this.cell(r,1),headquarters:this.cell(r,2),latitude:this.cell(r,3),longitude:this.cell(r,4),
      groupArmies:this.cell(r,5),focus:this.cell(r,6),capabilities:this.cell(r,7),responsibility:this.cell(r,8),notes:this.cell(r,9)
    })); }
  get sides(){ return [...new Set(this.theaters.map(x=>x.side).filter(Boolean))]; }
  get filtered(){ const q=this.query.toLowerCase().trim(); return this.theaters.filter((x,index)=>matchesSheetColumnFilters(theaterSheet as unknown[][],index,this.columnFilters)&&(!this.side||x.side===this.side)&&(!q||Object.values(x).some(v=>v.toLowerCase().includes(q)))); }
  private cell(row:unknown[],i:number){ const value=row[i]; return value==null?'':String(value); }
}
