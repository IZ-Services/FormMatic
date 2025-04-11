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

interface VehicleDeclarationProps {
  formData?: {
    vehicleDeclaration?: VehicleDeclarationData;
    _showValidationErrors?: boolean;
    [key: string]: any;
  };
  onChange?: (data: VehicleDeclarationData) => void;
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



const VehicleDeclaration: React.FC<VehicleDeclarationProps> = ({ formData: propFormData }) => {
  const { formData: contextFormData, updateField } = useFormContext();
  
  const formData = {
    ...contextFormData,
    ...propFormData
  };
  
  const [vehicles, setVehicles] = useState<VehicleData[]>([]);
  const [isHowManyMenuOpen, setIsHowManyMenuOpen] = useState(false);
  const [gvwDropdownOpen, setGvwDropdownOpen] = useState<boolean[]>([]);
  const [cgwDropdownOpen, setCgwDropdownOpen] = useState<boolean[]>([]);
  
  const howManyRef = useRef<HTMLUListElement | null>(null);
  const gvwDropdownRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cgwDropdownRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  const showValidationErrors = formData?._showValidationErrors === true;

  const shouldShowValidationError = (index: number, field: keyof VehicleData) => {
    return showValidationErrors && (!vehicles[index][field] || vehicles[index][field] === '');
  };

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
    updateField('vehicleDeclaration', { 
      ...formData?.vehicleDeclaration,
      vehicles: newVehicles,
      howMany: count
    });
    
    setIsHowManyMenuOpen(false);
  };

  const handleFieldChange = (index: number, field: keyof VehicleData, value: any) => {
    const newVehicles = [...vehicles];
    newVehicles[index][field] = value;
    
    setVehicles(newVehicles);
    updateField('vehicleDeclaration', { 
      ...formData?.vehicleDeclaration,
      vehicles: newVehicles 
    });
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
            className="howManyDropDown"
          >
            {formData?.vehicleDeclaration?.howMany || '1'}
            <ChevronDownIcon className={`howManyIcon ${isHowManyMenuOpen ? 'rotate' : ''}`} />
          </button>

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
                    <p className="validation-message">License number is required</p>
                  )}
                </div>
                
                <div className="vehicle-info-column flex-1">
                  <label htmlFor={`vin-${index}`}>Vehicle Identification Number</label>
                  <input 
                    id={`vin-${index}`}
                    type="text" 
                    className={`form-control capitalize-first ${shouldShowValidationError(index, 'vin') ? 'validation-error' : ''}`}
                    value={vehicle.vin}
                    onChange={(e) => handleFieldChange(index, 'vin', e.target.value)}
                    placeholder="Enter VIN"
                  />
                  {shouldShowValidationError(index, 'vin') && (
                    <p className="validation-message">VIN is required</p>
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
                    <p className="validation-message">Vehicle make is required</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="weight-info-container space-y-4">
              <h3 className="weight-info-title">Vehicle Weight Information</h3>
              
              <div className="weight-section weight-flex-row">
                <div className="weight-selector flex-1">
                  <label>GVW (Gross Vehicle Weight)</label>
                  <div 
                    className="relative" 
                    ref={(el) => { gvwDropdownRefs.current[index] = el; }}
                  >
                    <div 
                      onClick={() => toggleGvwDropdown(index)}
                      className="dropdown cursor-pointer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px',
                        width: '100%',
                        border: '1px solid #ccc',
                        borderRadius: '2px',
                        backgroundColor: 'white',
                        height: '34px'

                      }}
                    >
                      <span className="dropdown-text" style={{ color: vehicle.gvwWeight ? '#000' : '#999' }}>
                        {vehicle.gvwWeight ? vehicle.gvwWeight : 'Select weight range'}
                      </span>
                      <ChevronDownIcon className={`regIcon ${gvwDropdownOpen[index] ? 'rotate' : ''}`} />
                    </div>
                    
                    {gvwDropdownOpen[index] && (
                      <ul className="menu">
                        {WEIGHT_RANGES.map((item) => (
                          <li
                            key={item.code}
                            className="lists"
                            onClick={() => {
                              handleFieldChange(index, 'gvwWeight', `${item.code} (${item.range})`);
                              toggleGvwDropdown(index);
                            }}
                          >
                            {`${item.code} (${item.range})`}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {shouldShowValidationError(index, 'gvwWeight') && (
                    <p className="validation-message">GVW weight is required</p>
                  )}
                </div>
                
                <div className="weight-selector flex-1">
                  <label>CGW (Combined Gross Weight)</label>
                  <div 
                    className="relative" 
                    ref={(el) => { cgwDropdownRefs.current[index] = el; }}
                  >
                    <div 
                      onClick={() => toggleCgwDropdown(index)}
                      className="dropdown cursor-pointer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px',
                        width: '100%',
                        border: '1px solid #ccc',
                        borderRadius: '2px',
                        backgroundColor: vehicle.gvwWeight ? '#f1f1f1' : 'white',
                        height: '34px'

                      }}
                    >
                      <span className="dropdown-text" style={{ color: vehicle.cgwWeight ? '#000' : '#999' }}>
                        {vehicle.cgwWeight ? vehicle.cgwWeight : 'Select weight range'}
                      </span>
                      <ChevronDownIcon className={`regIcon ${cgwDropdownOpen[index] ? 'rotate' : ''}`} />
                    </div>
                    
                    {cgwDropdownOpen[index] && !vehicle.gvwWeight && (
                      <ul className="menu">
                        {WEIGHT_RANGES.map((item) => (
                          <li
                            key={item.code}
                            className="lists"
                            onClick={() => {
                              handleFieldChange(index, 'cgwWeight', `${item.code} (${item.range})`);
                              toggleCgwDropdown(index);
                            }}
                          >
                            {`${item.code} (${item.range})`}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {shouldShowValidationError(index, 'cgwWeight') && !vehicle.gvwWeight && (
                    <p className="validation-message">CGW weight is required if GVW is not selected</p>
                  )}
                </div>
                
                <div className="date-selector flex-1">
  <label>Date Vehicle First Operated</label>
  <input
    type="text"
    className={`form-control date-input ${shouldShowValidationError(index, 'dateOperated') ? 'validation-error' : ''}`}
    value={vehicle.dateOperated}
    onChange={(e) => handleFieldChange(index, 'dateOperated', e.target.value)}
    placeholder="MM/DD/YYYY"
    maxLength={10}
  />
  {shouldShowValidationError(index, 'dateOperated') && (
    <p className="validation-message">Date is required</p>
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