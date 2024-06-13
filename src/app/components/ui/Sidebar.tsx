"use client";
import React, { useState } from "react";
import {HomeIcon, UserIcon, ArrowRightStartOnRectangleIcon, MagnifyingGlassCircleIcon, DocumentIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import '../../globals.css';
import { usePathname, useRouter } from "next/navigation";

export default function Sidebar() {
	const router = useRouter();
	const pathname = usePathname();
	  const [activeRoute, setActiveRoute] = useState(pathname);

	const links = [
		{ label: "Home", icon: HomeIcon, route: "/" },
		{ label: "Search Transactions", icon: MagnifyingGlassCircleIcon, route: "/clients" },
		{ label: "DMV Forms", icon: DocumentIcon, route: "/dmvForms" },
		{ label: "Contact Us", icon: EnvelopeIcon, route: "/contact" },
	];
	
	const bottomLinks = [
		{ label: "Account", icon: UserIcon, route: "/accountSettings" },
		{ label: "Logout", icon: ArrowRightStartOnRectangleIcon, route: "/login" },
	];

	const handleTabClick = (route: string) => {
		router.push(route);
		setActiveRoute(route);
	};
	

	
  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <div className="sidebarHeading">Formatic</div>
        <div className="linksContainer">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.label}
                onClick={() => handleTabClick(link.route)}
                className={activeRoute === link.route ? 'linkActive' : 'link'}
              >
                <Icon className="linkIcon" />
                <span className="linkLabel">{link.label}</span>
              </a>
            );
          })}
        </div>
      </div>
      <div className="bottomLinksContainer">
        {bottomLinks.map((link) => {
          const Icon = link.icon;
          return (
            <a
            	key={link.label}
            	onClick={() => handleTabClick(link.route)}
                className={`link ${activeRoute === link.route ? 'active' : ''}`}
            >
              <Icon className="linkIcon" />
              <span className="linkLabel">{link.label}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}