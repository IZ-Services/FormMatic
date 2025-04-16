import React, { useState, useRef, useEffect } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import './VehicleWeightInfo.css';

interface VehicleData {
  licenseNumber: string;
  vin: string;
  make: string;
  gvwWeight: string;
  cgwWeight: string;
  dateOperated: string;
}

interface VehicleDeclarationData {
  vehicles: VehicleData[];
  howMany?: string;
}

interface ValidationError {
  fieldPath: string;
  message: string;
}

interface VehicleDeclarationProps {
  formData?: {
    vehicleDeclaration?: VehicleDeclarationData;
    _showValidationErrors?: boolean;
    [key: string]: any;
  };
  onChange?: (data: VehicleDeclarationData) => void;
  showValidationErrors?: boolean;
}

const WEIGHT_RANGES = [
  { code: 'NONE', range: 'Under 10,001' },
  { code: 'A', range: '10,001-15,000' },
  { code: 'B', range: '15,001-20,000' },
  { code: 'C', range: '20,001-26,000' },
  { code: 'D', range: '26,001-30,000' },
  { code: 'E', range: '30,001-35,000' },
  { code: 'F', range: '35,001-40,000' },
  { code: 'G', range: '40,001-45,000' },
  { code: 'H', range: '45,001-50,000' },
  { code: 'I', range: '50,001-54,999' },
  { code: 'J', range: '55,000-60,000' },
  { code: 'K', range: '60,001-65,000' },
  { code: 'L', range: '65,001-70,000' },
  { code: 'M', range: '70,001-75,000' },
  { code: 'N', range: '75,001-80,000' }
];

const howManyOptions = ['1', '2'];

