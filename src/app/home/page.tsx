'use client';
import React, { useState } from 'react';
import { useEffect } from 'react';
import './home.css';
import { UserAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useScenarioContext } from '../../context/ScenarioContext';
import SimpleTransfer from '../../components/molecules/SimpleTransfer';
import Loading from '../../components/pages/Loading';
import TransactionsContainer from '@/components/layouts/TransactionsContainer';
import MultipleTransfer from '../../components/molecules/MultipleTransfer';

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
            <SimpleTransfer />
            {/* <p className='Welcome'> Please select a transaction from the side. You can mix and match multiple options to fit your needs.</p> */}
          </div>
        );
    }
  };


  return (
    <div className="homeContainer">
      <div className="componentWrapper">
        {renderComponent()}
      </div>
      <TransactionsContainer />
    </div>
  );
}