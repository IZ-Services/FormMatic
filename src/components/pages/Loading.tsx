'use client';
import React from 'react';
import './Loading.css';
import {RingLoader} from 'react-spinners';

export default function Loading() {
  return (
   <div className='spinner'>
    <RingLoader
      color='black'
      speedMultiplier={1}
    />
   </div>
  );
}
