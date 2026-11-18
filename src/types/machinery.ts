export type Category = 
  | 'all'
  | 'woodworking'
  | 'auto-maintenance'
  | 'welding-metalworking'
  | 'construction-concrete'
  | 'workshop-tools';

export interface SubCategoryConfig {
  id: string;
  label: string;
}

export interface CategoryConfig {
  id: Category;
  label: string;
  shortLabel: string;
  description: string;
  count: number;
  subCategories?: SubCategoryConfig[];
}

export type PowerSource = 'all' | 'corded-230v' | 'corded-115v' | 'cordless-18v' | '3-phase-400v' | 'engine-manual';

export interface ProductSpecs {
  motor: string;
  voltage: string;
  amperage: string;
  capacity: string;
  footprint: string;
  weightLbs: number;
  dustPortSize?: string;
  arborOrSpindle?: string;
  bladeSize?: string;
  rpm?: string;
  warrantyYears: number;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  subtitle: string;
  category: Category;
  categoryLabel: string;
  subCategory?: string;
  subCategoryLabel?: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  stockCount: number;
  freightTier: 'standard-ground' | 'freight-ltl' | 'heavy-freight';
  isFreeFreight: boolean;
  isPopular?: boolean;
  isNewArrival?: boolean;
  image: string;
  powerSource: PowerSource;
  specs: ProductSpecs;
  description: string;
  features: string[];
  includedItems: string[];
  aiMatchScore?: number;
  aiInsight?: string;
  aiTags?: string[];
}

export interface CheckoutPlanPreset {
  settlementMode: 'full' | 'lipa-pole-pole';
  depositPercent?: number;
  installmentCadence?: 'monthly' | 'weekly';
  loanTenureMonths?: number;
  loanTenureWeeks?: number;
  financingChannel?: string;
  preferredCountyId?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVoltage?: string;
  selectedPhase?: string;
  selectedDeliveryTier?: string;
  notes?: string;
}

export interface FilterState {
  searchQuery: string;
  category: Category;
  subCategory?: string;
  powerSource: PowerSource;
  minPrice: number;
  maxPrice: number;
  inStockOnly: boolean;
  freeFreightOnly: boolean;
  lipaPolePoleOnly?: boolean;
  dealsOnly?: boolean;
  minHorsepower: number;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'power-desc' | 'weight-desc' | 'rating-desc';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
