'use client';
import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../components/ui/CheckoutForm';
import { getStripePublishableKey } from '../../utils/stripeUtil';
import { UserAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { initFirebase } from '../firebase-config';
import Loading from '../components/ui/Loading';

const publishableKey =  getStripePublishableKey();
const stripePromise = loadStripe(publishableKey);

const app = initFirebase();

export default function SignUp() {
  const { user } = UserAuth();
	const [clientSecret, setClientSecret] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const response = await fetch('/api/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ priceId: 'price_1PZja22MeJbZrBb1WqRwBP4U', userId: user?.uid, email: user?.email }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch client secret');
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error('Error fetching client secret:', error);
      }
    };

    if (user) {
      fetchClientSecret();
    }
  }, [user]);

  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      if (!user) {
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
            if (userData.isSubscribed) {
              router.push('/home');
            }
          }
        }
      }
    };

    checkSubscriptionStatus();
  }, [user, router]);
  


  if (!clientSecret) {
    return <Loading />;
  }

  return (
    <>
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <CheckoutForm />
      </Elements>
  </>
  );


}

