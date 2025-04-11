import React, { useState, useEffect } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import './PowerOfAttorney.css';

interface PowerOfAttorneyData {
  printNames?: string;
  appointee?: string;
  date?: string;
}

interface PowerOfAttorneyProps {
  formData?: {
    powerOfAttorney?: PowerOfAttorneyData;
    howMany?: string;
    owners?: any[];
  };
  onChange?: (data: PowerOfAttorneyData) => void;
}

 
export const POWER_OF_ATTORNEY_STORAGE_KEY = 'formmatic_power_of_attorney';

 
export const clearPowerOfAttorneyStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(POWER_OF_ATTORNEY_STORAGE_KEY);
    console.log('Power of Attorney data cleared from localStorage');
  }
};

const PowerOfAttorney: React.FC<PowerOfAttorneyProps> = ({ formData: propFormData, onChange }) => {
  const { formData: contextFormData, updateField, clearFormTriggered } = useFormContext();
  const [isInitialized, setIsInitialized] = useState(false);
  
  const formData = {
    ...contextFormData,
    ...propFormData
  };
  
 
  const defaultPowerOfAttorneyData: PowerOfAttorneyData = {
    printNames: '',
    appointee: '',
    date: ''
  };
  
  const [powerOfAttorneyData, setPowerOfAttorneyData] = useState<PowerOfAttorneyData>(defaultPowerOfAttorneyData);
  
 
  useEffect(() => {
    if (clearFormTriggered) {
      console.log('Clear form triggered in PowerOfAttorney component');
      clearPowerOfAttorneyStorage();
      setPowerOfAttorneyData(defaultPowerOfAttorneyData);
      
 
      updateField('powerOfAttorney', defaultPowerOfAttorneyData);
    }
  }, [clearFormTriggered]);
  
 
  useEffect(() => {
    if (typeof window !== 'undefined' && !isInitialized) {
      try {
        const savedData = localStorage.getItem(POWER_OF_ATTORNEY_STORAGE_KEY);
        
        if (savedData) {
          console.log("Loading power of attorney data from localStorage");
          const parsedData = JSON.parse(savedData);
          
 
          const mergedData = {
            ...defaultPowerOfAttorneyData,
            ...parsedData
          };
          
          setPowerOfAttorneyData(mergedData);
          
 
          updateField('powerOfAttorney', mergedData);
          
          if (onChange) {
            onChange(mergedData);
          }
        } else if (propFormData?.powerOfAttorney) {
 
          const newData: PowerOfAttorneyData = {
            printNames: propFormData.powerOfAttorney.printNames,
            appointee: propFormData.powerOfAttorney.appointee,
            date: ''
          };
          
          const oldData = propFormData.powerOfAttorney as any;
          if (oldData.dates && Array.isArray(oldData.dates) && oldData.dates.length > 0) {
            newData.date = oldData.dates[0];
          }
          
          setPowerOfAttorneyData(newData);
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Error loading saved power of attorney data:', error);
        setIsInitialized(true);
      }
    }
  }, []);
  
 
  useEffect(() => {
    if (isInitialized && propFormData?.powerOfAttorney) {
      const newData: PowerOfAttorneyData = {
        printNames: propFormData.powerOfAttorney.printNames,
        appointee: propFormData.powerOfAttorney.appointee,
        date: powerOfAttorneyData.date
      };
      
      const oldData = propFormData.powerOfAttorney as any;
      if (oldData.dates && Array.isArray(oldData.dates) && oldData.dates.length > 0) {
        newData.date = oldData.dates[0];
      }
      
      setPowerOfAttorneyData(newData);
      
 
      if (typeof window !== 'undefined') {
        localStorage.setItem(POWER_OF_ATTORNEY_STORAGE_KEY, JSON.stringify(newData));
      }
    }
  }, [propFormData, isInitialized]);

  const handleInputChange = (field: keyof PowerOfAttorneyData, value: string) => {
    const newData = { 
      ...powerOfAttorneyData, 
      [field]: field === 'printNames' || field === 'appointee' ? value.toUpperCase() : value 
    };
    
    setPowerOfAttorneyData(newData);
    
 
    if (typeof window !== 'undefined') {
      localStorage.setItem(POWER_OF_ATTORNEY_STORAGE_KEY, JSON.stringify(newData));
    }
    
    updateField('powerOfAttorney', newData);
    
    if (onChange) {
      onChange(newData);
    }
  };

  const formatDate = (value: string) => {
    const digitsOnly = value.replace(/\D/g, '');
    let formatted = digitsOnly;
    if (formatted.length > 2) {
      formatted = `${formatted.slice(0, 2)}/${formatted.slice(2)}`;
    }
    if (formatted.length > 5) {
      formatted = `${formatted.slice(0, 5)}/${formatted.slice(5)}`;
    }
    return formatted.slice(0, 10);
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