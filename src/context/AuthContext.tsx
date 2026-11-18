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
  doc,
  getDoc,
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
  status: 'confirmed' | 'dispatched' | 'completed';
  totalAmountKes: number;
  itemCount: number;
  itemsSummary: string;
  voucherCode?: string;
  createdAt?: Timestamp;
}

interface AuthContextValue {
  user: User | null;
  isAuthReady: boolean;
  isSigningIn: boolean;
  isAdmin: boolean;
  authError: string | null;
  authNotice: string | null;
  accountProfile: UserAccountData | null;
  privateInfo: UserPrivateData | null;
  userOrders: UserOrderRecord[];
  allOrders: UserOrderRecord[];
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
  saveOrderToAccount: (order: {
    orderId: string;
    companyName?: string;
    countyId: string;
    deliveryMode: 'direct-site' | 'depot-pickup';
    settlementMode: 'full' | 'lipa-pole-pole';
    totalAmountKes: number;
    itemCount: number;
    itemsSummary: string;
    voucherCode?: string;
  }) => Promise<void>;
  adminUpdateOrderStatus: (
    targetUserId: string,
    orderId: string,
    nextStatus: 'confirmed' | 'dispatched' | 'completed'
  ) => Promise<void>;
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
  const [verificationTick, setVerificationTick] = useState(0);

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
        return;
      }

      if (!firebaseUser.emailVerified) {
        setIsAdmin(false);
        setAccountProfile(null);
        setPrivateInfo(null);
        setUserOrders([]);
        setAllOrders([]);
        return;
      }

      await ensureUserDocuments(firebaseUser);
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
      where('userId', '==', user.uid)
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
    if ((user.email || '').toLowerCase() === BOOTSTRAP_ADMIN_EMAIL) {
      const adminOrdersQuery = query(collectionGroup(db, 'orders'));
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
    } else {
      setAllOrders([]);
    }

    return () => {
      unsubProfile();
      unsubPrivate();
      unsubOrders();
      if (unsubAllOrders) unsubAllOrders();
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

  const saveOrderToAccount = async (order: {
    orderId: string;
    companyName?: string;
    countyId: string;
    deliveryMode: 'direct-site' | 'depot-pickup';
    settlementMode: 'full' | 'lipa-pole-pole';
    totalAmountKes: number;
    itemCount: number;
    itemsSummary: string;
    voucherCode?: string;
  }) => {
    if (!user || !user.emailVerified) return;

    const cleanOrderId = order.orderId.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64);
    if (cleanOrderId.length < 4) return;

    const safeCounty = COUNTY_PATTERN.test(order.countyId)
      ? order.countyId.slice(0, 40)
      : 'nairobi';
    const safeItemsSummary =
      order.itemsSummary.trim().slice(0, 500) || 'HaoSail Equipment Order';
    const safeCompany = (order.companyName || '').trim().slice(0, 120);
    const safeVoucher = (order.voucherCode || '').trim().slice(0, 30);

    const path = `users/${user.uid}/orders/${cleanOrderId}`;
    try {
      await setDoc(doc(db, 'users', user.uid, 'orders', cleanOrderId), {
        orderId: cleanOrderId,
        userId: user.uid,
        ...(safeCompany ? { companyName: safeCompany } : {}),
        countyId: safeCounty,
        deliveryMode: order.deliveryMode,
        settlementMode: order.settlementMode,
        status: 'confirmed',
        totalAmountKes: Math.max(0, Math.round(order.totalAmountKes)),
        itemCount: Math.max(1, Math.min(500, Math.round(order.itemCount))),
        itemsSummary: safeItemsSummary,
        ...(safeVoucher ? { voucherCode: safeVoucher } : {}),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const adminUpdateOrderStatus = async (
    targetUserId: string,
    orderId: string,
    nextStatus: 'confirmed' | 'dispatched' | 'completed'
  ) => {
    if (!user || !user.emailVerified || !isAdmin) return;
    const path = `users/${targetUserId}/orders/${orderId}`;
    try {
      await updateDoc(doc(db, 'users', targetUserId, 'orders', orderId), {
        status: nextStatus,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthReady,
        isSigningIn,
        isAdmin,
        authError,
        authNotice,
        accountProfile,
        privateInfo,
        userOrders,
        allOrders,
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
