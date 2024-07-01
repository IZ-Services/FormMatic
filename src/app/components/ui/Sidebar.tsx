'use client';
import React, { useState, useEffect, useRef } from 'react';
import './sidebar.css';
import { MagnifyingGlassIcon } from '@heroicons/react/16/solid';
import { useScenarioContext } from '../../../context/ScenarioContext';
import { useAppContext } from '../../../context/index';

export default function Sidebar() {
  const { scenarios, selectedSubsection, setSelectedSubsection } = useScenarioContext();
  const { formData, setFormData } = useAppContext()!;
  const transactionRef = useRef<HTMLDivElement | null>(null);

  const [searchScenario, setSearchScenario] = useState('');
  const [selectedTransactionType, setSelectedTransactionType] = useState('');

  const handleOpen = (transactionType: string) => {
    setSelectedTransactionType(transactionType === selectedTransactionType ? '' : transactionType);
  };

  const handleSelection = (subsection: string, transactionType: string) => {
    setSelectedSubsection(subsection);
    setFormData({ ...formData, transactionType });
    setSelectedTransactionType(transactionType);
  };

  const filteredScenarios = scenarios
    .map(scenario => ({
      ...scenario,
      subsections: scenario.subsections.filter(subsection =>
        subsection.toLowerCase().includes(searchScenario.toLowerCase())
      ),
    }))
    .filter(scenario => scenario.subsections.length > 0);

  const handleClickOutsideDate = (e: MouseEvent) => {
    const target = e.target as Element;
    if (transactionRef.current && !transactionRef.current.contains(target)) {
      setSelectedTransactionType('');
    }
  };

  useEffect(() => {
    if (selectedTransactionType) {
      document.addEventListener('mousedown', handleClickOutsideDate);
    } else {
      document.removeEventListener('mousedown', handleClickOutsideDate);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideDate);
    };
  }, [selectedTransactionType]);

  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <div className="searchScenarioWrapper">
          <MagnifyingGlassIcon className="scenarioIcon" />
          <input
            className="scenarioInput"
            placeholder="Search Scenarios"
            value={searchScenario}
            onChange={(e) => setSearchScenario(e.target.value)}
          />
        </div>

        <div className='transactionWrapper' ref={transactionRef}>
          {filteredScenarios.map((scenario, index) => (
            <div key={index}>
              <div className='pentagon' onClick={() => handleOpen(scenario.transactionType)}>
                <h1 className="scenarioTitle">{scenario.transactionType}</h1>
              </div>
              <ul style={{ display: searchScenario || scenario.transactionType === selectedTransactionType ? 'block' : 'none' }}>
                {scenario.subsections.map((subsection, subsectionIndex) => (
                  <li
                    key={subsectionIndex}
                    className="subsections"
                    onClick={() => handleSelection(subsection, scenario.transactionType)}
                  >
                    <div className={`${subsection === selectedSubsection ? 'subsectionActive' : 'subsectionEmpty'}`} />
                    <span>{subsection}</span>
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
