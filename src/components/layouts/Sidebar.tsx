'use client';
import React, { useState, useEffect, useRef } from 'react';
import './Sidebar.css';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/16/solid';
import { ChevronDown } from 'lucide-react'; // Import the dropdown icon
import { useScenarioContext } from '../../context/ScenarioContext';
import { useAppContext } from '../../context/index';
import { UserAuth } from '../../context/AuthContext';

export default function Sidebar() {
  const { scenarios, selectedSubsection, setSelectedSubsection } = useScenarioContext();
  const { formData, setFormData } = useAppContext()!;
  const { isSubscribed } = UserAuth();

  const transactionRef = useRef<HTMLDivElement | null>(null);

  const [searchScenario, setSearchScenario] = useState('');
  const [selectedTransactionType, setSelectedTransactionType] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleClickOutsideDate = (e: MouseEvent) => {
    const target = e.target as Element;
    if (transactionRef.current && !transactionRef.current.contains(target)) {
      setSelectedTransactionType('');
    }
  };

  useEffect(() => {
    if (isSubscribed) {
      if (selectedTransactionType) {
        document.addEventListener('mousedown', handleClickOutsideDate);
      } else {
        document.removeEventListener('mousedown', handleClickOutsideDate);
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideDate);
    };
  }, [isSubscribed, selectedTransactionType]);

  if (!isSubscribed) {
    return null;
  }

  const handleOpen = (transactionType: string) => {
    setSelectedTransactionType(transactionType === selectedTransactionType ? '' : transactionType);
  };

  const handleSelection = (subsection: string) => {
    setSelectedSubsection((prevSelected: string | null) =>
      prevSelected === subsection ? null : subsection,
    );
    setSelectedTransactionType(subsection);
    setFormData({ ...formData, transactionType: subsection });
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const filteredScenarios = scenarios
    .map((scenario) => ({
      ...scenario,
      subsections: scenario.subsections.filter((subsection) =>
        subsection.toLowerCase().includes(searchScenario.toLowerCase()),
      ),
    }))
    .filter((scenario) => scenario.subsections.length > 0);

  return (
    <>
      <button className="sidebarToggle" onClick={toggleSidebar}>
        <span>Transactions</span>
      </button>

      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebarWrapper">
          <button className="close" onClick={toggleSidebar}>
            <XMarkIcon className="closeIcon" />
          </button>

          <div className="searchScenarioWrapper">
            <MagnifyingGlassIcon className="scenarioIcon" />
            <input
              className="scenarioInput"
              placeholder="Search Transaction"
              value={searchScenario}
              onChange={(e) => setSearchScenario(e.target.value)}
            />
          </div>

          <div className="transactionWrapper" ref={transactionRef}>
            {filteredScenarios.map((scenario, index) => (
              <div key={index}>
                <div className="pentagon" onClick={() => handleOpen(scenario.transactionType)}>
                  <h1 className="scenarioTitle">{scenario.transactionType}</h1>
                  <ChevronDown
                    className={`icon ${
                      selectedTransactionType === scenario.transactionType ? 'open' : ''
                    }`}
                  />
                </div>
                <ul
                  style={{
                    display:
                      searchScenario || scenario.transactionType === selectedTransactionType
                        ? 'block'
                        : 'none',
                  }}
                >
                  {scenario.subsections.map((subsection, subsectionIndex) => (
                    <li
                      key={subsectionIndex}
                      className="subsections"
                      onClick={() => handleSelection(subsection)}
                    >
                      <div
                        className={`${
                          subsection === selectedSubsection ? 'subsectionActive' : 'subsectionEmpty'
                        }`}
                      />
                      <span>{subsection}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isSidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}
    </>
  );
}
