import React, { useState, useEffect } from 'react';
import { PRODUCTS } from './data/machineryData';
import { Product, FilterState, CartItem, Category, CheckoutPlanPreset } from './types/machinery';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { CatalogSection } from './components/CatalogSection';
import { ShowroomProofSection } from './components/ShowroomProofSection';
import { SearchCommandModal } from './components/SearchCommandModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { SpecComparisonModal } from './components/SpecComparisonModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { CheckoutPage } from './components/CheckoutPage';
import { GeminiAdvisorModal } from './components/GeminiAdvisorModal';
import { ProformaInvoiceModal } from './components/ProformaInvoiceModal';
import { SpecSheetModal } from './components/SpecSheetModal';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { initTactileButtonPing } from './utils/tactileClick';
import { LayoutGrid, GitCompare, ShoppingBag, FileText, X, ArrowRight } from 'lucide-react';

const INITIAL_FILTER_STATE: FilterState = {
  searchQuery: '',
  category: 'all',
  subCategory: 'all',
  powerSource: 'all',
  minPrice: 0,
  maxPrice: 4000000,
  inStockOnly: false,
  freeFreightOnly: false,
  lipaPolePoleOnly: false,
  dealsOnly: false,
  minHorsepower: 0,
  sortBy: 'featured',
};

