import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, Settings, Award, Compass, Sparkles, Check, Phone, MapPin, DollarSign, FileText, AlertCircle, RefreshCw } from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';
import { saveUserProfile, loadUserProfile, UserProfile } from '../services/userTripService';

interface ProfileMenuProps {
  user: FirebaseUser;
  signOutUser: () => Promise<void>;
  onSaveProfileSuccess?: (profile: UserProfile) => void;
}

export default function ProfileMenu({ user, signOutUser, onSaveProfileSuccess }: ProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    displayName: user.displayName || 'Traveler',
    email: user.email || '',
    phoneNumber: '',
    homeCity: 'Dhaka',
    tripRole: 'organizer',
    preferredCurrency: 'BDT',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'failed'>('idle');
  
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch / load user profile from Firestore on mount/open
  useEffect(() => {
    if (showProfileModal && user.uid) {
      setLoading(true);
      loadUserProfile(user.uid)
        .then((data) => {
          if (data) {
            setProfile({
              displayName: data.displayName || user.displayName || 'Traveler',
              email: data.email || user.email || '',
              phoneNumber: data.phoneNumber || '',
              homeCity: data.homeCity || 'Dhaka',
              tripRole: data.tripRole || 'organizer',
              preferredCurrency: data.preferredCurrency || 'BDT',
              notes: data.notes || '',
            });
          }
        })
        .catch((err) => console.error('Error fetching profile from DB:', err))
        .finally(() => setLoading(false));
    }
  }, [showProfileModal, user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user.uid) return;
    setStatus('saving');

    try {
      await saveUserProfile(user.uid, profile);
      setStatus('saved');
      if (onSaveProfileSuccess) {
        onSaveProfileSuccess(profile);
      }
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      console.error(err);
      setStatus('failed');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  const getInitials = () => {
    const name = profile.displayName || user.displayName || user.email || 'G';
    return name.slice(0, 2).toUpperCase();
  };

  const isGoogleUser = user.providerData.some((p) => p.providerId === 'google.com');

  return (
    <div className="relative inline-block text-left" ref={menuRef} id="user-profile-menu">
      {/* Top Navbar Menu Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-sky-50 dark:bg-[#1A263F] border border-slate-200 dark:border-slate-700 hover:bg-sky-100/70 dark:hover:bg-[#25365C] transition rounded-full cursor-pointer shadow-xxs focus:outline-hidden"
      >
        <div className="w-7 h-7 rounded-full bg-[#006CE4] text-white flex items-center justify-center text-xs font-black ring-2 ring-sky-300">
          {user.photoURL ? (
            <img src={user.photoURL} alt="Avatar" className="w-full h-full rounded-full object-cover pointer-events-none" referrerPolicy="no-referrer" />
          ) : (
            getInitials()
          )}
        </div>
        <div className="hidden sm:block text-left max-w-[100px] truncate pr-1">
          <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block truncate leading-tight">
            {profile.displayName.split(' ')[0]}
          </span>
          <span className="text-[9px] text-[#006CE4] dark:text-sky-400 font-mono tracking-wide uppercase font-bold leading-none block">
            {profile.tripRole}
          </span>
        </div>
      </button>

      {/* Dropdown Menu Overlay */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-64 origin-top-right rounded-2xl bg-white dark:bg-[#0F1A30] border border-slate-205 dark:border-slate-800 shadow-xl overflow-hidden z-40 animate-fade-in-down">
          <div className="px-4.5 py-4 bg-slate-50 dark:bg-[#1A263F]/50 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-700 dark:text-slate-200 text-xs font-black block truncate leading-tight">
              {profile.displayName}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-400 block truncate mt-0.5">
              {user.email}
            </span>
          </div>

          <div className="p-1.5 space-y-0.5">
            <button
              onClick={() => {
                setIsOpen(false);
                setShowProfileModal(true);
              }}
              className="w-full text-left px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-[#1A263F] rounded-xl text-xs font-bold text-[#006CE4] dark:text-sky-300 flex items-center gap-2.5 transition"
            >
              <Settings className="w-4 h-4 stroke-[2.5]" />
              <span>My Profile Settings</span>
            </button>

            <a
              href="#trip-summary"
              onClick={() => setIsOpen(false)}
              className="w-full text-left px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-[#1A263F] rounded-xl text-xs font-bold text-slate-705 dark:text-slate-300 flex items-center gap-2.5 transition"
            >
              <Compass className="w-4 h-4 text-emerald-500" />
              <span>Saved Trip Plans</span>
            </a>

            <a
              href="#shortlist-board"
              onClick={() => {
                setIsOpen(false);
              }}
              className="w-full text-left px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-[#1A263F] rounded-xl text-xs font-bold text-slate-705 dark:text-slate-300 flex items-center gap-2.5 transition"
            >
              <Award className="w-4 h-4 text-amber-500" />
              <span>Favorite Hotels List</span>
            </a>

            <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>

            <button
              onClick={async () => {
                setIsOpen(false);
                await signOutUser();
              }}
              className="w-full text-left px-3.5 py-2 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-450 flex items-center gap-2.5 transition"
            >
              <LogOut className="w-4 h-4 text-rose-500" />
              <span>Sign Out Plan</span>
            </button>
          </div>
        </div>
      )}

      {/* User Profile Editor Page Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div 
            className="w-full max-w-lg bg-white dark:bg-[#0F1A30] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 overflow-y-auto max-h-[90vh] animate-scale-in"
            id="profile-settings-dialog"
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-150 dark:border-slate-800 mb-6">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  My Squad Profile Settings
                </h3>
              </div>
              <button
                onClick={() => setShowProfileModal(false)}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-[#1A263F] rounded-full text-slate-400 hover:text-slate-600 transition"
              >
                ✕
              </button>
            </div>

            {loading ? (
              <div className="text-center py-10 space-y-3">
                <RefreshCw className="w-8 h-8 text-[#006CE4] animate-spin mx-auto" />
                <p className="text-xs text-slate-400 font-mono">Loading cloud metadata...</p>
              </div>
            ) : (
              <form onSubmit={handleSaveProfile} className="space-y-5">
                
                {status === 'saved' && (
                  <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250 text-emerald-800 dark:text-emerald-400 p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 leading-none">
                    <Check className="w-4 h-4 text-emerald-600 stroke-[3.5]" />
                    <span>Saved profile settings to cloud successfully!</span>
                  </div>
                )}

                {status === 'failed' && (
                  <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-250 text-rose-800 dark:text-rose-450 p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 leading-none">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    <span>Failed to save profile. Please verify connection credentials.</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Display Name */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Display Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#1A263F] rounded-xl border border-slate-250 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-150 focus:ring-2 focus:ring-sky-500"
                      value={profile.displayName}
                      onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                      required
                    />
                  </div>

                  {/* Email (Readonly representation as requested) */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block flex items-center gap-1">
                      <span>Email Address</span>
                      {isGoogleUser && <span className="bg-sky-50 dark:bg-[#006CE4]/10 text-sky-600 text-[8px] font-extrabold uppercase px-1 rounded-sm leading-none">Google Verified</span>}
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-2.5 bg-slate-100 dark:bg-[#0F1A30]/50 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500 cursor-not-allowed"
                      value={profile.email}
                      readOnly
                      title="Your registered email address cannot be edited."
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Phone Number (Optional)</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="tel"
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-[#1A263F] rounded-xl border border-slate-250 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-150 focus:ring-2 focus:ring-sky-500"
                        placeholder="+880 1700-000000"
                        value={profile.phoneNumber}
                        onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Home City */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Home City (Optional)</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-[#1A263F] rounded-xl border border-slate-250 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-150 focus:ring-2 focus:ring-sky-500"
                        placeholder="e.g. Dhaka, comilla"
                        value={profile.homeCity}
                        onChange={(e) => setProfile({ ...profile, homeCity: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Preferred Currency */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Preferred Currency</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <select
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-[#1A263F] rounded-xl border border-slate-250 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-150 focus:ring-2 focus:ring-sky-500"
                        value={profile.preferredCurrency}
                        onChange={(e) => setProfile({ ...profile, preferredCurrency: e.target.value as 'BDT' | 'USD' })}
                      >
                        <option value="BDT">BDT (Bangladeshi Taka • ৳)</option>
                        <option value="USD">USD (US Dollar • $)</option>
                      </select>
                    </div>
                  </div>

                  {/* Trip Role */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Trip Team Role</label>
                    <select
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#1A263F] rounded-xl border border-slate-250 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-150 focus:ring-2 focus:ring-sky-500"
                      value={profile.tripRole}
                      onChange={(e) => setProfile({ ...profile, tripRole: e.target.value })}
                    >
                      <option value="organizer">👑 Squad Organizer (Bill split manager)</option>
                      <option value="member">👥 Active Traveler (Rider)</option>
                      <option value="advisor">🧠 Planning Advisor</option>
                    </select>
                  </div>
                </div>

                {/* Additional Squad Notes */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Additional Trip Notes</label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                    <textarea
                      rows={3}
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-[#1A263F] rounded-xl border border-slate-250 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-150 focus:ring-2 focus:ring-sky-500"
                      placeholder="e.g. Needs breakfast included at all venues, prefers beach view rooms..."
                      value={profile.notes}
                      onChange={(e) => setProfile({ ...profile, notes: e.target.value })}
                    />
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowProfileModal(false)}
                    className="px-5 py-2.5 border border-slate-205 dark:border-slate-700 text-slate-650 dark:text-slate-350 text-xs font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-[#1A263F] transition cursor-pointer"
                  >
                    Close Settings
                    </button>
                  <button
                    type="submit"
                    disabled={status === 'saving'}
                    className="px-5 py-2.5 bg-[#006CE4] hover:bg-[#0052BE] disabled:bg-slate-300 text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5"
                  >
                    {status === 'saving' ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>Save Profile Settings</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
