const fs = require('fs');
const path = require('path');
const pool = require('../config/database');

function normalizeValue(value) {
  if (value === null || value === undefined) return null;
  const str = String(value).trim();
  if (str === '' || str === '—' || str === '-' || str.toLowerCase() === 'n/a') return null;
  return str;
}

// Path to Angular assets directory
const ASSETS_PATH = path.join(__dirname, '../../src/assets/data/raw');

// Sheet to table mapping with column mappings
const SHEET_MAPPINGS = {
  '1_Land_Units.json': {
    table: 'land_units',
    columns: [
      'side', 'formation_unit_name', 'formation_unit_type', 
      'formation_unit_parent_name', 'standard_unit_formation', 
      'unit_potential_troops', 'location_name', 'latitude', 'longitude'
    ]
  },
  '2_Arm_Types.json': {
    table: 'arm_types',
    columns: [
      'number', 'combat_arm_type_chinese', 'combat_arm_type_english',
      'primary_role', 'classification_mobility', 'classification_combat_role',
      'training_category', 'indian_army_equivalent', 'terrain_specialisation'
    ]
  },
  '3_Weapon_Categories.json': {
    table: 'weapon_categories',
    columns: [
      'side', 'arm_type', 'weapon_category', 'sub_category', 'weapon_name',
      'designation', 'caliber', 'range_km', 'type_guidance', 'role_capability',
      'weight', 'main_gun_notes'
    ]
  },
  '4_Weapon_Sensor.json': {
    table: 'weapon_sensors',
    columns: [
      'side', 'type', 'weapon_sensor_name', 'sub_type', 'detection_range_km',
      'engagement_range_km', 'altitude_depth', 'guidance_sensor',
      'lat_location', 'name_location', 'oli'
    ]
  },
  '5_Land_Unit_Resources.json': {
    table: 'land_unit_resources',
    columns: [
      'side', 'brigade_unit_type', 'personnel', 'tanks', 'ifvs_apcs',
      'sph_artillery', 'mlrs', 'aa_sam_systems', 'helicopters', 'atgms',
      'trucks_logistics', 'detection_range_km', 'engagement_range_km',
      'speed_day', 'speed_night', 'frontage_defensive', 'frontage_offensive',
      'depth', 'a_vehicle', 'b_vehicle', 'force_potential'
    ]
  },
  '6_Vehicle_Speeds.json': {
    table: 'vehicle_speeds',
    columns: [
      'side', 'vehicle_category', 'vehicle_system', 'designation',
      'road_speed_day', 'road_speed_night', 'cross_country_day',
      'cross_country_night', 'amphibious_water_speed', 'operational_range_km', 'notes'
    ]
  },
  '7_Frontage_Depth.json': {
    table: 'frontage_depth',
    columns: [
      'side', 'unit_level', 'operation_type', 'zone', 'frontage_km',
      'depth_km', 'brigade_density', 'key_weapons_notes'
    ]
  },
  '8_Force_Potential.json': {
    table: 'force_potential',
    columns: [
      'side', 'category', 'metric_system', 'value', 'global_rank', 'comparison_notes'
    ]
  },
  '9_Vehicle_Designations.json': {
    table: 'vehicle_designations',
    columns: [
      'side', 'family', 'designation', 'full_chinese_name', 'a_or_b_type',
      'vehicle_type', 'role', 'weight', 'main_armament', 'road_speed',
      'range_km', 'amphibious', 'crew', 'troops', 'notes'
    ]
  },
  '10_Ranks.json': {
    table: 'ranks',
    columns: [
      'side', 'rank_category', 'english_rank', 'chinese_characters',
      'chinese_pinyin', 'nato_equivalent', 'notes'
    ]
  },
  '11_India_China_Comparison.json': {
    table: 'india_china_comparison',
    columns: [
      'level', 'indian_army_unit', 'chinese_army_equivalent', 'chinese_name',
      'size_troops', 'notes'
    ]
  },
  '12_Theater_Capabilities.json': {
    table: 'theater_capabilities',
    columns: [
      'side', 'theater_command', 'hq_location', 'latitude', 'longitude',
      'group_armies_under_it', 'combat_power_focus', 'key_capabilities',
      'area_of_responsibility', 'special_units_notes'
    ]
  },
  '13_Unit_Categories.json': {
    table: 'unit_categories',
    columns: [
      'side', 'category', 'description', 'training_level', 'equipment_level',
      'manning_level', 'readiness', 'deployment_time', 'us_equivalent',
      'percent_of_force', 'notes'
    ]
  },
  '14_Advanced_Technology.json': {
    table: 'advanced_technology',
    columns: [
      'side', 'technology_domain', 'system_name', 'description',
      'range_capability', 'status_2025', 'strategic_impact', 'notes'
    ]
  },
  '16_Aviation_Detailed.json': {
    table: 'aviation_detailed',
    columns: [
      'side', 'helicopter', 'variant', 'type_role', 'manufacturer',
      'based_on', 'first_flight', 'service_entry', 'status', 'total_built',
      'unit_cost', 'crew', 'passengers_troops', 'length', 'rotor_diameter',
      'height', 'empty_weight', 'max_weight', 'max_speed', 'range_km',
      'service_ceiling', 'rate_of_climb', 'armament', 'notes'
    ]
  },
  '17_Air_Defence_Detailed.json': {
    table: 'air_defence_detailed',
    columns: [
      'side', 'system', 'type_category', 'based_on', 'service_entry',
      'status', 'export_name', 'missile_munition_length', 'missile_munition_diameter',
      'missile_munition_weight', 'launcher_config', 'radar', 'range_km',
      'altitude', 'radar_range', 'engagement_time', 'speed', 'gun_caliber',
      'gun_rate', 'notes'
    ]
  }
};

