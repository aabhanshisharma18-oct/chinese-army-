import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PlaUnit, PlaType, PlaCategory, PlaWeapon, PlaResource, HierarchyNode } from '../models/pla-data.models';

@Injectable({
  providedIn: 'root'
})
export class PlaDataService {
  // 1. LAND UNITS DATA
  private units: PlaUnit[] = [
    {
      id: 'unit-71',
      name: '71st Group Army',
      headquarters: 'Xuzhou, Jiangsu Province',
      theaterCommand: 'Eastern',
      commander: 'Major General Wang Jiemin',
      strength: 'Approx. 45,000 personnel',
      role: 'Heavy/Medium maneuver operations, secondary reinforcement for coastal assault operations, Taiwan Strait contingencies.',
      readiness: 94,
      subordinateBrigades: [
        '2nd Heavy Combined Arms Brigade',
        '35th Medium Combined Arms Brigade',
        '160th Light Combined Arms Brigade',
        '236th Amphibious Combined Arms Brigade',
        '71st Artillery Brigade',
        '71st Air Defense Brigade',
        '71st Special Operations Brigade',
        '71st Army Aviation Brigade'
      ],
      primaryEquipment: [
        'Type-99A Main Battle Tank',
        'ZBD-04A Infantry Fighting Vehicle',
        'PHL-16 Multiple Launch Rocket System',
        'HQ-17A Field Air Defense System'
      ],
      notes: 'Acts as the primary heavy-armored strike force of the Eastern Theater Command. Highly modernized and regularly conducts amphibious transit exercises.',
      coordinates: '34.26° N, 117.18° E'
    },
    {
      id: 'unit-72',
      name: '72nd Group Army',
      headquarters: 'Huzhou, Zhejiang Province',
      theaterCommand: 'Eastern',
      commander: 'Major General Zhang Fan',
      strength: 'Approx. 42,000 personnel',
      role: 'Primary amphibious invasion force, littoral maneuver operations, and cross-strait power projection.',
      readiness: 96,
      subordinateBrigades: [
        '1st Amphibious Combined Arms Brigade',
        '124th Amphibious Combined Arms Brigade',
        '5th Heavy Combined Arms Brigade',
        '10th Medium Combined Arms Brigade',
        '72nd Artillery Brigade',
        '72nd Air Defense Brigade',
        '72nd Army Aviation Brigade'
      ],
      primaryEquipment: [
        'ZTD-05 Amphibious Assault Vehicle',
        'ZBD-05 Amphibious IFV',
        'Type-96B Main Battle Tank',
        'PCL-181 155mm Truck-Mounted Howitzer'
      ],
      notes: 'Specialized in amphibious combat and beachhead establishment. Possesses the highest concentration of amphibious armored vehicles in the PLA.',
      coordinates: '30.87° N, 120.09° E'
    },
    {
      id: 'unit-73',
      name: '73rd Group Army',
      headquarters: 'Xiamen, Fujian Province',
      theaterCommand: 'Eastern',
      commander: 'Major General Lin Qingsen',
      strength: 'Approx. 40,000 personnel',
      role: 'Frontline amphibious assault force directly facing the Taiwan Strait. Terrain-specific coastal landing operations.',
      readiness: 98,
      subordinateBrigades: [
        '86th Amphibious Combined Arms Brigade',
        '91st Amphibious Combined Arms Brigade',
        '14th Heavy Combined Arms Brigade',
        '73rd Artillery Brigade',
        '73rd Air Defense Brigade',
        '73rd Special Operations Brigade',
        '73rd Army Aviation Brigade'
      ],
      primaryEquipment: [
        'ZTD-05 Amphibious Assault Vehicle',
        'ZBD-05 Amphibious IFV',
        'Type-08 Wheeled IFV Family',
        'HJ-10 Anti-Tank Missile Carrier'
      ],
      notes: 'Stationed closest to the Taiwan Strait. Fully focused on littoral assault training, urban warfare simulation, and joint landing drills.',
      coordinates: '24.48° N, 118.08° E'
    },
    {
      id: 'unit-74',
      name: '74th Group Army',
      headquarters: 'Huizhou, Guangdong Province',
      theaterCommand: 'Southern',
      commander: 'Major General Deng Xiaobin',
      strength: 'Approx. 38,000 personnel',
      role: 'Amphibious and air-assault power projection targeting the South China Sea islands and secondary landing vectors.',
      readiness: 91,
      subordinateBrigades: [
        '154th Amphibious Combined Arms Brigade',
        '163rd Heavy Combined Arms Brigade',
        '1st Medium Combined Arms Brigade',
        '74th Artillery Brigade',
        '74th Air Defense Brigade',
        '74th Special Operations Brigade',
        '74th Army Aviation Brigade'
      ],
      primaryEquipment: [
        'ZTD-05 Amphibious Assault Vehicle',
        'Type-96A Main Battle Tank',
        'ZBL-08 Wheeled IFV',
        'Z-10 Attack Helicopter'
      ],
      notes: 'Operates extensively in tropical environments and conducts frequent island-breaching exercises in coordination with the Southern Theater Navy.',
      coordinates: '23.11° N, 114.41° E'
    },
    {
      id: 'unit-75',
      name: '75th Group Army',
      headquarters: 'Kunming, Yunnan Province',
      theaterCommand: 'Southern',
      commander: 'Major General Zhao Yongheng',
      strength: 'Approx. 40,000 personnel',
      role: 'Jungle warfare, mountain operations along the southern borders, air-assault and fast-insertion tactics.',
      readiness: 89,
      subordinateBrigades: [
        '121st Air Assault Brigade',
        '31st Light Combined Arms Brigade',
        '42nd Heavy Combined Arms Brigade',
        '75th Artillery Brigade',
        '75th Air Defense Brigade',
        '75th Special Operations Brigade (Jungle Tigers)'
      ],
      primaryEquipment: [
        'CSK-181 Mengshi Light Tactical Vehicles',
        'Z-20 Utility Helicopter',
        'Z-8L Wide-body Transport Helicopter',
        'PCL-161 122mm Truck-Mounted Howitzer'
      ],
      notes: 'Hosts the PLA\'s premier Air Assault Brigade, capable of rapid vertical envelopment and air-mobile tactical maneuvers.',
      coordinates: '25.04° N, 102.71° E'
    },
    {
      id: 'unit-76',
      name: '76th Group Army',
      headquarters: 'Xining, Qinghai Province',
      theaterCommand: 'Western',
      commander: 'Major General Wang Kang',
      strength: 'Approx. 35,000 personnel',
      role: 'High-altitude desert, alpine plateau warfare, and strategic reserve for the western borders.',
      readiness: 93,
      subordinateBrigades: [
        '182nd Heavy Combined Arms Brigade',
        '56th Light Combined Arms (Mountain) Brigade',
        '62nd Heavy Combined Arms Brigade',
        '76th Artillery Brigade',
        '76th Air Defense Brigade',
        '76th Army Aviation Brigade'
      ],
      primaryEquipment: [
        'Type-99A Main Battle Tank',
        'Type-15 Light Tank',
        'ZBD-04A Infantry Fighting Vehicle',
        'PCL-181 155mm Howitzer'
      ],
      notes: 'Trained to operate in cold, low-oxygen environments. Equipped with specialized sub-zero engine heaters and alpine breathing kits.',
      coordinates: '36.62° N, 101.78° E'
    },
    {
      id: 'unit-77',
      name: '77th Group Army',
      headquarters: 'Chengdu, Sichuan Province',
      theaterCommand: 'Western',
      commander: 'Major General Li Xiaofeng',
      strength: 'Approx. 37,000 personnel',
      role: 'High-altitude mountain warfare, rapid border deployment, and joint fire strike coordination along the Himalayan sector.',
      readiness: 92,
      subordinateBrigades: [
        '139th Heavy Combined Arms Brigade',
        '150th Light Combined Arms Brigade',
        '181st Medium Combined Arms Brigade',
        '77th Artillery Brigade',
        '77th Air Defense Brigade',
        '77th Army Aviation Brigade'
      ],
      primaryEquipment: [
        'Type-15 Light Tank',
        'ZBL-08 Wheeled IFV',
        'PCL-181 155mm Howitzer',
        'Z-20 Utility Helicopter'
      ],
      notes: 'Regularly deployed to forward positions on the Tibetan Plateau. Highly integrated with mountain support elements.',
      coordinates: '30.66° N, 104.06° E'
    },
    {
      id: 'unit-tibet',
      name: 'Tibet Military District',
      headquarters: 'Lhasa, Tibet Autonomous Region',
      theaterCommand: 'Western',
      commander: 'Lieutenant General Wang Kai',
      strength: 'Approx. 30,000 personnel',
      role: 'Frontline border security and high-altitude defensive operations along the Line of Actual Control (LAC).',
      readiness: 97,
      subordinateBrigades: [
        '52nd Mountain Combined Arms Brigade',
        '53rd Mountain Combined Arms Brigade',
        '54th Mountain Combined Arms Brigade',
        '85th Artillery Brigade',
        '85th Air Defense Brigade'
      ],
      primaryEquipment: [
        'Type-15 Light Tank',
        'CSK-181 Mengshi LTV',
        'PCL-181 155mm Howitzer',
        'PHL-16 Multiple Launch Rocket System'
      ],
      notes: 'Directly subordinate to the PLA Ground Forces HQ but under operational control of the Western Theater. Permanently acclimatized to extreme altitudes.',
      coordinates: '29.65° N, 91.12° E'
    }
  ];

