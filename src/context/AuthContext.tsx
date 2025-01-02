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
  deleteDoc,
  onSnapshot,
  getFirestore,
} from 'firebase/firestore';
import { auth, firestore, initFirebase, functions } from '../firebase-config';
import { useRouter } from 'next/navigation';
import { httpsCallable } from "firebase/functions";


const manageUserSessions = httpsCallable(functions, 'manageUserSessions');
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
  const [signInComplete, setSignInComplete] = useState<boolean>(false);

  const router = useRouter();

  const logout = useCallback(async () => {
    if (!user || !user.uid) {
      console.log('No user found, returning from logout');
      return;
    }

    try {
      console.log('Attempting to log out user:', user.uid);
      const sessionId = sessionStorage.getItem('sessionId');

      if (sessionId) {
        const sessionsRef = collection(firestore, 'users', user.uid, 'sessions');
        await deleteDoc(doc(sessionsRef, sessionId));
        console.log('Session deleted:', sessionId);
        sessionStorage.removeItem('sessionId');

      }

      sessionStorage.removeItem('clientSecret');
      sessionStorage.removeItem('customerId');
      sessionStorage.removeItem('paymentClientSecret');

      await signOut(auth);
      console.log('Successfully signed out user:', user.uid);

      setUser(null);
      setIsSubscribed(false);
      setSignInComplete(false);
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  }, [user]);


  const emailSignIn = async (email: string, password: string) => {
    try {
      console.log('Starting email sign-in for:', email);
      await setPersistence(auth, browserSessionPersistence);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Sign-in successful for:', userCredential.user.email);
        
      const response = await manageUserSessions();
    
      const sessionId = (response.data as { sessionId: string }).sessionId;
      sessionStorage.setItem('sessionId', sessionId);

      console.log('Session created with ID:', sessionId);
    
      setSignInComplete(true);  
    } catch (error) {
      console.error('Error signing in with email: ', error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      console.log('Auth state changed, current user:', currentUser);
      if (currentUser) {
        setUser(currentUser);
        console.log('User set in state:', currentUser.uid);
      } 
      else {
        await logout();
        router.push('/');
        console.log('No user found, redirecting to home');
        setLoading(false);
        return;
      }
    });
    return () => {
      unsubscribeAuth();
    };
  }, [logout, router, user]);

  useEffect(() => {
    const sessionId = sessionStorage.getItem('sessionId');

    if (!signInComplete || !user?.uid || !sessionId) {
      return;
    }

      const sessionRef = doc(firestore, 'users', user.uid, 'sessions', sessionId);
    
      const unsubscribeSnapshot = onSnapshot(sessionRef, (docSnapshot) => {
        console.log('Session snapshot updated:', docSnapshot.exists());
        if (!docSnapshot.exists()) {
          console.log('Session no longer exists, logging out');
          logout();
        }
      });

        
    return () => {
      unsubscribeSnapshot(); 
    };
  
  }, [logout, signInComplete, user]);

  useEffect(()=>{
    if(!user){
      setLoading(false);
      return;
    }
    const creationTime = user.metadata?.creationTime;

    if (!creationTime) {
      setLoading(false);
      return;
    }

    const userCreationDate = new Date(creationTime);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate.getTime() - userCreationDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const db = getFirestore(app);
    const userRef = doc(db, 'users', user.uid);

    if (diffDays < 7) {
      setIsSubscribed(true);
      setLoading(false);
      return;
    }

    const unsubscribeSnapshot = onSnapshot(userRef, (userDoc) => {
      console.log('User document snapshot:', userDoc.exists());

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const subscribed = userData.isSubscribed;
        console.log('User isSubscribed field:', subscribed);

        if (!subscribed) {
          router.push('/signUp');
          setLoading(false);
          return;
        }
        setIsSubscribed(subscribed);
      } 
      else {
        setIsSubscribed(false);
        router.push('/signUp');
      }
      setLoading(false);
    });


    return () => {
      unsubscribeSnapshot();
    };
  },[router, user]);

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
