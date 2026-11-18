import { Product } from '../types/machinery';
import { AccessoryItem } from '../data/accessoryData';

export function accessoryToProduct(acc: AccessoryItem): Product {
  return {
    id: acc.id,
    sku: acc.sku,
    name: acc.name,
    subtitle: 'Genuine HaoSail Compatible Consumable / Accessory',
    category: acc.category,
    categoryLabel: 'Workshop Accessories & Consumables',
    subCategory: 'accessories',
    subCategoryLabel: 'Consumables & Rigging',
    price: acc.price,
    originalPrice: acc.originalPrice,
    rating: 4.9,
    reviewsCount: 18,
    inStock: true,
    stockCount: 24,
    freightTier: 'standard-ground',
    isFreeFreight: false,
    image: acc.image,
    powerSource: 'all',
    specs: {
      motor: 'OEM Compatible Component',
      voltage: 'N/A (Accessory)',
      amperage: 'N/A',
      capacity: 'Factory Matched Fitment',
      footprint: 'Compact Carton',
      weightLbs: 15,
      warrantyYears: 1,
    },
    description: acc.description,
    features: [acc.description, 'Verified fitment at HaoSail Enterprise Road depot'],
    includedItems: [acc.name],
  };
}
