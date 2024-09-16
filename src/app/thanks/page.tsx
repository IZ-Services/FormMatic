'use client';
import React, { useEffect } from 'react';
import './Thanks.css';
import { UserAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Thanks() {
  const { user, isSubscribed } = UserAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/');
    } else if (!isSubscribed) {
      router.push('/signUp');
    }
  }, [user, isSubscribed, router]);

  return (
    <div className="container">
      <h1 className="thanksHeading">Thank you</h1>
      <button className="returnButton" onClick={() => router.push('/home')}>
        Back To Home
      </button>
      <p>
        If you have any questions <Link href="/contactUs">contact us</Link>
      </p>
    </div>
  );
}
