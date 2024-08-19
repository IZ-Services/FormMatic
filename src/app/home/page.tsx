'use client';
import React from 'react';
import { useEffect } from 'react';
import './Home.css';
import { UserAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useScenarioContext } from '../../context/ScenarioContext';
import SimpleTransfer from '../../components/molecules/SimpleTransfer';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { initFirebase } from '../../firebase-config';
import { useAppContext } from '../../context/index';

const app = initFirebase();


export default function Home() {
  const { formData } = useAppContext()!;
  const { selectedSubsection } = useScenarioContext()!;
  const { user } = UserAuth();
  const router = useRouter();

  const user_email = user?.email;


useEffect(() => {
    const checkSubscriptionStatus = async () => {
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

        if (diffDays > 7) {
          const db = getFirestore(app);
          if (user.email) {
            const userRef = doc(db, "users", user.email);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
              const userData = userDoc.data();
              if (!userData.isSubscribed) {
                router.push('/signUp');
              }
            } else {
              router.push('/signUp');
            }
          } else {
            console.error('User email is not available.');
            router.push('/signUp');
          }
        }
      }
    };


    checkSubscriptionStatus();
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
