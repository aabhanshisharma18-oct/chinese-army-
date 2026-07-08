/**
 * Response formatter for Angular compatibility
 * Converts PostgreSQL row format to match Excel JSON array-of-arrays format
 * This preserves frontend compatibility without component changes
 */

// Column order mappings for each table (must match Excel sheet column order)
const COLUMN_ORDERS = {
  land_units: [
    'side', 'formation_unit_name', 'formation_unit_type', 
    'formation_unit_parent_name', 'standard_unit_formation', 
    'unit_potential_troops', 'location_name', 'latitude', 'longitude'
  ],
  arm_types: [
    'number', 'combat_arm_type_chinese', 'combat_arm_type_english',
    'primary_role', 'classification_mobility', 'classification_combat_role',
    'training_category', 'indian_army_equivalent', 'terrain_specialisation'
  ],
  weapon_categories: [
    'side', 'arm_type', 'weapon_category', 'sub_category', 'weapon_name',
    'designation', 'caliber', 'range_km', 'type_guidance', 'role_capability',
    'weight', 'main_gun_notes'
  ],
  weapon_sensors: [
    'side', 'type', 'weapon_sensor_name', 'sub_type', 'detection_range_km',
    'engagement_range_km', 'altitude_depth', 'guidance_sensor',
    'lat_location', 'name_location', 'oli'
  ],
  land_unit_resources: [
    'side', 'brigade_unit_type', 'personnel', 'tanks', 'ifvs_apcs',
    'sph_artillery', 'mlrs', 'aa_sam_systems', 'helicopters', 'atgms',
    'trucks_logistics', 'detection_range_km', 'engagement_range_km',
    'speed_day', 'speed_night', 'frontage_defensive', 'frontage_offensive',
    'depth', 'a_vehicle', 'b_vehicle', 'force_potential'
  ],
  vehicle_speeds: [
    'side', 'vehicle_category', 'vehicle_system', 'designation',
    'road_speed_day', 'road_speed_night', 'cross_country_day',
    'cross_country_night', 'amphibious_water_speed', 'operational_range_km', 'notes'
  ],
  frontage_depth: [
    'side', 'unit_level', 'operation_type', 'zone', 'frontage_km',
    'depth_km', 'brigade_density', 'key_weapons_notes'
  ],
  force_potential: [
    'side', 'category', 'metric_system', 'value', 'global_rank', 'comparison_notes'
  ],
  vehicle_designations: [
    'side', 'family', 'designation', 'full_chinese_name', 'a_or_b_type',
    'vehicle_type', 'role', 'weight', 'main_armament', 'road_speed',
    'range_km', 'amphibious', 'crew', 'troops', 'notes'
  ],
  ranks: [
    'side', 'rank_category', 'english_rank', 'chinese_characters',
    'chinese_pinyin', 'nato_equivalent', 'notes'
  ],
  india_china_comparison: [
    'level', 'indian_army_unit', 'chinese_army_equivalent', 'chinese_name',
    'size_troops', 'notes'
  ],
  theater_capabilities: [
    'side', 'theater_command', 'hq_location', 'latitude', 'longitude',
    'group_armies_under_it', 'combat_power_focus', 'key_capabilities',
    'area_of_responsibility', 'special_units_notes'
  ],
  unit_categories: [
    'side', 'category', 'description', 'training_level', 'equipment_level',
    'manning_level', 'readiness', 'deployment_time', 'us_equivalent',
    'percent_of_force', 'notes'
  ],
  advanced_technology: [
    'side', 'technology_domain', 'system_name', 'description',
    'range_capability', 'status_2025', 'strategic_impact', 'notes'
  ],
  aviation_detailed: [
    'side', 'helicopter', 'variant', 'type_role', 'manufacturer',
    'based_on', 'first_flight', 'service_entry', 'status', 'total_built',
    'unit_cost', 'crew', 'passengers_troops', 'length', 'rotor_diameter',
    'height', 'empty_weight', 'max_weight', 'max_speed', 'range_km',
    'service_ceiling', 'rate_of_climb', 'armament', 'notes'
  ],
  air_defence_detailed: [
    'side', 'system', 'type_category', 'based_on', 'service_entry',
    'status', 'export_name', 'missile_munition_length', 'missile_munition_diameter',
    'missile_munition_weight', 'launcher_config', 'radar', 'range_km',
    'altitude', 'radar_range', 'engagement_time', 'speed', 'gun_caliber',
    'gun_rate', 'notes'
  ]
};

/**
 * Format PostgreSQL rows to array-of-arrays format matching Excel JSON
 * Includes title row and header row to match Angular's parsing expectations
 * @param {Array} rows - PostgreSQL row objects
 * @param {String} tableName - Table name for column order lookup
 * @param {String} title - Title for the sheet
 * @returns {Array} - Array of arrays in Excel format [title, headers, data...]
 */
function formatToExcelArray(rows, tableName, title) {
  const columnOrder = COLUMN_ORDERS[tableName];
  
  if (!columnOrder) {
    console.warn(`No column order found for table: ${tableName}, returning raw rows`);
    return rows;
  }
  
  // Build title row (with nulls for remaining columns)
  const titleRow = [title, ...Array(columnOrder.length - 1).fill(null)];
  
  // Build header row (column names converted to readable format)
  const headerRow = columnOrder.map(col => 
    col.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  );
  
  // Build data rows
  const dataRows = rows.map(row => {
    return columnOrder.map(col => {
      const value = row[col];
      // Convert null to null (not undefined)
      return value === null || value === undefined ? null : value;
    });
  });
  
  // Return full format: [title row, header row, data rows...]
  return [titleRow, headerRow, ...dataRows];
}

/**
 * Format response with title row and header row (full Excel format)
 * @param {Array} rows - PostgreSQL row objects
 * @param {String} tableName - Table name
 * @param {String} title - Title for the sheet
 * @returns {Array} - Full Excel format with title and headers
 */
function formatFullExcelResponse(rows, tableName, title) {
  const columnOrder = COLUMN_ORDERS[tableName];
  
  if (!columnOrder) {
    console.warn(`No column order found for table: ${tableName}, returning raw rows`);
    return rows;
  }
  
  const dataRows = formatToExcelArray(rows, tableName);
  
  // Build full Excel format: [title row, header row, data rows...]
  const titleRow = [title];
  const headerRow = columnOrder.map(col => 
    col.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  );
  
  return [titleRow, headerRow, ...dataRows];
}

module.exports = {
  formatToExcelArray,
  formatFullExcelResponse,
  COLUMN_ORDERS
};
