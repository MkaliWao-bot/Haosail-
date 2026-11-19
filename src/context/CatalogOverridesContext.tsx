import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  collection,
  deleteDoc,
  doc,
  limit,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Product } from '../types/machinery';
import { useAuth } from './AuthContext';

export interface CatalogOverrideRecord {
  productId: string;
  priceKes: number;
  inStock: boolean;
  stockCount: number;
  updatedBy?: string;
  updatedAt?: Timestamp;
}

interface CatalogOverridesContextValue {
  overridesMap: Record<string, CatalogOverrideRecord>;
  isLoadingOverrides: boolean;
  applyOverridesToProducts: (products: Product[]) => Product[];
  applyOverrideToProduct: (product: Product) => Product;
  saveCatalogOverride: (input: {
    productId: string;
    priceKes: number;
    inStock: boolean;
    stockCount: number;
  }) => Promise<{ ok: boolean; error?: string }>;
  clearCatalogOverride: (productId: string) => Promise<{ ok: boolean; error?: string }>;
}

const CatalogOverridesContext = createContext<CatalogOverridesContextValue | undefined>(undefined);

export const CatalogOverridesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAdmin } = useAuth();
  const [overridesMap, setOverridesMap] = useState<Record<string, CatalogOverrideRecord>>({});
  const [isLoadingOverrides, setIsLoadingOverrides] = useState(true);

  useEffect(() => {
    const overridesQuery = query(
      collection(db, 'catalogOverrides'),
      limit(200)
    );

    const unsubscribe = onSnapshot(
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

    return () => unsubscribe();
  }, []);

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
    (products: Product[]): Product[] => products.map(applyOverrideToProduct),
    [applyOverrideToProduct]
  );

  const saveCatalogOverride = async (input: {
    productId: string;
    priceKes: number;
    inStock: boolean;
    stockCount: number;
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
    const path = `catalogOverrides/${cleanId}`;

    try {
      await setDoc(doc(db, 'catalogOverrides', cleanId), {
        productId: cleanId,
        priceKes: safePrice,
        inStock: safeInStock,
        stockCount: safeStock,
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

  return (
    <CatalogOverridesContext.Provider
      value={{
        overridesMap,
        isLoadingOverrides,
        applyOverridesToProducts,
        applyOverrideToProduct,
        saveCatalogOverride,
        clearCatalogOverride,
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
