import React, { useState, useEffect } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import './PowerOfAttorney.css';

interface PowerOfAttorneyData {
  printNames?: string;
  appointee?: string;
  date?: string; }

interface PowerOfAttorneyProps {
  formData?: {
    powerOfAttorney?: PowerOfAttorneyData;
    howMany?: string;     owners?: any[];   };   onChange?: (data: PowerOfAttorneyData) => void;
}

const PowerOfAttorney: React.FC<PowerOfAttorneyProps> = ({ formData: propFormData, onChange }) => {
  const { formData: contextFormData, updateField } = useFormContext();
  
  const formData = {
    ...contextFormData,
    ...propFormData
  };
  
  const [powerOfAttorneyData, setPowerOfAttorneyData] = useState<PowerOfAttorneyData>({
    printNames: '',
    appointee: '',
    date: ''   });
  
  useEffect(() => {
    if (propFormData?.powerOfAttorney) {       const newData: PowerOfAttorneyData = {
        printNames: propFormData.powerOfAttorney.printNames,
        appointee: propFormData.powerOfAttorney.appointee,
        date: ''
      };        const oldData = propFormData.powerOfAttorney as any;
      if (oldData.dates && Array.isArray(oldData.dates) && oldData.dates.length > 0) {
        newData.date = oldData.dates[0];
      }
      
      setPowerOfAttorneyData(newData);
    }
  }, [propFormData]);

  const handleInputChange = (field: keyof PowerOfAttorneyData, value: string) => {
    const newData = { 
      ...powerOfAttorneyData, 
      [field]: field === 'printNames' || field === 'appointee' ? value.toUpperCase() : value 
    };
    setPowerOfAttorneyData(newData);
    updateField('powerOfAttorney', newData);     if (onChange) {
      onChange(newData);
    }
  };

  const formatDate = (value: string) => {     const digitsOnly = value.replace(/\D/g, '');     let formatted = digitsOnly;
    if (formatted.length > 2) {
      formatted = `${formatted.slice(0, 2)}/${formatted.slice(2)}`;
    }
    if (formatted.length > 5) {
      formatted = `${formatted.slice(0, 5)}/${formatted.slice(5)}`;
    }     return formatted.slice(0, 10);
  };

  return (
    <div className="power-of-attorney-wrapper">
      <div className="section-header">
        <h3 className="section-title">Power of Attorney</h3>
      </div>

      <div className="power-of-attorney-content">
        <div className="power-of-attorney-description">
          <div className="name-input-row">
            <span>I/We</span>
            <input
              type="text"
              className="print-names-input"
              placeholder="Print Name(s)"
              value={powerOfAttorneyData.printNames || ''}
              onChange={(e) => handleInputChange('printNames', e.target.value)}
            />
            <span>appoint</span>
            <input
              type="text"
              className="print-names-input"
              placeholder="Appointee Name(s)"
              value={powerOfAttorneyData.appointee || ''}
              onChange={(e) => handleInputChange('appointee', e.target.value)}
            />
          </div>
          <p>as my attorney in fact, to complete all necessary documents, as needed, to transfer ownership as required by law.</p>
        </div>

        {/* <div className="dates-section">
          <div className="date-input-row">
            <label className="date-label">Date</label>
            <div className="signature-input-group">
              <input
                type="text"
                className="date-input"
                placeholder="MM/DD/YYYY"
                value={powerOfAttorneyData.date || ''}
                onChange={(e) => handleInputChange('date', formatDate(e.target.value))}
              />
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default PowerOfAttorney;