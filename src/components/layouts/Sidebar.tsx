'use client';
import React, { useState, useEffect, useRef } from 'react';
import './Sidebar.css';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/16/solid';
import { ChevronDown } from 'lucide-react'; import { useScenarioContext } from '../../context/ScenarioContext';
import { useAppContext } from '../../context/index';
import { UserAuth } from '../../context/AuthContext'; interface Subsection {
  id: string;
  name: string; } interface Scenario {
  transactionType: string;
  subsections: (string | Subsection)[];
}

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

  const handleSelection = (subsection: string | Subsection) => {     const subsectionValue = typeof subsection === 'string' ? subsection : subsection.name;
    
    setSelectedSubsection((prevSelected: string | null) =>
      prevSelected === subsectionValue ? null : subsectionValue,
    );
    setSelectedTransactionType(subsectionValue);
    setFormData({ ...formData, transactionType: subsectionValue });
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };   const getSubsectionText = (subsection: string | Subsection): string => {
    return typeof subsection === 'string' ? subsection : subsection.name;
  };

  const filteredScenarios = (scenarios as Scenario[])
    .map((scenario) => ({
      ...scenario,
      subsections: scenario.subsections.filter((subsection) =>
        getSubsectionText(subsection).toLowerCase().includes(searchScenario.toLowerCase()),
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
            {filteredScenarios.map((scenario, index) => {
              const isScenarioActive = selectedSubsection && 
                scenario.subsections.some(sub => getSubsectionText(sub) === selectedSubsection);
              
              return (
                <div key={index}>
                  <div
                    className={`scenarioBase ${isScenarioActive ? 'activeScenario' : ''}`} 
                    onClick={() => handleOpen(scenario.transactionType)}
                  >
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
                      borderLeft: '2px solid #d3d3d3',
                      marginLeft: '50px',                      
                    }}
                  >
                    {scenario.subsections.map((subsection, subsectionIndex) => {
                      const subsectionText = getSubsectionText(subsection);
                      
                      return (
                        <li
                          key={subsectionIndex}
                          className={`subsections ${selectedSubsection === subsectionText ? 'active' : ''}`}
                          onClick={() => handleSelection(subsection)}
                        >
                          <span>{subsectionText}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {isSidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}
    </>
  );
}