  // 2. TYPE DATA
  private types: PlaType[] = [
    {
      id: 'type-heavy',
      name: 'Heavy Combined Arms Brigade',
      description: 'The primary armored strike element of the PLA, heavily tracked and optimized for high-intensity direct-fire battles against equivalent armored forces.',
      mobility: 'Tracked',
      coreAssets: [
        'Type-99A Main Battle Tank',
        'Type-96B Main Battle Tank',
        'ZBD-04A Infantry Fighting Vehicle',
        'PLZ-05 155mm Self-propelled Howitzer'
      ],
      tacticalMobility: 'Low strategic deployability (rail-bound), high local cross-country mobility and battlefield survivability.',
      readiness: 95
    },
    {
      id: 'type-medium',
      name: 'Medium Combined Arms Brigade',
      description: 'A wheeled armored maneuver force designed for high-speed highway mobility, rapid operational deployment, and medium-intensity combat.',
      mobility: 'Wheeled',
      coreAssets: [
        'ZBL-08 Wheeled Infantry Fighting Vehicle',
        'ZTL-11 105mm Mobile Gun System',
        'PLL-09 122mm Self-propelled Howitzer',
        'Type-08 Wheeled Command Vehicle'
      ],
      tacticalMobility: 'High self-deployment capability via road networks, fast tactical maneuvering, vulnerable to heavy anti-armor fires.',
      readiness: 92
    },
    {
      id: 'type-light',
      name: 'Light Combined Arms Brigade',
      description: 'A motorized force based on high-mobility utility vehicles (Mengshi), highly air-transportable and optimized for terrain-versatile, fast-insertion actions.',
      mobility: 'High-Mobility',
      coreAssets: [
        'CSK-181 Mengshi Protected Assault Vehicle',
        'CSK-162 Tactical Reconnaissance Vehicle',
        'PCL-171 122mm Light Truck Howitzer',
        'HJ-11 Anti-Tank Guided Missile System'
      ],
      tacticalMobility: 'Excellent strategic transportability via Y-20 cargo planes. Rapid off-road mobility in mountains, jungles, and marshes.',
      readiness: 90
    },
    {
      id: 'type-amphibious',
      name: 'Amphibious Combined Arms Brigade',
      description: 'Specialist sea-to-land assault brigades trained to launch directly from landing ships miles offshore and breach coastal defenses.',
      mobility: 'Amphibious',
      coreAssets: [
        'ZTD-05 Amphibious Assault Vehicle',
        'ZBD-05 Amphibious Infantry Fighting Vehicle',
        'Z-18F Amphibious Transport Helicopter',
        'Type-726 LCAC Hovercraft'
      ],
      tacticalMobility: 'Specialized beachhead breaching capability. High water speed (up to 25 km/h in water), moderate land protection.',
      readiness: 96
    },
    {
      id: 'type-aviation',
      name: 'Army Aviation Brigade',
      description: 'A rotary-wing air element organic to the Group Army, providing tactical air support, anti-armor strikes, aerial reconnaissance, and air-assault troop transport.',
      mobility: 'Rotary-Wing',
      coreAssets: [
        'Z-10 Dedicated Attack Helicopter',
        'Z-19 Reconnaissance/Attack Helicopter',
        'Z-20 Medium Utility Helicopter',
        'Mi-171 Sh-5 Transport Helicopter'
      ],
      tacticalMobility: 'Extremely high tactical mobility, independent of ground terrain. Restricted by adverse weather conditions and dense air defense nets.',
      readiness: 91
    }
  ];

