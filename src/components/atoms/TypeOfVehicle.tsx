import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import './TypeOfVehicle.css';

interface VehicleTypeData {
  vehicleType?: string;
  stationWagonUse?: string;
  commercialStartDate?: string;
}

interface VehicleTypeFormProps {
  formData?: {
    vehicleTypeInfo?: VehicleTypeData;
  };
}

const initialVehicleTypeData: VehicleTypeData = {
  vehicleType: '',
  stationWagonUse: '',
  commercialStartDate: ''
};

const VehicleTypeForm: React.FC<VehicleTypeFormProps> = ({ formData: propFormData }) => {
  const [formState, setFormState] = useState<VehicleTypeData>(
    propFormData?.vehicleTypeInfo || initialVehicleTypeData
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { updateField } = useFormContext();

  const vehicleTypes = [
    'Bus',
    'Taxicab',
    'Rental',
    'Limousine',
    'Ambulance',
    'Station Wagon'
  ];

  useEffect(() => {
    if (propFormData?.vehicleTypeInfo) {
      setFormState(propFormData.vehicleTypeInfo);
    }
  }, [propFormData]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleVehicleTypeChange = (value: string) => {
    const newData = { 
      ...formState, 
      vehicleType: value,
      stationWagonUse: value !== 'Station Wagon' ? '' : formState.stationWagonUse 
    };
    setFormState(newData);
    setIsDropdownOpen(false);
    updateField('vehicleTypeInfo', newData);
  };

  const handleStationWagonUseChange = (value: string) => {
    const newData = { ...formState, stationWagonUse: value };
    setFormState(newData);
    updateField('vehicleTypeInfo', newData);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newData = { ...formState, commercialStartDate: e.target.value };
    setFormState(newData);
    updateField('vehicleTypeInfo', newData);
  };

  return (
    <div className="space-y-6 w-full max-w-2xl">
      <div className="topGroup">
        <label className="subHeadings">Type of Vehicle</label>
        <div className="relative" ref={dropdownRef}>
          <div 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="dropdown cursor-pointer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px',
              width: '100%',
              border: '1px solid #ccc',
              borderRadius: '2px',
              backgroundColor: 'white'
            }}
          >
            <span style={{ color: formState.vehicleType ? '#000' : '#999' }}>
              {formState.vehicleType || 'Select vehicle type'}
            </span>
            <ChevronDownIcon className={`regIcon ${isDropdownOpen ? 'rotate' : ''}`} />
          </div>
          {isDropdownOpen && (
            <ul className="menu">
              {vehicleTypes.map((type) => (
                <li
                  key={type}
                  className="lists"
                  onClick={() => handleVehicleTypeChange(type)}
                >
                  {type}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {formState.vehicleType === 'Station Wagon' && (
        <div className="space-y-4">
          <p className="subHeadings">
            This station wagon will be used in business and I am:
          </p>
          <div className="space-y-2">
            <div className="checkboxSection">
              <input
                type="radio"
                id="owner"
                name="stationWagonUse"
                className="checkBoxAddress"
                checked={formState.stationWagonUse === 'owner'}
                onChange={() => handleStationWagonUseChange('owner')}
              />
              <p>The owner of this vehicle and it is registered in my name</p>
            </div>
            <div className="checkboxSection">
              <input
                type="radio"
                id="employee"
                name="stationWagonUse"
                className="checkBoxAddress"
                checked={formState.stationWagonUse === 'employee'}
                onChange={() => handleStationWagonUseChange('employee')}
              />
              <p>Employee of a business which required me to own and operate a station wagon which is registered in my name</p>
            </div>
          </div>
        </div>
      )}
<div className="space-y-2">
  <label className="subHeadings">
    I'll start using this vehicle commercially on:
  </label>
  <input
    className="registeredDateInput"
    type="text"
    placeholder="MM/DD/YYYY"
    value={formState.commercialStartDate}
    onChange={handleDateChange}
    maxLength={10}
  />
</div>
    </div>
  );
};

export default VehicleTypeForm;