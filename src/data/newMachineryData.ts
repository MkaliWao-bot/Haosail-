import { Product } from '../types/machinery';

import cncRouterImg from '../assets/images/kenyan_cnc_router_1794916640703.jpg';
import edgeBanderImg from '../assets/images/automatic_edge_bander_1792571129104.jpg';
import panelSawImg from '../assets/images/kenyan_panel_saw_1794916640669.jpg';
import twoPostLiftImg from '../assets/images/two_post_lift_1792571126549.jpg';
import wheelAlignmentImg from '../assets/images/wheel_alignment_station_1792571127652.jpg';
import tyreChangerImg from '../assets/images/tyre_changer_1792571649391.jpg';
import wheelBalancerImg from '../assets/images/kenyan_wheel_balancer_clean_1794916778681.jpg';
import fourPostLiftImg from '../assets/images/kenyan_four_post_1794916640299.jpg';
import shopPressImg from '../assets/images/kenyan_shop_press_1794916650988.jpg';
import greasePumpImg from '../assets/images/pneumatic_grease_pump_1792571650905.jpg';
import sprayBoothImg from '../assets/images/kenyan_spray_booth_1794916645926.jpg';
import roadRollerImg from '../assets/images/kenyan_road_roller_1794916640887.jpg';
import concreteMixerImg from '../assets/images/concrete_mixer_1792572418541.jpg';
import bandSawMillImg from '../assets/images/kenyan_band_sawmill_1794916649992.jpg';
import woodworkingMillerImg from '../assets/images/kenyan_wood_miller_1794916651320.jpg';
import palletTruckImg from '../assets/images/kenyan_pallet_truck_1794916647071.jpg';
import woodThicknesserImg from '../assets/images/kenyan_wood_thicknesser_1794916644902.jpg';
import plateCompactorImg from '../assets/images/kenyan_plate_compactor_1794916641947.jpg';
import tampingRammerImg from '../assets/images/kenyan_tamping_rammer_1794916643433.jpg';
import floorGrinderImg from '../assets/images/kenyan_floor_grinder_1794916644915.jpg';
import dustCollectorImg from '../assets/images/kenyan_dust_collector_1794916651509.jpg';
import bladeSharpenerImg from '../assets/images/blade_sharpener_workshop_1793720786002.jpg';
import workshopCircularSawImg from '../assets/images/kenyan_circular_saw_1794916645018.jpg';
import woodworkingBandsawImg from '../assets/images/woodworking_bandsaw_1792573138226.jpg';
import planerThicknesserComboImg from '../assets/images/planer_thicknesser_combo_1792573138532.jpg';
import chiselMortiserImg from '../assets/images/chisel_mortiser_1792573364247.jpg';
import wetDryVacuumImg from '../assets/images/wet_dry_vac_workshop_1793866988006.jpg';
import powerTrowelImg from '../assets/images/kenyan_power_trowel_1794916643193.jpg';
import concreteVibratorImg from '../assets/images/concrete_vibrator_1792573364085.jpg';
import foamMachineImg from '../assets/images/kenyan_foam_machine_1794916651015.jpg';
import oilDrainerImg from '../assets/images/kenyan_oil_drainer_1794916650593.jpg';
import airInflatorImg from '../assets/images/kenyan_air_inflator_1794916657300.jpg';
import airCompressorImg from '../assets/images/kenyan_air_compressor_1794916652360.jpg';
import toolboxCartImg from '../assets/images/kenyan_toolbox_cart_1794916652604.jpg';
import girderCorrectorImg from '../assets/images/kenyan_girder_corrector_1794916645838.jpg';
import gasPressureWasherImg from '../assets/images/gas_pressure_washer_site_1793866970262.jpg';
import electricPressureWasherImg from '../assets/images/kenyan_pressure_washer_1794916647680.jpg';
import vulcanizerMachineImg from '../assets/images/kenyan_vulcanizer_shop_1794916653568.jpg';
import gasGeneratorImg from '../assets/images/kenyan_gas_generator_1794916648704.jpg';
import dieselGenOpenImg from '../assets/images/kenyan_diesel_generator_1794916648730.jpg';
import dieselGenSilentImg from '../assets/images/diesel_gen_silent_canopy_1793867008550.jpg';

