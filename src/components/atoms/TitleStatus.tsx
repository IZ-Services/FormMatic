'use client';
import React from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import './TitleStatus.css';

interface VehicleTransactionDetails {
  withTitle?: boolean;
  [key: string]: any;
}

interface FormData {
  vehicleTransactionDetails?: VehicleTransactionDetails;
  [key: string]: any;
}

interface TitleStatusProps {
  formData?: {
    vehicleTransactionDetails?: {
      withTitle?: boolean;
    };
  };
}

const TitleStatus: React.FC<TitleStatusProps> = ({ formData }) => {
  const { updateField, formData: contextFormData } = useFormContext() as { 
    updateField: (field: string, value: any) => void;
    formData: FormData;
  };
  

  const withTitle = contextFormData?.vehicleTransactionDetails?.withTitle ?? false;

  const handleTitleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    

    const currentDetails = contextFormData.vehicleTransactionDetails || {};
    

    updateField('vehicleTransactionDetails', {
      ...currentDetails,
      withTitle: isChecked
    });
  };

  return (
    <div className="titleStatusContainer">
      <div className="titleStatusHeader">
        <h3>Title Status</h3>
      </div>
      <div className="titleStatusContent">
        <label className="titleCheckboxLabel">
          <input
            type="checkbox"
            checked={withTitle}
            onChange={handleTitleStatusChange}
            className="titleCheckbox"
          />
          <span className="titleCheckboxText">With Title</span>
        </label>
        <div className="titleStatusDescription">
          {withTitle 
            ? "This transaction will be processed with the original title." 
            : "This transaction will be processed without the original title."}
        </div>
      </div>
    </div>
  );
};

export default TitleStatus;