export default function App() {
  const [filterState, setFilterState] = useState<FilterState>(INITIAL_FILTER_STATE);
  const [currentView, setCurrentView] = useState<'catalog' | 'checkout'>('catalog');

  // Cart state persisted in localStorage, defaulting to empty
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('haosail_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Safe fallback
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('haosail_cart', JSON.stringify(cartItems));
    } catch {
      // Safe fallback
    }
  }, [cartItems]);

  // Spec comparison list starts blank so users can select machines afresh
  const [compareList, setCompareList] = useState<Product[]>([]);

  // Modal states
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  const [isProformaOpen, setIsProformaOpen] = useState(false);
  const [proformaProduct, setProformaProduct] = useState<Product | null>(null);
  const [specSheetState, setSpecSheetState] = useState<{
    product: Product;
    voltage?: string;
    countyId?: string;
  } | null>(null);
  const [checkoutPreset, setCheckoutPreset] = useState<CheckoutPlanPreset | null>(null);
  const [appliedVoucherCode, setAppliedVoucherCode] = useState<string>('');
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const handleOpenProforma = (product?: Product) => {
    setProformaProduct(product || null);
    setIsProformaOpen(true);
  };

  const isPrintDocumentOpen = isProformaOpen || Boolean(specSheetState);

  // Tactile perimeter ping on all clickable storefront buttons
  useEffect(() => {
    return initTactileButtonPing();
  }, []);

  // Global keyboard shortcuts (Cmd+K or /)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      } else if (e.key === '/' && !isSearchOpen && (document.activeElement?.tagName !== 'INPUT')) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  // Filter handlers
  const handleFilterChange = (update: Partial<FilterState>) => {
    setFilterState((prev) => ({ ...prev, ...update }));
  };

  const handleResetFilters = () => {
    setFilterState(INITIAL_FILTER_STATE);
  };

  const handleReturnHome = () => {
    setCurrentView('catalog');
    setFilterState(INITIAL_FILTER_STATE);
    setSelectedProduct(null);
    setIsCartOpen(false);
    setIsSearchOpen(false);
    setIsComparisonOpen(false);
    setIsAdvisorOpen(false);
    setIsProformaOpen(false);
    setSpecSheetState(null);
    setIsAuthOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryNav = (cat: string) => {
    setCurrentView('catalog');
    setFilterState((prev) => ({ ...prev, category: cat as Category, subCategory: 'all' }));
    setTimeout(() => {
      document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleSearchSubmitFromHero = (query: string) => {
    setFilterState((prev) => ({ ...prev, searchQuery: query }));
    const catalogElem = document.getElementById('catalog');
    if (catalogElem) {
      catalogElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Cart operations
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  // Direct Express Checkout: bypasses cart and navigates straight to checkout
  const handleBuyNow = (
    product: Product, 
    quantity = 1, 
    options?: {
      selectedVoltage?: string;
      selectedDeliveryTier?: string;
      clearExistingCart?: boolean;
      financingPreset?: CheckoutPlanPreset;
    }
  ) => {
    setCartItems((prev) => {
      const newItem: CartItem = {
        product,
        quantity,
        selectedVoltage: options?.selectedVoltage,
        selectedDeliveryTier: options?.selectedDeliveryTier,
      };

      if (options?.clearExistingCart) {
        return [newItem];
      }

      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex >= 0) {
        return prev.map((item, idx) =>
          idx === existingIndex
            ? {
                ...item,
                quantity: item.quantity + quantity,
                selectedVoltage: options?.selectedVoltage || item.selectedVoltage,
                selectedDeliveryTier: options?.selectedDeliveryTier || item.selectedDeliveryTier,
              }
            : item
        );
      }
      return [...prev, newItem];
    });

    if (options?.financingPreset) {
      setCheckoutPreset(options.financingPreset);
    }

    // Close any open modals and immediately switch view to checkout
    setSelectedProduct(null);
    setIsCartOpen(false);
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleOrderCompleted = () => {
    setCartItems([]);
  };

  // Compare operations
  const handleToggleCompare = (product: Product) => {
    setCompareList((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      if (prev.length >= 4) {
        return [...prev.slice(1), product];
      }
      return [...prev, product];
    });
  };

  const handleRemoveFromCompare = (productId: string) => {
    setCompareList((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleClearCompare = () => {
    setCompareList([]);
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F6F6F4] text-[#111315] dark:bg-[#0D0F12] dark:text-[#F3F4F6] transition-colors duration-200">
      {/* Top Navigation Bar */}
      <div className={isPrintDocumentOpen ? 'print:hidden' : undefined}>
        <Header
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenComparison={() => setIsComparisonOpen(true)}
          onOpenAdvisor={() => setIsAdvisorOpen(true)}
          onOpenProforma={() => handleOpenProforma()}
          cartCount={totalCartCount}
          compareList={compareList}
          onNavigateCategory={handleCategoryNav}
          onReturnHome={handleReturnHome}
          onGoToCheckout={() => setCurrentView('checkout')}
          currentView={currentView}
          activeCategory={filterState.category}
        />
      </div>

      {/* Main Content: Catalog vs Dedicated Checkout Page */}
      <main className={`flex-1 pb-14 md:pb-0 ${isPrintDocumentOpen ? 'print:hidden' : ''}`}>
        {currentView === 'checkout' ? (
          <CheckoutPage
            cartItems={cartItems}
            initialPreset={checkoutPreset}
            initialVoucherCode={appliedVoucherCode}
            onVoucherChange={(code) => setAppliedVoucherCode(code)}
            onBackToCatalog={() => setCurrentView('catalog')}
            onOpenAuth={() => setIsAuthOpen(true)}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveFromCart}
            onAddToCart={handleAddToCart}
            onClearCart={() => {
              setCartItems([]);
              setCheckoutPreset(null);
            }}
          />
        ) : (
          <>
            {/* Editorial Cinema Hero Banner */}
            <HeroBanner
              onSearchSubmit={handleSearchSubmitFromHero}
              onExploreCatalog={() => {
                setFilterState(INITIAL_FILTER_STATE);
                setTimeout(() => {
                  document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                }, 40);
              }}
              onSelectCategory={(cat) => handleCategoryNav(cat)}
              onOpenAdvisor={() => setIsAdvisorOpen(true)}
              onSelectProduct={(p) => setSelectedProduct(p)}
              onOpenProforma={() => handleOpenProforma()}
            />

            {/* Catalog Section with Fast Parametric Filters & Product Grid */}
            <CatalogSection
              products={PRODUCTS}
              filterState={filterState}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
              onOpenDetails={(p) => setSelectedProduct(p)}
              onAddToCart={(p) => handleAddToCart(p, 1)}
              onBuyNow={handleBuyNow}
              onToggleCompare={handleToggleCompare}
              compareList={compareList}
              onOpenComparison={() => setIsComparisonOpen(true)}
              onOpenAdvisor={() => setIsAdvisorOpen(true)}
              onRequestProforma={(product) => handleOpenProforma(product)}
            />

            {/* Yard Verification, KRA E-TIMS & County Dispatch Proof Strip */}
            <ShowroomProofSection
              onOpenProforma={() => handleOpenProforma()}
              onOpenAdvisor={() => setIsAdvisorOpen(true)}
            />
          </>
        )}
      </main>

      {/* Desktop Floating Spec Comparison Dock */}
      {currentView === 'catalog' && compareList.length > 0 && (
        <div className="hidden md:flex print:hidden fixed bottom-5 right-6 z-40 items-center gap-3 rounded-lg border border-[#E2E4E8] dark:border-[#262A33] bg-white/95 dark:bg-[#15181E]/95 backdrop-blur-md px-3.5 py-2.5 shadow-xl">
          <div className="flex items-center gap-2 text-xs">
            <GitCompare className="h-3.5 w-3.5 text-[#004B97] dark:text-sky-400 shrink-0" />
            <span className="font-mono font-semibold text-[#111315] dark:text-white tabular-nums">
              {compareList.length} / 4
            </span>
            <span className="text-[#5A606B] dark:text-slate-400">
              {compareList.length === 1 ? 'machine queued' : 'machines queued'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsComparisonOpen(true)}
            className="btn-press btn-nudge inline-flex items-center gap-1.5 rounded-md bg-[#004B97] hover:bg-[#003B78] px-3 py-1.5 text-xs font-semibold text-white cursor-pointer whitespace-nowrap"
          >
            <span>Compare Specs</span>
            <ArrowRight className="h-3 w-3 btn-arrow" />
          </button>

          <button
            type="button"
            onClick={handleClearCompare}
            aria-label="Clear comparison queue"
            title="Clear comparison queue"
            className="rounded p-1 text-[#5A606B] dark:text-slate-400 hover:bg-[#F6F6F4] dark:hover:bg-[#262A33] hover:text-[#111315] dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Modern Fast Search Command Palette (Cmd+K) */}
      <SearchCommandModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={PRODUCTS}
        onSelectProduct={(p) => setSelectedProduct(p)}
        onApplyCategoryFilter={handleCategoryNav}
      />

      {/* Product Detail Modal (PDP & Spec Sheet) */}
      <div className={isPrintDocumentOpen ? 'print:hidden' : undefined}>
        <ProductDetailModal
          key={selectedProduct?.id || 'empty-modal'}
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          onToggleCompare={handleToggleCompare}
          isCompared={selectedProduct ? compareList.some((p) => p.id === selectedProduct.id) : false}
          onOpenAdvisor={() => setIsAdvisorOpen(true)}
          onRequestProforma={(product) => handleOpenProforma(product)}
          onOpenSpecSheet={(product, voltage, countyId) =>
            setSpecSheetState({ product, voltage, countyId })
          }
        />
      </div>

      {/* Spec Comparison Drawer / Modal */}
      <SpecComparisonModal
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
        compareList={compareList}
        onRemoveItem={handleRemoveFromCompare}
        onClearAll={handleClearCompare}
        onAddToCart={(p) => handleAddToCart(p, 1)}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      {/* Slide-over Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onAddToCart={(p, qty = 1) => handleAddToCart(p, qty)}
        onClearCart={() => setCartItems([])}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setCurrentView('checkout');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Commercial Freight Checkout & Tracking Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onOrderCompleted={handleOrderCompleted}
      />

      {/* Multi-turn Gemini AI Technical Advisor Modal */}
      <GeminiAdvisorModal
        isOpen={isAdvisorOpen}
        onClose={() => setIsAdvisorOpen(false)}
      />

      {/* Official B2B KRA E-TIMS Proforma Invoice Generator Modal */}
      <ProformaInvoiceModal
        isOpen={isProformaOpen}
        onClose={() => setIsProformaOpen(false)}
        product={proformaProduct}
        cartItems={cartItems}
        onProceedToCheckout={() => {
          setIsProformaOpen(false);
          setCurrentView('checkout');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Printable A4 Technical Specification Sheet Modal */}
      <SpecSheetModal
        isOpen={Boolean(specSheetState)}
        onClose={() => setSpecSheetState(null)}
        product={specSheetState?.product || null}
        selectedVoltage={specSheetState?.voltage}
        selectedCountyId={specSheetState?.countyId}
        onRequestProforma={(product) => handleOpenProforma(product)}
      />

      {/* User Login & Workshop Account Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      {/* Mobile Compact Action Bar */}
      <div className="fixed bottom-0 inset-x-0 z-40 md:hidden print:hidden bg-white/95 dark:bg-[#15181E]/95 backdrop-blur-md border-t border-[#E2E4E8] dark:border-[#262A33] py-1.5 px-3 flex items-center justify-around">
        <button
          type="button"
          onClick={() => {
            if (currentView !== 'catalog') setCurrentView('catalog');
            document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex flex-col items-center gap-0.5 text-[10px] font-medium text-[#5A606B] dark:text-slate-400 hover:text-[#004B97] dark:hover:text-white py-1 px-2 cursor-pointer transition-colors"
        >
          <LayoutGrid className="h-4 w-4" />
          <span>Catalog</span>
        </button>

        <button
          type="button"
          onClick={() => setIsComparisonOpen(true)}
          className="relative flex flex-col items-center gap-0.5 text-[10px] font-medium text-[#5A606B] dark:text-slate-400 hover:text-[#004B97] dark:hover:text-white py-1 px-2 cursor-pointer transition-colors"
        >
          <GitCompare className="h-4 w-4" />
          <span>Compare ({compareList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => handleOpenProforma()}
          className="flex flex-col items-center gap-0.5 text-[10px] font-semibold text-[#004B97] dark:text-sky-400 py-1 px-2 cursor-pointer transition-colors"
        >
          <FileText className="h-4 w-4" />
          <span>Quote</span>
        </button>

        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center gap-0.5 text-[10px] font-medium text-[#5A606B] dark:text-slate-400 hover:text-[#004B97] dark:hover:text-white py-1 px-2 cursor-pointer transition-colors"
        >
          <ShoppingBag className="h-4 w-4" />
          <span>Cart ({totalCartCount})</span>
        </button>
      </div>

      {/* Industrial Footer */}
      <div className={isPrintDocumentOpen ? 'print:hidden' : undefined}>
        <Footer
          onNavigateCategory={handleCategoryNav}
          onOpenAdvisor={() => setIsAdvisorOpen(true)}
          onReturnHome={handleReturnHome}
        />
      </div>
    </div>
  );
}
