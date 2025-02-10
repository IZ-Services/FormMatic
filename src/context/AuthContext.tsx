"use client";
import React, { useContext, createContext, useState, useEffect } from 'react';
import {
  setPersistence,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  User,
  // getIdToken,
  browserLocalPersistence
} from 'firebase/auth';
import Loading from '../components/pages/Loading';
import {
  doc,
  onSnapshot,
  getFirestore,
  deleteDoc,
} from 'firebase/firestore';
import { auth, firestore, initFirebase } from '../firebase-config';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { deleteUser, getAuth } from "firebase/auth";

const app = initFirebase();

export interface AuthContextType {
  user: User | null;
  emailSignIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isSubscribed: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthContextProvider = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);
  const router = useRouter();

  const logout = async () => {
    try {
      await axios.post('/api/logout', {}, { withCredentials: true });
      await auth.signOut();
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const emailSignIn = async (email: string, password: string) => {
    try {
      await setPersistence(auth, browserLocalPersistence);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken(true);

      const response = await axios.post('/api/login', { token }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.data.success) {
        setUser(userCredential.user);
        router.push('/home');
      }
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };
  useEffect(() => {
    const checkSessionAndInitAuth = async () => {
      try {
        const sessionResponse = await axios.get('/api/checkSession', { 
          withCredentials: true 
        });
        
        if (sessionResponse.data.user) {
          if (auth.currentUser) {
            setUser(auth.currentUser);
          } else {
            if (auth.currentUser) {
              const token = await (auth.currentUser as User).getIdToken(true);
              await axios.post('/api/login', { token }, { withCredentials: true });
            }
          }
        }
        
        setSessionChecked(true);
        
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
          if (firebaseUser && !user) {
            try {
              const token = await firebaseUser.getIdToken(true);
              await axios.post('/api/login', { token }, { withCredentials: true });
              setUser(firebaseUser);
            } catch (error) {
              console.error('Error syncing session:', error);
              await logout();
            }
          } else if (!firebaseUser && user) {
            await logout();
          }
          
          setLoading(false);
        });
  
        return unsubscribe;
      } catch (error) {
        console.error('Error in auth initialization:', error);
        setUser(null);
        setLoading(false);
        return () => {};
      }
    };
  
    const unsubscribe = checkSessionAndInitAuth();
    return () => {
      unsubscribe.then(cleanup => cleanup());
    };
  }, []);
  
  

  useEffect(() => {
    if (!sessionChecked || !user?.uid) {
      return;
    }

    const creationTime = user.metadata?.creationTime;
    if (!creationTime) return;

    const userCreationDate = new Date(creationTime);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate.getTime() - userCreationDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const db = getFirestore(app);
    const userRef = doc(db, 'users', user.uid);

    if (diffDays < 7) {
      setIsSubscribed(true);
      return;
    }

    const unsubscribeSnapshot = onSnapshot(userRef, async (userDoc) => {
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        if (!userData.isSubscribed && diffDays >= 14) {
          try {
            await deleteDoc(userRef);
            const currentUser = getAuth().currentUser;
            if (currentUser) {
              await deleteUser(currentUser);
            }
          } catch (error) {
            console.error('Error deleting user:', error);
          }
          
          await logout();
          return;
        }

        setIsSubscribed(userData.isSubscribed);
        if (!userData.isSubscribed) {
          router.push('/signUp');
        }
      } else {
        setIsSubscribed(false);
        router.push('/signUp');
      }
    });

    return () => unsubscribeSnapshot();
  }, [user, sessionChecked, router]);

  if (loading) {
    return <Loading />;
  }

  return (
    <AuthContext.Provider value={{ user, emailSignIn, isSubscribed, logout, loading }}>
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