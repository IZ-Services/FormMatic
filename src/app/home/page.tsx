'use client';
import React, { useState } from 'react';
import { useEffect } from 'react';
import './home.css';
import { UserAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useScenarioContext } from '../../context/ScenarioContext';
import SimpleTransfer from '../../components/molecules/SimpleTransfer';
import Loading from '../../components/pages/Loading';
import TransactionsContainer from '@/components/atoms/TransactionsContainer';

export default function Home() {
  const { selectedSubsection } = useScenarioContext()!;
  const { user, isSubscribed } = UserAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);


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
      case 'Transfer':
        return <SimpleTransfer />;
      default:
        return (
          <div>
         <SimpleTransfer />;
            <TransactionsContainer />
          </div>
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