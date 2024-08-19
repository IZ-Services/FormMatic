'use client';
import React, { useEffect, useRef, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../../components/atoms/CheckoutForm';
import { getStripePublishableKey } from '../../utils/stripeUtil';
import { UserAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { initFirebase } from '../../firebase-config';
import Loading from '../../components/pages/Loading';
import './SignUp.css';

const publishableKey = getStripePublishableKey();
const stripePromise = loadStripe(publishableKey);

const app = initFirebase();

export default function SignUp() {
  const { user } = UserAuth();
  const [clientSecret, setClientSecret] = useState(null);
  const router = useRouter();
  const hasFetchedClientSecret = useRef(false);
  const [isSubscribed, setIsSubscribed] = useState<boolean | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      if (!user) {
        setIsSubscribed(null); 
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
        if(user.email){
          const userRef = doc(db, "users", user.email);  
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setIsSubscribed(userData.isSubscribed);
            if (userData.isSubscribed) {
              router.push('/home');
            }
          } else {
            setIsSubscribed(false);
          }
        }

        } else {
          setIsSubscribed(false);
        }
      } else {
        setIsSubscribed(false);
      }
    };

    checkSubscriptionStatus();
  }, [user, router]);

  useEffect(() => {
    const fetchClientSecret = async () => {
      if (hasFetchedClientSecret.current || isSubscribed === null) return;
      if (isSubscribed) return;

      hasFetchedClientSecret.current = true;

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

    fetchClientSecret();

    const timeoutId = setTimeout(() => {
      if (!clientSecret) {
        setError(true);
      }
    }, 20000); 

    return () => clearTimeout(timeoutId);
  }, [user, isSubscribed, clientSecret]);


  if (error && !clientSecret) {
    return <div className='signUpClientError'>Error: Failed to load payment details. Please contact us for assistance.</div>;
  }

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
