'use client';
import React, { useContext, createContext, useState, useEffect, useCallback } from 'react';
import {
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  browserSessionPersistence,
} from 'firebase/auth';
import Loading from '../components/pages/Loading';
import {
  doc,
  collection,
  getDocs,
  setDoc,
  deleteDoc,
  orderBy,
  limit,
  query,
  onSnapshot,
  getFirestore,
} from 'firebase/firestore';
import { auth, firestore } from '../firebase-config';
import { CollectionReference, DocumentData } from 'firebase/firestore';
import { initFirebase } from '../firebase-config';
import { useRouter } from 'next/navigation';

const app = initFirebase();
export interface AuthContextType {
  user: User | null;
  emailSignIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isSubscribed: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthContextProvider = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [unsubscribeSnapshot, setUnsubscribeSnapshot] = useState<(() => void) | null>(null);

  const router = useRouter();

  const logout = useCallback(async () => {
    if (!user || !user.uid) {
      return;
    }

    try {
      const sessionId = sessionStorage.getItem('sessionId');

      if (sessionId) {
        const sessionsRef = collection(firestore, 'users', user.uid, 'sessions');
        await deleteDoc(doc(sessionsRef, sessionId));
        sessionStorage.removeItem('sessionId');
      }

      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
      }

      await signOut(auth);
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  }, [unsubscribeSnapshot, user]);

  const removeOldestSession = async (sessionsRef: CollectionReference<DocumentData>) => {
    const sessionsQuery = query(sessionsRef, orderBy('authTime', 'asc'), limit(1));
    const querySnapshot = await getDocs(sessionsQuery);

    if (!querySnapshot.empty) {
      const oldestSession = querySnapshot.docs[0];
      await deleteDoc(oldestSession.ref);
    }
  };

  const generateDeviceId = () => {
    return Math.random().toString(36).substring(2);
  };

  const emailSignIn = async (email: string, password: string) => {
    try {
      await setPersistence(auth, browserSessionPersistence);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      if (!userCredential.user.email) {
        throw new Error('User email is not available.');
      }

      const authTime = userCredential.user.metadata.lastSignInTime
        ? new Date(userCredential.user.metadata.lastSignInTime)
        : new Date();

      const sessionsRef = collection(firestore, 'users', userCredential.user.uid, 'sessions');
      const sessionsSnapshot = await getDocs(sessionsRef);

      if (sessionsSnapshot.size >= 2) {
        await removeOldestSession(sessionsRef);
      }

      const sessionId = generateDeviceId();

      await setDoc(doc(sessionsRef, sessionId), {
        deviceId: sessionId,
        authTime,
        timestamp: new Date(),
      });

      sessionStorage.setItem('sessionId', sessionId);
    } catch (error) {
      console.error('Error signing in with email: ', error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        const creationTime = currentUser.metadata?.creationTime;

        if (!creationTime) {
          setLoading(false);
          return;
        }

        const userCreationDate = new Date(creationTime);
        const currentDate = new Date();
        const diffTime = Math.abs(currentDate.getTime() - userCreationDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        const db = getFirestore(app);
        const userRef = doc(db, 'users', currentUser.uid);

        if (diffDays < 7) {
          setIsSubscribed(true);
          setLoading(false);
          return;
        }

        const unsubscribeSnapshot = onSnapshot(userRef, (userDoc) => {
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setIsSubscribed(userData.isSubscribed ?? false);

            if (!userData.isSubscribed) {
              router.push('/signUp');
              setLoading(false);
              return;
            }
          }
          setLoading(false);
        });

        setUnsubscribeSnapshot(() => unsubscribeSnapshot);

        return () => {
          unsubscribeSnapshot();
        };
      } else {
        setUser(null);
        setIsSubscribed(false);
        setLoading(false);
        router.push('/');
        return;
      }
    });
    return () => {
      unsubscribeAuth();
    };
  }, [router]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const sessionId = sessionStorage.getItem('sessionId');

    if (user && sessionId) {
      const sessionsRef = collection(firestore, 'users', user.uid, 'sessions');
      const sessionDocRef = doc(sessionsRef, sessionId);

      const unsubscribe = onSnapshot(
        sessionDocRef,
        (docSnapshot) => {
          if (!docSnapshot.exists()) {
            logout();
          }
        },
        (error) => {
          console.error('Error in session document listener:', error);
        },
      );
      return () => {
        unsubscribe();
      };
    }
  }, [user, logout]);

  if (loading) {
    return <Loading />;
  }

  return (
    <AuthContext.Provider value={{ user, emailSignIn, isSubscribed, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthContextProvider');
  }
  return context;
};
