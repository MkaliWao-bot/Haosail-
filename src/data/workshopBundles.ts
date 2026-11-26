export interface WorkshopBundle {
  id: string;
  index: string;
  title: string;
  divisionLabel: string;
  targetBuyer: string;
  powerRequirement: string;
  floorFootprint: string;
  commissioningPerk: string;
  discountPercent: number;
  productIds: string[];
}

export const WORKSHOP_BUNDLES: WorkshopBundle[] = [
  {
    id: 'joinery-startup',
    index: '01',
    title: 'Modern Cabinet & Joinery Line',
    divisionLabel: 'Woodworking Division',
    targetBuyer: 'Furniture workshops, kitchen cabinetry & interior fit-out teams',
    powerRequirement: '400V 3-Phase 50Hz (32A–63A Main)',
    floorFootprint: 'Min. 8m × 6m clear bay',
    commissioningPerk: 'Free blade alignment, dust duct layout & operator walkthrough',
    discountPercent: 5,
    productIds: ['hs-ps-575k', 'hs-eb-1700k', 'hs-hb-145k', 'hs-dc-80k'],
  },
  {
    id: 'auto-garage-2bay',
    index: '02',
    title: 'Commercial Auto Service & Tyre Bay',
    divisionLabel: 'Auto Maintenance Division',
    targetBuyer: 'Independent service garages, tyre centres & fleet workshops',
    powerRequirement: '230V Single-Phase or 400V 3-Phase 50Hz',
    floorFootprint: 'Min. 7m × 5m (4.2m ceiling height)',
    commissioningPerk: 'Free anchor-bolt template, airline layout & hydraulic bleed check',
    discountPercent: 5,
    productIds: ['hs-2p-380k', 'hs-tc-210k', 'hs-wb-210k', 'hs-ag-80k', 'hs-ac-180k'],
  },
  {
    id: 'metal-fab-pro',
    index: '03',
    title: 'Steel Fabrication & Machine Shop Kit',
    divisionLabel: 'Welding & Metalworking',
    targetBuyer: 'Structural steel fabricators, body builders & engineering shops',
    powerRequirement: '230V / 400V Dual-Ready 50Hz',
    floorFootprint: 'Min. 6m × 4m concrete floor',
    commissioningPerk: 'Free spindle runout test, wire feed calibration & safety briefing',
    discountPercent: 5,
    productIds: ['hs-mig-125k', 'hs-ml-485k', 'hs-dp-42k', 'hs-mc-19k'],
  },
];
