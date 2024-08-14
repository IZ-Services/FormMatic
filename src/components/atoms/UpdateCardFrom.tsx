'use client';
import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import './Update.css'

export default function UpdateCardForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setIsLoading(true);

    try {
      const { error, setupIntent } = await stripe.confirmSetup({
        elements,
        redirect: 'if_required', 
      });

    if (error) {
          setMessage(error.message || 'An unexpected error occurred.');
        } else if (setupIntent.status === 'succeeded') {
          setMessage('Card updated successfully!');
        }
      } catch (error) {
        console.error('Error updating payment method:', error);
        setMessage('An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

  return (
    <div className="updateCardContainer">
      <form className="updatePayment-form" onSubmit={handleSubmit}>
        <h1 className="updateCardTitle">Update Card</h1>
        <PaymentElement className="updatePayment-element" />
        <div className="updatePaymentButtonWrapper">
          <button
            className="updatePaymentButton"
          >
           Update Card
          </button>
          {message && <div className="paymentMessage">{message}</div>}
        </div>
      </form>
    </div>
  );
}