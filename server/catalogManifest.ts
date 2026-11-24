// Auto-synced server catalog manifest (no image asset imports) for authoritative pricing & stock verification
export interface ServerCatalogItem {
  id: string;
  sku: string;
  name: string;
  price: number;
}

export interface ServerCountyHub {
  id: string;
  county: string;
  mainTown: string;
  tailgateCost: number;
  depotPickupCost: number;
}

export const SERVER_CATALOG_ITEMS: Record<string, ServerCatalogItem> = {
  "hs-dc-80k": {
    "id": "hs-dc-80k",
    "sku": "HS-DC2000-BLU",
    "name": "Industrial Dust Collector Machine HaoSail DC-2000",
    "price": 80000
  },
  "hs-tc-210k": {
    "id": "hs-tc-210k",
    "sku": "HS-TC950-BLU",
    "name": "Tyre Changer Machine HaoSail TC-950 Semi-Automatic",
    "price": 210000
  },
  "hs-cnc-1650k": {
    "id": "hs-cnc-1650k",
    "sku": "HS-CNC1325-PRO",
    "name": "CNC Router Machine HaoSail CNC-1325 Industrial 4x8ft",
    "price": 1650000
  },
  "hs-wm-270k": {
    "id": "hs-wm-270k",
    "sku": "HS-WS30-MIL",
    "name": "Woodworking Spindle Shaper & Miller Machine HaoSail MX-30",
    "price": 270000
  },
  "hs-eb-1700k": {
    "id": "hs-eb-1700k",
    "sku": "HS-EB500-AUTO",
    "name": "Automatic Edge Banding Machine HaoSail DW902",
    "price": 1700000
  },
  "hs-pt-29k": {
    "id": "hs-pt-29k",
    "sku": "HS-PT2500-HYD",
    "name": "Hydraulic Pallet Truck Machine HaoSail PT-2500 Heavy-Duty",
    "price": 29500
  },
  "hs-ps-575k": {
    "id": "hs-ps-575k",
    "sku": "HS-PS3200-SLD",
    "name": "Sliding Table Panel Saw Machine HaoSail PS-3200 Precision",
    "price": 575000
  },
  "hs-bs-98k": {
    "id": "hs-bs-98k",
    "sku": "HS-BS600-SHP",
    "name": "Circular Blade Sharpener Machine HaoSail BS-600 Heavy-Duty",
    "price": 98000
  },
  "hs-wt-330k": {
    "id": "hs-wt-330k",
    "sku": "HS-TH500-PLN",
    "name": "Wood Thicknesser Machine HaoSail TH-500 Industrial 20\"",
    "price": 329999
  },
  "hs-sb-1650k": {
    "id": "hs-sb-1650k",
    "sku": "HS-SB7000-IND",
    "name": "Down-Draft Spray Booth Machine HaoSail SB-7000 Industrial",
    "price": 1650000
  },
  "hs-cs-250k": {
    "id": "hs-cs-250k",
    "sku": "HS-CS3000-PRO",
    "name": "Workshop Circular Saw Machine HaoSail CS-3000 Heavy",
    "price": 250000
  },
  "hs-bs-250k": {
    "id": "hs-bs-250k",
    "sku": "HS-BS400-WOD",
    "name": "Woodworking Bandsaw Machine HaoSail BS-400 16\" Heavy",
    "price": 250000
  },
  "hs-4p-570k": {
    "id": "hs-4p-570k",
    "sku": "HS-4PL5000-AUT",
    "name": "Four Post Lift Machine HaoSail 4P-5000 5.0 Tonne",
    "price": 570000
  },
  "hs-sp-40k": {
    "id": "hs-sp-40k",
    "sku": "HS-SP20-HYD",
    "name": "Hydraulic Workshop Press Bench Machine HaoSail SP-20 20-Ton Heavy",
    "price": 40000
  },
  "hs-pgp-40k": {
    "id": "hs-pgp-40k",
    "sku": "HS-PGP50-PMP",
    "name": "Pneumatic Grease Pump Machine HaoSail PGP-50 High-Pressure Kit",
    "price": 40000
  },
  "hs-pt-420k": {
    "id": "hs-pt-420k",
    "sku": "HS-FS310-CMB",
    "name": "Surface Planer & Thicknesser Machine HaoSail FS-310 Combined",
    "price": 420000
  },
  "hs-wm-250k": {
    "id": "hs-wm-250k",
    "sku": "HS-MS750-CHIS",
    "name": "Hollow Chisel Mortiser Machine HaoSail MS-750 Heavy",
    "price": 250000
  },
  "hs-bsm-1250k": {
    "id": "hs-bsm-1250k",
    "sku": "HS-BSM800-SAW",
    "name": "Horizontal Band Sawmill Machine HaoSail BSM-800 Industrial",
    "price": 1250000
  },
  "hs-fg-200k": {
    "id": "hs-fg-200k",
    "sku": "HS-FG300-CON",
    "name": "Concrete Floor Grinder Machine HaoSail FG-300 Commercial",
    "price": 200000
  },
  "hs-vac-40k": {
    "id": "hs-vac-40k",
    "sku": "HS-WD80-VAC",
    "name": "Wet & Dry Vacuum Cleaner Machine HaoSail WD-80 Industrial",
    "price": 40000
  },
  "hs-3da-1200k": {
    "id": "hs-3da-1200k",
    "sku": "HS-3DA900-CAM",
    "name": "3D Wheel Alignment Machine HaoSail 3D-900 High-Precision",
    "price": 1200000
  },
  "hs-wb-210k": {
    "id": "hs-wb-210k",
    "sku": "HS-WB800-LED",
    "name": "Wheel Balancer Machine HaoSail WB-800 Dynamic",
    "price": 210000
  },
  "hs-2p-380k": {
    "id": "hs-2p-380k",
    "sku": "HS-2PL4000-CLR",
    "name": "Two Post Lift Machine HaoSail 2P-4000 4.0 Tonne Clear-Floor",
    "price": 380000
  },
  "hs-pt-110k": {
    "id": "hs-pt-110k",
    "sku": "HS-PT36-CON",
    "name": "Concrete Power Trowel Machine HaoSail PT-36 36\" Walk-Behind",
    "price": 110000
  },
  "hs-pc-100k": {
    "id": "hs-pc-100k",
    "sku": "HS-PC90-VIB",
    "name": "Vibratory Plate Compactor Machine HaoSail PC-90 90kg Heavy",
    "price": 100000
  },
  "hs-rr-700k": {
    "id": "hs-rr-700k",
    "sku": "HS-RR800-DRM",
    "name": "Double Drum Vibratory Road Roller Machine HaoSail RR-800 800kg",
    "price": 700000
  },
  "hs-cv-60k": {
    "id": "hs-cv-60k",
    "sku": "HS-CV2200-POK",
    "name": "Concrete Poker Vibrator Machine HaoSail CV-2200 Industrial",
    "price": 60000
  },
  "hs-tr-100k": {
    "id": "hs-tr-100k",
    "sku": "HS-TR75-RAM",
    "name": "Tamping Rammer Machine HaoSail TR-75 75kg (Jumping Jack)",
    "price": 100000
  },
  "hs-fm-60k": {
    "id": "hs-fm-60k",
    "sku": "HS-FM500-AIR",
    "name": "Pneumatic Foam Generator Machine HaoSail FM-500",
    "price": 60000
  },
  "hs-cm-450k": {
    "id": "hs-cm-450k",
    "sku": "HS-CM400-HYD",
    "name": "Hydraulic Hopper Concrete Mixer Machine HaoSail CM-400 400L",
    "price": 450000
  },
  "hs-od-40k": {
    "id": "hs-od-40k",
    "sku": "HS-OD80-AIR",
    "name": "Waste Oil Drainer & Extractor Machine HaoSail OD-80 Pneumatic",
    "price": 40000
  },
  "hs-ag-80k": {
    "id": "hs-ag-80k",
    "sku": "HS-AG150-DIG",
    "name": "Digital Tyre Inflation Station Machine HaoSail AG-150 Commercial",
    "price": 80000
  },
  "hs-ac-180k": {
    "id": "hs-ac-180k",
    "sku": "HS-AC3000-BLU",
    "name": "Industrial Air Compressor Machine HaoSail AC-3000 Belt-Drive",
    "price": 180000
  },
  "hs-tc-95k": {
    "id": "hs-tc-95k",
    "sku": "HS-TC7D-MEC",
    "name": "Mobile Tool Cabinet Machine HaoSail TC-7D Multi-Drawer Auto Shop",
    "price": 95000
  },
  "hs-gc-1450k": {
    "id": "hs-gc-1450k",
    "sku": "HS-GC500-FRM",
    "name": "Auto Body Frame Machine HaoSail GC-500 Heavy Girder Corrector",
    "price": 1450000
  },
  "hs-gpw-120k": {
    "id": "hs-gpw-120k",
    "sku": "HS-PW2500-GAS",
    "name": "Gasoline High Pressure Washer Machine HaoSail PW-2500 Heavy-Duty",
    "price": 120000
  },
  "hs-epw-175k": {
    "id": "hs-epw-175k",
    "sku": "HS-PW3000-ELE",
    "name": "Electric High Pressure Washer Machine HaoSail PW-3000 Commercial Triplex",
    "price": 175000
  },
  "hs-vlc-45k": {
    "id": "hs-vlc-45k",
    "sku": "HS-VZ500-TYR",
    "name": "Tyre Tube & Plate Vulcanizer Machine HaoSail VZ-500 Temperature-Adjustable",
    "price": 45000
  },
  "hs-gg-95k": {
    "id": "hs-gg-95k",
    "sku": "HS-GG7500-GAS",
    "name": "Open Frame Gasoline Generator Machine HaoSail GG-7500 Commercial",
    "price": 95000
  },
  "hs-dg-145k": {
    "id": "hs-dg-145k",
    "sku": "HS-DG10000-DSL",
    "name": "Open Frame Diesel Generator Machine HaoSail DG-10000 KT10000LE3",
    "price": 145000
  },
  "hs-sdg-680k": {
    "id": "hs-sdg-680k",
    "sku": "HS-SG20-CAN",
    "name": "Soundproof Diesel Generator Machine HaoSail SG-20 Silent Canopy",
    "price": 680000
  },
  "hs-sl-435k": {
    "id": "hs-sl-435k",
    "sku": "HS-HSL350C-LFT",
    "name": "Hydraulic Mid-Rise Scissor Car Lift HaoSail HSL-350C (3.5-Ton)",
    "price": 435000
  },
  "hs-acr-365k": {
    "id": "hs-acr-365k",
    "sku": "HS-AC600-R134",
    "name": "Automatic Car A/C Refrigerant Recovery & Recharge Station HaoSail AC-600",
    "price": 365000
  },
  "hs-obd-68k": {
    "id": "hs-obd-68k",
    "sku": "HS-OBD90-PRO",
    "name": "Pro Bi-Directional Automotive Diagnostic Scanner HaoSail HS-OBD90",
    "price": 68000
  },
  "hs-dp-85k": {
    "id": "hs-dp-85k",
    "sku": "HS-DP3500-SPT",
    "name": "Auto Body Dent Puller & Panel Spot Welder HaoSail DP-3500",
    "price": 85000
  },
  "hs-bc-24k": {
    "id": "hs-bc-24k",
    "sku": "HS-BC600-STR",
    "name": "Commercial 12V/24V Battery Charger & Boost Starter HaoSail BC-600",
    "price": 24000
  },
  "hs-fj-28k": {
    "id": "hs-fj-28k",
    "sku": "HS-FJ4000-LP",
    "name": "Dual-Pump Low-Profile Hydraulic Floor Jack HaoSail FJ-4000 (4.0-Ton)",
    "price": 28000
  },
  "hs-tj-52k": {
    "id": "hs-tj-52k",
    "sku": "HS-TJ600-TEL",
    "name": "Telescopic Hydraulic Transmission Jack HaoSail TJ-600 (0.6-Ton)",
    "price": 52000
  },
  "hs-ec-56k": {
    "id": "hs-ec-56k",
    "sku": "HS-EC3000-FLD",
    "name": "Folding Hydraulic Workshop Engine Crane HaoSail EC-3000 (3.0-Ton)",
    "price": 56000
  },
  "hs-mts-29k": {
    "id": "hs-mts-29k",
    "sku": "HS-MTS186-CRV",
    "name": "186-Piece Master Mechanic Rolling Tool Case HaoSail MTS-186",
    "price": 29000
  },
  "hs-zx-24k": {
    "id": "hs-zx-24k",
    "sku": "HS-ZX7315-ARC",
    "name": "Industrial IGBT Inverter Arc Welder HaoSail ZX7-315 (315A)",
    "price": 24000
  },
  "hs-mig-125k": {
    "id": "hs-mig-125k",
    "sku": "HS-NBC300-MIG",
    "name": "CO2 / MIG-300 Semi-Automatic Industrial Welder HaoSail NBC-300",
    "price": 125000
  },
  "hs-dwg-155k": {
    "id": "hs-dwg-155k",
    "sku": "HS-DGW220-ARC",
    "name": "Diesel Engine Welding Generator Set HaoSail DGW-220 (220A / 6.5 kVA)",
    "price": 155000
  },
  "hs-ml-485k": {
    "id": "hs-ml-485k",
    "sku": "HS-CQ6236-LTH",
    "name": "Precision Geared-Head Horizontal Metal Lathe HaoSail CQ-6236",
    "price": 485000
  },
  "hs-dp-42k": {
    "id": "hs-dp-42k",
    "sku": "HS-Z4116-DRL",
    "name": "Heavy-Duty 16mm Cast-Iron Bench Drill Press HaoSail Z4116",
    "price": 42000
  },
  "hs-bg-13k": {
    "id": "hs-bg-13k",
    "sku": "HS-MD200-GRN",
    "name": "8-Inch Heavy-Duty Electric Bench Grinder HaoSail MD-200",
    "price": 13500
  },
  "hs-mc-19k": {
    "id": "hs-mc-19k",
    "sku": "HS-J3G355-SAW",
    "name": "14-Inch Industrial Metal Cut-Off Chop Saw HaoSail J3G-355",
    "price": 19500
  },
  "hs-pb-28k": {
    "id": "hs-pb-28k",
    "sku": "HS-SWG3-BND",
    "name": "Hydraulic Steel Pipe & Tube Bender HaoSail SWG-3 (16-Ton)",
    "price": 28000
  },
  "hs-rc-145k": {
    "id": "hs-rc-145k",
    "sku": "HS-HQ450-CUT",
    "name": "Walk-Behind Concrete & Asphalt Road Cutter HaoSail HQ-450 (18\")",
    "price": 145000
  },
  "hs-hb-145k": {
    "id": "hs-hb-145k",
    "sku": "HS-HB21-BOR",
    "name": "Cabinet Hinge & Multi-Spindle Boring Machine HaoSail HB-21",
    "price": 145000
  },
  "hs-ws-580k": {
    "id": "hs-ws-580k",
    "sku": "HS-WB630-SND",
    "name": "Industrial Wide-Belt Wood Calibrating Sander HaoSail WB-630",
    "price": 580000
  },
  "hs-cw-130k": {
    "id": "hs-cw-130k",
    "sku": "HS-ML393-5IN1",
    "name": "5-in-1 Multi-Function Combination Woodworking Machine HaoSail ML-393",
    "price": 130000
  },
  "hs-ses-340k": {
    "id": "hs-ses-340k",
    "sku": "HS-CTD1530-STK",
    "name": "Semi-Electric Hydraulic Pallet Stacker HaoSail CTD-1530 (1.5T / 3.0m)",
    "price": 340000
  },
  "hs-df-3650k": {
    "id": "hs-df-3650k",
    "sku": "HS-CPCD30-FRK",
    "name": "3.0-Ton Diesel Counterbalance Forklift HaoSail CPCD-30",
    "price": 3650000
  },
  "hs-rh-18k": {
    "id": "hs-rh-18k",
    "sku": "HS-HSZ2T-RIG",
    "name": "2-Ton Chain Block Hoist & Polyester Sling Kit HaoSail HSZ-2T",
    "price": 18500
  },
  "hs-wp-68k": {
    "id": "hs-wp-68k",
    "sku": "HS-DP80-PMP",
    "name": "3-Inch Heavy-Duty Diesel Water Pump HaoSail DP-80 (10 HP)",
    "price": 68000
  },
  "hs-sac-34k": {
    "id": "hs-sac-34k",
    "sku": "HS-OFS50-AIR",
    "name": "Oil-Free Silent Dual-Motor Air Compressor HaoSail OFS-50 (50L)",
    "price": 34000
  },
  "hs-rh-16k": {
    "id": "hs-rh-16k",
    "sku": "HS-RH1500-KIT",
    "name": "1500W SDS-Max Rotary Hammer & Pneumatic Wrench Kit HaoSail RH-1500",
    "price": 16500
  },
  "acc-wood-1": {
    "id": "acc-wood-1",
    "sku": "ACC-BLD-1080",
    "name": "Freud Industrial 10\" 80-Tooth Carbide Finish Blade",
    "price": 14500
  },
  "acc-wood-2": {
    "id": "acc-wood-2",
    "sku": "ACC-DUC-415M",
    "name": "HaoSail 4-Inch Heavy-Duty Anti-Static Clear Flex Hose (15m)",
    "price": 12000
  },
  "acc-wood-3": {
    "id": "acc-wood-3",
    "sku": "ACC-SFT-FTB2",
    "name": "Micro-Dial Safety Push Block & Dual Featherboard Kit",
    "price": 7800
  },
  "acc-wood-4": {
    "id": "acc-wood-4",
    "sku": "ACC-PLN-KNV3",
    "name": "HSS Replacement Planer & Jointer Knives (3-Piece Matched Set)",
    "price": 16500
  },
  "acc-auto-1": {
    "id": "acc-auto-1",
    "sku": "ACC-HYD-OIL20",
    "name": "Mobil DTE 25 / ISO VG 46 Anti-Wear Hydraulic Fluid (20 Litres)",
    "price": 18500
  },
  "acc-auto-2": {
    "id": "acc-auto-2",
    "sku": "ACC-PAD-PU04",
    "name": "Heavy-Duty Polyurethane Frame Cradle Pads (Set of 4)",
    "price": 9800
  },
  "acc-auto-3": {
    "id": "acc-auto-3",
    "sku": "ACC-BLT-M1816",
    "name": "High-Tensile Concrete Anchor Bolts M18 x 160mm (16-Pack)",
    "price": 11200
  },
  "acc-auto-4": {
    "id": "acc-auto-4",
    "sku": "ACC-INF-DGT01",
    "name": "Digital Tire Inflator with Calibrated Backlit Pressure Gauge",
    "price": 6500
  },
  "acc-wld-1": {
    "id": "acc-wld-1",
    "sku": "ACC-WLD-HLM01",
    "name": "Auto-Darkening True-Color Solar Welding Helmet (DIN 9–13)",
    "price": 6800
  },
  "acc-wld-2": {
    "id": "acc-wld-2",
    "sku": "ACC-MIG-0815K",
    "name": "ER70S-6 Copper-Coated MIG Solid Welding Wire 0.8mm (15 kg Spool)",
    "price": 5400
  },
  "acc-wld-3": {
    "id": "acc-wld-3",
    "sku": "ACC-LTH-IND10",
    "name": "10-Piece Indexable Carbide Turning Tool Holder & Insert Kit (16mm)",
    "price": 12500
  },
  "acc-con-1": {
    "id": "acc-con-1",
    "sku": "ACC-CMP-MAT01",
    "name": "Polyurethane Compaction Protection Mat for Plate Compactors",
    "price": 13500
  },
  "acc-con-2": {
    "id": "acc-con-2",
    "sku": "ACC-DMD-14CON",
    "name": "14\" Premium Laser-Welded Diamond Asphalt & Concrete Cutting Disc",
    "price": 17800
  },
  "acc-con-3": {
    "id": "acc-con-3",
    "sku": "ACC-PKR-3806M",
    "name": "Heavy-Duty Vibratory Poker Shaft 38mm x 6m Flexible Needle",
    "price": 15000
  },
  "acc-wks-1": {
    "id": "acc-wks-1",
    "sku": "ACC-PRS-MND08",
    "name": "8-Piece Multi-Size Press Pin & Bushing Removal Mandrel Set",
    "price": 16800
  },
  "acc-wks-2": {
    "id": "acc-wks-2",
    "sku": "ACC-PRS-GAU60",
    "name": "Industrial Glycerin-Filled Hydraulic Gauge with Quick Disconnect",
    "price": 8900
  },
  "acc-wks-3": {
    "id": "acc-wks-3",
    "sku": "ACC-MET-DIL01",
    "name": "Magnetic Base Heavy-Duty Dial Indicator (0.01mm Precision)",
    "price": 11500
  }
};

