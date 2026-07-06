# PROJECT HANDOFF

## Purpose of this document

This file is a detailed handoff for any future developer or AI coding tool continuing work on this repository.

Read this after:
1. `README.md`
2. `PROJECT_STATUS.md`

This document contains deeper project background, architecture notes, known issues, requirements, constraints, and the expected next implementation direction.

---

## 1. Project objective

This Angular application is being transitioned from older hardcoded/static frontend structures to a frontend that is actually driven by Excel-imported JSON data.

The intent is not only to store Excel data in the project, but to make the UI visibly and functionally dependent on that imported data.

The `/data` route exists as a raw viewer/debugging route so the imported workbook content can be verified directly in the browser.

---

## 2. Current understanding of the project

The workbook has already been exported to JSON, and the repo already contains the current local project state.

A central Angular data service was created for Excel-backed data access:
- `src/app/services/excel-data.service.ts`

This service reportedly exposes methods such as:
- `getManifest()`
- `getAllSheets()`
- `getSheet()`

The app reportedly builds cleanly, but the user has made it clear that the visible UI still does not fully meet the required business behavior, especially for the Land page.

---

## 3. What has already been reported as done

Earlier work reported:
- successful workbook → JSON export
- sheet manifest preservation
- blank cell preservation as `null`
- blank row preservation
- raw viewer at `/data`
- integration of some selected sheets/components
- successful Angular build after integration

Previously reported partial integrations:
- `00_INDEX.json` → `DataCoverage`
- `1_Land_Units.json` → `FormationSpecs`
- `8_Force_Potential.json` → `ReadinessAcademy`
- `12_Theater_Capabilities.json` → `OperationalSectors`
- `15_References.json` → `AnalystNotes`

These claims should be treated as provisional until verified in the running app.

---

## 4. Known user-reported problems

### 4.1 Hierarchy page
The hierarchy page is not opening.

Possible causes:
- route configuration issue
- `routerLink` mismatch
- component registration problem
- broken lazy loading
- navigation path mismatch

This must be fixed as a high-priority bug.

### 4.2 Land page does not reflect required UX
The user says the Land page still looks too similar to the old behavior and does not show the expected hierarchy-based exploration of data.

### 4.3 Required terminology is not aligned
The user wants:
- `Type` changed to `Arm Type`
- `Category` changed to `Weapon Category`

### 4.4 Search bar must stay
The existing keyword search bar on the Land page must remain available.

### 4.5 Unrelated pages should not be changed
The user said other pages are fine, so the next work should stay narrowly focused.

---

## 5. Exact expected Land page behavior

The required Land page behavior is:

1. User opens Land page
2. User sees top-level categories
3. User opens a category
4. User sees subcategories
5. User can continue into deeper filters such as side, unit formation, and related fields
6. User gets the desired result based on Excel-backed data
7. Keyword search bar remains available throughout

This should be implemented as a true drill-down or hierarchical browsing flow, not just a flat filter list.

The displayed structure must come from Excel-derived JSON and not from newly invented hardcoded UI data.

---

## 6. Important technical constraints

The following constraints must be respected:

- Excel-derived JSON is the source of truth
- do not reintroduce hardcoded frontend data for integrated sections
- keep `/data` route working
- do not remove the keyword search bar
- do not make unrelated UI changes
- keep changes traceable to workbook data fields
- do not assume earlier summaries are fully accurate without verifying the current codebase

---

## 7. Pending sheets likely relevant to future integration

The following sheets were still considered pending in earlier summaries and may be important for completing the intended frontend:

- `2_Arm_Types.json`
- `3_Weapon_Categories.json`
- `4_Weapon_Sensor.json`
- `5_Land_Unit_Resources.json`
- `6_Vehicle_Speeds.json`
- `7_Frontage_Depth.json`
- `9_Vehicle_Designations.json`
- `10_Ranks.json`
- `11_India_China_Comparison.json`
- `13_Unit_Categories.json`
- `14_Advanced_Technology.json`
- `16_Aviation_Detailed.json`
- `17_Air_Defence_Detailed.json`

These should be verified directly against the actual repo contents.

---

## 8. Recommended inspection order

The next developer or AI tool should inspect these areas first:

### Routing and navigation
- Angular route configuration
- navbar/sidebar/menu components
- hierarchy page route and component
- `routerLink` usage

### Core data layer
- `src/app/services/excel-data.service.ts`
- any wrapper data services around workbook sheets

### Land page implementation
- Land page TypeScript file
- Land page template
- Land page styles
- any models/services used by Land page
- any hardcoded fallback data still present there

### Raw data viewer
- `/data` route files
- raw viewer component
- manifest reading logic

### Excel JSON assets
- workbook manifest file
- all exported sheet JSON files

---

## 9. Suggested implementation plan

### Priority 1: Fix hierarchy page
- confirm route exists
- confirm route is linked correctly
- confirm component loads
- test by direct URL and by clicking navigation
- do not stop at a clean build; verify actual runtime behavior

### Priority 2: Rebuild/refactor Land page
- inspect current component structure
- identify old flat/hardcoded logic
- replace with data-driven hierarchy
- map workbook data to:
  - Arm Type
  - Weapon Category
  - deeper filters such as side and unit formation
- preserve keyword search
- ensure rendered results come from Excel-backed data

### Priority 3: Verify actual UI integration
Where earlier summaries claimed integration, verify:
- service consumption
- actual rendered output
- field mapping correctness
- user-visible behavior

### Priority 4: Preserve unrelated pages
Avoid broad UI redesigns.

---

## 10. Definition of success

Work should be considered successful only if all of the following are true:

### Hierarchy page
- opens correctly from route/navigation

### Land page
- shows top-level categories first
- opens into subcategories
- supports deeper drill-down
- preserves the search bar
- uses Excel-driven data in visible behavior
- uses correct labels: `Arm Type` and `Weapon Category`

### Overall app
- `/data` still works
- no unnecessary unrelated UI changes were made
- no hardcoded data was reintroduced where Excel data should drive the UI

---

## 11. Final handoff note

If anything in this document conflicts with the actual codebase, inspect the codebase and report the mismatch explicitly.

The codebase is the final source of truth for implementation status, while this handoff explains intent, history, and expected next direction.
