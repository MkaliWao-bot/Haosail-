import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  signOut,
} from 'firebase/auth';
import {
  collection,
  collectionGroup,
  deleteDoc,
  doc,
  getDoc,
  limit,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  Timestamp,
} from 'firebase/firestore';
import {
  auth,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType,
} from '../firebase';

export const BOOTSTRAP_ADMIN_EMAIL = 'felitexcyber001@gmail.com';

export interface UserAccountData {
  uid: string;
  displayName: string;
  photoUrl?: string;
  workshopName?: string;
}

export interface UserPrivateData {
  uid: string;
  email: string;
  phone?: string;
  kraPin?: string;
  address?: string;
  preferredCountyId?: string;
}

export interface UserOrderRecord {
  orderId: string;
  userId: string;
  companyName?: string;
  countyId: string;
  deliveryMode: 'direct-site' | 'depot-pickup';
  settlementMode: 'full' | 'lipa-pole-pole';
  paymentMethod?: 'mpesa' | 'bank-wire' | 'lpo-credit' | 'depot-pay';
  status: 'confirmed' | 'dispatched' | 'completed';
  totalAmountKes: number;
  itemCount: number;
  itemsSummary: string;
  voucherCode?: string;
  etimsControlNumber?: string;
  createdAt?: Timestamp;
}

export interface AdminUserRecord {
  uid: string;
  email: string;
  grantedBy: string;
  createdAt?: Timestamp;
}

export interface SaveOrderInput {
  orderId: string;
  companyName?: string;
  countyId: string;
  deliveryMode: 'direct-site' | 'depot-pickup';
  settlementMode: 'full' | 'lipa-pole-pole';
  paymentMethod?: 'mpesa' | 'bank-wire' | 'lpo-credit' | 'depot-pay';
  totalAmountKes: number;
  itemCount: number;
  itemsSummary: string;
  voucherCode?: string;
  etimsControlNumber?: string;
}