export const ADDITIONAL_NEW_MACHINES: Product[] = [
  // 1. Dust Collector 80,000
  {
    id: 'hs-dc-80k',
    sku: 'HS-DC2000-BLU',
    name: 'Industrial Dust Collector Machine HaoSail DC-2000',
    subtitle: '2.0 HP Heavy-Duty Dual-Bag Filtration System in HaoSail Blue',
    category: 'woodworking',
    categoryLabel: 'Woodworking Machinery',
    subCategory: 'dust-extraction',
    subCategoryLabel: 'Dust Extraction',
    price: 80000,
    originalPrice: 95000,
    rating: 4.8,
    reviewsCount: 38,
    inStock: true,
    stockCount: 14,
    freightTier: 'freight-ltl',
    isFreeFreight: true,
    isPopular: true,
    powerSource: 'corded-230v',
    image: dustCollectorImg,
    specs: {
      motor: '2.0 HP Industrial TEFC Motor',
      voltage: '230V / 1-Phase / 50Hz',
      amperage: '9.0 Amps',
      capacity: '1,550 CFM Free Air Flow',
      footprint: '38" L x 22" W x 76" H',
      weightLbs: 125,
      dustPortSize: '6" Primary Inlet with Dual 4" Y-Splitter',
      warrantyYears: 3,
      rpm: '2,950 RPM High-Flow Induction Speed',
      arborOrSpindle: 'Direct-Drive Heavy Steel Radial Impeller',
    },
    description: 'Continuous-duty 2 HP shop dust collector built for wood workshops, panel processing, and milling shops. Features a heavy-gauge curved steel impeller to prevent clogging and 30-micron woven filtration bags.',
    features: [
      'Industrial TEFC single-phase induction motor with sealed bearings',
      'Balanced steel radial-fin impeller delivers 1,550 CFM air volume',
      'Dual snap-band heavy canvas filtration bags with quick-release clamps',
      'Mobile steel caster base with locking foot brakes for flexible shop layout'
    ],
    includedItems: [
      'HaoSail DC-2000 Collector Unit',
      'Upper and Lower Filtration Bags',
      'Dual 4-inch Y-Splitter Duct Adapter',
      'Heavy-Duty Steel Base with 4 Swivel Casters'
    ]
  },

  // 2. Tyre Changer 210,000
  {
    id: 'hs-tc-210k',
    sku: 'HS-TC950-BLU',
    name: 'Tyre Changer Machine HaoSail TC-950 Semi-Automatic',
    subtitle: 'Swing-Arm Tyre Changer for Passenger & Commercial Vehicles (10"-24")',
    category: 'auto-maintenance',
    categoryLabel: 'Auto Maintenance & Garage',
    subCategory: 'tyre-wheel',
    subCategoryLabel: 'Tyre & Wheel Service',
    price: 210000,
    originalPrice: 235000,
    rating: 4.9,
    reviewsCount: 52,
    inStock: true,
    stockCount: 8,
    freightTier: 'heavy-freight',
    isFreeFreight: true,
    isPopular: true,
    powerSource: 'corded-230v',
    image: tyreChangerImg,
    specs: {
      motor: '1.5 HP High-Torque Electric Motor',
      voltage: '230V / 1-Phase / 50Hz',
      amperage: '10.5 Amps',
      capacity: 'Outside Clamp: 10"-21", Inside Clamp: 12"-24"',
      footprint: '38" W x 48" D x 74" H',
      weightLbs: 520,
      warrantyYears: 3,
      rpm: '6.5 - 13 RPM Dual Speed Reversible Turntable',
      arborOrSpindle: 'Universal 4-Jaw Self-Centering Pneumatic Chuck',
      dustPortSize: '8 - 10 Bar (115 - 145 PSI) Quick Air Coupler',
    },
    description: 'Workhorse automotive tyre changer featuring high-tensile cast jaws, pneumatic bead-breaker cylinder with 2,500 kg breaking force, and high-visibility HaoSail blue powder coat finish.',
    features: [
      'Self-centering four-jaw turntable with protective polymer jaw sleeves',
      'Powerful pneumatic bead breaker blade with non-marring rubber cushion',
      'Swing-arm post design for rapid positioning and rim clearance',
      'Foot-pedal operated forward/reverse turntable rotation'
    ],
    includedItems: [
      'TC-950 Tyre Changer Assembly',
      'Tyre Inflator Gauge with Pressure Hose',
      'Alloy Rim Protection Jaw Caps (Set of 4)',
      'Heavy-Duty Tyre Lever Bar'
    ]
  },

  // 3. CNC Router 1,650,000
  {
    id: 'hs-cnc-1650k',
    sku: 'HS-CNC1325-PRO',
    name: 'CNC Router Machine HaoSail CNC-1325 Industrial 4x8ft',
    subtitle: 'Heavy Gantry 6.0kW High-Frequency Spindle with Vacuum Bed & DSP Controller',
    category: 'woodworking',
    categoryLabel: 'Woodworking Machinery',
    subCategory: 'cnc-shaping',
    subCategoryLabel: 'CNC Routers & Shapers',
    price: 1650000,
    originalPrice: 1800000,
    rating: 5.0,
    reviewsCount: 24,
    inStock: true,
    stockCount: 3,
    freightTier: 'heavy-freight',
    isFreeFreight: true,
    isPopular: true,
    powerSource: '3-phase-400v',
    image: cncRouterImg,
    specs: {
      motor: '6.0 kW (8.0 HP) Water/Air-Cooled Spindle',
      voltage: '400V / 3-Phase / 50Hz',
      amperage: '18.0 Amps',
      capacity: 'Working Area: 1,300 x 2,500 x 200 mm (4ft x 8ft)',
      footprint: '88" W x 128" L x 68" H',
      weightLbs: 2650,
      dustPortSize: '4" Vacuum Dust Shroud with Auto Lift',
      warrantyYears: 5,
      rpm: '6,000 - 24,000 RPM Stepless Variable Inverter VFD',
      arborOrSpindle: 'ER25 / ER32 Precision Collet Chuck (1mm - 20mm tooling)',
    },
    description: 'Heavy structural steel welded gantry CNC router for continuous cabinetry, acrylic cutting, and 3D architectural millwork. Equipped with helical rack-and-pinion transmission on X/Y axes and precision ball screw on Z axis.',
    features: [
      '6.0 kW ER32 high-speed spindle operating from 6,000 to 24,000 RPM',
      '6-Zone matrix vacuum clamping table with high-flow side-channel vacuum blower',
      'Hiwin 20mm precision linear guide rails on all three axes',
      'Handheld DSP offline remote controller (no computer needed at machine)'
    ],
    includedItems: [
      'HaoSail CNC-1325 Base Machine with Gantry',
      'DSP A11 Handheld Controller with Flash Drive',
      '7.5 kW Vacuum Pump System',
      'Tool Calibration Sensor Puck',
      'Complete ER32 Collet Starter Set (4mm, 6mm, 8mm, 12.7mm)'
    ]
  },

  // 4. Woodworking Miller / Spindle Shaper 270,000
  {
    id: 'hs-wm-270k',
    sku: 'HS-WS30-MIL',
    name: 'Woodworking Spindle Shaper & Miller Machine HaoSail MX-30',
    subtitle: '4.0 HP Commercial Tilt-Spindle Shaper with Sliding Table',
    category: 'woodworking',
    categoryLabel: 'Woodworking Machinery',
    subCategory: 'cnc-shaping',
    subCategoryLabel: 'CNC Routers & Shapers',
    price: 270000,
    originalPrice: 295000,
    rating: 4.8,
    reviewsCount: 31,
    inStock: true,
    stockCount: 5,
    freightTier: 'heavy-freight',
    isFreeFreight: true,
    powerSource: '3-phase-400v',
    image: woodworkingMillerImg,
    specs: {
      motor: '4.0 HP (3.0 kW) Industrial Induction Motor',
      voltage: '400V / 3-Phase / 50Hz',
      amperage: '8.5 Amps',
      capacity: '30mm Interchangable Spindle, 100mm Vertical Travel',
      footprint: '48" W x 40" D x 42" H',
      weightLbs: 640,
      dustPortSize: '4" Port on Shaper Fence Hood',
      warrantyYears: 3,
      rpm: '3,000 / 4,000 / 6,000 / 8,000 / 10,000 RPM (5-Speed Precision Pulley)',
      arborOrSpindle: '30mm Precision Hardened Spindle (1-1/4" Interchangeable)',
    },
    description: 'Precision cast iron spindle moulder designed for architectural profile moulding, raised panel doors, and tenoning. Features forward/reverse rotation and 4-speed belt pulley drive (3000/4500/6000/9000 RPM).',
    features: [
      'Precision ground heavy cast iron table with anodized sliding carriage',
      'Micro-adjustable cast aluminum fence hoods with wooden workpiece guides',
      'Mechanical spindle brake with electrical interlock safety switch',
      'Four spindle speeds for small tooling up to large diameter profile heads'
    ],
    includedItems: [
      'MX-30 Spindle Shaper Base',
      '30mm Precision Ground Spindle Shaft',
      'Sliding Tenoning Carriage with Hold-Down Clamp',
      'Miter Gauge and Micro-Adjustable Fence Assembly'
    ]
  },

  // 5. Edge Banding Machine 1,700,000
  {
    id: 'hs-eb-1700k',
    sku: 'HS-EB500-AUTO',
    name: 'Automatic Edge Banding Machine HaoSail EB-500',
    subtitle: 'Full Linear Edge Bander with Gluing, End Cutting, Fine Trimming & Buffing',
    category: 'woodworking',
    categoryLabel: 'Woodworking Machinery',
    subCategory: 'sheet-panel',
    subCategoryLabel: 'Panel Saws & Edge Banders',
    price: 1700000,
    originalPrice: 1850000,
    rating: 4.9,
    reviewsCount: 19,
    inStock: true,
    stockCount: 2,
    freightTier: 'heavy-freight',
    isFreeFreight: true,
    isPopular: true,
    powerSource: '3-phase-400v',
    image: edgeBanderImg,
    specs: {
      motor: '9.5 kW Total Connected Power',
      voltage: '400V / 3-Phase / 50Hz',
      amperage: '22.0 Amps',
      capacity: 'Panel Thickness: 10-60mm, Edge Tape: 0.4-3.0mm',
      footprint: '148" L x 42" W x 58" H',
      weightLbs: 2950,
      dustPortSize: '4x 4" Centralized Dust Extraction Ports',
      warrantyYears: 5,
      rpm: '12,000 RPM High-Frequency Direct-Drive Trimming Spindles',
      arborOrSpindle: 'Pre-Milling Diamond Cutters & Micro-Adjustable Flush Trimmers',
    },
    description: 'Production-line automatic edge bander tailored for commercial modular kitchen and wardrobe manufacturing. Applies hot-melt EVA glue with precision, pneumatically snips end tapes, top/bottom profile trims, radius scrapes, and buffs panels in one continuous pass.',
    features: [
      'Precision teflon-coated quick-melt glue pot with automatic standby temperature',
      'Dual-blade high-frequency pneumatic end-cutting saws running on linear rails',
      'High-speed top and bottom profile trimming units with carbide radius cutters',
      'Dual cotton buffing wheels for mirror edge finishing on PVC and acrylic tapes'
    ],
    includedItems: [
      'HaoSail EB-500 Edge Bander Main Unit',
      'Extendable Panel Support Roller Track',
      'Starter Supply of HaoSail High-Bond EVA Hot Melt Pellets',
      'Carbide Replacement Knife Inserts Set'
    ]
  },

  // 6. Pallet Truck 29,500
  {
    id: 'hs-pt-29k',
    sku: 'HS-PT2500-HYD',
    name: 'Hydraulic Pallet Truck Machine HaoSail PT-2500 Heavy-Duty',
    subtitle: '2.5 Tonne (2,500 kg) Capacity with Dual Polyurethane Steer Wheels',
    category: 'workshop-tools',
    categoryLabel: 'Workshop & Tools',
    subCategory: 'material-handling',
    subCategoryLabel: 'Material Handling & Pallet Trucks',
    price: 29500,
    originalPrice: 35000,
    rating: 4.9,
    reviewsCount: 110,
    inStock: true,
    stockCount: 45,
    freightTier: 'freight-ltl',
    isFreeFreight: false,
    powerSource: 'all',
    image: palletTruckImg,
    specs: {
      motor: 'Manual Sealed Hydraulic Pump with Overload Valve',
      voltage: 'Manual Hand Pump',
      amperage: 'N/A',
      capacity: '2,500 kg (5,500 lbs) Lifting Capacity',
      footprint: '48" Fork Length x 27" Overall Fork Width',
      weightLbs: 165,
      warrantyYears: 2,
      rpm: 'Multi-Stroke Rapid Lift Hydraulic Ram',
      arborOrSpindle: 'Hard Chrome Piston & Tandem Polyurethane Bogies',
    },
    description: 'Indispensable warehouse and millwork shop workhorse. Features a one-piece cast leak-proof hydraulic pump, chrome-plated piston, ergonomic 3-position lever handle (Lift, Neutral, Lower), and non-marking polyurethane load rollers.',
    features: [
      'Heavy-gauge robotic welded steel fork frame with reinforcement ribs',
      'Leak-free hydraulic casting pump with overload bypass safety valve',
      'Low 85mm lowered fork clearance enters standard East African pallets easily',
      'Silent dual tandem polyurethane front rollers climb thresholds smoothly'
    ],
    includedItems: [
      'PT-2500 Hand Pallet Truck Fully Assembled',
      'Polyurethane Steer & Tandem Load Rollers Pre-Mounted',
      'Operations & Maintenance Manual'
    ]
  },

  // 7. Panel Saw 575,000
  {
    id: 'hs-ps-575k',
    sku: 'HS-PS3200-SLD',
    name: 'Sliding Table Panel Saw Machine HaoSail PS-3200 Precision',
    subtitle: '3,200mm Carriage with Independent Scoring Saw & 5.5 HP Main Blade',
    category: 'woodworking',
    categoryLabel: 'Woodworking Machinery',
    subCategory: 'sheet-panel',
    subCategoryLabel: 'Panel Saws & Edge Banders',
    price: 575000,
    originalPrice: 620000,
    rating: 4.9,
    reviewsCount: 29,
    inStock: true,
    stockCount: 4,
    freightTier: 'heavy-freight',
    isFreeFreight: true,
    isPopular: true,
    powerSource: '3-phase-400v',
    image: panelSawImg,
    specs: {
      motor: '5.5 HP Main Motor + 1.0 HP Scoring Motor',
      voltage: '400V / 3-Phase / 50Hz',
      amperage: '14.0 Amps',
      capacity: '3,200mm Max Sliding Stroke, 1,250mm Rip Fence Width',
      footprint: '130" L x 125" W x 36" H',
      weightLbs: 1850,
      dustPortSize: '4" Lower Chute + 2.5" Overhead Crown Hood',
      warrantyYears: 5,
      rpm: '4,000 / 5,000 RPM Main Blade; 8,000 RPM Scoring Blade',
      arborOrSpindle: '30mm Main Saw Arbor + 20mm Scoring Blade Arbor',
      bladeSize: '300mm - 350mm Main TCT Blade + 120mm Scoring Blade',
    },
    description: 'Commercial sliding table panel saw with anodized aluminum sliding carriage riding on chrome-hardened cylindrical steel rails. The secondary high-RPM scoring blade ensures tearout-free cuts on both faces of melamine, veneer, and laminated composite panels.',
    features: [
      'Heavy-duty multi-chamber aluminum sliding carriage with smooth ball runner mechanism',
      'Independent scoring blade runs at 8,000 RPM for flawless chip-free cutting',
      'Heavy outrigger support frame with crosscut fence and digital flip stops',
      '45-degree blade tilting with illuminated vernier angle scale'
    ],
    includedItems: [
      'PS-3200 Base Machine and 3.2m Sliding Carriage',
      'Crosscut Fence with 2 Micro-Adjust Flip Stops',
      'Overhead Dust Extraction Blade Guard',
      'Main Saw Blade (300mm) and Scoring Blade (120mm)'
    ]
  },

  // 9. Blade Sharpener (Heavy Duty) 98,000
  {
    id: 'hs-bs-98k',
    sku: 'HS-BS600-SHP',
    name: 'Circular Blade Sharpener Machine HaoSail BS-600 Heavy-Duty',
    subtitle: 'Universal Carbide Tipped Saw Blade Grinder (80mm - 700mm Blades)',
    category: 'woodworking',
    categoryLabel: 'Woodworking Machinery',
    subCategory: 'tool-maintenance',
    subCategoryLabel: 'Blade Sharpening & Tooling',
    price: 98000,
    originalPrice: 115000,
    rating: 4.7,
    reviewsCount: 36,
    inStock: true,
    stockCount: 12,
    freightTier: 'standard-ground',
    isFreeFreight: true,
    powerSource: 'corded-230v',
    image: bladeSharpenerImg,
    specs: {
      motor: '0.75 HP (550W) Precision Grinding Motor',
      voltage: '230V / 1-Phase / 50Hz',
      amperage: '3.5 Amps',
      capacity: 'Blades from 80mm up to 700mm Diameter',
      footprint: '28" W x 20" D x 22" H',
      weightLbs: 95,
      warrantyYears: 2,
      rpm: '2,850 RPM Constant Diamond Grinding Wheel Spindle',
      arborOrSpindle: 'Multi-Step Precision Centering Arbor (20mm, 25.4mm, 30mm, 32mm)',
      bladeSize: 'Accommodates 80mm - 700mm Circular TCT Saw Blades',
    },
    description: 'Precision grinder for re-sharpening tungsten carbide tipped circular saw blades, scoring blades, and scoring teeth. Features water-cooling tank, multi-angle indexing head, and diamond cup wheel.',
    features: [
      'Tilting grinding wheel head (-20° to +20°) for bevel and face sharpening',
      'Universal blade centering arbor with brass spacer rings for all standard bore sizes',
      'Includes diamond grinding cup wheel designed specifically for hard tungsten carbide',
      'Integrated coolant recirculating pump extends wheel life and prevents tooth burn'
    ],
    includedItems: [
      'BS-600 Grinding Station',
      '125mm Diamond Grinding Cup Wheel',
      'Arbor Adaptor Ring Set (20mm, 25.4mm, 30mm, 32mm)',
      'Coolant Splash Tray and Pump Assembly'
    ]
  },

  // 10. Wood Thicknesser 329,999
  {
    id: 'hs-wt-330k',
    sku: 'HS-TH500-PLN',
    name: 'Wood Thicknesser Machine HaoSail TH-500 Industrial 20"',
    subtitle: '5.0 HP Heavy Cast-Iron Auto-Feed Thickness Planer with Spiral Cutterhead',
    category: 'woodworking',
    categoryLabel: 'Woodworking Machinery',
    subCategory: 'planers-thicknessers',
    subCategoryLabel: 'Planers & Thicknessers',
    price: 329999,
    originalPrice: 360000,
    rating: 4.9,
    reviewsCount: 41,
    inStock: true,
    stockCount: 6,
    freightTier: 'heavy-freight',
    isFreeFreight: true,
    isPopular: true,
    powerSource: '3-phase-400v',
    image: woodThicknesserImg,
    specs: {
      motor: '5.0 HP TEFC Continuous Duty Motor',
      voltage: '400V / 3-Phase / 50Hz',
      amperage: '11.0 Amps',
      capacity: '20" Max Width x 8" Max Thickness',
      footprint: '38" W x 34" D x 44" H',
      weightLbs: 880,
      dustPortSize: '5" Swivel Dust Hood',
      warrantyYears: 5,
      rpm: '5,000 RPM Helical Cutterhead (16 & 20 FPM Dual Feed Rate)',
      arborOrSpindle: '4-Sided Solid Carbide Spiral Cutterhead (96 Inserts)',
      bladeSize: '15mm x 15mm x 2.5mm Indexable Carbide Cutter Inserts',
    },
    description: 'Heavy solid cast iron thicknesser built for commercial millwork shops sizing rough hardwood slabs. Features segmented serrated steel infeed roller, smooth steel outfeed roller, two-speed gearbox, and spiral cutterhead with four-sided carbide inserts.',
    features: [
      'Four precision ground vertical steel columns supporting the cast iron planer table',
      'Helical spiral cutterhead with 96 solid carbide indexable inserts',
      'Two-speed feed rate (16 & 20 FPM) for rough dimensioning or glass-smooth finish',
      'Integrated bed rollers reduce friction on damp or resinous timbers'
    ],
    includedItems: [
      'TH-500 20-inch Thicknesser Base Unit',
      'Installed Helical Spiral Cutterhead with Inserts',
      'Torx T-Wrench and 5 Spare Carbide Inserts',
      '5-inch Dust Port Hood'
    ]
  },

  // 11. Spray Booth 1,650,000
  {
    id: 'hs-sb-1650k',
    sku: 'HS-SB7000-IND',
    name: 'Down-Draft Spray Booth Machine HaoSail SB-7000 Industrial',
    subtitle: 'Complete 7m Finishing Booth with Heating Burner & Multi-Stage Filtration',
    category: 'auto-maintenance',
    categoryLabel: 'Auto Maintenance & Garage',
    subCategory: 'paint-spray-booth',
    subCategoryLabel: 'Spray Booth & Finishing',
    price: 1650000,
    originalPrice: 1800000,
    rating: 4.9,
    reviewsCount: 15,
    inStock: true,
    stockCount: 2,
    freightTier: 'heavy-freight',
    isFreeFreight: true,
    powerSource: '3-phase-400v',
    image: sprayBoothImg,
    specs: {
      motor: 'Dual 4.0 kW Turbo Intake + 5.5 kW Exhaust Fans',
      voltage: '400V / 3-Phase / 50Hz',
      amperage: '28.0 Amps',
      capacity: 'Internal Size: 6.9m L x 3.9m W x 2.7m H',
      footprint: '7.0m L x 5.2m W x 3.3m H',
      weightLbs: 6200,
      warrantyYears: 5,
      rpm: '1,450 RPM High-Volume Centrifugal Turbo Impellers',
      arborOrSpindle: 'Direct Riello G20 High-Output Heat Exchanger',
      dustPortSize: 'Full Ceiling Diffusion & Dual High-Capacity Floor Exhaust Ducts',
    },
    description: 'Full-size industrial finishing spray booth for automotive painting and high-end lacquer furniture finishing. Features Italian diesel burner heating system (up to 80°C curing), ceiling plenum micro-filters, and full floor grating with paint arrestor media.',
    features: [
      '50mm EPS insulated wall panels with galvanized interior skin',
      'Italian Riello diesel heat exchanger reaches baking temperatures in 8-10 minutes',
      'High-velocity centrifugal turbine blowers generate 24,000 m³/h fresh air exchange',
      'Explosion-proof ceiling and side-wall LED lighting fixtures illuminate panels evenly'
    ],
    includedItems: [
      'Pre-Fabricated Wall & Ceiling Modular Panels',
      'Intake and Exhaust Blower Units with Ductwork',
      'Riello G20 Diesel Burner and Heat Exchanger',
      'Complete Ceiling Filtration & Floor Fiber Glass Filter Media'
    ]
  },

  // 12. Circular Saw (Workshop Table Saw / Heavy Duty) 250,000
  {
    id: 'hs-cs-250k',
    sku: 'HS-CS3000-PRO',
    name: 'Workshop Circular Saw Machine HaoSail CS-3000 Heavy',
    subtitle: '3.0 HP Cast Iron Cabinet Table Saw with Precision Rip Fence',
    category: 'woodworking',
    categoryLabel: 'Woodworking Machinery',
    subCategory: 'saws',
    subCategoryLabel: 'Woodworking Saws',
    price: 250000,
    originalPrice: 280000,
    rating: 4.8,
    reviewsCount: 54,
    inStock: true,
    stockCount: 10,
    freightTier: 'heavy-freight',
    isFreeFreight: true,
    isPopular: true,
    powerSource: 'corded-230v',
    image: workshopCircularSawImg,
    specs: {
      motor: '3.0 HP Continuous Duty TEFC Motor',
      voltage: '230V / 1-Phase / 50Hz',
      amperage: '14.5 Amps',
      capacity: '36" Rip Right, 3-1/8" Cut Depth @ 90°',
      footprint: '62" W x 40" D x 34" H',
      weightLbs: 480,
      dustPortSize: '4" Port on Lower Cabinet',
      warrantyYears: 3,
      rpm: '4,200 RPM Heavy-Duty Blade Spindle',
      arborOrSpindle: '30mm Precision Ground Cast Iron Arbor Flange',
      bladeSize: '305mm (12") 60-Tooth Industrial TCT Saw Blade',
    },
    description: 'Dependable workshop circular table saw built with precision ground cast iron table wings and heavy internal trunnions. Ideal for solid timber ripping, cross-cutting, and joinery work in commercial carpentry workshops.',
    features: [
      'Heavy-duty cast iron table minimizes motor vibration for mirror-finish rips',
      'Smooth rack and pinion bevel tilt mechanism with micro-lock knob',
      'Heavy steel T-fence clamps securely to front and rear rails',
      'Magnetic safety switch with emergency stop knee paddle'
    ],
    includedItems: [
      'CS-3000 3HP Table Saw Cabinet',
      'Pair of Cast Iron Table Wings',
      '12-inch 48T Carbide Tipped Blade',
      'Miter Gauge with Adjustable Stops'
    ]
  },

  // 13. Woodworking Bandsaw 250,000
  {
    id: 'hs-bs-250k',
    sku: 'HS-BS400-WOD',
    name: 'Woodworking Bandsaw Machine HaoSail BS-400 16" Heavy',
    subtitle: '3.0 HP Band Saw with 12" Resaw Capacity and Precision Bearing Guides',
    category: 'woodworking',
    categoryLabel: 'Woodworking Machinery',
    subCategory: 'saws',
    subCategoryLabel: 'Bandsaws & Resaws',
    price: 250000,
    originalPrice: 275000,
    rating: 4.8,
    reviewsCount: 39,
    inStock: true,
    stockCount: 7,
    freightTier: 'heavy-freight',
    isFreeFreight: true,
    powerSource: 'corded-230v',
    image: woodworkingBandsawImg,
    specs: {
      motor: '3.0 HP Induction Motor',
      voltage: '230V / 1-Phase / 50Hz',
      amperage: '13.0 Amps',
      capacity: '16" Throat x 12" Maximum Resaw Height',
      footprint: '34" W x 28" D x 74" H',
      weightLbs: 395,
      dustPortSize: 'Dual 4" Extraction Ports',
      warrantyYears: 3,
      rpm: '800 / 1,200 m/min Dual Blade Speeds (1,450 RPM TEFC Motor)',
      arborOrSpindle: '400mm (16") Dynamically Balanced Cast Iron Band Wheels',
      bladeSize: '3,345mm Blade Length (6mm to 25mm Band Widths)',
    },
    description: 'Precision vertical bandsaw equipped with heavy dynamic-balanced cast iron flywheels, dual-stage micro-adjustable bearing blade guides, and a cast iron tilting table (-5° to +45°).',
    features: [
      'Dynamically balanced cast iron wheels with bonded urethane tires',
      'Geared rack and pinion upper blade guide post with scale',
      'Quick-release blade tension lever with de-tension park position',
      'Cast iron rip fence with resaw drift adjustment and hairline cursor'
    ],
    includedItems: [
      'BS-400 16-inch Bandsaw Base',
      'High-Tension Swedish Steel Resaw Blade',
      'Dual Bearing Upper and Lower Blade Guide Assemblies',
      'Heavy Aluminum Resaw Fence'
    ]
  },

  // 14. Four Post Lift 570,000
  {
    id: 'hs-4p-570k',
    sku: 'HS-4PL5000-AUT',
    name: 'Four Post Lift Machine HaoSail 4P-5000 5.0 Tonne',
    subtitle: 'Heavy Commercial Vehicle & Wheel Alignment Lift with Integrated Runways',
    category: 'auto-maintenance',
    categoryLabel: 'Auto Maintenance & Garage',
    subCategory: 'vehicle-lifts',
    subCategoryLabel: 'Vehicle Lifts (4-Post)',
    price: 570000,
    originalPrice: 620000,
    rating: 5.0,
    reviewsCount: 22,
    inStock: true,
    stockCount: 4,
    freightTier: 'heavy-freight',
    isFreeFreight: true,
    isPopular: true,
    powerSource: '3-phase-400v',
    image: fourPostLiftImg,
    specs: {
      motor: '3.0 kW Electro-Hydraulic Power Unit',
      voltage: '400V / 3-Phase / 50Hz',
      amperage: '8.0 Amps',
      capacity: '5,000 kg (11,000 lbs) Rated Lifting Capacity',
      footprint: '208" L x 132" W x 86" H',
      weightLbs: 3100,
      warrantyYears: 5,
      rpm: '1,450 RPM Commercial Hydraulic Power Pack (50s Rise)',
      arborOrSpindle: 'High-Tensile Heavy Steel Aircraft Cables & Slack Cable Locks',
    },
    description: 'Engineered for commercial automotive garages, alignment stations, and fleet service workshops. Features heavy steel box columns, built-in turntable recesses for 3D alignment, rear slip plates, and pneumatic mechanical safety lock ladders in every post.',
    features: [
      '5-Tonne lifting capacity easily supports commercial vans and SUVs',
      'Built-in front turntable pockets and rear slip plates for 3D wheel alignment',
      'Single-point pneumatic safety lock release with multi-position locking ladders',
      'Heavy diamond-plate non-skid runway surfaces with drive-on approach ramps'
    ],
    includedItems: [
      'Four Heavy-Duty Steel Columns and Crossbeams',
      'Pair of Diamond-Plate Runways with Alignment Recesses',
      'Hydraulic Cylinder, Aircraft-Grade Cables & Pulley Assembly',
      'Hydraulic Power Pack with Wall Mount Bracket'
    ]
  },

  // 14. Hydraulic Workshop Press Bench 40,000
  {
    id: 'hs-sp-40k',
    sku: 'HS-SP20-HYD',
    name: 'Hydraulic Workshop Press Bench Machine HaoSail SP-20 20-Ton Heavy',
    subtitle: 'H-Frame Hydraulic Floor Press Bench with Pressure Gauge & Adjustable Bed',
    category: 'workshop-tools',
    categoryLabel: 'Workshop & Tools',
    subCategory: 'hydraulic-presses',
    subCategoryLabel: 'Hydraulic Shop Presses',
    price: 40000,
    originalPrice: 48000,
    rating: 4.8,
    reviewsCount: 62,
    inStock: true,
    stockCount: 18,
    freightTier: 'freight-ltl',
    isFreeFreight: true,
    powerSource: 'all',
    image: shopPressImg,
    specs: {
      motor: 'Manual Hydraulic Hand Pump with Pressure Relief',
      voltage: 'Manual Hydraulic',
      amperage: 'N/A',
      capacity: '20 Tonne (44,000 lbs) Ram Force, 7.5" Stroke',
      footprint: '26" W x 24" D x 62" H',
      weightLbs: 215,
      warrantyYears: 2,
      rpm: 'Dual-Speed Manual & Air-Assisted Rapid Hydraulic Ram',
      arborOrSpindle: 'Hardened Chrome Piston with Integrated Glycerin Pressure Gauge',
    },
    description: 'Essential garage and fabrication machine for pressing bearings, bushings, universal joints, pulleys, and metal straightening. Built with high-strength structural H-frame channel steel in signature HaoSail blue with 8-level height-adjustable work bed.',
    features: [
      'Multi-position 8-level pin-locked work bed easily adjusts vertically for different workpieces',
      'Industrial liquid-filled pressure gauge calibrated in metric tonnes, bar, and PSI',
      'Heavy-duty return springs automatically retract the chrome-plated hydraulic ram upon valve release',
      'Includes two heavy forged steel V-blocks for round shaft, axle, and tube support'
    ],
    includedItems: [
      'H-Frame 20T Structural Steel Press Frame & Press Bench',
      '20 Ton Hydraulic Ram with Liquid-Filled Pressure Gauge',
      'Pair of Forged Steel V-Block Mandrels',
      'Steel Operating Lever Handle Bar'
    ]
  },

  // 15. Pneumatic Grease Pump 40,000
  {
    id: 'hs-pgp-40k',
    sku: 'HS-PGP50-PMP',
    name: 'Pneumatic Grease Pump Machine HaoSail PGP-50 High-Pressure Kit',
    subtitle: '50:1 Air-Operated High-Pressure Grease Lubricator Dispenser for Drums',
    category: 'auto-maintenance',
    categoryLabel: 'Auto Maintenance & Garage',
    subCategory: 'lubrication',
    subCategoryLabel: 'Lubrication & Greasing',
    price: 40000,
    originalPrice: 48000,
    rating: 4.8,
    reviewsCount: 38,
    inStock: true,
    stockCount: 18,
    freightTier: 'standard-ground',
    isFreeFreight: true,
    powerSource: 'all',
    image: greasePumpImg,
    specs: {
      motor: '50:1 Pneumatic Piston Motor (400 Bar Max Output)',
      voltage: 'Compressed Air (6-8 Bar Input)',
      amperage: 'N/A',
      capacity: 'Flow Rate: 850 g/min, Suits standard 50-200L grease drums',
      footprint: '38" Suction Tube Length with 2" Bung Adaptor',
      weightLbs: 24,
      warrantyYears: 2,
      rpm: 'Pneumatic Reciprocating Piston (50:1 Pressure Ratio)',
      dustPortSize: '1/4" NPT Air Inlet with Pressure Regulating Gauge',
    },
    description: 'High-volume air-powered grease transfer pump designed to mount directly onto commercial lubricant drums. Delivers instantaneous high-pressure lubrication for automotive chassis, agricultural, and transport fleets.',
    features: [
      '50:1 high pressure ratio pumps even heavy #3 viscosity grease without stalling',
      'CNC-machined aluminum air motor housing with brass internal valving and muffler',
      'Includes 2-inch drum bung adaptor and suction tube foot check valve',
      'Supplied with grease control nozzle gun and 4-meter anti-kink reinforced hydraulic hose'
    ],
    includedItems: [
      '50:1 Air Grease Pump with Drum Bung Clamp',
      '4-Meter Heavy-Duty Steel-Braided Hydraulic Flexible Hose',
      'High-Pressure Grease Gun with 360-Degree Z-Swivel Joint',
      'Drum Follower Plate and Bung Adaptor'
    ]
  },

  // 17. Planer and Thicknesser (Combined Machine) 420,000
  {
    id: 'hs-pt-420k',
    sku: 'HS-FS310-CMB',
    name: 'Surface Planer & Thicknesser Machine HaoSail FS-310 Combined',
    subtitle: '12" Jointer & Thicknesser Combo with Quick-Flip Cast Iron Tables & Helical Head',
    category: 'woodworking',
    categoryLabel: 'Woodworking Machinery',
    subCategory: 'planers-thicknessers',
    subCategoryLabel: 'Planers & Thicknessers',
    price: 420000,
    originalPrice: 460000,
    rating: 4.9,
    reviewsCount: 33,
    inStock: true,
    stockCount: 5,
    freightTier: 'heavy-freight',
    isFreeFreight: true,
    isPopular: true,
    powerSource: '3-phase-400v',
    image: planerThicknesserComboImg,
    specs: {
      motor: '4.0 HP Continuous Duty Motor',
      voltage: '400V / 3-Phase / 50Hz',
      amperage: '9.0 Amps',
      capacity: '310mm (12") Planing & Thicknessing Width, 220mm Thickness Depth',
      footprint: '56" L x 30" W x 40" H',
      weightLbs: 760,
      dustPortSize: '4" Flip-Over Dust Extraction Hood',
      warrantyYears: 5,
      rpm: '5,300 RPM Spiral Silent Helical Cutterblock',
      arborOrSpindle: '70mm Diameter Precision Ground Helical Cutterhead',
      bladeSize: '48 Indexable Solid Carbide Inserts (15x15x2.5mm)',
    },
    description: 'The ultimate space-saving machine for serious joinery and furniture workshops. Converts from a precision 12-inch surface jointer to a heavy thickness planer in under 30 seconds with spring-assisted parallel table lifting.',
    features: [
      'Simultaneous table lift mechanism maintains coplanar accuracy without recalibration',
      'Spiral helical cutterhead loaded with four-sided German carbide inserts',
      'Heavy extruded aluminum tilting fence (90° to 45°) with positive stop detents',
      'Dual anti-kickback fingers and power-driven feed rollers for safe thicknessing'
    ],
    includedItems: [
      'FS-310 Planer-Thicknesser Base Machine',
      'Pre-Installed Spiral Cutterhead with 72 Carbide Cutters',
      'Heavy Tilting Anodized Fence Assembly',
      'Emergency Stop Foot Switch'
    ]
  },

  // 18. Woodworking Mortiser 250,000
  {
    id: 'hs-wm-250k',
    sku: 'HS-MS750-CHIS',
    name: 'Hollow Chisel Mortiser Machine HaoSail MS-750 Heavy',
    subtitle: '2.0 HP Cast Iron Bench/Floor Mortising Machine with X-Y Sliding Table',
    category: 'woodworking',
    categoryLabel: 'Woodworking Machinery',
    subCategory: 'mortising-drilling',
    subCategoryLabel: 'Drilling & Mortising',
    price: 250000,
    originalPrice: 280000,
    rating: 4.8,
    reviewsCount: 26,
    inStock: true,
    stockCount: 6,
    freightTier: 'heavy-freight',
    isFreeFreight: true,
    powerSource: 'corded-230v',
    image: chiselMortiserImg,
    specs: {
      motor: '2.0 HP Fan-Cooled Induction Motor',
      voltage: '230V / 1-Phase / 50Hz',
      amperage: '9.5 Amps',
      capacity: 'Chisel Capacity: 1/4" to 1" (6mm - 25mm), 7" Head Stroke',
      footprint: '24" W x 28" D x 68" H',
      weightLbs: 380,
      warrantyYears: 3,
      rpm: '2,850 RPM Balanced Direct-Drive Induction Motor',
      arborOrSpindle: '13mm (1/2") Heavy Keyed Chuck & 19mm (3/4") Chisel Bushing',
      bladeSize: '6mm - 25mm (1/4" to 1") Square Mortise Chisels',
    },
    description: 'Heavy cast-iron mortiser engineered for traditional mortise and tenon joinery in solid hardwood doors, frames, and furniture. Equipped with gas-strut counterbalanced head and smooth handwheel-driven X-Y axis table movement.',
    features: [
      'Two-axis sliding table with material clamp and adjustable depth/length stops',
      'Gas strut elevation cylinder eliminates operator arm fatigue during production runs',
      'Accepts standard hollow chisels with 3/4" and 1-3/16" bushing sleeves',
      'Heavy enclosed steel stand with built-in storage cabinet for bits and tooling'
    ],
    includedItems: [
      'MS-750 Mortiser Head & Enclosed Steel Base',
      'Set of 4 Premium Hollow Chisels (1/4", 3/8", 1/2", 3/4")',
      'Material Hold-Down Vise and Micro-Depth Stop Rods'
    ]
  },

  // 19. Band Saw Mill 1,250,000
  {
    id: 'hs-bsm-1250k',
    sku: 'HS-BSM800-SAW',
    name: 'Horizontal Band Sawmill Machine HaoSail BSM-800 Industrial',
    subtitle: '31" Log Diameter Capacity with 6-Metre Modular Steel Track & 15 HP Engine',
    category: 'woodworking',
    categoryLabel: 'Woodworking Machinery',
    subCategory: 'saws',
    subCategoryLabel: 'Sawmills & Heavy Timber',
    price: 1250000,
    originalPrice: 1380000,
    rating: 5.0,
    reviewsCount: 17,
    inStock: true,
    stockCount: 2,
    freightTier: 'heavy-freight',
    isFreeFreight: true,
    isPopular: true,
    powerSource: '3-phase-400v',
    image: bandSawMillImg,
    specs: {
      motor: '15.0 HP (11.0 kW) Electric Industrial Motor (or Petrol option)',
      voltage: '400V / 3-Phase / 50Hz',
      amperage: '24.0 Amps',
      capacity: '31" (800mm) Max Log Diameter, 5.2m Cutting Length',
      footprint: '36" W x 236" (6m) Track Length',
      weightLbs: 2200,
      warrantyYears: 5,
      rpm: '25 m/sec Linear Blade Velocity (900 RPM Band Wheels)',
      arborOrSpindle: '500mm Ductile Iron Crowned Flywheels with Heavy Sealed Bearings',
      bladeSize: '4,026mm x 35mm x 0.9mm Bi-Metal Hardwood Band Blade',
      dustPortSize: 'Directional Timber Sawdust Ejection Chute',
    },
    description: 'Heavy-duty horizontal bandsaw mill engineered for converting hardwood and softwood logs into precision architectural lumber, beams, and live-edge slabs. Features solid cast-iron band wheels, water-drip blade lubrication, and electric head elevation.',
    features: [
      'Cuts full 31-inch diameter logs into timber boards with less than 2mm kerf waste',
      'Heavy rigid ladder-frame steel tracks with cam-action log clamps and dogging rests',
      'Powered vertical head lift with mechanical pointer and Imperial/Metric board scale',
      'Water-coolant reservoir keeps resinous sap from binding the saw blade'
    ],
    includedItems: [
      'BSM-800 Sawhead Carriage with 15HP Electric Motor',
      '6-Metre Heavy Modular Track Sections (Extendable)',
      '3x Bi-Metal Log Saw Blades',
      'Dual Cam Log Clamps and Adjustable Log Leveler'
    ]
  },

  // 20. Floor Grinder 200,000
  {
    id: 'hs-fg-200k',
    sku: 'HS-FG300-CON',
    name: 'Concrete Floor Grinder Machine HaoSail FG-300 Commercial',
    subtitle: '4.0 HP Planetary Surface Grinder for Epoxy Prep & Concrete Polishing',
    category: 'construction-concrete',
    categoryLabel: 'Construction & Concrete',
    subCategory: 'surface-finishing',
    subCategoryLabel: 'Surface Prep & Grinders',
    price: 200000,
    originalPrice: 225000,
    rating: 4.8,
    reviewsCount: 30,
    inStock: true,
    stockCount: 8,
    freightTier: 'freight-ltl',
    isFreeFreight: true,
    powerSource: 'corded-230v',
    image: floorGrinderImg,
    specs: {
      motor: '4.0 HP (3.0 kW) Heavy Duty Motor',
      voltage: '230V / 1-Phase / 50Hz',
      amperage: '14.0 Amps',
      capacity: '300mm (12") Grinding Disc Diameter, 1,720 RPM',
      footprint: '24" W x 38" L x 42" H',
      weightLbs: 185,
      dustPortSize: '2" Vacuum Port with Floating Dust Skirt',
      warrantyYears: 2,
      rpm: '1,450 RPM Direct Drive Commercial Grinding Spindle',
      arborOrSpindle: 'Quick-Change Redi-Lock Diamond Shoe Mounting Flange',
      bladeSize: '300mm (12") Circular Grinding Head for 3 to 6 Diamond Segments',
    },
    description: 'Heavy concrete and screed surface grinder used by flooring contractors for glue removal, epoxy coating prep, concrete leveling, and surface polishing. Includes integrated shroud with vacuum attachment for dust-free operation.',
    features: [
      'Floating dust shroud maintains suction seal even over uneven concrete slabs',
      'Quick-change diamond shoe plate accepts standard 3-hole grinding segments',
      'Foldable ergonomic handle with vibration-damped grips for transport in pickup trucks',
      'Water tap connection allows instant switching between wet and dry grinding'
    ],
    includedItems: [
      'FG-300 Floor Grinder Machine',
      'Universal Magnetic Diamond Tooling Holder',
      'Set of 3 Medium-Bond 30-Grit Diamond Grinding Shoes',
      'Heavy-Duty Dust Skirt'
    ]
  },

  // 21. Wet and Dry Vacuum Cleaner 40,000
  {
    id: 'hs-vac-40k',
    sku: 'HS-WD80-VAC',
    name: 'Wet & Dry Vacuum Cleaner Machine HaoSail WD-80 Industrial',
    subtitle: '80-Litre Stainless Steel Tank with Dual 1,500W High-Suction Motors',
    category: 'workshop-tools',
    categoryLabel: 'Workshop & Tools',
    subCategory: 'cleaning-vacuums',
    subCategoryLabel: 'Industrial Vacuums',
    price: 40000,
    originalPrice: 48000,
    rating: 4.9,
    reviewsCount: 75,
    inStock: true,
    stockCount: 25,
    freightTier: 'standard-ground',
    isFreeFreight: true,
    powerSource: 'corded-230v',
    image: wetDryVacuumImg,
    specs: {
      motor: 'Dual Bypass Motors (3,000W Total Combined)',
      voltage: '230V / 1-Phase / 50Hz',
      amperage: '13.0 Amps',
      capacity: '80 Litre Stainless Steel Drum, 250 mbar Vacuum Suction',
      footprint: '22" Dia x 38" H',
      weightLbs: 58,
      warrantyYears: 2,
      rpm: '18,000 RPM Triple High-Flow Bypass Suction Turbines',
      dustPortSize: '40mm High-Flex Swivel Hose with Dual Floor Tool Ports',
    },
    description: 'High-power commercial wet and dry extractor with massive 80L stainless steel canister and dual independent vacuum motors. Cleans metal chips, sawdust, concrete slurry, and flooded workshop floors effortlessly.',
    features: [
      'Twin motors can be operated individually or simultaneously for maximum vacuum lift',
      'Corrosion-resistant stainless steel tank with tipping hinge for rapid emptying',
      'Washable cartridge filter and washable foam sleeve for liquid suction',
      'Mobile tip-trolley frame with large rear wheels and front swivel casters'
    ],
    includedItems: [
      'WD-80 Vacuum Unit with 80L Stainless Drum',
      '2.5-Metre Flexible Crush-Proof Vacuum Hose',
      'Stainless Steel S-Wand & Wet Squeegee Floor Tool',
      'Dry Floor Brush, Crevice Tool, and Round Dusting Brush'
    ]
  },

  // 22. 3D Wheel Alignment 1,200,000
  {
    id: 'hs-3da-1200k',
    sku: 'HS-3DA900-CAM',
    name: '3D Wheel Alignment Machine HaoSail 3D-900 High-Precision',
    subtitle: 'Dual High-Speed CMOS Camera Towers with Wireless Passive Wheel Targets',
    category: 'auto-maintenance',
    categoryLabel: 'Auto Maintenance & Garage',
    subCategory: 'wheel-alignment',
    subCategoryLabel: '3D Wheel Alignment',
    price: 1200000,
    originalPrice: 1350000,
    rating: 5.0,
    reviewsCount: 20,
    inStock: true,
    stockCount: 3,
    freightTier: 'heavy-freight',
    isFreeFreight: true,
    isPopular: true,
    powerSource: 'corded-230v',
    image: wheelAlignmentImg,
    specs: {
      motor: 'Precision Electronic Diagnostic Workstation',
      voltage: '230V / 1-Phase / 50Hz',
      amperage: '3.0 Amps',
      capacity: 'Cars, SUVs & Light Trucks (Wheel Sizes 11"-25")',
      footprint: '110" Crossbeam Width x 78" Camera Column Height',
      weightLbs: 450,
      warrantyYears: 5,
      rpm: '60 FPS High-Speed Real-Time Digital Optical Tracking',
      arborOrSpindle: '4x Self-Centering High-Grip Rim Clamps (11"-25" Targets)',
    },
    description: 'State-of-the-art 3D computer wheel alignment system matching the diagnostic station seen in the HaoSail flagship workshop. Features high-definition optical recognition cameras, maintenance-free passive targets with no electronic sensors on the wheels, and an extensive global vehicle database with free lifetime updates.',
    features: [
      'Passive target plates contain no batteries or cables, eliminating sensor drops/breakage',
      'Measures Toe, Camber, Caster, SAI, Thrust Angle, and Setback in under 90 seconds',
      'Includes 32-inch high-resolution LED monitor with 3D animated alignment adjustment guides',
      'Voice prompts guide the technician through steering wheel leveling and runout compensation'
    ],
    includedItems: [
      'HaoSail Blue Heavy Camera Crossbeam & Central Tower',
      'Deluxe Mobile Console Cabinet with PC, 32" Display & Printer',
      'Four Rugged High-Definition Polymeric Target Discs with 4-Point Clamps',
      'Steering Wheel Lock and Brake Pedal Depressor Rod'
    ]
  },

  // 23. Wheel Balancer 210,000
  {
    id: 'hs-wb-210k',
    sku: 'HS-WB800-LED',
    name: 'Wheel Balancer Machine HaoSail WB-800 Dynamic',
    subtitle: 'Microprocessor Digital Wheel Balancer with Laser Weight Pointer & Hood',
    category: 'auto-maintenance',
    categoryLabel: 'Auto Maintenance & Garage',
    subCategory: 'tyre-wheel',
    subCategoryLabel: 'Tyre & Wheel Service',
    price: 210000,
    originalPrice: 235000,
    rating: 4.8,
    reviewsCount: 47,
    inStock: true,
    stockCount: 9,
    freightTier: 'freight-ltl',
    isFreeFreight: true,
    powerSource: 'corded-230v',
    image: wheelBalancerImg,
    specs: {
      motor: '0.35 HP High-Precision Low-RPM Balance Motor',
      voltage: '230V / 1-Phase / 50Hz',
      amperage: '2.5 Amps',
      capacity: 'Rim Diameter: 10"-24", Max Wheel Weight: 65 kg',
      footprint: '42" W x 38" D x 48" H',
      weightLbs: 290,
      warrantyYears: 3,
      rpm: '200 RPM Ultra-Low Velocity Balancing Cycle',
      arborOrSpindle: '36mm Precision Threaded Spindle with Quick-Release Wingnut',
    },
    description: 'High-accuracy digital electronic wheel balancer for alloy and steel wheels. Features automatic measurement of distance and diameter, multiple ALU balance modes for concealed stick-on weights, and laser line indicator for weight placement.',
    features: [
      '1-gram measurement precision with quick 7-second automatic spin cycle',
      'Concealed weight program hides adhesive lead segments behind wheel spokes',
      'Automatic protective hood-down start and auto-brake positioning upon spin completion',
      'Self-calibration and self-diagnosis routines guarantee enduring accuracy'
    ],
    includedItems: [
      'WB-800 Balancer Console with Weight Storage Trays',
      'Quick-Release Wing Nut and 4 Balancing Cones (42mm-137mm)',
      'Wheel Weight Pliers and Rim Width Measuring Calipers',
      '100g Calibration Test Weight'
    ]
  },

  // 24. Two Post Lift 380,000
  {
    id: 'hs-2p-380k',
    sku: 'HS-2PL4000-CLR',
    name: 'Two Post Lift Machine HaoSail 2P-4000 4.0 Tonne Clear-Floor',
    subtitle: 'Heavy Hydraulic Automotive Lift with Overhead Beam (As Seen in Workshop Hero)',
    category: 'auto-maintenance',
    categoryLabel: 'Auto Maintenance & Garage',
    subCategory: 'vehicle-lifts',
    subCategoryLabel: 'Vehicle Lifts (2-Post)',
    price: 380000,
    originalPrice: 420000,
    rating: 5.0,
    reviewsCount: 56,
    inStock: true,
    stockCount: 6,
    freightTier: 'heavy-freight',
    isFreeFreight: true,
    isPopular: true,
    powerSource: '3-phase-400v',
    image: twoPostLiftImg,
    specs: {
      motor: '3.0 HP (2.2 kW) Hydraulic Power Unit',
      voltage: '400V / 3-Phase (230V 1-Phase available on request)',
      amperage: '7.5 Amps',
      capacity: '4,000 kg (8,800 lbs) Capacity, 1,900mm Max Lift Height',
      footprint: '136" Overall Width x 146" Column Height',
      weightLbs: 1540,
      warrantyYears: 5,
      rpm: '1,450 RPM Heavy Electric-Hydraulic Pump Unit (45s Rise)',
      arborOrSpindle: 'Dual Hydraulic Direct-Drive Cylinders with Aircraft Equalizing Cables',
    },
    description: 'The iconic two-post overhead clear-floor hydraulic hoist showcased prominently in our HaoSail workshop hero image. Features symmetric/asymmetric lifting arms, dual direct-drive hydraulic cylinders, aircraft-grade equalization cables, and automatic arm restraints.',
    features: [
      'Clear-floor design allows unobstructed movement of transmission jacks and oil drainers',
      'Dual hydraulic direct-drive cylinders with heavy leaf chains for silky lift action',
      'Overhead safety shut-off bar prevents tall vehicles from touching the top crossbeam',
      'Manual dual-point safety lock release with mechanical locking ladders'
    ],
    includedItems: [
      'Dual Structural Steel Columns in HaoSail Blue',
      'Overhead Crossbeam with Safety Trip Switch',
      'Four 2-Stage & 3-Stage Telescopic Lifting Arms with Drop-In Pads',
      'Complete Heavy Anchor Bolts and Hydraulic Power Unit'
    ]
  },

  // 24. Power Trowel 110,000
  {
    id: 'hs-pt-110k',
    sku: 'HS-PT36-CON',
    name: 'Concrete Power Trowel Machine HaoSail PT-36 36" Walk-Behind',
    subtitle: '6.5 HP Commercial Concrete Finishing Trowel with 4 Finishing Blades',
    category: 'construction-concrete',
    categoryLabel: 'Construction & Concrete',
    subCategory: 'concrete-finishing',
    subCategoryLabel: 'Power Trowels & Screeds',
    price: 110000,
    originalPrice: 125000,
    rating: 4.9,
    reviewsCount: 34,
    inStock: true,
    stockCount: 11,
    freightTier: 'freight-ltl',
    isFreeFreight: true,
    powerSource: 'all',
    image: powerTrowelImg,
    specs: {
      motor: '6.5 HP 4-Stroke OHV Petrol Engine',
      voltage: 'Petrol Engine (Recoil Start)',
      amperage: 'N/A',
      capacity: '36" (900mm) Trowel Rotor Diameter, 60-120 RPM Blade Speed',
      footprint: '38" Dia x 65" L (Handle Extended)',
      weightLbs: 175,
      warrantyYears: 2,
      rpm: '60 - 120 RPM Variable Blade Operating Speed',
      arborOrSpindle: 'Heavy Bronze Alloy Worm Gearbox with Pitch Control Thrust Bearing',
      bladeSize: '4x 350mm x 150mm High-Carbon Spring Steel Finishing Blades',
    },
    description: 'Commercial walk-behind concrete power trowel (helicopter) used for floating and mirror-smooth finishing of large concrete warehouse slabs, aprons, and industrial floors.',
    features: [
      'Heavy-duty gearbox with bronze worm gear ensures continuous long service life',
      'Precision blade pitch control knob allows effortless adjustment on the fly',
      'Dead-man safety switch shuts down the engine instantly if operator releases grip',
      'Includes combination blades and heavy steel safety protection ring'
    ],
    includedItems: [
      'PT-36 Power Trowel with 6.5HP OHV Engine',
      'Set of 4 Precision Heat-Treated Carbon Steel Finishing Blades',
      'Lifting Hook Bar for Crane or Hoist Transport'
    ]
  },

  // 27. Plate Compactor 100,000
  {
    id: 'hs-pc-100k',
    sku: 'HS-PC90-VIB',
    name: 'Vibratory Plate Compactor Machine HaoSail PC-90 90kg Heavy',
    subtitle: '6.5 HP Forward Soil & Asphalt Compactor with Water Tank & Wheel Kit',
    category: 'construction-concrete',
    categoryLabel: 'Construction & Concrete',
    subCategory: 'compaction',
    subCategoryLabel: 'Plate Compactors',
    price: 100000,
    originalPrice: 115000,
    rating: 4.8,
    reviewsCount: 42,
    inStock: true,
    stockCount: 15,
    freightTier: 'freight-ltl',
    isFreeFreight: true,
    powerSource: 'all',
    image: plateCompactorImg,
    specs: {
      motor: '6.5 HP 4-Stroke OHV Engine',
      voltage: 'Petrol Engine',
      amperage: 'N/A',
      capacity: '15 kN (3,370 lbs) Impact Force, 5,500 VPM Frequency',
      footprint: '21" x 20" Plate Size',
      weightLbs: 198,
      warrantyYears: 2,
      rpm: '5,500 VPM High-Frequency Compactor Exciter',
      arborOrSpindle: 'High-Strength Ductile Iron Base Plate (530mm x 500mm)',
    },
    description: 'Robust vibratory plate compactor for compacting road sub-bases, paving stones, sand, gravel, and asphalt patching. Includes built-in water sprinkler tank to prevent asphalt adhesion.',
    features: [
      'Ductile cast iron base plate provides extreme wear resistance and longevity',
      'Integrated water tank with sprinkler pipe for asphalt rolling and dust suppression',
      'Fold-down transport wheel kit allows one person to wheel the compactor across site',
      'Isolated rubber vibration dampeners protect operator hands and engine mounts'
    ],
    includedItems: [
      'PC-90 Vibratory Compactor Base Unit',
      '12-Litre Removable Water Tank & Sprinkler Hose',
      'Flip-Down Transport Wheel Kit',
      'Engine Spark Plug Tool Kit'
    ]
  },

  // 28. Road Roller 700,000
  {
    id: 'hs-rr-700k',
    sku: 'HS-RR800-DRM',
    name: 'Double Drum Vibratory Road Roller Machine HaoSail RR-800 800kg',
    subtitle: 'Walk-Behind/Ride Tandem Vibratory Roller with Diesel Engine & Hydraulic Drive',
    category: 'construction-concrete',
    categoryLabel: 'Construction & Concrete',
    subCategory: 'compaction',
    subCategoryLabel: 'Vibratory Road Rollers',
    price: 700000,
    originalPrice: 780000,
    rating: 5.0,
    reviewsCount: 12,
    inStock: true,
    stockCount: 3,
    freightTier: 'heavy-freight',
    isFreeFreight: true,
    isPopular: true,
    powerSource: 'all',
    image: roadRollerImg,
    specs: {
      motor: '9.0 HP Air-Cooled Industrial Diesel Engine',
      voltage: '12V Electric Starter Battery with Key Switch',
      amperage: 'N/A',
      capacity: '20 kN Centrifugal Force, 700mm Drum Width',
      footprint: '84" L x 34" W x 48" H',
      weightLbs: 1760,
      warrantyYears: 3,
      rpm: '3,000 VPM Hydrostatic Vibratory Drum Exciter',
      arborOrSpindle: 'Dual Heavy Machined Steel Roller Drums with Scrapers & Water Sprinklers',
    },
    description: 'Heavy tandem double-drum vibratory road roller designed for asphalt paving, driveway construction, road shoulder repair, and deep trench soil compaction. Features fully hydrostatic drive with stepless speed control.',
    features: [
      'Both front and rear steel drums driven hydrostatically for superior slope climbing',
      'High-energy 20 kN electromagnetic vibratory clutch for deep compaction depth',
      'Pressurized dual water sprinkler bars with scraper bars on both drums',
      'Deadman reversing safety lever prevents operator entrapment during reverse travel'
    ],
    includedItems: [
      'RR-800 Tandem Road Roller Complete Unit',
      '12V Heavy-Duty Starter Battery',
      '30-Litre Water Sprinkler Tank with Dual Spray Bars',
      'Operating & Maintenance Toolkit'
    ]
  },

  // 29. Concrete Vibrator 60,000
  {
    id: 'hs-cv-60k',
    sku: 'HS-CV2200-POK',
    name: 'Concrete Poker Vibrator Machine HaoSail CV-2200 Industrial',
    subtitle: '3.0 HP High-Frequency Electric Motor with 6-Metre Flexible Shaft & Needle',
    category: 'construction-concrete',
    categoryLabel: 'Construction & Concrete',
    subCategory: 'concrete-pouring',
    subCategoryLabel: 'Concrete Poker Vibrators',
    price: 60000,
    originalPrice: 70000,
    rating: 4.8,
    reviewsCount: 50,
    inStock: true,
    stockCount: 20,
    freightTier: 'standard-ground',
    isFreeFreight: true,
    powerSource: 'corded-230v',
    image: concreteVibratorImg,
    specs: {
      motor: '3.0 HP (2.2 kW) High-Torque Copper Motor',
      voltage: '230V / 1-Phase / 50Hz',
      amperage: '10.0 Amps',
      capacity: '6-Metre Flexible Drive Shaft with 45mm Hardened Steel Needle Head',
      footprint: '20" W x 16" D x 18" H (Drive Motor Base)',
      weightLbs: 65,
      warrantyYears: 2,
      rpm: '12,000 VPM High-Frequency Concrete Poker Head',
      arborOrSpindle: 'Reinforced Flexible Drive Core with Dynapac / Hex Quick Coupling',
      bladeSize: '38mm / 50mm High-Amplitude Heavy Poker Needle',
    },
    description: 'Essential concrete construction tool for eliminating air bubbles and voids in reinforced concrete columns, foundation footings, and floor slabs. Built on a protective tubular roll-cage with anti-vibration rubber mounts.',
    features: [
      'Heavy-duty 100% copper wound electric motor housed in rugged tubular roll cage',
      '6-metre reinforced rubber flexible shaft with quick-connect claw coupling',
      '45mm hardened manganese steel poker head produces 12,000 VPM immersion vibration',
      'Thermal overload protection switch prevents motor burn under continuous casting'
    ],
    includedItems: [
      'CV-2200 3HP Drive Motor in Steel Cradle Base',
      '6-Metre Heavy-Duty Flexible Shaft Assembly',
      '45mm Hardened Steel Vibrator Poker Head'
    ]
  },

  // 30. Tamping Rammer 100,000
  {
    id: 'hs-tr-100k',
    sku: 'HS-TR75-RAM',
    name: 'Tamping Rammer Machine HaoSail TR-75 75kg (Jumping Jack)',
    subtitle: '5.5 HP High-Impact Trench Compactor with Dual Air Filter System',
    category: 'construction-concrete',
    categoryLabel: 'Construction & Concrete',
    subCategory: 'compaction',
    subCategoryLabel: 'Tamping Rammers',
    price: 100000,
    originalPrice: 115000,
    rating: 4.8,
    reviewsCount: 39,
    inStock: true,
    stockCount: 12,
    freightTier: 'freight-ltl',
    isFreeFreight: true,
    isPopular: true,
    powerSource: 'all',
    image: tampingRammerImg,
    specs: {
      motor: '5.5 HP 4-Stroke OHV Engine',
      voltage: 'Petrol Engine',
      amperage: 'N/A',
      capacity: '14 kN Impact Force, 650-700 Blows Per Minute',
      footprint: '13" W x 28" D x 42" H (Foot Plate 11" x 13")',
      weightLbs: 165,
      warrantyYears: 2,
      rpm: '650 - 700 Blows/min High-Impact Percussion Cycle',
      arborOrSpindle: 'Oil-Bath Splash Lubricated Crank Gearbox with Double Spring Piston',
    },
    description: 'Heavy upright jumping jack rammer engineered for cohesive clay soils, trench backfilling, pipeline bedding, and tight foundations where plate compactors cannot reach.',
    features: [
      'Heavy-duty German polyurethane ribbed bellows withstand high fatigue cycles',
      'Laminated steel and wooden shoe plate absorbs impact shock while delivering 14 kN compaction',
      'Dual multi-stage air filtration prevents engine dust ingestion in deep dry trenches',
      'Low hand-arm vibration guide handle protects the operator over long working shifts'
    ],
    includedItems: [
      'TR-75 Tamping Rammer Assembly',
      'Transport Wheel Trolley for Site Movement',
      'Engine Maintenance Tool Kit'
    ]
  },

  // 31. Foam Machine / Foam Generator 60,000
  {
    id: 'hs-fm-60k',
    sku: 'HS-FM500-AIR',
    name: 'Pneumatic Foam Generator Machine HaoSail FM-500',
    subtitle: '70-Litre Stainless Steel Foam Dispenser with Pressure Regulator',
    category: 'workshop-tools',
    categoryLabel: 'Workshop & Tools',
    subCategory: 'cleaning-vacuums',
    subCategoryLabel: 'Cleaning & Foam Generators',
    price: 60000,
    originalPrice: 70000,
    rating: 4.8,
    reviewsCount: 33,
    inStock: true,
    stockCount: 16,
    freightTier: 'standard-ground',
    isFreeFreight: true,
    powerSource: 'all',
    image: foamMachineImg,
    specs: {
      motor: 'Pneumatic Pressure Agitation Unit',
      voltage: 'Air Powered (2-4 Bar Working Pressure)',
      amperage: 'N/A',
      capacity: '70 Litre Stainless Steel Pressure Tank',
      footprint: '16" Dia x 34" H',
      weightLbs: 45,
      warrantyYears: 2,
      rpm: 'Pressurized Foam Expansion Vessel (2 - 3 Bar Operating)',
      dustPortSize: '1/4" NPT Air Inlet with 8 Metre Detergent Foam Delivery Hose',
    },
    description: 'High-density foam generation station for automotive wash bays, industrial machinery degreasing, and concrete release agent spraying. Creates rich shaving-cream consistency foam that clings to vertical vehicle and machine panels.',
    features: [
      'Heavy-gauge polished stainless steel tank resistant to acids and alkaline detergents',
      'Safety pressure relief valve and glycerine pressure gauge prevent over-pressurization',
      'Includes 10-meter chemical-resistant hose and stainless steel spray lance with foam nozzle',
      'Dual wide wheels and ergonomic front handle for effortless mobility across wash bays'
    ],
    includedItems: [
      '70L Stainless Steel Pressure Tank on Wheels',
      '10-Metre Chemical Hose with Quick-Release Coupler',
      'Stainless Foam Spray Lance and Specialized Foam Nozzle'
    ]
  },

  // 32. Concrete Mixer 450,000
  {
    id: 'hs-cm-450k',
    sku: 'HS-CM400-HYD',
    name: 'Hydraulic Hopper Concrete Mixer Machine HaoSail CM-400 400L',
    subtitle: 'Heavy Site Concrete Mixer with Hydraulic Loader Skip & Diesel/Electric Power',
    category: 'construction-concrete',
    categoryLabel: 'Construction & Concrete',
    subCategory: 'concrete-pouring',
    subCategoryLabel: 'Concrete Mixers',
    price: 450000,
    originalPrice: 495000,
    rating: 4.9,
    reviewsCount: 27,
    inStock: true,
    stockCount: 5,
    freightTier: 'heavy-freight',
    isFreeFreight: true,
    isPopular: true,
    powerSource: '3-phase-400v',
    image: concreteMixerImg,
    specs: {
      motor: '7.5 HP (5.5 kW) Heavy Induction Motor (or 10HP Diesel)',
      voltage: '400V / 3-Phase / 50Hz',
      amperage: '12.0 Amps',
      capacity: '400 Litre (14 cu.ft) Drum Batch Capacity, 15-20 m³/hr Output',
      footprint: '78" L x 54" W x 84" H',
      weightLbs: 1850,
      warrantyYears: 3,
      rpm: '18 - 22 RPM Reversible Hydraulic Mixing Drum',
      arborOrSpindle: 'Heavy-Gauge Welded Mixing Blades & Segmented Cast Iron Bull Gear',
    },
    description: 'Heavy-duty site concrete batch mixer equipped with hydraulic tipping skip (loading hopper) and water dosing system. Built with heavy cast-iron gear ring and precision curved mixing blades for uniform slump concrete and structural mortar.',
    features: [
      'Hydraulic loading skip dumps gravel and cement bags straight into the drum effortlessly',
      'Precision machined cast iron ring gear and pinion driven with enclosed guard',
      'Dual pneumatic towing wheels with heavy-duty leaf spring towing drawbar',
      'Handwheel controlled drum tilting mechanism with multi-position lock'
    ],
    includedItems: [
      'CM-400 Heavy Concrete Mixer Unit with Hydraulic Skip',
      'Pneumatic Towing Wheels and Tow Hitch Bar',
      'Water Tank Metering System',
      'Electrical Control Box with Forward/Reverse Drum Switch'
    ]
  },

  // 33. Oil Drainer 40,000
  {
    id: 'hs-od-40k',
    sku: 'HS-OD80-AIR',
    name: 'Waste Oil Drainer & Extractor Machine HaoSail OD-80 Pneumatic',
    subtitle: '80-Litre Tank with Telescopic Catch Basin & Venturi Suction Probes',
    category: 'auto-maintenance',
    categoryLabel: 'Auto Maintenance & Garage',
    subCategory: 'lubrication',
    subCategoryLabel: 'Waste Oil Drainage',
    price: 40000,
    originalPrice: 48000,
    rating: 4.9,
    reviewsCount: 58,
    inStock: true,
    stockCount: 19,
    freightTier: 'standard-ground',
    isFreeFreight: true,
    powerSource: 'all',
    image: oilDrainerImg,
    specs: {
      motor: 'Pneumatic Venturi Vacuum Generator',
      voltage: 'Pneumatic (Compressed Air Ejection)',
      amperage: 'N/A',
      capacity: '80 Litre Tank + 15 Litre Telescopic Overhead Basin',
      footprint: '20" Dia x 52"-74" Adjustable Height',
      weightLbs: 62,
      warrantyYears: 2,
      rpm: 'Venturi Vacuum Suction Evacuation Rate: 1.5 - 2.0 L/min',
      dustPortSize: '1/4" Quick Pneumatic Connection & Flexible Suction Probes',
    },
    description: 'Essential garage service equipment for automotive vehicle oil changes. Functions both as an under-lift gravity catch drainer and as an extraction unit that pulls oil straight out of the dipstick tube using venturi vacuum suction.',
    features: [
      'Height-adjustable 15-litre wide-mouth steel catch funnel with anti-splash filter screen',
      'Pneumatic self-evacuation feature empties the 80L tank into waste drums in under 2 minutes',
      'Transparent level sight tube lets technicians check collected waste oil volume at a glance',
      'Supplied with 6 flexible and metal suction probes for engine dipstick oil extraction'
    ],
    includedItems: [
      'OD-80 Heavy Steel Tank with 4 Wheels and Handle',
      'Telescopic Drain Bowl with Swivel Ball Valve',
      'Set of 6 Dipstick Vacuum Extraction Probes and Adaptor Block',
      'Discharge Hose with Goose Neck Metal Outlet'
    ]
  },

  // 34. Air Gauge / Digital Inflator Station 80,000
  {
    id: 'hs-ag-80k',
    sku: 'HS-AG150-DIG',
    name: 'Digital Tyre Inflation Station Machine HaoSail AG-150 Commercial',
    subtitle: 'Wall-Mount Automatic Preset Digital Tyre Inflator with Nitrogen Mode',
    category: 'auto-maintenance',
    categoryLabel: 'Auto Maintenance & Garage',
    subCategory: 'tyre-wheel',
    subCategoryLabel: 'Tyre & Wheel Service',
    price: 80000,
    originalPrice: 92000,
    rating: 4.9,
    reviewsCount: 31,
    inStock: true,
    stockCount: 14,
    freightTier: 'standard-ground',
    isFreeFreight: true,
    powerSource: 'corded-230v',
    image: airInflatorImg,
    specs: {
      motor: 'Solid-State Ceramic Pressure Sensor & Solenoid Valve',
      voltage: '230V / 1-Phase / 50Hz',
      amperage: '0.5 Amps',
      capacity: '0 - 150 PSI (0 - 10 Bar) Range with ±0.5% Calibration Precision',
      footprint: '12" W x 5" D x 16" H',
      weightLbs: 18,
      warrantyYears: 3,
      rpm: 'Digital Microprocessor Response < 0.2s',
      dustPortSize: '1/4" High-Pressure Air Coupling with 10m Heavy Air Hose',
    },
    description: 'High-precision wall-mounted digital tyre inflation station designed for commercial petrol stations, tyre fitment centers, and fleet depots. Technicians key in the desired PSI or Bar, clamp the chuck, and the unit automatically inflates or deflates with acoustic beep completion.',
    features: [
      'High-luminance large LED digital readout visible in direct outdoor sunlight',
      'Over-pressure cycle purge mode for seating new tyre beads automatically',
      'Vandal-resistant IP65 aluminum die-cast housing built for outdoor weather exposure',
      'Includes 10-metre heavy rubber airline hose with clip-on open-ended tyre chuck'
    ],
    includedItems: [
      'AG-150 Digital Wall Station with Aluminum Enclosure',
      '10-Metre Commercial Airline Hose with Lock-On Brass Chuck',
      'Wall Mounting Bracket and Hardware Set',
      'Factory Pressure Calibration Certificate'
    ]
  },

  // 35. Industrial Air Compressor
  {
    id: 'hs-ac-180k',
    sku: 'HS-AC3000-BLU',
    name: 'Industrial Air Compressor Machine HaoSail AC-3000 Belt-Drive',
    subtitle: '5.5 HP High-Output Cast Iron 200L Air Compressor in HaoSail Blue',
    category: 'workshop-tools',
    categoryLabel: 'Workshop & Tools',
    subCategory: 'air-compressors',
    subCategoryLabel: 'Air Compressors & Air Tools',
    price: 180000,
    originalPrice: 205000,
    rating: 4.9,
    reviewsCount: 41,
    inStock: true,
    stockCount: 12,
    freightTier: 'heavy-freight',
    isFreeFreight: true,
    isPopular: true,
    powerSource: 'corded-230v',
    image: airCompressorImg,
    specs: {
      motor: '5.5 HP (4.0 kW) High-Torque Induction Motor',
      voltage: '230V / 1-Phase / 50Hz (or 400V 3-Phase)',
      amperage: '16.0 Amps',
      capacity: '200 Litre Tank, 24.5 CFM (695 L/min), 12.5 Bar (180 PSI) Max',
      footprint: '58" L x 22" W x 44" H',
      weightLbs: 340,
      warrantyYears: 3,
      rpm: '1,050 RPM Low-Speed Cast Iron V-Twin Pump (1,450 RPM Motor)',
      arborOrSpindle: 'Dynamic Balanced Cast Iron V-Belt Pulley & Flywheel',
      dustPortSize: 'Dual 1/4" Quick-Release High-Flow Brass Couplers',
    },
    description: 'Heavy-duty 200-litre two-stage belt-drive workshop air compressor with solid cast iron V-twin pump cylinder, oil-sight glass, aftercooler tubes, and heavy four-wheel mobility kit.',
    features: [
      'Two-stage solid cast iron compression pump head for low operating temperature and long lifespan',
      'Large 200-litre pressure vessel certified to international safety standards',
      'Dual pressure gauges with industrial quick-connect brass couplings and regulator',
      'Heavy-gauge steel wire safety belt guard and vibration-absorbing rubber feet'
    ],
    includedItems: [
      'AC-3000 200L Air Compressor Unit in HaoSail Blue',
      'Dual Quick-Connect Couplers and Pressure Regulator Assembly',
      'Four Rugged Workshop Wheels and Transport Handle',
      'Initial Fill Synthetic Air Compressor Lubricant'
    ]
  },

  // 36. Rolling Tool Cabinet
  {
    id: 'hs-tc-95k',
    sku: 'HS-TC7D-MEC',
    name: 'Mobile Tool Cabinet Machine HaoSail TC-7D Multi-Drawer Auto Shop',
    subtitle: '7-Drawer Heavy-Duty Mechanic Roller Cabinet with Ball-Bearing Slides',
    category: 'auto-maintenance',
    categoryLabel: 'Auto Maintenance & Garage',
    subCategory: 'workshop-storage',
    subCategoryLabel: 'Tool Storage & Cabinets',
    price: 95000,
    originalPrice: 110000,
    rating: 4.9,
    reviewsCount: 46,
    inStock: true,
    stockCount: 16,
    freightTier: 'freight-ltl',
    isFreeFreight: true,
    isPopular: true,
    powerSource: 'all',
    image: toolboxCartImg,
    specs: {
      motor: 'Mechanical Lockable Rolling Storage Unit',
      voltage: 'Non-Electric',
      amperage: 'N/A',
      capacity: '7 Ball-Bearing Slide Drawers, 450 kg Total Load Capacity',
      footprint: '30" W x 19" D x 38" H',
      weightLbs: 165,
      warrantyYears: 5,
      rpm: 'Full-Extension Ball-Bearing Slides (45 kg per drawer)',
      arborOrSpindle: '5-inch Heavy Polyurethane Castor Wheels with Foot Brake Locks',
    },
    description: 'Heavy-gauge steel 7-drawer auto mechanic tool trolley finished in distinctive HaoSail blue and textured black powder coat. Features 100% full-extension ball-bearing slides with EVA foam drawer liners, side pegboard panel, and cylinder central locking.',
    features: [
      'Heavy 1.2mm cold-rolled steel construction with reinforced double-wall frame',
      'Smooth ball-bearing slides with 45 kg load capacity per drawer and auto-catch closing',
      'Perforated side panels for hanging impact wrenches, air tools, and accessories',
      '5-inch heavy-duty polyurethane caster wheels (2 fixed, 2 swivel with total lock brakes)'
    ],
    includedItems: [
      'TC-7D 7-Drawer Mobile Cabinet in HaoSail Blue',
      'Set of 7 Pre-Cut Non-Slip EVA Foam Drawer Liners',
      'Two Master Cylinder Security Keys',
      'Heavy Tubular Side Steering Handle'
    ]
  },

  // 37. Auto Body Frame Girder Corrector
  {
    id: 'hs-gc-1450k',
    sku: 'HS-GC500-FRM',
    name: 'Auto Body Frame Machine HaoSail GC-500 Heavy Girder Corrector',
    subtitle: '10-Tonne Hydraulic Collision Repair Bench with 360-Degree Pulling Towers',
    category: 'auto-maintenance',
    categoryLabel: 'Auto Maintenance & Garage',
    subCategory: 'collision-repair',
    subCategoryLabel: 'Collision Repair & Frame Pulling',
    price: 1450000,
    originalPrice: 1600000,
    rating: 5.0,
    reviewsCount: 18,
    inStock: true,
    stockCount: 3,
    freightTier: 'heavy-freight',
    isFreeFreight: true,
    isPopular: true,
    powerSource: 'all',
    image: girderCorrectorImg,
    specs: {
      motor: 'High-Pressure Pneumatic-Hydraulic Foot Pumps (10,000 PSI)',
      voltage: 'Air-Hydraulic (6-8 Bar Air Required)',
      amperage: 'N/A',
      capacity: '10 Tonne (22,000 lbs) Tower Pulling Force, 5.6m Bench Length',
      footprint: '220" L x 84" W x 86" Tower Height',
      weightLbs: 4850,
      warrantyYears: 5,
      rpm: 'Continuous 10-Ton High-Tension Hydraulic Tower Pulling',
      arborOrSpindle: '360° Circular Pulling Towers with Universal Unibody Anchoring Clamps',
    },
    description: 'Professional commercial collision auto body frame straightening bench and girder corrector system. Built with CNC laser-cut manganese steel deck, dual 360-degree round-collar pulling towers, universal vehicle sill clamps, and pneumatic-hydraulic foot pumps.',
    features: [
      'Heavy manganese alloy rectangular tube deck allows vehicle pulling from any angle',
      'Two movable 10-tonne hydraulic pulling towers glide effortlessly along the perimeter track',
      'Universal 4-clamp vehicle anchoring sills adjust for unibody cars, SUVs, and light pickups',
      'Supplied with comprehensive sheet metal pulling chains, hooks, and sheet clamps'
    ],
    includedItems: [
      '5.6m Manganese Steel Frame Bench with In-Deck Hydraulics',
      'Two 10-Tonne Hydraulic Pulling Towers with Chains and Hooks',
      'Four Universal Vehicle Sill Clamps',
      'Dual Pneumatic-Hydraulic Foot Actuation Pumps'
    ]
  },

  // 38. Gasoline High Pressure Washer
  {
    id: 'hs-gpw-120k',
    sku: 'HS-PW2500-GAS',
    name: 'Gasoline High Pressure Washer Machine HaoSail PW-2500 Heavy-Duty',
    subtitle: '7.0 HP Commercial Petrol Pressure Washer with Brass Triplex Pump (2,500 PSI)',
    category: 'workshop-tools',
    categoryLabel: 'Workshop & Tools',
    subCategory: 'pressure-washers',
    subCategoryLabel: 'High-Pressure Washers',
    price: 120000,
    originalPrice: 135000,
    rating: 4.8,
    reviewsCount: 37,
    inStock: true,
    stockCount: 14,
    freightTier: 'freight-ltl',
    isFreeFreight: true,
    powerSource: 'all',
    image: gasPressureWasherImg,
    specs: {
      motor: '7.0 HP 4-Stroke OHV Commercial Petrol Engine',
      voltage: 'Petrol Engine (Recoil Start)',
      amperage: 'N/A',
      capacity: '2,500 PSI (170 Bar), 12 L/min (3.2 GPM) Flow',
      footprint: '26" L x 22" W x 38" H',
      weightLbs: 88,
      warrantyYears: 2,
      rpm: '3,400 RPM Direct Drive Brass Triplex Plunger Pump',
      dustPortSize: 'M22 Threaded High-Pressure Outlet with 5 Quick-Connect Spray Tips',
    },
    description: 'Commercial mobile engine-driven pressure washer engineered for agricultural equipment washdown, truck fleet cleaning, construction site wash, and building maintenance where electric outlets are unavailable.',
    features: [
      'Commercial forged brass manifold triplex plunger pump with ceramic pistons',
      'Integrated detergent siphon tube with chemical dosage control',
      'Heavy tubular powder-coated steel cart with 10-inch pneumatic all-terrain wheels',
      'Includes 5 quick-connect spray nozzles (0°, 15°, 25°, 40°, and soap)'
    ],
    includedItems: [
      'PW-2500 Engine & Pump Cart Assembly',
      '10-Metre Steel-Braided High Pressure Rubber Hose',
      'Professional Trigger Gun with Insulated Stainless Steel Lance',
      'Set of 5 Color-Coded Quick-Connect Nozzle Tips'
    ]
  },

  // 39. Commercial Electric High Pressure Washer
  {
    id: 'hs-epw-175k',
    sku: 'HS-PW3000-ELE',
    name: 'Electric High Pressure Washer Machine HaoSail PW-3000 Commercial Triplex',
    subtitle: '5.5 HP Induction Motor with Stainless Steel Enclosure (3,000 PSI / 200 Bar)',
    category: 'workshop-tools',
    categoryLabel: 'Workshop & Tools',
    subCategory: 'pressure-washers',
    subCategoryLabel: 'High-Pressure Washers',
    price: 175000,
    originalPrice: 195000,
    rating: 4.9,
    reviewsCount: 32,
    inStock: true,
    stockCount: 9,
    freightTier: 'heavy-freight',
    isFreeFreight: true,
    powerSource: '3-phase-400v',
    image: electricPressureWasherImg,
    specs: {
      motor: '5.5 HP (4.0 kW) 4-Pole Low-RPM Heavy Induction Motor',
      voltage: '400V / 3-Phase / 50Hz (or 230V 1-Ph)',
      amperage: '8.5 Amps',
      capacity: '3,000 PSI (200 Bar), 15 L/min (4.0 GPM)',
      footprint: '34" L x 20" W x 28" H',
      weightLbs: 145,
      warrantyYears: 3,
      rpm: '1,450 RPM Low-Speed Industrial Ceramic Plunger Pump',
      dustPortSize: 'M22 Heavy Brass Coupler with Adjustable Detergent Suction',
    },
    description: 'Continuous-duty commercial electric high-pressure cleaner designed for auto wash centers, industrial plants, meat processing factories, and fleet depots. Features Italian-style brass triplex pump, ceramic pistons, stainless steel body cover, and auto-stop delay timer.',
    features: [
      'Low-speed 1,450 RPM motor runs cooler and dramatically extends pump seal life',
      'Stainless steel 304 protective body shroud and water inlet filter strainer',
      'Thermal relief valve protects the pump from overheating during bypass mode',
      'Supplied with water inlet suction hose and heavy-duty foam lance applicator'
    ],
    includedItems: [
      'PW-3000 Triplex Electric Washer Unit on Wheels',
      '10-Metre Steel-Wire Reinforced Hydraulic Pressure Hose',
      'Heavy-Duty Ergonomic Wash Gun with Stainless Steel Lance',
      'Snow Foam Cannon and High-Pressure Quick-Connect Nozzles'
    ]
  },

  // 40. Tyre Tube & Plate Vulcanizer
  {
    id: 'hs-vlc-45k',
    sku: 'HS-VZ500-TYR',
    name: 'Tyre Tube & Plate Vulcanizer Machine HaoSail VZ-500 Temperature-Adjustable',
    subtitle: '500W Electric Spot & Tube Vulcanizing Machine with Timer & Adjustable C-Clamp',
    category: 'auto-maintenance',
    categoryLabel: 'Auto Maintenance & Garage',
    subCategory: 'tyre-wheel',
    subCategoryLabel: 'Tyre & Wheel Service',
    price: 45000,
    originalPrice: 52000,
    rating: 4.8,
    reviewsCount: 29,
    inStock: true,
    stockCount: 18,
    freightTier: 'standard-ground',
    isFreeFreight: true,
    powerSource: 'corded-230v',
    image: vulcanizerMachineImg,
    specs: {
      motor: '500W High-Efficiency Electric Heating Element',
      voltage: '230V / 1-Phase / 50Hz',
      amperage: '2.5 Amps',
      capacity: 'Temperature Range: 140°C - 165°C, 120-Minute Timer',
      footprint: '16" W x 10" D x 22" H',
      weightLbs: 26,
      warrantyYears: 2,
      rpm: 'Thermostatic Curing Cycle 140°C - 165°C with 120-min Timer',
      arborOrSpindle: 'Heavy Forged C-Frame with Balanced Heating Plates',
    },
    description: 'Precision electric tyre and inner-tube vulcanizer machine designed for automotive garages, tyre retreaders, and motorcycle service shops. Permanently bonds repair patches to rubber tubes, passenger tyre sidewalls, and tread plies under controlled heat and pressure.',
    features: [
      'Adjustable mechanical thermostat with precision temperature control dial (140°C-165°C)',
      '0-120 minute countdown timer automatically turns off heat when curing cycle finishes',
      'Heavy C-frame forged steel clamp applies uniform clamping pressure across the patch',
      'Includes contoured heated curing head plates for flat tubes and curved sidewalls'
    ],
    includedItems: [
      'VZ-500 Electric Vulcanizer Bench Press in HaoSail Blue',
      'Contoured Upper Heating Iron Head and Lower Plate',
      'Power Cord with Grounded Plug',
      'Assorted Vulcanizing Patch Rubber Samples'
    ]
  },

  // 41. Open Frame Gasoline Generator
  {
    id: 'hs-gg-95k',
    sku: 'HS-GG7500-GAS',
    name: 'Open Frame Gasoline Generator Machine HaoSail GG-7500 Commercial',
    subtitle: '7.5 kVA Commercial Petrol Generator with Electric Key Start & AVR',
    category: 'workshop-tools',
    categoryLabel: 'Workshop & Tools',
    subCategory: 'generators-power',
    subCategoryLabel: 'Commercial Generators',
    price: 95000,
    originalPrice: 110000,
    rating: 4.9,
    reviewsCount: 44,
    inStock: true,
    stockCount: 15,
    freightTier: 'freight-ltl',
    isFreeFreight: true,
    isPopular: true,
    powerSource: 'all',
    image: gasGeneratorImg,
    specs: {
      motor: '15.0 HP 420cc 4-Stroke Commercial OHV Engine',
      voltage: '230V / 1-Phase / 50Hz (Pure Copper Alternator)',
      amperage: '30.0 Amps',
      capacity: '7.0 kW Rated / 7.5 kW Max Peak Output, 25L Fuel Tank',
      footprint: '28" L x 22" W x 24" H',
      weightLbs: 185,
      warrantyYears: 2,
      rpm: '3,000 RPM Constant Engine Speed (50Hz Grid Synchronization)',
      arborOrSpindle: '100% Pure Copper Alternator Stator & Rotor with AVR Regulation',
    },
    description: 'Rugged commercial open-frame petrol generator designed to power site concrete mixers, welders, air compressors, and workshop power tools. Features 100% copper alternator windings, Automatic Voltage Regulation (AVR), electric push-button key start, and dual industrial socket outlets.',
    features: [
      '100% copper-wound alternator delivers stable voltage for sensitive electronic diagnostic equipment',
      'Automatic Voltage Regulator (AVR) maintains constant 230V output under heavy motor load surges',
      'Heavy 32mm tubular steel roll cage with fold-down transport handles and all-terrain wheels',
      'Large 25-litre steel fuel tank delivers up to 10 hours continuous runtime at 50% load'
    ],
    includedItems: [
      'GG-7500 Generator Assembly with 12V Starter Battery',
      'Wheel & Handle Transport Mobility Kit',
      'Spark Plug Wrench and Engine Oil Funnel',
      'Industrial 16A and 32A Electrical Plugs'
    ]
  },

  // 42. Open Frame Diesel Generator
  {
    id: 'hs-dg-145k',
    sku: 'HS-DG10000-DSL',
    name: 'Open Frame Diesel Generator Machine HaoSail DG-10000 KT10000LE3',
    subtitle: '10 kVA Air-Cooled Heavy Diesel Generator with Electric Start & Dual Voltage',
    category: 'workshop-tools',
    categoryLabel: 'Workshop & Tools',
    subCategory: 'generators-power',
    subCategoryLabel: 'Commercial Generators',
    price: 145000,
    originalPrice: 165000,
    rating: 4.9,
    reviewsCount: 38,
    inStock: true,
    stockCount: 11,
    freightTier: 'freight-ltl',
    isFreeFreight: true,
    isPopular: true,
    powerSource: 'all',
    image: dieselGenOpenImg,
    specs: {
      motor: '13.0 HP Direct-Injection Air-Cooled Diesel Engine',
      voltage: '230V Single-Phase & 400V 3-Phase Sockets / 50Hz',
      amperage: '14.0 Amps per phase',
      capacity: '8.5 kW Rated / 9.5 kW Max Output, 15L Fuel Tank',
      footprint: '36" L x 23" W x 30" H',
      weightLbs: 275,
      warrantyYears: 3,
      rpm: '3,000 RPM Direct-Injection Diesel Engine with Mechanical Governor',
      arborOrSpindle: 'Dual-Voltage Alternator with 230V Single-Phase & 400V 3-Phase Panel',
    },
    description: 'High-torque industrial air-cooled diesel generator KT10000LE3 in signature HaoSail black and blue trim. Delivers extreme fuel economy for construction contractors, quarry operations, and continuous workshop backup power.',
    features: [
      'High-pressure direct-injection diesel motor delivers outstanding fuel efficiency and low operating cost',
      'Dual voltage output panel equipped with both standard 230V domestic and 400V 3-phase industrial sockets',
      'Low oil pressure automatic engine shutdown sensor prevents internal engine damage',
      'Electric starter key switch with 12V DC charging battery and decompression lever'
    ],
    includedItems: [
      'DG-10000KT Diesel Generator Unit with 12V Battery',
      'Heavy-Duty Solid Rubber Wheels and Foldable Transport Handles',
      '3-Phase 400V 16A Industrial Plug & 230V Plug',
      'Complete Diesel Filter and Maintenance Kit'
    ]
  },

  // 43. Soundproof Diesel Generator
  {
    id: 'hs-sdg-680k',
    sku: 'HS-SG20-CAN',
    name: 'Soundproof Diesel Generator Machine HaoSail SG-20 Silent Canopy',
    subtitle: '20 kVA Water-Cooled Silent Diesel Generator with Smart Digital Controller',
    category: 'workshop-tools',
    categoryLabel: 'Workshop & Tools',
    subCategory: 'generators-power',
    subCategoryLabel: 'Commercial Generators',
    price: 680000,
    originalPrice: 750000,
    rating: 5.0,
    reviewsCount: 16,
    inStock: true,
    stockCount: 4,
    freightTier: 'heavy-freight',
    isFreeFreight: true,
    isPopular: true,
    powerSource: '3-phase-400v',
    image: dieselGenSilentImg,
    specs: {
      motor: '4-Cylinder Water-Cooled Heavy Industrial Diesel Engine (1,500 RPM)',
      voltage: '400V / 3-Phase / 50Hz (230V Single Phase available)',
      amperage: '29.0 Amps per phase',
      capacity: '16 kW / 20 kVA Prime Power, 65L Base Fuel Tank (<68 dBA @ 7m)',
      footprint: '72" L x 36" W x 48" H',
      weightLbs: 1650,
      warrantyYears: 5,
      rpm: '1,500 RPM Ultra-Quiet 4-Cylinder Water-Cooled Engine',
      arborOrSpindle: 'Brushless Synchronous Alternator with SmartGen Digital Controller',
    },
    description: 'Ultra-silent soundproof canopy diesel generator set engineered for commercial factories, hotels, health centers, and commercial woodworking workshops. Features weatherproof acoustic canopy, low-speed 1,500 RPM water-cooled engine, SmartGen digital control panel, and ATS automatic transfer switch compatibility.',
    features: [
      'Acoustically insulated heavy-gauge steel soundproof canopy dampens noise down to whisper-quiet 68 dBA',
      'SmartGen digital microprocessor controller monitors voltage, frequency, oil pressure, coolant temperature, and hours',
      'Integrated heavy steel base fuel tank provides up to 14 hours continuous prime power',
      'Lockable access doors, emergency exterior stop button, and forklift pockets for easy site rigging'
    ],
    includedItems: [
      'SG-20 Soundproof Diesel Generator Set in HaoSail Blue',
      'Digital Control Panel with Automatic Mains Failure (AMF) Function',
      'Maintenance-Free Heavy Lead-Acid Starting Battery',
      'Industrial Exhaust Silencer and Flexible Stainless Steel Bellows'
    ]
  }

];
