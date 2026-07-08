# API Testing with curl

This document provides curl commands for testing all API endpoints. Ensure the backend server is running on port 3000 before testing.

## Health Check

```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-07-07T..."
}
```

## Main Data Endpoints

### Land Units
```bash
# Get all land units
curl http://localhost:3000/api/land-units

# Get single land unit by ID
curl http://localhost:3000/api/land-units/1
```

### Arm Types
```bash
# Get all arm types
curl http://localhost:3000/api/arm-types

# Get single arm type by ID
curl http://localhost:3000/api/arm-types/1
```

### Weapon Categories
```bash
# Get all weapon categories
curl http://localhost:3000/api/weapon-categories

# Get single weapon category by ID
curl http://localhost:3000/api/weapon-categories/1
```

### Weapon Sensors
```bash
# Get all weapon sensors
curl http://localhost:3000/api/weapon-sensors

# Get single weapon sensor by ID
curl http://localhost:3000/api/weapon-sensors/1
```

### Land Unit Resources
```bash
# Get all land unit resources
curl http://localhost:3000/api/land-unit-resources

# Get single land unit resource by ID
curl http://localhost:3000/api/land-unit-resources/1
```

### Vehicle Speeds
```bash
# Get all vehicle speeds
curl http://localhost:3000/api/vehicle-speeds

# Get single vehicle speed by ID
curl http://localhost:3000/api/vehicle-speeds/1
```

### Frontage Depth
```bash
# Get all frontage depth data
curl http://localhost:3000/api/frontage-depth

# Get single frontage depth entry by ID
curl http://localhost:3000/api/frontage-depth/1
```

### Force Potential
```bash
# Get all force potential metrics
curl http://localhost:3000/api/force-potential

# Get single force potential metric by ID
curl http://localhost:3000/api/force-potential/1
```

### Vehicle Designations
```bash
# Get all vehicle designations
curl http://localhost:3000/api/vehicle-designations

# Get single vehicle designation by ID
curl http://localhost:3000/api/vehicle-designations/1
```

### Ranks
```bash
# Get all ranks
curl http://localhost:3000/api/ranks

# Get single rank by ID
curl http://localhost:3000/api/ranks/1
```

### India China Comparison
```bash
# Get all India-China comparisons
curl http://localhost:3000/api/india-china-comparison

# Get single India-China comparison by ID
curl http://localhost:3000/api/india-china-comparison/1
```

### Theater Capabilities
```bash
# Get all theater capabilities
curl http://localhost:3000/api/theater-capabilities

# Get single theater capability by ID
curl http://localhost:3000/api/theater-capabilities/1
```

### Unit Categories
```bash
# Get all unit categories
curl http://localhost:3000/api/unit-categories

# Get single unit category by ID
curl http://localhost:3000/api/unit-categories/1
```

### Advanced Technology
```bash
# Get all advanced technology entries
curl http://localhost:3000/api/advanced-technology

# Get single advanced technology entry by ID
curl http://localhost:3000/api/advanced-technology/1
```

### Aviation Detailed
```bash
# Get all aviation detailed data
curl http://localhost:3000/api/aviation-detailed

# Get single aviation detailed entry by ID
curl http://localhost:3000/api/aviation-detailed/1
```

### Air Defence Detailed
```bash
# Get all air defence detailed data
curl http://localhost:3000/api/air-defence-detailed

# Get single air defence detailed entry by ID
curl http://localhost:3000/api/air-defence-detailed/1
```

## Raw Data Endpoint (for /data preservation)

```bash
# Get raw JSON for specific sheet
curl http://localhost:3000/api/raw/1_Land_Units
curl http://localhost:3000/api/raw/2_Arm_Types
curl http://localhost:3000/api/raw/12_Theater_Capabilities
```

## Pretty-Printed Output

To format JSON output for readability:
```bash
curl http://localhost:3000/api/land-units | jq
```

Or with Python:
```bash
curl http://localhost:3000/api/land-units | python -m json.tool
```

## Save Output to File

```bash
curl http://localhost:3000/api/land-units -o land-units.json
```

## Test Response Format

The API returns data in array-of-arrays format to match Excel JSON structure:

```bash
curl -s http://localhost:3000/api/land-units | head -c 500
```

Expected format:
```json
[
  ["CHINA", "Central Military Commission (CMC)", "Supreme Command", ...],
  ["CHINA", "Eastern Theater Command", "Theater Command", ...],
  ...
]
```

## Test Error Handling

```bash
# Test 404 for non-existent ID
curl http://localhost:3000/api/land-units/999

# Test 404 for non-existent sheet
curl http://localhost:3000/api/raw/NonExistentSheet
```

## Batch Testing Script

Save this as `test-api.sh` and run with `bash test-api.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:3000/api"

echo "Testing API endpoints..."

# Health check
echo -n "Health check: "
curl -s $BASE_URL/health | jq -r '.status'

# Test each endpoint
endpoints=(
  "land-units"
  "arm-types"
  "weapon-categories"
  "weapon-sensors"
  "land-unit-resources"
  "vehicle-speeds"
  "frontage-depth"
  "force-potential"
  "vehicle-designations"
  "ranks"
  "india-china-comparison"
  "theater-capabilities"
  "unit-categories"
  "advanced-technology"
  "aviation-detailed"
  "air-defence-detailed"
)

for endpoint in "${endpoints[@]}"; do
  echo -n "$endpoint: "
  count=$(curl -s $BASE_URL/$endpoint | jq 'length')
  echo "$count rows"
done

echo "API testing complete!"
```

## Performance Testing

Test response time:
```bash
time curl -s http://localhost:3000/api/land-units > /dev/null
```

## CORS Testing

Test CORS headers:
```bash
curl -I -H "Origin: http://localhost:4200" http://localhost:3000/api/land-units
```

Look for `Access-Control-Allow-Origin` header in response.
