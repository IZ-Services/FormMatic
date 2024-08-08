'use client';
import React, { useEffect } from 'react';
import './Thanks.css';
import { UserAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { initFirebase } from '../../firebase-config';

const app = initFirebase();

export default function Thanks() {
  const { user } = UserAuth();
  const router = useRouter();
  
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
          const userRef = doc(db, "customers", user.uid);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (!userData.isSubscribed) {
              router.push('/signUp');
            }
          } else {
            router.push('/signUp');
          }
        }
      }
    };

    checkSubscriptionStatus();
  }, [user, router]);


  return (
    <div className="container">
      <h1 className="thanksHeading">Thank you</h1>
      <button className='returnButton' onClick={() => router.push('/home')}>Back To Home</button>
        <p>If you have any questions <Link href="/contactUs">contact us</Link></p>
    </div>
  );
}
