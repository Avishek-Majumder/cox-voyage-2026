import { useState, useEffect } from 'react';
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth, isFirebaseAvailable } from '../lib/firebase';

let cachedGoogleAccessToken: string | null = null;

export function getGoogleAccessToken(): string | null {
  return cachedGoogleAccessToken;
}

export function setGoogleAccessToken(token: string | null) {
  cachedGoogleAccessToken = token;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  isFirebaseAvailable: boolean;
  googleAccessToken: string | null;
  signInWithGoogle: () => Promise<User | null>;
  signInWithEmail: (email: string, pass: string) => Promise<User | null>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<User | null>;
  signOutUser: () => Promise<void>;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [googleAccessToken, setGoogleAccessTokenState] = useState<string | null>(cachedGoogleAccessToken);

  useEffect(() => {
    if (!isFirebaseAvailable || !auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        cachedGoogleAccessToken = null;
        setGoogleAccessTokenState(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async (): Promise<User | null> => {
    if (!isFirebaseAvailable || !auth) {
      throw new Error('Firebase is not configured yet.');
    }
    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/drive.file');
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (credential?.accessToken) {
      cachedGoogleAccessToken = credential.accessToken;
      setGoogleAccessTokenState(credential.accessToken);
    }
    return result.user;
  };

  const signInWithEmail = async (email: string, pass: string): Promise<User | null> => {
    if (!isFirebaseAvailable || !auth) {
      throw new Error('Firebase is not configured yet.');
    }
    const result = await signInWithEmailAndPassword(auth, email, pass);
    return result.user;
  };

  const signUpWithEmail = async (email: string, pass: string, name: string): Promise<User | null> => {
    if (!isFirebaseAvailable || !auth) {
      throw new Error('Firebase is not configured yet.');
    }
    const result = await createUserWithEmailAndPassword(auth, email, pass);
    if (result.user) {
      await updateProfile(result.user, { displayName: name });
    }
    return result.user;
  };

  const signOutUser = async (): Promise<void> => {
    if (!isFirebaseAvailable || !auth) return;
    await signOut(auth);
  };

  return {
    user,
    loading,
    isFirebaseAvailable,
    googleAccessToken,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOutUser,
  };
}
