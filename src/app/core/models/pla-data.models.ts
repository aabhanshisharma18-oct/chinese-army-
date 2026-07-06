export interface PlaUnit {
  id: string;
  name: string;
  headquarters: string;
  theaterCommand: 'Eastern' | 'Southern' | 'Western' | 'Northern' | 'Central';
  commander: string;
  strength: string;
  role: string;
  readiness: number; // Percentage 0 - 100
  subordinateBrigades: string[];
  primaryEquipment: string[];
  notes: string;
  coordinates: string;
}

export interface PlaType {
  id: string;
  name: string;
  description: string;
  mobility: 'Tracked' | 'Wheeled' | 'High-Mobility' | 'Amphibious' | 'Rotary-Wing' | 'Static';
  coreAssets: string[];
  tacticalMobility: string;
  readiness: number;
}

export interface PlaCategory {
  id: string;
  name: string;
  description: string;
  echelon: string;
  activeBrigadesCount: number;
}

export interface PlaWeapon {
  id: string;
  name: string;
  type: 'Weapon' | 'Sensor' | 'Integrated System';
  functionalCategory: 'Armored Combat' | 'Artillery' | 'Aviation' | 'Air Defense' | 'Sensors';
  armament: string;
  effectiveRange: string;
  telemetrySpecs: { label: string; value: string }[];
  description: string;
  readiness: number;
}

export interface PlaResource {
  id: string;
  name: string;
  resourceType: 'Training Ground' | 'Logistics Hub' | 'Aviation Base' | 'Ammunition Depot' | 'Maintenance Center';
  location: string;
  strategicFunction: string;
  capacityStatus: string;
  coordinates: string;
  readiness: number;
  description: string;
}

export interface HierarchyNode {
  id: string;
  label: string;
  type: 'cmc' | 'hq' | 'theater' | 'group-army' | 'brigade';
  parentId?: string;
  details?: {
    headquarters?: string;
    commander?: string;
    role?: string;
    status?: string;
    subordinatesCount?: number;
  };
  children?: HierarchyNode[];
}
