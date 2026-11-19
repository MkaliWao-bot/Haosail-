import React, { useState, useEffect } from 'react';
import {
  X,
  LogOut,
  ShieldCheck,
  ShieldAlert,
  Building2,
  PackageCheck,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  MailCheck,
  RefreshCw,
  ArrowLeft,
  Lock,
  Phone,
  MapPin,
  Boxes,
  UserPlus,
  Trash2,
  RotateCcw,
} from 'lucide-react';
import {
  BOOTSTRAP_ADMIN_EMAIL,
  UserAccountData,
  UserPrivateData,
  UserOrderRecord,
  useAuth,
} from '../context/AuthContext';
import { useCatalogOverrides } from '../context/CatalogOverridesContext';
import { PRODUCTS } from '../data/machineryData';
import { KENYAN_COUNTY_HUBS } from '../data/accessoryData';
import { formatKSh } from '../utils/currency';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthScreenMode = 'signin' | 'signup' | 'admin' | 'forgot';

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const {
    user,
    isSigningIn,
    isAdmin,
    isBootstrappedAdmin,
    authError,
    authNotice,
    accountProfile,
    privateInfo,
    userOrders,
    allOrders,
    adminUsers,
    clearAuthError,
    clearAuthNotice,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    sendPasswordReset,
    resendVerificationEmail,
    refreshEmailVerification,
    signOutUser,
    updateWorkshopDetails,
    adminUpdateOrderStatus,
    loadBuyerDetailsForAdmin,
    grantAdminAccess,
    revokeAdminAccess,
  } = useAuth();

  const {
    overridesMap,
    applyOverridesToProducts,
    saveCatalogOverride,
    clearCatalogOverride,
  } = useCatalogOverrides();

  // Signed-out auth flow state
  const [authMode, setAuthMode] = useState<AuthScreenMode>('signin');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [signupFullName, setSignupFullName] = useState('');
  const [signupWorkshop, setSignupWorkshop] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirm, setSignupConfirm] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [attemptedAdminLogin, setAttemptedAdminLogin] = useState(false);

  // Signed-in account portal state
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'admin' | 'inventory'>('profile');
  const [displayName, setDisplayName] = useState('');
  const [workshopName, setWorkshopName] = useState('');
  const [phone, setPhone] = useState('');
  const [kraPin, setKraPin] = useState('');
  const [address, setAddress] = useState('');
  const [preferredCountyId, setPreferredCountyId] = useState('nairobi');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [updatingOrderKey, setUpdatingOrderKey] = useState<string | null>(null);
  const [adminActionError, setAdminActionError] = useState<string | null>(null);
  const [dispatchNotice, setDispatchNotice] = useState<string | null>(null);
  const [buyerDetailsMap, setBuyerDetailsMap] = useState<
    Record<string, { account: UserAccountData | null; privateInfo: UserPrivateData | null }>
  >({});
  const [loadingBuyerUid, setLoadingBuyerUid] = useState<string | null>(null);
  const [expandedOrderKey, setExpandedOrderKey] = useState<string | null>(null);

  // Admin staff management state
  const [newAdminUid, setNewAdminUid] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [staffStatusMsg, setStaffStatusMsg] = useState<string | null>(null);

  // Admin inventory management state
  const [inventorySearch, setInventorySearch] = useState('');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editPriceKes, setEditPriceKes] = useState<string>('');
  const [editStockCount, setEditStockCount] = useState<string>('');
  const [editInStock, setEditInStock] = useState<boolean>(true);
  const [isSavingInventory, setIsSavingInventory] = useState(false);
  const [inventoryNotice, setInventoryNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setDisplayName(accountProfile?.displayName || user.displayName || '');
    setWorkshopName(accountProfile?.workshopName || '');
    setPhone(privateInfo?.phone || '');
    setKraPin(privateInfo?.kraPin || '');
    setAddress(privateInfo?.address || '');
    setPreferredCountyId(privateInfo?.preferredCountyId || 'nairobi');
  }, [user, accountProfile, privateInfo]);

  useEffect(() => {
    if (user && user.emailVerified && isAdmin && attemptedAdminLogin) {
      setActiveTab('admin');
      setAttemptedAdminLogin(false);
    }
  }, [user, isAdmin, attemptedAdminLogin]);

  if (!isOpen) return null;

  const switchAuthMode = (nextMode: AuthScreenMode) => {
    setAuthMode(nextMode);
    setLocalError(null);
    clearAuthError();
    clearAuthNotice();
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    if (!loginEmail.trim() || !loginPassword) {
      setLocalError('Enter both your email address and password.');
      return;
    }
    const isStaffTab = authMode === 'admin';
    setAttemptedAdminLogin(isStaffTab);
    const ok = await signInWithEmail(loginEmail, loginPassword);
    if (ok && !isStaffTab) {
      setActiveTab('profile');
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    if (!signupFullName.trim()) {
      setLocalError('Please enter your full contact name.');
      return;
    }
    if (signupPassword.length < 6) {
      setLocalError('Password must be at least 6 characters.');
      return;
    }
    if (signupPassword !== signupConfirm) {
      setLocalError('Passwords do not match.');
      return;
    }
    setAttemptedAdminLogin(false);
    await signUpWithEmail({
      fullName: signupFullName,
      workshopName: signupWorkshop,
      email: signupEmail,
      password: signupPassword,
    });
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    if (!loginEmail.trim()) {
      setLocalError('Enter your registered email address to receive a reset link.');
      return;
    }
    await sendPasswordReset(loginEmail);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await updateWorkshopDetails({
        displayName,
        workshopName,
        phone,
        kraPin,
        address,
        preferredCountyId,
      });
      setSaveSuccess(true);
      window.setTimeout(() => setSaveSuccess(false), 2400);
    } finally {
      setIsSaving(false);
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

  const liveInventoryProducts = applyOverridesToProducts(PRODUCTS);
  const filteredInventory = liveInventoryProducts.filter((item) => {
    const q = inventorySearch.trim().toLowerCase();
    if (!q) return true;
    return (
      item.name.toLowerCase().includes(q) ||
      item.sku.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  const handleStartEditInventory = (item: typeof liveInventoryProducts[number]) => {
    setInventoryNotice(null);
    setAdminActionError(null);
    setEditingProductId(item.id);
    setEditPriceKes(String(item.price));
    setEditStockCount(String(item.stockCount));
    setEditInStock(item.inStock);
  };

  const handleSaveInventoryEdit = async (productId: string) => {
    setIsSavingInventory(true);
    setInventoryNotice(null);
    setAdminActionError(null);
    try {
      const parsedPrice = Number(editPriceKes);
      const parsedStock = Number(editStockCount);
      const res = await saveCatalogOverride({
        productId,
        priceKes: parsedPrice,
        stockCount: parsedStock,
        inStock: editInStock,
      });
      if (res.ok) {
        setInventoryNotice(`Live price & stock updated for ${productId}.`);
        setEditingProductId(null);
      } else {
        setAdminActionError(res.error || 'Failed to update live catalog.');
      }
    } finally {
      setIsSavingInventory(false);
    }
  };

  const handleResetInventoryEdit = async (productId: string) => {
    setIsSavingInventory(true);
    setInventoryNotice(null);
    setAdminActionError(null);
    try {
      const res = await clearCatalogOverride(productId);
      if (res.ok) {
        setInventoryNotice(`Reverted ${productId} to factory catalog pricing.`);
        setEditingProductId(null);
      } else {
        setAdminActionError(res.error || 'Failed to clear override.');
      }
    } finally {
      setIsSavingInventory(false);
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

  const activeError = localError || authError;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto print:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0D0F12]/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Architectural Account Dialog */}
      <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-lg border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E] text-[#111315] dark:text-[#F3F4F6] shadow-2xl my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E2E4E8] dark:border-[#262A33] bg-[#F6F6F4] dark:bg-[#111318] px-6 py-4">
          <div>
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#004B97] dark:text-sky-400 block">
              HaoSail Kenya Portal
            </span>
            <h2 className="font-display text-base font-bold text-[#111315] dark:text-white tracking-tight">
              {!user
                ? authMode === 'signup'
                  ? 'Create Workshop Account'
                  : authMode === 'admin'
                    ? 'Admin & Dispatch Sign In'
                    : authMode === 'forgot'
                      ? 'Reset Password'
                      : 'Sign In to HaoSail Machinery'
                : !user.emailVerified
                  ? 'Verify Email Address'
                  : 'Workshop Account & Orders'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close account modal"
            className="rounded-md p-1.5 text-[#5A606B] dark:text-slate-400 hover:bg-[#E2E4E8] dark:hover:bg-[#262A33] hover:text-[#111315] dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {!user ? (
          /* Signed-Out View: Sign In / Create Account / Admin Login */
          <div className="p-6 space-y-5 max-h-[82vh] overflow-y-auto">
            {authMode !== 'forgot' && (
              <div className="grid grid-cols-3 rounded-md border border-[#E2E4E8] dark:border-[#262A33] bg-[#F6F6F4] dark:bg-[#111318] p-1 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => switchAuthMode('signin')}
                  className={`rounded py-1.5 transition-colors cursor-pointer ${
                    authMode === 'signin'
                      ? 'bg-white dark:bg-[#1C2029] text-[#004B97] dark:text-white shadow-xs'
                      : 'text-[#5A606B] dark:text-slate-400 hover:text-[#111315] dark:hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => switchAuthMode('signup')}
                  className={`rounded py-1.5 transition-colors cursor-pointer ${
                    authMode === 'signup'
                      ? 'bg-white dark:bg-[#1C2029] text-[#004B97] dark:text-white shadow-xs'
                      : 'text-[#5A606B] dark:text-slate-400 hover:text-[#111315] dark:hover:text-white'
                  }`}
                >
                  Create Account
                </button>
                <button
                  type="button"
                  onClick={() => switchAuthMode('admin')}
                  className={`inline-flex items-center justify-center gap-1 rounded py-1.5 transition-colors cursor-pointer ${
                    authMode === 'admin'
                      ? 'bg-white dark:bg-[#1C2029] text-[#004B97] dark:text-amber-300 shadow-xs'
                      : 'text-[#5A606B] dark:text-slate-400 hover:text-[#111315] dark:hover:text-white'
                  }`}
                >
                  <Lock className="h-3 w-3" />
                  <span>Admin</span>
                </button>
              </div>
            )}

            {authNotice && (
              <div className="flex items-start gap-2.5 rounded-md border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 p-3 text-xs text-emerald-800 dark:text-emerald-200">
                <Check className="h-4 w-4 shrink-0 mt-0.5" />
                <div className="flex-1">{authNotice}</div>
              </div>
            )}

            {activeError && (
              <div className="flex items-start gap-2.5 rounded-md border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 p-3 text-xs text-rose-800 dark:text-rose-200">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <div className="flex-1">{activeError}</div>
                <button
                  type="button"
                  onClick={() => {
                    setLocalError(null);
                    clearAuthError();
                  }}
                  className="text-[11px] font-mono underline cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            )}

            {authMode === 'forgot' ? (
              <form onSubmit={handleForgotSubmit} className="space-y-4 text-xs">
                <button
                  type="button"
                  onClick={() => switchAuthMode('signin')}
                  className="inline-flex items-center gap-1 font-mono text-[11px] text-[#004B97] dark:text-sky-400 hover:underline cursor-pointer"
                >
                  <ArrowLeft className="h-3 w-3" />
                  <span>Back to Sign In</span>
                </button>
                <p className="text-[#5A606B] dark:text-slate-400 leading-relaxed">
                  Enter the email address associated with your HaoSail account and we will send a password reset link.
                </p>
                <div>
                  <label className="block font-medium text-[#5A606B] dark:text-slate-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="you@workshop.co.ke"
                    className="w-full rounded-sm border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#0D0F12] px-3 py-2 text-[#111315] dark:text-white focus:border-[#004B97] dark:focus:border-sky-400 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSigningIn}
                  className="btn-press w-full rounded-md bg-[#004B97] hover:bg-[#003B78] py-2.5 text-xs font-semibold text-white cursor-pointer disabled:opacity-60"
                >
                  {isSigningIn ? 'Sending Reset Link...' : 'Send Password Reset Email'}
                </button>
              </form>
            ) : authMode === 'signup' ? (
              <form onSubmit={handleSignUpSubmit} className="space-y-3.5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-[#5A606B] dark:text-slate-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={100}
                      value={signupFullName}
                      onChange={(e) => setSignupFullName(e.target.value)}
                      placeholder="David Mwangi"
                      className="w-full rounded-sm border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#0D0F12] px-3 py-2 text-[#111315] dark:text-white focus:border-[#004B97] dark:focus:border-sky-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-[#5A606B] dark:text-slate-300 mb-1">
                      Workshop / Company (Optional)
                    </label>
                    <input
                      type="text"
                      maxLength={120}
                      value={signupWorkshop}
                      onChange={(e) => setSignupWorkshop(e.target.value)}
                      placeholder="Rift Valley Joinery Ltd"
                      className="w-full rounded-sm border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#0D0F12] px-3 py-2 text-[#111315] dark:text-white focus:border-[#004B97] dark:focus:border-sky-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-[#5A606B] dark:text-slate-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    maxLength={120}
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="procurement@company.co.ke"
                    className="w-full rounded-sm border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#0D0F12] px-3 py-2 text-[#111315] dark:text-white focus:border-[#004B97] dark:focus:border-sky-400 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-[#5A606B] dark:text-slate-300 mb-1">
                      Password (min. 6 chars) *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-sm border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#0D0F12] px-3 py-2 pr-9 text-[#111315] dark:text-white focus:border-[#004B97] dark:focus:border-sky-400 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label="Toggle password visibility"
                        className="absolute right-2.5 top-2.5 text-[#5A606B] hover:text-[#111315] dark:hover:text-white cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block font-medium text-[#5A606B] dark:text-slate-300 mb-1">
                      Confirm Password *
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={signupConfirm}
                      onChange={(e) => setSignupConfirm(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-sm border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#0D0F12] px-3 py-2 text-[#111315] dark:text-white focus:border-[#004B97] dark:focus:border-sky-400 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSigningIn}
                  className="btn-press w-full rounded-md bg-[#004B97] hover:bg-[#003B78] py-2.5 text-xs font-semibold text-white cursor-pointer disabled:opacity-60"
                >
                  {isSigningIn ? 'Creating Account...' : 'Create Account with Email'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignInSubmit} className="space-y-3.5 text-xs">
                {authMode === 'admin' && (
                  <div className="rounded-md border border-amber-200 dark:border-amber-800/70 bg-amber-50/70 dark:bg-amber-950/30 p-3 text-[11px] text-amber-900 dark:text-amber-200 leading-relaxed">
                    <span className="font-semibold block mb-0.5">Administrator Dispatch Access</span>
                    Sign in with your verified administrator email (e.g. <span className="font-mono">{BOOTSTRAP_ADMIN_EMAIL}</span>) via Email &amp; Password or Google below to unlock order management.
                  </div>
                )}

                <div>
                  <label className="block font-medium text-[#5A606B] dark:text-slate-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder={authMode === 'admin' ? BOOTSTRAP_ADMIN_EMAIL : 'you@workshop.co.ke'}
                    className="w-full rounded-sm border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#0D0F12] px-3 py-2 text-[#111315] dark:text-white focus:border-[#004B97] dark:focus:border-sky-400 focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-medium text-[#5A606B] dark:text-slate-300">
                      Password *
                    </label>
                    <button
                      type="button"
                      onClick={() => switchAuthMode('forgot')}
                      className="font-mono text-[11px] text-[#004B97] dark:text-sky-400 hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-sm border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#0D0F12] px-3 py-2 pr-9 text-[#111315] dark:text-white focus:border-[#004B97] dark:focus:border-sky-400 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label="Toggle password visibility"
                      className="absolute right-2.5 top-2.5 text-[#5A606B] hover:text-[#111315] dark:hover:text-white cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSigningIn}
                  className="btn-press w-full rounded-md bg-[#004B97] hover:bg-[#003B78] py-2.5 text-xs font-semibold text-white cursor-pointer disabled:opacity-60"
                >
                  {isSigningIn
                    ? 'Signing In...'
                    : authMode === 'admin'
                      ? 'Sign In to Admin Portal'
                      : 'Sign In with Email'}
                </button>
              </form>
            )}

            {authMode !== 'forgot' && (
              <>
                <div className="relative flex items-center py-0.5">
                  <div className="flex-grow border-t border-[#E2E4E8] dark:border-[#262A33]" />
                  <span className="mx-3 font-mono text-[10px] uppercase tracking-wider text-[#5A606B] dark:text-slate-400">
                    or continue with
                  </span>
                  <div className="flex-grow border-t border-[#E2E4E8] dark:border-[#262A33]" />
                </div>

                <button
                  type="button"
                  disabled={isSigningIn}
                  onClick={async () => {
                    const isStaffTab = authMode === 'admin';
                    setAttemptedAdminLogin(isStaffTab);
                    const ok = await signInWithGoogle();
                    if (ok && !isStaffTab) {
                      setActiveTab('profile');
                    }
                  }}
                  className="btn-press flex w-full items-center justify-center gap-3 rounded-md border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#1C2029] hover:border-[#004B97] dark:hover:border-sky-400 px-5 py-2.5 text-xs font-semibold text-[#111315] dark:text-white shadow-xs cursor-pointer disabled:opacity-60"
                >
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96z"
                    />
                  </svg>
                  <span>{isSigningIn ? 'Connecting to Google...' : 'Continue with Google'}</span>
                </button>
              </>
            )}

            <div className="border-t border-[#E2E4E8] dark:border-[#262A33] pt-3.5 flex items-center gap-2 text-[11px] text-[#5A606B] dark:text-slate-400 font-mono">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Private PII isolated per verified UID · Guest browsing remains enabled</span>
            </div>
          </div>
        ) : !user.emailVerified ? (
          /* Signed-in Email/Password Account Pending Email Verification */
          <div className="p-6 space-y-4 text-xs">
            <div className="flex items-start gap-3 rounded-md border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/30 p-4">
              <MailCheck className="h-5 w-5 text-[#004B97] dark:text-sky-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-sm text-[#111315] dark:text-white">
                  Confirm your email to activate Firestore syncing
                </p>
                <p className="text-[#5A606B] dark:text-slate-300 leading-relaxed">
                  You are signed in as <span className="font-mono font-semibold">{user.email}</span>. Click the verification link sent to your inbox, then click <strong>Check Verification</strong> below.
                </p>
              </div>
            </div>

            {authNotice && (
              <div className="rounded-md border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 p-3 text-emerald-800 dark:text-emerald-200">
                {authNotice}
              </div>
            )}

            {activeError && (
              <div className="rounded-md border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 p-3 text-rose-800 dark:text-rose-200">
                {activeError}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={isSigningIn}
                  onClick={() => refreshEmailVerification()}
                  className="btn-press inline-flex items-center gap-1.5 rounded-md bg-[#004B97] hover:bg-[#003B78] px-4 py-2 font-semibold text-white cursor-pointer disabled:opacity-60"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isSigningIn ? 'animate-spin' : ''}`} />
                  <span>Check Verification</span>
                </button>
                <button
                  type="button"
                  disabled={isSigningIn}
                  onClick={() => resendVerificationEmail()}
                  className="btn-press rounded-md border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#1C2029] hover:border-[#004B97] px-3 py-2 font-medium text-[#111315] dark:text-white cursor-pointer disabled:opacity-60"
                >
                  Resend Link
                </button>
              </div>

              <button
                type="button"
                onClick={() => signOutUser()}
                className="inline-flex items-center gap-1 font-mono text-[11px] text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          /* Signed-In & Verified Account Portal */
          <div>
            {/* User Identity Banner */}
            <div className="flex items-center justify-between gap-4 border-b border-[#E2E4E8] dark:border-[#262A33] px-6 py-4">
              <div className="flex items-center gap-3 min-w-0">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={accountProfile?.displayName || user.displayName || 'Account avatar'}
                    className="h-10 w-10 rounded-full border border-[#E2E4E8] dark:border-[#262A33] object-cover shrink-0"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-[#004B97] text-white flex items-center justify-center font-mono text-sm font-bold shrink-0">
                    {(accountProfile?.displayName || user.displayName || user.email || 'H')[0].toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-display text-sm font-bold text-[#111315] dark:text-white truncate">
                      {accountProfile?.displayName || user.displayName || 'Workshop Client'}
                    </p>
                    {isAdmin && (
                      <span className="inline-flex items-center gap-1 rounded bg-amber-100 dark:bg-amber-900/50 border border-amber-300 dark:border-amber-700 px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase text-amber-800 dark:text-amber-300 shrink-0">
                        Admin
                      </span>
                    )}
                  </div>
                  <p className="font-mono text-[11px] text-[#5A606B] dark:text-slate-400 truncate">
                    {user.email}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={async () => {
                  setAttemptedAdminLogin(false);
                  await signOutUser();
                }}
                className="btn-press inline-flex items-center gap-1.5 rounded-md border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#1C2029] hover:border-rose-500 hover:text-rose-600 dark:hover:text-rose-400 px-3 py-1.5 text-xs font-medium text-[#5A606B] dark:text-slate-300 cursor-pointer shrink-0"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign Out</span>
              </button>
            </div>

            {attemptedAdminLogin && !isAdmin && (
              <div className="mx-6 mt-4 flex items-start gap-2 rounded-md border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-3 text-xs text-amber-900 dark:text-amber-200">
                <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                <span>
                  Signed in as a standard customer account. Your profile does not have Administrator dispatch privileges.
                </span>
              </div>
            )}

            {/* Section Tabs */}
            <div className="flex border-b border-[#E2E4E8] dark:border-[#262A33] px-6 gap-6 text-xs font-semibold overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className={`inline-flex items-center gap-1.5 py-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'profile'
                    ? 'border-[#004B97] text-[#004B97] dark:border-sky-400 dark:text-sky-400'
                    : 'border-transparent text-[#5A606B] dark:text-slate-400 hover:text-[#111315] dark:hover:text-white'
                }`}
              >
                <Building2 className="h-3.5 w-3.5" />
                <span>Workshop Profile</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('orders')}
                className={`inline-flex items-center gap-1.5 py-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'orders'
                    ? 'border-[#004B97] text-[#004B97] dark:border-sky-400 dark:text-sky-400'
                    : 'border-transparent text-[#5A606B] dark:text-slate-400 hover:text-[#111315] dark:hover:text-white'
                }`}
              >
                <PackageCheck className="h-3.5 w-3.5" />
                <span>My Orders ({userOrders.length})</span>
              </button>

              {isAdmin && (
                <>
                  <button
                    type="button"
                    onClick={() => setActiveTab('admin')}
                    className={`inline-flex items-center gap-1.5 py-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      activeTab === 'admin'
                        ? 'border-amber-600 text-amber-700 dark:border-amber-400 dark:text-amber-300'
                        : 'border-transparent text-[#5A606B] dark:text-slate-400 hover:text-[#111315] dark:hover:text-white'
                    }`}
                  >
                    <Lock className="h-3.5 w-3.5" />
                    <span>Admin Dispatch ({allOrders.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('inventory')}
                    className={`inline-flex items-center gap-1.5 py-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      activeTab === 'inventory'
                        ? 'border-[#004B97] text-[#004B97] dark:border-sky-400 dark:text-sky-400'
                        : 'border-transparent text-[#5A606B] dark:text-slate-400 hover:text-[#111315] dark:hover:text-white'
                    }`}
                  >
                    <Boxes className="h-3.5 w-3.5" />
                    <span>Inventory ({PRODUCTS.length})</span>
                  </button>
                </>
              )}
            </div>

            {/* Tab Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {activeTab === 'profile' ? (
                <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block font-medium text-[#5A606B] dark:text-slate-300 mb-1">
                        Contact Person Name *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={100}
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full rounded-sm border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#0D0F12] px-3 py-2 text-[#111315] dark:text-white focus:border-[#004B97] dark:focus:border-sky-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-[#5A606B] dark:text-slate-300 mb-1">
                        Company / Workshop Name
                      </label>
                      <input
                        type="text"
                        maxLength={120}
                        value={workshopName}
                        onChange={(e) => setWorkshopName(e.target.value)}
                        placeholder="e.g. Rift Valley Joinery Ltd"
                        className="w-full rounded-sm border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#0D0F12] px-3 py-2 text-[#111315] dark:text-white focus:border-[#004B97] dark:focus:border-sky-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-[#5A606B] dark:text-slate-300 mb-1">
                        Safaricom / Contact Phone
                      </label>
                      <input
                        type="tel"
                        maxLength={30}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="07XX XXX XXX"
                        className="w-full rounded-sm border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#0D0F12] px-3 py-2 font-mono text-[#111315] dark:text-white focus:border-[#004B97] dark:focus:border-sky-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-[#5A606B] dark:text-slate-300 mb-1">
                        KRA PIN
                      </label>
                      <input
                        type="text"
                        maxLength={20}
                        value={kraPin}
                        onChange={(e) => setKraPin(e.target.value)}
                        placeholder="P05XXXXXXXX"
                        className="w-full rounded-sm border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#0D0F12] px-3 py-2 font-mono text-[#111315] dark:text-white focus:border-[#004B97] dark:focus:border-sky-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block font-medium text-[#5A606B] dark:text-slate-300 mb-1">
                        Preferred Delivery County Hub
                      </label>
                      <select
                        value={preferredCountyId}
                        onChange={(e) => setPreferredCountyId(e.target.value)}
                        className="w-full rounded-sm border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#0D0F12] px-3 py-2 text-[#111315] dark:text-white focus:border-[#004B97] dark:focus:border-sky-400 focus:outline-none cursor-pointer"
                      >
                        {KENYAN_COUNTY_HUBS.map((hub) => (
                          <option key={hub.id} value={hub.id} className="dark:bg-[#15181E]">
                            {hub.county} ({hub.mainTown})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-medium text-[#5A606B] dark:text-slate-300 mb-1">
                        Default Street / Landmark
                      </label>
                      <input
                        type="text"
                        maxLength={200}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Plot / Industrial Area Rd"
                        className="w-full rounded-sm border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#0D0F12] px-3 py-2 text-[#111315] dark:text-white focus:border-[#004B97] dark:focus:border-sky-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="font-mono text-[11px] text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                      {saveSuccess && (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          <span>Saved to account &amp; synced to Checkout</span>
                        </>
                      )}
                    </span>

                    <button
                      type="submit"
                      disabled={isSaving}
                      className="btn-press rounded-md bg-[#004B97] hover:bg-[#003B78] px-4 py-2 text-xs font-semibold text-white cursor-pointer disabled:opacity-60"
                    >
                      {isSaving ? 'Saving...' : 'Save Workshop Details'}
                    </button>
                  </div>
                </form>
              ) : activeTab === 'orders' ? (
                <div className="space-y-3">
                  {userOrders.length === 0 ? (
                    <div className="py-10 text-center text-xs text-[#5A606B] dark:text-slate-400">
                      <PackageCheck className="mx-auto h-7 w-7 text-slate-300 dark:text-slate-600 mb-2" />
                      <p className="font-semibold text-[#111315] dark:text-white">
                        No procurement orders recorded yet
                      </p>
                      <p className="mt-1">
                        Orders placed at Checkout while signed in will appear here automatically.
                      </p>
                    </div>
                  ) : (
                    userOrders.map((order) => (
                      <div
                        key={order.orderId}
                        className="rounded-md border border-[#E2E4E8] dark:border-[#262A33] bg-[#F6F6F4] dark:bg-[#111318] p-3.5 text-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-mono font-bold text-[#004B97] dark:text-sky-400">
                            {order.orderId}
                          </span>
                          <span className="font-mono text-[11px] uppercase font-semibold text-emerald-700 dark:text-emerald-400">
                            {order.status}
                          </span>
                        </div>
                        <p className="font-medium text-[#111315] dark:text-white line-clamp-2">
                          {order.itemsSummary}
                        </p>
                        <div className="flex items-center justify-between font-mono text-[11px] text-[#5A606B] dark:text-slate-400 tabular-nums pt-1">
                          <span>
                            {order.itemCount} {order.itemCount === 1 ? 'unit' : 'units'} · {order.countyId} · {order.settlementMode}
                            {order.etimsControlNumber ? ` · ${order.etimsControlNumber}` : ''}
                          </span>
                          <span className="font-bold text-[#111315] dark:text-white">
                            {formatKSh(order.totalAmountKes)}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : activeTab === 'admin' ? (
                /* Admin Dispatch Console Tab */
                <div className="space-y-4">
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

                  {allOrders.length === 0 ? (
                    <div className="py-10 text-center text-xs text-[#5A606B] dark:text-slate-400">
                      <PackageCheck className="mx-auto h-7 w-7 text-slate-300 dark:text-slate-600 mb-2" />
                      <p className="font-semibold text-[#111315] dark:text-white">
                        No customer dispatch orders yet
                      </p>
                      <p className="mt-1">
                        Completed customer orders across all workshops will sync here in real time.
                      </p>
                    </div>
                  ) : (
                    allOrders.map((order) => {
                      const key = `${order.userId}:${order.orderId}`;
                      const isBusy = updatingOrderKey === key;
                      const isExpanded = expandedOrderKey === key;
                      const buyerRecord = buyerDetailsMap[order.userId];
                      return (
                        <div
                          key={key}
                          className="rounded-md border border-[#E2E4E8] dark:border-[#262A33] bg-[#F6F6F4] dark:bg-[#111318] p-3.5 text-xs space-y-2"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <span className="font-mono font-bold text-[#004B97] dark:text-sky-400">
                                {order.orderId}
                              </span>
                              {order.companyName && (
                                <span className="ml-2 text-[#5A606B] dark:text-slate-400">
                                  · {order.companyName}
                                </span>
                              )}
                              {order.etimsControlNumber && (
                                <span className="ml-2 font-mono text-[10px] text-[#5A606B] dark:text-slate-400">
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

                          <p className="font-medium text-[#111315] dark:text-white line-clamp-2">
                            {order.itemsSummary}
                          </p>

                          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#E2E4E8] dark:border-[#262A33]">
                            <span className="font-mono text-[11px] text-[#5A606B] dark:text-slate-400 tabular-nums">
                              {order.itemCount} {order.itemCount === 1 ? 'unit' : 'units'} · {order.countyId}
                              {order.paymentMethod ? ` · ${order.paymentMethod}` : ''} · {formatKSh(order.totalAmountKes)}
                            </span>

                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleToggleBuyerContact(key, order.userId)}
                                className="rounded border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#1C2029] px-2.5 py-1 font-mono text-[10px] font-semibold text-[#111315] dark:text-slate-200 hover:border-[#004B97] cursor-pointer"
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
                            <div className="rounded border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E] p-2.5 text-[11px] space-y-1">
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
                    })
                  )}

                  {isBootstrappedAdmin && (
                    <div className="border-t border-[#E2E4E8] dark:border-[#262A33] pt-4 space-y-3 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-display font-bold text-[#111315] dark:text-white flex items-center gap-1.5">
                          <UserPlus className="h-3.5 w-3.5 text-[#004B97] dark:text-sky-400" />
                          <span>Staff Dispatch Admin Registry</span>
                        </span>
                        <span className="font-mono text-[10px] text-[#5A606B] dark:text-slate-400">
                          Root: {BOOTSTRAP_ADMIN_EMAIL}
                        </span>
                      </div>

                      {staffStatusMsg && (
                        <div className="rounded border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 p-2 text-[11px] text-emerald-800 dark:text-emerald-200">
                          {staffStatusMsg}
                        </div>
                      )}

                      {adminUsers.length > 0 && (
                        <div className="divide-y divide-[#E2E4E8] dark:divide-[#262A33] border border-[#E2E4E8] dark:border-[#262A33] rounded-sm">
                          {adminUsers.map((adm) => (
                            <div
                              key={adm.uid}
                              className="flex items-center justify-between gap-2 px-3 py-2 text-[11px]"
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
                                className="inline-flex items-center gap-1 font-mono text-[10px] text-rose-600 dark:text-rose-400 hover:underline cursor-pointer shrink-0"
                              >
                                <Trash2 className="h-3 w-3" />
                                <span>Revoke</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <form onSubmit={handleGrantAdmin} className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                        <input
                          type="text"
                          value={newAdminUid}
                          onChange={(e) => setNewAdminUid(e.target.value)}
                          placeholder="Staff Firebase UID"
                          className="sm:col-span-2 rounded-sm border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#0D0F12] px-2.5 py-1.5 font-mono text-[11px] text-[#111315] dark:text-white focus:border-[#004B97] focus:outline-none"
                        />
                        <input
                          type="email"
                          value={newAdminEmail}
                          onChange={(e) => setNewAdminEmail(e.target.value)}
                          placeholder="staff@haosail.ke"
                          className="sm:col-span-2 rounded-sm border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#0D0F12] px-2.5 py-1.5 text-[11px] text-[#111315] dark:text-white focus:border-[#004B97] focus:outline-none"
                        />
                        <button
                          type="submit"
                          className="btn-press rounded-sm bg-[#004B97] hover:bg-[#003B78] px-3 py-1.5 text-[11px] font-semibold text-white cursor-pointer whitespace-nowrap"
                        >
                          Grant Admin
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              ) : (
                /* Admin Live Inventory & Price Overrides Tab */
                <div className="space-y-3 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <input
                      type="search"
                      value={inventorySearch}
                      onChange={(e) => setInventorySearch(e.target.value)}
                      placeholder="Filter by SKU, machine name, or category..."
                      className="flex-1 rounded-sm border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#0D0F12] px-3 py-2 text-xs text-[#111315] dark:text-white focus:border-[#004B97] focus:outline-none"
                    />
                    <span className="font-mono text-[11px] text-[#5A606B] dark:text-slate-400 tabular-nums shrink-0">
                      {Object.keys(overridesMap).length} live overrides active
                    </span>
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

                  <div className="divide-y divide-[#E2E4E8] dark:divide-[#262A33] border border-[#E2E4E8] dark:border-[#262A33] rounded-sm">
                    {filteredInventory.map((item) => {
                      const hasOverride = Boolean(overridesMap[item.id]);
                      const isEditing = editingProductId === item.id;
                      return (
                        <div key={item.id} className="p-3 space-y-2">
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 font-mono text-[10px]">
                                <span className="font-semibold text-[#004B97] dark:text-sky-400">
                                  {item.sku}
                                </span>
                                {hasOverride && (
                                  <span className="text-amber-700 dark:text-amber-400 font-semibold">
                                    · Live Override
                                  </span>
                                )}
                              </div>
                              <p className="font-semibold text-[#111315] dark:text-white truncate">
                                {item.name}
                              </p>
                            </div>

                            <div className="text-right shrink-0 flex items-center gap-3">
                              <div className="font-mono tabular-nums">
                                <div className="font-bold text-[#111315] dark:text-white">
                                  {formatKSh(item.price)}
                                </div>
                                <div
                                  className={`text-[10px] ${
                                    item.inStock
                                      ? 'text-emerald-700 dark:text-emerald-400'
                                      : 'text-rose-600 dark:text-rose-400'
                                  }`}
                                >
                                  {item.inStock ? `In Stock (${item.stockCount})` : 'Out of Stock'}
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  isEditing
                                    ? setEditingProductId(null)
                                    : handleStartEditInventory(item)
                                }
                                className="rounded border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#1C2029] px-2.5 py-1 font-mono text-[10px] font-semibold text-[#111315] dark:text-slate-200 hover:border-[#004B97] cursor-pointer"
                              >
                                {isEditing ? 'Cancel' : 'Edit'}
                              </button>
                            </div>
                          </div>

                          {isEditing && (
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-2 border-t border-[#E2E4E8] dark:border-[#262A33] items-end">
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
                                  className="w-full rounded-sm border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#0D0F12] px-2 py-1.5 font-mono text-xs tabular-nums text-[#111315] dark:text-white"
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
                                  className="w-full rounded-sm border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#0D0F12] px-2 py-1.5 font-mono text-xs tabular-nums text-[#111315] dark:text-white"
                                />
                              </div>
                              <label className="inline-flex items-center gap-2 py-1.5 cursor-pointer text-[11px] font-medium text-[#111315] dark:text-slate-200">
                                <input
                                  type="checkbox"
                                  checked={editInStock}
                                  onChange={(e) => setEditInStock(e.target.checked)}
                                  className="rounded border-slate-300 text-[#004B97] cursor-pointer"
                                />
                                <span>Available</span>
                              </label>
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  disabled={isSavingInventory}
                                  onClick={() => void handleSaveInventoryEdit(item.id)}
                                  className="flex-1 rounded-sm bg-[#004B97] hover:bg-[#003B78] px-2.5 py-1.5 text-[11px] font-semibold text-white cursor-pointer disabled:opacity-50"
                                >
                                  Save Live
                                </button>
                                {hasOverride && (
                                  <button
                                    type="button"
                                    disabled={isSavingInventory}
                                    onClick={() => void handleResetInventoryEdit(item.id)}
                                    title="Reset to default price & stock"
                                    aria-label="Reset override"
                                    className="rounded-sm border border-[#E2E4E8] dark:border-[#262A33] p-1.5 text-[#5A606B] hover:text-rose-600 cursor-pointer"
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
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
