import cncRouterImg from '../assets/images/prod_cnc_router_1795531126220.jpg';
import panelSawImg from '../assets/images/prod_panel_saw_1795531127577.jpg';
import twoPostLiftImg from '../assets/images/two_post_lift_1792571126549.jpg';
import wheelAlignmentImg from '../assets/images/wheel_alignment_station_1792571127652.jpg';
import tyreChangerImg from '../assets/images/tyre_changer_1792571649391.jpg';
import airCompressorImg from '../assets/images/prod_air_compressor_1795531214485.jpg';
import dieselGenSilentImg from '../assets/images/diesel_gen_silent_canopy_1793867008550.jpg';
import electricWasherImg from '../assets/images/prod_electric_washer_clean.jpg';
import concreteMixerImg from '../assets/images/concrete_mixer_1792572418541.jpg';
import roadRollerImg from '../assets/images/double_drum_roller_1792757863412.jpg';
import palletTruckImg from '../assets/images/prod_pallet_truck_1795531131898.jpg';
import shopPressImg from '../assets/images/prod_shop_press_1795531127637.jpg';

export interface StudioImagePreset {
  id: string;
  label: string;
  category: string;
  src: string;
}

export const STUDIO_IMAGE_PRESETS: StudioImagePreset[] = [
  { id: 'cnc', label: 'CNC Router 1325', category: 'Woodworking', src: cncRouterImg },
  { id: 'panel-saw', label: 'Sliding Panel Saw', category: 'Woodworking', src: panelSawImg },
  { id: 'edge-bander', label: 'DW902 Edge Bander', category: 'Woodworking', src: '/assets/aistudio/edge_banding_706f9075.jpeg' },
  { id: 'two-post', label: '2-Post Vehicle Lift', category: 'Auto Service', src: twoPostLiftImg },
  { id: 'alignment', label: '3D Wheel Alignment', category: 'Auto Service', src: wheelAlignmentImg },
  { id: 'tyre-changer', label: 'Tyre Changer', category: 'Auto Service', src: tyreChangerImg },
  { id: 'compressor', label: 'Industrial Compressor', category: 'Workshop', src: airCompressorImg },
  { id: 'generator', label: 'Silent Diesel Generator', category: 'Workshop', src: dieselGenSilentImg },
  { id: 'washer', label: 'High Pressure Washer', category: 'Workshop', src: electricWasherImg },
  { id: 'pallet', label: 'Pallet Stacker / Forklift', category: 'Warehouse', src: palletTruckImg },
  { id: 'mixer', label: 'Concrete Mixer', category: 'Construction', src: concreteMixerImg },
  { id: 'roller', label: 'Double Drum Roller', category: 'Construction', src: roadRollerImg },
  { id: 'press', label: 'Hydraulic Shop Press', category: 'Metalworking', src: shopPressImg },
];
