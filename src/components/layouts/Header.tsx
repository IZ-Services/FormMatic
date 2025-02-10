'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserAuth } from '../../context/AuthContext';
import { ChevronDownIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Logo from '../../../public/logo/logo.png';
import Sidebaricon from '../../../public/icons/image.png';
import {
  HomeIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  PhoneIcon,
  UserIcon,
  CogIcon,
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
    { label: 'Home', route: '/home', icon: <HomeIcon className="navIcon" /> },
    { label: 'Search Transactions', route: '/transactions', icon: <MagnifyingGlassIcon className="navIcon" /> },
    { label: 'DMV Forms', route: '/dmvForms', icon: <DocumentTextIcon className="navIcon" /> },
    { label: 'Contact Us', route: '/contactUs', icon: <PhoneIcon className="navIcon" /> },
    {
      label: 'Account',
      icon: <UserIcon className="navIcon" />,
      dropdown: [
        { label: 'Account Settings', route: '/myAccount', icon: <CogIcon className="navIcon" /> },
        { label: 'Payment Settings', route: '/payment', icon: <CreditCardIcon className="navIcon" /> },
      ],
    },
    { label: 'Logout', route: '/', icon: <ArrowRightOnRectangleIcon className="navIcon" /> },
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
      {link.route ? (
        <Link
          href={link.route}
          className={activeRoute === link.route ? 'linkActive' : 'linkRoute'}
          onClick={link.label === 'Logout' ? handleSignOut : handleDrawerToggle}
        >
          {isDrawerOpen && link.icon}
          {link.label}
        </Link>
      ) : (
        <span className="dropdownContainer" onClick={() => handleDropdownToggle(link.label)}>
          {isDrawerOpen && link.icon}
          {link.label}
          <ChevronDownIcon className={`chevronIcon ${dropdownVisibility[link.label] ? 'rotate' : ''}`} />
        </span>
      )}
      {link.dropdown && (
        <div className={`dropdownMenuWrapper ${dropdownVisibility[link.label] ? 'showDropdown' : ''}`}>
          <ul className="dropdownMenuList">
            {link.dropdown.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.route}
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
