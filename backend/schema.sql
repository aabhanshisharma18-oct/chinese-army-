-- PLA Command Atlas Database Schema
-- PostgreSQL schema for Excel sheet data migration

-- Land Units (Sheet 1)
CREATE TABLE IF NOT EXISTS land_units (
    id SERIAL PRIMARY KEY,
    side VARCHAR(50) NOT NULL,
    formation_unit_name VARCHAR(255) NOT NULL,
    formation_unit_type VARCHAR(255),
    formation_unit_parent_name VARCHAR(255),
    standard_unit_formation VARCHAR(100),
    unit_potential_troops VARCHAR(100),
    location_name VARCHAR(255),
    latitude TEXT,
    longitude TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Arm Types (Sheet 2)
CREATE TABLE IF NOT EXISTS arm_types (
    id SERIAL PRIMARY KEY,
    number INTEGER,
    combat_arm_type_chinese VARCHAR(255),
    combat_arm_type_english VARCHAR(255) NOT NULL,
    primary_role VARCHAR(255),
    classification_mobility VARCHAR(100),
    classification_combat_role VARCHAR(100),
    training_category VARCHAR(100),
    indian_army_equivalent VARCHAR(255),
    terrain_specialisation VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Weapon Categories (Sheet 3)
CREATE TABLE IF NOT EXISTS weapon_categories (
    id SERIAL PRIMARY KEY,
    side VARCHAR(50),
    arm_type VARCHAR(255),
    weapon_category VARCHAR(255),
    sub_category VARCHAR(255),
    weapon_name VARCHAR(255) NOT NULL,
    designation VARCHAR(255),
    caliber VARCHAR(100),
    range_km VARCHAR(100),
    type_guidance VARCHAR(255),
    role_capability VARCHAR(255),
    weight VARCHAR(100),
    main_gun_notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Weapon Sensors (Sheet 4)
CREATE TABLE IF NOT EXISTS weapon_sensors (
    id SERIAL PRIMARY KEY,
    side VARCHAR(50),
    type VARCHAR(100),
    weapon_sensor_name VARCHAR(255) NOT NULL,
    sub_type VARCHAR(255),
    detection_range_km VARCHAR(100),
    engagement_range_km VARCHAR(100),
    altitude_depth VARCHAR(100),
    guidance_sensor VARCHAR(255),
    lat_location TEXT,
    name_location VARCHAR(255),
    oli VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Land Unit Resources (Sheet 5)
CREATE TABLE IF NOT EXISTS land_unit_resources (
    id SERIAL PRIMARY KEY,
    side VARCHAR(50),
    brigade_unit_type VARCHAR(255) NOT NULL,
    personnel VARCHAR(100),
    tanks VARCHAR(100),
    ifvs_apcs VARCHAR(100),
    sph_artillery VARCHAR(100),
    mlrs VARCHAR(100),
    aa_sam_systems VARCHAR(100),
    helicopters VARCHAR(100),
    atgms VARCHAR(100),
    trucks_logistics VARCHAR(100),
    detection_range_km VARCHAR(100),
    engagement_range_km VARCHAR(100),
    speed_day VARCHAR(100),
    speed_night VARCHAR(100),
    frontage_defensive VARCHAR(100),
    frontage_offensive VARCHAR(100),
    depth VARCHAR(100),
    a_vehicle VARCHAR(100),
    b_vehicle VARCHAR(100),
    force_potential VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Vehicle Speeds (Sheet 6)
CREATE TABLE IF NOT EXISTS vehicle_speeds (
    id SERIAL PRIMARY KEY,
    side VARCHAR(50),
    vehicle_category VARCHAR(255),
    vehicle_system VARCHAR(255) NOT NULL,
    designation VARCHAR(255),
    road_speed_day VARCHAR(100),
    road_speed_night VARCHAR(100),
    cross_country_day VARCHAR(100),
    cross_country_night VARCHAR(100),
    amphibious_water_speed VARCHAR(100),
    operational_range_km VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Frontage Depth (Sheet 7)
CREATE TABLE IF NOT EXISTS frontage_depth (
    id SERIAL PRIMARY KEY,
    side VARCHAR(50),
    unit_level VARCHAR(255),
    operation_type VARCHAR(100),
    zone VARCHAR(255),
    frontage_km VARCHAR(100),
    depth_km VARCHAR(100),
    brigade_density VARCHAR(100),
    key_weapons_notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Force Potential (Sheet 8)
CREATE TABLE IF NOT EXISTS force_potential (
    id SERIAL PRIMARY KEY,
    side VARCHAR(50),
    category VARCHAR(255),
    metric_system VARCHAR(255) NOT NULL,
    value TEXT,
    global_rank VARCHAR(100),
    comparison_notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Vehicle Designations (Sheet 9)
CREATE TABLE IF NOT EXISTS vehicle_designations (
    id SERIAL PRIMARY KEY,
    side VARCHAR(50),
    family VARCHAR(255),
    designation VARCHAR(255) NOT NULL,
    full_chinese_name VARCHAR(255),
    a_or_b_type VARCHAR(50),
    vehicle_type VARCHAR(255),
    role VARCHAR(255),
    weight VARCHAR(100),
    main_armament VARCHAR(255),
    road_speed VARCHAR(100),
    range_km VARCHAR(100),
    amphibious VARCHAR(50),
    crew VARCHAR(100),
    troops VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Ranks (Sheet 10)
CREATE TABLE IF NOT EXISTS ranks (
    id SERIAL PRIMARY KEY,
    side VARCHAR(50),
    rank_category VARCHAR(100),
    english_rank VARCHAR(255) NOT NULL,
    chinese_characters VARCHAR(255),
    chinese_pinyin VARCHAR(255),
    nato_equivalent VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- India China Comparison (Sheet 11)
CREATE TABLE IF NOT EXISTS india_china_comparison (
    id SERIAL PRIMARY KEY,
    level VARCHAR(100),
    indian_army_unit VARCHAR(255) NOT NULL,
    chinese_army_equivalent VARCHAR(255),
    chinese_name VARCHAR(255),
    size_troops VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Theater Capabilities (Sheet 12)
CREATE TABLE IF NOT EXISTS theater_capabilities (
    id SERIAL PRIMARY KEY,
    side VARCHAR(50),
    theater_command VARCHAR(255) NOT NULL,
    hq_location VARCHAR(255),
    latitude TEXT,
    longitude TEXT,
    group_armies_under_it VARCHAR(255),
    combat_power_focus VARCHAR(255),
    key_capabilities TEXT,
    area_of_responsibility TEXT,
    special_units_notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Unit Categories (Sheet 13)
CREATE TABLE IF NOT EXISTS unit_categories (
    id SERIAL PRIMARY KEY,
    side VARCHAR(50),
    category VARCHAR(255),
    description TEXT,
    training_level VARCHAR(100),
    equipment_level VARCHAR(100),
    manning_level VARCHAR(100),
    readiness VARCHAR(100),
    deployment_time VARCHAR(100),
    us_equivalent VARCHAR(255),
    percent_of_force VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Advanced Technology (Sheet 14)
CREATE TABLE IF NOT EXISTS advanced_technology (
    id SERIAL PRIMARY KEY,
    side VARCHAR(50),
    technology_domain VARCHAR(255),
    system_name VARCHAR(255) NOT NULL,
    description TEXT,
    range_capability VARCHAR(255),
    status_2025 VARCHAR(100),
    strategic_impact TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Aviation Detailed (Sheet 16)
CREATE TABLE IF NOT EXISTS aviation_detailed (
    id SERIAL PRIMARY KEY,
    side VARCHAR(50),
    helicopter VARCHAR(255) NOT NULL,
    variant VARCHAR(255),
    type_role VARCHAR(255),
    manufacturer VARCHAR(255),
    based_on VARCHAR(255),
    first_flight VARCHAR(100),
    service_entry VARCHAR(100),
    status VARCHAR(100),
    total_built VARCHAR(100),
    unit_cost VARCHAR(100),
    crew VARCHAR(100),
    passengers_troops VARCHAR(100),
    length VARCHAR(100),
    rotor_diameter VARCHAR(100),
    height VARCHAR(100),
    empty_weight VARCHAR(100),
    max_weight VARCHAR(100),
    max_speed VARCHAR(100),
    range_km VARCHAR(100),
    service_ceiling VARCHAR(100),
    rate_of_climb VARCHAR(100),
    armament TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Air Defence Detailed (Sheet 17)
CREATE TABLE IF NOT EXISTS air_defence_detailed (
    id SERIAL PRIMARY KEY,
    side VARCHAR(50),
    system VARCHAR(255) NOT NULL,
    type_category VARCHAR(255),
    based_on VARCHAR(255),
    service_entry VARCHAR(100),
    status VARCHAR(100),
    export_name VARCHAR(255),
    missile_munition_length VARCHAR(100),
    missile_munition_diameter VARCHAR(100),
    missile_munition_weight VARCHAR(100),
    launcher_config VARCHAR(255),
    radar VARCHAR(255),
    range_km VARCHAR(100),
    altitude VARCHAR(100),
    radar_range VARCHAR(100),
    engagement_time VARCHAR(100),
    speed VARCHAR(100),
    gun_caliber VARCHAR(100),
    gun_rate VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_land_units_type ON land_units(formation_unit_type);
CREATE INDEX IF NOT EXISTS idx_land_units_parent ON land_units(formation_unit_parent_name);
CREATE INDEX IF NOT EXISTS idx_weapon_categories_name ON weapon_categories(weapon_name);
CREATE INDEX IF NOT EXISTS idx_theater_capabilities_command ON theater_capabilities(theater_command);
CREATE INDEX IF NOT EXISTS idx_ranks_category ON ranks(rank_category);
