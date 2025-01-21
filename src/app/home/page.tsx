'use client';
import React, { useState, useEffect } from 'react';
import './Home.css';
import { UserAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useScenarioContext } from '../../context/ScenarioContext';
import SimpleTransfer from '../../components/molecules/SimpleTransfer';
import { useAppContext } from '../../context/index';
import Loading from '../../components/pages/Loading';

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
      case 'Simple Transfer Without Title':
        return <SimpleTransfer />;
      default:
        return (
          <div className="defaultContainer">
            <div className="centeredContent">
              <img src="/logo/newimg.png" alt="Logo" className="centeredLogo" />
              <p className="scenarioSelect">From Data to Documents in Seconds.</p>
              <div className="box-3">
                <div
                  className="btn btn-three"
                  onClick={() => router.push('/selectTransaction')}
                >
                  <span>Make a Transaction</span>
                </div>
              </div>
            </div>
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
