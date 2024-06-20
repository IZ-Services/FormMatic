'use client';
import React, { useState } from 'react';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import '../globals.css';

export default function Account() {
  const [accountSettingsClicked, setAccountSettingsClicked] = useState(false)
  const [paymentSettingsClicked, setPaymentSettingsClicked] = useState(false)

  const handleAccountSettingsClick = () => {
    setAccountSettingsClicked(true);
    setPaymentSettingsClicked(false);
  }

  const handlePaymemtSettingsClick = () => {
    setPaymentSettingsClicked(true);
    setAccountSettingsClicked(false);
  }

  return (
    <div className="center-container">
      <div>
        <h1 className="login-SignIn">Account</h1>
          <button className="accountButtonsAccountSettings">Account Settings</button>
          <button className="accountButtonsPaymentSettings">Payment Settings</button>

          <div style={{marginTop: "75px"}}>
          <input
            className="usernameInput"
            type="text"
            placeholder="Company"
          ></input>
          
          <input
            className="usernameInput"
            type="text"
            placeholder="Email"
          ></input>

          <div className="input-container-forIcon">
            <input
              className="passwordInput"
              type="text"
              placeholder="Password"
            />
            <button className="toggle-password">
              <PencilSquareIcon className="input-icon" />
            </button>
          </div>
          
          </div>
      </div>
    </div>
  );
}
