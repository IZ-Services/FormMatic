'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import './VehicleWeightInfo.css';

interface VehicleWeightData {
  vehicleOperatedUnder: boolean;
  gvwValue: string;
  cgwValue: string;
  firstOperatedDate: string;
}

interface VehicleWeightInfoProps {
  formData?: {
    vehicleWeightInfo?: VehicleWeightData[];
    howMany?: string;
    _showValidationErrors?: boolean;
    [key: string]: any;
  };
  onChange?: (data: { vehicles: VehicleWeightData[], howMany: string }) => void;
}const howManyOptions = ['1', '2', '3'];

const VehicleWeightInfo: React.FC<VehicleWeightInfoProps> = ({
  formData: propFormData,
  onChange
}) => {
  const { formData: contextFormData, updateField } = useFormContext();
  
  const formData = {
    ...contextFormData,
    ...propFormData
  };
  
  const [vehicles, setVehicles] = useState<VehicleWeightData[]>([]);
  const [isHowManyMenuOpen, setIsHowManyMenuOpen] = useState(false);
  
  const howManyRef = useRef<HTMLUListElement | null>(null);
  
  const showValidationErrors = formData?._showValidationErrors === true;

  const shouldShowValidationError = (index: number, field: keyof VehicleWeightData) => {
    return showValidationErrors && (!vehicles[index][field] || vehicles[index][field] === '');
  };  useEffect(() => {
    if (formData?.vehicleWeightInfo) {
      setVehicles(formData.vehicleWeightInfo);
    }
  }, [formData?.vehicleWeightInfo]);

  useEffect(() => {
    if (!formData?.howMany) {
      const newHowMany = '1';
      updateField('howMany', newHowMany);
      
      if (onChange && vehicles.length > 0) {
        onChange({
          vehicles: vehicles,
          howMany: newHowMany
        });
      }
    }
  }, []);

  useEffect(() => {
    if (!formData?.vehicleWeightInfo || formData.vehicleWeightInfo.length === 0) {
      const initialVehicle = {
        vehicleOperatedUnder: false,
        gvwValue: '',
        cgwValue: '',
        firstOperatedDate: ''
      };
      const initialVehicles = [initialVehicle];
      
      setVehicles(initialVehicles);
      updateField('vehicleWeightInfo', initialVehicles);
      
      if (onChange) {
        onChange({
          vehicles: initialVehicles,
          howMany: formData?.howMany || '1'
        });
      }
    }
  }, []);

  const handleHowManyChange = (count: string) => {
    const newCount = parseInt(count);
    let newVehicles = [...vehicles];
    
    while (newVehicles.length < newCount) {
      newVehicles.push({
        vehicleOperatedUnder: false,
        gvwValue: '',
        cgwValue: '',
        firstOperatedDate: ''
      });
    }
    
    while (newVehicles.length > newCount) {
      newVehicles.pop();
    }
    
    setVehicles(newVehicles);
    updateField('vehicleWeightInfo', newVehicles);
    updateField('howMany', count);
    
    if (onChange) {
      onChange({
        vehicles: newVehicles,
        howMany: count
      });
    }
    
    setIsHowManyMenuOpen(false);
  };

  const handleFieldChange = (index: number, field: keyof VehicleWeightData, value: any) => {
    const newVehicles = [...vehicles];
    newVehicles[index] = { ...newVehicles[index], [field]: value };
    
    setVehicles(newVehicles);
    updateField('vehicleWeightInfo', newVehicles);
    
    if (onChange) {
      onChange({
        vehicles: newVehicles,
        howMany: formData?.howMany || '1'
      });
    }
  };
  
  const handleClickOutsideMenus = (e: MouseEvent) => {
    const target = e.target as Element;
    if (howManyRef.current && !howManyRef.current.contains(target) && !target.closest('.howManyDropDown')) {
      setIsHowManyMenuOpen(false);
    }
  };
  
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutsideMenus);
    return () => document.removeEventListener('mousedown', handleClickOutsideMenus);
  }, []);

  return (
    <div className="vehicle-weight-info">
      <div className="weight-info-header">
        <h3 className="weight-info-heading">Vehicle Weight Information</h3>
        <div className="howManyWrapper">
          <button
            onClick={() => setIsHowManyMenuOpen(!isHowManyMenuOpen)}
            className="howManyDropDown"
          >
            {String(formData?.howMany ?? '1')}
            <ChevronDownIcon className={`howManyIcon ${isHowManyMenuOpen ? 'rotate' : ''}`} />
          </button>

          {isHowManyMenuOpen && (
            <ul ref={howManyRef} className="howManyMenu">
              {howManyOptions.map((option, index) => (
                <li
                  className="howManyLists"
                  key={index}
                  onClick={() => handleHowManyChange(option)}
                >
                  {option}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      
      <div className="weight-info-table">
        <div className="weight-info-row weight-info-header-row">
          <div className="weight-info-cell weight-column-1">
            VEHICLE OPERATED UNDER 10,001 LBS.
          </div>
          <div className="weight-info-cell weight-column-2">
            GVW
          </div>
          <div className="weight-info-cell weight-column-3">
            CGW
          </div>
          <div className="weight-info-cell weight-column-4">
            DATE VEHICLE WILL BE OR WAS <span className="italic-text">FIRST OPERATED</span> AT THIS WEIGHT
          </div>
        </div>
        
        <div className="weight-info-row weight-instruction-row">
          <div className="weight-info-cell weight-column-1">
            Place an "X" in the box
          </div>
          <div className="weight-info-cell weight-column-2">
            Enter Weight
          </div>
          <div className="weight-info-cell weight-column-3">
            Enter Weight
          </div>
          <div className="weight-info-cell weight-column-4">
            MM/DD/YYYY
          </div>
        </div>
        
        {vehicles.map((vehicle, index) => (
          <div className="weight-info-row weight-data-row" key={index}>
            <div className="weight-info-cell weight-column-1">
              <div className="checkbox-container">
                <div 
                  className="x-mark-checkbox"
                  onClick={() => handleFieldChange(index, 'vehicleOperatedUnder', !vehicle.vehicleOperatedUnder)}
                >
                  {vehicle.vehicleOperatedUnder ? 'X' : ''}
                </div>
                <span className="checkbox-label-text">Under 10,001 lbs.</span>
              </div>
            </div>
            
            <div className="weight-info-cell weight-column-2">
              <input
                type="text"
                className={`registeredOwnerInput ${shouldShowValidationError(index, 'gvwValue') ? 'validation-error' : ''}`}
                placeholder="Enter GVW"
                value={vehicle.gvwValue}
                onChange={(e) => {                  const value = e.target.value.replace(/[^0-9]/g, '');
                  handleFieldChange(index, 'gvwValue', value);
                }}
              />
              {shouldShowValidationError(index, 'gvwValue') && (
                <p className="validation-message">GVW is required</p>
              )}
            </div>
            
            <div className="weight-info-cell weight-column-3">
              <input
                type="text"
                className={`registeredOwnerInput ${shouldShowValidationError(index, 'cgwValue') ? 'validation-error' : ''}`}
                placeholder="Enter CGW"
                value={vehicle.cgwValue}
                onChange={(e) => {                  const value = e.target.value.replace(/[^0-9]/g, '');
                  handleFieldChange(index, 'cgwValue', value);
                }}
              />
              {shouldShowValidationError(index, 'cgwValue') && (
                <p className="validation-message">CGW is required</p>
              )}
            </div>
            
            <div className="weight-info-cell weight-column-4">
  <input
    type="text"
    className={`registeredDateInput ${shouldShowValidationError(index, 'firstOperatedDate') ? 'validation-error' : ''}`}
    placeholder="MM/DD/YYYY"
    value={vehicle.firstOperatedDate}
    onChange={(e) => handleFieldChange(index, 'firstOperatedDate', e.target.value)}
  />
  
  {shouldShowValidationError(index, 'firstOperatedDate') && (
    <p className="validation-message">Date is required</p>
  )}
</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VehicleWeightInfo;