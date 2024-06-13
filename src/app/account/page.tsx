'use client';
import React from 'react';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import '../globals.css';

export default function Account() {
  return (
    <div>
      <h1>Account</h1>
      <div className="accountInputWrapper">
        <div>
          <button className="accountButtons">Account Settings</button>
          <button className="accountButtons">Payment Settings</button>
        </div>
        <input type="text" placeholder="Company" />
        <input type="text" placeholder="Email Address" />
        <div className="inputWithIcon">
          <input type="password" placeholder="Password" />
          <PencilSquareIcon className="icon" />
        </div>
        <input type="text" placeholder="Confirm Password" />
        <button>Save</button>
      </div>
    </div>
  );
}
