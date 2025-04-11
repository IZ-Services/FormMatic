'use client';
import React from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';

interface ClearFormDataButtonProps {
  className?: string;
  onClear?: () => void;
  buttonText?: string;
}

const ClearFormDataButton: React.FC<ClearFormDataButtonProps> = ({ 
  className = '', 
  onClear,
  buttonText = 'Clear Form'
}) => {
  const { clearAllFormData } = useFormContext();

  const handleClearForm = () => {
    if (window.confirm('Are you sure you want to clear all form data? This cannot be undone.')) {
      clearAllFormData();
      if (onClear) {
        onClear();
      }
    }
  };

  return (
    <button 
      onClick={handleClearForm}
      className={`clear-form-button ${className}`}
      type="button"
    >
      {buttonText}
    </button>
  );
};

export default ClearFormDataButton;