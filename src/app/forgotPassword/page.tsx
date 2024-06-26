'use client';
import React, { useEffect, useState } from 'react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { app } from '../firebase-config';
import './forgotPassword.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState({ text: '', type: 'success' });

  useEffect(() => {
    if (message.text !== '') {
      const timer = setTimeout(() => {
        setMessage({ text: '', type: 'success' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);


  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const auth = getAuth(app);

    sendPasswordResetEmail(auth, email)
      .then(() => {
        setMessage({ text: 'Check your email for the password reset link.', type: 'success' });
      })
      .catch((error) => {
        setMessage({
          text: 'Failed to send password reset email. Ensure the email is correct.',
          type: 'error',
        });
        console.error('Error sending password reset email:', error);
      });
  };

  return (
    <div className="center-container">
      <div>
        <h1 className="login-CompanyName">FormMatic</h1>
        <p className="login-companySlogan">From Data to Documents in Seconds.</p>
        <h2 className="forgotPasswordTitle">Forgot Password?</h2>

        <input
          className="resetInput"
          type="text"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></input>

       <div className={`errorForgot ${message.text ? 'visible' : ''}`}>
          <p className={message.type === 'error' ? 'text-error' : 'text-success'}>
            {message.text}
          </p>
        </div>


        <button className="submitButton" onClick={handleSubmit}>
          Submit
        </button>

        <div className="forgot-password-container">
          <a href="/" className="forgot-password-link">
            Return to Sign In
          </a>
        </div>
      </div>
    </div>
  );
}
