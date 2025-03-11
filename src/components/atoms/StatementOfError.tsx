'use client';
import React, { useEffect } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import './StatementOfError.css';

interface StatementOfErrorType {
  vehicleLicensePlate?: string;
  vehicleIdentification?: string;
  vehicleMake?: string;
  certificateType?: string;
  reasonForError?: string;
}

interface StatementOfErrorProps {
  formData?: {
    statementOfError?: StatementOfErrorType;
  };
}

const initialStatementOfError: StatementOfErrorType = {
  vehicleLicensePlate: '',
  vehicleIdentification: '',
  vehicleMake: '',
  certificateType: '',
  reasonForError: ''
};

const StatementOfError: React.FC<StatementOfErrorProps> = ({ formData: propFormData }) => {
  const { formData: contextFormData, updateField } = useFormContext();

  const formData = {
    ...contextFormData,
    ...propFormData
  };

  useEffect(() => {
    if (!formData.statementOfError) {
      updateField('statementOfError', initialStatementOfError);
    }
  }, []);   const capitalizeFirstLetter = (value: string): string => {
    if (!value) return value;
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const handleChange = (field: keyof StatementOfErrorType, value: string) => {
    const currentInfo = (formData.statementOfError || {}) as StatementOfErrorType;     const capitalizedValue = capitalizeFirstLetter(value);
    
    updateField('statementOfError', { ...currentInfo, [field]: capitalizedValue });
  };

  return (
    <div className="statementOfErrorWrapper">
      <div className="statementOfErrorHeader">
        <h3 className="statementOfErrorTitle">STATEMENT OF ERROR OR ERASURE</h3>
        <div className="vehicleLicenseField">
          <label className="errorLabel">VEHICLE LICENSE PLATE OR VESSEL CF NO.</label>
          <input
            type="text"
            className="errorInput"
            value={(formData.statementOfError as StatementOfErrorType)?.vehicleLicensePlate || ''}
            onChange={(e) => handleChange('vehicleLicensePlate', e.target.value)}
            placeholder="Enter license plate number"
          />
        </div>
      </div>
      
      <div className="vehicleInfoRow">
        <div className="vehicleIdField">
          <label className="errorLabel">VEHICLE/HULL IDENTIFICATION NUMBER</label>
          <input
            type="text"
            className="errorInput"
            value={(formData.statementOfError as StatementOfErrorType)?.vehicleIdentification || ''}
            onChange={(e) => handleChange('vehicleIdentification', e.target.value)}
            placeholder="Enter vehicle ID"
          />
        </div>
        <div className="vehicleMakeField">
          <label className="errorLabel">MAKE OF VEHICLE OR VESSEL BUILDER</label>
          <input
            type="text"
            className="errorInput"
            value={(formData.statementOfError as StatementOfErrorType)?.vehicleMake || ''}
            onChange={(e) => handleChange('vehicleMake', e.target.value)}
            placeholder="Enter make of vehicle"
          />
        </div>
      </div>
      
      <div className="statementHighlightSection">
        <div className="statementContent">
          <p>Name on Title/Ownership
            <input
              type="text"
              className="certificateInput"
              value={(formData.statementOfError as StatementOfErrorType)?.certificateType || ''}
              onChange={(e) => handleChange('certificateType', e.target.value)}
              placeholder="Type of certificate"
            />
            issued for the above described vehicle/vessel was in error and has no bearing on the ownership of the vehicle/vessel. The name signed or erased should not be a part of the ownership record.
          </p>
        </div>
        
        <div className="reasonsSection">
          <label className="reasonsLabel">REASONS FOR ERROR OR ERASURE</label>
          <textarea
            className="reasonsTextarea"
            value={(formData.statementOfError as StatementOfErrorType)?.reasonForError || ''}
            onChange={(e) => handleChange('reasonForError', e.target.value)}
            placeholder="Enter the reasons for error or erasure"
            rows={6}
          />
        </div>
      </div>
    </div>
  );
};

export default StatementOfError;