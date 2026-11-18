/**
 * Generates an SVG data URI depicting a HaoSail industrial machine in brand blue (#004B97 / #00D2FF)
 * with engineering schematics, technical badges, model markings, and cast metallic textures.
 */
export function generateMachineSvg(
  modelCode: string,
  machineName: string,
  category: string,
  primarySpec: string,
  iconType: 
    | 'lift' 
    | 'saw' 
    | 'cyclone' 
    | 'router' 
    | 'tyre' 
    | 'alignment' 
    | 'press' 
    | 'compactor' 
    | 'roller' 
    | 'grinder' 
    | 'mixer' 
    | 'sprayer' 
    | 'pallet' 
    | 'pump' 
    | 'sharpener' 
    | 'trowel'
    | 'generic'
): string {
  // SVG Graphic Elements based on icon type
  let iconGraphic = '';
  switch (iconType) {
    case 'lift':
      // Two-post or four-post automotive lift schematic
      iconGraphic = `
        <rect x="70" y="50" width="22" height="190" rx="3" fill="#004B97" stroke="#00D2FF" stroke-width="2" />
        <rect x="308" y="50" width="22" height="190" rx="3" fill="#004B97" stroke="#00D2FF" stroke-width="2" />
        <rect x="60" y="235" width="42" height="12" rx="2" fill="#0A1829" stroke="#004B97" stroke-width="2" />
        <rect x="298" y="235" width="42" height="12" rx="2" fill="#0A1829" stroke="#004B97" stroke-width="2" />
        <!-- Carriage and cross arms -->
        <rect x="92" y="140" width="30" height="20" rx="2" fill="#FFB703" />
        <rect x="278" y="140" width="30" height="20" rx="2" fill="#FFB703" />
        <path d="M110 150 L200 165 L290 150" stroke="#FFB703" stroke-width="8" stroke-linecap="round" fill="none" />
        <!-- Car outline watermark -->
        <path d="M140 135 L170 115 L230 115 L260 135 L270 148 L130 148 Z" fill="rgba(0, 210, 255, 0.25)" stroke="#00D2FF" stroke-width="2" />
      `;
      break;

    case 'alignment':
      // 3D Wheel alignment tower with crossbeam and sensor targets
      iconGraphic = `
        <rect x="188" y="55" width="24" height="185" rx="3" fill="#004B97" stroke="#00D2FF" stroke-width="2" />
        <rect x="50" y="70" width="300" height="18" rx="4" fill="#0A1829" stroke="#00D2FF" stroke-width="2" />
        <circle cx="65" cy="79" r="14" fill="#004B97" stroke="#FFB703" stroke-width="3" />
        <circle cx="335" cy="79" r="14" fill="#004B97" stroke="#FFB703" stroke-width="3" />
        <!-- Monitor and Diagnostic Console -->
        <rect x="150" y="110" width="100" height="65" rx="6" fill="#0B1523" stroke="#004B97" stroke-width="2" />
        <rect x="156" y="116" width="88" height="53" rx="3" fill="#030712" />
        <path d="M170 145 L185 130 L200 150 L220 128 L235 145" stroke="#00D2FF" stroke-width="2" fill="none" />
        <!-- Targets grid -->
        <rect x="75" y="130" width="36" height="36" rx="3" fill="#0F172A" stroke="#00D2FF" stroke-width="2" />
        <circle cx="87" cy="142" r="3" fill="#00D2FF" />
        <circle cx="99" cy="142" r="3" fill="#00D2FF" />
        <circle cx="87" cy="154" r="3" fill="#00D2FF" />
        <circle cx="99" cy="154" r="3" fill="#00D2FF" />
        <rect x="289" y="130" width="36" height="36" rx="3" fill="#0F172A" stroke="#00D2FF" stroke-width="2" />
        <circle cx="301" cy="142" r="3" fill="#00D2FF" />
        <circle cx="313" cy="142" r="3" fill="#00D2FF" />
        <circle cx="301" cy="154" r="3" fill="#00D2FF" />
        <circle cx="313" cy="154" r="3" fill="#00D2FF" />
      `;
      break;

    case 'tyre':
      // Tyre Changer & Wheel Balancer
      iconGraphic = `
        <rect x="120" y="110" width="160" height="130" rx="8" fill="#004B97" stroke="#00D2FF" stroke-width="2" />
        <!-- Turntable -->
        <ellipse cx="200" cy="110" rx="65" ry="18" fill="#0A1829" stroke="#00D2FF" stroke-width="3" />
        <circle cx="200" cy="110" r="14" fill="#FFB703" />
        <!-- Clamping jaws -->
        <rect x="155" y="105" width="12" height="10" rx="2" fill="#E2E8F0" />
        <rect x="233" y="105" width="12" height="10" rx="2" fill="#E2E8F0" />
        <!-- Vertical Column & Mount Head -->
        <rect x="250" y="45" width="18" height="100" rx="3" fill="#0A1829" stroke="#004B97" stroke-width="2" />
        <path d="M255 45 L195 70 L195 95" stroke="#00D2FF" stroke-width="6" stroke-linecap="round" fill="none" />
        <!-- Bead breaker pedal -->
        <rect x="135" y="228" width="22" height="14" rx="2" fill="#FFB703" />
        <rect x="170" y="228" width="22" height="14" rx="2" fill="#FFB703" />
      `;
      break;

    case 'router':
      // CNC Router / Milling Machine Gantry
      iconGraphic = `
        <rect x="70" y="130" width="260" height="90" rx="6" fill="#004B97" stroke="#00D2FF" stroke-width="2" />
        <!-- T-Slot Vacuum Table Bed -->
        <rect x="80" y="140" width="240" height="20" rx="2" fill="#0A1829" stroke="#00D2FF" stroke-width="1.5" />
        <line x1="80" y1="146" x2="320" y2="146" stroke="#38BDF8" stroke-width="1" />
        <line x1="80" y1="152" x2="320" y2="152" stroke="#38BDF8" stroke-width="1" />
        <!-- Gantry uprights and bridge -->
        <rect x="120" y="60" width="24" height="90" rx="3" fill="#0A1829" stroke="#004B97" stroke-width="2" />
        <rect x="256" y="60" width="24" height="90" rx="3" fill="#0A1829" stroke="#004B97" stroke-width="2" />
        <rect x="110" y="60" width="180" height="22" rx="4" fill="#004B97" stroke="#00D2FF" stroke-width="2" />
        <!-- Spindle -->
        <rect x="188" y="75" width="24" height="42" rx="3" fill="#E2E8F0" stroke="#004B97" stroke-width="2" />
        <polygon points="194,117 206,117 200,128" fill="#FFB703" />
      `;
      break;

    case 'cyclone':
      // Cyclone Dust Collector / Filtration
      iconGraphic = `
        <!-- Filter Drum upper -->
        <rect x="145" y="45" width="110" height="75" rx="6" fill="#F8FAFC" stroke="#004B97" stroke-width="3" />
        <line x1="160" y1="45" x2="160" y2="120" stroke="#CBD5E1" stroke-width="1.5" stroke-dasharray="3,3" />
        <line x1="180" y1="45" x2="180" y2="120" stroke="#CBD5E1" stroke-width="1.5" stroke-dasharray="3,3" />
        <line x1="200" y1="45" x2="200" y2="120" stroke="#CBD5E1" stroke-width="1.5" stroke-dasharray="3,3" />
        <line x1="220" y1="45" x2="220" y2="120" stroke="#CBD5E1" stroke-width="1.5" stroke-dasharray="3,3" />
        <line x1="240" y1="45" x2="240" y2="120" stroke="#CBD5E1" stroke-width="1.5" stroke-dasharray="3,3" />
        <!-- Cyclone Cone in HaoSail Blue -->
        <polygon points="145,120 255,120 215,185 185,185" fill="#004B97" stroke="#00D2FF" stroke-width="2" />
        <!-- Waste drum below -->
        <rect x="165" y="185" width="70" height="50" rx="4" fill="#0A1829" stroke="#004B97" stroke-width="2" />
        <!-- Intake duct -->
        <path d="M255 130 L295 130 L295 90" stroke="#00D2FF" stroke-width="8" stroke-linecap="round" fill="none" />
      `;
      break;

    case 'saw':
      // Heavy Cabinet Saw / Panel Saw / Bandsaw
      iconGraphic = `
        <rect x="80" y="115" width="240" height="120" rx="8" fill="#004B97" stroke="#00D2FF" stroke-width="2" />
        <!-- Ground Cast Table Top -->
        <rect x="65" y="105" width="270" height="16" rx="3" fill="#E2E8F0" stroke="#94A3B8" stroke-width="2" />
        <!-- Sliding Carriage guide rail -->
        <rect x="50" y="118" width="22" height="100" rx="3" fill="#0A1829" stroke="#00D2FF" stroke-width="1.5" />
        <!-- Circular saw blade / Shroud -->
        <circle cx="190" cy="100" r="28" fill="#0A1829" stroke="#FFB703" stroke-width="3" />
        <circle cx="190" cy="100" r="7" fill="#00D2FF" />
        <!-- Rip Fence -->
        <rect x="245" y="90" width="14" height="24" rx="2" fill="#FFB703" />
        <!-- Control buttons -->
        <circle cx="110" cy="150" r="5" fill="#10B981" />
        <circle cx="110" cy="170" r="7" fill="#EF4444" />
      `;
      break;

    case 'press':
      // Hydraulic Shop Press
      iconGraphic = `
        <rect x="110" y="50" width="20" height="190" rx="3" fill="#004B97" stroke="#00D2FF" stroke-width="2" />
        <rect x="270" y="50" width="20" height="190" rx="3" fill="#004B97" stroke="#00D2FF" stroke-width="2" />
        <rect x="100" y="50" width="200" height="22" rx="4" fill="#004B97" stroke="#00D2FF" stroke-width="2" />
        <rect x="95" y="235" width="210" height="12" rx="2" fill="#0A1829" />
        <!-- Bed Bar -->
        <rect x="105" y="145" width="190" height="24" rx="3" fill="#FFB703" />
        <!-- Hydraulic Cylinder and Pressure Gauge -->
        <rect x="185" y="72" width="30" height="50" rx="4" fill="#0A1829" stroke="#00D2FF" stroke-width="2" />
        <line x1="200" y1="122" x2="200" y2="145" stroke="#E2E8F0" stroke-width="8" stroke-linecap="round" />
        <circle cx="200" cy="62" r="10" fill="#FFFFFF" stroke="#004B97" stroke-width="2" />
        <line x1="200" y1="62" x2="206" y2="58" stroke="#EF4444" stroke-width="1.5" />
      `;
      break;

    case 'compactor':
    case 'trowel':
    case 'roller':
      // Road Roller / Plate Compactor / Power Trowel (Heavy Construction)
      iconGraphic = `
        <rect x="90" y="110" width="220" height="90" rx="8" fill="#004B97" stroke="#00D2FF" stroke-width="2" />
        <!-- Engine Block -->
        <rect x="135" y="80" width="70" height="40" rx="4" fill="#0A1829" stroke="#FFB703" stroke-width="2" />
        <rect x="145" y="65" width="25" height="15" rx="2" fill="#FFB703" />
        <!-- Steel Drum Roller / Plate base -->
        <rect x="80" y="195" width="240" height="35" rx="10" fill="#0A1829" stroke="#00D2FF" stroke-width="3" />
        <circle cx="120" cy="212" r="12" fill="#004B97" stroke="#E2E8F0" stroke-width="2" />
        <circle cx="280" cy="212" r="12" fill="#004B97" stroke="#E2E8F0" stroke-width="2" />
        <!-- Steering / Guide Handle -->
        <line x1="260" y1="110" x2="315" y2="60" stroke="#00D2FF" stroke-width="6" stroke-linecap="round" />
        <circle cx="315" cy="60" r="5" fill="#FFB703" />
      `;
      break;

    case 'mixer':
      // Concrete Mixer
      iconGraphic = `
        <circle cx="200" cy="130" r="55" fill="#004B97" stroke="#00D2FF" stroke-width="3" />
        <path d="M160 90 L240 90 L225 150 L175 150 Z" fill="#0A1829" />
        <polygon points="175,80 225,80 235,95 165,95" fill="#FFB703" />
        <!-- Stand & Wheels -->
        <line x1="200" y1="130" x2="150" y2="215" stroke="#0A1829" stroke-width="6" />
        <line x1="200" y1="130" x2="250" y2="215" stroke="#0A1829" stroke-width="6" />
        <circle cx="140" cy="215" r="16" fill="#004B97" stroke="#00D2FF" stroke-width="2" />
        <circle cx="260" cy="215" r="16" fill="#004B97" stroke="#00D2FF" stroke-width="2" />
        <!-- Handwheel for tilt dump -->
        <circle cx="260" cy="130" r="15" fill="none" stroke="#FFB703" stroke-width="3" />
      `;
      break;

    case 'pallet':
      // Hydraulic Pallet Truck
      iconGraphic = `
        <!-- Forks -->
        <rect x="70" y="170" width="200" height="18" rx="3" fill="#004B97" stroke="#00D2FF" stroke-width="2" />
        <rect x="90" y="185" width="16" height="16" rx="8" fill="#0A1829" stroke="#E2E8F0" stroke-width="2" />
        <!-- Hydraulic Pump Base -->
        <rect x="250" y="115" width="45" height="75" rx="6" fill="#004B97" stroke="#00D2FF" stroke-width="2" />
        <circle cx="272" cy="190" r="16" fill="#0A1829" stroke="#FFB703" stroke-width="3" />
        <!-- T-Handle -->
        <line x1="270" y1="125" x2="310" y2="65" stroke="#FFB703" stroke-width="6" stroke-linecap="round" />
        <circle cx="310" cy="65" r="8" fill="#004B97" stroke="#00D2FF" stroke-width="2" />
      `;
      break;

    case 'sprayer':
      // Spray Booth / Finishing System
      iconGraphic = `
        <rect x="70" y="55" width="260" height="180" rx="8" fill="#0A1829" stroke="#004B97" stroke-width="3" />
        <!-- Air intake filter roof -->
        <rect x="85" y="70" width="230" height="20" rx="2" fill="#004B97" stroke="#00D2FF" stroke-width="1.5" />
        <!-- Exhaust floor grate -->
        <rect x="85" y="195" width="230" height="25" rx="2" fill="#1E293B" stroke="#00D2FF" stroke-width="1.5" />
        <!-- Internal lighting & airflow arrows -->
        <line x1="95" y1="75" x2="135" y2="75" stroke="#FFB703" stroke-width="3" />
        <line x1="265" y1="75" x2="305" y2="75" stroke="#FFB703" stroke-width="3" />
        <!-- Spray plume graphic -->
        <path d="M170 140 Q200 110 230 140 T200 170 Z" fill="rgba(0, 210, 255, 0.2)" stroke="#00D2FF" stroke-width="2" />
      `;
      break;

    case 'grinder':
      // Floor Grinder / Surface preparation
      iconGraphic = `
        <rect x="130" y="100" width="140" height="95" rx="6" fill="#004B97" stroke="#00D2FF" stroke-width="2" />
        <!-- Heavy motor housing -->
        <rect x="160" y="65" width="80" height="45" rx="4" fill="#0A1829" stroke="#FFB703" stroke-width="2" />
        <!-- Planetary grinding planetary heads -->
        <ellipse cx="200" cy="195" rx="75" ry="16" fill="#0A1829" stroke="#00D2FF" stroke-width="2.5" />
        <circle cx="160" cy="195" r="10" fill="#FFB703" />
        <circle cx="200" cy="195" r="10" fill="#FFB703" />
        <circle cx="240" cy="195" r="10" fill="#FFB703" />
        <!-- Handle & Cord -->
        <line x1="240" y1="100" x2="300" y2="50" stroke="#00D2FF" stroke-width="6" stroke-linecap="round" />
      `;
      break;

    default:
      // Generic Heavy Machinery / Workshop tool
      iconGraphic = `
        <rect x="90" y="90" width="220" height="130" rx="8" fill="#004B97" stroke="#00D2FF" stroke-width="2" />
        <circle cx="200" cy="140" r="35" fill="#0A1829" stroke="#00D2FF" stroke-width="2.5" />
        <circle cx="200" cy="140" r="14" fill="#FFB703" />
        <rect x="110" y="185" width="180" height="15" rx="3" fill="#E2E8F0" />
      `;
      break;
  }

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
  <defs>
    <!-- Dark industrial gradient background -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#08101D" />
      <stop offset="50%" stop-color="#0F1F35" />
      <stop offset="100%" stop-color="#050B14" />
    </linearGradient>

    <!-- Metallic steel gradient -->
    <linearGradient id="blueMetallic" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0066CC" />
      <stop offset="50%" stop-color="#004B97" />
      <stop offset="100%" stop-color="#003366" />
    </linearGradient>

    <!-- Cyan glow filter -->
    <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background -->
  <rect width="400" height="300" fill="url(#bgGrad)" />

  <!-- Engineering Blueprint Grid Lines -->
  <g stroke="rgba(0, 210, 255, 0.08)" stroke-width="1">
    <line x1="0" y1="50" x2="400" y2="50" />
    <line x1="0" y1="100" x2="400" y2="100" />
    <line x1="0" y1="150" x2="400" y2="150" />
    <line x1="0" y1="200" x2="400" y2="200" />
    <line x1="0" y1="250" x2="400" y2="250" />
    <line x1="80" y1="0" x2="80" y2="300" />
    <line x1="160" y1="0" x2="160" y2="300" />
    <line x1="240" y1="0" x2="240" y2="300" />
    <line x1="320" y1="0" x2="320" y2="300" />
  </g>

  <!-- Machine Illustration -->
  <g>
    ${iconGraphic}
  </g>

  <!-- Top Brand Watermark -->
  <g transform="translate(18, 26)">
    <rect x="0" y="-12" width="75" height="18" rx="3" fill="#004B97" />
    <text x="6" y="1" font-family="system-ui, sans-serif" font-size="10" font-weight="900" fill="#FFFFFF" letter-spacing="0.5">HAOSAIL</text>
    <text x="82" y="1" font-family="monospace" font-size="10" font-weight="700" fill="#00D2FF">${escapeXml(modelCode)}</text>
  </g>

  <!-- Top Right Certification Tag -->
  <g transform="translate(310, 26)">
    <rect x="-8" y="-12" width="80" height="18" rx="3" fill="#0B1C2D" stroke="#004B97" stroke-width="1" />
    <text x="4" y="0" font-family="monospace" font-size="9" font-weight="700" fill="#38BDF8">CE · S1 DUTY</text>
  </g>

  <!-- Bottom Spec & Name Plaque -->
  <rect x="16" y="254" width="368" height="34" rx="6" fill="#07111D" stroke="rgba(0, 210, 255, 0.3)" stroke-width="1" />
  <text x="28" y="270" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#FFFFFF">${escapeXml(truncateText(machineName, 36))}</text>
  <text x="28" y="282" font-family="monospace" font-size="9" font-weight="600" fill="#00D2FF">${escapeXml(primarySpec)} · HaoSail Blue Theme</text>
  <circle cx="366" cy="271" r="4" fill="#10B981" />
</svg>
`.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function truncateText(str: string, maxLen: number): string {
  return str.length > maxLen ? str.slice(0, maxLen - 1) + '…' : str;
}
