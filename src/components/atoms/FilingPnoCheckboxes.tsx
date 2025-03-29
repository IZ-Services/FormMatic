'use client';
import React from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import './FilingPnoCheckboxes.css';

interface PnoDetails {
  isBeforeRegExpires?: boolean;
  requestPnoCard?: boolean;
  [key: string]: any;
}

interface FormData {
  pnoDetails?: PnoDetails;
  [key: string]: any;
}

interface FilingPnoCheckboxesProps {
  formData?: {
    pnoDetails?: {
      isBeforeRegExpires?: boolean;
      requestPnoCard?: boolean;
    };
  };
}

const FilingPnoCheckboxes: React.FC<FilingPnoCheckboxesProps> = ({ formData }) => {
  const { updateField, formData: contextFormData } = useFormContext() as { 
    updateField: (field: string, value: any) => void;
    formData: FormData;
  };
  
  const isBeforeRegExpires = contextFormData?.pnoDetails?.isBeforeRegExpires ?? false;
  const requestPnoCard = contextFormData?.pnoDetails?.requestPnoCard ?? false;

  const handleBeforeRegExpiresChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    
    const currentDetails = contextFormData.pnoDetails || {};
    
    updateField('pnoDetails', {
      ...currentDetails,
      isBeforeRegExpires: isChecked
    });
  };

  const handleRequestPnoCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    
    const currentDetails = contextFormData.pnoDetails || {};
    
    updateField('pnoDetails', {
      ...currentDetails,
      requestPnoCard: isChecked
    });
  };

  return (
    <div className="filingPnoContainer">
      <div className="filingPnoHeader">
        <h3>Transaction Details</h3>
      </div>
      <div className="filingPnoContent">
        <label className="pnoCheckboxLabel">
          <input
            type="checkbox"
            checked={isBeforeRegExpires}
            onChange={handleBeforeRegExpiresChange}
            className="pnoCheckbox"
          />
          <span className="pnoCheckboxText">60 days before registration expires or 90 days after</span>
        </label>
        

        <label className="pnoCheckboxLabel">
          <input
            type="checkbox"
            checked={requestPnoCard}
            onChange={handleRequestPnoCardChange}
            className="pnoCheckbox"
          />
          <span className="pnoCheckboxText">Request PNO card</span>
        </label>
        
      </div>
    </div>
  );
};

export default FilingPnoCheckboxes;
