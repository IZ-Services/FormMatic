'use client';
import React, { useState } from 'react';
import './sidebar.css';
import { MagnifyingGlassIcon } from '@heroicons/react/16/solid';
import { useScenarioContext } from '../../../context/ScenarioContext';
import { useAppContext } from '../../../context/index';

export default function Sidebar() {
  const { scenarios, setSelectedSubsection } = useScenarioContext();
  const { formData, setFormData } = useAppContext()!;

  const [searchScenerio, setSearchScenerio] = useState('');

  const handleSelection = (subsection: string) => {
    setSelectedSubsection(subsection);
    setFormData({ ...formData, transactionType:subsection });
  };

  const filteredScenerios = scenarios
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
                  <li
                    key={subsectionIndex}
                    className="subsections"
                    onClick={() => handleSelection(subsection)}
                  >
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