  // 3. CATEGORY DATA
  private categories: PlaCategory[] = [
    {
      id: 'cat-combined-arms',
      name: 'Combined Arms (Maneuver Force)',
      description: 'The core combat maneuver force combining tanks, infantry, engineers, and support assets into modular, independent brigade echelons.',
      echelon: 'Brigade (Primary operational unit), Group Army (Strategic-tactical command)',
      activeBrigadesCount: 78
    },
    {
      id: 'cat-artillery',
      name: 'Artillery & Fire Strike',
      description: 'Provides long-range saturation fire, precision counter-battery operations, and tactical rocket strikes to support maneuver forces.',
      echelon: 'Brigade (Organic to Group Army and Theater Commands)',
      activeBrigadesCount: 15
    },
    {
      id: 'cat-air-defense',
      name: 'Air Defense & EW',
      description: 'Field air defense assets tasked with protecting ground units from low-altitude helicopters, cruise missiles, drones, and fighter-bombers.',
      echelon: 'Brigade (Organic to Group Army)',
      activeBrigadesCount: 13
    },
    {
      id: 'cat-aviation',
      name: 'Army Aviation (Heliborne)',
      description: 'Integrated rotary-wing assets that carry out vertical assault, armed escort, tactical airlift, and electronic warfare.',
      echelon: 'Brigade / Regiment (Organic to Group Army)',
      activeBrigadesCount: 15
    },
    {
      id: 'cat-special-ops',
      name: 'Special Operations (SOF)',
      description: 'Elite forces specialized in deep reconnaissance, sabotage, target acquisition for long-range fires, and counter-terror operations.',
      echelon: 'Brigade (Organic to Group Army)',
      activeBrigadesCount: 13
    }
  ];

