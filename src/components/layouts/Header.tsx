'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserAuth } from '../../context/AuthContext';
import { ChevronDownIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Logo from '../../../public/logo/logo.png';
import Sidebaricon from '../../../public/icons/image.png';
import UserIcon from '../../../public/icons/user.png';

import {
  HomeIcon,
  MagnifyingGlassIcon,
  PhoneIcon,
  UserCircleIcon,
  CreditCardIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

import './Header.css';

export default function Header() {
  const { logout } = UserAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [activeRoute, setActiveRoute] = useState(pathname);
  const [dropdownVisibility, setDropdownVisibility] = useState<Record<string, boolean>>({});
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const menuRef = useRef<HTMLUListElement | null>(null);

  const links = [
    { label: 'Home', route: '/home', icon: <HomeIcon className="navIcon" />, title: 'Go to Home' },
    { label: 'Search Transactions', route: '/transactions', icon: <MagnifyingGlassIcon className="navIcon" />, title: 'Search your transactions' },
    { label: 'Contact Us', route: '/contactUs', icon: <PhoneIcon className="navIcon" />, title: 'Contact support' },
    {
      label: 'Account',
      icon: <Image src={UserIcon} alt="User Icon" className="accountIcon" width={24} height={24} />,
      title: 'Account settings',
      dropdown: [
        { label: 'Account Settings', route: '/myAccount', icon: <UserCircleIcon className="navIcon" />, title: 'Manage account settings' },
        { label: 'Payment Settings', route: '/payment', icon: <CreditCardIcon className="navIcon" />, title: 'Manage payment methods' },
        { label: 'Logout', route: '/', icon: <ArrowRightOnRectangleIcon className="navIcon" />, title: 'Sign out of your account' },
      ],
    },
  ];
  
  useEffect(() => {
    setActiveRoute(pathname);
  }, [pathname]);

  const handleDropdownToggle = (label: string) => {
    setDropdownVisibility((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const handleDrawerToggle = useCallback(() => {
    setIsDrawerOpen((prev) => !prev);
    setDropdownVisibility({});
  }, []);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setDropdownVisibility({});
      setIsDrawerOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  const handleSignOut = useCallback(async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  }, [logout, router]);

  const renderAccountLink = (link: any) => (
    <span
      className="dropdownContainer"
      title={link.title}
      onClick={() => handleDropdownToggle(link.label)}
    >
      {link.icon}
      {isDrawerOpen && <span className="accountLabel">{link.label}</span>}
      {/* <ChevronDownIcon className={`chevronIcon ${dropdownVisibility[link.label] ? 'rotate' : ''}`} /> */}
    </span>
  );

  return (
    <header className="headerWrapper">
      <div className='menuwrapper'>
        <button className="menuIcon" onClick={handleDrawerToggle}>
          {isDrawerOpen ? (
            <span className="menuTitleWrapper">
              <XMarkIcon className="iconSize" />
              <span className="menuTitle">Formmatic</span>
            </span>
          ) : (
            <Image src={Sidebaricon} alt="Menu Icon" className="iconSize" />
          )}
        </button>
      </div>

      <Link href="/home" className="logoContainer">
        <Image src={Logo} alt="Logo" className="headerLogo" />
      </Link>
      {isDrawerOpen && <div className="drawerDivider"></div>}

      <ul className={`myLinks ${isDrawerOpen ? 'drawerOpen' : ''}`} ref={menuRef}>
        {isDrawerOpen && <div className="drawerDivider"></div>}

        {links.map((link, index) => (
          <li key={index} className={`linkLabel ${link.label === 'Logout' ? 'logoutButton' : ''}`}>
            {link.label === 'Account' ? (
              renderAccountLink(link)
            ) : link.route ? (
              <Link
                href={link.route}
                title={link.title}
                className={activeRoute === link.route ? 'linkActive' : 'linkRoute'}
                onClick={link.label === 'Logout' ? handleSignOut : handleDrawerToggle}
              >
                {isDrawerOpen && link.icon}
                {link.label}
              </Link>
            ) : null}
            {link.dropdown && (
              <div className={`dropdownMenuWrapper ${dropdownVisibility[link.label] ? 'showDropdown' : ''}`}>
                <ul className="dropdownMenuList">
                  {link.dropdown.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.route}
                        title={item.title}
                        onClick={() => {
                          setActiveRoute(item.route);
                          setDropdownVisibility({});
                          setIsDrawerOpen(false);
                        }}
                        className={activeRoute === item.route ? 'activeDropdownLink' : 'linkRoute'}
                      >
                        {isDrawerOpen && item.icon}
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