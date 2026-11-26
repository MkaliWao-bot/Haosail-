import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Building2,
  PackageCheck,
  LayoutDashboard,
  ClipboardList,
  Boxes,
  Users,
  ShieldCheck,
  LogOut,
  Check,
  AlertCircle,
  Phone,
  MapPin,
  Plus,
  Minus,
  Download,
  RotateCcw,
  Trash2,
  Archive,
  ArchiveRestore,
  Pencil,
  UserPlus,
  Search,
  Menu,
  X,
} from 'lucide-react';
import {
  BOOTSTRAP_ADMIN_EMAIL,
  UserAccountData,
  UserOrderRecord,
  UserPrivateData,
  useAuth,
} from '../context/AuthContext';
import {
  CreateCatalogProductInput,
  useCatalogOverrides,
} from '../context/CatalogOverridesContext';
import { CATEGORIES_CONFIG, PRODUCTS } from '../data/machineryData';
import { KENYAN_COUNTY_HUBS } from '../data/accessoryData';
import { Product } from '../types/machinery';
import { formatKSh } from '../utils/currency';
import { downloadCsvFile } from '../utils/csvExport';
import { AddEditEquipmentModal } from './AddEditEquipmentModal';
import { HaoSailLogo } from './HaoSailLogo';
import { useTheme } from '../context/ThemeContext';

export type PortalTab =
  | 'profile'
  | 'orders'
  | 'admin-overview'
  | 'admin-orders'
  | 'admin-inventory'
  | 'admin-customers'
  | 'admin-staff';

interface UserAdminPortalProps {
  initialTab?: PortalTab;
  attemptedAdminLogin?: boolean;
  onClose: () => void;
}

const TAB_LABELS: Record<PortalTab, string> = {
  profile: 'Workshop Profile',
  orders: 'My Orders',
  'admin-overview': 'Admin Overview',
  'admin-orders': 'Orders & Dispatch',
  'admin-inventory': 'Inventory & Catalog',
  'admin-customers': 'Customers & B2B',
  'admin-staff': 'Staff & Access',
};

