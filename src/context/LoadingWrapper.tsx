'use client';
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { UserAuth } from '../context/AuthContext';
import Loading from '../components/pages/Loading';

 
export const LoadingWrapper = ({ children }: { children: React.ReactNode }) => {
  const { loading } = UserAuth();
  const [initialLoad, setInitialLoad] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
 
    const timer = setTimeout(() => {
      setInitialLoad(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

 
  useEffect(() => {
    setInitialLoad(true);
    
    const timer = setTimeout(() => {
      setInitialLoad(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [pathname]);

 
  if (initialLoad || loading) {
    console.log('Showing Loading from LoadingWrapper');
    return <Loading />;
  }

  return <>{children}</>;
};

export default LoadingWrapper;