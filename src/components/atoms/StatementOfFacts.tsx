'use client';
import React, { useState, useEffect } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import './StatementOfFacts.css';

interface StatementOfFactsType {
  statement: string;
}

interface ValidationError {
  fieldPath: string;
  message: string;
}

interface StatementOfFactsProps {
  formData?: {
    statementOfFacts?: StatementOfFactsType;
    _showValidationErrors?: boolean;
  };
  onChange?: (data: StatementOfFactsType) => void;
  showValidationErrors?: boolean;
}

const initialStatementOfFacts: StatementOfFactsType = {
  statement: ''
};

const StatementOfFacts: React.FC<StatementOfFactsProps> = ({ 
  formData: propFormData,
  onChange,
  showValidationErrors = false
}) => {
  const { formData: contextFormData, updateField } = useFormContext();

  const formData = {
    ...contextFormData,
    ...propFormData
  };
  
  const [statementData, setStatementData] = useState<StatementOfFactsType>(
    formData.statementOfFacts || initialStatementOfFacts
  );
  
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  

  const shouldShowValidationErrors = showValidationErrors || formData?._showValidationErrors === true;

  useEffect(() => {
    if (!formData.statementOfFacts) {
      updateField('statementOfFacts', initialStatementOfFacts);
    } else {
      setStatementData(formData.statementOfFacts);
    }
  }, [formData.statementOfFacts]);
  

  const validateStatementOfFacts = (): ValidationError[] => {
    const errors: ValidationError[] = [];
    

    if (!statementData.statement || statementData.statement.trim() === '') {
      errors.push({
        fieldPath: 'statementOfFacts.statement',
        message: 'Statement of facts is required'
      });
    } else if (statementData.statement.trim().length < 10) {
      errors.push({
        fieldPath: 'statementOfFacts.statement',
        message: 'Statement should be at least 10 characters long'
      });
    } else if (statementData.statement.trim().length > 2000) {
      errors.push({
        fieldPath: 'statementOfFacts.statement',
        message: 'Statement should not exceed 2000 characters'
      });
    }
    
    return errors;
  };
  

  const getErrorMessage = (fieldPath: string): string | null => {
    const error = validationErrors.find(err => err.fieldPath === fieldPath);
    return error ? error.message : null;
  };
  

  const shouldShowValidationError = (field: string): boolean => {
    if (!shouldShowValidationErrors) return false;
    return validationErrors.some(err => err.fieldPath === `statementOfFacts.${field}`);
  };
  

  useEffect(() => {
    if (shouldShowValidationErrors) {
      const errors = validateStatementOfFacts();
      setValidationErrors(errors);
      

      const currentValidationErrors = typeof contextFormData._validationErrors === 'object' && 
        contextFormData._validationErrors !== null
        ? contextFormData._validationErrors
        : {};
        
      updateField('_validationErrors', {
        ...currentValidationErrors,
        statementOfFacts: errors.length > 0
      });
    }
  }, [shouldShowValidationErrors, statementData]);

  const handleStatementChange = (value: string) => {
    const updatedData = { ...statementData, statement: value };
    setStatementData(updatedData);
    
    if (onChange) {
      onChange(updatedData);
    } else {
      updateField('statementOfFacts', updatedData);
    }
  };

  return (
    <div className="statementOfFactsWrapper">
      <h3 className="statementOfFactsHeading">STATEMENT OF FACTS</h3>
      <div className="statementOfFactsIntro">
        <p>I, the undersigned, state:</p>
      </div>
      
      <div className="statementTextareaContainer">
        <textarea
          className={`statementTextarea ${shouldShowValidationError('statement') ? 'validation-error' : ''}`}
          placeholder="Enter your statement of facts..."
          value={statementData.statement || ''}
          onChange={(e) => {
            const value = e.target.value;
            const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
            handleStatementChange(capitalizedValue);
          }}
          rows={6}
        />
        
        {shouldShowValidationError('statement') && (
          <div className="validation-message">
            {getErrorMessage('statementOfFacts.statement')}
          </div>
        )}
        
        <div className="character-count" style={{ 
          textAlign: 'right', 
          fontSize: '12px', 
          color: shouldShowValidationError('statement') ? '#f44336' : '#666',
          marginTop: '5px' 
        }}>
          {statementData.statement ? statementData.statement.length : 0}/2000
        </div>
      </div>
    </div>
  );
};

export default StatementOfFacts;