export interface Formation {
  id: string;
  name: string;
  tagline: string;
  quickSpecs: QuickSpec[];
  fullSpecs: FullSpec;
  video: string;
  category: FormationCategory;
}

export interface QuickSpec {
  label: string;
  value: string;
}

export interface FullSpec {
  commandStructure: CommandStructure;
  areaOfResponsibility: AreaOfResponsibility;
  subordinateUnits: SubordinateUnit[];
  equipmentOverview: EquipmentOverview;
  readiness: ReadinessIndicators;
  role: string;
  commandRelationships: string[];
  supportAssets: string[];
  notes: string;
  sourceReferences: string[];
}

export interface CommandStructure {
  headquarters: string;
  commander: string;
  deputyCommander: string;
  chiefOfStaff: string;
}

export interface AreaOfResponsibility {
  region: string;
  borders: string[];
  strategicImportance: string;
}

export interface SubordinateUnit {
  designation: string;
  type: string;
  strength: string;
  location: string;
}

export interface EquipmentOverview {
  mainBattleTanks: string;
  armoredVehicles: string;
  artillery: string;
  airDefense: string;
  aircraft: string;
  navalAssets?: string;
}

export interface ReadinessIndicators {
  trainingLevel: string;
  modernizationStatus: string;
  deploymentReadiness: string;
  exerciseFrequency: string;
}

export interface FormationCategory {
  type: string;
  designation: string;
}
