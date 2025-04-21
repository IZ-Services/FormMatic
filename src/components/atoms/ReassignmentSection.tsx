'use client';
import React, { useState, useEffect } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import './ReassignmentSection.css';

interface ReassignmentSectionType {
  specialInterestLicensePlate?: string;
  removedFrom?: string;
  placedOnLicensePlate?: string;
  placedOnVehicle?: string;
  retainInterest?: boolean;
  releaseInterestDMV?: boolean;
  releaseInterestNewOwner?: boolean;
  feeEnclosed?: boolean;
}

interface ValidationError {
  field: string;
  message: string;
}

interface ReassignmentSectionProps {
  formData?: {
    reassignmentSection?: ReassignmentSectionType;
  };
  showValidationErrors?: boolean;
}

const initialReassignmentSection: ReassignmentSectionType = {
  specialInterestLicensePlate: '',
  removedFrom: '',
  placedOnLicensePlate: '',
  placedOnVehicle: '',
  retainInterest: false,
  releaseInterestDMV: false,
  releaseInterestNewOwner: false,
  feeEnclosed: false,
};

const ReassignmentSection: React.FC<ReassignmentSectionProps> = ({ 
  formData: propFormData,
  showValidationErrors = false
}) => {
  const { formData: contextFormData, updateField } = useFormContext();
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);


  const getFormDataSafely = () => {
    const combined = {
      ...contextFormData,
      ...propFormData
    };
    
    if (!combined.reassignmentSection) {
      return {
        ...combined,
        reassignmentSection: initialReassignmentSection
      };
    }
    
    return combined;
  };

  const safeFormData = getFormDataSafely();


  const validateReassignmentSection = (): ValidationError[] => {
    const errors: ValidationError[] = [];
    const info = safeFormData.reassignmentSection || initialReassignmentSection;
    

    if (!info.specialInterestLicensePlate) {
      errors.push({
        field: 'specialInterestLicensePlate',
        message: 'Special interest license plate number is required'
      });
    } else if (!/^[A-Z0-9]{1,7}$/.test(info.specialInterestLicensePlate)) {
      errors.push({
        field: 'specialInterestLicensePlate',
        message: 'Please enter a valid license plate number'
      });
    }
    

    if (!info.removedFrom) {
      errors.push({
        field: 'removedFrom',
        message: 'VIN number is required'
      });
    } else if (!/^[A-Z0-9]{17}$/.test(info.removedFrom)) {
      errors.push({
        field: 'removedFrom',
        message: 'Please enter a valid 17-character VIN'
      });
    }
    

    if (!info.retainInterest && !info.releaseInterestDMV && !info.releaseInterestNewOwner) {
      errors.push({
        field: 'interestOptions',
        message: 'Please select one of the options'
      });
    }
    

    if (info.retainInterest || info.releaseInterestNewOwner) {

      if (!info.placedOnLicensePlate && !info.placedOnVehicle) {
        errors.push({
          field: 'placedOn',
          message: 'Please provide either a license plate or vehicle identification number'
        });
      }
    }
    

    if (info.placedOnLicensePlate) {
      if (!/^[A-Z0-9]{1,7}$/.test(info.placedOnLicensePlate)) {
        errors.push({
          field: 'placedOnLicensePlate',
          message: 'Please enter a valid license plate number (up to 7 characters)'
        });
      }
    }
    

    if (info.placedOnVehicle) {
      if (info.placedOnVehicle.length < 17) {
        errors.push({
          field: 'placedOnVehicle',
          message: 'VIN must be exactly 17 characters'
        });
      } else if (!/^[A-Z0-9]{17}$/.test(info.placedOnVehicle)) {
        errors.push({
          field: 'placedOnVehicle',
          message: 'Please enter a valid VIN format (letters and numbers only)'
        });
      }
    }
    

    if (info.retainInterest && !info.feeEnclosed) {
      errors.push({
        field: 'feeEnclosed',
        message: 'Fee is required when retaining interest'
      });
    }
    
    return errors;
  };


  const getErrorMessage = (field: string): string | null => {
    const error = validationErrors.find(err => err.field === field);
    return error ? error.message : null;
  };


  useEffect(() => {
    if (!contextFormData.reassignmentSection) {
      updateField('reassignmentSection', initialReassignmentSection);
    }
  }, [contextFormData.reassignmentSection, updateField]);


  useEffect(() => {
    if (showValidationErrors) {
      const errors = validateReassignmentSection();
      setValidationErrors(errors);
      

      const hasErrors = errors.length > 0;
      updateField('_validationErrors', (prev: any) => {

        if (prev?.reassignmentSection !== hasErrors) {
          return {
            ...prev,
            reassignmentSection: hasErrors
          };
        }
        return prev;
      });
    }
  }, [
    showValidationErrors, 
    safeFormData.reassignmentSection?.specialInterestLicensePlate,
    safeFormData.reassignmentSection?.removedFrom,
    safeFormData.reassignmentSection?.placedOnLicensePlate,
    safeFormData.reassignmentSection?.placedOnVehicle,
    safeFormData.reassignmentSection?.retainInterest,
    safeFormData.reassignmentSection?.releaseInterestDMV,
    safeFormData.reassignmentSection?.releaseInterestNewOwner,
    safeFormData.reassignmentSection?.feeEnclosed
  ]);

  const handleChange = (field: keyof ReassignmentSectionType, value: any) => {
    const currentInfo = (safeFormData.reassignmentSection || {}) as ReassignmentSectionType;
    const newData = { ...currentInfo, [field]: value };
    

    if (field === 'releaseInterestDMV' && value === true) {
      newData.releaseInterestNewOwner = false;
    } else if (field === 'releaseInterestNewOwner' && value === true) {
      newData.releaseInterestDMV = false;
    }
    
    if (field === 'retainInterest' && value === true) {
      newData.releaseInterestDMV = false;
      newData.releaseInterestNewOwner = false;
    } else if ((field === 'releaseInterestDMV' || field === 'releaseInterestNewOwner') && value === true) {
      newData.retainInterest = false;
      
      if (currentInfo.feeEnclosed) {
        newData.feeEnclosed = false;
      }
    }
    

    if (field === 'placedOnLicensePlate' || field === 'specialInterestLicensePlate') {

      const formattedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 7);
      newData[field] = formattedValue;
    } else if (field === 'placedOnVehicle' || field === 'removedFrom') {

      const formattedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 17);
      newData[field] = formattedValue;
    }
    
    updateField('reassignmentSection', newData);
    

    if (showValidationErrors) {
      setTimeout(() => {
        const errors = validateReassignmentSection();
        setValidationErrors(errors);
      }, 0);
    }
  };

  return (
    <div className="reassignmentWrapper">
      <div className="reassignmentHeader">
        <h3 className="reassignmentTitle">REASSIGN, RETAIN INTEREST, OR RELEASE INTEREST</h3>
        {showValidationErrors && validationErrors.length > 0 && (
          <div className="headerErrorMessage">Please complete all required fields below</div>
        )}
      </div>
      
      <div className="reassignmentContent">
        <div className="reassignmentInputRow">
          <div className="reassignmentInput">
            <label className="reassignmentLabel">SPECIAL INTEREST LICENSE PLATE NUMBER</label>
            <input
              type="text"
              className={`textInput ${showValidationErrors && getErrorMessage('specialInterestLicensePlate') ? 'error-input' : ''}`}
              value={safeFormData.reassignmentSection ? safeFormData.reassignmentSection.specialInterestLicensePlate || '' : ''}
              onChange={(e) => handleChange('specialInterestLicensePlate', e.target.value)}
              placeholder="ENTER PLATE NUMBER"
              maxLength={7}
              style={{ textTransform: 'uppercase' }}
            />
            {showValidationErrors && getErrorMessage('specialInterestLicensePlate') && (
              <div className="error-message">{getErrorMessage('specialInterestLicensePlate')}</div>
            )}
          </div>
          
          <div className="reassignmentInput">
            <label className="reassignmentLabel">REMOVED FROM (VEHICLE IDENTIFICATION NUMBER)</label>
            <input
              type="text"
              className={`textInput ${showValidationErrors && getErrorMessage('removedFrom') ? 'error-input' : ''}`}
              value={safeFormData.reassignmentSection ? safeFormData.reassignmentSection.removedFrom || '' : ''}
              onChange={(e) => handleChange('removedFrom', e.target.value)}
              placeholder="ENTER VIN"
              maxLength={17}
              style={{ textTransform: 'uppercase' }}
            />
            {showValidationErrors && getErrorMessage('removedFrom') && (
              <div className="error-message">{getErrorMessage('removedFrom')}</div>
            )}
          </div>
          
          <div className="reassignmentInput">
            <label className="reassignmentLabel">PLACED ON (CURRENT LICENSE PLATE)</label>
            <input
              type="text"
              className={`textInput ${showValidationErrors && (
                getErrorMessage('placedOnLicensePlate') || getErrorMessage('placedOn')) ? 'error-input' : ''}`}
              value={safeFormData.reassignmentSection ? safeFormData.reassignmentSection.placedOnLicensePlate || '' : ''}
              onChange={(e) => handleChange('placedOnLicensePlate', e.target.value)}
              placeholder="ENTER LICENSE PLATE"
              maxLength={7}
              style={{ textTransform: 'uppercase' }}
            />
            {showValidationErrors && getErrorMessage('placedOnLicensePlate') && (
              <div className="error-message">{getErrorMessage('placedOnLicensePlate')}</div>
            )}
            {showValidationErrors && getErrorMessage('placedOn') && 
             !getErrorMessage('placedOnLicensePlate') && 
             !getErrorMessage('placedOnVehicle') && (
              <div className="error-message">{getErrorMessage('placedOn')}</div>
            )}
          </div>
          
          <div className="reassignmentInput">
            <label className="reassignmentLabel">PLACED ON (VEHICLE IDENTIFICATION NUMBER)</label>
            <input
              type="text"
              className={`textInput ${showValidationErrors && (
                getErrorMessage('placedOnVehicle') || getErrorMessage('placedOn')) ? 'error-input' : ''}`}
              value={safeFormData.reassignmentSection ? safeFormData.reassignmentSection.placedOnVehicle || '' : ''}
              onChange={(e) => handleChange('placedOnVehicle', e.target.value)}
              placeholder="ENTER VIN"
              maxLength={17}
              style={{ textTransform: 'uppercase' }}
            />
            {showValidationErrors && getErrorMessage('placedOnVehicle') && (
              <div className="error-message">{getErrorMessage('placedOnVehicle')}</div>
            )}
            {showValidationErrors && getErrorMessage('placedOn') && 
             !getErrorMessage('placedOnLicensePlate') && 
             !getErrorMessage('placedOnVehicle') && (
              <div className="error-message">{getErrorMessage('placedOn')}</div>
            )}
          </div>
        </div>
        {showValidationErrors && getErrorMessage('interestOptions') && (
            <div className="error-message option-error">{getErrorMessage('interestOptions')}</div>
          )}
        <div className="reassignmentOptionsRow">
          
          <div className="retainSection">
            <label className="optionLabel">
              <input
                type="checkbox"
                checked={safeFormData.reassignmentSection ? safeFormData.reassignmentSection.retainInterest || false : false}
                onChange={(e) => handleChange('retainInterest', e.target.checked)}
                className={`optionCheckbox ${showValidationErrors && getErrorMessage('interestOptions') ? 'error-checkbox' : ''}`}
              />
              <div className="optionText">
                <span className="optionTitle">RETAIN INTEREST FOR FUTURE USE.</span>
              </div>
            </label>
            
            <label className="feeLabel">
              <input
                type="checkbox"
                checked={safeFormData.reassignmentSection ? safeFormData.reassignmentSection.feeEnclosed || false : false}
                onChange={(e) => handleChange('feeEnclosed', e.target.checked)}
                className={`feeCheckbox ${showValidationErrors && getErrorMessage('feeEnclosed') ? 'error-checkbox' : ''}`}
                disabled={!safeFormData.reassignmentSection || !safeFormData.reassignmentSection.retainInterest}
              />
              <span className="feeText">Fee enclosed</span>
              {showValidationErrors && getErrorMessage('feeEnclosed') && (
                <div className="error-message fee-error">{getErrorMessage('feeEnclosed')}</div>
              )}
            </label>
          </div>
          
          <div className="releaseSection">
            <label className="optionLabel">
              <input
                type="checkbox"
                checked={safeFormData.reassignmentSection ? safeFormData.reassignmentSection.releaseInterestDMV || false : false}
                onChange={(e) => handleChange('releaseInterestDMV', e.target.checked)}
                className={`optionCheckbox ${showValidationErrors && getErrorMessage('interestOptions') ? 'error-checkbox' : ''}`}
              />
              <span className="optionTitle">RELEASE INTEREST/SURRENDER TO DMV</span>
            </label>
            
            <label className="optionLabel">
              <input
                type="checkbox"
                checked={safeFormData.reassignmentSection ? safeFormData.reassignmentSection.releaseInterestNewOwner || false : false}
                onChange={(e) => handleChange('releaseInterestNewOwner', e.target.checked)}
                className={`optionCheckbox ${showValidationErrors && getErrorMessage('interestOptions') ? 'error-checkbox' : ''}`}
              />
              <span className="optionTitle">RELEASE INTEREST TO NEW OWNER</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReassignmentSection;