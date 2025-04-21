import React, { useState, useEffect } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import './LicensePlate.css';

interface LicensePlateData {
  oneMissingPlate?: boolean;
  twoMissingPlates?: boolean;
}

interface ValidationError {
  field: string;
  message: string;
}

interface LicensePlateProps {
  formData?: {
    licensePlate?: LicensePlateData;
  };
  showValidationErrors?: boolean;
}

export const LICENSE_PLATE_STORAGE_KEY = 'formmatic_license_plate';

export const clearLicensePlateStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(LICENSE_PLATE_STORAGE_KEY);
    console.log('License plate data cleared from localStorage');
  }
};

const LicensePlate: React.FC<LicensePlateProps> = ({ 
  formData: propFormData,
  showValidationErrors = false
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [licensePlateData, setLicensePlateData] = useState<LicensePlateData>({});
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const { updateField, clearFormTriggered, formData: contextFormData } = useFormContext();

  const defaultLicensePlateData: LicensePlateData = {
    oneMissingPlate: false,
    twoMissingPlates: false
  };


  const validateLicensePlate = (): ValidationError[] => {
    const errors: ValidationError[] = [];
    

    if (!licensePlateData.oneMissingPlate && !licensePlateData.twoMissingPlates) {
      errors.push({
        field: 'general',
        message: 'Please select at least one license plate option'
      });
    }
    
    return errors;
  };


  useEffect(() => {
    if (showValidationErrors) {
      const errors = validateLicensePlate();
      setValidationErrors(errors);
      


      const currentValidationErrors = typeof contextFormData._validationErrors === 'object' && contextFormData._validationErrors !== null
        ? contextFormData._validationErrors
        : {};
        
      updateField('_validationErrors', {
        ...currentValidationErrors,
        licensePlate: errors.length > 0
      });
    }
  }, [showValidationErrors, licensePlateData]);

  useEffect(() => {
    if (clearFormTriggered) {
      console.log('Clear form triggered in LicensePlate component');
      clearLicensePlateStorage();
      setLicensePlateData(defaultLicensePlateData);
      
      updateField('licensePlate', defaultLicensePlateData);
    }
  }, [clearFormTriggered]);
  
  useEffect(() => {
    if (typeof window !== 'undefined' && !isInitialized) {
      try {
        const savedData = localStorage.getItem(LICENSE_PLATE_STORAGE_KEY);
        
        if (savedData) {
          console.log("Loading license plate data from localStorage");
          const parsedData = JSON.parse(savedData);
          
          const mergedData = {
            ...parsedData,
            ...(propFormData?.licensePlate || {})
          };
          
          setLicensePlateData(mergedData);
          
          updateField('licensePlate', mergedData);
        } else if (propFormData?.licensePlate) {
          setLicensePlateData(propFormData.licensePlate);
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Error loading saved license plate data:', error);
        setIsInitialized(true);
        
        if (propFormData?.licensePlate) {
          setLicensePlateData(propFormData.licensePlate);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (isInitialized && propFormData?.licensePlate) {
      setLicensePlateData(propFormData.licensePlate);
    }
  }, [propFormData, isInitialized]);

  const handleLicensePlateChange = (field: keyof LicensePlateData, value: boolean) => {
    const newData = { 
      ...licensePlateData,
      oneMissingPlate: field === 'oneMissingPlate' ? value : false,
      twoMissingPlates: field === 'twoMissingPlates' ? value : false
    };
    
    setLicensePlateData(newData);
    updateField('licensePlate', newData);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(LICENSE_PLATE_STORAGE_KEY, JSON.stringify(newData));
    }
    

    if (showValidationErrors) {
      const errors = validateLicensePlate();
      setValidationErrors(errors);
      


      const currentValidationErrors = typeof contextFormData._validationErrors === 'object' && contextFormData._validationErrors !== null
        ? contextFormData._validationErrors
        : {};
        
      updateField('_validationErrors', {
        ...currentValidationErrors,
        licensePlate: errors.length > 0
      });
    }
  };


  const getErrorMessage = (field: string): string | null => {
    const error = validationErrors.find(err => err.field === field);
    return error ? error.message : null;
  };

  return (
    <div className="license-plate-wrapper">
      <div className="section-header">
        <h3 className="section-title">License Plate</h3>
      </div>

      {showValidationErrors && getErrorMessage('general') && (
        <div className="validation-errorr">
          {getErrorMessage('general')}
        </div>
      )}

      <div className="license-plate-content">
        <div className="license-plate-options">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={licensePlateData.oneMissingPlate || false}
              onChange={(e) => handleLicensePlateChange('oneMissingPlate', e.target.checked)}
            />
            One license plate missing (automobiles/two-plate commercial vehicles/pick-ups only)
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={licensePlateData.twoMissingPlates || false}
              onChange={(e) => handleLicensePlateChange('twoMissingPlates', e.target.checked)}
            />
            Two license plates are missing or one plate is missing for a single-plate commercial truck tractor, motorcycle, or trailer
          </label>
        </div>
      </div>
    </div>
  );
};

export default LicensePlate;