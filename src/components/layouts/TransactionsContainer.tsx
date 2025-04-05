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
    console.log(`Selecting scenario: ${scenarioName}, checked: ${isChecked}`);
    
    setActiveScenarios(prev => {
      const updated = {
        ...prev,
        [scenarioName]: isChecked
      };
      console.log('Updated activeScenarios:', updated);
      return updated;
    });

    if (isChecked) {
      setSelectedSubsection(scenarioName);
    }

    // Handle Duplicate Stickers sub-options
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
    
    // Handle Name Change sub-options - automatically check the Name Correction option
    if (scenarioName === 'Name Change') {
      if (isChecked) {
        setActiveSubOptions(prev => ({
          ...prev,
          'Name Change-Name Correction': true,
          'Name Change-Legal Name Change': false,
          'Name Change-Name Discrepancy': false
        }));
      } else {
        setActiveSubOptions(prev => {
          const updated = { ...prev };
          delete updated['Name Change-Name Correction'];
          delete updated['Name Change-Legal Name Change'];
          delete updated['Name Change-Name Discrepancy'];
          return updated;
        });
      }
    }
    
    // Handle Personalized Plates sub-options
    if (scenarioName === 'Personalized Plates' && !isChecked) {
      setActiveSubOptions(prev => {
        const updated = { ...prev };
        delete updated['Personalized Plates-Order'];
        delete updated['Personalized Plates-Replace'];
        delete updated['Personalized Plates-Reassign/Retain'];
        delete updated['Personalized Plates-Exchange'];
        return updated;
      });
    }
  };

  const handleSubOptionSelect = (parentName: string, subOptionName: string, isChecked: boolean): void => {
    const optionKey = `${parentName}-${subOptionName}`;
    console.log(`Selecting sub-option: ${optionKey}, checked: ${isChecked}`);
    
    if (parentName === 'Name Change') {
      const updatedOptions = { ...activeSubOptions };
      // If a different option is being checked
      if (isChecked) {
        // Uncheck all other Name Change options
        Object.keys(updatedOptions).forEach(key => {
          if (key.startsWith('Name Change-')) {
            updatedOptions[key] = false;
          }
        });
        
        // Check the selected option
        updatedOptions[optionKey] = true;
      } else {
        // If the user is unchecking a Name Change option, allow it
        updatedOptions[optionKey] = false;
      }
      
      console.log('Updated activeSubOptions for Name Change:', updatedOptions);
      setActiveSubOptions(updatedOptions);
      
      // Auto-select parent if not already selected
      if (!activeScenarios['Name Change']) {
        console.log('Auto-selecting Name Change parent option');
        setActiveScenarios(prev => ({
          ...prev,
          'Name Change': true
        }));
      }
    } 
    else if (parentName === 'Personalized Plates' && isChecked) {
      const updatedOptions = { ...activeSubOptions };
      Object.keys(updatedOptions).forEach(key => {
        if (key.startsWith('Personalized Plates-')) {
          updatedOptions[key] = false;
        }
      });
      
      updatedOptions[optionKey] = true;
      
      console.log('Updated activeSubOptions for Personalized Plates:', updatedOptions);
      setActiveSubOptions(updatedOptions);
      
      if (!activeScenarios['Personalized Plates']) {
        console.log('Auto-selecting Personalized Plates parent option');
        setActiveScenarios(prev => ({
          ...prev,
          'Personalized Plates': true
        }));
      }
    } 
    else {
      setActiveSubOptions(prev => {
        const updated = {
          ...prev,
          [optionKey]: isChecked
        };
        console.log('Updated activeSubOptions:', updated);
        return updated;
      });
    }
  };

  return (
    <div className={`type-container-wrapper ${isOpen ? "open" : ""}`}>
      <button className="side-tab" onClick={() => setIsOpen(true)}>
        <span>Transactions</span>
      </button>

      <div className={`type-container ${isOpen ? "show" : ""}`}>
        <div className="header-container">
          <h2>Transactions</h2>
          <button className="close-button" onClick={() => setIsOpen(false)}>
            <XMarkIcon className="close-icon" />
          </button>
        </div>

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
                                data-testid={`${subsection.name.toLowerCase().replace(/\s+/g, '-')}-${option.toLowerCase().replace(/\s+/g, '-')}`}
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