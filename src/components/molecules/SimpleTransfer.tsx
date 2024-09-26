'use client';
import React from 'react';
import './Simpletransfer.css';
import Address from '../atoms/Address';
import NewRegisteredOwners from '../atoms/NewRegisteredOwner';

export default function SimpleTransfer() {
  return (
    <div className="simpleTransferWrapper">
      <NewRegisteredOwners />
      <Address />
    </div>
  );
}
