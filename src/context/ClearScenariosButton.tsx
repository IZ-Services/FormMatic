'use client';
import React from 'react';
import { useScenarioContext } from '../context/ScenarioContext';

interface ClearScenariosButtonProps {
  className?: string;
  buttonText?: string;
  onClear?: () => void;
}

const ClearScenariosButton: React.FC<ClearScenariosButtonProps> = ({ 
  className = '', 
  buttonText = 'Clear All Selections',
  onClear
}) => {
  const { clearPersistedScenarios } = useScenarioContext();

  const handleClearScenarios = () => {
    if (window.confirm('Are you sure you want to clear all selected scenarios? This will reset your form.')) {
      clearPersistedScenarios();
      
      if (onClear) {
        onClear();
      }
    }
  };

  return (
    <button 
      onClick={handleClearScenarios}
      className={`clear-scenarios-button ${className}`}
      type="button"
    >
      {buttonText}
    </button>
  );
};

export default ClearScenariosButton;