'use client';
import React from 'react';
import './Loading.css';
import { ClipLoader } from 'react-spinners';

export default function Loading() {
  return (
    <div className="spinner">
      <ClipLoader color="black" speedMultiplier={1} />
    </div>
  );
}