const VehicleDeclaration: React.FC<VehicleDeclarationProps> = ({ 
  formData: propFormData,
  onChange,
  showValidationErrors = false
}) => {
  const { formData: contextFormData, updateField } = useFormContext();
  
  const formData = {
    ...contextFormData,
    ...propFormData
  };
  
  const [vehicles, setVehicles] = useState<VehicleData[]>([]);
  const [isHowManyMenuOpen, setIsHowManyMenuOpen] = useState(false);
  const [gvwDropdownOpen, setGvwDropdownOpen] = useState<boolean[]>([]);
  const [cgwDropdownOpen, setCgwDropdownOpen] = useState<boolean[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  
  const howManyRef = useRef<HTMLUListElement | null>(null);
  const gvwDropdownRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cgwDropdownRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Use either prop-based or context-based validation flag
  const shouldShowValidationErrors = showValidationErrors || formData?._showValidationErrors === true;

  // Validation function
  const validateVehicleDeclaration = (): ValidationError[] => {
    const errors: ValidationError[] = [];
    
    // Check if we have a valid howMany value
    if (!formData?.vehicleDeclaration?.howMany) {
      errors.push({
        fieldPath: 'vehicleDeclaration.howMany',
        message: 'Please select how many vehicles to declare'
      });
    }
    
    // Check if vehicles array exists and has entries
    if (!vehicles || vehicles.length === 0) {
      errors.push({
        fieldPath: 'vehicleDeclaration.vehicles',
        message: 'At least one vehicle entry is required'
      });
    } else {
      // Validate each vehicle entry
      vehicles.forEach((vehicle, index) => {
        // License number validation
        if (!vehicle.licenseNumber || vehicle.licenseNumber.trim() === '') {
          errors.push({
            fieldPath: `vehicleDeclaration.vehicles[${index}].licenseNumber`,
            message: 'License number is required'
          });
        } else if (!/^[A-Z0-9]{1,7}$/.test(vehicle.licenseNumber)) {
          errors.push({
            fieldPath: `vehicleDeclaration.vehicles[${index}].licenseNumber`,
            message: 'Please enter a valid license plate number'
          });
        }
        
        // VIN validation
        if (!vehicle.vin || vehicle.vin.trim() === '') {
          errors.push({
            fieldPath: `vehicleDeclaration.vehicles[${index}].vin`,
            message: 'VIN is required'
          });
        } else if (!/^[A-Z0-9]{17}$/.test(vehicle.vin)) {
          errors.push({
            fieldPath: `vehicleDeclaration.vehicles[${index}].vin`,
            message: 'Please enter a valid 17-character VIN'
          });
        }
        
        // Make validation
        if (!vehicle.make || vehicle.make.trim() === '') {
          errors.push({
            fieldPath: `vehicleDeclaration.vehicles[${index}].make`,
            message: 'Vehicle make is required'
          });
        } else if (vehicle.make.length > 50) {
          errors.push({
            fieldPath: `vehicleDeclaration.vehicles[${index}].make`,
            message: 'Vehicle make cannot exceed 50 characters'
          });
        }
        
        // GVW weight validation
        if (!vehicle.gvwWeight || vehicle.gvwWeight.trim() === '') {
          errors.push({
            fieldPath: `vehicleDeclaration.vehicles[${index}].gvwWeight`,
            message: 'GVW weight is required'
          });
        }
        
        // CGW weight validation
        if (!vehicle.cgwWeight || vehicle.cgwWeight.trim() === '') {
          errors.push({
            fieldPath: `vehicleDeclaration.vehicles[${index}].cgwWeight`,
            message: 'CGW weight is required'
          });
        }
        
        // Date operated validation
        if (!vehicle.dateOperated || vehicle.dateOperated.trim() === '') {
          errors.push({
            fieldPath: `vehicleDeclaration.vehicles[${index}].dateOperated`,
            message: 'Date operated is required'
          });
        } else {
          // Check if date is valid
          const date = new Date(vehicle.dateOperated);
          const today = new Date();
          if (isNaN(date.getTime())) {
            errors.push({
              fieldPath: `vehicleDeclaration.vehicles[${index}].dateOperated`,
              message: 'Please enter a valid date'
            });
          } else if (date > today) {
            errors.push({
              fieldPath: `vehicleDeclaration.vehicles[${index}].dateOperated`,
              message: 'Date cannot be in the future'
            });
          }
        }
      });
    }
    
    // Validate howMany field against vehicle count
    if (formData?.vehicleDeclaration?.howMany) {
      const count = parseInt(formData.vehicleDeclaration.howMany, 10);
      if (count > 0 && vehicles && vehicles.length !== count) {
        errors.push({
          fieldPath: 'vehicleDeclaration.vehicles',
          message: `You selected ${count} vehicles but provided ${vehicles?.length || 0}`
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
  const shouldShowValidationError = (index: number, field: keyof VehicleData): boolean => {
    if (!shouldShowValidationErrors) return false;
    return validationErrors.some(err => 
      err.fieldPath === `vehicleDeclaration.vehicles[${index}].${field}`
    );
  };

  // Run validation when showing validation errors or when data changes
  useEffect(() => {
    if (shouldShowValidationErrors) {
      const errors = validateVehicleDeclaration();
      setValidationErrors(errors);
      
      // Update global form validation state
      const currentValidationErrors = typeof contextFormData._validationErrors === 'object' && 
        contextFormData._validationErrors !== null
        ? contextFormData._validationErrors
        : {};
        
      updateField('_validationErrors', {
        ...currentValidationErrors,
        vehicleDeclaration: errors.length > 0
      });
    }
  }, [shouldShowValidationErrors, vehicles, formData?.vehicleDeclaration?.howMany]);

  useEffect(() => {
    if (formData?.vehicleDeclaration?.vehicles) {
      setVehicles(formData.vehicleDeclaration.vehicles);
    }
  }, [formData?.vehicleDeclaration?.vehicles]);

  useEffect(() => {
    if (!formData?.vehicleDeclaration?.howMany) {
      const newHowMany = '1';
      updateField('vehicleDeclaration', { 
        ...formData?.vehicleDeclaration,
        howMany: newHowMany 
      });
    }
  }, []);

  useEffect(() => {
    if (!formData?.vehicleDeclaration?.vehicles || formData.vehicleDeclaration.vehicles.length === 0) {
      const initialVehicle = {
        licenseNumber: '',
        vin: '',
        make: '',
        gvwWeight: '',
        cgwWeight: '',
        dateOperated: ''
      };
      const initialVehicles = [initialVehicle];
      
      setVehicles(initialVehicles);
      updateField('vehicleDeclaration', { 
        ...formData?.vehicleDeclaration,
        vehicles: initialVehicles,
        howMany: formData?.vehicleDeclaration?.howMany || '1'
      });
    }
  }, []);

  const handleHowManyChange = (count: string) => {
    const newCount = parseInt(count);
    let newVehicles = [...vehicles];
    
    while (newVehicles.length < newCount) {
      newVehicles.push({
        licenseNumber: '',
        vin: '',
        make: '',
        gvwWeight: '',
        cgwWeight: '',
        dateOperated: ''
      });
    }
    
    while (newVehicles.length > newCount) {
      newVehicles.pop();
    }
    
    setVehicles(newVehicles);
    
    const updatedData = {
      ...formData?.vehicleDeclaration,
      vehicles: newVehicles,
      howMany: count
    };
    
    if (onChange) {
      onChange(updatedData);
    } else {
      updateField('vehicleDeclaration', updatedData);
    }
    
    setIsHowManyMenuOpen(false);
  };

  const handleFieldChange = (index: number, field: keyof VehicleData, value: any) => {
    const newVehicles = [...vehicles];
    newVehicles[index][field] = value;
    
    setVehicles(newVehicles);
    
    const updatedData = {
      ...formData?.vehicleDeclaration,
      vehicles: newVehicles
    };
    
    if (onChange) {
      onChange(updatedData);
    } else {
      updateField('vehicleDeclaration', updatedData);
    }
  };
  
  const toggleGvwDropdown = (index: number) => {
    const newDropdownOpen = [...gvwDropdownOpen];
    newDropdownOpen[index] = !newDropdownOpen[index];
    setGvwDropdownOpen(newDropdownOpen);
  };
  
  const toggleCgwDropdown = (index: number) => {
    const newDropdownOpen = [...cgwDropdownOpen];
    newDropdownOpen[index] = !newDropdownOpen[index];
    setCgwDropdownOpen(newDropdownOpen);
  };
  
  const handleClickOutsideMenus = (e: MouseEvent) => {
    const target = e.target as Element;
    if (howManyRef.current && !howManyRef.current.contains(target) && !target.closest('.howManyDropDown')) {
      setIsHowManyMenuOpen(false);
    }
    
    gvwDropdownRefs.current.forEach((ref, index) => {
      if (ref && !ref.contains(target) && gvwDropdownOpen[index]) {
        const newDropdownOpen = [...gvwDropdownOpen];
        newDropdownOpen[index] = false;
        setGvwDropdownOpen(newDropdownOpen);
      }
    });
    
    cgwDropdownRefs.current.forEach((ref, index) => {
      if (ref && !ref.contains(target) && cgwDropdownOpen[index]) {
        const newDropdownOpen = [...cgwDropdownOpen];
        newDropdownOpen[index] = false;
        setCgwDropdownOpen(newDropdownOpen);
      }
    });
  };
  
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutsideMenus);
    return () => document.removeEventListener('mousedown', handleClickOutsideMenus);
  }, [gvwDropdownOpen, cgwDropdownOpen]);

  useEffect(() => {
    gvwDropdownRefs.current = gvwDropdownRefs.current.slice(0, vehicles.length);
    cgwDropdownRefs.current = cgwDropdownRefs.current.slice(0, vehicles.length);
    
    const newGvwDropdownOpen = Array(vehicles.length).fill(false);
    const newCgwDropdownOpen = Array(vehicles.length).fill(false);
    
    setGvwDropdownOpen(newGvwDropdownOpen);
    setCgwDropdownOpen(newCgwDropdownOpen);
  }, [vehicles.length]);

  return (
    <div className="vehicle-declaration-wrapper">
      <div className="declaration-header">
        <h2 className="declaration-title">Vehicle Declaration Entry</h2>
        <div className="howManyWrapper">
          <button
            onClick={() => setIsHowManyMenuOpen(!isHowManyMenuOpen)}
            className={`howManyDropDown ${shouldShowValidationErrors && getErrorMessage('vehicleDeclaration.howMany') ? 'validation-error' : ''}`}
          >
            {formData?.vehicleDeclaration?.howMany || '1'}
            <ChevronDownIcon className={`howManyIcon ${isHowManyMenuOpen ? 'rotate' : ''}`} />
          </button>
          
          {shouldShowValidationErrors && getErrorMessage('vehicleDeclaration.howMany') && (
            <p className="validation-message">{getErrorMessage('vehicleDeclaration.howMany')}</p>
          )}

          {isHowManyMenuOpen && (
            <ul ref={howManyRef} className="howManyMenu">
              {howManyOptions.map((option) => (
                <li
                  className="howManyLists"
                  key={option}
                  onClick={() => handleHowManyChange(option)}
                >
                  {option}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {shouldShowValidationErrors && getErrorMessage('vehicleDeclaration.vehicles') && (
        <p className="validation-message global-error">{getErrorMessage('vehicleDeclaration.vehicles')}</p>
      )}

      <div className="vehicle-entries">
        {vehicles.map((vehicle, index) => (
          <div key={index} className="vehicle-entry space-y-6">            
            <div className="vehicle-info-section space-y-4">
              <div className="vehicle-info-row vehicle-info-flex-row">
                <div className="vehicle-info-column flex-1">
                  <label htmlFor={`license-${index}`}>Vehicle License Number</label>
                  <input 
                    id={`license-${index}`}
                    type="text" 
                    className={`form-control text-uppercase ${shouldShowValidationError(index, 'licenseNumber') ? 'validation-error' : ''}`}
                    value={vehicle.licenseNumber}
                    onChange={(e) => handleFieldChange(index, 'licenseNumber', e.target.value.toUpperCase())}
                    placeholder="Enter license number"
                  />
                  {shouldShowValidationError(index, 'licenseNumber') && (
                    <p className="validation-message">
                      {getErrorMessage(`vehicleDeclaration.vehicles[${index}].licenseNumber`)}
                    </p>
                  )}
                </div>
                
                <div className="vehicle-info-column flex-1">
                  <label htmlFor={`vin-${index}`}>Vehicle Identification Number</label>
                  <input 
                    id={`vin-${index}`}
                    type="text" 
                    className={`form-control capitalize-first ${shouldShowValidationError(index, 'vin') ? 'validation-error' : ''}`}
                    value={vehicle.vin}
                    onChange={(e) => handleFieldChange(index, 'vin', e.target.value.toUpperCase())}
                    placeholder="Enter VIN"
                  />
                  {shouldShowValidationError(index, 'vin') && (
                    <p className="validation-message">
                      {getErrorMessage(`vehicleDeclaration.vehicles[${index}].vin`)}
                    </p>
                  )}
                </div>
                
                <div className="vehicle-info-column flex-1">
                  <label htmlFor={`make-${index}`}>Vehicle Make</label>
                  <input 
                    id={`make-${index}`}
                    type="text" 
                    className={`form-control capitalize-first ${shouldShowValidationError(index, 'make') ? 'validation-error' : ''}`}
                    value={vehicle.make}
                    onChange={(e) => handleFieldChange(index, 'make', e.target.value)}
                    placeholder="Enter vehicle make"
                  />
                  {shouldShowValidationError(index, 'make') && (
                    <p className="validation-message">
                      {getErrorMessage(`vehicleDeclaration.vehicles[${index}].make`)}
                    </p>
                  )}
                </div>
              </div>

              <div className="vehicle-info-row vehicle-info-flex-row">
                <div className="vehicle-info-column flex-1">
                  <label htmlFor={`gvw-${index}`}>GVW Weight Range</label>
                  <div 
                    ref={(el) => { gvwDropdownRefs.current[index] = el; }} 
                    className="dropdown-wrapper"
                  >
                    <input 
                      id={`gvw-${index}`}
                      type="text" 
                      className={`form-control ${shouldShowValidationError(index, 'gvwWeight') ? 'validation-error' : ''}`}
                      value={vehicle.gvwWeight}
                      readOnly
                      onClick={() => toggleGvwDropdown(index)}
                      placeholder="Select GVW range"
                    />
                    {shouldShowValidationError(index, 'gvwWeight') && (
                      <p className="validation-message">
                        {getErrorMessage(`vehicleDeclaration.vehicles[${index}].gvwWeight`)}
                      </p>
                    )}
                    
                    {gvwDropdownOpen[index] && (
                      <ul className="dropdown-menu">
                        {WEIGHT_RANGES.map((weight) => (
                          <li
                            key={weight.code}
                            onClick={() => {
                              handleFieldChange(index, 'gvwWeight', weight.range);
                              toggleGvwDropdown(index);
                            }}
                          >
                            {weight.range}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                
                <div className="vehicle-info-column flex-1">
                  <label htmlFor={`cgw-${index}`}>CGW Weight Range</label>
                  <div 
                    ref={(el) => { cgwDropdownRefs.current[index] = el; }} 
                    className="dropdown-wrapper"
                  >
                    <input 
                      id={`cgw-${index}`}
                      type="text" 
                      className={`form-control ${shouldShowValidationError(index, 'cgwWeight') ? 'validation-error' : ''}`}
                      value={vehicle.cgwWeight}
                      readOnly
                      onClick={() => toggleCgwDropdown(index)}
                      placeholder="Select CGW range"
                    />
                    {shouldShowValidationError(index, 'cgwWeight') && (
                      <p className="validation-message">
                        {getErrorMessage(`vehicleDeclaration.vehicles[${index}].cgwWeight`)}
                      </p>
                    )}
                    
                    {cgwDropdownOpen[index] && (
                      <ul className="dropdown-menu">
                        {WEIGHT_RANGES.map((weight) => (
                          <li
                            key={weight.code}
                            onClick={() => {
                              handleFieldChange(index, 'cgwWeight', weight.range);
                              toggleCgwDropdown(index);
                            }}
                          >
                            {weight.range}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                
                <div className="vehicle-info-column flex-1">
                  <label htmlFor={`date-${index}`}>Date Operated</label>
                  <input 
                    id={`date-${index}`}
                    type="date" 
                    className={`form-control ${shouldShowValidationError(index, 'dateOperated') ? 'validation-error' : ''}`}
                    value={vehicle.dateOperated}
                    onChange={(e) => handleFieldChange(index, 'dateOperated', e.target.value)}
                  />
                  {shouldShowValidationError(index, 'dateOperated') && (
                    <p className="validation-message">
                      {getErrorMessage(`vehicleDeclaration.vehicles[${index}].dateOperated`)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VehicleDeclaration;