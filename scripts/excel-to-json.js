const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const inputFile = path.resolve(__dirname, '../excel-source/chinese database 2.xlsx');
const outputDir = path.resolve(__dirname, '../src/assets/data/raw');
const manifestFile = path.resolve(__dirname, '../src/assets/data/manifest.json');

if (!fs.existsSync(inputFile)) {
  throw new Error(`Excel file not found: ${inputFile}`);
}

fs.mkdirSync(outputDir, { recursive: true });

const workbook = XLSX.readFile(inputFile, {
  cellDates: true,
  raw: false,
  dense: true
});

const manifest = {
  workbook: path.basename(inputFile),
  generatedAt: new Date().toISOString(),
  sheets: []
};

for (const sheetName of workbook.SheetNames) {
  const sheet = workbook.Sheets[sheetName];

  if (sheet['!ref']) {
    const range = XLSX.utils.decode_range(sheet['!ref']);
    range.s.r = 0;
    sheet['!ref'] = XLSX.utils.encode_range(range);
  }

  const rows = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: null,
    blankrows: true
  });

  const safeName = sheetName
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '_')
    .replace(/\s+/g, '-');

  const outputFile = path.join(outputDir, `${safeName}.json`);
  fs.writeFileSync(outputFile, JSON.stringify(rows, null, 2), 'utf8');

  manifest.sheets.push({
    originalSheetName: sheetName,
    file: `assets/data/raw/${safeName}.json`,
    rows: rows.length,
    format: 'array-of-arrays'
  });
}

fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2), 'utf8');

console.log('Done. Raw sheet JSON files created.');
