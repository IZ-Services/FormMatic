'use client';
import React, { useState, useEffect } from 'react';
import './home.css';
import { UserAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useScenarioContext } from '../../context/ScenarioContext';
import SimpleTransfer from '../../components/molecules/SimpleTransfer';
import Loading from '../../components/pages/Loading';

const getCookie = (name: string): string | null => {
  if (typeof window === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

export default function Home() {
  const { selectedSubsection } = useScenarioContext()!;
  const { user, isSubscribed, logout } = UserAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let channel: BroadcastChannel | null = null;

    if (typeof window !== 'undefined') {
      channel = new BroadcastChannel('session_management');
      
      const handleSessionMessages = async (event: MessageEvent) => {
        if (event.data.type === 'SESSION_INVALIDATED') {
          const currentSessionId = getCookie('sessionId');
          if (event.data.sessionId === currentSessionId) {
            console.log('Session has been invalidated');
            if (logout) {
              await logout();
              router.push('/');
            }
          }
        }
      };

      channel.onmessage = handleSessionMessages;
    }

    return () => {
      if (channel) {
        channel.close();
      }
    };
  }, [logout, router]);

  useEffect(() => {
    if (!user) {
      router.push('/');
    } else if (!isSubscribed) {
      router.push('/signUp');
    } else {
      setLoading(false);
    }
  }, [user, isSubscribed, router]);

  if (loading) {
    return <Loading />;
  }

  const renderComponent = () => {
    switch (selectedSubsection) {
      case 'Simple Transfer':
        return <SimpleTransfer />;
      default:
        return (
          <p className="scenarioSelect">
            Welcome. Please select a transaction from the sidebar.
          </p>
        );
    }
  };

  return (
    <div className="homeContainer">
      {selectedSubsection && <h2 className="homeHeading">{selectedSubsection}</h2>}
      {renderComponent()}
    </div>
  );
}