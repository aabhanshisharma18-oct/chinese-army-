import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExcelDataService } from '../../services/excel-data.service';
import { buildSheetColumnFilters, matchesSheetColumnFilters } from '../../shared/utils/sheet-column-filters';

interface Rank {
  side: string;
  rankCategory: string;
  englishRank: string;
  chineseCharacters: string;
  chinesePinyin: string;
  natoEquivalent: string;
  notes: string;
}

@Component({
  selector: 'app-ranks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ranks.component.html',
  styleUrls: ['./ranks.component.scss']
})
export class RanksComponent implements OnInit {
  ranks: Rank[] = [];
  loading = false;
  error: string | null = null;
  sideFilter = '';
  categoryFilter = '';
  search = '';
  sheetData: unknown[][] = [];
  sheetFilters = buildSheetColumnFilters(this.sheetData);
  columnFilters: Record<number, string> = {};

  constructor(
    private readonly excelDataService: ExcelDataService
  ) {}

  ngOnInit(): void {
    this.loadRanks();
  }

  loadRanks(): void {
    this.loading = true;
    this.error = null;

    this.excelDataService
      .getSheet('assets/data/raw/10_Ranks.json')
      .subscribe({
        next: data => {
          this.sheetData = data as unknown[][];
          this.sheetFilters =
            buildSheetColumnFilters(this.sheetData);

          this.ranks = this.parseRanks(data);
          this.loading = false;
        },
        error: error => {
          console.error('Failed to load ranks from PostgreSQL.', error);
          this.error = 'Failed to load ranks from PostgreSQL.';
          this.loading = false;
        }
      });
  }

  private parseRanks(data: unknown): Rank[] {
    const rows = data as unknown[][];
    if (!Array.isArray(rows) || rows.length < 2) return [];

    const ranks: Rank[] = [];

    for (let i = 2; i < rows.length; i++) {
      const row = rows[i] as unknown[];
      if (!Array.isArray(row) || row.length === 0) continue;

      const rank: Rank = {
        side: this.getCellValue(row, 0) || '',
        rankCategory: this.getCellValue(row, 1) || '',
        englishRank: this.getCellValue(row, 2) || '',
        chineseCharacters: this.getCellValue(row, 3) || '',
        chinesePinyin: this.getCellValue(row, 4) || '',
        natoEquivalent: this.getCellValue(row, 5) || '',
        notes: this.getCellValue(row, 6) || ''
      };

      if (rank.englishRank) {
        ranks.push(rank);
      }
    }

    return ranks;
  }

  private getCellValue(row: unknown[], index: number): string {
    const value = row[index];
    return value === null || value === undefined ? '' : String(value);
  }

  getRanksByCategory(category: string): Rank[] {
    const query = this.search.toLowerCase().trim();
    return this.ranks.filter((r, index) => r.rankCategory === category &&
      matchesSheetColumnFilters(this.sheetData, index, this.columnFilters) &&
      (!this.sideFilter || r.side === this.sideFilter) &&
      (!this.categoryFilter || r.rankCategory === this.categoryFilter) &&
      (!query || [r.englishRank,r.chineseCharacters,r.chinesePinyin,r.natoEquivalent].some(v => v.toLowerCase().includes(query))));
  }

  get sides(): string[] { return [...new Set(this.ranks.map(r => r.side).filter(Boolean))]; }
  get categories(): string[] { return [...new Set(this.ranks.map(r => r.rankCategory).filter(Boolean))]; }

  retry(): void {
    this.loadRanks();
  }
}
