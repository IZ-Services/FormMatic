import React, { useEffect } from 'react';
import { UserAuth } from '../context/AuthContext';
import { getCookie } from '@/utils/cookie';

export const SessionManager: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { logout } = UserAuth();
  
  useEffect(() => {
    const channel = new BroadcastChannel('session_management');
    const currentSessionId = getCookie('sessionId');
    
    console.log('SessionManager initialized with sessionId:', currentSessionId);

    const handleSessionMessage = async (event: MessageEvent) => {
      console.log('Received session message:', event.data);
      
      if (
        event.data.type === 'SESSION_INVALIDATED' && 
        event.data.sessionId === currentSessionId
      ) {
        console.log('Session invalidated, logging out:', currentSessionId);
        await logout();
        channel.close();
        
        window.location.href = '/';
      }
    };

    channel.addEventListener('message', handleSessionMessage);
    
    const handleBeforeUnload = () => {
      channel.close();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      channel.removeEventListener('message', handleSessionMessage);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      channel.close();
    };
  }, [logout]);

  return <>{children}</>;
};