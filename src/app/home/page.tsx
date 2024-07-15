'use client';
import React from 'react';
import { useEffect } from 'react';
import './home.css';
import { UserAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useScenarioContext } from '../../context/ScenarioContext';
import SimpleTransfer from '../components/ui/SimpleTransfer';

export default function Home() {
  const { selectedSubsection } = useScenarioContext()!;
  const { user, isSubscribed } = UserAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }

    const creationTime = user.metadata?.creationTime;
    if (creationTime) {
      const userCreationDate = new Date(creationTime);
      const currentDate = new Date();
      const diffTime = Math.abs(currentDate.getTime() - userCreationDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 7 && !isSubscribed) {
        router.push('/signUp'); 
      }
    }
  }, [user, router, isSubscribed]);

  const renderComponent = () => {
    switch (selectedSubsection) {
      case 'Simple Transfer':
        return <SimpleTransfer />;
      default:
        return (
          <p className="scenarioSelect"> Welcome. Please select a transaction from the sidebar.</p>
        );
    }
  };

  return (
    <>
      <div className="homeContainer">{renderComponent()}</div>
    </>
  );
}
