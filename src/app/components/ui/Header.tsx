'use client';
import React, { useEffect, useState } from 'react';
import './header.css';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { UserAuth } from '../../../context/AuthContext';


export default function Header() {
  const { logout } = UserAuth();


  const pathname = usePathname();
  const [activeRoute, setActiveRoute] = useState(pathname);

  const links = [
    { label: 'Formatic' },
    { label: 'Home', route: '/home' },
    { label: 'Search Transactions', route: '/transactions' },
    { label: 'DMV Forms', route: '/dmvForms' },
    { label: 'Contact Us', route: '/contactUs' },
    { label: 'Account', route: '/account' },
    { label: 'Logout', route: '/' },
  ];

  useEffect(() => {
    setActiveRoute(pathname);
  }, [pathname]);
  
    const handleSignOut = async () =>{
    try{
        await logout(); 
    }catch(error){
      console.error("Error signing in: ", error);
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
              <span className="link">{link.label}</span>
            )}
          </li>
        ))}
      </ul>
    </header>
  );
}
