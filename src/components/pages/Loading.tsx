'use client';
import React from 'react';
import './Loading.css';
import { FadeLoader } from 'react-spinners';

export default function Loading() {
  return (
    <div className="spinner">
      <FadeLoader color="black" speedMultiplier={1} />
    </div>
  );
}
