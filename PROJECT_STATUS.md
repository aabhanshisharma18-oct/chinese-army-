# PROJECT STATUS

## Current state

The project is connected to GitHub and the repository contains the current local project files.

The Angular app already includes Excel-imported JSON data and at least part of the frontend has been connected to that data through services. The application builds successfully, but some required frontend behavior is still incomplete.

## Working

- Excel workbook has been exported into JSON
- JSON files are included in the project
- `ExcelDataService` exists as central data loader
- GitHub repo is synced with local project
- `/data` raw viewer route exists for verification/debugging
- Some sheets/components were previously reported as integrated

## Integrated earlier but must be verified in UI

The following were previously reported as integrated:

- `00_INDEX.json` → `DataCoverage`
- `1_Land_Units.json` → `FormationSpecs`
- `8_Force_Potential.json` → `ReadinessAcademy`
- `12_Theater_Capabilities.json` → `OperationalSectors`
- `15_References.json` → `AnalystNotes`

Important: these should be verified in the running UI and not just assumed correct because a previous summary claimed integration.

## Broken or incomplete

- Hierarchy page is not opening
- Land page still does not show the required Excel-driven drill-down structure
- Frontend still appears too similar to older behavior
- Some field mapping and hierarchy behavior likely remain incomplete

## Required Land page behavior

The Land page must:
- keep the keyword search bar
- replace `Type` with `Arm Type`
- replace `Category` with `Weapon Category`
- first show top-level categories
- then show subcategories
- then support deeper drill-down such as side, unit formation, and related filters
- return final results from Excel-backed JSON data

## Constraints

- Keep `/data` route working
- Do not remove the search bar from the Land page
- Do not reintroduce hardcoded data where Excel integration is intended
- Do not make unrelated UI changes
- Preserve other working pages unless necessary for bug fixing

## Current top priorities

1. Fix hierarchy page not opening
2. Rebuild/refactor Land page into Excel-driven drill-down flow
3. Verify Excel field mapping in actual UI
4. Keep existing acceptable pages stable

## Important reminder

If previous status notes conflict with the actual codebase, trust the codebase after inspection and report the mismatch clearly.
