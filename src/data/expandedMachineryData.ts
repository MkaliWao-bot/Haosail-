import { Product } from '../types/machinery';

import scissorLiftImg from '../assets/images/kenyan_scissor_lift_1794998099950.jpg';
import acRecoveryImg from '../assets/images/kenyan_ac_recovery_1794998099914.jpg';
import diagnosticScannerImg from '../assets/images/kenyan_diagnostic_scanner_1794998100536.jpg';
import dentPullerImg from '../assets/images/kenyan_dent_puller_1794998100584.jpg';
import batteryStarterImg from '../assets/images/kenyan_battery_starter_1794998100951.jpg';
import floorJackImg from '../assets/images/kenyan_floor_jack_1794998102204.jpg';
import transmissionJackImg from '../assets/images/kenyan_transmission_jack_1794998102220.jpg';
import engineCraneImg from '../assets/images/kenyan_engine_crane_1794998102998.jpg';
import mechanicToolsetImg from '../assets/images/kenyan_mechanic_toolset_1794998102227.jpg';
import arcWelderImg from '../assets/images/kenyan_arc_welder_1794998103465.jpg';
import migWelderImg from '../assets/images/kenyan_mig_welder_1794998103841.jpg';
import weldingGeneratorImg from '../assets/images/kenyan_welding_generator_1794998103294.jpg';
import metalLatheImg from '../assets/images/kenyan_metal_lathe_1794998105057.jpg';
import drillPressImg from '../assets/images/kenyan_drill_press_1794998105792.jpg';
import benchGrinderImg from '../assets/images/kenyan_bench_grinder_1794998106344.jpg';
import metalChopSawImg from '../assets/images/kenyan_metal_chopsaw_1794998106305.jpg';
import pipeBenderImg from '../assets/images/kenyan_pipe_bender_1794998106349.jpg';
import roadCutterImg from '../assets/images/kenyan_road_cutter_1794998106727.jpg';
import palletStackerImg from '../assets/images/kenyan_pallet_stacker_1794998107951.jpg';
import dieselForkliftImg from '../assets/images/kenyan_diesel_forklift_1794998107732.jpg';
import riggingHoistImg from '../assets/images/kenyan_rigging_hoist_1794998107838.jpg';
import hingeBorerImg from '../assets/images/kenyan_hinge_borer_1794998108406.jpg';
import widebeltSanderImg from '../assets/images/kenyan_widebelt_sander_1794998108978.jpg';
import comboWoodworkerImg from '../assets/images/kenyan_combo_woodworker_1794998109861.jpg';
import waterPumpImg from '../assets/images/kenyan_water_pump_1794998109052.jpg';
import silentCompressorImg from '../assets/images/kenyan_silent_compressor_1794998110381.jpg';
import rotaryHammerImg from '../assets/images/kenyan_rotary_hammer_1794998110624.jpg';