interface AuthContextValue {
  user: User | null;
  isAuthReady: boolean;
  isSigningIn: boolean;
  isAdmin: boolean;
  isBootstrappedAdmin: boolean;
  authError: string | null;
  authNotice: string | null;
  accountProfile: UserAccountData | null;
  privateInfo: UserPrivateData | null;
  userOrders: UserOrderRecord[];
  allOrders: UserOrderRecord[];
  adminUsers: AdminUserRecord[];
  clearAuthError: () => void;
  clearAuthNotice: () => void;
  signInWithGoogle: () => Promise<boolean>;
  signInWithEmail: (email: string, password: string) => Promise<boolean>;
  signUpWithEmail: (input: {
    fullName: string;
    workshopName?: string;
    email: string;
    password: string;
  }) => Promise<boolean>;
  sendPasswordReset: (email: string) => Promise<boolean>;
  resendVerificationEmail: () => Promise<boolean>;
  refreshEmailVerification: () => Promise<boolean>;
  signOutUser: () => Promise<void>;
  updateWorkshopDetails: (input: {
    displayName: string;
    workshopName: string;
    phone: string;
    kraPin: string;
    address: string;
    preferredCountyId: string;
  }) => Promise<void>;
  saveOrderToAccount: (order: SaveOrderInput) => Promise<{ ok: boolean; error?: string }>;
  adminUpdateOrderStatus: (
    targetUserId: string,
    orderId: string,
    nextStatus: 'confirmed' | 'dispatched' | 'completed',
    notifyContext?: {
      etimsControlNumber?: string;
      countyName?: string;
      totalAmountKes?: number;
      itemsSummary?: string;
    }
  ) => Promise<{ emailSent: boolean; emailReason?: string }>;
  loadBuyerDetailsForAdmin: (targetUserId: string) => Promise<{
    account: UserAccountData | null;
    privateInfo: UserPrivateData | null;
  }>;
  grantAdminAccess: (targetUid: string, email: string) => Promise<{ ok: boolean; error?: string }>;
  revokeAdminAccess: (targetUid: string) => Promise<{ ok: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const COUNTY_PATTERN = /^[a-z0-9-]+$/;

function formatAuthError(error: unknown): string {
  const code = (error as { code?: string })?.code || '';
  switch (code) {
    case 'auth/operation-not-allowed':
      return "Email/Password sign-in isn't enabled yet in Firebase Console for project 'haosail'. Enable it under Authentication -> Sign-in method -> Email/Password.";
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Switch to Sign In or reset your password.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Incorrect email or password. Please verify your credentials and try again.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters long.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/too-many-requests':
      return 'Too many attempts detected. Please wait a moment before trying again.';
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return 'Google sign-in popup was closed before completing authentication.';
    case 'auth/popup-blocked':
      return 'Your browser blocked the Google sign-in popup. Allow popups or sign in with Email & Password.';
    default:
      return error instanceof Error ? error.message : 'Unable to complete authentication.';
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authNotice, setAuthNotice] = useState<string | null>(null);
  const [accountProfile, setAccountProfile] = useState<UserAccountData | null>(null);
  const [privateInfo, setPrivateInfo] = useState<UserPrivateData | null>(null);
  const [userOrders, setUserOrders] = useState<UserOrderRecord[]>([]);
  const [allOrders, setAllOrders] = useState<UserOrderRecord[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUserRecord[]>([]);
  const [verificationTick, setVerificationTick] = useState(0);

  const isBootstrappedAdmin = Boolean(
    user?.emailVerified && (user.email || '').toLowerCase() === BOOTSTRAP_ADMIN_EMAIL
  );

  const pendingWorkshopRef = useRef<string>('');

  const ensureUserDocuments = useCallback(async (firebaseUser: User) => {
    if (!firebaseUser.emailVerified) {
      setIsAdmin(false);
      return;
    }

    const emailMatchesBootstrap =
      (firebaseUser.email || '').toLowerCase() === BOOTSTRAP_ADMIN_EMAIL;

    if (emailMatchesBootstrap) {
      setIsAdmin(true);
    } else {
      try {
        const adminSnap = await getDoc(doc(db, 'admins', firebaseUser.uid));
        setIsAdmin(adminSnap.exists());
      } catch {
        setIsAdmin(false);
      }
    }

    const userRef = doc(db, 'users', firebaseUser.uid);
    const privateRef = doc(db, 'users', firebaseUser.uid, 'private', 'info');

    try {
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        const safeDisplayName = (
          firebaseUser.displayName ||
          firebaseUser.email?.split('@')[0] ||
          'Workshop Client'
        )
          .trim()
          .slice(0, 100);
        const safePhoto = (firebaseUser.photoURL || '').trim().slice(0, 500);
        const safeWorkshop = pendingWorkshopRef.current.trim().slice(0, 120);
        pendingWorkshopRef.current = '';

        await setDoc(userRef, {
          uid: firebaseUser.uid,
          displayName: safeDisplayName || 'Workshop Client',
          ...(safePhoto ? { photoUrl: safePhoto } : {}),
          ...(safeWorkshop ? { workshopName: safeWorkshop } : {}),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${firebaseUser.uid}`);
    }

    try {
      const privSnap = await getDoc(privateRef);
      if (!privSnap.exists()) {
        const safeEmail = (firebaseUser.email || '').trim().slice(0, 120);
        await setDoc(privateRef, {
          uid: firebaseUser.uid,
          email: safeEmail,
          preferredCountyId: 'nairobi',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      handleFirestoreError(
        error,
        OperationType.WRITE,
        `users/${firebaseUser.uid}/private/info`
      );
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setIsAuthReady(true);

      if (!firebaseUser) {
        setIsAdmin(false);
        setAccountProfile(null);
        setPrivateInfo(null);
        setUserOrders([]);
        setAllOrders([]);
        setAdminUsers([]);
        return;
      }

      if (!firebaseUser.emailVerified) {
        setIsAdmin(false);
        setAccountProfile(null);
        setPrivateInfo(null);
        setUserOrders([]);
        setAllOrders([]);
        setAdminUsers([]);
        return;
      }

      try {
        await ensureUserDocuments(firebaseUser);
      } catch (err: unknown) {
        setAuthError(
          err instanceof Error
            ? 'Unable to sync workshop account with Firestore. Please retry.'
            : 'Unable to sync workshop account.'
        );
      }
    });

    return () => unsubscribe();
  }, [ensureUserDocuments]);

  // Subscribe strictly when auth is ready AND user email is verified
  useEffect(() => {
    if (!isAuthReady || !user || !user.emailVerified) return;

    const userPath = `users/${user.uid}`;
    const privatePath = `users/${user.uid}/private/info`;
    const ordersPath = `users/${user.uid}/orders`;

    const unsubProfile = onSnapshot(
      doc(db, 'users', user.uid),
      (snap) => {
        if (snap.exists()) {
          setAccountProfile(snap.data() as UserAccountData);
        }
      },
      (error) => handleFirestoreError(error, OperationType.GET, userPath)
    );

    const unsubPrivate = onSnapshot(
      doc(db, 'users', user.uid, 'private', 'info'),
      (snap) => {
        if (snap.exists()) {
          setPrivateInfo(snap.data() as UserPrivateData);
        }
      },
      (error) => handleFirestoreError(error, OperationType.GET, privatePath)
    );

    const ordersQuery = query(
      collection(db, 'users', user.uid, 'orders'),
      where('userId', '==', user.uid),
      limit(200)
    );

    const unsubOrders = onSnapshot(
      ordersQuery,
      (snapshot) => {
        const list = snapshot.docs.map((d) => d.data() as UserOrderRecord);
        list.sort((a, b) => {
          const msA = a.createdAt?.toMillis?.() ?? 0;
          const msB = b.createdAt?.toMillis?.() ?? 0;
          return msB - msA;
        });
        setUserOrders(list);
      },
      (error) => handleFirestoreError(error, OperationType.LIST, ordersPath)
    );

    let unsubAllOrders: (() => void) | undefined;
    let unsubAdmins: (() => void) | undefined;
    if ((user.email || '').toLowerCase() === BOOTSTRAP_ADMIN_EMAIL) {
      const adminOrdersQuery = query(collectionGroup(db, 'orders'), limit(500));
      unsubAllOrders = onSnapshot(
        adminOrdersQuery,
        (snapshot) => {
          const list = snapshot.docs.map((d) => d.data() as UserOrderRecord);
          list.sort((a, b) => {
            const msA = a.createdAt?.toMillis?.() ?? 0;
            const msB = b.createdAt?.toMillis?.() ?? 0;
            return msB - msA;
          });
          setAllOrders(list);
        },
        (error) => handleFirestoreError(error, OperationType.LIST, 'orders')
      );

      const adminsQuery = query(collection(db, 'admins'), limit(200));
      unsubAdmins = onSnapshot(
        adminsQuery,
        (snapshot) => {
          setAdminUsers(snapshot.docs.map((d) => d.data() as AdminUserRecord));
        },
        (error) => handleFirestoreError(error, OperationType.LIST, 'admins')
      );
    } else {
      setAllOrders([]);
      setAdminUsers([]);
    }

    return () => {
      unsubProfile();
      unsubPrivate();
      unsubOrders();
      if (unsubAllOrders) unsubAllOrders();
      if (unsubAdmins) unsubAdmins();
    };
  }, [isAuthReady, user, verificationTick]);

  const signInWithGoogle = async (): Promise<boolean> => {
    setAuthError(null);
    setAuthNotice(null);
    setIsSigningIn(true);
    try {
      await signInWithPopup(auth, googleProvider);
      return true;
    } catch (error: unknown) {
      setAuthError(formatAuthError(error));
      return false;
    } finally {
      setIsSigningIn(false);
    }
  };

  const signInWithEmail = async (email: string, password: string): Promise<boolean> => {
    setAuthError(null);
    setAuthNotice(null);
    setIsSigningIn(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      return true;
    } catch (error: unknown) {
      setAuthError(formatAuthError(error));
      return false;
    } finally {
      setIsSigningIn(false);
    }
  };

  const signUpWithEmail = async (input: {
    fullName: string;
    workshopName?: string;
    email: string;
    password: string;
  }): Promise<boolean> => {
    setAuthError(null);
    setAuthNotice(null);
    setIsSigningIn(true);
    try {
      pendingWorkshopRef.current = (input.workshopName || '').trim().slice(0, 120);
      const cred = await createUserWithEmailAndPassword(
        auth,
        input.email.trim(),
        input.password
      );
      const safeName = input.fullName.trim().slice(0, 100);
      if (safeName) {
        await updateProfile(cred.user, { displayName: safeName });
      }
      await sendEmailVerification(cred.user);
      setAuthNotice(
        `Account created. We sent a verification link to ${input.email.trim()} to activate cloud syncing.`
      );
      return true;
    } catch (error: unknown) {
      pendingWorkshopRef.current = '';
      setAuthError(formatAuthError(error));
      return false;
    } finally {
      setIsSigningIn(false);
    }
  };

  const sendPasswordReset = async (email: string): Promise<boolean> => {
    setAuthError(null);
    setAuthNotice(null);
    setIsSigningIn(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setAuthNotice(`Password reset link sent to ${email.trim()}. Check your inbox or spam folder.`);
      return true;
    } catch (error: unknown) {
      setAuthError(formatAuthError(error));
      return false;
    } finally {
      setIsSigningIn(false);
    }
  };

  const resendVerificationEmail = async (): Promise<boolean> => {
    if (!auth.currentUser) return false;
    setAuthError(null);
    setAuthNotice(null);
    setIsSigningIn(true);
    try {
      await sendEmailVerification(auth.currentUser);
      setAuthNotice(`Verification email resent to ${auth.currentUser.email}.`);
      return true;
    } catch (error: unknown) {
      setAuthError(formatAuthError(error));
      return false;
    } finally {
      setIsSigningIn(false);
    }
  };

  const refreshEmailVerification = async (): Promise<boolean> => {
    if (!auth.currentUser) return false;
    setAuthError(null);
    setAuthNotice(null);
    setIsSigningIn(true);
    try {
      await auth.currentUser.reload();
      await auth.currentUser.getIdToken(true);
      const refreshedUser = auth.currentUser;
      setUser(refreshedUser);
      if (refreshedUser.emailVerified) {
        await ensureUserDocuments(refreshedUser);
        setVerificationTick((t) => t + 1);
        setAuthNotice('Email verified! Your HaoSail workshop portal is now active.');
        return true;
      }
      setAuthError('Email is still marked as unverified. Click the link in your inbox first, then retry.');
      return false;
    } catch (error: unknown) {
      setAuthError(formatAuthError(error));
      return false;
    } finally {
      setIsSigningIn(false);
    }
  };

  const signOutUser = async () => {
    setAuthError(null);
    setAuthNotice(null);
    setIsAdmin(false);
    await signOut(auth);
  };

  const updateWorkshopDetails = async (input: {
    displayName: string;
    workshopName: string;
    phone: string;
    kraPin: string;
    address: string;
    preferredCountyId: string;
  }) => {
    if (!user || !user.emailVerified) return;
    const safeDisplayName = input.displayName.trim().slice(0, 100) || 'Workshop Client';
    const safeWorkshopName = input.workshopName.trim().slice(0, 120);
    const safePhone = input.phone.trim().slice(0, 30);
    const safeKraPin = input.kraPin.trim().toUpperCase().slice(0, 20);
    const safeAddress = input.address.trim().slice(0, 200);
    const rawCounty = input.preferredCountyId.trim().toLowerCase().slice(0, 40);
    const safeCountyId = COUNTY_PATTERN.test(rawCounty) ? rawCounty : 'nairobi';
    const safeEmail = (user.email || privateInfo?.email || '').trim().slice(0, 120);

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        displayName: safeDisplayName,
        workshopName: safeWorkshopName,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    }

    try {
      await updateDoc(doc(db, 'users', user.uid, 'private', 'info'), {
        email: safeEmail,
        phone: safePhone,
        kraPin: safeKraPin,
        address: safeAddress,
        preferredCountyId: safeCountyId,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}/private/info`);
    }
  };

  const saveOrderToAccount = async (
    order: SaveOrderInput
  ): Promise<{ ok: boolean; error?: string }> => {
    if (!user || !user.emailVerified) {
      return { ok: false, error: 'Sign in with a verified email to save orders to your account.' };
    }

    const cleanOrderId = order.orderId.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64);
    if (cleanOrderId.length < 4) {
      return { ok: false, error: 'Invalid order reference generated.' };
    }

    const safeCounty = COUNTY_PATTERN.test(order.countyId)
      ? order.countyId.slice(0, 40)
      : 'nairobi';
    const safeItemsSummary =
      order.itemsSummary.trim().slice(0, 500) || 'HaoSail Equipment Order';
    const safeCompany = (order.companyName || '').trim().slice(0, 120);
    const safeVoucher = (order.voucherCode || '').trim().slice(0, 30);
    const safeEtims = (order.etimsControlNumber || '').trim().slice(0, 64);

    const path = `users/${user.uid}/orders/${cleanOrderId}`;
    try {
      await setDoc(doc(db, 'users', user.uid, 'orders', cleanOrderId), {
        orderId: cleanOrderId,
        userId: user.uid,
        ...(safeCompany ? { companyName: safeCompany } : {}),
        countyId: safeCounty,
        deliveryMode: order.deliveryMode,
        settlementMode: order.settlementMode,
        ...(order.paymentMethod ? { paymentMethod: order.paymentMethod } : {}),
        status: 'confirmed',
        totalAmountKes: Math.max(0, Math.round(order.totalAmountKes)),
        itemCount: Math.max(1, Math.min(500, Math.round(order.itemCount))),
        itemsSummary: safeItemsSummary,
        ...(safeVoucher ? { voucherCode: safeVoucher } : {}),
        ...(safeEtims ? { etimsControlNumber: safeEtims } : {}),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return { ok: true };
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.CREATE, path);
      } catch (wrapped) {
        return {
          ok: false,
          error:
            wrapped instanceof Error
              ? 'Could not sync order to Firestore. Please check your connection and retry.'
              : 'Order sync failed.',
        };
      }
      return { ok: false, error: 'Order sync failed.' };
    }
  };

  const loadBuyerDetailsForAdmin = async (targetUserId: string) => {
    if (!user || !user.emailVerified || !isAdmin) {
      return { account: null, privateInfo: null };
    }

    let account: UserAccountData | null = null;
    let buyerPrivate: UserPrivateData | null = null;

    try {
      const accountSnap = await getDoc(doc(db, 'users', targetUserId));
      if (accountSnap.exists()) {
        account = accountSnap.data() as UserAccountData;
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `users/${targetUserId}`);
    }

    try {
      const privSnap = await getDoc(doc(db, 'users', targetUserId, 'private', 'info'));
      if (privSnap.exists()) {
        buyerPrivate = privSnap.data() as UserPrivateData;
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `users/${targetUserId}/private/info`);
    }

    return { account, privateInfo: buyerPrivate };
  };

  const adminUpdateOrderStatus = async (
    targetUserId: string,
    orderId: string,
    nextStatus: 'confirmed' | 'dispatched' | 'completed',
    notifyContext?: {
      etimsControlNumber?: string;
      countyName?: string;
      totalAmountKes?: number;
      itemsSummary?: string;
    }
  ): Promise<{ emailSent: boolean; emailReason?: string }> => {
    if (!user || !user.emailVerified || !isAdmin) {
      return { emailSent: false, emailReason: 'Admin authorization required.' };
    }
    const path = `users/${targetUserId}/orders/${orderId}`;
    try {
      await updateDoc(doc(db, 'users', targetUserId, 'orders', orderId), {
        status: nextStatus,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }

    if (nextStatus === 'dispatched' || nextStatus === 'completed') {
      try {
        const buyer = await loadBuyerDetailsForAdmin(targetUserId);
        const toEmail = (buyer.privateInfo?.email || '').trim();
        if (!toEmail) {
          return { emailSent: false, emailReason: 'No customer email on file for this order.' };
        }
        const idToken = await user.getIdToken();
        const res = await fetch('/api/notify', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${idToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: nextStatus === 'dispatched' ? 'order_dispatched' : 'order_completed',
            toEmail,
            recipientName: buyer.account?.workshopName || buyer.account?.displayName,
            orderReference: orderId,
            etimsControlNumber: notifyContext?.etimsControlNumber,
            countyName: notifyContext?.countyName,
            totalAmountKes: notifyContext?.totalAmountKes,
            itemsSummary: notifyContext?.itemsSummary,
          }),
        });
        const data = (await res.json().catch(() => ({}))) as {
          delivered?: boolean;
          reason?: string;
        };
        return {
          emailSent: Boolean(data.delivered),
          emailReason: data.reason,
        };
      } catch {
        return { emailSent: false, emailReason: 'Unable to reach notification service.' };
      }
    }

    return { emailSent: false };
  };

  const grantAdminAccess = async (
    targetUid: string,
    email: string
  ): Promise<{ ok: boolean; error?: string }> => {
    if (!user || !user.emailVerified || !isAdmin) {
      return { ok: false, error: 'Verified Admin required.' };
    }
    const cleanUid = targetUid.trim();
    const cleanEmail = email.trim().toLowerCase().slice(0, 120);
    if (!/^[a-zA-Z0-9_-]{1,128}$/.test(cleanUid)) {
      return { ok: false, error: 'Enter a valid Firebase User UID.' };
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { ok: false, error: 'Enter a valid staff email address.' };
    }
    try {
      await setDoc(doc(db, 'admins', cleanUid), {
        uid: cleanUid,
        email: cleanEmail,
        grantedBy: user.uid,
        createdAt: serverTimestamp(),
      });
      return { ok: true };
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.WRITE, `admins/${cleanUid}`);
      } catch {
        return { ok: false, error: 'Unable to grant admin permissions.' };
      }
      return { ok: false, error: 'Unable to grant admin permissions.' };
    }
  };

  const revokeAdminAccess = async (targetUid: string): Promise<{ ok: boolean; error?: string }> => {
    if (!user || !user.emailVerified || !isAdmin) {
      return { ok: false, error: 'Verified Admin required.' };
    }
    const cleanUid = targetUid.trim();
    if (!cleanUid || cleanUid === user.uid) {
      return { ok: false, error: 'Cannot revoke active root session.' };
    }
    try {
      await deleteDoc(doc(db, 'admins', cleanUid));
      return { ok: true };
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.DELETE, `admins/${cleanUid}`);
      } catch {
        return { ok: false, error: 'Unable to revoke admin access.' };
      }
      return { ok: false, error: 'Unable to revoke admin access.' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthReady,
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
        clearAuthError: () => setAuthError(null),
        clearAuthNotice: () => setAuthNotice(null),
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        sendPasswordReset,
        resendVerificationEmail,
        refreshEmailVerification,
        signOutUser,
        updateWorkshopDetails,
        saveOrderToAccount,
        adminUpdateOrderStatus,
        loadBuyerDetailsForAdmin,
        grantAdminAccess,
        revokeAdminAccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
