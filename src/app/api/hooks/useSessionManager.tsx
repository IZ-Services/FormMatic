import { useEffect } from 'react';
import { UserAuth } from '../../../context/AuthContext';
import { getCookie } from '@/utils/cookie';

export const useSessionManager = () => {
  const { logout } = UserAuth();
  
  useEffect(() => {
    const channel = new BroadcastChannel('session_management');
    const currentSessionId = getCookie('sessionId');

    const handleSessionMessage = async (event: MessageEvent) => {
      if (
        event.data.type === 'SESSION_INVALIDATED' && 
        event.data.sessionId === currentSessionId
      ) {
        await logout();
        channel.close();
      }
    };

    channel.addEventListener('message', handleSessionMessage);
    
    return () => {
      channel.removeEventListener('message', handleSessionMessage);
      channel.close();
    };
  }, [logout]);
};