export const EXPANDED_HAOSAIL_MACHINES: Product[] = [
  // ============================================================================
  // AUTO MAINTENANCE & GARAGE (+9 items -> 21 total)
  // ============================================================================

  // 42. Portable Mid-Rise Scissor Car Lift 3.5T
  {
    id: 'hs-sl-435k',
    sku: 'HS-HSL350C-LFT',
    name: 'Hydraulic Mid-Rise Scissor Car Lift HaoSail HSL-350C (3.5-Ton)',
    subtitle: 'Mobile Electro-Hydraulic Dual-Cylinder Scissor Lift for Tyre, Brake & Body Bays',
    category: 'auto-maintenance',
    categoryLabel: 'Auto Maintenance & Garage',
    subCategory: 'vehicle-lifts',
    subCategoryLabel: 'Vehicle Lifts (2P / 4P / Scissor)',
    price: 435000,
    originalPrice: 485000,
    rating: 4.9,
    reviewsCount: 22,
    inStock: true,
    stockCount: 5,
    freightTier: 'heavy-freight',
    isFreeFreight: true,
    isPopular: true,
    isNewArrival: true,
    powerSource: 'corded-230v',
    image: scissorLiftImg,
    specs: {
      motor: '2.2 kW (3.0 HP) Electro-Hydraulic Power Pack',
      voltage: '230V / 1-Phase / 50Hz',
      amperage: '13.5 Amps',
      capacity: '3,500 kg Lifting Capacity · 1,000 mm Max Rise',
      footprint: '1,980 mm L x 1,760 mm W x 110 mm Min Height',
      weightLbs: 1180,
      warrantyYears: 3,
      rpm: '35-Second Full Rise / Pneumatic Lock Release',
      arborOrSpindle: 'Synchronized Dual Hydraulic Cylinders + Mechanical Safety Teeth',
    },
    description: 'Low-profile mobile scissor car lift built for fast tyre service, suspension work, and panel beating where overhead clearance or slab anchor space is limited. Rolls easily across concrete floors using the integrated caster dolly handle.',
    features: [
      'True 3,500 kg lifting capacity handles sedans, crossovers, and double-cab pickups',
      '110 mm ultra-low collapsed height accommodates low-slung passenger vehicles',
      'Automatic mechanical safety ratchet locks disengage pneumatically on descent',
      'Extendable drive-on approach ramps lock horizontally to extend platform length'
    ],
    includedItems: [
      'HaoSail HSL-350C Dual-Scissor Base Assembly',
      'Mobile Push-Button Control Console with 2.2 kW Hydraulic Unit',
      '4 Heavy-Duty Rubber Lift Spacer Blocks',
      'Mobile Dolly Wheel Kit for Bay Relocation'
    ]
  },

  // 43. Automatic Auto A/C Recovery & Recharging Machine
  {
    id: 'hs-acr-365k',
    sku: 'HS-AC600-R134',
    name: 'Automatic Car A/C Refrigerant Recovery & Recharge Station HaoSail AC-600',
    subtitle: '4-Stage R134a Recovery, Deep Vacuum, Oil Injection & Electronic Scale Charging',
    category: 'auto-maintenance',
    categoryLabel: 'Auto Maintenance & Garage',
    subCategory: 'ac-diagnostics',
    subCategoryLabel: 'A/C Service & Diagnostics',
    price: 365000,
    originalPrice: 410000,
    rating: 4.8,
    reviewsCount: 19,
    inStock: true,
    stockCount: 6,
    freightTier: 'freight-ltl',
    isFreeFreight: true,
    isNewArrival: true,
    powerSource: 'corded-230v',
    image: acRecoveryImg,
    specs: {
      motor: '3/8 HP Hermetic Compressor + Dual-Stage Vacuum Pump',
      voltage: '230V / 1-Phase / 50Hz',
      amperage: '5.5 Amps',
      capacity: '12 kg Internal Refrigerant Tank · 500 g/min Recovery',
      footprint: '560 mm W x 610 mm D x 1,040 mm H',
      weightLbs: 175,
      warrantyYears: 2,
      rpm: '60 L/min Deep Vacuum Pumping Speed',
      arborOrSpindle: 'Load-Cell Digital Scale (+/- 5g Charge Accuracy)',
    },
    description: 'Fully automatic automotive air conditioning service station engineered for Kenyan garages servicing R134a vehicle fleets. Automates refrigerant recovery, moisture separation, leak-testing vacuum hold, PAG oil dosing, and precision recharge.',
    features: [
      'Pre-loaded East African & Japanese/European vehicle refrigerant database',
      'High-accuracy electronic load-cell weighing avoids compressor overcharging',
      'Automated non-condensable gas purge and thermal printer service receipts',
      'Dual color-coded HP/LP glycerin gauges with heavy brass quick-couplers'
    ],
    includedItems: [
      'HaoSail AC-600 Main Console on Locking Casters',
      '3-Metre Red (High) & Blue (Low) SAE R134a Service Hoses',
      'Quick-Connect Brass Manifold Couplers',
      'Built-In Thermal Receipt Printer + 2 Paper Rolls'
    ]
  },

  // 44. Pro Bi-Directional Automotive Diagnostic Scanner
  {
    id: 'hs-obd-68k',
    sku: 'HS-OBD90-PRO',
    name: 'Pro Bi-Directional Automotive Diagnostic Scanner HaoSail HS-OBD90',
    subtitle: '8-Inch Workshop OBD2 Tablet with Full-System ECU Coding & 32 Service Resets',
    category: 'auto-maintenance',
    categoryLabel: 'Auto Maintenance & Garage',
    subCategory: 'ac-diagnostics',
    subCategoryLabel: 'A/C Service & Diagnostics',
    price: 68000,
    originalPrice: 78000,
    rating: 4.9,
    reviewsCount: 34,
    inStock: true,
    stockCount: 15,
    freightTier: 'standard-ground',
    isFreeFreight: false,
    isPopular: true,
    isNewArrival: true,
    powerSource: 'cordless-18v',
    image: diagnosticScannerImg,
    specs: {
      motor: 'Quad-Core Diagnostic Processor · 6,000 mAh Battery',
      voltage: '12V / 24V Vehicle OBDII + USB-C Fast Charge',
      amperage: '1.5 Amps Charging Input',
      capacity: 'Covers 110+ Asian, European & Commercial Brands',
      footprint: '275 mm x 180 mm x 35 mm (Hard Carry Case)',
      weightLbs: 8,
      warrantyYears: 2,
      rpm: 'Real-Time Live Data Graphing (8-Channel PID Stream)',
      arborOrSpindle: 'Bi-Directional Active Tests + ECU Module Coding',
    },
    description: 'Ruggedized workshop OBD2 diagnostic tablet calibrated for popular Kenyan imports including Toyota, Nissan, Subaru, Mazda, Isuzu, Mercedes-Benz, and VW. Performs injector coding, DPF regeneration, ABS bleeding, and throttle adaptation.',
    features: [
      'Full-system scan covering Engine, Transmission, ABS, SRS Airbag, BCM, and Hybrid packs',
      'Bi-directional active component actuation tests pinpoint faulty solenoids fast',
      '32 hot service resets including oil light, EPB brake pad, SAS steering & injector coding',
      'Drop-resistant rubberized casing with foam-lined hard workshop carry trunk'
    ],
    includedItems: [
      'HS-OBD90 8-Inch Diagnostic Tablet',
      'Bluetooth VCI Dongle + Main OBDII 16-Pin Diagnostic Cable',
      'Legacy Toyota 22-Pin / Nissan 14-Pin / BMW 20-Pin Adapter Kit',
      '2 Years Free Software Updates + Padded Carrying Case'
    ]
  },

  // 45. Auto Body Sheet Metal Dent Puller & Spot Welder
  {
    id: 'hs-dp-85k',
    sku: 'HS-DP3500-SPT',
    name: 'Auto Body Dent Puller & Panel Spot Welder HaoSail DP-3500',
    subtitle: '3,500A Digital Collision Panel Repair System with Rolling Tool Trolley',
    category: 'auto-maintenance',
    categoryLabel: 'Auto Maintenance & Garage',
    subCategory: 'collision-repair',
    subCategoryLabel: 'Collision Repair & Frame Pulling',
    price: 85000,
    originalPrice: 98000,
    rating: 4.8,
    reviewsCount: 21,
    inStock: true,
    stockCount: 9,
    freightTier: 'freight-ltl',
    isFreeFreight: false,
    isNewArrival: true,
    powerSource: 'corded-230v',
    image: dentPullerImg,
    specs: {
      motor: 'Copper-Core Resistance Spot Transformer (13 kVA Peak)',
      voltage: '230V / 1-Phase / 50Hz',
      amperage: '32 Amps Breakers Recommended',
      capacity: 'Max 3,500A Output · 0.6 – 1.5 mm Auto Sheet Steel',
      footprint: '620 mm L x 480 mm W x 960 mm H (with Cart)',
      weightLbs: 112,
      warrantyYears: 2,
      rpm: 'Micro-Stepped Weld Timer (0.01s – 0.99s)',
      arborOrSpindle: 'Dual Trigger Gun + Slide Hammer Stud Welder',
    },
    description: 'Compact collision body shop spot-welding dent puller mounted on a rolling steel trolley. Allows panel beaters to pull crumpled door skins, wheel arches, and quarter panels from the exterior without stripping interior trim.',
    features: [
      '7 preset welding modes for triangle washers, wave wire, OT rings, carbon shrinking, and studs',
      'Microprocessor current stabilizer minimizes heat distortion on modern thin body panels',
      'Quick-release pure copper earth clamp ensures crisp spot contact',
      'All-in-one rolling workshop cart stores pull hammers and consumables neatly below'
    ],
    includedItems: [
      'HaoSail DP-3500 Welder Unit + Rolling Shop Trolley',
      'Heavy-Duty Spot Gun with Ergonomic Slide Hammer',
      'Multi-Hook Pulling Claw & Carbon Shrinking Rods',
      'Starter Box of Triangle Pull Washers, Wave Wires & Studs'
    ]
  },

  // 46. Heavy-Duty 12V/24V Battery Charger & Boost Starter
  {
    id: 'hs-bc-24k',
    sku: 'HS-BC600-STR',
    name: 'Commercial 12V/24V Battery Charger & Boost Starter HaoSail BC-600',
    subtitle: 'Wheeled Workshop Copper-Transformer Charger with 600A Cranking Boost',
    category: 'auto-maintenance',
    categoryLabel: 'Auto Maintenance & Garage',
    subCategory: 'lubrication',
    subCategoryLabel: 'Garage Power & Maintenance',
    price: 24000,
    originalPrice: 28500,
    rating: 4.7,
    reviewsCount: 44,
    inStock: true,
    stockCount: 18,
    freightTier: 'standard-ground',
    isFreeFreight: false,
    isNewArrival: true,
    powerSource: 'corded-230v',
    image: batteryStarterImg,
    specs: {
      motor: 'Heavy Copper-Wound Step-Down Rectifier Transformer',
      voltage: '230V Input / 12V & 24V Switchable Output',
      amperage: '90A Fast Charge / 600A Engine Start Boost',
      capacity: 'Supports 40Ah – 900Ah Lead-Acid & Truck Batteries',
      footprint: '340 mm x 290 mm x 640 mm',
      weightLbs: 54,
      warrantyYears: 2,
      rpm: 'Analog Ammeter + Multi-Stage Current Selector',
      arborOrSpindle: 'Overload Thermal Breaker & Reverse Polarity Fuse',
    },
    description: 'High-amperage mobile garage battery charger and engine jump-starter built for service bays, bus depots, and fleet yards. Starts dead 12V petrol cars and 24V diesel trucks directly off mains shop power.',
    features: [
      'Dual 12V and 24V output selector covers passenger cars, tractors, and commercial lorries',
      '600A instant cranking assist revives drained diesel starters in seconds',
      'Oversized insulated brass alligator clamps on heavy 25mm² copper leads',
      'Steel-housing wheeled trolley with rugged rubber tires for outdoor yard mobility'
    ],
    includedItems: [
      'HaoSail BC-600 Charger/Starter Unit',
      '2.5m Positive & Negative Heavy Copper Clamp Cables',
      'Integrated Transport Handle & Rear Rubber Wheels',
      'Spare Overload Blade Fuses'
    ]
  },

  // 47. Dual-Pump Low-Profile Hydraulic Floor Jack 4.0T
  {
    id: 'hs-fj-28k',
    sku: 'HS-FJ4000-LP',
    name: 'Dual-Pump Low-Profile Hydraulic Floor Jack HaoSail FJ-4000 (4.0-Ton)',
    subtitle: 'Quick-Lift Twin-Piston Commercial Trolley Jack with 75–505 mm Lift Range',
    category: 'auto-maintenance',
    categoryLabel: 'Auto Maintenance & Garage',
    subCategory: 'jacks-hoists',
    subCategoryLabel: 'Jacks, Cranes & Tool Sets',
    price: 28000,
    originalPrice: 33000,
    rating: 4.9,
    reviewsCount: 57,
    inStock: true,
    stockCount: 24,
    freightTier: 'standard-ground',
    isFreeFreight: false,
    isPopular: true,
    isNewArrival: true,
    powerSource: 'all',
    image: floorJackImg,
    specs: {
      motor: 'Dual-Piston Quick-Lift Hydraulic Pump Assembly',
      voltage: 'Manual Hydraulic Pump (No Power Required)',
      amperage: 'N/A',
      capacity: '4,000 kg (4.0-Ton) Rated Load Capacity',
      footprint: '745 mm L x 355 mm W · Lift: 75 mm to 505 mm',
      weightLbs: 96,
      warrantyYears: 2,
      rpm: '5-Stroke Full Unloaded Saddle Rise',
      arborOrSpindle: 'Universal-Joint Release Valve + Forged Steel Casters',
    },
    description: 'Heavy-duty 4-tonne dual-pump service trolley jack designed for fast-turnaround Kenyan tyre centers and Land Cruiser / SUV suspension bays. Reaches under 75 mm low bumpers and lifts up to 505 mm in half the strokes of a single-pump jack.',
    features: [
      'Twin hydraulic pistons raise the lift arm to vehicle chassis contact in 3–5 pumps',
      'Wide steel chassis frame and oversized front rollers prevent floor sinking',
      'Foam-bumpered knurled handle protects customer vehicle fenders from scratches',
      'Internal bypass valve prevents hydraulic ram over-travel under load'
    ],
    includedItems: [
      'HaoSail FJ-4000 4-Ton Trolley Jack Chassis',
      '2-Piece Knurled Steel Pump Handle with Protective Foam Sleeve',
      'Replaceable Slotted Rubber Saddle Pad'
    ]
  },

  // 48. Telescopic Hydraulic Transmission Jack 0.6T
  {
    id: 'hs-tj-52k',
    sku: 'HS-TJ600-TEL',
    name: 'Telescopic Hydraulic Transmission Jack HaoSail TJ-600 (0.6-Ton)',
    subtitle: '2-Stage Under-Hoist Foot-Operated Gearbox & Differential Jack (860–1,800 mm)',
    category: 'auto-maintenance',
    categoryLabel: 'Auto Maintenance & Garage',
    subCategory: 'jacks-hoists',
    subCategoryLabel: 'Jacks, Cranes & Tool Sets',
    price: 52000,
    originalPrice: 60000,
    rating: 4.8,
    reviewsCount: 28,
    inStock: true,
    stockCount: 11,
    freightTier: 'freight-ltl',
    isFreeFreight: false,
    isNewArrival: true,
    powerSource: 'all',
    image: transmissionJackImg,
    specs: {
      motor: 'Dual-Stage Chrome-Plated Telescopic Hydraulic Ram',
      voltage: 'Foot-Pedal Hydraulic (No Power Required)',
      amperage: 'N/A',
      capacity: '600 kg (0.6-Ton) Safe Working Load',
      footprint: '600 mm x 600 mm Wide Base · Height: 860–1,800 mm',
      weightLbs: 118,
      warrantyYears: 2,
      rpm: 'Spring-Loaded Dead-Man Slow Descent Knob',
      arborOrSpindle: '4-Way Tilting Saddle with Heavy Safety Restraint Chain',
    },
    description: 'Two-stage vertical telescopic transmission jack engineered for safely removing and installing gearboxes, transfer cases, and differentials underneath a 2-post or 4-post car lift.',
    features: [
      'Hands-free foot-operated pump pedal lets mechanics align bellhousings with both hands',
      '4-way micro-adjustable saddle pitch and roll knobs ensure effortless bolt alignment',
      'Extra-wide 4-leg steel base with heavy 360° swivel casters guarantees under-hoist stability',
      'Integrated heavy steel retention chain locks transmissions securely onto the saddle'
    ],
    includedItems: [
      'HaoSail TJ-600 Telescopic Cylinder Column & Base',
      '4-Way Tiltable Gearbox Saddle with Safety Chain',
      '4 Heavy-Duty Swivel Casters with Hardware'
    ]
  },

  // 49. Folding Hydraulic Workshop Engine Crane 3.0T
  {
    id: 'hs-ec-56k',
    sku: 'HS-EC3000-FLD',
    name: 'Folding Hydraulic Workshop Engine Crane HaoSail EC-3000 (3.0-Ton)',
    subtitle: 'Heavy-Duty 4-Position Telescopic Boom Engine Hoist on 6 Swivel Casters',
    category: 'auto-maintenance',
    categoryLabel: 'Auto Maintenance & Garage',
    subCategory: 'jacks-hoists',
    subCategoryLabel: 'Jacks, Cranes & Tool Sets',
    price: 56000,
    originalPrice: 65000,
    rating: 4.9,
    reviewsCount: 31,
    inStock: true,
    stockCount: 10,
    freightTier: 'freight-ltl',
    isFreeFreight: false,
    isNewArrival: true,
    powerSource: 'all',
    image: engineCraneImg,
    specs: {
      motor: '8-Ton Long-Ram Dual-Action Hydraulic Cylinder',
      voltage: 'Manual Hydraulic Pump (No Power Required)',
      amperage: 'N/A',
      capacity: '3,000 kg Max · 4 Boom Stops (3T / 2T / 1T / 0.75T)',
      footprint: '1,720 mm L x 1,040 mm W · Max Hook Height: 2,380 mm',
      weightLbs: 215,
      warrantyYears: 3,
      rpm: 'Foldable Outrigger Legs for Compact Bay Storage',
      arborOrSpindle: 'Forged Swivel Safety Hook + 6 Heavy Steel Casters',
    },
    description: 'Commercial-grade 3-tonne folding engine crane built to extract heavy SUV diesel engines, gearbox assemblies, and small industrial blocks cleanly from vehicle engine bays.',
    features: [
      '4-position reinforced square-tube boom adjusts reach from 3.0T close-in to 0.75T full reach',
      'Outrigger legs fold upright in seconds to save shop floor space between jobs',
      'Six 360-degree heavy steel casters track smoothly even under full engine load',
      'Slow-release pressure valve provides hairline lowering accuracy during engine mount alignment'
    ],
    includedItems: [
      'HaoSail EC-3000 Folding Steel Crane Frame',
      '8-Ton Heavy-Duty Hydraulic Long Ram',
      'Forged Grade-80 Chain & Swivel Latch Hook'
    ]
  },

  // 50. 186-Piece Cr-V Master Mechanic Tool Set
  {
    id: 'hs-mts-29k',
    sku: 'HS-MTS186-CRV',
    name: '186-Piece Master Mechanic Rolling Tool Case HaoSail MTS-186',
    subtitle: 'Heat-Treated Chrome Vanadium Sockets, Ratchets, Spanners & Pliers in Aluminum Case',
    category: 'auto-maintenance',
    categoryLabel: 'Auto Maintenance & Garage',
    subCategory: 'workshop-storage',
    subCategoryLabel: 'Tool Storage & Cabinets',
    price: 29000,
    originalPrice: 35000,
    rating: 4.8,
    reviewsCount: 62,
    inStock: true,
    stockCount: 30,
    freightTier: 'standard-ground',
    isFreeFreight: false,
    isNewArrival: true,
    powerSource: 'all',
    image: mechanicToolsetImg,
    specs: {
      motor: 'Forged Chrome-Vanadium (Cr-V) Alloy Hand Tools',
      voltage: 'Manual Service Tooling',
      amperage: 'N/A',
      capacity: '186 Pieces across 4 Organized EVA/Molded Trays',
      footprint: '520 mm L x 370 mm W x 230 mm H (Telescopic Trolley)',
      weightLbs: 34,
      warrantyYears: 5,
      rpm: '72-Tooth Reversible Quick-Release Ratchets (1/4" & 1/2")',
      arborOrSpindle: 'Satin-Chrome Anti-Corrosion Metric Sizing (8–32mm)',
    },
    description: 'Complete field-service and workshop mechanic assortment housed in an aluminum-cornered locking trolley case with telescopic pull handle. Pairs cleanly as the full tool loadout for mobile mechanics or HaoSail TC-7D workshop cabinets.',
    features: [
      'Includes 1/4" & 1/2" drive metric sockets, spark plug sockets, extensions, and U-joints',
      'Full set of ratcheting combination ring/open-end spanners, pliers, insulated screwdrivers, and crimpers',
      '4-tier lift-out trays keep every wrench visible so missing tools are spotted immediately',
      'Telescopic luggage handle and smooth-roll wheels simplify roadside rescue calls'
    ],
    includedItems: [
      'Aluminum Lockable Rolling Tool Case with Key Lock',
      '4 Complete Tool Trays (186 Pieces Total)'
    ]
  },

  // ============================================================================
  // WELDING & METALWORKING (NEW DIVISION — 8 items)
  // ============================================================================

  // 51. IGBT Inverter Arc Welder 315A (ZX7-315)
  {
    id: 'hs-zx-24k',
    sku: 'HS-ZX7315-ARC',
    name: 'Industrial IGBT Inverter Arc Welder HaoSail ZX7-315 (315A)',
    subtitle: 'Heavy-Duty MMA Stick Welder with Digital Amp Display, Arc-Force & Anti-Stick',
    category: 'welding-metalworking',
    categoryLabel: 'Welding & Metalworking',
    subCategory: 'welders',
    subCategoryLabel: 'Arc, MIG & Engine Welders',
    price: 24000,
    originalPrice: 29500,
    rating: 4.9,
    reviewsCount: 68,
    inStock: true,
    stockCount: 25,
    freightTier: 'standard-ground',
    isFreeFreight: false,
    isPopular: true,
    isNewArrival: true,
    powerSource: 'corded-230v',
    image: arcWelderImg,
    specs: {
      motor: 'Dual-Module IGBT High-Frequency Inverter Core',
      voltage: '230V / 1-Phase (or Wide 220V–380V Auto-Sense) / 50Hz',
      amperage: '20 – 315 Amps Continuous MMA Output (60% Duty Cycle)',
      capacity: 'Runs 2.5 mm, 3.2 mm & 4.0 mm Welding Rods Continuously',
      footprint: '430 mm L x 205 mm W x 315 mm H',
      weightLbs: 28,
      warrantyYears: 2,
      rpm: 'Hot-Start Ignition + Adjustable Arc Force Dial',
      arborOrSpindle: 'DINSE 35-50 Heavy Quick-Twist Copper Output Terminals',
    },
    description: 'Contractor-grade 315-amp IGBT inverter MMA arc welder built for structural steel gates, window grills, truck bodies, and site fabrication across Kenya. Burns 3.2 mm (G10) and 4.0 mm (G8) rods effortlessly with smooth arc stability.',
    features: [
      'True IGBT inverter technology handles rural voltage drops without tripping breakers',
      'Dedicated Hot-Start and Arc-Force potentiometers prevent electrode sticking on thick steel',
      'Dual high-velocity cooling fans protect internal copper windings during all-day site fabrication',
      'LED digital amperage readout allows accurate current setting for thin sheet or I-beams'
    ],
    includedItems: [
      'HaoSail ZX7-315 Inverter Welder Unit',
      '3m Heavy Copper Electrode Holder Cable + 2m Earth Clamp Lead',
      'Chipping Hammer, Wire Brush & Handheld Welding Shield'
    ]
  },

  // 52. CO2 / MIG-300 Semi-Automatic Industrial Welder
  {
    id: 'hs-mig-125k',
    sku: 'HS-NBC300-MIG',
    name: 'CO2 / MIG-300 Semi-Automatic Industrial Welder HaoSail NBC-300',
    subtitle: 'Separated Wire-Feeder Wheeled MIG/MAG & MMA Fabrication Plant (0.8–1.2 mm Wire)',
    category: 'welding-metalworking',
    categoryLabel: 'Welding & Metalworking',
    subCategory: 'welders',
    subCategoryLabel: 'Arc, MIG & Engine Welders',
    price: 125000,
    originalPrice: 145000,
    rating: 4.9,
    reviewsCount: 23,
    inStock: true,
    stockCount: 7,
    freightTier: 'freight-ltl',
    isFreeFreight: false,
    isPopular: true,
    isNewArrival: true,
    powerSource: '3-phase-400v',
    image: migWelderImg,
    specs: {
      motor: '3-Phase IGBT Industrial Inverter Rectifier (12.6 kVA)',
      voltage: '400V / 3-Phase / 50Hz',
      amperage: '50 – 300 Amps MIG Output (80% Industrial Duty Cycle)',
      capacity: '0.8 / 1.0 / 1.2 mm Solid & Flux-Cored Wire (Up to 20 kg Spool)',
      footprint: '680 mm L x 340 mm W x 920 mm H (with Cylinder Rack)',
      weightLbs: 115,
      warrantyYears: 3,
      rpm: '2.5 – 18 m/min Variable Dual-Roller Wire Feed Speed',
      arborOrSpindle: 'Euro-Connector MB36 MIG Torch + Separated Feeder Cart',
    },
    description: 'High-duty industrial CO2/MIG shield welding system engineered for steel furniture factories, trailer builders, and commercial body shops. Features a detached portable wire-feeder unit so operators can weld up to 5 metres away from the power cabinet.',
    features: [
      'Detached 20 kg wire-feeder trolley extends working radius across long steel trailers',
      'Dual-drive knurled feed rollers eliminate wire bird-nesting on 1.0 mm and 1.2 mm steel wire',
      'Integrated rear cylinder rack with safety chain secures full-size CO2/Argon gas bottles',
      'Switches between continuous MIG seam welding and heavy MMA stick welding'
    ],
    includedItems: [
      'HaoSail NBC-300 Power Source on Wheeled Gas-Cylinder Cart',
      'Separated Industrial Wire Feeder Unit with 5m Control Umbilical',
      '3m MB36 Euro-Style MIG Torch + Heated 36V CO2 Gas Regulator',
      'Heavy-Duty 300A Earth Clamp Lead'
    ]
  },

  // 53. Diesel Welding Generator 220A / 6.5 kVA
  {
    id: 'hs-dwg-155k',
    sku: 'HS-DGW220-ARC',
    name: 'Diesel Engine Welding Generator Set HaoSail DGW-220 (220A / 6.5 kVA)',
    subtitle: '2-in-1 Electric-Start Field Arc Welder & Auxiliary AC Site Generator',
    category: 'welding-metalworking',
    categoryLabel: 'Welding & Metalworking',
    subCategory: 'welders',
    subCategoryLabel: 'Arc, MIG & Engine Welders',
    price: 155000,
    originalPrice: 178000,
    rating: 4.8,
    reviewsCount: 18,
    inStock: true,
    stockCount: 5,
    freightTier: 'freight-ltl',
    isFreeFreight: false,
    isNewArrival: true,
    powerSource: 'corded-230v',
    image: weldingGeneratorImg,
    specs: {
      motor: '12 HP Single-Cylinder 4-Stroke Air-Cooled Diesel Engine',
      voltage: '230V AC Auxiliary (5.0 kW) + 50–220A DC Welding Terminal',
      amperage: '220A Max Welding Current / 22A Auxiliary AC @ 230V',
      capacity: 'Runs up to 4.0 mm Welding Rods + Angle Grinders Off-Grid',
      footprint: '780 mm L x 540 mm W x 660 mm H',
      weightLbs: 265,
      warrantyYears: 2,
      rpm: '3,000 RPM Key-Start with Automatic Low-Oil Shutdown',
      arborOrSpindle: 'Brushless Copper-Wound Dual Welding/AC Alternator',
    },
    description: 'Remote-site diesel welder-generator built for fencing, bridge fabrication, pipeline repairs, and borehole steelwork where mains grid power is absent. Delivers smooth DC welding output alongside 230V power for chop saws and angle grinders.',
    features: [
      'Dual-purpose alternator welds structural steel and powers site grinders simultaneously',
      'Key-turn 12V electric starter makes cold-morning ignition effortless',
      'Heavy tubular steel roll cage with 4 puncture-proof wheels handles rough Kenyan sites',
      'Rotary stepped amperage control ensures consistent penetration across 2.5–4.0 mm rods'
    ],
    includedItems: [
      'HaoSail DGW-220 Diesel Welder Generator Unit',
      '12V Starting Battery & Wheel/Handle Kit',
      'Industrial Welding Cable Plugs & Maintenance Toolkit'
    ]
  },

  // 54. Precision Geared-Head Metal Lathe
  {
    id: 'hs-ml-485k',
    sku: 'HS-CQ6236-LTH',
    name: 'Precision Geared-Head Horizontal Metal Lathe HaoSail CQ-6236',
    subtitle: '14" x 40" Induction-Hardened Bed Turning, Boring & Metric/Imperial Threading Lathe',
    category: 'welding-metalworking',
    categoryLabel: 'Welding & Metalworking',
    subCategory: 'lathes-drilling',
    subCategoryLabel: 'Metal Lathes & Drill Presses',
    price: 485000,
    originalPrice: 545000,
    rating: 4.9,
    reviewsCount: 14,
    inStock: true,
    stockCount: 3,
    freightTier: 'heavy-freight',
    isFreeFreight: true,
    isPopular: true,
    isNewArrival: true,
    powerSource: '3-phase-400v',
    image: metalLatheImg,
    specs: {
      motor: '2.2 kW (3.0 HP) Oil-Bath Geared Headstock Drive',
      voltage: '400V / 3-Phase / 50Hz (230V Single-Phase option available)',
      amperage: '5.8 Amps',
      capacity: '360 mm Swing Over Bed · 1,000 mm Between Centers · 52 mm Bore',
      footprint: '1,920 mm L x 760 mm W x 1,280 mm H',
      weightLbs: 1380,
      warrantyYears: 3,
      rpm: '70 – 2,000 RPM (12-Speed All-Geared Headstock)',
      arborOrSpindle: 'D1-4 Camlock 200 mm 3-Jaw Chuck + Coolant Pump',
    },
    description: 'Workshop precision geared-head engine lathe designed for engineering machine shops in Industrial Area, Mombasa, and Eldoret. Turns heavy hydraulic piston rods, brake drums, industrial bushings, and cuts full metric & imperial screw threads.',
    features: [
      'Ultrasonic-hardened and precision-ground cast-iron V-bedways resist long-term wear',
      '52 mm oversized spindle bore allows long shaft stock to pass through the chuck',
      'Removable gap bed increases swing capacity to 500 mm for flywheel and drum skimming',
      'Integrated flood coolant system, foot brake pedal, and halogen work lamp included'
    ],
    includedItems: [
      'HaoSail CQ-6236 Lathe on Heavy Cast-Iron Pedestal Stand',
      '200 mm 3-Jaw Self-Centering Chuck & 250 mm 4-Jaw Independent Chuck',
      'Steady Rest, Follow Rest, Live Center & Faceplate',
      'Flood Coolant Pump, Chip Tray & Metric/Imperial Change Gears'
    ]
  },

  // 55. Heavy-Duty 16mm Electric Bench Drill Press
  {
    id: 'hs-dp-42k',
    sku: 'HS-Z4116-DRL',
    name: 'Heavy-Duty 16mm Cast-Iron Bench Drill Press HaoSail Z4116',
    subtitle: '12-Speed Precision Steel & Cast-Iron Column Drilling Machine with Tilting Table',
    category: 'welding-metalworking',
    categoryLabel: 'Welding & Metalworking',
    subCategory: 'lathes-drilling',
    subCategoryLabel: 'Metal Lathes & Drill Presses',
    price: 42000,
    originalPrice: 49000,
    rating: 4.8,
    reviewsCount: 39,
    inStock: true,
    stockCount: 14,
    freightTier: 'standard-ground',
    isFreeFreight: false,
    isNewArrival: true,
    powerSource: 'corded-230v',
    image: drillPressImg,
    specs: {
      motor: '750W (1.0 HP) Copper-Wound Induction Motor',
      voltage: '230V / 1-Phase / 50Hz',
      amperage: '3.6 Amps',
      capacity: '16 mm Max Chuck Capacity · 85 mm Quill Travel',
      footprint: '620 mm D x 340 mm W x 1,040 mm H',
      weightLbs: 118,
      warrantyYears: 2,
      rpm: '180 – 2,770 RPM (12-Speed Step-Pulley Transmission)',
      arborOrSpindle: 'MT2 Spindle Taper with Heavy Keyed 16 mm Chuck',
    },
    description: 'Rigid cast-iron workshop pillar/bench drill press for repetitive hole boring through steel flat bar, RHS box section, and aluminum castings without bit chatter or deflection.',
    features: [
      '12 spindle speeds down to 180 RPM prevent overheating large hole saws in mild steel',
      'Rack-and-pinion crank table tilts 45° left and right for angled bracket fabrication',
      'Precision adjustable depth stop collar guarantees uniform blind-hole boring',
      'Magnetic NVR safety switch and hinged flip-up chuck guard protect operators'
    ],
    includedItems: [
      'HaoSail Z4116 Bench Drill Press Unit',
      '16 mm Keyed Drill Chuck & MT2 Taper Arbor',
      '4-Inch Cast Iron Drill Vise'
    ]
  },

  // 56. 8-Inch Industrial Electric Bench Grinder
  {
    id: 'hs-bg-13k',
    sku: 'HS-MD200-GRN',
    name: '8-Inch Heavy-Duty Electric Bench Grinder HaoSail MD-200',
    subtitle: '750W Dual-Wheel Cast Housing Grinder for Weld Prep, Chisel & Drill Bit Sharpening',
    category: 'welding-metalworking',
    categoryLabel: 'Welding & Metalworking',
    subCategory: 'cutting-bending',
    subCategoryLabel: 'Grinders, Chop Saws & Benders',
    price: 13500,
    originalPrice: 16500,
    rating: 4.7,
    reviewsCount: 47,
    inStock: true,
    stockCount: 28,
    freightTier: 'standard-ground',
    isFreeFreight: false,
    isNewArrival: true,
    powerSource: 'corded-230v',
    image: benchGrinderImg,
    specs: {
      motor: '750W Pure Copper Low-Vibration Induction Motor',
      voltage: '230V / 1-Phase / 50Hz',
      amperage: '3.4 Amps',
      capacity: '200 mm (8") x 25 mm Dual Abrasive Wheels (36 & 60 Grit)',
      footprint: '440 mm L x 260 mm W x 290 mm H',
      weightLbs: 36,
      warrantyYears: 2,
      rpm: '2,950 RPM True No-Load Grinding Speed',
      arborOrSpindle: 'Sealed Ball Bearings + Cast Steel Wheel Guards',
    },
    description: 'Smooth-running 8-inch cast-body industrial bench grinder for shaping HSS lathe tool bits, sharpening masonry chisels, and deburring laser-cut steel gussets.',
    features: [
      'Pure copper motor delivers steady torque without stalling under heavy steel pressing',
      'Supplied with coarse 36-grit wheel for fast stock removal and fine 60-grit finishing wheel',
      'Dual adjustable spark deflectors and transparent polycarbonate eye shields',
      'Weighted cast base with bolt-down mounting lugs reduces bench vibration'
    ],
    includedItems: [
      'HaoSail MD-200 8-Inch Bench Grinder',
      '36-Grit & 60-Grit 200mm Grinding Wheels Pre-Installed',
      '2 Adjustable Tool Rests & Polycarbonate Safety Shields'
    ]
  },

  // 57. 14-Inch Heavy-Duty Metal Cut-Off Chop Saw
  {
    id: 'hs-mc-19k',
    sku: 'HS-J3G355-SAW',
    name: '14-Inch Industrial Metal Cut-Off Chop Saw HaoSail J3G-355',
    subtitle: '2,400W High-Torque Steel Profile Cutter with Quick-Lock Miter Vise',
    category: 'welding-metalworking',
    categoryLabel: 'Welding & Metalworking',
    subCategory: 'cutting-bending',
    subCategoryLabel: 'Grinders, Chop Saws & Benders',
    price: 19500,
    originalPrice: 24000,
    rating: 4.8,
    reviewsCount: 53,
    inStock: true,
    stockCount: 22,
    freightTier: 'standard-ground',
    isFreeFreight: false,
    isNewArrival: true,
    powerSource: 'corded-230v',
    image: metalChopSawImg,
    specs: {
      motor: '2,400W Heavy-Duty Armature Universal Motor',
      voltage: '230V / 1-Phase / 50Hz',
      amperage: '10.8 Amps',
      capacity: '355 mm (14") Wheel · Cuts 120 mm Pipe & 130x110 mm RHS',
      footprint: '560 mm L x 320 mm W x 410 mm H',
      weightLbs: 42,
      warrantyYears: 2,
      rpm: '3,900 RPM High-Velocity Abrasive Speed',
      arborOrSpindle: '25.4 mm Spindle Lock + 0°–45° Swivel Vise',
    },
    description: 'High-wattage 14-inch steel profile chop saw built for Kenyan gate fabricators, roofing truss contractors, and shelving workshops cutting rebar, angle iron, and rectangular hollow sections all day.',
    features: [
      '2,400W pure copper motor slices thick angle iron and 3 mm RHS steel cleanly without bogging',
      'Quick-release sliding acme vise thread clamps and releases stock twice as fast',
      '45-degree adjustable miter fence cuts square mitered corners for steel doors and frames',
      'Wrap-around heavy steel spark guard channels debris safely downward'
    ],
    includedItems: [
      'HaoSail J3G-355 14" Cut-Off Saw',
      '2 x 355 mm Reinforced Abrasive Cut-Off Discs',
      'Spindle Hex Wrench'
    ]
  },

  // 58. Hydraulic Manual Pipe & Tube Bender 16-Ton
  {
    id: 'hs-pb-28k',
    sku: 'HS-SWG3-BND',
    name: 'Hydraulic Steel Pipe & Tube Bender HaoSail SWG-3 (16-Ton)',
    subtitle: 'Heavy Tripod Bending Press with 6 Cast-Iron Dies (1/2" to 3" Pipe)',
    category: 'welding-metalworking',
    categoryLabel: 'Welding & Metalworking',
    subCategory: 'cutting-bending',
    subCategoryLabel: 'Grinders, Chop Saws & Benders',
    price: 28000,
    originalPrice: 34000,
    rating: 4.8,
    reviewsCount: 25,
    inStock: true,
    stockCount: 12,
    freightTier: 'freight-ltl',
    isFreeFreight: false,
    isNewArrival: true,
    powerSource: 'all',
    image: pipeBenderImg,
    specs: {
      motor: '16-Ton Self-Contained Hydraulic Bending Ram',
      voltage: 'Manual Hydraulic Pump (No Power Required)',
      amperage: 'N/A',
      capacity: '1/2", 3/4", 1", 1-1/4", 1-1/2", 2" & 2-1/2"/3" Pipe (Up to 90°)',
      footprint: '720 mm x 580 mm x 1,100 mm (Mounted on Tripod)',
      weightLbs: 145,
      warrantyYears: 3,
      rpm: '280 mm Piston Stroke Length',
      arborOrSpindle: 'Spheroidal Graphite Cast-Iron Bending Dies',
    },
    description: '16-tonne hydraulic pipe bending system on an elevated folding tripod stand. Essential for fabrication of greenhouse arches, bullbars, handrails, heavy scaffolding, and industrial steel piping without kinking.',
    features: [
      'Produces crisp, kink-free cold bends up to 90 degrees in schedule 40 galvanized & black pipe',
      'Complete set of precision cast-iron formers eliminates expensive pre-bent weld elbows',
      'Swinging top plate locks with heavy steel pins for rapid vertical pipe drop-in',
      'Detachable 3-leg steel tripod sets pipe work at comfortable waist height'
    ],
    includedItems: [
      'HaoSail SWG-3 16-Ton Hydraulic Jack & Bending Frame',
      '6 Cast-Iron Pipe Dies (1/2" through 3")',
      'Detachable Heavy Steel Tripod Base'
    ]
  },

  // ============================================================================
  // CONSTRUCTION & CONCRETE (+1 item -> 8 total)
  // ============================================================================

  // 59. Walk-Behind Concrete & Asphalt Road Cutter 18"
  {
    id: 'hs-rc-145k',
    sku: 'HS-HQ450-CUT',
    name: 'Walk-Behind Concrete & Asphalt Road Cutter HaoSail HQ-450 (18")',
    subtitle: '13 HP Gasoline Pavement Floor Saw with 170 mm Depth & 35L Dust-Suppression Tank',
    category: 'construction-concrete',
    categoryLabel: 'Construction & Concrete',
    subCategory: 'concrete-cutting',
    subCategoryLabel: 'Road & Concrete Saws',
    price: 145000,
    originalPrice: 168000,
    rating: 4.9,
    reviewsCount: 27,
    inStock: true,
    stockCount: 8,
    freightTier: 'freight-ltl',
    isFreeFreight: false,
    isPopular: true,
    isNewArrival: true,
    powerSource: 'all',
    image: roadCutterImg,
    specs: {
      motor: '13 HP (390 cc) OHV Commercial Gasoline Engine',
      voltage: 'Petrol Engine / Recoil Start (No Power Required)',
      amperage: 'N/A',
      capacity: '450 mm (18") Blade · Max Cutting Depth: 170 mm · 35L Water Tank',
      footprint: '1,180 mm L x 560 mm W x 980 mm H',
      weightLbs: 285,
      warrantyYears: 2,
      rpm: '3,600 RPM Blade Shaft Speed with Dual Belt Drive',
      arborOrSpindle: 'Screw-Crank Depth Control + Front Fold-Down Guide Wheel',
    },
    description: 'Heavy-gauge steel frame walk-behind floor and road cutter engineered for Kenya road contractors, fiber-optic trenching crews, and warehouse slab expansion joint cutting.',
    features: [
      'High-torque 13 HP 390 cc gasoline engine maintains blade speed in cured reinforced concrete',
      '35-litre removable poly water tank feeds dual spray nozzles to cool the diamond blade and suppress dust',
      'Precision hand-wheel depth crank lowers the blade smoothly to exact expansion-joint specs',
      'Front flip-down pointer rod tracks chalk lines cleanly for dead-straight trench cuts'
    ],
    includedItems: [
      'HaoSail HQ-450 Walk-Behind Saw Chassis',
      '18" (450 mm) Laser-Welded Diamond Concrete/Asphalt Blade',
      '35-Litre Detachable Water Tank with Brass Valve',
      'Spark Plug Wrench & Lifting Bail Hook'
    ]
  },

  // ============================================================================
  // WOODWORKING MACHINERY (+3 items -> 15 total)
  // ============================================================================

  // 60. Multi-Spindle Cabinet Hinge Boring Machine
  {
    id: 'hs-hb-145k',
    sku: 'HS-HB21-BOR',
    name: 'Cabinet Hinge & Multi-Spindle Boring Machine HaoSail HB-21',
    subtitle: 'Vertical Precision Cabinet Cup-Hinge & Dowel Drilling Station with Pneumatic Clamps',
    category: 'woodworking',
    categoryLabel: 'Woodworking Machinery',
    subCategory: 'mortising-drilling',
    subCategoryLabel: 'Drilling & Mortising',
    price: 145000,
    originalPrice: 165000,
    rating: 4.8,
    reviewsCount: 17,
    inStock: true,
    stockCount: 5,
    freightTier: 'freight-ltl',
    isFreeFreight: false,
    isNewArrival: true,
    powerSource: 'corded-230v',
    image: hingeBorerImg,
    specs: {
      motor: '1.5 kW (2.0 HP) Heavy Vertical Boring Motor',
      voltage: '230V / 1-Phase / 50Hz (Air Assist: 6–8 Bar)',
      amperage: '7.2 Amps',
      capacity: '35 mm Cup Hinge + Twin 2.5/8 mm Pilot Bits (32 mm Pitch)',
      footprint: '860 mm L x 740 mm W x 1,450 mm H',
      weightLbs: 260,
      dustPortSize: '4" Chip Vacuum Nozzle Collar',
      warrantyYears: 3,
      rpm: '2,800 RPM Clean Tear-Free Carbide Boring',
      arborOrSpindle: 'Foot-Pedal Pneumatic Workpiece Hold-Down + Depth Stop',
    },
    description: 'Dedicated European concealed cabinet hinge boring machine for modular kitchen and wardrobe makers. Drills the 35 mm cup pocket and matching mounting screw holes in MDF, chipboard, and hardwood doors in a single pedal press.',
    features: [
      'Pneumatic foot pedal clamps the board, feeds the drill head, and retracts automatically',
      'Micrometric aluminum back fence with flip-over panel stops ensures repeatable door registration',
      'Standard 32 mm industry spacing accepts concealed Blum/Hettich-pattern hardware',
      'Includes high-precision 35 mm carbide-tipped cup bit and matching pilot drills'
    ],
    includedItems: [
      'HaoSail HB-21 Hinge Boring Machine & Cast Pedestal',
      'Dual Aluminum Side Extensions with Flip Stops',
      '35 mm Carbide Cup Bit + Pilot Drills Installed'
    ]
  },

  // 61. Wide-Belt Timber Sanding Machine
  {
    id: 'hs-ws-580k',
    sku: 'HS-WB630-SND',
    name: 'Industrial Wide-Belt Wood Calibrating Sander HaoSail WB-630',
    subtitle: '25-Inch Dual-Head Conveyor Abrasive Calibrator & Finish Sander for Doors & Panels',
    category: 'woodworking',
    categoryLabel: 'Woodworking Machinery',
    subCategory: 'planers-thicknessers',
    subCategoryLabel: 'Planers & Wide-Belt Sanders',
    price: 580000,
    originalPrice: 645000,
    rating: 4.9,
    reviewsCount: 11,
    inStock: true,
    stockCount: 2,
    freightTier: 'heavy-freight',
    isFreeFreight: true,
    isNewArrival: true,
    powerSource: '3-phase-400v',
    image: widebeltSanderImg,
    specs: {
      motor: '11.0 kW Main Sanding + 1.5 kW Variable Conveyor Feed',
      voltage: '400V / 3-Phase / 50Hz',
      amperage: '24.5 Amps',
      capacity: 'Max Sanding Width: 630 mm (25") · Thickness: 3–110 mm',
      footprint: '1,650 mm L x 1,180 mm W x 1,920 mm H',
      weightLbs: 1980,
      dustPortSize: 'Dual 150 mm (6") Overhead Dust Hood Ports',
      warrantyYears: 3,
      rpm: '18 m/s Abrasive Belt Surface Speed · 4–16 m/min Feed',
      arborOrSpindle: 'Dual Combination Roller + Micro-Finish Platen Head',
    },
    description: 'Heavy-duty conveyor-fed wide-belt wood thicknessing and calibrating sander for commercial solid-wood door makers and architectural joinery plants. Delivers ultra-flat glued tabletops, cabinet doors, and Mahogany/Mvule frames in minutes instead of hours of hand sanding.',
    features: [
      'First steel contact drum calibrates glued panel thickness; second rubber roller & pad fine-finishes',
      'Digital motorized bed elevation control accurate to 0.1 mm saves setup time',
      'Photo-electric optical belt oscillation keeps abrasive belts centered safely',
      'Automatic disc braking stops the main drum instantly on emergency or air pressure loss'
    ],
    includedItems: [
      'HaoSail WB-630 Wide-Belt Sanding Machine',
      'Infeed & Outfeed Heavy Roller Extension Tables',
      '2 x 650 x 1900 mm Cloth Sanding Belts (80 & 150 Grit)'
    ]
  },

  // 62. Full 5-in-1 Multi-Function Combination Woodworking Machine
  {
    id: 'hs-cw-130k',
    sku: 'HS-ML393-5IN1',
    name: '5-in-1 Multi-Function Combination Woodworking Machine HaoSail ML-393',
    subtitle: 'Compact Cast-Iron Joinery Center: Planer, Thicknesser, Table Saw, Shaper & Mortiser',
    category: 'woodworking',
    categoryLabel: 'Woodworking Machinery',
    subCategory: 'cnc-shaping',
    subCategoryLabel: 'Combo Machines & Shapers',
    price: 130000,
    originalPrice: 148000,
    rating: 4.8,
    reviewsCount: 36,
    inStock: true,
    stockCount: 9,
    freightTier: 'freight-ltl',
    isFreeFreight: false,
    isPopular: true,
    isNewArrival: true,
    powerSource: 'corded-230v',
    image: comboWoodworkerImg,
    specs: {
      motor: '3.0 kW (4.0 HP) Single-Phase Heavy Copper Induction Motor',
      voltage: '230V / 1-Phase / 50Hz',
      amperage: '13.8 Amps',
      capacity: '310 mm Planer Width · 120 mm Thickness · 250 mm Saw Blade',
      footprint: '1,360 mm L x 1,240 mm W x 940 mm H',
      weightLbs: 485,
      dustPortSize: '100 mm Under-Table Shavings Chute',
      warrantyYears: 3,
      rpm: '3,500 RPM Cutterhead / 4,000 RPM Circular Saw',
      arborOrSpindle: '3-Knife HSS Cutterblock + Side Slot Mortising Chuck',
    },
    description: 'Space-saving 5-in-1 cast-iron universal woodworking machine built for startup furniture workshops and rural fundi joineries. Combines surface planing, thicknessing, ripping, tenon profiling, and slot mortising on one heavy footprint.',
    features: [
      'Performs five essential joinery operations on standard single-phase 230V workshop wiring',
      'Machined cast-iron planer and saw tables stay flat across heavy hardwood timbers',
      'Side sliding mortising table accepts drill bits up to 16 mm for fast bed and door tenons',
      'Independent V-belt drive selector shifts cleanly between planer, saw, and mortiser'
    ],
    includedItems: [
      'HaoSail ML-393 5-in-1 Cast-Iron Machine',
      'Side Mortising Table Attachment & Chuck',
      '250 mm Carbide Saw Blade & 3 Pre-Installed Planer Knives',
      'Rip Fence & Angle Miter Gauge'
    ]
  },

  // ============================================================================
  // WORKSHOP, WAREHOUSE, PUMPS & AIR (+6 items -> 16 total)
  // ============================================================================

  // 63. Semi-Electric Hydraulic Pallet Stacker 1.5T / 3.0m
  {
    id: 'hs-ses-340k',
    sku: 'HS-CTD1530-STK',
    name: 'Semi-Electric Hydraulic Pallet Stacker HaoSail CTD-1530 (1.5T / 3.0m)',
    subtitle: '12V/120Ah Battery-Powered Hydraulic High-Lift Mast with Built-In Charger',
    category: 'workshop-tools',
    categoryLabel: 'Workshop & Tools',
    subCategory: 'material-handling',
    subCategoryLabel: 'Forklifts, Stackers & Rigging',
    price: 340000,
    originalPrice: 385000,
    rating: 4.9,
    reviewsCount: 18,
    inStock: true,
    stockCount: 4,
    freightTier: 'heavy-freight',
    isFreeFreight: true,
    isNewArrival: true,
    powerSource: 'corded-230v',
    image: palletStackerImg,
    specs: {
      motor: '1.6 kW DC Hydraulic Lift Pump + 12V / 120Ah Battery',
      voltage: '230V Built-In Smart Automatic Charger',
      amperage: '15 Amps Charger Draw',
      capacity: '1,500 kg Load Capacity · 3,000 mm (3.0m) Max Lift Height',
      footprint: '1,720 mm L x 780 mm W · Closed Mast: 2,080 mm',
      weightLbs: 940,
      warrantyYears: 3,
      rpm: '90 mm/sec Laden Lifting Speed · 1,150 mm Forks',
      arborOrSpindle: 'Dual C-Channel Heavy Steel Mast + Wire Safety Screen',
    },
    description: 'Semi-electric warehouse pallet stacker combining effortless push-button battery hydraulic lifting with compact manual steering. Stacks double-height Euro pallets onto warehouse racking or loads flatbed trucks without a full forklift.',
    features: [
      'Raises 1.5-tonne pallets up to 3.0 metres cleanly onto second-tier warehouse racks',
      'Compact turning radius operates effortlessly inside narrow 2.2-metre store aisles',
      'Protective wire-mesh mast screen shields operator visibility while guarding lift chains',
      'Built-in automatic smart battery charger plugs directly into any 230V wall socket'
    ],
    includedItems: [
      'HaoSail CTD-1530 1.5T/3.0m Semi-Electric Stacker',
      '12V 120Ah Heavy Deep-Cycle Battery Installed',
      'Integrated 230V Smart Battery Charger + Emergency Stop Key'
    ]
  },

  // 64. Diesel Counterbalance Forklift 3.0-Ton
  {
    id: 'hs-df-3650k',
    sku: 'HS-CPCD30-FRK',
    name: '3.0-Ton Diesel Counterbalance Forklift HaoSail CPCD-30',
    subtitle: '3-Metre Duplex Wide-View Mast, Hydraulic Powershift & Heavy Pneumatic Tyres',
    category: 'workshop-tools',
    categoryLabel: 'Workshop & Tools',
    subCategory: 'material-handling',
    subCategoryLabel: 'Forklifts, Stackers & Rigging',
    price: 3650000,
    originalPrice: 3950000,
    rating: 5.0,
    reviewsCount: 9,
    inStock: true,
    stockCount: 2,
    freightTier: 'heavy-freight',
    isFreeFreight: true,
    isPopular: true,
    isNewArrival: true,
    powerSource: 'all',
    image: dieselForkliftImg,
    specs: {
      motor: '4-Cylinder Direct-Injection Diesel Engine (45 kW / 60 HP)',
      voltage: '12V Heavy Industrial Electrical System',
      amperage: 'N/A',
      capacity: '3,000 kg Rated Capacity (500 mm Load Center) · 3,000 mm Mast',
      footprint: '3,800 mm L (with 1,070 mm Forks) x 1,225 mm W x 2,120 mm H',
      weightLbs: 9410,
      warrantyYears: 3,
      rpm: '19 km/h Travel Speed · 20% Laden Gradeability',
      arborOrSpindle: 'Hydraulic Side-Shifter + Power Steering Axle',
    },
    description: 'Brand-new 3.0-tonne heavy-duty diesel counterbalance forklift engineered for Kenyan go-downs, container yards, timber mills, and manufacturing plants. Powered by a high-torque 4-cylinder diesel engine with hydraulic powershift transmission.',
    features: [
      'Integrated hydraulic fork side-shifter speeds up container stuffing and truck loading',
      'Wide-view duplex mast provides unobstructed forward visibility of fork tips',
      'Suspension driver seat, LED work lights, reversing buzzer, and overhead steel FOPS guard',
      'Heavy deep-tread pneumatic tyres handle unpaved gravel yards and concrete ramps'
    ],
    includedItems: [
      'Brand-New HaoSail CPCD-30 Diesel Forklift (0 Hours)',
      'Hydraulic Fork Side-Shifter Pre-Installed',
      'Full Filter & Spares Maintenance Kit + Operator Manual'
    ]
  },

  // 65. High-Strength Rigging Chain Block & Webbing Sling Kit
  {
    id: 'hs-rh-18k',
    sku: 'HS-HSZ2T-RIG',
    name: '2-Ton Chain Block Hoist & Polyester Sling Kit HaoSail HSZ-2T',
    subtitle: 'Grade-80 Load Chain Pulley Block (3m Lift), Dual 2T Webbing Slings & Shackles',
    category: 'workshop-tools',
    categoryLabel: 'Workshop & Tools',
    subCategory: 'material-handling',
    subCategoryLabel: 'Forklifts, Stackers & Rigging',
    price: 18500,
    originalPrice: 22500,
    rating: 4.8,
    reviewsCount: 42,
    inStock: true,
    stockCount: 26,
    freightTier: 'standard-ground',
    isFreeFreight: false,
    isNewArrival: true,
    powerSource: 'all',
    image: riggingHoistImg,
    specs: {
      motor: 'Dual-Pawl Weston Mechanical Load Brake System',
      voltage: 'Manual Hand-Chain Gear Reduction',
      amperage: 'N/A',
      capacity: '2,000 kg (2.0-Ton) WLL · 3.0m Standard Chain Lift',
      footprint: '185 mm Compact Headroom Clearance',
      weightLbs: 38,
      warrantyYears: 3,
      rpm: '314N Hand Pull Effort at Rated Load',
      arborOrSpindle: 'G80 Manganese Alloy Chain + Dual Forged Bow Shackles',
    },
    description: 'Complete industrial machinery rigging kit bundling a 2-tonne Grade-80 steel chain block hoist with 2 heavy-duty 3m polyester webbing slings and forged alloy bow shackles for safe warehouse, crane, and gantry lifting.',
    features: [
      'Dual-pawl mechanical brake holds full 2,000 kg load immediately if hand pull stops',
      '360-degree forged swivel upper and lower hooks with heavy spring safety latches',
      'Color-coded 7:1 safety-factor polyester flat slings protect painted machinery surfaces',
      'Galvanized hand chain resists rust in humid coastal or outdoor construction sites'
    ],
    includedItems: [
      'HaoSail HSZ-2T Chain Block Hoist (3m Lift)',
      '2 x 2-Ton 3-Metre Reinforced Polyester Webbing Slings',
      '2 x Forged 3.25T Alloy Screw-Pin Bow Shackles'
    ]
  },

  // 66. Diesel 3-Inch High-Pressure Irrigation & Trash Water Pump
  {
    id: 'hs-wp-68k',
    sku: 'HS-DP80-PMP',
    name: '3-Inch Heavy-Duty Diesel Water Pump HaoSail DP-80 (10 HP)',
    subtitle: 'Self-Priming Cast-Iron Impeller Transfer & Irrigation Pump (60,000 L/hr)',
    category: 'workshop-tools',
    categoryLabel: 'Workshop & Tools',
    subCategory: 'pumps-water',
    subCategoryLabel: 'Industrial & Irrigation Water Pumps',
    price: 68000,
    originalPrice: 79000,
    rating: 4.9,
    reviewsCount: 33,
    inStock: true,
    stockCount: 14,
    freightTier: 'freight-ltl',
    isFreeFreight: false,
    isNewArrival: true,
    powerSource: 'all',
    image: waterPumpImg,
    specs: {
      motor: '10 HP (418 cc) Air-Cooled 4-Stroke Diesel Engine',
      voltage: 'Diesel Engine (12V Key-Start + Manual Recoil)',
      amperage: 'N/A',
      capacity: '80 mm (3") Inlet/Outlet · 60,000 L/hr · 32 m Total Head',
      footprint: '560 mm L x 460 mm W x 560 mm H',
      weightLbs: 122,
      warrantyYears: 2,
      rpm: '3,600 RPM Rated Operating Speed · 7 m Max Suction Lift',
      arborOrSpindle: 'Cast-Iron Volute & Silicon-Carbide Mechanical Seal',
    },
    description: 'High-volume 3-inch diesel transfer pump engineered for agricultural irrigation, quarry & foundation trench dewatering, and site water bowser filling across Kenya.',
    features: [
      'Wear-resistant cast-iron volute and semi-open impeller pass muddy site water cleanly',
      'Economical 10 HP diesel engine runs up to 5 hours per tank fill under continuous load',
      'Silicon-carbide mechanical shaft seal eliminates leakage even with abrasive silt',
      'Heavy-duty wrap-around tubular steel frame absorbs transport shock on site'
    ],
    includedItems: [
      'HaoSail DP-80 Diesel 3" Pump Set in Roll Cage',
      '3" Alloy Suction/Discharge Couplings & Clamps',
      'Heavy Steel Suction Strainer Basket + Toolkit'
    ]
  },

  // 67. Oil-Free Silent Dual-Motor Piston Air Compressor 50L
  {
    id: 'hs-sac-34k',
    sku: 'HS-OFS50-AIR',
    name: 'Oil-Free Silent Dual-Motor Air Compressor HaoSail OFS-50 (50L)',
    subtitle: 'Ultra-Quiet 58 dBA Zero-Oil Compressor for Clinics, Detailers & Finishing Spray',
    category: 'workshop-tools',
    categoryLabel: 'Workshop & Tools',
    subCategory: 'air-compressors',
    subCategoryLabel: 'Air Compressors & Air Tools',
    price: 34000,
    originalPrice: 40000,
    rating: 4.8,
    reviewsCount: 41,
    inStock: true,
    stockCount: 19,
    freightTier: 'standard-ground',
    isFreeFreight: false,
    isNewArrival: true,
    powerSource: 'corded-230v',
    image: silentCompressorImg,
    specs: {
      motor: 'Dual 2 x 750W (2.0 HP Combined) Direct-Drive Copper Motors',
      voltage: '230V / 1-Phase / 50Hz',
      amperage: '6.8 Amps',
      capacity: '50-Litre Tank · 240 L/min Air Delivery · 8 Bar (115 PSI)',
      footprint: '710 mm L x 340 mm W x 650 mm H',
      weightLbs: 74,
      warrantyYears: 2,
      rpm: '1,400 RPM Slow-Speed Quiet Pumping (58 dBA @ 1m)',
      arborOrSpindle: 'Teflon Piston Rings + Twin Brass Pressure Gauges',
    },
    description: 'Whisper-quiet 50L oil-free workshop air compressor producing clean, oil-free compressed air at just 58 dBA. Ideal for automotive detailing, dental/medical clinics, cabinet fine-finish spray guns, and indoor brad nailers.',
    features: [
      '100% oil-free Teflon piston design delivers contaminant-free air for clearcoat spraying',
      'Independent twin 750W motors fill the 50L pressure vessel from 0 to 8 Bar in 85 seconds',
      'Ultra-low 58 dBA acoustic profile allows indoor workshop use without ear protection',
      'Solenoid pressure unloader makes cold restarts effortless on standard 13A sockets'
    ],
    includedItems: [
      'HaoSail OFS-50 50L Silent Air Compressor',
      'Dual Intake Noise Silencer Filters & Wheel Kit',
      '5m Coiled PU Air Hose with Brass Quick Coupler'
    ]
  },

  // 68. 1500W SDS-Max Rotary Hammer & Pneumatic Impact Wrench Kit
  {
    id: 'hs-rh-16k',
    sku: 'HS-RH1500-KIT',
    name: '1500W SDS-Max Rotary Hammer & Pneumatic Wrench Kit HaoSail RH-1500',
    subtitle: '12-Joule Concrete Breaker Drill + 1/2" Twin-Hammer Air Impact Wrench Bundle',
    category: 'workshop-tools',
    categoryLabel: 'Workshop & Tools',
    subCategory: 'hand-power-tools',
    subCategoryLabel: 'Handheld & Pneumatic Power Tools',
    price: 16500,
    originalPrice: 20500,
    rating: 4.8,
    reviewsCount: 49,
    inStock: true,
    stockCount: 32,
    freightTier: 'standard-ground',
    isFreeFreight: false,
    isNewArrival: true,
    powerSource: 'corded-230v',
    image: rotaryHammerImg,
    specs: {
      motor: '1,500W Heavy Armature Motor (12 Joules Impact Energy)',
      voltage: '230V / 1-Phase / 50Hz (+ 6.3 Bar Air Tool)',
      amperage: '6.8 Amps',
      capacity: '40 mm Concrete Core Drilling · 680 Nm Air Impact Torque',
      footprint: '480 mm x 380 mm x 140 mm Heavy Blow-Molded Case',
      weightLbs: 26,
      warrantyYears: 2,
      rpm: '550 RPM / 3,200 BPM Rotary + Chisel Lock Modes',
      arborOrSpindle: 'SDS-Max Quick-Lock Chuck + 1/2" Square Drive Wrench',
    },
    description: 'Dual-trade site power kit pairing a high-impact 1500W SDS-Max rotary demolition hammer with a 1/2-inch pneumatic twin-hammer impact wrench. Ideal for anchoring HaoSail 2-post/4-post vehicle lifts into concrete slabs and running wheel lug maintenance.',
    features: [
      'Delivers 12 Joules of impact force for drilling M18 lift anchor bolts and chipping concrete',
      'Anti-vibration damped rear handle minimizes operator fatigue during anchor drilling',
      'Matched 1/2" twin-hammer pneumatic impact wrench tightens suspension and lug bolts rapidly',
      'Supplied with point chisel, flat chisel, masonry SDS bits, and heavy carry trunk'
    ],
    includedItems: [
      'HaoSail 1500W SDS-Max Rotary Hammer Drill',
      '1/2" Pneumatic Twin-Hammer Air Impact Wrench (680 Nm)',
      '2 SDS Masonry Bits + Flat & Point Demolition Chisels',
      'Heavy-Duty Blow-Molded Workshop Carry Case'
    ]
  }
];
