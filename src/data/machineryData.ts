import { Product, CategoryConfig } from '../types/machinery';
import saasUiImg from '../assets/images/saas_analytics_ui_1791532140517.jpg';
import heroWorkshopImg from '../assets/images/kenyan_workshop_hero_1794916657456.jpg';
import { ADDITIONAL_NEW_MACHINES } from './newMachineryData';
import { EXPANDED_HAOSAIL_MACHINES } from './expandedMachineryData';

export const HERO_IMAGE_PATH = heroWorkshopImg;
export const HERO_VIDEO_PATH = '/assets/aistudio/Diagnostic_system_inspecting_veh_1080p.mp4';
export const HERO_VIDEO_POSTER_PATH = '/assets/aistudio/Diagnostic_system_inspecting_veh_poster_1080p.jpg';
export const SAAS_UI_IMAGE_PATH = saasUiImg;

export const PRODUCTS: Product[] = [
  ...ADDITIONAL_NEW_MACHINES,
  ...EXPANDED_HAOSAIL_MACHINES,
];

export const CATEGORIES_CONFIG: CategoryConfig[] = [
  { 
    id: 'all', 
    label: 'All Equipment', 
    shortLabel: 'All Equipment',
    description: 'Complete HaoSail industrial catalog (68 models)',
    count: 68,
  },
  { 
    id: 'woodworking', 
    label: 'Woodworking Machinery', 
    shortLabel: 'Woodworking',
    description: 'Panel saws, CNC routers, wide-belt sanders, hinge borers, 5-in-1 joinery & extractors',
    count: 15,
    subCategories: [
      { id: 'all-wood', label: 'All Woodworking' },
      { id: 'saws', label: 'Saws & Sawmills' },
      { id: 'planers-thicknessers', label: 'Planers & Wide-Belt Sanders' },
      { id: 'sheet-panel', label: 'Panel Saws & Edge Banders' },
      { id: 'cnc-shaping', label: 'CNC, Combo & Shapers' },
      { id: 'dust-extraction', label: 'Dust Extraction' },
      { id: 'mortising-drilling', label: 'Hinge Boring & Mortising' },
      { id: 'tool-maintenance', label: 'Blade Sharpening' },
    ]
  },
  { 
    id: 'auto-maintenance', 
    label: 'Auto Maintenance & Garage', 
    shortLabel: 'Auto Maintenance',
    description: '2-post, 4-post & scissor lifts, A/C stations, OBD2 scanners, jacks, cranes & body benches',
    count: 21,
    subCategories: [
      { id: 'all-auto', label: 'All Auto Maintenance' },
      { id: 'vehicle-lifts', label: 'Vehicle Lifts (2P / 4P / Scissor)' },
      { id: 'tyre-wheel', label: 'Tyre & Wheel Service' },
      { id: 'wheel-alignment', label: '3D Wheel Alignment' },
      { id: 'ac-diagnostics', label: 'A/C Service & Diagnostics' },
      { id: 'jacks-hoists', label: 'Jacks, Cranes & Tool Sets' },
      { id: 'collision-repair', label: 'Collision & Dent Pullers' },
      { id: 'workshop-storage', label: 'Tool Storage & Sets' },
      { id: 'lubrication', label: 'Lubrication & Battery Boost' },
      { id: 'paint-spray-booth', label: 'Spray Booth & Finishing' },
    ]
  },
  { 
    id: 'welding-metalworking', 
    label: 'Welding & Metalworking', 
    shortLabel: 'Welding & Metal',
    description: 'IGBT inverter welders, CO2/MIG plants, diesel welders, metal lathes, drill presses & benders',
    count: 8,
    subCategories: [
      { id: 'all-welding', label: 'All Welding & Metal' },
      { id: 'welders', label: 'Arc, MIG & Engine Welders' },
      { id: 'lathes-drilling', label: 'Metal Lathes & Drill Presses' },
      { id: 'cutting-bending', label: 'Grinders, Chop Saws & Benders' },
    ]
  },
  { 
    id: 'construction-concrete', 
    label: 'Construction & Concrete', 
    shortLabel: 'Construction & Concrete',
    description: 'Road cutters, concrete mixers, road rollers, plate compactors, rammers & trowels',
    count: 8,
    subCategories: [
      { id: 'all-construction', label: 'All Construction' },
      { id: 'concrete-cutting', label: 'Road & Concrete Saws' },
      { id: 'compaction', label: 'Rollers & Compactors' },
      { id: 'concrete-pouring', label: 'Mixers & Poker Vibrators' },
      { id: 'concrete-finishing', label: 'Power Trowels & Screeds' },
      { id: 'surface-finishing', label: 'Floor Grinders' },
    ]
  },
  { 
    id: 'workshop-tools', 
    label: 'Workshop, Warehouse & Power Tools', 
    shortLabel: 'Workshop & Forklifts',
    description: 'Forklifts, pallet stackers, rigging hoists, water pumps, silent & belt compressors & generators',
    count: 16,
    subCategories: [
      { id: 'all-workshop', label: 'All Workshop & Forklifts' },
      { id: 'material-handling', label: 'Forklifts, Stackers & Rigging' },
      { id: 'air-compressors', label: 'Silent & Belt Air Compressors' },
      { id: 'pumps-water', label: 'Diesel & Irrigation Water Pumps' },
      { id: 'generators-power', label: 'Generators & Power Units' },
      { id: 'hand-power-tools', label: 'Rotary Hammers & Air Tools' },
      { id: 'pressure-washers', label: 'High-Pressure Washers' },
      { id: 'hydraulic-presses', label: 'Hydraulic Shop Presses' },
      { id: 'cleaning-vacuums', label: 'Industrial Vacuums & Wash' },
    ]
  },
];

export const POPULAR_SEARCH_TERMS = [
  'Scissor Car Lift',
  'CO2 MIG Welder',
  '3D Wheel Alignment',
  'Diesel Forklift',
  'Metal Lathe',
  'AC Recovery',
  'CNC Router',
  'Road Cutter',
  'Pallet Stacker',
  '5-in-1 Wood',
  'ZX7-315 Welder',
  'Engine Crane',
  'Silent Compressor',
  'Water Pump',
  'Two Post Lift',
  'Four Post Lift'
];
