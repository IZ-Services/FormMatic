'use client';
import React, { useState } from 'react';
import { useEffect } from 'react';
import './Home.css';
import { UserAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useScenarioContext } from '../../context/ScenarioContext';
import SimpleTransfer from '../../components/molecules/SimpleTransfer';
import { useAppContext } from '../../context/index';
import  Loading  from '../../components/pages/Loading';

export default function Home() {
  const { formData } = useAppContext()!;
  const { selectedSubsection } = useScenarioContext()!;
  const { user, isSubscribed } = UserAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true); 

  const user_email = user?.email;

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
          <p className="scenarioSelect"> Welcome. Please select a transaction from the sidebar.</p>
        );
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, user_email }),
      });
      await response.json();
      alert('Client Saved!');
    } catch (error) {
      console.error('Error in handleSave:', error);
    }
  };

  // const handleNext = async () => {
  //   try {
  //     // const response = await fetch('/api/pdfLoader', {
  //     //   method: 'POST',
  //     //   headers: {
  //     //     'Content-Type': 'application/json',
  //     //   },
  //     //  body: JSON.stringify(formData),
  //     // });
  //     // const data = await response.json();
  //     // setPdfData(data.pdfData);
  //   } catch (error) {
  //     console.error('Error navigating to the PDF page:', error);
  //   }
  // };

  return (
    <div className="homeContainer">
      {selectedSubsection && <h2 className="homeHeading">{selectedSubsection}</h2>}
      {renderComponent()}
      <button onClick={handleSave}>save</button>
    </div>
  );
}
