# Metadata API Testing

This document provides curl commands for testing the new metadata endpoints.

## Prerequisites

Ensure the backend server is running:
```bash
cd backend
npm start
```

## Metadata Endpoints

### 1. Get Sections Structure

Returns the complete section/subsection organization with excluded columns configuration.

```bash
curl http://localhost:3000/api/metadata/sections
```

Expected response:
```json
{
  "sections": [
    {
      "id": "land",
      "name": "LAND",
      "tables": [
        {
          "id": "land_units",
          "name": "Land Units",
          "tableName": "land_units",
          "apiEndpoint": "/api/land-units"
        },
        ...
      ]
    },
    {
      "id": "military_reference",
      "name": "MILITARY REFERENCE",
      "tables": [...]
    }
  ],
  "excludedColumns": ["id", "created_at", "updated_at", ...],
  "longTextFields": ["notes", "description", ...]
}
```

### 2. Get Filterable Columns for a Table

Returns the list of columns that can be used as filters for a specific table.

```bash
# Land Units
curl http://localhost:3000/api/metadata/filters/land_units

# Weapon Categories
curl http://localhost:3000/api/metadata/filters/weapon_categories

# Vehicle Speeds
curl http://localhost:3000/api/metadata/filters/vehicle_speeds
```

Expected response:
```json
{
  "table": "land_units",
  "filterableColumns": [
    {
      "name": "side",
      "type": "character varying"
    },
    {
      "name": "formation_unit_type",
      "type": "character varying"
    },
    ...
  ]
}
```

### 3. Get Distinct Filter Values

Returns distinct values for a specific filter column, sorted alphabetically.

```bash
# Side values for Land Units
curl http://localhost:3000/api/metadata/filter-values/land_units/side

# Formation Unit Type values for Land Units
curl http://localhost:3000/api/metadata/filter-values/land_units/formation_unit_type

# Arm Type values for Weapon Categories
curl http://localhost:3000/api/metadata/filter-values/weapon_categories/arm_type

# Weapon Category values for Weapon Categories
curl http://localhost:3000/api/metadata/filter-values/weapon_categories/weapon_category

# Vehicle Category values for Vehicle Speeds
curl http://localhost:3000/api/metadata/filter-values/vehicle_speeds/vehicle_category

# Unit Level values for Frontage Depth
curl http://localhost:3000/api/metadata/filter-values/frontage_depth/unit_level
```

Expected response:
```json
{
  "table": "land_units",
  "column": "side",
  "values": ["CHINA", "INDIA"]
}
```

## Error Handling

### Table Not Found

```bash
curl http://localhost:3000/api/metadata/filters/nonexistent_table
```

Expected response:
```json
{
  "error": "Table not found"
}
```

### Column Not Found

```bash
curl http://localhost:3000/api/metadata/filter-values/land_units/nonexistent_column
```

Expected response:
```json
{
  "error": "Column not found"
}
```

### Invalid Column Name

```bash
curl http://localhost:3000/api/metadata/filter-values/land_units/invalid;column
```

Expected response:
```json
{
  "error": "Invalid column name"
}
```

## Caching

All metadata endpoints include HTTP caching headers:
- Sections endpoint: 1 hour (3600 seconds)
- Filters endpoint: 1 hour (3600 seconds)
- Filter values endpoint: 30 minutes (1800 seconds)

## Integration Testing

To test the full integration with Angular:

1. Start the backend server:
```bash
cd backend
npm start
```

2. Start Angular with proxy:
```bash
ng serve --proxy-config proxy.conf.json
```

3. Navigate to the Land page and verify:
   - Filter dropdowns are populated with values from the API
   - Section structure is correctly displayed
   - No console errors related to metadata loading

## Notes

- Filter values are computed dynamically from PostgreSQL
- Values are sorted alphabetically
- NULL and empty string values are excluded
- Excluded columns (notes, descriptions, IDs, timestamps) are not returned as filterable
