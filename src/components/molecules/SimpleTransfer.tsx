'use client';
import React from 'react';
// import { useState } from 'react';
import './Simpletransfer.css';
import '../atoms/NewRegisteredOwner';
import NewRegisteredOwner from '../atoms/NewRegisteredOwner';
// import { useAppContext } from '../../../context/index';
// import Link from 'next/link';
// import { IClient } from '@/models/clientSchema';

export default function SimpleTransfer() {
  // const { formData, setFormData, setTransactions } = useAppContext()!;

  // const [addSecondRegisteredOwner, setAddSecondRegisteredOwner] = useState(false);
  // const [addThirdRegisteredOwner, setAddThirdRegisteredOwner] = useState(false);
  // const [searchFor, setSearchFor] = useState('');

  // const handleClickAddSecondRegisteredOwner = () => {
  //   setAddSecondRegisteredOwner(true);
  // };

  // const handleClickAddThirdRegisteredOwner = () => {
  //   setAddThirdRegisteredOwner(true);
  // };

  // const handleClickRemoveSecondRegisteredOwner = () => {
  //   setAddSecondRegisteredOwner(false);
  // };

  // const handleClickRemoveThirdRegisteredOwner = () => {
  //   setAddThirdRegisteredOwner(false);
  // };


  return (
    <NewRegisteredOwner />
  );
}