  // 4. WEAPON / SENSOR DATA
  private weapons: PlaWeapon[] = [
    {
      id: 'wep-type-99a',
      name: 'Type-99A Main Battle Tank',
      type: 'Weapon',
      functionalCategory: 'Armored Combat',
      armament: '125mm Smoothbore Gun, 12.7mm Anti-Aircraft MG, 7.62mm Coaxial MG',
      effectiveRange: 'Direct fire: 3,000m. Guided Missile: 5,000m.',
      telemetrySpecs: [
        { label: 'Weight', value: '58 Metric Tons' },
        { label: 'Engine Power', value: '1,500 Horsepower' },
        { label: 'Top Speed', value: '80 km/h (Road), 60 km/h (Off-road)' },
        { label: 'Armor System', value: 'Composite + FY-4 ERA (Explosive Reactive Armor)' },
        { label: 'Special features', value: 'JD-3 Active Laser Self-Defense Weapon' }
      ],
      description: 'The PLA\'s primary third-generation main battle tank. Features advanced fire control, digital battlefield networks, and a laser weapon designed to disrupt enemy optics and blind operators.',
      readiness: 95
    },
    {
      id: 'wep-type-15',
      name: 'Type-15 Light Tank',
      type: 'Weapon',
      functionalCategory: 'Armored Combat',
      armament: '105mm Rifled Gun, 30mm Automatic Grenade Launcher, 5.8mm Coaxial MG',
      effectiveRange: 'Direct fire: 2,500m. Guided Missile: 4,000m.',
      telemetrySpecs: [
        { label: 'Weight', value: '33 Metric Tons' },
        { label: 'Engine Power', value: '1,000 Horsepower (Twin-Turbocharged)' },
        { label: 'Altitude Range', value: 'Tested up to 5,500m elevation' },
        { label: 'Armor System', value: 'Modular Steel + Composite + ERA' },
        { label: 'Special features', value: 'Oxygen generation system for crew and engine' }
      ],
      description: 'Specifically engineered for operations in the rugged Tibetan mountains and southern water networks. Highly agile, air-transportable, and capable of dominating highland terrain where heavy MBTs cannot climb.',
      readiness: 94
    },
    {
      id: 'wep-pcl-181',
      name: 'PCL-181 155mm Self-Propelled Howitzer',
      type: 'Weapon',
      functionalCategory: 'Artillery',
      armament: '155mm L/52 Howitzer barrel',
      effectiveRange: '40km (Conventional), 70km (Rocket-assisted GPS guided), 100km+ (Ramjet experimental)',
      telemetrySpecs: [
        { label: 'Chassis', value: '6x6 Armored Truck' },
        { label: 'Rate of Fire', value: '6 - 8 rounds per minute' },
        { label: 'Deployment Time', value: 'Under 1 minute (semi-automatic spade deployment)' },
        { label: 'Crew Echelon', value: '6 operators in armored cabin' }
      ],
      description: 'The modern workhorse of PLA Group Army artillery brigades. Highly mobile truck chassis allows rapid shoot-and-scoot tactics to evade enemy counter-battery fire.',
      readiness: 93
    },
    {
      id: 'wep-phl-16',
      name: 'PHL-16 Multiple Launch Rocket System',
      type: 'Weapon',
      functionalCategory: 'Artillery',
      armament: '2x5 300mm rocket pods OR 2x4 370mm pods OR 2x 750mm Fire Dragon tactical missile pods',
      effectiveRange: '150km (370mm rocket), 280km - 480km (Fire Dragon 480 Guided Missile)',
      telemetrySpecs: [
        { label: 'Chassis', value: '8x8 High-Mobility Heavy Truck' },
        { label: 'Navigation', value: 'BeiDou satellite guidance + Inertial Navigation' },
        { label: 'Ammunition Reload', value: 'Modular modular swap pods, reload time: 10 mins' },
        { label: 'Precision CEP', value: 'Less than 10 meters at maximum range' }
      ],
      description: 'A long-range precision strike system capable of firing satellite-guided guided rockets and tactical ballistic missiles. Possesses the range to strike targets across the Taiwan Strait directly from mainland China.',
      readiness: 97
    },
    {
      id: 'wep-z-10',
      name: 'Z-10 Attack Helicopter',
      type: 'Weapon',
      functionalCategory: 'Aviation',
      armament: '23mm Chin turret cannon, HJ-10 Anti-Tank Missiles, TY-90 Air-to-Air Missiles, 57mm Rockets',
      effectiveRange: 'HJ-10 ATGM: 10km. Combat radius: 250km.',
      telemetrySpecs: [
        { label: 'Engines', value: '2x WZ-9 Turboshafts (950 kW each)' },
        { label: 'Top Speed', value: '270 km/h' },
        { label: 'Cruising Speed', value: '230 km/h' },
        { label: 'Armor Protection', value: 'Graphene armor panels around cockpit' }
      ],
      description: 'The PLA Ground Forces\' primary dedicated attack helicopter. Optimized for anti-armor operations, close-air support, and low-altitude air defense interception using dedicated air-to-air missiles.',
      readiness: 91
    },
    {
      id: 'sen-type-305a',
      name: 'Type-305A 3D Acquisition Radar',
      type: 'Sensor',
      functionalCategory: 'Sensors',
      armament: 'None (Electromagnetic Emission Array)',
      effectiveRange: 'Instrumented search: 350km. Tracking: 250km against fighter targets.',
      telemetrySpecs: [
        { label: 'Array Type', value: 'Active Electronically Scanned Array (AESA)' },
        { label: 'Frequency Band', value: 'S-band' },
        { label: 'Target Tracking', value: 'Up to 100 targets simultaneously' },
        { label: 'Special features', value: 'Advanced anti-stealth and anti-radiation missile algorithms' }
      ],
      description: 'A highly mobile S-band AESA radar designed to provide 3D early warning and target acquisition. Specifically optimized to detect stealth aircraft and trace tactical ballistic missile trajectories.',
      readiness: 96
    }
  ];

