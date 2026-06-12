import React, { useState } from 'react';
import { X, Mail, Lock, User, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import { isFirebaseAvailable } from '../lib/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Auth actions from useAuth
  signInWithGoogle: () => Promise<any>;
  signInWithEmail: (email: string, pass: string) => Promise<any>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<any>;
  onSuccess: () => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  onSuccess
}: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFirebaseAvailable) {
      setError('Login is not configured yet.');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        if (!name.trim()) {
          throw new Error('Please enter your display name.');
        }
        await signUpWithEmail(email, password, name);
      } else {
        await signInWithEmail(email, password);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    if (!isFirebaseAvailable) {
      setError('Login is not configured yet.');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      await signInWithGoogle();
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Google Sign-In failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div 
        className="relative w-full max-w-md bg-white dark:bg-[#0F1A30] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 animate-scale-in"
        id="auth-modal-dialog"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-5 h-5 text-[#006CE4]" />
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              {isSignUp ? 'Create Squad Profile' : 'Access Your Trip Plan'}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-[#1A263F] rounded-full text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isFirebaseAvailable ? (
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 p-5 rounded-2xl text-center space-y-4">
            <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
            <div>
              <h4 className="font-extrabold text-amber-800 dark:text-amber-300">Login is not configured yet.</h4>
              <p className="text-xs text-amber-700/80 dark:text-amber-400 mt-1 leading-relaxed">
                Database synchronization and real login are disabled because Firebase API secrets are missing. Running in standard guest fallback mode.
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
            >
              Continue as Guest
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {error && (
              <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-250 text-rose-800 dark:text-rose-450 p-3.5 rounded-2xl text-xs font-semibold leading-relaxed">
                {error}
              </div>
            )}

            {/* Email login form */}
            <form onSubmit={handleEmailAuth} className="space-y-4">
              {isSignUp && (
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider block">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 w-4.5 h-4.5 text-slate-400" />
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-[#1A263F] rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-150 focus:ring-2 focus:ring-sky-500"
                      placeholder="e.g. Avishek Majumder"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={isSignUp}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4.5 h-4.5 text-slate-400" />
                  <input
                    type="email"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-[#1A263F] rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-150 focus:ring-2 focus:ring-sky-500"
                    placeholder="avishek@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4.5 h-4.5 text-slate-400" />
                  <input
                    type="password"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-[#1A263F] rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-150 focus:ring-2 focus:ring-sky-500"
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#006CE4] hover:bg-[#0052BE] disabled:bg-slate-300 text-white font-bold text-sm rounded-xl tracking-wide transition shadow-sm cursor-pointer"
              >
                {loading ? 'Processing...' : isSignUp ? 'Sign Up for Cox Voyage 2026' : 'Sign In'}
              </button>
            </form>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
              <span className="flex-shrink mx-4 text-slate-400 text-[10px] font-bold uppercase tracking-wider">or sign in with</span>
              <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
            </div>

            {/* Google Sign-in */}
            <button
              onClick={handleGoogleAuth}
              disabled={loading}
              className="w-full py-2.5 bg-white dark:bg-[#1A263F] hover:bg-slate-50 dark:hover:bg-[#25365C] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2.5 transition shadow-xs cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Switch authentication behavior */}
            <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-4">
              {isSignUp ? 'Already have an account?' : "Don't have a trip profile?"}{' '}
              <button 
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-[#006CE4] font-bold hover:underline"
              >
                {isSignUp ? 'Sign In Now' : 'Create Profile'}
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
