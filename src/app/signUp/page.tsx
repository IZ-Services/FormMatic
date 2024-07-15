'use client';
import React, { useState, useEffect } from 'react';
import { PencilSquareIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import './signup.css';
import { UserAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { getCheckoutUrl } from '../api/checkout/route';
import {initFirebase} from '../firebase-config';
import { getSubscriptionStatus } from '../api/getSubscriptionStatus/route';

const app = initFirebase();

export default function SignUp() {
  const { user, setIsSubscribed } = UserAuth();
  const router = useRouter();

  const [editCard, setEditCard] = useState(false);
  const [cardVisible, setCardVisible] = useState(false);
  const [currentCard, setCurrentCard] = useState('');
  const [newCard, setNewCard] = useState('');
  const [confirmCard, setConfirmCard] = useState('');
  const [errorAlertMessage, setErrorAlertMessage] = useState<string>('');
  const [successfulAlertMessage, setSuccessfulAlertMessage] = useState<string>('');

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
    const checkSubscription = async () => {
      const newSubscriptionStatus = user 
        ? await getSubscriptionStatus(app)
        : false;
        setIsSubscribed(newSubscriptionStatus);
    };
    checkSubscription();
  }, [user, router, setIsSubscribed]);



  const handleEditPasswordClick = () => {
    setEditCard(!editCard);
    setCardVisible(false);
    setErrorAlertMessage('');
    setSuccessfulAlertMessage('');
  };

  const togglePasswordVisibility = () => {
    setCardVisible(!cardVisible);
  };

  const handleSavenewCard = async () => {
    if (newCard !== confirmCard) {
      setErrorAlertMessage('Card info do not match.');
      setSuccessfulAlertMessage('');
      resetAlertMessages();
      return;
    }

    const priceID = 'price_1PZja22MeJbZrBb1WqRwBP4U';
    const checkoutUrl = await getCheckoutUrl(app, priceID);
    router.push(checkoutUrl);
    
    resetAlertMessages();
  };

  const resetAlertMessages = () => {
    setTimeout(() => {
      setErrorAlertMessage('');
      setSuccessfulAlertMessage('');
    }, 3000);
  };

  return (
    <div className="signUpContainer">
      <div className="signUpContentWrapper">
        <h1 className="signUpTitle">Sign Up</h1>
        <div className="signUpAlertContainer">
          {successfulAlertMessage && (
            <div className="successfulSignUpMessage">{successfulAlertMessage}</div>
          )}
          {errorAlertMessage && <div className="alertSignUpMessage">{errorAlertMessage}</div>}
        </div>
        <div>
          <input className="signUpUsernameInput" type="text" value={user?.email || ''} readOnly />

          <div className="signUpInputWithEditIcon">
            <input
              className="signUpCardInput"
              type="password"
              placeholder="Card Number"
              value="********"
              readOnly
            />
            <PencilSquareIcon className="editSignUpIcon" onClick={handleEditPasswordClick} />
          </div>
          {editCard && (
            <div style={{ marginTop: '50px' }}>
              <div className="signUpInputWithEyeIcon">
                <input
                  className="newSignUpCardInput"
                  type={cardVisible ? 'text' : 'password'}
                  placeholder="Current Card"
                  value={currentCard}
                  autoComplete="off"
                  onChange={(e) => setCurrentCard(e.target.value)}
                />
                {cardVisible ? (
                  <EyeIcon className="signUpEyeIcon" onClick={togglePasswordVisibility} />
                ) : (
                  <EyeSlashIcon className="signUpEyeIcon" onClick={togglePasswordVisibility} />
                )}
              </div>

              <input
                className="newSignUpCardInput"
                type={cardVisible ? 'text' : 'password'}
                placeholder="New Card"
                value={newCard}
                autoComplete="new-card"
                onChange={(e) => setNewCard(e.target.value)}
                style={{ marginTop: '20px' }}
              />

              <input
                className="newSignUpCardInput"
                type={cardVisible ? 'text' : 'password'}
                placeholder="Confirm New Card"
                value={confirmCard}
                autoComplete="new-card"
                onChange={(e) => setConfirmCard(e.target.value)}
                style={{ marginTop: '20px' }}
              />

              <div className="signUpButtonContainer" style={{ marginTop: '20px' }}>
                <button className="saveSignUpButton" onClick={handleSavenewCard}>
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