  // 5. LAND UNIT RESOURCES DATA
  private resources: PlaResource[] = [
    {
      id: 'res-zhurihe',
      name: 'Zhurihe Joint Training Base',
      resourceType: 'Training Ground',
      location: 'Inner Mongolia Autonomous Region',
      strategicFunction: 'PLA\'s premier large-scale mock battleground simulating realistic, high-tech joint operations against the elite "195th Blue Force Brigade".',
      capacityStatus: 'Full active operations. Accommodates multi-division joint exercises.',
      coordinates: '42.25° N, 112.90° E',
      readiness: 99,
      description: 'Covering over 1,000 square kilometers, Zhurihe features full-scale mock runways, mock metropolitan streets, simulated command centers, and state-of-the-art laser tracking networks. It is the ultimate testing ground for PLA combat brigade readiness.'
    },
    {
      id: 'res-qingyang',
      name: 'Qingyang High-Altitude Logistics Hub',
      resourceType: 'Logistics Hub',
      location: 'Qinghai Province',
      strategicFunction: 'Pre-positioning and rapid dispersion of high-altitude gear, cold-weather fuel reserves, oxygen supplies, and ammunition for the Western Theater Command.',
      capacityStatus: '75% stock capacity. Fully winterized operations.',
      coordinates: '35.58° N, 102.13° E',
      readiness: 94,
      description: 'A hardened, underground logistics hub capable of rapid rail loading. Houses massive reserves of winter combat gear, customized altitude-resistant vehicle batteries, and high-altitude petroleum products.'
    },
    {
      id: 'res-danzhou',
      name: 'Danzhou Amphibious Training Range',
      resourceType: 'Training Ground',
      location: 'Hainan Island',
      strategicFunction: 'Littoral transit drills, amphibious vehicle launch simulations, and beach obstacle breaching exercises.',
      capacityStatus: 'Active training cycles.',
      coordinates: '19.52° N, 109.15° E',
      readiness: 92,
      description: 'Simulates tropical island environments and fortified coastlines. Extensively used by Southern and Eastern Theater units for realistic sea-crossing maneuvers.'
    },
    {
      id: 'res-chengdu-avi',
      name: 'Chengdu Helicopter Maintenance & Command Depot',
      resourceType: 'Maintenance Center',
      location: 'Sichuan Province',
      strategicFunction: 'Depot-level repairs and engine maintenance for rotary-wing units operating in Tibet and Xinjiang.',
      capacityStatus: 'Operating at peak capacity. Handling heavy turboshaft refits.',
      coordinates: '30.55° N, 103.95° E',
      readiness: 95,
      description: 'Equipped with heavy testing chambers to calibrate helicopter engines for operations above 4,000 meters altitude. Houses composite rotor repair and electronics testing cleanrooms.'
    }
  ];

