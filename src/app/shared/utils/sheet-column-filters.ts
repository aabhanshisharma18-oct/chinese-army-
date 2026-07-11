export interface SheetColumnFilter {
  index: number;
  label: string;
  options: string[];
}

export function buildSheetColumnFilters(sheet: unknown[][]): SheetColumnFilter[] {
  const headers = Array.isArray(sheet?.[1]) ? sheet[1] : [];
  const rows = sheet.slice(2);
  return headers
    .map((header, index) => ({ header, index }))
    .filter(({ header }) => header !== null && header !== undefined && String(header).trim() !== '')
    .map(({ header, index }) => ({
      index,
      label: String(header),
      options: [...new Set(rows.map(row => String(row?.[index] ?? '').trim()).filter(Boolean))]
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
    }));
}

export function matchesSheetColumnFilters(
  sheet: unknown[][],
  parsedRowIndex: number,
  selections: Record<number, string>
): boolean {
  const row = sheet[parsedRowIndex + 2] || [];
  return Object.entries(selections).every(([index, selected]) =>
    !selected || String(row[Number(index)] ?? '').trim() === selected
  );
}
