import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db, isFirebaseAvailable } from '../lib/firebase';
import { GroupSize, Member } from '../types';

export interface UserTripPlan {
  groupSize: GroupSize;
  members: Member[];
  selectedHotelId: string;
  shortlistedIds: string[];
  compareHotelIds: string[];
  oneWayBusFare: number;
  currency: 'BDT' | 'USD';
  packingItems?: any[];
  customTimeline?: any[];
  recentSearches?: any[];
  ticketAssignments?: Record<string, string>;
  memberSplits?: any[];
  bookingDocumentsMetadata?: {
    title: string;
    type: string;
    fileId: string;
    viewUrl: string;
    embedUrl: string;
    status: string;
  }[];
  lastUpdated: string;
}

export interface UserProfile {
  displayName: string;
  email: string;
  phoneNumber?: string;
  homeCity?: string;
  tripRole?: string; // organizer, member, etc.
  preferredCurrency?: 'BDT' | 'USD';
  notes?: string;
  lastUpdated?: string;
}

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export function isOfflineError(err: any): boolean {
  if (!err) return false;
  const msg = err instanceof Error ? err.message : String(err);
  const code = err.code || '';
  return (
    msg.includes('offline') ||
    msg.includes('client is offline') ||
    code === 'unavailable' ||
    code === 'failed-precondition'
  );
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path
  };
  if (isOfflineError(error)) {
    console.warn('Firestore Error (Offline): ', JSON.stringify(errInfo));
  } else {
    console.error('Firestore Error: ', JSON.stringify(errInfo));
  }
  throw new Error(JSON.stringify(errInfo));
}

export async function saveUserTripPlan(uid: string, plan: Partial<UserTripPlan>): Promise<void> {
  if (!isFirebaseAvailable || !db) return;
  const path = `users/${uid}/tripPlans/cox-voyage-2026`;
  try {
    const docRef = doc(db, 'users', uid, 'tripPlans', 'cox-voyage-2026');
    await setDoc(docRef, {
      ...plan,
      lastUpdated: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    if (isOfflineError(err)) {
      console.warn("Firestore is offline. Auto-saving plan to local cache/offline queue.");
      return;
    }
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function loadUserTripPlan(uid: string): Promise<UserTripPlan | null> {
  if (!isFirebaseAvailable || !db) return null;
  const path = `users/${uid}/tripPlans/cox-voyage-2026`;
  try {
    const docRef = doc(db, 'users', uid, 'tripPlans', 'cox-voyage-2026');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserTripPlan;
    }
    return null;
  } catch (err) {
    if (isOfflineError(err)) {
      console.warn("Firestore is offline. Restoring from cached local plan.");
      return null;
    }
    handleFirestoreError(err, OperationType.GET, path);
    return null;
  }
}

export async function saveUserProfile(uid: string, profile: UserProfile): Promise<void> {
  if (!isFirebaseAvailable || !db) return;
  const path = `users/${uid}/profile/main`;
  try {
    const docRef = doc(db, 'users', uid, 'profile', 'main');
    await setDoc(docRef, {
      ...profile,
      lastUpdated: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    if (isOfflineError(err)) {
      console.warn("Firestore is offline. Saving profile to local cache.");
      return;
    }
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function loadUserProfile(uid: string): Promise<UserProfile | null> {
  if (!isFirebaseAvailable || !db) return null;
  const path = `users/${uid}/profile/main`;
  try {
    const docRef = doc(db, 'users', uid, 'profile', 'main');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  } catch (err) {
    if (isOfflineError(err)) {
      console.warn("Firestore is offline. Profile loading from cache.");
      return null;
    }
    handleFirestoreError(err, OperationType.GET, path);
    return null;
  }
}
