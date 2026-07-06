import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExcelDataService } from '../../services/excel-data.service';

interface TheaterCommand {
  side: string;
  theaterCommand: string;
  hqLocation: string;
  latitude: string;
  longitude: string;
  groupArmiesUnderIt: string;
  combatPowerFocus: string;
  keyCapabilities: string;
  areaOfResponsibility: string;
  specialUnitsNotes: string;
}

interface GroupArmy {
  side: string;
  groupArmy: string;
  parentTheater: string;
  location: string;
  troops: string;
  mbts: string;
  afvs: string;
  sph: string;
  mlrs: string;
  helicopters: string;
  combatBrigades: string;
  supportBrigades: string;
  combatAutonomy: string;
}

@Component({
  selector: 'app-operational-sectors',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './operational-sectors.component.html',
  styleUrls: ['./operational-sectors.component.scss']
})
export class OperationalSectorsComponent implements OnInit {
  videoSrc = 'assets/videos/formations-bg.mp4';
  theaterCommands: TheaterCommand[] = [];
  groupArmies: GroupArmy[] = [];
  loading = true;
  error: string | null = null;

  constructor(private excelDataService: ExcelDataService) {}

  ngOnInit(): void {
    this.loadTheaterData();
  }

  loadTheaterData(): void {
    this.loading = true;
    this.error = null;

    this.excelDataService.getSheet('assets/data/raw/12_Theater_Capabilities.json').subscribe({
      next: (data: unknown) => {
        this.parseTheaterData(data);
        this.loading = false;
      },
      error: (err) => {
        this.error = `Failed to load theater data: ${err.message}`;
        this.loading = false;
      }
    });
  }

  private parseTheaterData(data: unknown): void {
    const rows = data as unknown[][];
    if (!Array.isArray(rows) || rows.length < 2) return;

    // Parse Theater Commands (rows 2-6)
    for (let i = 2; i < 7; i++) {
      const row = rows[i] as unknown[];
      if (!Array.isArray(row) || row.length === 0) continue;

      const theater: TheaterCommand = {
        side: this.getCellValue(row, 0) || '',
        theaterCommand: this.getCellValue(row, 1) || '',
        hqLocation: this.getCellValue(row, 2) || '',
        latitude: this.getCellValue(row, 3) || '',
        longitude: this.getCellValue(row, 4) || '',
        groupArmiesUnderIt: this.getCellValue(row, 5) || '',
        combatPowerFocus: this.getCellValue(row, 6) || '',
        keyCapabilities: this.getCellValue(row, 7) || '',
        areaOfResponsibility: this.getCellValue(row, 8) || '',
        specialUnitsNotes: this.getCellValue(row, 9) || ''
      };

      if (theater.theaterCommand) {
        this.theaterCommands.push(theater);
      }
    }

    // Parse Group Armies (rows 11-23)
    for (let i = 11; i < rows.length; i++) {
      const row = rows[i] as unknown[];
      if (!Array.isArray(row) || row.length === 0) continue;

      const groupArmy: GroupArmy = {
        side: this.getCellValue(row, 0) || '',
        groupArmy: this.getCellValue(row, 1) || '',
        parentTheater: this.getCellValue(row, 2) || '',
        location: this.getCellValue(row, 3) || '',
        troops: this.getCellValue(row, 4) || '',
        mbts: this.getCellValue(row, 5) || '',
        afvs: this.getCellValue(row, 6) || '',
        sph: this.getCellValue(row, 7) || '',
        mlrs: this.getCellValue(row, 8) || '',
        helicopters: this.getCellValue(row, 9) || '',
        combatBrigades: this.getCellValue(row, 10) || '',
        supportBrigades: this.getCellValue(row, 11) || '',
        combatAutonomy: this.getCellValue(row, 12) || ''
      };

      if (groupArmy.groupArmy) {
        this.groupArmies.push(groupArmy);
      }
    }
  }

  private getCellValue(row: unknown[], index: number): string {
    const value = row[index];
    return value === null || value === undefined ? '' : String(value);
  }

  retry(): void {
    this.loadTheaterData();
  }
}
