const path = require('path');
const XLSX = require('xlsx');
const pool = require('../src/dao/database');

const WORKBOOK_PATH = path.join(
  __dirname,
  '../../excel-source/CHINESE_ARMY_DATABASE-2.xlsx'
);

const SHEET_MAPPINGS = [
  {
    sheet: '00_INDEX',
    table: 'workbook_index',
    columns: [
      'sheet_tab',
      'sheet_name',
      'contents',
      'rows_of_data'
    ]
  },
  {
    sheet: '15_References',
    table: 'reference_sources',
    columns: [
      'reference_number',
      'category',
      'source_title',
      'url',
      'source_type',
      'source_date'
    ]
  },
  {
    sheet: '2_Arm_Types',
    table: 'arm_types',
    columns: [
      'number',
      'combat_arm_type_chinese',
      'combat_arm_type_english',
      'primary_role',
      'classification_mobility',
      'classification_combat_role',
      'training_category',
      'indian_army_equivalent',
      'terrain_specialisation'
    ]
  },
  {
    sheet: '1_Land_Units',
    table: 'land_units',
    columns: [
      'side',
      'formation_unit_name',
      'formation_unit_type',
      'formation_unit_parent_name',
      'standard_unit_formation',
      'unit_potential_troops',
      'location_name',
      'latitude',
      'longitude'
    ]
  },
  {
    sheet: '3_Weapon_Categories',
    table: 'weapon_categories',
    columns: [
      'side',
      'arm_type',
      'weapon_category',
      'sub_category',
      'weapon_name',
      'designation',
      'caliber',
      'range_km',
      'type_guidance',
      'role_capability',
      'weight',
      'main_gun_notes'
    ]
  },
  {
    sheet: '4_Weapon_Sensor',
    table: 'weapon_sensors',
    columns: [
      'side',
      'type',
      'weapon_sensor_name',
      'sub_type',
      'detection_range_km',
      'engagement_range_km',
      'altitude_depth',
      'guidance_sensor',
      'lat_location',
      'name_location',
      'oli'
    ]
  },
  {
    sheet: '5_Land_Unit_Resources',
    table: 'land_unit_resources',
    columns: [
      'side',
      'brigade_unit_type',
      'personnel',
      'tanks',
      'ifvs_apcs',
      'sph_artillery',
      'mlrs',
      'aa_sam_systems',
      'helicopters',
      'atgms',
      'trucks_logistics',
      'detection_range_km',
      'engagement_range_km',
      'speed_day',
      'speed_night',
      'frontage_defensive',
      'frontage_offensive',
      'depth',
      'a_vehicle',
      'b_vehicle',
      'force_potential'
    ]
  },
  {
    sheet: '6_Vehicle_Speeds',
    table: 'vehicle_speeds',
    columns: [
      'side',
      'vehicle_category',
      'vehicle_system',
      'designation',
      'road_speed_day',
      'road_speed_night',
      'cross_country_day',
      'cross_country_night',
      'amphibious_water_speed',
      'operational_range_km',
      'notes'
    ]
  },
  {
    sheet: '7_Frontage_Depth',
    table: 'frontage_depth',
    columns: [
      'side',
      'unit_level',
      'operation_type',
      'zone',
      'frontage_km',
      'depth_km',
      'brigade_density',
      'key_weapons_notes'
    ]
  },
  {
    sheet: '8_Force_Potential',
    table: 'force_potential',
    columns: [
      'side',
      'category',
      'metric_system',
      'value',
      'global_rank',
      'comparison_notes'
    ]
  },
  {
    sheet: '9_Vehicle_Designations',
    table: 'vehicle_designations',
    columns: [
      'side',
      'family',
      'designation',
      'full_chinese_name',
      'a_or_b_type',
      'vehicle_type',
      'role',
      'weight',
      'main_armament',
      'road_speed',
      'range_km',
      'amphibious',
      'crew',
      'troops',
      'notes'
    ]
  },
  {
    sheet: '10_Ranks',
    table: 'ranks',
    columns: [
      'side',
      'rank_category',
      'english_rank',
      'chinese_characters',
      'chinese_pinyin',
      'nato_equivalent',
      'notes'
    ]
  },
  {
    sheet: '11_India_China_Comparison',
    table: 'india_china_comparison',
    columns: [
      'level',
      'indian_army_unit',
      'chinese_army_equivalent',
      'chinese_name',
      'size_troops',
      'notes'
    ]
  },
  {
    sheet: '12_Theater_Capabilities',
    table: 'theater_capabilities',
    columns: [
      'side',
      'theater_command',
      'hq_location',
      'latitude',
      'longitude',
      'group_armies_under_it',
      'combat_power_focus',
      'key_capabilities',
      'area_of_responsibility',
      'special_units_notes'
    ]
  },
  {
    sheet: '13_Unit_Categories',
    table: 'unit_categories',
    columns: [
      'side',
      'category',
      'description',
      'training_level',
      'equipment_level',
      'manning_level',
      'readiness',
      'deployment_time',
      'us_equivalent',
      'percent_of_force',
      'notes'
    ]
  },
  {
    sheet: '14_Advanced_Technology',
    table: 'advanced_technology',
    columns: [
      'side',
      'technology_domain',
      'system_name',
      'description',
      'range_capability',
      'status_2025',
      'strategic_impact',
      'notes'
    ]
  },
  {
    sheet: '16_Aviation_Detailed',
    table: 'aviation_detailed',
    columns: [
      'side',
      'helicopter',
      'variant',
      'type_role',
      'manufacturer',
      'based_on',
      'first_flight',
      'service_entry',
      'status',
      'total_built',
      'unit_cost',
      'crew',
      'passengers_troops',
      'length',
      'rotor_diameter',
      'height',
      'empty_weight',
      'max_weight',
      'max_speed',
      'range_km',
      'service_ceiling',
      'rate_of_climb',
      'armament',
      'notes'
    ]
  },
  {
    sheet: '17_Air_Defence_Detailed',
    table: 'air_defence_detailed',
    columns: [
      'side',
      'system',
      'type_category',
      'based_on',
      'service_entry',
      'status',
      'export_name',
      'missile_munition_length',
      'missile_munition_diameter',
      'missile_munition_weight',
      'launcher_config',
      'radar',
      'range_km',
      'altitude',
      'radar_range',
      'engagement_time',
      'speed',
      'gun_caliber',
      'gun_rate',
      'notes'
    ]
  }
];

