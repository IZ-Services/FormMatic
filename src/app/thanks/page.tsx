'use client';
import React, { useEffect, useState } from 'react';
import './thanks.css';
import { UserAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Loading from '../../components/pages/Loading';

export default function Thanks() {
  const { user, isSubscribed } = UserAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/');
    } else if (!isSubscribed) {
      router.push('/signUp');
    } else {
      setLoading(false);
    }
  }, [user, isSubscribed, router]);

  if (loading) {
    return <Loading />;
  }

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