  // 6. HIERARCHY TREE DATA
  private hierarchyData: HierarchyNode = {
    id: 'cmc',
    label: 'Central Military Commission (CMC)',
    type: 'cmc',
    details: {
      headquarters: 'August 1st Building, Beijing',
      commander: 'President / Chairman of the CMC',
      role: 'Supreme military command organ. Exercises absolute control over all military branches.',
      status: 'ACTIVE - STRATEGIC COMMAND ECHELON'
    },
    children: [
      {
        id: 'plagf-hq',
        label: 'PLA Ground Forces Headquarters',
        type: 'hq',
        parentId: 'cmc',
        details: {
          headquarters: 'Beijing',
          commander: 'General Liu Zhenli',
          role: 'Responsible for training, doctrine, administration, and modernization of all ground forces.',
          status: 'ACTIVE - GROUND FORCES BRANCH HQ'
        },
        children: [
          {
            id: 'etc-gf',
            label: 'Eastern Theater Command Ground Forces',
            type: 'theater',
            parentId: 'plagf-hq',
            details: {
              headquarters: 'Fuzhou, Fujian',
              commander: 'Lieutenant General Kong Jun',
              role: 'Command and control of all ground combat units facing Taiwan and the East China Sea.',
              status: 'ALERT STATE - REGULAR PATROLS'
            },
            children: [
              {
                id: 'etc-71',
                label: '71st Group Army (Xuzhou)',
                type: 'group-army',
                parentId: 'etc-gf',
                details: {
                  headquarters: 'Xuzhou, Jiangsu',
                  commander: 'Major General Wang Jiemin',
                  role: 'Heavy armored maneuver force, strategic reinforcement.',
                  status: 'READY - 94% MOBILIZATION INDEX'
                },
                children: [
                  { id: 'b-71-1', label: '2nd Heavy Combined Arms Brigade', type: 'brigade', parentId: 'etc-71' },
                  { id: 'b-71-2', label: '35th Medium Combined Arms Brigade', type: 'brigade', parentId: 'etc-71' },
                  { id: 'b-71-3', label: '71st Army Aviation Brigade', type: 'brigade', parentId: 'etc-71' }
                ]
              },
              {
                id: 'etc-72',
                label: '72nd Group Army (Huzhou)',
                type: 'group-army',
                parentId: 'etc-gf',
                details: {
                  headquarters: 'Huzhou, Zhejiang',
                  commander: 'Major General Zhang Fan',
                  role: 'Amphibious assault, coastal landing spearhead.',
                  status: 'READY - 96% MOBILIZATION INDEX'
                },
                children: [
                  { id: 'b-72-1', label: '1st Amphibious Combined Arms Brigade', type: 'brigade', parentId: 'etc-72' },
                  { id: 'b-72-2', label: '124th Amphibious Combined Arms Brigade', type: 'brigade', parentId: 'etc-72' },
                  { id: 'b-72-3', label: '72nd Artillery Brigade', type: 'brigade', parentId: 'etc-72' }
                ]
              },
              {
                id: 'etc-73',
                label: '73rd Group Army (Xiamen)',
                type: 'group-army',
                parentId: 'etc-gf',
                details: {
                  headquarters: 'Xiamen, Fujian',
                  commander: 'Major General Lin Qingsen',
                  role: 'Frontline amphibious assault force, urban combat spec.',
                  status: 'ALERT - 98% MOBILIZATION INDEX'
                },
                children: [
                  { id: 'b-73-1', label: '86th Amphibious Combined Arms Brigade', type: 'brigade', parentId: 'etc-73' },
                  { id: 'b-73-2', label: '91st Amphibious Combined Arms Brigade', type: 'brigade', parentId: 'etc-73' },
                  { id: 'b-73-3', label: '73rd Special Operations Brigade', type: 'brigade', parentId: 'etc-73' }
                ]
              }
            ]
          },
          {
            id: 'stc-gf',
            label: 'Southern Theater Command Ground Forces',
            type: 'theater',
            parentId: 'plagf-hq',
            details: {
              headquarters: 'Nanning, Guangxi',
              commander: 'Lieutenant General Hu Zhongqiang',
              role: 'Border security with SE Asia, support for South China Sea maritime claims.',
              status: 'READY - PATROLS ACTIVE'
            },
            children: [
              {
                id: 'stc-74',
                label: '74th Group Army (Huizhou)',
                type: 'group-army',
                parentId: 'stc-gf',
                details: {
                  headquarters: 'Huizhou, Guangdong',
                  commander: 'Major General Deng Xiaobin',
                  role: 'Amphibious and littoral assault force.',
                  status: 'READY - 91% MOBILIZATION INDEX'
                },
                children: [
                  { id: 'b-74-1', label: '154th Amphibious Combined Arms Brigade', type: 'brigade', parentId: 'stc-74' },
                  { id: 'b-74-2', label: '163rd Heavy Combined Arms Brigade', type: 'brigade', parentId: 'stc-74' }
                ]
              },
              {
                id: 'stc-75',
                label: '75th Group Army (Kunming)',
                type: 'group-army',
                parentId: 'stc-gf',
                details: {
                  headquarters: 'Kunming, Yunnan',
                  commander: 'Major General Zhao Yongheng',
                  role: 'Jungle and mountain warfare maneuver force.',
                  status: 'READY - 89% MOBILIZATION INDEX'
                },
                children: [
                  { id: 'b-75-1', label: '121st Air Assault Brigade', type: 'brigade', parentId: 'stc-75' },
                  { id: 'b-75-2', label: '75th Special Operations Brigade', type: 'brigade', parentId: 'stc-75' }
                ]
              }
            ]
          },
          {
            id: 'wtc-gf',
            label: 'Western Theater Command Ground Forces',
            type: 'theater',
            parentId: 'plagf-hq',
            details: {
              headquarters: 'Lanzhou, Gansu',
              commander: 'Lieutenant General Deng Zhiping',
              role: 'Himalayan and high-altitude border operations, Central Asian frontier security.',
              status: 'ALERT STATE - ACTIVE DEFENSE'
            },
            children: [
              {
                id: 'wtc-76',
                label: '76th Group Army (Xining)',
                type: 'group-army',
                parentId: 'wtc-gf',
                details: {
                  headquarters: 'Xining, Qinghai',
                  commander: 'Major General Wang Kang',
                  role: 'High-altitude alpine plateau warfare.',
                  status: 'READY - 93% MOBILIZATION INDEX'
                },
                children: [
                  { id: 'b-76-1', label: '182nd Heavy Combined Arms Brigade', type: 'brigade', parentId: 'wtc-76' },
                  { id: 'b-76-2', label: '56th Light Combined Arms Brigade', type: 'brigade', parentId: 'wtc-76' }
                ]
              },
              {
                id: 'wtc-77',
                label: '77th Group Army (Chengdu)',
                type: 'group-army',
                parentId: 'wtc-gf',
                details: {
                  headquarters: 'Chengdu, Sichuan',
                  commander: 'Major General Li Xiaofeng',
                  role: 'Himalayan border combat, joint fire strike.',
                  status: 'READY - 92% MOBILIZATION INDEX'
                },
                children: [
                  { id: 'b-77-1', label: '139th Heavy Combined Arms Brigade', type: 'brigade', parentId: 'wtc-77' },
                  { id: 'b-77-2', label: '181st Medium Combined Arms Brigade', type: 'brigade', parentId: 'wtc-77' }
                ]
              }
            ]
          }
        ]
      }
    ]
  };

  constructor() {}

  // Get Land Units
  getUnits(): Observable<PlaUnit[]> {
    return of(this.units);
  }

  // Get Types
  getTypes(): Observable<PlaType[]> {
    return of(this.types);
  }

  // Get Categories
  getCategories(): Observable<PlaCategory[]> {
    return of(this.categories);
  }

  // Get Weapons / Sensors
  getWeapons(): Observable<PlaWeapon[]> {
    return of(this.weapons);
  }

  // Get Resources
  getResources(): Observable<PlaResource[]> {
    return of(this.resources);
  }

  // Get Hierarchy Tree
  getHierarchy(): Observable<HierarchyNode> {
    return of(this.hierarchyData);
  }
}
