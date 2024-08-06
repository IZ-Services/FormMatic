'use client';
import React, { useEffect, useState, useRef } from 'react';
import './Header.css';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { UserAuth } from '../../../context/AuthContext';
import { ChevronDownIcon } from '@heroicons/react/16/solid';
import { useRouter } from 'next/navigation';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { initFirebase } from '../../firebase-config';

const app = initFirebase();

export default function Header() {
  const { user, logout } = UserAuth();
  const router = useRouter();

    useEffect(() => {
    const checkSubscriptionStatus = async () => {
      if (!user) {
        router.push('/');
        return;
      }

      const creationTime = user.metadata?.creationTime;
      if (creationTime) {
        const userCreationDate = new Date(creationTime);
        const currentDate = new Date();
        const diffTime = Math.abs(currentDate.getTime() - userCreationDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > 7) {
          const db = getFirestore(app);
          const userRef = doc(db, "customers", user.uid);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (!userData.isSubscribed) {
              router.push('/signUp');
            }
          } else {
            router.push('/signUp');
          }
        }
      }
    };

    checkSubscriptionStatus();
  }, [user, router]);

  const menuRef = useRef<HTMLDivElement | null>(null);

  const pathname = usePathname();
  const [activeRoute, setActiveRoute] = useState(pathname);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const links = [
    { label: 'Formatic' },
    { label: 'Home', route: '/home' },
    { label: 'Search Transactions', route: '/transactions' },
    { label: 'DMV Forms', route: '/dmvForms' },
    { label: 'Contact Us', route: '/contactUs' },
    {
      label: 'Account',
      dropdown: [
        { label: 'Account Settings', route: '/account' },
        { label: 'Payment Settings', route: '/payment' },
      ],
    },
    { label: 'Logout', route: '/' },
  ];

  useEffect(() => {
    setActiveRoute(pathname);
  }, [pathname]);

  const handleDropdownToggle = () => {
    setIsDropdownVisible((prev) => !prev);
  };

  const handleDropdownItemClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownVisible(false);
  };

  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as Element;
    if (
      menuRef.current &&
      !menuRef.current.contains(target) &&
      !target.closest('.dropdownContainer')
    ) {
      setIsDropdownVisible(false);
    }
  };

  const handleLinkClick = () => {
      setIsDropdownVisible(false);
  };

  useEffect(() => {
    if (isDropdownVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownVisible]);

  const handleSignOut = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <header className="headerWrapper">
      <ul className="myLinks">
        {links.map((link) => (
          <li key={link.label} className={link.label === 'Formatic' ? 'headingLink' : 'linkLabel'}>
            {link.route ? (
              <Link
                href={link.route}
                className={activeRoute === link.route ? 'linkActive' : 'linkRoute'}
                onClick={link.label === 'Logout' ? handleSignOut : () => setActiveRoute(link.route)}
              >
                {link.label}
              </Link>
            ) : (
              <span 
                className={`dropdownContainer ${
                  link.label === 'Account' && link.dropdown?.some(item => item.route === activeRoute)
                    ? 'linkActive'
                    : link.label === 'Formatic'
                    ? 'headingLink'
                    : 'linkRoute'
                }`}                
                onClick={link.label === 'Account' ? handleDropdownToggle : handleLinkClick}
              >
                {link.label}
                {link.dropdown && (
                  <ChevronDownIcon className={`chevronIcon ${isDropdownVisible ? 'rotate' : ''}`} />
                )}
              </span>
            )}
            {link.dropdown && isDropdownVisible && (
              <div className="dropdownMenu" ref={menuRef}>
                <ul className="dropdownMenuList">
                  {link.dropdown.map((item) => (
                    <li key={item.label} onClick={handleDropdownItemClick}>
                      <Link
                        href={item.route}
                        onClick={() => setActiveRoute(item.route)}
                        className={activeRoute === item.route ? 'activeDropdownLink' : 'linkRoute'}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </header>
  );
}
