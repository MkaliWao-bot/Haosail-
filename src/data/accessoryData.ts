import { Category } from '../types/machinery';
import circularSawAccImg from '../assets/images/kenyan_circular_saw_1794916645018.jpg';
import dustHoseAccImg from '../assets/images/kenyan_dust_collector_1794916651509.jpg';
import planerAccImg from '../assets/images/kenyan_wood_thicknesser_1794916644902.jpg';
import oilAccImg from '../assets/images/kenyan_oil_drainer_1794916650593.jpg';
import twoPostAccImg from '../assets/images/two_post_lift_1792571126549.jpg';
import airInflatorAccImg from '../assets/images/kenyan_air_inflator_1794916657300.jpg';
import welderAccImg from '../assets/images/kenyan_arc_welder_1794998103465.jpg';
import migAccImg from '../assets/images/kenyan_mig_welder_1794998103841.jpg';
import latheAccImg from '../assets/images/kenyan_metal_lathe_1794998105057.jpg';
import compactorAccImg from '../assets/images/kenyan_plate_compactor_1794916641947.jpg';
import roadCutterAccImg from '../assets/images/kenyan_road_cutter_1794998106727.jpg';
import pokerAccImg from '../assets/images/concrete_vibrator_1792573364085.jpg';
import pressAccImg from '../assets/images/kenyan_shop_press_1794916650988.jpg';
import toolsetAccImg from '../assets/images/kenyan_mechanic_toolset_1794998102227.jpg';

export interface AccessoryItem {
  id: string;
  name: string;
  sku: string;
  category: Category;
  price: number;
  originalPrice: number;
  image: string;
  description: string;
  compatibleCategory: Category[];
}

export interface CountyHub {
  id: string;
  county: string;
  mainTown: string;
  depotAddress: string;
  transitHours: string;
  tailgateCost: number;
  depotPickupCost: number;
  isNairobiMetro: boolean;
}

export const KENYAN_COUNTY_HUBS: CountyHub[] = [
  {
    id: 'nairobi',
    county: 'Nairobi County',
    mainTown: 'Nairobi',
    depotAddress: 'HaoSail Central Distribution Centre, Plot 48 Enterprise Rd, Industrial Area',
    transitHours: 'Same-Day / 24 Hours',
    tailgateCost: 3500,
    depotPickupCost: 0,
    isNairobiMetro: true,
  },
  {
    id: 'kiambu',
    county: 'Kiambu County',
    mainTown: 'Thika / Ruiru',
    depotAddress: 'HaoSail North Sub-Depot, Thika Superhighway Bypass Interchange',
    transitHours: '24 Hours',
    tailgateCost: 4500,
    depotPickupCost: 0,
    isNairobiMetro: true,
  },
  {
    id: 'machakos',
    county: 'Machakos County',
    mainTown: 'Mlolongo / Athi River',
    depotAddress: 'Mombasa Road Logistics Depot, Opp. EPZ Athi River',
    transitHours: '24 Hours',
    tailgateCost: 4500,
    depotPickupCost: 0,
    isNairobiMetro: true,
  },
  {
    id: 'mombasa',
    county: 'Mombasa County',
    mainTown: 'Mombasa',
    depotAddress: 'Coast Hub, Shimanzi Industrial Estate, Near Port Gate 5',
    transitHours: '24 - 48 Hours',
    tailgateCost: 9500,
    depotPickupCost: 2500,
    isNairobiMetro: false,
  },
  {
    id: 'nakuru',
    county: 'Nakuru County',
    mainTown: 'Nakuru',
    depotAddress: 'Rift Valley Regional Depot, George Morara Rd, Industrial Zone',
    transitHours: '24 - 48 Hours',
    tailgateCost: 8500,
    depotPickupCost: 2000,
    isNairobiMetro: false,
  },
  {
    id: 'kisumu',
    county: 'Kisumu County',
    mainTown: 'Kisumu',
    depotAddress: 'Lake Basin Logistics Centre, Obote Road Light Industrial Area',
    transitHours: '48 Hours',
    tailgateCost: 11000,
    depotPickupCost: 3000,
    isNairobiMetro: false,
  },
  {
    id: 'eldoret',
    county: 'Uasin Gishu County',
    mainTown: 'Eldoret',
    depotAddress: 'North Rift Central Hub, Uganda Road Depot, Near Rivatex',
    transitHours: '48 Hours',
    tailgateCost: 10500,
    depotPickupCost: 2800,
    isNairobiMetro: false,
  },
  {
    id: 'nyeri',
    county: 'Nyeri County',
    mainTown: 'Nyeri / Karatina',
    depotAddress: 'Central Highlands Terminal, Kimathi Way Commerce Park',
    transitHours: '24 - 48 Hours',
    tailgateCost: 7500,
    depotPickupCost: 1800,
    isNairobiMetro: false,
  },
];

