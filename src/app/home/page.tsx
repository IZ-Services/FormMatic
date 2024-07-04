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
  const { user } = UserAuth();

  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

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