// Helper function to parse JSON array-of-arrays
function parseJsonFile(filePath) {
  const data = fs.readFileSync(filePath, 'utf8');
  const rows = JSON.parse(data);
  
  // Skip row 0 (title) and row 1 (headers), data starts at row 2
  const dataRows = rows.slice(2);
  
  return dataRows.filter(row => {
    // Filter out empty rows
    return Array.isArray(row) && row.some(cell => cell !== null && cell !== undefined && cell !== '');
  });
}

// Helper function to map row data to column names with explicit null handling
function mapRowToColumns(row, columns) {
  const mapped = {};
  columns.forEach((col, index) => {
    const value = row[index];
    
    // Explicit null handling
    if (value === null || value === undefined) {
      mapped[col] = null;
    } else if (typeof value === 'string' && value.trim() === '') {
      mapped[col] = null;
    } else {
      // Keep as text for mixed Excel-derived values where types are unclear
      mapped[col] = String(value);
    }
  });
  return mapped;
}

// Import data for a single sheet
async function importSheet(fileName, mapping) {
  console.log(`Importing ${fileName}...`);
  
  const filePath = path.join(ASSETS_PATH, fileName);
  
  if (!fs.existsSync(filePath)) {
    console.log(`  File not found: ${filePath}`);
    return;
  }
  
  const dataRows = parseJsonFile(filePath);
  console.log(`  Found ${dataRows.length} data rows`);
  
  if (dataRows.length === 0) {
    console.log(`  No data to import`);
    return;
  }
  
  // Truncate table first (simplest approach for this use case)
  await pool.query(`TRUNCATE TABLE ${mapping.table} RESTART IDENTITY CASCADE`);
  
  // Build insert query
  const columns = mapping.columns;
  const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
  const insertQuery = `
    INSERT INTO ${mapping.table} (${columns.join(', ')})
    VALUES (${placeholders})
  `;
  
  // Insert each row
  let successCount = 0;
  for (const row of dataRows) {
    const mapped = mapRowToColumns(row, columns);
    const values = columns.map((_, index) => normalizeValue(row[index]));    
    try {
      await pool.query(insertQuery, values);
      successCount++;
    } catch (error) {
      console.error(`  Error inserting row:`, error.message);
    }
  }
  
  console.log(`  Imported ${successCount}/${dataRows.length} rows`);
}

// Main import function
async function importAllData() {
  console.log('Starting Excel to PostgreSQL import...');
  console.log(`Assets path: ${ASSETS_PATH}`);
  
  try {
    // Import in recommended order
    const importOrder = [
      '2_Arm_Types.json', // Reference data first
      '1_Land_Units.json', // Hierarchical
      '12_Theater_Capabilities.json', // Hierarchical
      '3_Weapon_Categories.json',
      '4_Weapon_Sensor.json',
      '5_Land_Unit_Resources.json',
      '6_Vehicle_Speeds.json',
      '9_Vehicle_Designations.json',
      '7_Frontage_Depth.json',
      '8_Force_Potential.json',
      '10_Ranks.json',
      '11_India_China_Comparison.json',
      '13_Unit_Categories.json',
      '14_Advanced_Technology.json',
      '16_Aviation_Detailed.json',
      '17_Air_Defence_Detailed.json'
    ];
    
    for (const fileName of importOrder) {
      if (SHEET_MAPPINGS[fileName]) {
        await importSheet(fileName, SHEET_MAPPINGS[fileName]);
      }
    }
    
    console.log('Import completed successfully!');
    
    // Print summary
    const tables = Object.values(SHEET_MAPPINGS).map(m => m.table);
    for (const table of tables) {
      const result = await pool.query(`SELECT COUNT(*) FROM ${table}`);
      console.log(`  ${table}: ${result.rows[0].count} rows`);
    }
    
  } catch (error) {
    console.error('Import failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run import
importAllData().then(() => {
  console.log('Done');
  process.exit(0);
}).catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
