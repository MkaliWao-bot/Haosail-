import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  collection,
  deleteDoc,
  doc,
  limit,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  Timestamp,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Category, PowerSource, Product } from '../types/machinery';
import { useAuth } from './AuthContext';

export interface CatalogOverrideRecord {
  productId: string;
  priceKes: number;
  inStock: boolean;
  stockCount: number;
  archived?: boolean;
  updatedBy?: string;
  updatedAt?: Timestamp;
}

export interface CatalogProductDoc {
  productId: string;
  sku: string;
  name: string;
  subtitle: string;
  category: Exclude<Category, 'all'>;
  categoryLabel: string;
  subCategory?: string;
  subCategoryLabel?: string;
  priceKes: number;
  originalPriceKes?: number;
  stockCount: number;
  inStock: boolean;
  freightTier: 'standard-ground' | 'freight-ltl' | 'heavy-freight';
  isFreeFreight: boolean;
  isPopular?: boolean;
  isNewArrival?: boolean;
  image: string;
  powerSource: PowerSource;
  motor: string;
  voltage: string;
  amperage: string;
  capacity: string;
  footprint: string;
  weightLbs: number;
  warrantyYears: number;
  description: string;
  features: string[];
  includedItems: string[];
  createdBy: string;
  updatedBy: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface CreateCatalogProductInput {
  sku: string;
  name: string;
  subtitle: string;
  category: Exclude<Category, 'all'>;
  categoryLabel: string;
  subCategory?: string;
  subCategoryLabel?: string;
  priceKes: number;
  originalPriceKes?: number;
  stockCount: number;
  inStock: boolean;
  freightTier: 'standard-ground' | 'freight-ltl' | 'heavy-freight';
  isFreeFreight: boolean;
  isPopular?: boolean;
  isNewArrival?: boolean;
  image: string;
  powerSource: PowerSource;
  motor: string;
  voltage: string;
  amperage: string;
  capacity: string;
  footprint: string;
  weightLbs: number;
  warrantyYears: number;
  description: string;
  features: string[];
  includedItems: string[];
}

interface CatalogOverridesContextValue {
  overridesMap: Record<string, CatalogOverrideRecord>;
  customProducts: Product[];
  customProductIds: Set<string>;
  archivedProductIds: Set<string>;
  isLoadingOverrides: boolean;
  applyOverridesToProducts: (
    products: Product[],
    options?: { includeArchived?: boolean }
  ) => Product[];
  applyOverrideToProduct: (product: Product) => Product;
  saveCatalogOverride: (input: {
    productId: string;
    priceKes: number;
    inStock: boolean;
    stockCount: number;
    archived?: boolean;
  }) => Promise<{ ok: boolean; error?: string }>;
  setProductArchived: (
    product: Product,
    archived: boolean
  ) => Promise<{ ok: boolean; error?: string }>;
  clearCatalogOverride: (productId: string) => Promise<{ ok: boolean; error?: string }>;
  createCatalogProduct: (
    input: CreateCatalogProductInput
  ) => Promise<{ ok: boolean; productId?: string; error?: string }>;
  updateCatalogProduct: (
    productId: string,
    input: CreateCatalogProductInput
  ) => Promise<{ ok: boolean; error?: string }>;
  deleteCatalogProduct: (productId: string) => Promise<{ ok: boolean; error?: string }>;
}

const CatalogOverridesContext = createContext<CatalogOverridesContextValue | undefined>(undefined);

function mapDocToProduct(docData: CatalogProductDoc): Product {
  const clampedStock = Math.max(0, Math.round(docData.stockCount));
  return {
    id: docData.productId,
    sku: docData.sku,
    name: docData.name,
    subtitle: docData.subtitle,
    category: docData.category,
    categoryLabel: docData.categoryLabel,
    ...(docData.subCategory ? { subCategory: docData.subCategory } : {}),
    ...(docData.subCategoryLabel ? { subCategoryLabel: docData.subCategoryLabel } : {}),
    price: Math.round(docData.priceKes),
    ...(typeof docData.originalPriceKes === 'number' && docData.originalPriceKes > docData.priceKes
      ? { originalPrice: Math.round(docData.originalPriceKes) }
      : {}),
    rating: 4.9,
    reviewsCount: 1,
    inStock: Boolean(docData.inStock && clampedStock > 0),
    stockCount: clampedStock,
    freightTier: docData.freightTier,
    isFreeFreight: Boolean(docData.isFreeFreight),
    isPopular: Boolean(docData.isPopular),
    isNewArrival: docData.isNewArrival ?? true,
    image: docData.image,
    powerSource: docData.powerSource,
    specs: {
      motor: docData.motor,
      voltage: docData.voltage,
      amperage: docData.amperage,
      capacity: docData.capacity,
      footprint: docData.footprint,
      weightLbs: Math.max(1, Math.round(docData.weightLbs)),
      warrantyYears: Math.max(1, Math.min(10, Math.round(docData.warrantyYears))),
    },
    description: docData.description,
    features: Array.isArray(docData.features) ? docData.features : [],
    includedItems: Array.isArray(docData.includedItems) ? docData.includedItems : [],
  };
}

function sanitizeCustomProductPayload(
  input: CreateCatalogProductInput,
  productId: string,
  uid: string
) {
  const safePrice = Math.min(50_000_000, Math.max(100, Math.round(Number(input.priceKes) || 0)));
  const rawOriginal = Number(input.originalPriceKes || 0);
  const safeOriginal =
    rawOriginal > safePrice ? Math.min(50_000_000, Math.round(rawOriginal)) : undefined;
  const safeStock = Math.min(10_000, Math.max(0, Math.round(Number(input.stockCount) || 0)));
  const safeInStock = Boolean(input.inStock && safeStock > 0);
  const safeFeatures = input.features
    .map((s) => s.trim().slice(0, 140))
    .filter(Boolean)
    .slice(0, 12);
  const safeIncluded = input.includedItems
    .map((s) => s.trim().slice(0, 140))
    .filter(Boolean)
    .slice(0, 12);

  return {
    productId,
    sku: (input.sku.trim().toUpperCase().slice(0, 40) || `HS-${productId.slice(-6).toUpperCase()}`),
    name: input.name.trim().slice(0, 140),
    subtitle: (input.subtitle.trim().slice(0, 200) || input.name.trim().slice(0, 200)),
    category: input.category,
    categoryLabel: input.categoryLabel.trim().slice(0, 80),
    ...(input.subCategory?.trim() ? { subCategory: input.subCategory.trim().slice(0, 60) } : {}),
    ...(input.subCategoryLabel?.trim()
      ? { subCategoryLabel: input.subCategoryLabel.trim().slice(0, 80) }
      : {}),
    priceKes: safePrice,
    ...(safeOriginal ? { originalPriceKes: safeOriginal } : {}),
    stockCount: safeStock,
    inStock: safeInStock,
    freightTier: input.freightTier,
    isFreeFreight: Boolean(input.isFreeFreight),
    isPopular: Boolean(input.isPopular),
    isNewArrival: input.isNewArrival ?? true,
    image: input.image.trim().slice(0, 1000),
    powerSource: input.powerSource,
    motor: (input.motor.trim().slice(0, 100) || 'Industrial Motor'),
    voltage: (input.voltage.trim().slice(0, 80) || '230V / 50Hz'),
    amperage: (input.amperage.trim().slice(0, 60) || '16A'),
    capacity: (input.capacity.trim().slice(0, 120) || 'Commercial Duty'),
    footprint: (input.footprint.trim().slice(0, 100) || '1200 x 800 x 1100 mm'),
    weightLbs: Math.min(100_000, Math.max(1, Math.round(Number(input.weightLbs) || 100))),
    warrantyYears: Math.min(10, Math.max(1, Math.round(Number(input.warrantyYears) || 2))),
    description:
      input.description.trim().slice(0, 1500) ||
      `${input.name.trim()} supplied ready for commercial workshop deployment across Kenya.`,
    features: safeFeatures.length > 0 ? safeFeatures : ['Commercial-grade steel chassis', '1-Year Nairobi Depot Warranty'],
    includedItems: safeIncluded.length > 0 ? safeIncluded : ['Main Machine Unit', 'Operator Manual & Toolkit'],
    updatedBy: uid,
  };
}

export const CatalogOverridesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAdmin } = useAuth();
  const [overridesMap, setOverridesMap] = useState<Record<string, CatalogOverrideRecord>>({});
  const [customProductsDocs, setCustomProductsDocs] = useState<CatalogProductDoc[]>([]);
  const [isLoadingOverrides, setIsLoadingOverrides] = useState(true);

  useEffect(() => {
    const overridesQuery = query(collection(db, 'catalogOverrides'), limit(200));

    const unsubscribeOverrides = onSnapshot(
      overridesQuery,
      (snapshot) => {
        const nextMap: Record<string, CatalogOverrideRecord> = {};
        for (const docSnap of snapshot.docs) {
          const data = docSnap.data() as CatalogOverrideRecord;
          if (data?.productId && typeof data.priceKes === 'number') {
            nextMap[data.productId] = data;
          }
        }
        setOverridesMap(nextMap);
        setIsLoadingOverrides(false);
      },
      (error) => {
        setIsLoadingOverrides(false);
        handleFirestoreError(error, OperationType.LIST, 'catalogOverrides');
      }
    );

    const customProductsQuery = query(collection(db, 'catalogProducts'), limit(200));
    const unsubscribeProducts = onSnapshot(
      customProductsQuery,
      (snapshot) => {
        const docs = snapshot.docs.map((d) => d.data() as CatalogProductDoc);
        docs.sort((a, b) => {
          const msA = a.createdAt?.toMillis?.() ?? 0;
          const msB = b.createdAt?.toMillis?.() ?? 0;
          return msB - msA;
        });
        setCustomProductsDocs(docs);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'catalogProducts');
      }
    );

    return () => {
      unsubscribeOverrides();
      unsubscribeProducts();
    };
  }, []);

  const customProducts = useMemo(
    () => customProductsDocs.map(mapDocToProduct),
    [customProductsDocs]
  );

  const customProductIds = useMemo(
    () => new Set(customProductsDocs.map((d) => d.productId)),
    [customProductsDocs]
  );

  const archivedProductIds = useMemo(() => {
    const ids = new Set<string>();
    for (const [id, rec] of Object.entries(overridesMap)) {
      if (rec.archived) ids.add(id);
    }
    return ids;
  }, [overridesMap]);

  const applyOverrideToProduct = useCallback(
    (product: Product): Product => {
      const override = overridesMap[product.id];
      if (!override) return product;
      const clampedStock = Math.max(0, Math.round(override.stockCount));
      return {
        ...product,
        price: Math.round(override.priceKes),
        stockCount: clampedStock,
        inStock: Boolean(override.inStock && clampedStock > 0),
      };
    },
    [overridesMap]
  );

  const applyOverridesToProducts = useCallback(
    (products: Product[], options?: { includeArchived?: boolean }): Product[] => {
      const includeArchived = Boolean(options?.includeArchived);
      const filteredFactory = products
        .filter((p) => includeArchived || !overridesMap[p.id]?.archived)
        .map(applyOverrideToProduct);
      const customWithOverrides = customProducts
        .filter((p) => includeArchived || !overridesMap[p.id]?.archived)
        .map(applyOverrideToProduct);
      return [...customWithOverrides, ...filteredFactory];
    },
    [applyOverrideToProduct, customProducts, overridesMap]
  );

  const saveCatalogOverride = async (input: {
    productId: string;
    priceKes: number;
    inStock: boolean;
    stockCount: number;
    archived?: boolean;
  }): Promise<{ ok: boolean; error?: string }> => {
    if (!user || !user.emailVerified || !isAdmin) {
      return { ok: false, error: 'Verified Administrator sign-in required to edit inventory.' };
    }

    const cleanId = input.productId.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64);
    if (cleanId.length < 4) {
      return { ok: false, error: 'Invalid product identifier.' };
    }

    const safePrice = Math.min(50_000_000, Math.max(100, Math.round(Number(input.priceKes) || 0)));
    const safeStock = Math.min(10_000, Math.max(0, Math.round(Number(input.stockCount) || 0)));
    const safeInStock = Boolean(input.inStock && safeStock > 0);
    const prevArchived = overridesMap[cleanId]?.archived ?? false;
    const nextArchived = input.archived !== undefined ? Boolean(input.archived) : prevArchived;
    const path = `catalogOverrides/${cleanId}`;

    try {
      await setDoc(doc(db, 'catalogOverrides', cleanId), {
        productId: cleanId,
        priceKes: safePrice,
        inStock: safeInStock,
        stockCount: safeStock,
        archived: nextArchived,
        updatedBy: user.uid,
        updatedAt: serverTimestamp(),
      });
      return { ok: true };
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.WRITE, path);
      } catch {
        return { ok: false, error: 'Unable to save catalog override to Firestore.' };
      }
      return { ok: false, error: 'Unable to save catalog override.' };
    }
  };

  const setProductArchived = async (
    product: Product,
    archived: boolean
  ): Promise<{ ok: boolean; error?: string }> => {
    return saveCatalogOverride({
      productId: product.id,
      priceKes: product.price,
      inStock: product.inStock,
      stockCount: product.stockCount,
      archived,
    });
  };

  const clearCatalogOverride = async (
    productId: string
  ): Promise<{ ok: boolean; error?: string }> => {
    if (!user || !user.emailVerified || !isAdmin) {
      return { ok: false, error: 'Verified Administrator sign-in required.' };
    }
    const cleanId = productId.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64);
    const path = `catalogOverrides/${cleanId}`;
    try {
      await deleteDoc(doc(db, 'catalogOverrides', cleanId));
      return { ok: true };
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.DELETE, path);
      } catch {
        return { ok: false, error: 'Unable to clear catalog override.' };
      }
      return { ok: false, error: 'Unable to clear catalog override.' };
    }
  };

  const createCatalogProduct = async (
    input: CreateCatalogProductInput
  ): Promise<{ ok: boolean; productId?: string; error?: string }> => {
    if (!user || !user.emailVerified || !isAdmin) {
      return { ok: false, error: 'Verified Administrator sign-in required to add inventory.' };
    }

    if (!input.name.trim() || !input.sku.trim()) {
      return { ok: false, error: 'Machine name and SKU are required.' };
    }
    if (!input.image.trim()) {
      return { ok: false, error: 'Select a studio product image or enter a valid image path.' };
    }

    const slugBase = input.sku
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 32);
    const suffix = Date.now().toString(36).slice(-5);
    const productId = `hs-c-${slugBase}-${suffix}`.slice(0, 60);
    const path = `catalogProducts/${productId}`;

    try {
      const payload = sanitizeCustomProductPayload(input, productId, user.uid);
      await setDoc(doc(db, 'catalogProducts', productId), {
        ...payload,
        createdBy: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return { ok: true, productId };
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.CREATE, path);
      } catch {
        return { ok: false, error: 'Unable to add new machine to Firestore catalog.' };
      }
      return { ok: false, error: 'Unable to add new machine to Firestore catalog.' };
    }
  };

  const updateCatalogProduct = async (
    productId: string,
    input: CreateCatalogProductInput
  ): Promise<{ ok: boolean; error?: string }> => {
    if (!user || !user.emailVerified || !isAdmin) {
      return { ok: false, error: 'Verified Administrator sign-in required to update catalog.' };
    }

    const cleanId = productId.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64);
    const path = `catalogProducts/${cleanId}`;
    try {
      const payload = sanitizeCustomProductPayload(input, cleanId, user.uid);
      const { productId: _pid, ...updatableFields } = payload;
      await updateDoc(doc(db, 'catalogProducts', cleanId), {
        ...updatableFields,
        updatedAt: serverTimestamp(),
      });
      return { ok: true };
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.UPDATE, path);
      } catch {
        return { ok: false, error: 'Unable to update machine details.' };
      }
      return { ok: false, error: 'Unable to update machine details.' };
    }
  };

  const deleteCatalogProduct = async (
    productId: string
  ): Promise<{ ok: boolean; error?: string }> => {
    if (!user || !user.emailVerified || !isAdmin) {
      return { ok: false, error: 'Verified Administrator sign-in required to remove inventory.' };
    }
    const cleanId = productId.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64);
    const path = `catalogProducts/${cleanId}`;
    try {
      await deleteDoc(doc(db, 'catalogProducts', cleanId));
      if (overridesMap[cleanId]) {
        await deleteDoc(doc(db, 'catalogOverrides', cleanId));
      }
      return { ok: true };
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.DELETE, path);
      } catch {
        return { ok: false, error: 'Unable to remove machine from Firestore catalog.' };
      }
      return { ok: false, error: 'Unable to remove machine from Firestore catalog.' };
    }
  };

  return (
    <CatalogOverridesContext.Provider
      value={{
        overridesMap,
        customProducts,
        customProductIds,
        archivedProductIds,
        isLoadingOverrides,
        applyOverridesToProducts,
        applyOverrideToProduct,
        saveCatalogOverride,
        setProductArchived,
        clearCatalogOverride,
        createCatalogProduct,
        updateCatalogProduct,
        deleteCatalogProduct,
      }}
    >
      {children}
    </CatalogOverridesContext.Provider>
  );
};

export function useCatalogOverrides() {
  const ctx = useContext(CatalogOverridesContext);
  if (!ctx) {
    throw new Error('useCatalogOverrides must be used within a CatalogOverridesProvider');
  }
  return ctx;
}
