import React, { useState, useEffect } from 'react';
import {
  X,
  LogOut,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  MailCheck,
  RefreshCw,
  ArrowLeft,
  Lock,
  Check,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PortalTab, UserAdminPortal } from './UserAdminPortal';

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
    authError,
    authNotice,
    clearAuthError,
    clearAuthNotice,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    sendPasswordReset,
    resendVerificationEmail,
    refreshEmailVerification,
    signOutUser,
  } = useAuth();

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
  const [portalInitialTab, setPortalInitialTab] = useState<PortalTab | undefined>(undefined);

  useEffect(() => {
    if (!isOpen) return;
    if (user && user.emailVerified && isAdmin && attemptedAdminLogin) {
      setPortalInitialTab('admin-overview');
    }
  }, [isOpen, user, isAdmin, attemptedAdminLogin]);

  useEffect(() => {
    if (!isOpen || (user && user.emailVerified)) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, user, onClose]);

  if (!isOpen) return null;

  // Signed-in & verified users open directly into the Full-Page User / Admin Portal
  if (user && user.emailVerified) {
    return (
      <UserAdminPortal
        initialTab={portalInitialTab || (isAdmin ? 'admin-overview' : 'profile')}
        attemptedAdminLogin={attemptedAdminLogin}
        onClose={onClose}
      />
    );
  }

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
    setPortalInitialTab(isStaffTab ? 'admin-overview' : 'profile');
    await signInWithEmail(loginEmail, loginPassword);
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
    setPortalInitialTab('profile');
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

  const activeError = localError || authError;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden print:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0D0F12]/72 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Focused Sign-In / Verification Dialog */}
      <div className="relative z-10 w-full max-w-lg max-h-[92vh] overflow-hidden rounded-lg border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E] text-[#111315] dark:text-[#F3F4F6] shadow-2xl my-auto flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E2E4E8] dark:border-[#262A33] bg-[#F6F6F4] dark:bg-[#111318] px-6 py-4 shrink-0">
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
                : 'Verify Email Address'}
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
          <div className="p-6 space-y-5 overflow-y-auto overscroll-contain">
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
                        {showPassword ? (
                          <EyeOff className="h-3.5 w-3.5" />
                        ) : (
                          <Eye className="h-3.5 w-3.5" />
                        )}
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
                    <span className="font-semibold block mb-0.5">Administrator Console Access</span>
                    Sign in with your verified administrator email (e.g.{' '}
                    <span className="font-mono">johndoe@gmail.com</span>) to open the full-page Operations, Inventory &amp; Dispatch console.
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
                    placeholder={authMode === 'admin' ? 'johndoe@gmail.com' : 'you@workshop.co.ke'}
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
                      {showPassword ? (
                        <EyeOff className="h-3.5 w-3.5" />
                      ) : (
                        <Eye className="h-3.5 w-3.5" />
                      )}
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
                      ? 'Sign In to Admin Console'
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
                    setPortalInitialTab(isStaffTab ? 'admin-overview' : 'profile');
                    await signInWithGoogle();
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
        ) : (
          /* Signed-in Email/Password Account Pending Email Verification */
          <div className="p-6 space-y-4 text-xs">
            <div className="flex items-start gap-3 rounded-md border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/30 p-4">
              <MailCheck className="h-5 w-5 text-[#004B97] dark:text-sky-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-sm text-[#111315] dark:text-white">
                  Confirm your email to open your full portal
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
        )}
      </div>
    </div>
  );
};
