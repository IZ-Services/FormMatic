'use client';
import React, { useState } from 'react';
import './sidebar.css';
import { MagnifyingGlassIcon } from '@heroicons/react/16/solid';

export default function Sidebar() {
  const scenerios = [
    {
      transactionType: 'Transfer',
      subsections: ['Simple Transfer'],
    },
    {
      transactionType: 'Renewal',
      subsections: ['Simple Renewal'],
    },
    {
      transactionType: 'Out of State Transfer',
      subsections: ['Simple Out of State Transfer'],
    },
  ];

  const [searchScenerio, setSearchScenerio] = useState('');

  const filteredScenerios = scenerios
    .filter((scenerio) => {
      const filteredSubsections = scenerio.subsections.filter((subsection) =>
        subsection.toLowerCase().includes(searchScenerio.toLowerCase()),
      );
      return filteredSubsections.length > 0;
    })
    .map((scenerio) => {
      const filteredSubsections = scenerio.subsections.filter((subsection) =>
        subsection.toLowerCase().includes(searchScenerio.toLowerCase()),
      );
      return { ...scenerio, subsections: filteredSubsections };
    });

  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <div className="searchScenarioWrapper">
          <MagnifyingGlassIcon className="scenarioIcon" />
          <input
            className="scenarioInput"
            placeholder="Search Scenerios"
            value={searchScenerio}
            onChange={(e) => setSearchScenerio(e.target.value)}
          />
        </div>

        <div>
          {filteredScenerios.map((scenerio, index) => (
            <div key={index}>
              <h1 className="scenarioTitle">{scenerio.transactionType}</h1>
              <ul>
                {scenerio.subsections.map((subsection, subsectionIndex) => (
                  <li key={subsectionIndex} className="subsections">
                    {subsection}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
