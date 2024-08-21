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
import { doc, collection, getDocs, setDoc, deleteDoc, orderBy, limit, query, onSnapshot } from 'firebase/firestore';
import { auth, firestore } from '../firebase-config';
import { CollectionReference, DocumentData } from 'firebase/firestore';

export interface AuthContextType {
  user: User | null;
  emailSignIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthContextProvider = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(async () => {
    try {
      if (user) {
        if (!user.email) {
          throw new Error('User email is not available.');
        }

        const sessionsRef = collection(firestore, 'users', user.email, 'sessions');
        const sessionId = sessionStorage.getItem('sessionId');

        if (sessionId) {
          await deleteDoc(doc(sessionsRef, sessionId)); 
          sessionStorage.removeItem('sessionId'); 
        }
      }

      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Error signing out: ', error);
      throw error;
    }
  }, [user]);

  const emailSignIn = async (email: string, password: string) => {
    try {
      await setPersistence(auth, browserSessionPersistence);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);

      if (!userCredential.user.email) {
        throw new Error('User email is not available.');
      }

      const authTime = userCredential.user.metadata.lastSignInTime
        ? new Date(userCredential.user.metadata.lastSignInTime)
        : new Date();

      const sessionsRef = collection(firestore, 'users', userCredential.user.email, 'sessions');
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
      monitorSession(sessionsRef, sessionId);

    } catch (error) {
      console.error('Error signing in with email: ', error);
      throw error;
    }
  };

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

  const monitorSession = useCallback(
    (sessionsRef: CollectionReference<DocumentData>, sessionId: string) => {
      const sessionDocRef = doc(sessionsRef, sessionId);
      const unsubscribe = onSnapshot(sessionDocRef, (docSnapshot) => {
        if (!docSnapshot.exists()) {
          logout(); 
        }
      });

      return () => unsubscribe();
    },
    [logout]
  );

  useEffect(() => {
    const storedSessionId = sessionStorage.getItem('sessionId');

    const validateSession = async () => {
      if (storedSessionId && user && user.email) {
        const sessionsRef = collection(firestore, 'users', user.email, 'sessions');
        doc(sessionsRef, storedSessionId);
        const sessionSnapshot = await getDocs(query(sessionsRef, orderBy('timestamp', 'desc'), limit(1)));

        if (sessionSnapshot.empty || !sessionSnapshot.docs[0].exists) {
          logout();
        } else {
          monitorSession(sessionsRef, storedSessionId); 
        }
      }
    };

    validateSession();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [monitorSession, user, logout]);

  if (loading) {
    return <Loading />;
  }

  return (
    <AuthContext.Provider value={{ user, emailSignIn, logout }}>
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