export const SERVER_COUNTY_HUBS: Record<string, ServerCountyHub> = {
  "nairobi": {
    "id": "nairobi",
    "county": "Nairobi County",
    "mainTown": "Nairobi",
    "tailgateCost": 3500,
    "depotPickupCost": 0
  },
  "kiambu": {
    "id": "kiambu",
    "county": "Kiambu County",
    "mainTown": "Thika / Ruiru",
    "tailgateCost": 4500,
    "depotPickupCost": 0
  },
  "machakos": {
    "id": "machakos",
    "county": "Machakos County",
    "mainTown": "Mlolongo / Athi River",
    "tailgateCost": 4500,
    "depotPickupCost": 0
  },
  "mombasa": {
    "id": "mombasa",
    "county": "Mombasa County",
    "mainTown": "Mombasa",
    "tailgateCost": 9500,
    "depotPickupCost": 2500
  },
  "nakuru": {
    "id": "nakuru",
    "county": "Nakuru County",
    "mainTown": "Nakuru",
    "tailgateCost": 8500,
    "depotPickupCost": 2000
  },
  "kisumu": {
    "id": "kisumu",
    "county": "Kisumu County",
    "mainTown": "Kisumu",
    "tailgateCost": 11000,
    "depotPickupCost": 3000
  },
  "eldoret": {
    "id": "eldoret",
    "county": "Uasin Gishu County",
    "mainTown": "Eldoret",
    "tailgateCost": 10500,
    "depotPickupCost": 2800
  },
  "nyeri": {
    "id": "nyeri",
    "county": "Nyeri County",
    "mainTown": "Nyeri / Karatina",
    "tailgateCost": 7500,
    "depotPickupCost": 1800
  }
};

export const SERVER_SERVICE_FEES: Record<string, { id: string; name: string; cost: number }> = {
  commissioning: { id: "commissioning", name: "Certified Factory Commissioning & Floor Anchoring", cost: 18500 },
  training: { id: "training", name: "Operator Safety & Calibration Training Session", cost: 12000 },
  "annual-maintenance": { id: "annual-maintenance", name: "Annual Preventive Maintenance (PM) Contract", cost: 35000 },
};
