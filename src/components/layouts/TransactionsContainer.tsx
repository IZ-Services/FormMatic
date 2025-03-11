import React, { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import "./TransactionsContainer.css";
import { useScenarioContext, Subsection } from "@/context/ScenarioContext";

const TypeContainer: React.FC = () => {
  const { 
    scenarios, 
    activeScenarios, 
    setActiveScenarios, 
    activeSubOptions, 
    setActiveSubOptions,
    setSelectedSubsection
  } = useScenarioContext();
  
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 1200);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1200) {
        setIsOpen(true); 
      } else {
        setIsOpen(false); 
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleScenarioSelect = (scenarioName: string, isChecked: boolean): void => {
    setActiveScenarios(prev => ({
      ...prev,
      [scenarioName]: isChecked
    }));

 
    if (isChecked) {
      setSelectedSubsection(scenarioName);
    }

 
    if (scenarioName === 'Duplicate Stickers') {
      if (isChecked) {
 
        setActiveSubOptions(prev => ({
          ...prev,
          'Duplicate Stickers-Month': true,
          'Duplicate Stickers-Year': true
        }));
      } else {
 
        setActiveSubOptions(prev => ({
          ...prev,
          'Duplicate Stickers-Month': false,
          'Duplicate Stickers-Year': false
        }));
      }
    }
  };

  const handleSubOptionSelect = (parentName: string, subOptionName: string, isChecked: boolean): void => {
    const optionKey = `${parentName}-${subOptionName}`;
    
    setActiveSubOptions(prev => ({
      ...prev,
      [optionKey]: isChecked
    }));
  };

  return (
    <div className={`type-container-wrapper ${isOpen ? "open" : ""}`}>
      <button className="side-tab" onClick={() => setIsOpen(true)}>
        <span>Transactions</span>
      </button>

      <div className={`type-container ${isOpen ? "show" : ""}`}>
        <button className="close-button" onClick={() => setIsOpen(false)}>
          <XMarkIcon className="close-icon" />
        </button>

        <div className="transactionSections">
          {scenarios.map(({ transactionType, subsections }) => (
            <div key={transactionType} className="transaction-item">
              <h3 className="transaction-header">{transactionType}</h3>

              <div className="subsections">
                {subsections.map((subsection, index) =>
                  typeof subsection === "string" ? (
                    <label key={index} className="checkbox-label">
                      <input 
                        type="checkbox" 
                        className="checkbox"
                        checked={!!activeScenarios[subsection]}
                        onChange={(e) => handleScenarioSelect(subsection, e.target.checked)}
                      />
                      {subsection}
                    </label>
                  ) : (
                    <div key={subsection.name} className="subsection-group">
                      <label className="checkbox-label">
                        <input 
                          type="checkbox" 
                          className="checkbox"
                          checked={!!activeScenarios[subsection.name]}
                          onChange={(e) => handleScenarioSelect(subsection.name, e.target.checked)}
                        />
                        {subsection.name}
                      </label>

                      {subsection.subOptions && activeScenarios[subsection.name] && (
                        <div className="sub-options">
                          {subsection.subOptions.map((option, subIndex) => (
                            <label key={subIndex} className="sub-option-label">
                              <input 
                                type="checkbox" 
                                className="checkbox"
                                checked={!!activeSubOptions[`${subsection.name}-${option}`]}
                                onChange={(e) => handleSubOptionSelect(subsection.name, option, e.target.checked)}
                              />
                              {option}
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TypeContainer;