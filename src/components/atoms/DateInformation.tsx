import React, { useState, useEffect } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import './DateInformation.css';

interface DateInformationData {
  enteredCalifornia?: {
    month: string;
    day: string;
    year: string;
  };
  firstOperated?: {
    month: string;
    day: string;
    year: string;
  };
  becameResident?: {
    month: string;
    day: string;
    year: string;
  };
  purchased?: {
    month: string;
    day: string;
    year: string;
  };
}

interface ValidationError {
  fieldPath: string;
  message: string;
}

interface FormDataType {
  dateInformation?: DateInformationData;
  _showValidationErrors?: boolean;
  [key: string]: any;
}

interface DateInformationProps {
  formData?: FormDataType;
  onChange?: (data: DateInformationData) => void;
  showValidationErrors?: boolean;
}

const DateInformation: React.FC<DateInformationProps> = ({
  formData: propFormData,
  onChange,
  showValidationErrors = false
}) => {
  const { formData: contextFormData, updateField } = useFormContext();

  const combinedFormData: FormDataType = {
    ...contextFormData,
    ...propFormData
  };

  const [dateData, setDateData] = useState<DateInformationData>({
    enteredCalifornia: { month: '', day: '', year: '' },
    firstOperated: { month: '', day: '', year: '' },
    becameResident: { month: '', day: '', year: '' },
    purchased: { month: '', day: '', year: '' }
  });
  
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  
  // Use either prop-based or context-based validation flag
  const shouldShowValidationErrors = showValidationErrors || combinedFormData?._showValidationErrors === true;

  useEffect(() => {
    const mergedData: DateInformationData = {
      enteredCalifornia: { month: '', day: '', year: '' },
      firstOperated: { month: '', day: '', year: '' },
      becameResident: { month: '', day: '', year: '' },
      purchased: { month: '', day: '', year: '' },
      ...combinedFormData?.dateInformation
    };
    setDateData(mergedData);
  }, [combinedFormData?.dateInformation]);

  // Validation function
  const validateDateInformation = (): ValidationError[] => {
    const errors: ValidationError[] = [];
    const today = new Date();
    
    // Helper function to validate a date
    const validateDate = (
      section: keyof DateInformationData, 
      required: boolean = true
    ) => {
      const dateSection = dateData[section];
      
      // Check if date is required but missing
      if (required && (!dateSection?.month || !dateSection?.day || !dateSection?.year)) {
        errors.push({
          fieldPath: `dateInformation.${section}`,
          message: `Complete date is required`
        });
        return;
      }
      
      // If any part is filled, all parts must be filled
      if (
        (dateSection?.month || dateSection?.day || dateSection?.year) && 
        (!dateSection?.month || !dateSection?.day || !dateSection?.year)
      ) {
        errors.push({
          fieldPath: `dateInformation.${section}`,
          message: `Complete date is required`
        });
        return;
      }
      
      // Skip further validation if date is incomplete
      if (!dateSection?.month || !dateSection?.day || !dateSection?.year) {
        return;
      }
      
      // Validate month (1-12)
      const month = parseInt(dateSection.month, 10);
      if (isNaN(month) || month < 1 || month > 12) {
        errors.push({
          fieldPath: `dateInformation.${section}.month`,
          message: 'Month must be between 1 and 12'
        });
      }
      
      // Validate day (1-31, depending on month)
      const day = parseInt(dateSection.day, 10);
      
      // Get days in month
      const getDaysInMonth = (month: number, year: number) => {
        return new Date(year, month, 0).getDate();
      };
      
      const year = parseInt(dateSection.year, 10);
      if (!isNaN(month) && !isNaN(year)) {
        const daysInMonth = getDaysInMonth(month, year);
        
        if (isNaN(day) || day < 1 || day > daysInMonth) {
          errors.push({
            fieldPath: `dateInformation.${section}.day`,
            message: `Day must be between 1 and ${daysInMonth} for this month`
          });
        }
      } else if (isNaN(day) || day < 1 || day > 31) {
        errors.push({
          fieldPath: `dateInformation.${section}.day`,
          message: 'Day must be between 1 and 31'
        });
      }
      
      // Validate year (reasonable range)
      if (isNaN(year) || year < 1900 || year > today.getFullYear()) {
        errors.push({
          fieldPath: `dateInformation.${section}.year`,
          message: `Year must be between 1900 and ${today.getFullYear()}`
        });
        return;
      }
      
      // Check if date is in the future
      if (!isNaN(month) && !isNaN(day) && !isNaN(year)) {
        const inputDate = new Date(year, month - 1, day);
        if (inputDate > today) {
          errors.push({
            fieldPath: `dateInformation.${section}`,
            message: 'Date cannot be in the future'
          });
        }
      }
    };
    
    // Validate each date section
    validateDate('enteredCalifornia');
    validateDate('firstOperated');
    validateDate('becameResident');
    validateDate('purchased');
    
    // Check that date first operated is not before date entered California
    if (dateData.enteredCalifornia?.month && dateData.enteredCalifornia?.day && 
        dateData.enteredCalifornia?.year && dateData.firstOperated?.month && 
        dateData.firstOperated?.day && dateData.firstOperated?.year) {
      
      const enteredDate = new Date(
        parseInt(dateData.enteredCalifornia.year),
        parseInt(dateData.enteredCalifornia.month) - 1,
        parseInt(dateData.enteredCalifornia.day)
      );
      
      const operatedDate = new Date(
        parseInt(dateData.firstOperated.year),
        parseInt(dateData.firstOperated.month) - 1,
        parseInt(dateData.firstOperated.day)
      );
      
      if (!isNaN(enteredDate.getTime()) && !isNaN(operatedDate.getTime()) && 
          operatedDate < enteredDate) {
        errors.push({
          fieldPath: 'dateInformation.firstOperated',
          message: 'Date first operated cannot be before date entered California'
        });
      }
    }
    
    return errors;
  };
  
  // Helper to get error message for a field
  const getErrorMessage = (fieldPath: string): string | null => {
    const error = validationErrors.find(err => err.fieldPath === fieldPath);
    return error ? error.message : null;
  };
  
  // Check if a specific field should show validation error
  const shouldShowValidationError = (
    section: keyof DateInformationData, 
    field?: 'month' | 'day' | 'year'
  ): boolean => {
    if (!shouldShowValidationErrors) return false;
    
    if (field) {
      return validationErrors.some(err => 
        err.fieldPath === `dateInformation.${section}.${field}` || 
        err.fieldPath === `dateInformation.${section}`
      );
    }
    
    return validationErrors.some(err => 
      err.fieldPath === `dateInformation.${section}` ||
      err.fieldPath.startsWith(`dateInformation.${section}.`)
    );
  };
  
  // Run validation when showing validation errors or when data changes
  useEffect(() => {
    if (shouldShowValidationErrors) {
      const errors = validateDateInformation();
      setValidationErrors(errors);
      
      // Update global form validation state
      const currentValidationErrors = typeof contextFormData._validationErrors === 'object' && 
        contextFormData._validationErrors !== null
        ? contextFormData._validationErrors
        : {};
        
      updateField('_validationErrors', {
        ...currentValidationErrors,
        dateInformation: errors.length > 0
      });
    }
  }, [shouldShowValidationErrors, dateData]);

  const handleDateChange = (
    section: keyof DateInformationData,
    field: 'month' | 'day' | 'year',
    value: string
  ) => {
    // Only allow numeric input
    const numericValue = value.replace(/[^0-9]/g, '');
    
    const newData = {
      ...dateData,
      [section]: {
        ...dateData[section],
        [field]: numericValue
      }
    };

    setDateData(newData);
    
    if (onChange) {
      onChange(newData);
    } else {
      updateField('dateInformation', newData);
    }
  };

  return (
    <div className="dateInformationWrapper">
      <div className="headerRow">
        <h3 className="sectionHeading">DATE INFORMATION</h3>
      </div>

      <div className="dateSection">
        <div className="dateLabel">DATE VEHICLE ENTERED OR WILL ENTER CALIFORNIA (CA):</div>
        <div className="dateInputRow">
          <div className="dateInputGroup">
            <label>Month</label>
            <input
              type="text"
              maxLength={2}
              value={dateData.enteredCalifornia?.month || ''}
              onChange={(e) => handleDateChange('enteredCalifornia', 'month', e.target.value)}
              className={`dateInput ${shouldShowValidationError('enteredCalifornia', 'month') ? 'validation-error' : ''}`}
              placeholder="MM"
            />
          </div>
          <div className="dateInputGroup">
            <label>Day</label>
            <input
              type="text"
              maxLength={2}
              value={dateData.enteredCalifornia?.day || ''}
              onChange={(e) => handleDateChange('enteredCalifornia', 'day', e.target.value)}
              className={`dateInput ${shouldShowValidationError('enteredCalifornia', 'day') ? 'validation-error' : ''}`}
              placeholder="DD"
            />
          </div>
          <div className="dateInputGroup">
            <label>Year</label>
            <input
              type="text"
              maxLength={4}
              value={dateData.enteredCalifornia?.year || ''}
              onChange={(e) => handleDateChange('enteredCalifornia', 'year', e.target.value)}
              className={`dateInput ${shouldShowValidationError('enteredCalifornia', 'year') ? 'validation-error' : ''}`}
              placeholder="YYYY"
            />
          </div>
          {shouldShowValidationError('enteredCalifornia') && (
            <div className="validation-message">
              {getErrorMessage(`dateInformation.enteredCalifornia`) || 
               getErrorMessage(`dateInformation.enteredCalifornia.month`) || 
               getErrorMessage(`dateInformation.enteredCalifornia.day`) || 
               getErrorMessage(`dateInformation.enteredCalifornia.year`)}
            </div>
          )}
        </div>
      </div>

      <div className="dateSection">
        <div className="dateLabel">DATE VEHICLE FIRST OPERATED IN CALIFORNIA:</div>
        <div className="dateInputRow">
          <div className="dateInputGroup">
            <label>Month</label>
            <input
              type="text"
              maxLength={2}
              value={dateData.firstOperated?.month || ''}
              onChange={(e) => handleDateChange('firstOperated', 'month', e.target.value)}
              className={`dateInput ${shouldShowValidationError('firstOperated', 'month') ? 'validation-error' : ''}`}
              placeholder="MM"
            />
          </div>
          <div className="dateInputGroup">
            <label>Day</label>
            <input
              type="text"
              maxLength={2}
              value={dateData.firstOperated?.day || ''}
              onChange={(e) => handleDateChange('firstOperated', 'day', e.target.value)}
              className={`dateInput ${shouldShowValidationError('firstOperated', 'day') ? 'validation-error' : ''}`}
              placeholder="DD"
            />
          </div>
          <div className="dateInputGroup">
            <label>Year</label>
            <input
              type="text"
              maxLength={4}
              value={dateData.firstOperated?.year || ''}
              onChange={(e) => handleDateChange('firstOperated', 'year', e.target.value)}
              className={`dateInput ${shouldShowValidationError('firstOperated', 'year') ? 'validation-error' : ''}`}
              placeholder="YYYY"
            />
          </div>
          {shouldShowValidationError('firstOperated') && (
            <div className="validation-message">
              {getErrorMessage(`dateInformation.firstOperated`) || 
               getErrorMessage(`dateInformation.firstOperated.month`) || 
               getErrorMessage(`dateInformation.firstOperated.day`) || 
               getErrorMessage(`dateInformation.firstOperated.year`)}
            </div>
          )}
        </div>
      </div>

      <div className="dateSection">
        <div className="dateLabel">DATE YOU WENT TO WORK IN CALIFORNIA, OBTAINED A CA DRIVER LICENSE, OR BECAME A RESIDENT:</div>
        <div className="dateInputRow">
          <div className="dateInputGroup">
            <label>Month</label>
            <input
              type="text"
              maxLength={2}
              value={dateData.becameResident?.month || ''}
              onChange={(e) => handleDateChange('becameResident', 'month', e.target.value)}
              className={`dateInput ${shouldShowValidationError('becameResident', 'month') ? 'validation-error' : ''}`}
              placeholder="MM"
            />
          </div>
          <div className="dateInputGroup">
            <label>Day</label>
            <input
              type="text"
              maxLength={2}
              value={dateData.becameResident?.day || ''}
              onChange={(e) => handleDateChange('becameResident', 'day', e.target.value)}
              className={`dateInput ${shouldShowValidationError('becameResident', 'day') ? 'validation-error' : ''}`}
              placeholder="DD"
            />
          </div>
          <div className="dateInputGroup">
            <label>Year</label>
            <input
              type="text"
              maxLength={4}
              value={dateData.becameResident?.year || ''}
              onChange={(e) => handleDateChange('becameResident', 'year', e.target.value)}
              className={`dateInput ${shouldShowValidationError('becameResident', 'year') ? 'validation-error' : ''}`}
              placeholder="YYYY"
            />
          </div>
          {shouldShowValidationError('becameResident') && (
            <div className="validation-message">
              {getErrorMessage(`dateInformation.becameResident`) || 
               getErrorMessage(`dateInformation.becameResident.month`) || 
               getErrorMessage(`dateInformation.becameResident.day`) || 
               getErrorMessage(`dateInformation.becameResident.year`)}
            </div>
          )}
        </div>
      </div>

      <div className="dateSection">
        <div className="dateLabel">DATE VEHICLE WAS PURCHASED OR ACQUIRED:</div>
        <div className="dateInputRow">
          <div className="dateInputGroup">
            <label>Month</label>
            <input
              type="text"
              maxLength={2}
              value={dateData.purchased?.month || ''}
              onChange={(e) => handleDateChange('purchased', 'month', e.target.value)}
              className={`dateInput ${shouldShowValidationError('purchased', 'month') ? 'validation-error' : ''}`}
              placeholder="MM"
            />
          </div>
          <div className="dateInputGroup">
            <label>Day</label>
            <input
              type="text"
              maxLength={2}
              value={dateData.purchased?.day || ''}
              onChange={(e) => handleDateChange('purchased', 'day', e.target.value)}
              className={`dateInput ${shouldShowValidationError('purchased', 'day') ? 'validation-error' : ''}`}
              placeholder="DD"
            />
          </div>
          <div className="dateInputGroup">
            <label>Year</label>
            <input
              type="text"
              maxLength={4}
              value={dateData.purchased?.year || ''}
              onChange={(e) => handleDateChange('purchased', 'year', e.target.value)}
              className={`dateInput ${shouldShowValidationError('purchased', 'year') ? 'validation-error' : ''}`}
              placeholder="YYYY"
            />
          </div>
          {shouldShowValidationError('purchased') && (
            <div className="validation-message">
              {getErrorMessage(`dateInformation.purchased`) || 
               getErrorMessage(`dateInformation.purchased.month`) || 
               getErrorMessage(`dateInformation.purchased.day`) || 
               getErrorMessage(`dateInformation.purchased.year`)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DateInformation;