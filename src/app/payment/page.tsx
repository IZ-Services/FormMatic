'use client';
import React, { useState, useEffect } from 'react';
import { PencilSquareIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import './Payment.css';
import { UserAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { initFirebase } from '../../firebase-config';

const app = initFirebase();

export default function Payment() {
  const { user } = UserAuth();
  const router = useRouter();

  const [editCard, setEditCard] = useState(false);
  const [cardVisible, setCardVisible] = useState(false);
  const [currentCard, setCurrentCard] = useState('');
  const [newCard, setNewCard] = useState('');
  const [confirmCard, setConfirmCard] = useState('');
  const [errorAlertMessage, setErrorAlertMessage] = useState<string>('');
  const [successfulAlertMessage, setSuccessfulAlertMessage] = useState<string>('');

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
    resetAlertMessages();
  };

  const resetAlertMessages = () => {
    setTimeout(() => {
      setErrorAlertMessage('');
      setSuccessfulAlertMessage('');
    }, 3000);
  };

  return (
    <div className="paymentContainer">
      <div className="paymentContentWrapper">
        <h1 className="paymentTitle">Payment Settings</h1>
        <div className="paymentAlertContainer">
          {successfulAlertMessage && (
            <div className="successfulPaymenttMessage">{successfulAlertMessage}</div>
          )}
          {errorAlertMessage && <div className="alertPaymentMessage">{errorAlertMessage}</div>}
        </div>
        <div>
          <input className="paymentUsernameInput" type="text" value={user?.email || ''} readOnly />

          <div className="paymentInputWithEditIcon">
            <input
              className="paymentCardInput"
              type="password"
              placeholder="Card Number"
              value="********"
              readOnly
            />
            <PencilSquareIcon className="editPaymentIcon" onClick={handleEditPasswordClick} />
          </div>
          {editCard && (
            <div style={{ marginTop: '50px' }}>
              <div className="paymentInputWithEyeIcon">
                <input
                  className="newCardInput"
                  type={cardVisible ? 'text' : 'password'}
                  placeholder="Current Card"
                  value={currentCard}
                  autoComplete="off"
                  onChange={(e) => setCurrentCard(e.target.value)}
                />
                {cardVisible ? (
                  <EyeIcon className="paymentEyeIcon" onClick={togglePasswordVisibility} />
                ) : (
                  <EyeSlashIcon className="paymentEyeIcon" onClick={togglePasswordVisibility} />
                )}
              </div>

              <input
                className="newCardInput"
                type={cardVisible ? 'text' : 'password'}
                placeholder="New Card"
                value={newCard}
                autoComplete="new-card"
                onChange={(e) => setNewCard(e.target.value)}
                style={{ marginTop: '20px' }}
              />

              <input
                className="newCardInput"
                type={cardVisible ? 'text' : 'password'}
                placeholder="Confirm New Card"
                value={confirmCard}
                autoComplete="new-card"
                onChange={(e) => setConfirmCard(e.target.value)}
                style={{ marginTop: '20px' }}
              />

              <div className="paymentButtonContainer" style={{ marginTop: '20px' }}>
                <button className="savePaymentButton" onClick={handleSavenewCard}>
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