export const ACCESSORIES_BY_CATEGORY: Record<Category, AccessoryItem[]> = {
  all: [],
  woodworking: [
    {
      id: 'acc-wood-1',
      name: 'Freud Industrial 10" 80-Tooth Carbide Finish Blade',
      sku: 'ACC-BLD-1080',
      category: 'woodworking',
      price: 14500,
      originalPrice: 17000,
      image: circularSawAccImg,
      description: 'Laser-cut anti-vibration slots and TiCo hi-density carbide for mirror cuts.',
      compatibleCategory: ['woodworking'],
    },
    {
      id: 'acc-wood-2',
      name: 'HaoSail 4-Inch Heavy-Duty Anti-Static Clear Flex Hose (15m)',
      sku: 'ACC-DUC-415M',
      category: 'woodworking',
      price: 12000,
      originalPrice: 14500,
      image: dustHoseAccImg,
      description: 'Puncture-resistant polyurethane with copper grounding wire to discharge static.',
      compatibleCategory: ['woodworking'],
    },
    {
      id: 'acc-wood-3',
      name: 'Micro-Dial Safety Push Block & Dual Featherboard Kit',
      sku: 'ACC-SFT-FTB2',
      category: 'woodworking',
      price: 7800,
      originalPrice: 9500,
      image: circularSawAccImg,
      description: 'Zero-kickback composite polymer with high-friction gripping pads.',
      compatibleCategory: ['woodworking'],
    },
    {
      id: 'acc-wood-4',
      name: 'HSS Replacement Planer & Jointer Knives (3-Piece Matched Set)',
      sku: 'ACC-PLN-KNV3',
      category: 'woodworking',
      price: 16500,
      originalPrice: 19800,
      image: planerAccImg,
      description: 'Precision ground M2 grade high-speed steel for long-lasting edge retention.',
      compatibleCategory: ['woodworking'],
    },
  ],
  'auto-maintenance': [
    {
      id: 'acc-auto-1',
      name: 'Mobil DTE 25 / ISO VG 46 Anti-Wear Hydraulic Fluid (20 Litres)',
      sku: 'ACC-HYD-OIL20',
      category: 'auto-maintenance',
      price: 18500,
      originalPrice: 22000,
      image: oilAccImg,
      description: 'Commercial anti-foaming & zinc anti-wear fluid formulated for 2-post and 4-post vehicle lifts.',
      compatibleCategory: ['auto-maintenance', 'workshop-tools'],
    },
    {
      id: 'acc-auto-2',
      name: 'Heavy-Duty Polyurethane Frame Cradle Pads (Set of 4)',
      sku: 'ACC-PAD-PU04',
      category: 'auto-maintenance',
      price: 9800,
      originalPrice: 12500,
      image: twoPostAccImg,
      description: 'Prevents rocker panel slippage and underbody vehicle damage with cross-slotted pattern.',
      compatibleCategory: ['auto-maintenance'],
    },
    {
      id: 'acc-auto-3',
      name: 'High-Tensile Concrete Anchor Bolts M18 x 160mm (16-Pack)',
      sku: 'ACC-BLT-M1816',
      category: 'auto-maintenance',
      price: 11200,
      originalPrice: 13500,
      image: twoPostAccImg,
      description: 'Grade 8.8 zinc-plated expansion bolts certified for 4-Ton and 5-Ton lift foundation anchoring.',
      compatibleCategory: ['auto-maintenance'],
    },
    {
      id: 'acc-auto-4',
      name: 'Digital Tire Inflator with Calibrated Backlit Pressure Gauge',
      sku: 'ACC-INF-DGT01',
      category: 'auto-maintenance',
      price: 6500,
      originalPrice: 8000,
      image: airInflatorAccImg,
      description: 'Accurate to 0.1 PSI with 1/4" NPT industrial quick-connect fitting.',
      compatibleCategory: ['auto-maintenance'],
    },
  ],
  'welding-metalworking': [
    {
      id: 'acc-wld-1',
      name: 'Auto-Darkening True-Color Solar Welding Helmet (DIN 9–13)',
      sku: 'ACC-WLD-HLM01',
      category: 'welding-metalworking',
      price: 6800,
      originalPrice: 8500,
      image: welderAccImg,
      description: '4-arc sensor wide-view auto-darkening shield suitable for MMA, MIG, and TIG fabrication.',
      compatibleCategory: ['welding-metalworking'],
    },
    {
      id: 'acc-wld-2',
      name: 'ER70S-6 Copper-Coated MIG Solid Welding Wire 0.8mm (15 kg Spool)',
      sku: 'ACC-MIG-0815K',
      category: 'welding-metalworking',
      price: 5400,
      originalPrice: 6600,
      image: migAccImg,
      description: 'Precision layer-wound mild steel CO2/MIG spool for smooth arc transfer and minimal spatter.',
      compatibleCategory: ['welding-metalworking'],
    },
    {
      id: 'acc-wld-3',
      name: '10-Piece Indexable Carbide Turning Tool Holder & Insert Kit (16mm)',
      sku: 'ACC-LTH-IND10',
      category: 'welding-metalworking',
      price: 12500,
      originalPrice: 15000,
      image: latheAccImg,
      description: 'Hardened alloy turning, boring, grooving, and threading holders for CQ-6236 metal lathes.',
      compatibleCategory: ['welding-metalworking'],
    },
  ],
  'construction-concrete': [
    {
      id: 'acc-con-1',
      name: 'Polyurethane Compaction Protection Mat for Plate Compactors',
      sku: 'ACC-CMP-MAT01',
      category: 'construction-concrete',
      price: 13500,
      originalPrice: 16000,
      image: compactorAccImg,
      description: 'Protects interlocking paving blocks from chipping during final vibratory passes.',
      compatibleCategory: ['construction-concrete'],
    },
    {
      id: 'acc-con-2',
      name: '14" Premium Laser-Welded Diamond Asphalt & Concrete Cutting Disc',
      sku: 'ACC-DMD-14CON',
      category: 'construction-concrete',
      price: 17800,
      originalPrice: 21500,
      image: roadCutterAccImg,
      description: 'Drop segment design prevents undercut wear in abrasive green concrete and asphalt.',
      compatibleCategory: ['construction-concrete'],
    },
    {
      id: 'acc-con-3',
      name: 'Heavy-Duty Vibratory Poker Shaft 38mm x 6m Flexible Needle',
      sku: 'ACC-PKR-3806M',
      category: 'construction-concrete',
      price: 15000,
      originalPrice: 18500,
      image: pokerAccImg,
      description: 'Reinforced spiral wire core with oil-resistant rubber sheath for deep foundation slab compaction.',
      compatibleCategory: ['construction-concrete'],
    },
  ],
  'workshop-tools': [
    {
      id: 'acc-wks-1',
      name: '8-Piece Multi-Size Press Pin & Bushing Removal Mandrel Set',
      sku: 'ACC-PRS-MND08',
      category: 'workshop-tools',
      price: 16800,
      originalPrice: 20500,
      image: pressAccImg,
      description: 'Heat-treated Cr-V steel adapter mandrels for 20T to 50T hydraulic workshop presses.',
      compatibleCategory: ['workshop-tools', 'auto-maintenance'],
    },
    {
      id: 'acc-wks-2',
      name: 'Industrial Glycerin-Filled Hydraulic Gauge with Quick Disconnect',
      sku: 'ACC-PRS-GAU60',
      category: 'workshop-tools',
      price: 8900,
      originalPrice: 11000,
      image: pressAccImg,
      description: 'Dampens hydraulic pulse vibration with dual scale readings in Tons and PSI up to 10,000 PSI.',
      compatibleCategory: ['workshop-tools'],
    },
    {
      id: 'acc-wks-3',
      name: 'Magnetic Base Heavy-Duty Dial Indicator (0.01mm Precision)',
      sku: 'ACC-MET-DIL01',
      category: 'workshop-tools',
      price: 11500,
      originalPrice: 14000,
      image: toolsetAccImg,
      description: 'Fine adjustment cross-arm with 60kg holding force switchable permanent magnet base.',
      compatibleCategory: ['workshop-tools', 'woodworking'],
    },
  ],
};

export interface ServiceTierOption {
  id: string;
  name: string;
  description: string;
  cost: number;
  highlight?: boolean;
}

export const INSTALLATION_SERVICE_OPTIONS: ServiceTierOption[] = [
  {
    id: 'commissioning',
    name: 'Certified Factory Commissioning & Floor Anchoring',
    description: 'HaoSail certified technicians handle alignment, foundation bolting (Grade 8.8 expansion anchors), and phase checks.',
    cost: 18500,
    highlight: true,
  },
  {
    id: 'training',
    name: 'Operator Safety & Calibration Training Session',
    description: '3-hour on-site operator training on safe clearance, emergency stop protocols, and daily preventive maintenance.',
    cost: 12000,
  },
  {
    id: 'annual-maintenance',
    name: 'Annual Preventive Maintenance (PM) Contract',
    description: 'Includes 4 quarterly technical visits, hydraulic fluid flush, electrical torque check, and belt tensions.',
    cost: 35000,
  },
];