export const UserAdminPortal: React.FC<UserAdminPortalProps> = ({
  initialTab,
  attemptedAdminLogin = false,
  onClose,
}) => {
  const { isDarkMode } = useTheme();
  const {
    user,
    isAdmin,
    isBootstrappedAdmin,
    accountProfile,
    privateInfo,
    userOrders,
    allOrders,
    adminUsers,
    signOutUser,
    updateWorkshopDetails,
    adminUpdateOrderStatus,
    loadBuyerDetailsForAdmin,
    grantAdminAccess,
    revokeAdminAccess,
  } = useAuth();

  const {
    overridesMap,
    customProductIds,
    archivedProductIds,
    applyOverridesToProducts,
    saveCatalogOverride,
    setProductArchived,
    clearCatalogOverride,
    createCatalogProduct,
    updateCatalogProduct,
    deleteCatalogProduct,
  } = useCatalogOverrides();

  const [activeTab, setActiveTab] = useState<PortalTab>(() => {
    if (initialTab) return initialTab;
    if (attemptedAdminLogin && isAdmin) return 'admin-overview';
    return 'profile';
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sync if admin status resolves right after sign-in
  useEffect(() => {
    if (attemptedAdminLogin && isAdmin && (activeTab === 'profile' || activeTab === 'orders')) {
      setActiveTab('admin-overview');
    }
  }, [attemptedAdminLogin, isAdmin, activeTab]);

  // Workshop Profile form state
  const [displayName, setDisplayName] = useState('');
  const [workshopName, setWorkshopName] = useState('');
  const [phone, setPhone] = useState('');
  const [kraPin, setKraPin] = useState('');
  const [address, setAddress] = useState('');
  const [preferredCountyId, setPreferredCountyId] = useState('nairobi');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    setDisplayName(accountProfile?.displayName || user.displayName || '');
    setWorkshopName(accountProfile?.workshopName || '');
    setPhone(privateInfo?.phone || '');
    setKraPin(privateInfo?.kraPin || '');
    setAddress(privateInfo?.address || '');
    setPreferredCountyId(privateInfo?.preferredCountyId || 'nairobi');
  }, [user, accountProfile, privateInfo]);

  // Orders & Dispatch Console state
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<
    'all' | 'confirmed' | 'dispatched' | 'completed'
  >('all');
  const [orderPaymentFilter, setOrderPaymentFilter] = useState<string>('all');
  const [updatingOrderKey, setUpdatingOrderKey] = useState<string | null>(null);
  const [expandedOrderKey, setExpandedOrderKey] = useState<string | null>(null);
  const [buyerDetailsMap, setBuyerDetailsMap] = useState<
    Record<string, { account: UserAccountData | null; privateInfo: UserPrivateData | null }>
  >({});
  const [loadingBuyerUid, setLoadingBuyerUid] = useState<string | null>(null);
  const [dispatchNotice, setDispatchNotice] = useState<string | null>(null);
  const [adminActionError, setAdminActionError] = useState<string | null>(null);

  // Inventory & Catalog Console state
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryViewFilter, setInventoryViewFilter] = useState<
    'active' | 'low-stock' | 'out-of-stock' | 'overrides' | 'custom' | 'archived'
  >('active');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editPriceKes, setEditPriceKes] = useState('');
  const [editStockCount, setEditStockCount] = useState('');
  const [editInStock, setEditInStock] = useState(true);
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);
  const [isSavingInventory, setIsSavingInventory] = useState(false);
  const [inventoryNotice, setInventoryNotice] = useState<string | null>(null);
  const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false);
  const [editingCustomProduct, setEditingCustomProduct] = useState<Product | null>(null);

  // Staff Registry state
  const [newAdminUid, setNewAdminUid] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [staffStatusMsg, setStaffStatusMsg] = useState<string | null>(null);

  // Escape handler
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isEquipmentModalOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isEquipmentModalOpen, onClose]);

  const allCatalogWithArchived = useMemo(
    () => applyOverridesToProducts(PRODUCTS, { includeArchived: true }),
    [applyOverridesToProducts]
  );

  const activeCatalogProducts = useMemo(
    () => allCatalogWithArchived.filter((p) => !archivedProductIds.has(p.id)),
    [allCatalogWithArchived, archivedProductIds]
  );

  const filteredOrders = useMemo(() => {
    const q = orderSearch.trim().toLowerCase();
    return allOrders.filter((ord) => {
      if (orderStatusFilter !== 'all' && ord.status !== orderStatusFilter) return false;
      if (orderPaymentFilter !== 'all') {
        if (orderPaymentFilter === 'lipa-pole-pole' && ord.settlementMode !== 'lipa-pole-pole') {
          return false;
        }
        if (
          orderPaymentFilter !== 'lipa-pole-pole' &&
          ord.paymentMethod !== orderPaymentFilter
        ) {
          return false;
        }
      }
      if (!q) return true;
      return (
        ord.orderId.toLowerCase().includes(q) ||
        (ord.companyName || '').toLowerCase().includes(q) ||
        ord.countyId.toLowerCase().includes(q) ||
        ord.itemsSummary.toLowerCase().includes(q) ||
        (ord.etimsControlNumber || '').toLowerCase().includes(q)
      );
    });
  }, [allOrders, orderSearch, orderStatusFilter, orderPaymentFilter]);

  const filteredInventory = useMemo(() => {
    const q = inventorySearch.trim().toLowerCase();
    return allCatalogWithArchived.filter((item) => {
      const isArchived = archivedProductIds.has(item.id);
      if (inventoryViewFilter === 'archived') {
        if (!isArchived) return false;
      } else {
        if (isArchived) return false;
        if (inventoryViewFilter === 'low-stock' && (!item.inStock || item.stockCount > 3)) {
          return false;
        }
        if (inventoryViewFilter === 'out-of-stock' && item.inStock && item.stockCount > 0) {
          return false;
        }
        if (inventoryViewFilter === 'overrides' && !overridesMap[item.id]) {
          return false;
        }
        if (inventoryViewFilter === 'custom' && !customProductIds.has(item.id)) {
          return false;
        }
      }
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        item.categoryLabel.toLowerCase().includes(q)
      );
    });
  }, [
    allCatalogWithArchived,
    archivedProductIds,
    customProductIds,
    inventorySearch,
    inventoryViewFilter,
    overridesMap,
  ]);

  // Analytics derived strictly from real Firestore & catalog state
  const adminMetrics = useMemo(() => {
    const grossRevenue = allOrders.reduce((s, o) => s + (o.totalAmountKes || 0), 0);
    const avgOrderValue = allOrders.length > 0 ? Math.round(grossRevenue / allOrders.length) : 0;
    const confirmedCount = allOrders.filter((o) => o.status === 'confirmed').length;
    const dispatchedCount = allOrders.filter((o) => o.status === 'dispatched').length;
    const completedCount = allOrders.filter((o) => o.status === 'completed').length;
    const lipaCount = allOrders.filter((o) => o.settlementMode === 'lipa-pole-pole').length;

    const totalYardUnits = activeCatalogProducts.reduce((s, p) => s + p.stockCount, 0);
    const totalYardValuation = activeCatalogProducts.reduce(
      (s, p) => s + p.price * p.stockCount,
      0
    );
    const lowStockItems = activeCatalogProducts.filter((p) => p.inStock && p.stockCount <= 3);
    const outOfStockItems = activeCatalogProducts.filter((p) => !p.inStock || p.stockCount === 0);

    const divisionBreakdown = CATEGORIES_CONFIG.filter((c) => c.id !== 'all').map((cat) => {
      const items = activeCatalogProducts.filter((p) => p.category === cat.id);
      const units = items.reduce((s, p) => s + p.stockCount, 0);
      const valuation = items.reduce((s, p) => s + p.price * p.stockCount, 0);
      return {
        id: cat.id,
        label: cat.shortLabel,
        skuCount: items.length,
        units,
        valuation,
      };
    });

    const paymentBreakdown = [
      { key: 'mpesa', label: 'M-Pesa STK / Paybill' },
      { key: 'bank-wire', label: 'Bank RTGS / EFT' },
      { key: 'lpo-credit', label: 'Corporate LPO' },
      { key: 'depot-pay', label: 'Nairobi Depot Settlement' },
    ].map((pm) => {
      const matched = allOrders.filter((o) => o.paymentMethod === pm.key);
      return {
        ...pm,
        count: matched.length,
        amount: matched.reduce((s, o) => s + (o.totalAmountKes || 0), 0),
      };
    });

    return {
      grossRevenue,
      avgOrderValue,
      confirmedCount,
      dispatchedCount,
      completedCount,
      lipaCount,
      totalYardUnits,
      totalYardValuation,
      lowStockItems,
      outOfStockItems,
      divisionBreakdown,
      paymentBreakdown,
    };
  }, [allOrders, activeCatalogProducts]);

  // Customer directory aggregated from real orders
  const customerDirectory = useMemo(() => {
    const map = new Map<
      string,
      {
        userId: string;
        companyName: string;
        orderCount: number;
        totalSpendKes: number;
        lastCounty: string;
        usesLipa: boolean;
        usesLpo: boolean;
      }
    >();
    for (const ord of allOrders) {
      const existing = map.get(ord.userId);
      if (!existing) {
        map.set(ord.userId, {
          userId: ord.userId,
          companyName: ord.companyName || 'Verified Workshop Client',
          orderCount: 1,
          totalSpendKes: ord.totalAmountKes || 0,
          lastCounty: ord.countyId,
          usesLipa: ord.settlementMode === 'lipa-pole-pole',
          usesLpo: ord.paymentMethod === 'lpo-credit',
        });
      } else {
        existing.orderCount += 1;
        existing.totalSpendKes += ord.totalAmountKes || 0;
        if (ord.companyName && existing.companyName === 'Verified Workshop Client') {
          existing.companyName = ord.companyName;
        }
        if (ord.settlementMode === 'lipa-pole-pole') existing.usesLipa = true;
        if (ord.paymentMethod === 'lpo-credit') existing.usesLpo = true;
      }
    }
    return Array.from(map.values()).sort((a, b) => b.totalSpendKes - a.totalSpendKes);
  }, [allOrders]);

  if (!user) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileSaved(false);
    try {
      await updateWorkshopDetails({
        displayName,
        workshopName,
        phone,
        kraPin,
        address,
        preferredCountyId,
      });
      setProfileSaved(true);
      window.setTimeout(() => setProfileSaved(false), 2600);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleAdvanceStatus = async (
    order: UserOrderRecord,
    nextStatus: 'confirmed' | 'dispatched' | 'completed'
  ) => {
    setAdminActionError(null);
    setDispatchNotice(null);
    setUpdatingOrderKey(`${order.userId}:${order.orderId}`);
    try {
      const result = await adminUpdateOrderStatus(order.userId, order.orderId, nextStatus, {
        etimsControlNumber: order.etimsControlNumber,
        countyName: order.countyId,
        totalAmountKes: order.totalAmountKes,
        itemsSummary: order.itemsSummary,
      });
      if (result.emailSent) {
        setDispatchNotice(`Order ${order.orderId} marked ${nextStatus} · Customer email sent.`);
      } else if (result.emailReason) {
        setDispatchNotice(
          `Order ${order.orderId} marked ${nextStatus} · Email note: ${result.emailReason}`
        );
      } else {
        setDispatchNotice(`Order ${order.orderId} marked ${nextStatus}.`);
      }
    } catch {
      setAdminActionError(`Failed to update status for order ${order.orderId}.`);
    } finally {
      setUpdatingOrderKey(null);
    }
  };

  const handleToggleBuyerContact = async (orderKey: string, targetUserId: string) => {
    setAdminActionError(null);
    if (expandedOrderKey === orderKey) {
      setExpandedOrderKey(null);
      return;
    }
    setExpandedOrderKey(orderKey);
    if (buyerDetailsMap[targetUserId]) return;

    setLoadingBuyerUid(targetUserId);
    try {
      const details = await loadBuyerDetailsForAdmin(targetUserId);
      setBuyerDetailsMap((prev) => ({ ...prev, [targetUserId]: details }));
    } catch {
      setAdminActionError('Unable to load customer dispatch details.');
    } finally {
      setLoadingBuyerUid(null);
    }
  };

  const handleLoadCustomerRecord = async (targetUserId: string) => {
    if (buyerDetailsMap[targetUserId]) return;
    setLoadingBuyerUid(targetUserId);
    try {
      const details = await loadBuyerDetailsForAdmin(targetUserId);
      setBuyerDetailsMap((prev) => ({ ...prev, [targetUserId]: details }));
    } catch {
      setAdminActionError('Unable to load customer contact details.');
    } finally {
      setLoadingBuyerUid(null);
    }
  };

  const handleStartEditInventory = (item: Product) => {
    setInventoryNotice(null);
    setAdminActionError(null);
    setConfirmRemoveId(null);
    setEditingProductId(item.id);
    setEditPriceKes(String(item.price));
    setEditStockCount(String(item.stockCount));
    setEditInStock(item.inStock);
  };

  const handleQuickStockStep = async (item: Product, delta: number) => {
    setIsSavingInventory(true);
    setInventoryNotice(null);
    setAdminActionError(null);
    try {
      const nextStock = Math.max(0, Math.min(10_000, item.stockCount + delta));
      const res = await saveCatalogOverride({
        productId: item.id,
        priceKes: item.price,
        stockCount: nextStock,
        inStock: nextStock > 0,
      });
      if (res.ok) {
        setInventoryNotice(`Updated ${item.sku} yard stock to ${nextStock} units.`);
      } else {
        setAdminActionError(res.error || 'Failed to adjust stock.');
      }
    } finally {
      setIsSavingInventory(false);
    }
  };

  const handleSaveInventoryEdit = async (productId: string) => {
    setIsSavingInventory(true);
    setInventoryNotice(null);
    setAdminActionError(null);
    try {
      const res = await saveCatalogOverride({
        productId,
        priceKes: Number(editPriceKes),
        stockCount: Number(editStockCount),
        inStock: editInStock,
      });
      if (res.ok) {
        setInventoryNotice(`Live price & stock saved for ${productId}.`);
        setEditingProductId(null);
      } else {
        setAdminActionError(res.error || 'Failed to update inventory.');
      }
    } finally {
      setIsSavingInventory(false);
    }
  };

  const handleRemoveOrArchiveItem = async (item: Product) => {
    setIsSavingInventory(true);
    setInventoryNotice(null);
    setAdminActionError(null);
    try {
      const isCustom = customProductIds.has(item.id);
      if (isCustom) {
        const res = await deleteCatalogProduct(item.id);
        if (res.ok) {
          setInventoryNotice(`Removed custom equipment ${item.sku} permanently from catalog.`);
          setConfirmRemoveId(null);
        } else {
          setAdminActionError(res.error || 'Failed to delete equipment.');
        }
      } else {
        const res = await setProductArchived(item, true);
        if (res.ok) {
          setInventoryNotice(
            `Removed ${item.sku} (${item.name}) from the public storefront. You can restore it anytime under Archived.`
          );
          setConfirmRemoveId(null);
        } else {
          setAdminActionError(res.error || 'Failed to archive equipment.');
        }
      }
    } finally {
      setIsSavingInventory(false);
    }
  };

  const handleRestoreArchived = async (item: Product) => {
    setIsSavingInventory(true);
    setInventoryNotice(null);
    setAdminActionError(null);
    try {
      const res = await setProductArchived(item, false);
      if (res.ok) {
        setInventoryNotice(`Restored ${item.sku} (${item.name}) to the live storefront.`);
      } else {
        setAdminActionError(res.error || 'Failed to restore equipment.');
      }
    } finally {
      setIsSavingInventory(false);
    }
  };

  const handleResetOverride = async (productId: string) => {
    setIsSavingInventory(true);
    setInventoryNotice(null);
    setAdminActionError(null);
    try {
      const res = await clearCatalogOverride(productId);
      if (res.ok) {
        setInventoryNotice(`Reverted ${productId} to default catalog price and stock.`);
        setEditingProductId(null);
      } else {
        setAdminActionError(res.error || 'Failed to revert override.');
      }
    } finally {
      setIsSavingInventory(false);
    }
  };

  const handleSaveEquipmentModal = async (
    input: CreateCatalogProductInput,
    existingId?: string
  ) => {
    if (existingId) {
      const res = await updateCatalogProduct(existingId, input);
      if (res.ok) {
        setInventoryNotice(`Updated catalog machine ${input.sku} (${input.name}).`);
      }
      return res;
    }
    const res = await createCatalogProduct(input);
    if (res.ok) {
      setInventoryNotice(`Published ${input.sku} (${input.name}) to the live storefront catalog.`);
      setInventoryViewFilter('active');
    }
    return res;
  };

  const handleGrantAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminActionError(null);
    setStaffStatusMsg(null);
    const res = await grantAdminAccess(newAdminUid, newAdminEmail);
    if (res.ok) {
      setStaffStatusMsg(`Staff admin privileges granted to ${newAdminEmail.trim()}.`);
      setNewAdminUid('');
      setNewAdminEmail('');
    } else {
      setAdminActionError(res.error || 'Unable to grant admin privileges.');
    }
  };

  const handleExportOrdersCsv = () => {
    const dateStamp = new Date().toISOString().slice(0, 10);
    downloadCsvFile(
      `haosail-orders-${dateStamp}.csv`,
      [
        'Order ID',
        'Status',
        'Company / Workshop',
        'County',
        'Delivery Mode',
        'Settlement',
        'Payment Method',
        'Units',
        'Total KES',
        'eTIMS Control #',
        'Voucher',
        'Items Summary',
      ],
      filteredOrders.map((o) => [
        o.orderId,
        o.status,
        o.companyName || '',
        o.countyId,
        o.deliveryMode,
        o.settlementMode,
        o.paymentMethod || '',
        o.itemCount,
        o.totalAmountKes,
        o.etimsControlNumber || '',
        o.voucherCode || '',
        o.itemsSummary,
      ])
    );
  };

  const handleExportInventoryCsv = () => {
    const dateStamp = new Date().toISOString().slice(0, 10);
    downloadCsvFile(
      `haosail-inventory-${dateStamp}.csv`,
      [
        'SKU',
        'Machine Name',
        'Category',
        'Price KES',
        'Yard Stock',
        'Status',
        'Source',
        'Free Freight',
        'Weight lbs',
      ],
      allCatalogWithArchived.map((item) => [
        item.sku,
        item.name,
        item.categoryLabel,
        item.price,
        item.stockCount,
        archivedProductIds.has(item.id)
          ? 'Archived'
          : item.inStock
            ? 'In Stock'
            : 'Out of Stock',
        customProductIds.has(item.id) ? 'Custom Added' : 'Factory Catalog',
        item.isFreeFreight ? 'Yes' : 'No',
        item.specs.weightLbs,
      ])
    );
  };

  const navButtonClass = (tab: PortalTab) =>
    `w-full flex items-center justify-between gap-2 rounded-md px-3 py-2 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
      activeTab === tab
        ? 'bg-[#004B97] text-white font-semibold'
        : 'text-[#5A606B] dark:text-slate-300 hover:bg-[#ECECE8] dark:hover:bg-[#1C2029] hover:text-[#111315] dark:hover:text-white'
    }`;

  const switchTab = (tab: PortalTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-[#F6F6F4] dark:bg-[#0D0F12] text-[#111315] dark:text-[#F3F4F6] overflow-hidden print:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="HaoSail User and Admin Portal"
    >
      {/* Top Workspace Bar */}
      <header className="flex h-14 items-center justify-between gap-4 border-b border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E] px-4 sm:px-6 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Toggle workspace navigation"
            className="lg:hidden rounded-md border border-[#E2E4E8] dark:border-[#262A33] p-1.5 text-[#5A606B] dark:text-slate-300 hover:text-[#111315] dark:hover:text-white cursor-pointer"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="hidden sm:flex items-center cursor-pointer shrink-0"
            aria-label="Return to catalog"
          >
            <HaoSailLogo className="h-8" variant="full" inverted={isDarkMode} />
          </button>

          <span className="hidden sm:inline text-[#E2E4E8] dark:text-[#262A33]">/</span>

          <div className="flex items-center gap-2 text-xs font-mono truncate">
            <span className="text-[#5A606B] dark:text-slate-400 truncate">
              {activeTab.startsWith('admin-') ? 'Admin Console' : 'Workshop Portal'}
            </span>
            <span aria-hidden="true" className="text-[#5A606B] dark:text-slate-500">
              /
            </span>
            <span className="font-semibold text-[#111315] dark:text-white truncate">
              {TAB_LABELS[activeTab]}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="btn-press btn-nudge-left inline-flex items-center gap-1.5 rounded-md border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#1C2029] hover:border-[#004B97] dark:hover:border-sky-400 px-3 py-1.5 text-xs font-medium text-[#111315] dark:text-white cursor-pointer whitespace-nowrap"
          >
            <ArrowLeft className="h-3.5 w-3.5 btn-arrow" />
            <span>Back to Storefront</span>
          </button>

          <button
            type="button"
            onClick={async () => {
              await signOutUser();
              onClose();
            }}
            className="btn-press inline-flex items-center gap-1.5 rounded-md border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#1C2029] hover:border-rose-500 hover:text-rose-600 dark:hover:text-rose-400 px-3 py-1.5 text-xs font-medium text-[#5A606B] dark:text-slate-300 cursor-pointer whitespace-nowrap"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Split Workspace: Left Sidebar + Scrollable Viewport */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* Desktop Sidebar & Mobile Slide Drawer */}
        <aside
          className={`${
            mobileMenuOpen ? 'fixed inset-y-14 left-0 z-40 flex w-64 shadow-xl' : 'hidden'
          } lg:static lg:flex lg:w-64 flex-col justify-between border-r border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E] p-4 overflow-y-auto shrink-0`}
        >
          <div className="space-y-6">
            {/* Identity Summary */}
            <div className="flex items-center gap-3 pb-4 border-b border-[#E2E4E8] dark:border-[#262A33]">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={accountProfile?.displayName || user.displayName || 'Account avatar'}
                  referrerPolicy="no-referrer"
                  className="h-9 w-9 rounded-full border border-[#E2E4E8] dark:border-[#262A33] object-cover shrink-0"
                />
              ) : (
                <div className="h-9 w-9 rounded-full bg-[#004B97] text-white flex items-center justify-center font-mono text-xs font-bold shrink-0">
                  {(accountProfile?.displayName || user.displayName || user.email || 'H')[0].toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#111315] dark:text-white truncate">
                  {accountProfile?.displayName || user.displayName || 'Workshop Client'}
                </p>
                <p className="font-mono text-[10px] text-[#5A606B] dark:text-slate-400 truncate">
                  {user.email}
                </p>
                <p className="mt-0.5 font-mono text-[10px] font-semibold text-[#004B97] dark:text-sky-400">
                  {isBootstrappedAdmin
                    ? 'Root Administrator'
                    : isAdmin
                      ? 'Staff Dispatch Admin'
                      : 'Verified Buyer'}
                </p>
              </div>
            </div>

            {/* Workshop Buyer Section */}
            <div className="space-y-1">
              <div className="px-3 pb-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#5A606B] dark:text-slate-500">
                Workshop Account
              </div>
              <button
                type="button"
                onClick={() => switchTab('profile')}
                className={navButtonClass('profile')}
              >
                <span className="inline-flex items-center gap-2">
                  <Building2 className="h-3.5 w-3.5 shrink-0" />
                  <span>Workshop Profile</span>
                </span>
              </button>
              <button
                type="button"
                onClick={() => switchTab('orders')}
                className={navButtonClass('orders')}
              >
                <span className="inline-flex items-center gap-2">
                  <PackageCheck className="h-3.5 w-3.5 shrink-0" />
                  <span>My Orders</span>
                </span>
                <span className="font-mono text-[11px] tabular-nums opacity-80">
                  {userOrders.length}
                </span>
              </button>
            </div>

            {/* Admin Console Section */}
            {isAdmin && (
              <div className="space-y-1">
                <div className="px-3 pb-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  Admin Operations
                </div>
                <button
                  type="button"
                  onClick={() => switchTab('admin-overview')}
                  className={navButtonClass('admin-overview')}
                >
                  <span className="inline-flex items-center gap-2">
                    <LayoutDashboard className="h-3.5 w-3.5 shrink-0" />
                    <span>Overview</span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => switchTab('admin-orders')}
                  className={navButtonClass('admin-orders')}
                >
                  <span className="inline-flex items-center gap-2">
                    <ClipboardList className="h-3.5 w-3.5 shrink-0" />
                    <span>Orders &amp; Dispatch</span>
                  </span>
                  <span className="font-mono text-[11px] tabular-nums opacity-80">
                    {allOrders.length}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => switchTab('admin-inventory')}
                  className={navButtonClass('admin-inventory')}
                >
                  <span className="inline-flex items-center gap-2">
                    <Boxes className="h-3.5 w-3.5 shrink-0" />
                    <span>Inventory &amp; Catalog</span>
                  </span>
                  <span className="font-mono text-[11px] tabular-nums opacity-80">
                    {activeCatalogProducts.length}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => switchTab('admin-customers')}
                  className={navButtonClass('admin-customers')}
                >
                  <span className="inline-flex items-center gap-2">
                    <Users className="h-3.5 w-3.5 shrink-0" />
                    <span>Customers &amp; B2B</span>
                  </span>
                  <span className="font-mono text-[11px] tabular-nums opacity-80">
                    {customerDirectory.length}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => switchTab('admin-staff')}
                  className={navButtonClass('admin-staff')}
                >
                  <span className="inline-flex items-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                    <span>Staff &amp; Access</span>
                  </span>
                </button>
              </div>
            )}
          </div>

          <div className="border-t border-[#E2E4E8] dark:border-[#262A33] pt-3 text-[11px] font-mono text-[#5A606B] dark:text-slate-400">
            <div>Nairobi Industrial Yard</div>
            <div className="text-[10px] opacity-80">UID: {user.uid.slice(0, 12)}…</div>
          </div>
        </aside>

        {/* Mobile Quick Horizontal Tab Bar */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex lg:hidden items-center gap-1.5 overflow-x-auto border-b border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E] px-4 py-2 shrink-0">
            <button
              type="button"
              onClick={() => switchTab('profile')}
              className={`rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-[#004B97] text-white'
                  : 'text-[#5A606B] dark:text-slate-300'
              }`}
            >
              Profile
            </button>
            <button
              type="button"
              onClick={() => switchTab('orders')}
              className={`rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-[#004B97] text-white'
                  : 'text-[#5A606B] dark:text-slate-300'
              }`}
            >
              Orders ({userOrders.length})
            </button>
            {isAdmin && (
              <>
                <button
                  type="button"
                  onClick={() => switchTab('admin-overview')}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap cursor-pointer ${
                    activeTab === 'admin-overview'
                      ? 'bg-[#004B97] text-white'
                      : 'text-[#5A606B] dark:text-slate-300'
                  }`}
                >
                  Overview
                </button>
                <button
                  type="button"
                  onClick={() => switchTab('admin-orders')}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap cursor-pointer ${
                    activeTab === 'admin-orders'
                      ? 'bg-[#004B97] text-white'
                      : 'text-[#5A606B] dark:text-slate-300'
                  }`}
                >
                  Dispatch ({allOrders.length})
                </button>
                <button
                  type="button"
                  onClick={() => switchTab('admin-inventory')}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap cursor-pointer ${
                    activeTab === 'admin-inventory'
                      ? 'bg-[#004B97] text-white'
                      : 'text-[#5A606B] dark:text-slate-300'
                  }`}
                >
                  Inventory ({activeCatalogProducts.length})
                </button>
                <button
                  type="button"
                  onClick={() => switchTab('admin-customers')}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap cursor-pointer ${
                    activeTab === 'admin-customers'
                      ? 'bg-[#004B97] text-white'
                      : 'text-[#5A606B] dark:text-slate-300'
                  }`}
                >
                  Customers
                </button>
                <button
                  type="button"
                  onClick={() => switchTab('admin-staff')}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap cursor-pointer ${
                    activeTab === 'admin-staff'
                      ? 'bg-[#004B97] text-white'
                      : 'text-[#5A606B] dark:text-slate-300'
                  }`}
                >
                  Staff
                </button>
              </>
            )}
          </div>

          {/* Internally Scrollable Main Workspace Content */}
          <main className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-6xl space-y-6">
              {/* 1. WORKSHOP PROFILE TAB */}
              {activeTab === 'profile' && (
                <section className="rounded-lg border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E] p-6 sm:p-8">
                  <div className="border-b border-[#E2E4E8] dark:border-[#262A33] pb-4 mb-6">
                    <h1 className="font-display text-xl font-bold text-[#111315] dark:text-white">
                      Workshop &amp; Procurement Profile
                    </h1>
                    <p className="mt-1 text-xs text-[#5A606B] dark:text-slate-400">
                      Saved details automatically pre-fill Checkout, KRA eTIMS tax invoices, and Official Quotations.
                    </p>
                  </div>

                  <form onSubmit={handleSaveProfile} className="space-y-5 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-medium text-[#5A606B] dark:text-slate-300 mb-1.5">
                          Contact Person Name *
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={100}
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          className="w-full rounded-sm border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#0D0F12] px-3 py-2.5 text-[#111315] dark:text-white focus:border-[#004B97] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-medium text-[#5A606B] dark:text-slate-300 mb-1.5">
                          Company / Workshop Name
                        </label>
                        <input
                          type="text"
                          maxLength={120}
                          value={workshopName}
                          onChange={(e) => setWorkshopName(e.target.value)}
                          placeholder="e.g. Rift Valley Joinery Ltd"
                          className="w-full rounded-sm border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#0D0F12] px-3 py-2.5 text-[#111315] dark:text-white focus:border-[#004B97] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-medium text-[#5A606B] dark:text-slate-300 mb-1.5">
                          Safaricom / Contact Phone
                        </label>
                        <input
                          type="tel"
                          maxLength={30}
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="07XX XXX XXX"
                          className="w-full rounded-sm border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#0D0F12] px-3 py-2.5 font-mono text-[#111315] dark:text-white focus:border-[#004B97] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-medium text-[#5A606B] dark:text-slate-300 mb-1.5">
                          KRA PIN (For Tax Invoice)
                        </label>
                        <input
                          type="text"
                          maxLength={20}
                          value={kraPin}
                          onChange={(e) => setKraPin(e.target.value)}
                          placeholder="P05XXXXXXXX"
                          className="w-full rounded-sm border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#0D0F12] px-3 py-2.5 font-mono text-[#111315] dark:text-white focus:border-[#004B97] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-medium text-[#5A606B] dark:text-slate-300 mb-1.5">
                          Preferred County Dispatch Hub
                        </label>
                        <select
                          value={preferredCountyId}
                          onChange={(e) => setPreferredCountyId(e.target.value)}
                          className="w-full rounded-sm border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#0D0F12] px-3 py-2.5 text-[#111315] dark:text-white focus:border-[#004B97] focus:outline-none cursor-pointer"
                        >
                          {KENYAN_COUNTY_HUBS.map((hub) => (
                            <option key={hub.id} value={hub.id}>
                              {hub.county} ({hub.mainTown})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-medium text-[#5A606B] dark:text-slate-300 mb-1.5">
                          Street / Industrial Park Landmark
                        </label>
                        <input
                          type="text"
                          maxLength={200}
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Plot / Industrial Area Rd"
                          className="w-full rounded-sm border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#0D0F12] px-3 py-2.5 text-[#111315] dark:text-white focus:border-[#004B97] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[#E2E4E8] dark:border-[#262A33]">
                      <span className="font-mono text-[11px] text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                        {profileSaved && (
                          <>
                            <Check className="h-3.5 w-3.5" />
                            <span>Saved to cloud account &amp; synced to Checkout</span>
                          </>
                        )}
                      </span>
                      <button
                        type="submit"
                        disabled={isSavingProfile}
                        className="btn-press rounded-md bg-[#004B97] hover:bg-[#003B78] px-5 py-2.5 text-xs font-semibold text-white cursor-pointer disabled:opacity-60"
                      >
                        {isSavingProfile ? 'Saving...' : 'Save Workshop Details'}
                      </button>
                    </div>
                  </form>
                </section>
              )}

              {/* 2. MY ORDERS TAB */}
              {activeTab === 'orders' && (
                <section className="rounded-lg border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E] p-6 sm:p-8">
                  <div className="border-b border-[#E2E4E8] dark:border-[#262A33] pb-4 mb-5 flex items-center justify-between">
                    <div>
                      <h1 className="font-display text-xl font-bold text-[#111315] dark:text-white">
                        My Procurement Orders
                      </h1>
                      <p className="mt-1 text-xs text-[#5A606B] dark:text-slate-400">
                        Live dispatch progress and KRA eTIMS records linked to your verified account.
                      </p>
                    </div>
                    <span className="font-mono text-xs text-[#5A606B] dark:text-slate-400 tabular-nums">
                      {userOrders.length} {userOrders.length === 1 ? 'order' : 'orders'}
                    </span>
                  </div>

                  {userOrders.length === 0 ? (
                    <div className="py-12 text-center text-xs text-[#5A606B] dark:text-slate-400">
                      <PackageCheck className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-600 mb-2.5" />
                      <p className="font-semibold text-sm text-[#111315] dark:text-white">
                        No procurement orders recorded yet
                      </p>
                      <p className="mt-1 max-w-md mx-auto">
                        Orders placed at Checkout while signed in appear here automatically with live dispatch updates.
                      </p>
                      <button
                        type="button"
                        onClick={onClose}
                        className="btn-press mt-4 rounded-md bg-[#004B97] hover:bg-[#003B78] px-4 py-2 text-xs font-semibold text-white cursor-pointer"
                      >
                        Browse Machinery Catalog
                      </button>
                    </div>
                  ) : (
                    <div className="divide-y divide-[#E2E4E8] dark:divide-[#262A33] border border-[#E2E4E8] dark:border-[#262A33] rounded-md">
                      {userOrders.map((order) => (
                        <div key={order.orderId} className="p-4 text-xs space-y-2">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2 font-mono">
                              <span className="font-bold text-[#004B97] dark:text-sky-400">
                                {order.orderId}
                              </span>
                              {order.etimsControlNumber && (
                                <>
                                  <span aria-hidden="true">·</span>
                                  <span className="text-[#5A606B] dark:text-slate-400">
                                    eTIMS: {order.etimsControlNumber}
                                  </span>
                                </>
                              )}
                            </div>
                            <span
                              className={`font-mono text-[11px] uppercase font-semibold ${
                                order.status === 'completed'
                                  ? 'text-emerald-700 dark:text-emerald-400'
                                  : order.status === 'dispatched'
                                    ? 'text-amber-700 dark:text-amber-300'
                                    : 'text-[#004B97] dark:text-sky-400'
                              }`}
                            >
                              {order.status}
                            </span>
                          </div>
                          <p className="font-medium text-[#111315] dark:text-white">
                            {order.itemsSummary}
                          </p>
                          <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-[#5A606B] dark:text-slate-400 tabular-nums">
                            <span>
                              {order.itemCount} {order.itemCount === 1 ? 'unit' : 'units'} · {order.countyId} · {order.deliveryMode} · {order.settlementMode}
                            </span>
                            <span className="font-bold text-sm text-[#111315] dark:text-white">
                              {formatKSh(order.totalAmountKes)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              )}

              {/* 3. ADMIN OVERVIEW DASHBOARD */}
              {isAdmin && activeTab === 'admin-overview' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h1 className="font-display text-2xl font-bold text-[#111315] dark:text-white">
                        Operations Overview
                      </h1>
                      <p className="mt-0.5 text-xs text-[#5A606B] dark:text-slate-400">
                        Live dispatch throughput, order revenue, and Nairobi yard stock health.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCustomProduct(null);
                          setIsEquipmentModalOpen(true);
                        }}
                        className="btn-press inline-flex items-center gap-1.5 rounded-md bg-[#004B97] hover:bg-[#003B78] px-3.5 py-2 text-xs font-semibold text-white cursor-pointer whitespace-nowrap"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add Equipment</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => switchTab('admin-orders')}
                        className="btn-press rounded-md border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E] hover:border-[#004B97] px-3.5 py-2 text-xs font-medium text-[#111315] dark:text-white cursor-pointer whitespace-nowrap"
                      >
                        Manage Dispatch ({adminMetrics.confirmedCount} Pending)
                      </button>
                    </div>
                  </div>

                  {/* 4 Real KPI Summary Cells */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    <div className="rounded-lg border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E] p-5">
                      <span className="font-mono text-[11px] uppercase tracking-wider text-[#5A606B] dark:text-slate-400">
                        Gross Order Volume
                      </span>
                      <div className="mt-2 font-mono text-2xl font-bold text-[#111315] dark:text-white tabular-nums">
                        {formatKSh(adminMetrics.grossRevenue)}
                      </div>
                      <div className="mt-1 font-mono text-[11px] text-[#5A606B] dark:text-slate-400 tabular-nums">
                        {allOrders.length} orders · Avg {formatKSh(adminMetrics.avgOrderValue)}
                      </div>
                    </div>

                    <div className="rounded-lg border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E] p-5">
                      <span className="font-mono text-[11px] uppercase tracking-wider text-[#5A606B] dark:text-slate-400">
                        Dispatch Pipeline
                      </span>
                      <div className="mt-2 font-mono text-2xl font-bold text-[#004B97] dark:text-sky-400 tabular-nums">
                        {adminMetrics.confirmedCount} Awaiting Dispatch
                      </div>
                      <div className="mt-1 font-mono text-[11px] text-[#5A606B] dark:text-slate-400 tabular-nums">
                        {adminMetrics.dispatchedCount} in transit · {adminMetrics.completedCount} completed
                      </div>
                    </div>

                    <div className="rounded-lg border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E] p-5">
                      <span className="font-mono text-[11px] uppercase tracking-wider text-[#5A606B] dark:text-slate-400">
                        Active Catalog SKUs
                      </span>
                      <div className="mt-2 font-mono text-2xl font-bold text-[#111315] dark:text-white tabular-nums">
                        {activeCatalogProducts.length} Models
                      </div>
                      <div className="mt-1 font-mono text-[11px] text-amber-700 dark:text-amber-400 tabular-nums">
                        {adminMetrics.lowStockItems.length} low stock · {adminMetrics.outOfStockItems.length} out of stock
                      </div>
                    </div>

                    <div className="rounded-lg border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E] p-5">
                      <span className="font-mono text-[11px] uppercase tracking-wider text-[#5A606B] dark:text-slate-400">
                        Yard Inventory Valuation
                      </span>
                      <div className="mt-2 font-mono text-2xl font-bold text-[#111315] dark:text-white tabular-nums">
                        {formatKSh(adminMetrics.totalYardValuation)}
                      </div>
                      <div className="mt-1 font-mono text-[11px] text-[#5A606B] dark:text-slate-400 tabular-nums">
                        {adminMetrics.totalYardUnits.toLocaleString()} ready units · {archivedProductIds.size} archived
                      </div>
                    </div>
                  </div>

                  {/* Division Valuation & Payment Breakdown */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-7 rounded-lg border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E] p-5">
                      <div className="flex items-center justify-between border-b border-[#E2E4E8] dark:border-[#262A33] pb-3 mb-4">
                        <h2 className="font-display text-sm font-bold text-[#111315] dark:text-white">
                          Yard Stock &amp; Valuation by Division
                        </h2>
                        <span className="font-mono text-[11px] text-[#5A606B] dark:text-slate-400">
                          {activeCatalogProducts.length} active SKUs
                        </span>
                      </div>
                      <div className="space-y-3.5 text-xs">
                        {adminMetrics.divisionBreakdown.map((div) => {
                          const share =
                            adminMetrics.totalYardValuation > 0
                              ? Math.round((div.valuation / adminMetrics.totalYardValuation) * 100)
                              : 0;
                          return (
                            <div key={div.id} className="space-y-1">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-medium text-[#111315] dark:text-white">
                                  {div.label}
                                </span>
                                <span className="font-mono text-[11px] text-[#5A606B] dark:text-slate-400 tabular-nums">
                                  {div.skuCount} SKUs · {div.units} units ·{' '}
                                  <strong className="text-[#111315] dark:text-white">
                                    {formatKSh(div.valuation)}
                                  </strong>
                                </span>
                              </div>
                              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#ECECE8] dark:bg-[#262A33]">
                                <div
                                  className="h-full bg-[#004B97] dark:bg-sky-400"
                                  style={{ width: `${Math.max(4, share)}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="lg:col-span-5 rounded-lg border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E] p-5">
                      <div className="flex items-center justify-between border-b border-[#E2E4E8] dark:border-[#262A33] pb-3 mb-4">
                        <h2 className="font-display text-sm font-bold text-[#111315] dark:text-white">
                          Settlement &amp; Payment Mix
                        </h2>
                        <span className="font-mono text-[11px] text-[#5A606B] dark:text-slate-400 tabular-nums">
                          {adminMetrics.lipaCount} Lipa Pole Pole
                        </span>
                      </div>

                      {allOrders.length === 0 ? (
                        <p className="py-8 text-center text-xs text-[#5A606B] dark:text-slate-400">
                          Payment channel metrics populate automatically as customer orders arrive.
                        </p>
                      ) : (
                        <div className="divide-y divide-[#E2E4E8] dark:divide-[#262A33] text-xs">
                          {adminMetrics.paymentBreakdown.map((pm) => (
                            <div
                              key={pm.key}
                              className="py-2.5 flex items-center justify-between gap-2"
                            >
                              <div>
                                <div className="font-medium text-[#111315] dark:text-white">
                                  {pm.label}
                                </div>
                                <div className="font-mono text-[11px] text-[#5A606B] dark:text-slate-400 tabular-nums">
                                  {pm.count} {pm.count === 1 ? 'order' : 'orders'}
                                </div>
                              </div>
                              <span className="font-mono font-semibold text-[#111315] dark:text-white tabular-nums">
                                {formatKSh(pm.amount)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Low-Stock Watchlist */}
                  <div className="rounded-lg border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E] p-5">
                    <div className="flex items-center justify-between border-b border-[#E2E4E8] dark:border-[#262A33] pb-3 mb-3">
                      <h2 className="font-display text-sm font-bold text-[#111315] dark:text-white">
                        Low-Stock &amp; Replenishment Watchlist (≤ 3 Units)
                      </h2>
                      <button
                        type="button"
                        onClick={() => {
                          setInventoryViewFilter('low-stock');
                          switchTab('admin-inventory');
                        }}
                        className="font-mono text-[11px] font-semibold text-[#004B97] dark:text-sky-400 hover:underline cursor-pointer"
                      >
                        Open Inventory Manager
                      </button>
                    </div>
                    {adminMetrics.lowStockItems.length === 0 &&
                    adminMetrics.outOfStockItems.length === 0 ? (
                      <p className="py-4 text-xs text-[#5A606B] dark:text-slate-400">
                        All active catalog machines hold healthy yard stock (&gt; 3 units).
                      </p>
                    ) : (
                      <div className="divide-y divide-[#E2E4E8] dark:divide-[#262A33] text-xs">
                        {[...adminMetrics.outOfStockItems, ...adminMetrics.lowStockItems]
                          .slice(0, 6)
                          .map((item) => (
                            <div
                              key={item.id}
                              className="py-2.5 flex items-center justify-between gap-3"
                            >
                              <div className="min-w-0">
                                <span className="font-mono text-[11px] font-semibold text-[#004B97] dark:text-sky-400 mr-2">
                                  {item.sku}
                                </span>
                                <span className="font-medium text-[#111315] dark:text-white truncate">
                                  {item.name}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 shrink-0">
                                <span
                                  className={`font-mono text-[11px] font-semibold tabular-nums ${
                                    item.stockCount === 0
                                      ? 'text-rose-600 dark:text-rose-400'
                                      : 'text-amber-700 dark:text-amber-400'
                                  }`}
                                >
                                  {item.stockCount === 0
                                    ? 'Out of stock'
                                    : `${item.stockCount} left`}
                                </span>
                                <button
                                  type="button"
                                  disabled={isSavingInventory}
                                  onClick={() => void handleQuickStockStep(item, 5)}
                                  className="rounded border border-[#E2E4E8] dark:border-[#262A33] bg-[#F6F6F4] dark:bg-[#1C2029] hover:border-[#004B97] px-2.5 py-1 font-mono text-[10px] font-semibold text-[#111315] dark:text-white cursor-pointer"
                                >
                                  +5 Units
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 4. ADMIN ORDERS & DISPATCH CONSOLE */}
              {isAdmin && activeTab === 'admin-orders' && (
                <section className="rounded-lg border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E] p-5 sm:p-6 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#E2E4E8] dark:border-[#262A33] pb-4">
                    <div>
                      <h1 className="font-display text-xl font-bold text-[#111315] dark:text-white">
                        Orders &amp; Dispatch Queue
                      </h1>
                      <p className="mt-0.5 text-xs text-[#5A606B] dark:text-slate-400">
                        Filter orders, verify customer KRA PIN &amp; delivery contacts, and send automated dispatch emails.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleExportOrdersCsv}
                      disabled={filteredOrders.length === 0}
                      className="btn-press inline-flex items-center gap-1.5 rounded-md border border-[#E2E4E8] dark:border-[#262A33] bg-[#F6F6F4] dark:bg-[#1C2029] hover:border-[#004B97] px-3.5 py-2 text-xs font-medium text-[#111315] dark:text-white cursor-pointer disabled:opacity-50 whitespace-nowrap"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Export CSV ({filteredOrders.length})</span>
                    </button>
                  </div>

                  {/* Filter & Search Bar */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-1 rounded-md border border-[#E2E4E8] dark:border-[#262A33] bg-[#F6F6F4] dark:bg-[#111318] p-1 overflow-x-auto">
                      {(['all', 'confirmed', 'dispatched', 'completed'] as const).map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setOrderStatusFilter(st)}
                          className={`rounded px-3 py-1 font-medium capitalize transition-colors cursor-pointer whitespace-nowrap ${
                            orderStatusFilter === st
                              ? 'bg-white dark:bg-[#1C2029] text-[#004B97] dark:text-white shadow-xs font-semibold'
                              : 'text-[#5A606B] dark:text-slate-400 hover:text-[#111315] dark:hover:text-white'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>

                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                      <div className="relative flex-1 sm:w-64">
                        <Search className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#5A606B]" />
                        <input
                          type="search"
                          value={orderSearch}
                          onChange={(e) => setOrderSearch(e.target.value)}
                          placeholder="Search order ID, workshop, county, eTIMS..."
                          className="w-full rounded-sm border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#0D0F12] pl-8 pr-3 py-1.5 text-xs text-[#111315] dark:text-white focus:border-[#004B97] focus:outline-none"
                        />
                      </div>

                      <select
                        value={orderPaymentFilter}
                        onChange={(e) => setOrderPaymentFilter(e.target.value)}
                        className="rounded-sm border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#0D0F12] px-2.5 py-1.5 text-xs text-[#111315] dark:text-white focus:border-[#004B97] focus:outline-none cursor-pointer"
                      >
                        <option value="all">All Payment Channels</option>
                        <option value="mpesa">M-Pesa STK / Paybill</option>
                        <option value="bank-wire">Bank RTGS / EFT</option>
                        <option value="lpo-credit">Corporate LPO</option>
                        <option value="depot-pay">Depot Pay</option>
                        <option value="lipa-pole-pole">Lipa Pole Pole Only</option>
                      </select>
                    </div>
                  </div>

                  {adminActionError && (
                    <div className="flex items-start gap-2 rounded-md border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 p-2.5 text-xs text-rose-800 dark:text-rose-200">
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>{adminActionError}</span>
                    </div>
                  )}
                  {dispatchNotice && (
                    <div className="flex items-start gap-2 rounded-md border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 p-2.5 text-xs text-emerald-800 dark:text-emerald-200">
                      <Check className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>{dispatchNotice}</span>
                    </div>
                  )}

                  {filteredOrders.length === 0 ? (
                    <div className="py-12 text-center text-xs text-[#5A606B] dark:text-slate-400">
                      <PackageCheck className="mx-auto h-7 w-7 text-slate-300 dark:text-slate-600 mb-2" />
                      <p className="font-semibold text-[#111315] dark:text-white">
                        No matching orders found
                      </p>
                      <p className="mt-1">
                        Adjust status or search filters, or wait for new verified checkouts.
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-[#E2E4E8] dark:divide-[#262A33] border border-[#E2E4E8] dark:border-[#262A33] rounded-md">
                      {filteredOrders.map((order) => {
                        const key = `${order.userId}:${order.orderId}`;
                        const isBusy = updatingOrderKey === key;
                        const isExpanded = expandedOrderKey === key;
                        const buyerRecord = buyerDetailsMap[order.userId];
                        return (
                          <div key={key} className="p-4 text-xs space-y-2.5">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-mono font-bold text-[#004B97] dark:text-sky-400">
                                  {order.orderId}
                                </span>
                                {order.companyName && (
                                  <span className="text-[#5A606B] dark:text-slate-300">
                                    · {order.companyName}
                                  </span>
                                )}
                                {order.etimsControlNumber && (
                                  <span className="font-mono text-[11px] text-[#5A606B] dark:text-slate-400">
                                    · {order.etimsControlNumber}
                                  </span>
                                )}
                              </div>
                              <span
                                className={`font-mono text-[11px] uppercase font-semibold ${
                                  order.status === 'completed'
                                    ? 'text-emerald-700 dark:text-emerald-400'
                                    : order.status === 'dispatched'
                                      ? 'text-amber-700 dark:text-amber-300'
                                      : 'text-[#004B97] dark:text-sky-400'
                                }`}
                              >
                                {order.status}
                              </span>
                            </div>

                            <p className="font-medium text-[#111315] dark:text-white">
                              {order.itemsSummary}
                            </p>

                            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                              <span className="font-mono text-[11px] text-[#5A606B] dark:text-slate-400 tabular-nums">
                                {order.itemCount} {order.itemCount === 1 ? 'unit' : 'units'} · {order.countyId} · {order.deliveryMode} · {order.settlementMode}
                                {order.paymentMethod ? ` · ${order.paymentMethod}` : ''} ·{' '}
                                <strong className="text-[#111315] dark:text-white">
                                  {formatKSh(order.totalAmountKes)}
                                </strong>
                              </span>

                              <div className="flex flex-wrap items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleToggleBuyerContact(key, order.userId)}
                                  className="rounded border border-[#E2E4E8] dark:border-[#262A33] bg-[#F6F6F4] dark:bg-[#1C2029] px-2.5 py-1 font-mono text-[10px] font-semibold text-[#111315] dark:text-slate-200 hover:border-[#004B97] cursor-pointer"
                                >
                                  {isExpanded ? 'Hide Buyer' : 'Buyer Contact'}
                                </button>
                                {order.status === 'confirmed' && (
                                  <button
                                    type="button"
                                    disabled={isBusy}
                                    onClick={() => handleAdvanceStatus(order, 'dispatched')}
                                    className="rounded border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 font-mono text-[10px] font-semibold text-amber-800 dark:text-amber-300 hover:bg-amber-100 cursor-pointer disabled:opacity-50"
                                  >
                                    Mark Dispatched
                                  </button>
                                )}
                                {order.status !== 'completed' && (
                                  <button
                                    type="button"
                                    disabled={isBusy}
                                    onClick={() => handleAdvanceStatus(order, 'completed')}
                                    className="rounded border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 font-mono text-[10px] font-semibold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 cursor-pointer disabled:opacity-50"
                                  >
                                    Mark Completed
                                  </button>
                                )}
                              </div>
                            </div>

                            {isExpanded && (
                              <div className="rounded border border-[#E2E4E8] dark:border-[#262A33] bg-[#F6F6F4] dark:bg-[#111318] p-3 text-[11px] space-y-1">
                                {loadingBuyerUid === order.userId && !buyerRecord ? (
                                  <span className="font-mono text-[#5A606B] dark:text-slate-400">
                                    Loading buyer dispatch profile...
                                  </span>
                                ) : (
                                  <>
                                    <div className="font-semibold text-[#111315] dark:text-white">
                                      {buyerRecord?.account?.displayName || 'Verified Buyer'}
                                      {buyerRecord?.account?.workshopName
                                        ? ` (${buyerRecord.account.workshopName})`
                                        : ''}
                                    </div>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[#5A606B] dark:text-slate-300">
                                      <span>{buyerRecord?.privateInfo?.email || 'No email'}</span>
                                      {buyerRecord?.privateInfo?.phone && (
                                        <span className="inline-flex items-center gap-1">
                                          <Phone className="h-3 w-3" />
                                          {buyerRecord.privateInfo.phone}
                                        </span>
                                      )}
                                      {buyerRecord?.privateInfo?.kraPin && (
                                        <span>KRA: {buyerRecord.privateInfo.kraPin}</span>
                                      )}
                                    </div>
                                    {buyerRecord?.privateInfo?.address && (
                                      <div className="inline-flex items-center gap-1 text-[#5A606B] dark:text-slate-400">
                                        <MapPin className="h-3 w-3 shrink-0" />
                                        <span>{buyerRecord.privateInfo.address}</span>
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>
              )}

              {/* 5. ADMIN INVENTORY & CATALOG CRUD */}
              {isAdmin && activeTab === 'admin-inventory' && (
                <section className="rounded-lg border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E] p-5 sm:p-6 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#E2E4E8] dark:border-[#262A33] pb-4">
                    <div>
                      <h1 className="font-display text-xl font-bold text-[#111315] dark:text-white">
                        Inventory &amp; Catalog Management
                      </h1>
                      <p className="mt-0.5 text-xs text-[#5A606B] dark:text-slate-400">
                        Add new machinery, edit prices &amp; stock levels in real time, or remove/archive discontinued units.
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={handleExportInventoryCsv}
                        className="btn-press inline-flex items-center gap-1.5 rounded-md border border-[#E2E4E8] dark:border-[#262A33] bg-[#F6F6F4] dark:bg-[#1C2029] hover:border-[#004B97] px-3 py-2 text-xs font-medium text-[#111315] dark:text-white cursor-pointer whitespace-nowrap"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Export CSV</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCustomProduct(null);
                          setIsEquipmentModalOpen(true);
                        }}
                        className="btn-press inline-flex items-center gap-1.5 rounded-md bg-[#004B97] hover:bg-[#003B78] px-3.5 py-2 text-xs font-semibold text-white cursor-pointer whitespace-nowrap"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add New Equipment</span>
                      </button>
                    </div>
                  </div>

                  {/* Inventory Segment Tabs & Search */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-1 rounded-md border border-[#E2E4E8] dark:border-[#262A33] bg-[#F6F6F4] dark:bg-[#111318] p-1 overflow-x-auto">
                      {[
                        { id: 'active', label: `Active (${activeCatalogProducts.length})` },
                        { id: 'low-stock', label: `Low Stock (${adminMetrics.lowStockItems.length})` },
                        { id: 'out-of-stock', label: `Out of Stock (${adminMetrics.outOfStockItems.length})` },
                        { id: 'custom', label: `Custom Added (${customProductIds.size})` },
                        { id: 'overrides', label: `Overrides (${Object.keys(overridesMap).length})` },
                        { id: 'archived', label: `Archived (${archivedProductIds.size})` },
                      ].map((seg) => (
                        <button
                          key={seg.id}
                          type="button"
                          onClick={() =>
                            setInventoryViewFilter(seg.id as typeof inventoryViewFilter)
                          }
                          className={`rounded px-2.5 py-1 font-medium transition-colors cursor-pointer whitespace-nowrap ${
                            inventoryViewFilter === seg.id
                              ? 'bg-white dark:bg-[#1C2029] text-[#004B97] dark:text-white shadow-xs font-semibold'
                              : 'text-[#5A606B] dark:text-slate-400 hover:text-[#111315] dark:hover:text-white'
                          }`}
                        >
                          {seg.label}
                        </button>
                      ))}
                    </div>

                    <div className="relative sm:w-64">
                      <Search className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#5A606B]" />
                      <input
                        type="search"
                        value={inventorySearch}
                        onChange={(e) => setInventorySearch(e.target.value)}
                        placeholder="Filter SKU, model, division..."
                        className="w-full rounded-sm border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#0D0F12] pl-8 pr-3 py-1.5 text-xs text-[#111315] dark:text-white focus:border-[#004B97] focus:outline-none"
                      />
                    </div>
                  </div>

                  {adminActionError && (
                    <div className="flex items-start gap-2 rounded-md border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 p-2.5 text-xs text-rose-800 dark:text-rose-200">
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>{adminActionError}</span>
                    </div>
                  )}

                  {inventoryNotice && (
                    <div className="flex items-start gap-2 rounded-md border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 p-2.5 text-xs text-emerald-800 dark:text-emerald-200">
                      <Check className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>{inventoryNotice}</span>
                    </div>
                  )}

                  {filteredInventory.length === 0 ? (
                    <div className="py-10 text-center text-xs text-[#5A606B] dark:text-slate-400 border border-dashed border-[#E2E4E8] dark:border-[#262A33] rounded-md">
                      No equipment items match this inventory view.
                    </div>
                  ) : (
                    <div className="divide-y divide-[#E2E4E8] dark:divide-[#262A33] border border-[#E2E4E8] dark:border-[#262A33] rounded-md">
                      {filteredInventory.map((item) => {
                        const hasOverride = Boolean(overridesMap[item.id]);
                        const isCustom = customProductIds.has(item.id);
                        const isArchived = archivedProductIds.has(item.id);
                        const isEditing = editingProductId === item.id;
                        const isConfirmingRemove = confirmRemoveId === item.id;

                        return (
                          <div key={item.id} className="p-3.5 text-xs space-y-2.5">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="flex items-center gap-3 min-w-0">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="h-11 w-14 rounded-sm border border-[#E2E4E8] dark:border-[#262A33] object-cover bg-[#ECECE8] dark:bg-[#1C2029] shrink-0"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="min-w-0">
                                  <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px]">
                                    <span className="font-semibold text-[#004B97] dark:text-sky-400">
                                      {item.sku}
                                    </span>
                                    <span className="text-[#5A606B] dark:text-slate-400">
                                      · {item.categoryLabel}
                                    </span>
                                    {isCustom && (
                                      <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                                        · Custom Added
                                      </span>
                                    )}
                                    {hasOverride && !isArchived && (
                                      <span className="font-semibold text-amber-700 dark:text-amber-400">
                                        · Live Override
                                      </span>
                                    )}
                                    {isArchived && (
                                      <span className="font-semibold text-rose-600 dark:text-rose-400">
                                        · Archived (Hidden)
                                      </span>
                                    )}
                                  </div>
                                  <p className="font-semibold text-[#111315] dark:text-white truncate">
                                    {item.name}
                                  </p>
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 shrink-0">
                                {/* Price & Quick Stock Stepper */}
                                <div className="text-right font-mono tabular-nums">
                                  <div className="font-bold text-[#111315] dark:text-white">
                                    {formatKSh(item.price)}
                                  </div>
                                  <div
                                    className={`text-[10px] ${
                                      item.inStock
                                        ? item.stockCount <= 3
                                          ? 'text-amber-700 dark:text-amber-400 font-semibold'
                                          : 'text-emerald-700 dark:text-emerald-400'
                                        : 'text-rose-600 dark:text-rose-400'
                                    }`}
                                  >
                                    {item.inStock
                                      ? `${item.stockCount} ready`
                                      : 'Out of Stock (0)'}
                                  </div>
                                </div>

                                {!isArchived && (
                                  <div className="flex items-center rounded border border-[#E2E4E8] dark:border-[#262A33] bg-[#F6F6F4] dark:bg-[#0D0F12]">
                                    <button
                                      type="button"
                                      disabled={isSavingInventory || item.stockCount <= 0}
                                      onClick={() => void handleQuickStockStep(item, -1)}
                                      aria-label={`Decrease stock for ${item.sku}`}
                                      className="px-2 py-1 text-[#5A606B] hover:text-[#111315] dark:text-slate-300 dark:hover:text-white cursor-pointer disabled:opacity-40"
                                    >
                                      <Minus className="h-3 w-3" />
                                    </button>
                                    <span className="px-2 font-mono text-[11px] font-semibold tabular-nums text-[#111315] dark:text-white">
                                      {item.stockCount}
                                    </span>
                                    <button
                                      type="button"
                                      disabled={isSavingInventory}
                                      onClick={() => void handleQuickStockStep(item, 1)}
                                      aria-label={`Increase stock for ${item.sku}`}
                                      className="px-2 py-1 text-[#5A606B] hover:text-[#111315] dark:text-slate-300 dark:hover:text-white cursor-pointer disabled:opacity-40"
                                    >
                                      <Plus className="h-3 w-3" />
                                    </button>
                                  </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex items-center gap-1.5">
                                  {isCustom && !isArchived && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingCustomProduct(item);
                                        setIsEquipmentModalOpen(true);
                                      }}
                                      title="Edit full equipment details"
                                      className="inline-flex items-center gap-1 rounded border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#1C2029] px-2.5 py-1 font-mono text-[10px] font-semibold text-[#111315] dark:text-slate-200 hover:border-[#004B97] cursor-pointer"
                                    >
                                      <Pencil className="h-3 w-3" />
                                      <span>Details</span>
                                    </button>
                                  )}

                                  {!isArchived && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        isEditing
                                          ? setEditingProductId(null)
                                          : handleStartEditInventory(item)
                                      }
                                      className="rounded border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#1C2029] px-2.5 py-1 font-mono text-[10px] font-semibold text-[#111315] dark:text-slate-200 hover:border-[#004B97] cursor-pointer"
                                    >
                                      {isEditing ? 'Cancel' : 'Edit Price'}
                                    </button>
                                  )}

                                  {isArchived ? (
                                    <button
                                      type="button"
                                      disabled={isSavingInventory}
                                      onClick={() => void handleRestoreArchived(item)}
                                      className="inline-flex items-center gap-1 rounded border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 font-mono text-[10px] font-semibold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 cursor-pointer"
                                    >
                                      <ArchiveRestore className="h-3 w-3" />
                                      <span>Restore</span>
                                    </button>
                                  ) : isConfirmingRemove ? (
                                    <div className="flex items-center gap-1">
                                      <button
                                        type="button"
                                        disabled={isSavingInventory}
                                        onClick={() => void handleRemoveOrArchiveItem(item)}
                                        className="rounded bg-rose-600 hover:bg-rose-700 px-2.5 py-1 font-mono text-[10px] font-semibold text-white cursor-pointer"
                                      >
                                        {isCustom ? 'Confirm Delete' : 'Confirm Remove'}
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setConfirmRemoveId(null)}
                                        className="rounded border border-[#E2E4E8] dark:border-[#262A33] px-2 py-1 font-mono text-[10px] text-[#5A606B] dark:text-slate-300 cursor-pointer"
                                      >
                                        No
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => setConfirmRemoveId(item.id)}
                                      title={
                                        isCustom
                                          ? 'Permanently delete custom listing'
                                          : 'Archive / remove from live storefront'
                                      }
                                      className="inline-flex items-center gap-1 rounded border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#1C2029] px-2.5 py-1 font-mono text-[10px] font-semibold text-rose-600 dark:text-rose-400 hover:border-rose-500 cursor-pointer"
                                    >
                                      {isCustom ? (
                                        <Trash2 className="h-3 w-3" />
                                      ) : (
                                        <Archive className="h-3 w-3" />
                                      )}
                                      <span>Remove</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>

                            {isEditing && (
                              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 pt-2.5 border-t border-[#E2E4E8] dark:border-[#262A33] items-end bg-[#F6F6F4]/60 dark:bg-[#111318]/60 p-2.5 rounded-sm">
                                <div>
                                  <label className="block text-[10px] font-mono text-[#5A606B] dark:text-slate-400 mb-1">
                                    Price (KES)
                                  </label>
                                  <input
                                    type="number"
                                    min={100}
                                    max={50000000}
                                    value={editPriceKes}
                                    onChange={(e) => setEditPriceKes(e.target.value)}
                                    className="w-full rounded-sm border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#0D0F12] px-2.5 py-1.5 font-mono text-xs tabular-nums text-[#111315] dark:text-white"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-mono text-[#5A606B] dark:text-slate-400 mb-1">
                                    Yard Units
                                  </label>
                                  <input
                                    type="number"
                                    min={0}
                                    max={10000}
                                    value={editStockCount}
                                    onChange={(e) => setEditStockCount(e.target.value)}
                                    className="w-full rounded-sm border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#0D0F12] px-2.5 py-1.5 font-mono text-xs tabular-nums text-[#111315] dark:text-white"
                                  />
                                </div>
                                <label className="inline-flex items-center gap-2 py-1.5 cursor-pointer text-[11px] font-medium text-[#111315] dark:text-slate-200">
                                  <input
                                    type="checkbox"
                                    checked={editInStock}
                                    onChange={(e) => setEditInStock(e.target.checked)}
                                    className="rounded border-slate-300 text-[#004B97] cursor-pointer"
                                  />
                                  <span>Available for Order</span>
                                </label>
                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    disabled={isSavingInventory}
                                    onClick={() => void handleSaveInventoryEdit(item.id)}
                                    className="flex-1 rounded-sm bg-[#004B97] hover:bg-[#003B78] px-3 py-1.5 text-[11px] font-semibold text-white cursor-pointer disabled:opacity-50"
                                  >
                                    Save Live
                                  </button>
                                  {hasOverride && (
                                    <button
                                      type="button"
                                      disabled={isSavingInventory}
                                      onClick={() => void handleResetOverride(item.id)}
                                      title="Reset to default catalog price & stock"
                                      aria-label="Reset override"
                                      className="rounded-sm border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#1C2029] p-1.5 text-[#5A606B] hover:text-rose-600 cursor-pointer"
                                    >
                                      <RotateCcw className="h-3.5 w-3.5" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>
              )}

              {/* 6. ADMIN CUSTOMERS & B2B DIRECTORY */}
              {isAdmin && activeTab === 'admin-customers' && (
                <section className="rounded-lg border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E] p-5 sm:p-6 space-y-4">
                  <div className="border-b border-[#E2E4E8] dark:border-[#262A33] pb-4">
                    <h1 className="font-display text-xl font-bold text-[#111315] dark:text-white">
                      B2B Workshops &amp; Customer Directory
                    </h1>
                    <p className="mt-0.5 text-xs text-[#5A606B] dark:text-slate-400">
                      Aggregated procurement accounts sorted by cumulative spend across verified checkouts.
                    </p>
                  </div>

                  {customerDirectory.length === 0 ? (
                    <div className="py-12 text-center text-xs text-[#5A606B] dark:text-slate-400">
                      Customer workshop accounts appear here as soon as orders are submitted.
                    </div>
                  ) : (
                    <div className="divide-y divide-[#E2E4E8] dark:divide-[#262A33] border border-[#E2E4E8] dark:border-[#262A33] rounded-md">
                      {customerDirectory.map((cust) => {
                        const details = buyerDetailsMap[cust.userId];
                        return (
                          <div key={cust.userId} className="p-4 text-xs space-y-2">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <div>
                                <div className="font-bold text-[#111315] dark:text-white">
                                  {details?.account?.workshopName || cust.companyName}
                                </div>
                                <div className="font-mono text-[11px] text-[#5A606B] dark:text-slate-400 tabular-nums">
                                  {cust.orderCount} {cust.orderCount === 1 ? 'order' : 'orders'} · Primary Hub: {cust.lastCounty}
                                  {cust.usesLipa ? ' · Lipa Pole Pole' : ''}
                                  {cust.usesLpo ? ' · Corporate LPO' : ''}
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <span className="font-mono text-sm font-bold text-[#111315] dark:text-white tabular-nums">
                                  {formatKSh(cust.totalSpendKes)}
                                </span>
                                {!details && (
                                  <button
                                    type="button"
                                    disabled={loadingBuyerUid === cust.userId}
                                    onClick={() => void handleLoadCustomerRecord(cust.userId)}
                                    className="rounded border border-[#E2E4E8] dark:border-[#262A33] bg-[#F6F6F4] dark:bg-[#1C2029] hover:border-[#004B97] px-2.5 py-1 font-mono text-[10px] font-semibold text-[#111315] dark:text-slate-200 cursor-pointer"
                                  >
                                    {loadingBuyerUid === cust.userId
                                      ? 'Loading...'
                                      : 'Load Contact & KRA'}
                                  </button>
                                )}
                              </div>
                            </div>

                            {details && (
                              <div className="rounded border border-[#E2E4E8] dark:border-[#262A33] bg-[#F6F6F4] dark:bg-[#111318] p-2.5 font-mono text-[11px] text-[#5A606B] dark:text-slate-300 flex flex-wrap gap-x-5 gap-y-1">
                                <span className="font-semibold text-[#111315] dark:text-white">
                                  {details.account?.displayName || 'Contact'}
                                </span>
                                <span>{details.privateInfo?.email || 'No email'}</span>
                                {details.privateInfo?.phone && <span>Tel: {details.privateInfo.phone}</span>}
                                {details.privateInfo?.kraPin && <span>KRA PIN: {details.privateInfo.kraPin}</span>}
                                {details.privateInfo?.address && <span>{details.privateInfo.address}</span>}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>
              )}

              {/* 7. ADMIN STAFF & ACCESS CONTROL */}
              {isAdmin && activeTab === 'admin-staff' && (
                <section className="rounded-lg border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E] p-5 sm:p-6 space-y-5">
                  <div className="border-b border-[#E2E4E8] dark:border-[#262A33] pb-4 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h1 className="font-display text-xl font-bold text-[#111315] dark:text-white">
                        Staff &amp; Dispatch Access Control
                      </h1>
                      <p className="mt-0.5 text-xs text-[#5A606B] dark:text-slate-400">
                        Manage delegated staff administrators authorized to edit live catalog inventory and process customer orders.
                      </p>
                    </div>
                    <span className="font-mono text-[11px] text-[#5A606B] dark:text-slate-400">
                      Root: {BOOTSTRAP_ADMIN_EMAIL}
                    </span>
                  </div>

                  {staffStatusMsg && (
                    <div className="rounded-md border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 p-3 text-xs text-emerald-800 dark:text-emerald-200">
                      {staffStatusMsg}
                    </div>
                  )}
                  {adminActionError && (
                    <div className="rounded-md border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 p-3 text-xs text-rose-800 dark:text-rose-200">
                      {adminActionError}
                    </div>
                  )}

                  {isBootstrappedAdmin ? (
                    <>
                      <div className="divide-y divide-[#E2E4E8] dark:divide-[#262A33] border border-[#E2E4E8] dark:border-[#262A33] rounded-md text-xs">
                        <div className="flex items-center justify-between gap-3 px-4 py-3 bg-[#F6F6F4] dark:bg-[#111318]">
                          <div>
                            <div className="font-semibold text-[#111315] dark:text-white">
                              {BOOTSTRAP_ADMIN_EMAIL}
                            </div>
                            <div className="font-mono text-[10px] text-[#5A606B] dark:text-slate-400">
                              Bootstrapped Root Administrator · Immutable
                            </div>
                          </div>
                          <span className="font-mono text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                            Active Root
                          </span>
                        </div>

                        {adminUsers.map((adm) => (
                          <div
                            key={adm.uid}
                            className="flex items-center justify-between gap-3 px-4 py-3"
                          >
                            <div className="min-w-0">
                              <div className="font-semibold text-[#111315] dark:text-white truncate">
                                {adm.email}
                              </div>
                              <div className="font-mono text-[10px] text-[#5A606B] dark:text-slate-400 truncate">
                                UID: {adm.uid}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => void revokeAdminAccess(adm.uid)}
                              className="inline-flex items-center gap-1 font-mono text-[11px] text-rose-600 dark:text-rose-400 hover:underline cursor-pointer shrink-0"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span>Revoke</span>
                            </button>
                          </div>
                        ))}
                      </div>

                      <form
                        onSubmit={handleGrantAdmin}
                        className="rounded-md border border-[#E2E4E8] dark:border-[#262A33] bg-[#F6F6F4] dark:bg-[#111318] p-4 space-y-3 text-xs"
                      >
                        <div className="font-semibold text-[#111315] dark:text-white flex items-center gap-1.5">
                          <UserPlus className="h-4 w-4 text-[#004B97] dark:text-sky-400" />
                          <span>Grant Staff Dispatch Privileges</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
                          <input
                            type="text"
                            value={newAdminUid}
                            onChange={(e) => setNewAdminUid(e.target.value)}
                            placeholder="Staff Firebase User UID"
                            className="sm:col-span-2 rounded-sm border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#0D0F12] px-3 py-2 font-mono text-xs text-[#111315] dark:text-white focus:border-[#004B97] focus:outline-none"
                          />
                          <input
                            type="email"
                            value={newAdminEmail}
                            onChange={(e) => setNewAdminEmail(e.target.value)}
                            placeholder="staff@haosail.ke"
                            className="sm:col-span-2 rounded-sm border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#0D0F12] px-3 py-2 text-xs text-[#111315] dark:text-white focus:border-[#004B97] focus:outline-none"
                          />
                          <button
                            type="submit"
                            className="btn-press rounded-sm bg-[#004B97] hover:bg-[#003B78] px-4 py-2 text-xs font-semibold text-white cursor-pointer whitespace-nowrap"
                          >
                            Grant Admin
                          </button>
                        </div>
                      </form>
                    </>
                  ) : (
                    <p className="text-xs text-[#5A606B] dark:text-slate-400">
                      Only the Root Administrator ({BOOTSTRAP_ADMIN_EMAIL}) can add or revoke delegated staff administrators.
                    </p>
                  )}
                </section>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Add / Edit Equipment Modal */}
      <AddEditEquipmentModal
        isOpen={isEquipmentModalOpen}
        editingProduct={editingCustomProduct}
        onClose={() => {
          setIsEquipmentModalOpen(false);
          setEditingCustomProduct(null);
        }}
        onSubmit={handleSaveEquipmentModal}
      />
    </div>
  );
};
