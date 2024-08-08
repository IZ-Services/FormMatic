'use client';
import React, { useState, useEffect } from 'react';
import { UserAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import {PaymentElement,useStripe, useElements} from '@stripe/react-stripe-js';
import { initFirebase } from '../../firebase-config';
import {  PaymentIntentResult } from '@stripe/stripe-js';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import "./Checkout.css";
import updateSubscriptionStatus from '../../utils/subscriptionUtil';

const app = initFirebase();

export default function CheckoutForm() {
  const { user } = UserAuth();
  const router = useRouter();
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) {
          return;
        }
        setIsLoading(true);

    const result = await stripe.confirmPayment({
      elements,
      redirect: 'if_required', 
    }) as PaymentIntentResult;

  if (result.error) {
        setMessage(result.error.message || 'An unexpected error occurred.');
      } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
        try {
          await updateSubscriptionStatus(app, true);
          setMessage('Payment successful!');
          router.push('/thanks');
        } catch (error) {
          setMessage('Failed to update subscription status.');
          console.error(error);
        }
      } else {
        setMessage('Payment processing.');
      }

      setIsLoading(false);
    };

  return (
    <div className="checkoutContainer">
      <form className="payment-form" onSubmit={handleSubmit}>
        <h1 className='checkoutTitle' >Sign Up</h1>
        <PaymentElement className="payment-element" />
        <div className='buttonWrapper'>
        <button className="subscribeButton" disabled={isLoading || !stripe || !elements} id="submit">
          {isLoading ? <div className="spinner" id="spinner"></div> : "Subscribe"}
        </button>
        {message && <div id="payment-message">{message}</div>}
        </div>
      </form>
    </div>

  );
}
