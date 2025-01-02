'use client';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import './Header.css';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { UserAuth } from '../../context/AuthContext';
import { ChevronDownIcon } from '@heroicons/react/16/solid';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { logout } = UserAuth();
  const router = useRouter();

  const menuRef = useRef<HTMLDivElement | null>(null);

  const pathname = usePathname();
  const [activeRoute, setActiveRoute] = useState(pathname);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const links = [
    { label: 'FormMatic' },
    { label: 'Home', route: '/home' },
    { label: 'Search Transactions', route: '/transactions' },
    { label: 'DMV Forms', route: '/dmvForms' },
    { label: 'Contact Us', route: '/contactUs' },
    {
      label: 'Account',
      dropdown: [
        { label: 'Account Settings', route: '/myAccount' },
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

  const handleSignOut = useCallback(async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  }, [logout, router]);

  return (
    <header className="headerWrapper">
      <ul className="myLinks">
        {links.map((link) => (
          <li key={link.label} className={link.label === 'FormMatic' ? 'headingLink' : 'linkLabel'}>
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
                  link.label === 'Account' &&
                  link.dropdown?.some((item) => item.route === activeRoute)
                    ? 'linkActive'
                    : link.label === 'FormMatic'
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
