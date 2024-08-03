'use client';
import React, { useContext, createContext, useState, useEffect } from 'react';
import {
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  browserSessionPersistence,

} from 'firebase/auth';
import Loading from '../app/components/ui/Loading';
import { auth } from '../app/firebase-config';
import { getSubscriptionStatus } from '@/app/api/getSubscriptionStatus/route';
import {initFirebase} from '../app/firebase-config';
const app = initFirebase();

export interface AuthContextType {
  user: User | null;
  emailSignIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthContextProvider = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const emailSignIn = async (email: string, password: string) => {
    try {
      await setPersistence(auth, browserSessionPersistence);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      
    } catch (error) {
      console.error('Error signing in with email: ', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Error signing out: ', error);
      throw error;
    }
  };

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    setLoading(true); 
    if (currentUser) {
      setUser(currentUser);
      const newSubscriptionStatus = await getSubscriptionStatus(app);
    } else {
      setUser(null); 
    }
    setLoading(false);
  });

  return () => unsubscribe(); 
}, []); 
  

  if (loading) {
    return <Loading />;
  }

  return (
    <AuthContext.Provider value={{ user, emailSignIn, logout}}>{children}</AuthContext.Provider>
  );
};

export const UserAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthContextProvider');
  }
  return context;
};
