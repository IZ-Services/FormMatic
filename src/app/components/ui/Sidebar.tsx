'use client';
import React, { useEffect, useState } from 'react';
import {
  HomeIcon,
  UserIcon,
  ArrowRightStartOnRectangleIcon,
  MagnifyingGlassCircleIcon,
  DocumentIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';
import './sidebar.css';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Sidebar() {
  const pathname = usePathname();
  const [activeRoute, setActiveRoute] = useState(pathname);

  const links = [
    { label: 'Home', icon: HomeIcon, route: '/' },
    { label: 'Search Transactions', icon: MagnifyingGlassCircleIcon, route: '/clients' },
    { label: 'DMV Forms', icon: DocumentIcon, route: '/dmvForms' },
    { label: 'Contact Us', icon: EnvelopeIcon, route: '/contact' },
  ];

  const bottomLinks = [
    { label: 'Account', icon: UserIcon, route: '/account' },
    { label: 'Logout', icon: ArrowRightStartOnRectangleIcon, route: '/login' },
  ];

  useEffect(() => {
    setActiveRoute(pathname);
  }, [pathname]);

  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <div className="sidebarHeading">Formatic</div>
        <div className="linksContainer">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.label}
                href={link.route}
                className={activeRoute === link.route ? 'linkActive' : 'link'}
                onClick={() => setActiveRoute(link.route)}
              >
                <Icon className="linkIcon" />
                <span className="linkLabel">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
      <div className="bottomLinksContainer">
        {bottomLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.label}
              href={link.route}
              className={activeRoute === link.route ? 'linkActive' : 'link'}
              onClick={() => setActiveRoute(link.route)}
            >
              <Icon className="linkIcon" />
              <span className="linkLabel">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
