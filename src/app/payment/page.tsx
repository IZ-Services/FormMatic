'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import UpdateCardForm from '../../components/atoms/UpdateCardFrom';
import { getStripePublishableKey } from '../../utils/stripeUtil';
import { UserAuth } from '../../context/AuthContext';
import Loading from '../../components/pages/Loading';
import { useRouter } from 'next/navigation';
import './Payment.css';

const publishableKey = getStripePublishableKey();
const stripePromise = loadStripe(publishableKey);

export default function Payment() {
  const { user, isSubscribed, emailSignIn } = UserAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [errorAlertMessage, setErrorAlertMessage] = useState<string>('');
  const [editCard, setEditCard] = useState(false);
  const [error, setError] = useState(false);
  const hasFetchedClientSecret = useRef(false);

  useEffect(() => {
    if (!user) {
      router.push('/');
    } else if (!isSubscribed) {
      router.push('/signUp');
    } else {
      setLoading(false);

      const fetchClientSecret = async () => {
        if (hasFetchedClientSecret.current || clientSecret) return;
        hasFetchedClientSecret.current = true;
        
        const storedClientSecret = sessionStorage.getItem('paymentClientSecret');

        if (storedClientSecret) {
          setClientSecret(storedClientSecret);
          return;
        }

        try {
          const response = await fetch('/api/paymentUpdate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: user?.uid, email: user?.email }),
          });

          if (!response.ok) {
            const data = await response.json();
            if (data.error === 'No active subscription found for this customer') {
              setErrorAlertMessage(
                'You can update your payment details after your free trial has expired.',
              );
              setError(true);
              return;
            }
            throw new Error('Failed to fetch client secret');
          }

          const data = await response.json();
          setClientSecret(data.clientSecret);
          sessionStorage.setItem('paymentClientSecret', data.clientSecret);
        } catch (error) {
          console.error('Error fetching client secret:', error);
          setErrorAlertMessage('Failed to load payment details. Please contact us for assistance.');
          setError(true);
        }
      };

      if (user) {
        fetchClientSecret();
        const timeoutId = setTimeout(() => {
          if (!clientSecret) {
            setError(true);
          }
        }, 20000);
        return () => clearTimeout(timeoutId);
      }
    }
  }, [user, isSubscribed, router, clientSecret]);

  if (loading) {
    return <Loading />;
  }

  if (error && !clientSecret) {
    return <div className="paymentClientError">{errorAlertMessage}</div>;
  }

  if (!clientSecret) {
    return <Loading />;
  }

  const handleEditPasswordClick = async () => {
    try {
      if (user?.email && emailSignIn) {
        await emailSignIn(user.email, password);
        setEditCard(!editCard);
        setErrorAlertMessage('');
      } else {
        console.error('Email is undefined or null.');
      }
    } catch (error) {
      console.error('Error signing in: ', error);
      setErrorAlertMessage('Failed to sign in. Please check your credentials.');
    }
  };

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <div className="paymentContainer">
        {!editCard && (
          <>
            <h1 className="paymentTitle">Payment Settings</h1>
            <div className="paymentAlertContainer">
              {errorAlertMessage && <div className="alertPaymentMessage">{errorAlertMessage}</div>}
            </div>
            <div>
              <input
                className="paymentUsernameInput"
                type="text"
                value={user?.email || ''}
                readOnly
              />
              <div className="paymentInputWithEditIcon">
                <input
                  className="paymentCardInput"
                  type="password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button className="paymentUpdateButton" onClick={handleEditPasswordClick}>
                  Enter
                </button>
              </div>
            </div>
          </>
        )}
        {editCard && (
          <div className="updateCardFormWrapper">
            <UpdateCardForm />
          </div>
        )}
      </div>
    </Elements>
  );
}
