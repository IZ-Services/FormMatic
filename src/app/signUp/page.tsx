'use client';
import React, { useEffect, useRef, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../../components/atoms/CheckoutForm';
import { getStripePublishableKey } from '../../utils/stripeUtil';
import { UserAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Loading from '../../components/pages/Loading';
import './signup.css';

const publishableKey = getStripePublishableKey();
const stripePromise = loadStripe(publishableKey);

export default function SignUp() {
  const { user, isSubscribed, loading: authLoading } = UserAuth();
  const [pageLoading, setPageLoading] = useState(true);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const router = useRouter();
  const hasFetchedClientSecret = useRef(false);
  const redirectInProgressRef = useRef(false);
  const mountedRef = useRef(false);

 
  useEffect(() => {
    mountedRef.current = true;
    console.log('SignUp component mounted, authLoading:', authLoading);
    
    return () => {
      mountedRef.current = false;
    };
  }, []);

 
  useEffect(() => {
    if (authLoading) {
      console.log('Auth still loading, waiting...');
      return;
    }
    
    console.log('Auth loaded, user:', !!user, 'isSubscribed:', isSubscribed);
    
    if (!user && !redirectInProgressRef.current && mountedRef.current) {
      redirectInProgressRef.current = true;
      console.log('No user, redirecting to home');
      router.push('/');
      return;
    } 
    
    if (isSubscribed === true && !redirectInProgressRef.current && mountedRef.current) {
      redirectInProgressRef.current = true;
      console.log('User is subscribed, redirecting to home');
      router.push('/home');
      return;
    }
    
    if (isSubscribed === false && mountedRef.current) {
      console.log('User not subscribed, showing signup page');
      setPageLoading(false);
    }
  }, [user, isSubscribed, router, authLoading]);

 
  useEffect(() => {
    const fetchClientSecret = async () => {
      if (hasFetchedClientSecret.current || !user || clientSecret || isSubscribed || authLoading) return;

      hasFetchedClientSecret.current = true;

      const storedClientSecret = sessionStorage.getItem('clientSecret');
      const storedCustomerId = sessionStorage.getItem('customerId');

      if (storedClientSecret && storedCustomerId) {
        setClientSecret(storedClientSecret);
        setCustomerId(storedCustomerId);
        return;
      }

      try {
        const response = await fetch('/api/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            priceId: 'price_1PZja22MeJbZrBb1WqRwBP4U',
            userId: user?.uid,
            email: user?.email,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch client secret');
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);
        setCustomerId(data.customerId);

        sessionStorage.setItem('clientSecret', data.clientSecret);
        sessionStorage.setItem('customerId', data.customerId);
      } catch (error) {
        console.error('Error fetching client secret:', error);
        setError(true);
      }
    };

    fetchClientSecret();

    const timeoutId = setTimeout(() => {
      if (!clientSecret) {
        setError(true);
      }
    }, 20000);

    return () => clearTimeout(timeoutId);
  }, [user, clientSecret, isSubscribed, authLoading]);

 
  if (authLoading || pageLoading) {
    console.log('Showing Loading component from SignUp');
    return <Loading />;
  }

  if (error && !clientSecret) {
    return (
      <div className="signUpClientError">
        Error: Failed to load payment details. Please contact us for assistance.
      </div>
    );
  }

  if (!clientSecret) {
    return <Loading />;
  }

  return (
    <>
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        {customerId ? <CheckoutForm customerId={customerId} /> : <Loading />}
      </Elements>
    </>
  );
}