function normalizeValue(value) {
  if (value === null || value === undefined) {
    return null;
  }

  const text = String(value).trim();

  if (
    text === '' ||
    text === '-' ||
    text === '—' ||
    text.toLowerCase() === 'n/a'
  ) {
    return null;
  }

  return text;
}

function readRows(workbook, sheetName) {
  const worksheet = workbook.Sheets[sheetName];

  if (!worksheet) {
    throw new Error(`Workbook sheet not found: ${sheetName}`);
  }

  const rows = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    defval: null,
    raw: false
  });

  return rows.slice(2).filter(row => {
    if (!Array.isArray(row)) {
      return false;
    }

    const populatedCells = row.filter(
      value => normalizeValue(value) !== null
    ).length;

    return populatedCells >= 2;
  });
}

async function importWorkbook() {
  const workbook = XLSX.readFile(WORKBOOK_PATH);
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    for (const mapping of SHEET_MAPPINGS) {
      const rows = readRows(workbook, mapping.sheet);

      await client.query(
        `TRUNCATE TABLE "${mapping.table}"
         RESTART IDENTITY CASCADE`
      );

      const columnList = mapping.columns
        .map(column => `"${column}"`)
        .join(', ');

      const placeholders = mapping.columns
        .map((_, index) => `$${index + 1}`)
        .join(', ');

      const insertSql = `
        INSERT INTO "${mapping.table}"
          (${columnList})
        VALUES
          (${placeholders})
      `;

      for (const row of rows) {
        const values = mapping.columns.map(
          (_, index) => normalizeValue(row[index])
        );

        await client.query(insertSql, values);
      }

      console.log(
        `${mapping.table}: imported ${rows.length} rows`
      );
    }

    await client.query('COMMIT');
    console.log('Excel import completed successfully.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Import failed:', error.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

importWorkbook();
