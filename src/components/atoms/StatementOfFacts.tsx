'use client';
import React, { useEffect } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import './StatementOfFacts.css';

interface StatementOfFactsType {
  statement: string;
}

interface StatementOfFactsProps {
  formData?: {
    statementOfFacts?: StatementOfFactsType;
  };
}

const initialStatementOfFacts: StatementOfFactsType = {
  statement: ''
};

const StatementOfFacts: React.FC<StatementOfFactsProps> = ({ formData: propFormData }) => {
  const { formData: contextFormData, updateField } = useFormContext();

  const formData = {
    ...contextFormData,
    ...propFormData
  };

  useEffect(() => {
    if (!formData.statementOfFacts) {
      updateField('statementOfFacts', initialStatementOfFacts);
    }
  }, []);

  const handleStatementChange = (value: string) => {
    const currentInfo = (formData.statementOfFacts || {}) as StatementOfFactsType;
    updateField('statementOfFacts', { ...currentInfo, statement: value });
  };

  return (
    <div className="statementOfFactsWrapper">
      <h3 className="statementOfFactsHeading">STATEMENT OF FACTS</h3>
      <div className="statementOfFactsIntro">
        <p>I, the undersigned, state:</p>
      </div>
      
      <div className="statementTextareaContainer">
        <textarea
          className="statementTextarea"
          placeholder="Enter your statement of facts..."
          value={(formData.statementOfFacts as StatementOfFactsType)?.statement || ''}
          onChange={(e) => handleStatementChange(e.target.value)}
          rows={6}
        />
      </div>
    </div>
  );
};

export default StatementOfFacts;