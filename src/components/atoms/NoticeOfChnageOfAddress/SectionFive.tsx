import React, { useState, useEffect } from 'react';
import { PlusCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useFormContext } from '../../../app/api/formDataContext/formDataContextProvider';
import './SectionFive.css';

interface VehicleEntry {
  plateCfNumber?: string;
  vehicleHullId?: string;
  leased?: 'inside' | 'outside';
  registeredLocation?: 'inside' | 'outside';
}

interface SectionFiveProps {
  formData?: {
    vehiclesOwned?: VehicleEntry[];
  };
}

const initialVehicleEntry: VehicleEntry = {
  plateCfNumber: '',
  vehicleHullId: '',
  leased: undefined,
  registeredLocation: undefined
};

const MAX_VEHICLES = 3;

const SectionFive: React.FC<SectionFiveProps> = ({ formData: propFormData }) => {
  const { formData: contextFormData, updateField } = useFormContext();
  

  const formData = {
    ...contextFormData,
    ...propFormData
  };
  
  const [vehicleEntries, setVehicleEntries] = useState<VehicleEntry[]>(
    formData?.vehiclesOwned?.length 
      ? formData.vehiclesOwned 
      : [{ ...initialVehicleEntry }]
  );


  useEffect(() => {
    if (!contextFormData?.vehiclesOwned) {
      updateField('vehiclesOwned', [{ ...initialVehicleEntry }]);
    }
  }, []);


  useEffect(() => {
    if (formData?.vehiclesOwned) {
      setVehicleEntries(formData.vehiclesOwned);
    }
  }, [formData?.vehiclesOwned]);
  

  useEffect(() => {
    console.log('Current SectionFive form data:', formData?.vehiclesOwned);
  }, [formData?.vehiclesOwned]);

  const handleEntryChange = (index: number, field: keyof VehicleEntry, value: string | 'inside' | 'outside' | undefined) => {
    const newEntries = [...vehicleEntries];
    newEntries[index] = {
      ...newEntries[index],
      [field]: value
    };
    setVehicleEntries(newEntries);
    updateField('vehiclesOwned', newEntries);
  };

  const toggleCheckbox = (index: number, field: 'leased' | 'registeredLocation') => {
    const newEntries = [...vehicleEntries];
    const currentEntry = { ...newEntries[index] };
    
    const newValue = currentEntry[field] === 'inside' ? undefined : 'inside';
    
    currentEntry[field] = newValue;
    newEntries[index] = currentEntry;
    
    setVehicleEntries(newEntries);
    updateField('vehiclesOwned', newEntries);
  };

  const addNewEntry = () => {
    if (vehicleEntries.length < MAX_VEHICLES) {
      const newEntries = [...vehicleEntries, { ...initialVehicleEntry }];
      setVehicleEntries(newEntries);
      updateField('vehiclesOwned', newEntries);
    }
  };

  const deleteEntry = (index: number) => {
    const newEntries = vehicleEntries.filter((_, i) => i !== index);
    
    if (newEntries.length === 0) {
      newEntries.push({ ...initialVehicleEntry });
    }
    
    setVehicleEntries(newEntries);
    updateField('vehiclesOwned', newEntries);
  };

  return (
    <div className="section-five-wrapper">
      <div className="section-header">
        <h3 className="section-title">Vehicles, Vessels, or Placards Owned By You</h3>
      </div>

      {vehicleEntries.map((entry, index) => (
        <div key={index} className="vehicle-entry">
          <div className="entry-header">
            <h4 className="entry-title">Vehicle {index + 1}</h4>
            {vehicleEntries.length > 1 && (
              <button 
                type="button" 
                className="delete-entry-button" 
                onClick={() => deleteEntry(index)}
                aria-label="Delete vehicle entry"
              >
                <TrashIcon className="delete-icon" />
                <span>Delete</span>
              </button>
            )}
          </div>

          {/* Wrap input groups in a single row */}
          <div className="input-row">
            <div className="input-group">
              <label className="input-label">CALIFORNIA PLATE/CF/PLACARD NO.</label>
              <input
                type="text"
                className="form-input"
                value={entry.plateCfNumber || ''}
                onChange={(e) => handleEntryChange(index, 'plateCfNumber', e.target.value.toUpperCase())}
                maxLength={8}
              />
            </div>

            <div className="input-group">
              <label className="input-labell">LAST 17 POSITIONS OF VEHICLE ID OR VESSEL HULL ID NUMBER</label>
              <input
                type="text"
                className="form-input"
                value={entry.vehicleHullId || ''}
                onChange={(e) => handleEntryChange(index, 'vehicleHullId', e.target.value.toUpperCase())}
                maxLength={17}
              />
            </div>
          </div>

          <div className="checkbox-group">
            <div className="checkbox-cont">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={entry.leased === 'inside'}
                  onChange={() => toggleCheckbox(index, 'leased')}
                />
                CHECK IF LEASED
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={entry.registeredLocation === 'inside'}
                  onChange={() => toggleCheckbox(index, 'registeredLocation')}
                />
                CHECK IF REGISTERED OUTSIDE CA
              </label>
            </div>
          </div>
        </div>
      ))}

      <div className="add-entry-container">
        {vehicleEntries.length < MAX_VEHICLES && (
          <button 
            type="button" 
            className="add-entry-button" 
            onClick={addNewEntry}
          >
            <PlusCircleIcon className="add-icon" />
            <span>Add Another Vehicle</span>
          </button>
        )}
        {vehicleEntries.length >= MAX_VEHICLES && (
          <p className="max-vehicles-message">Maximum number of vehicles reached (3)</p>
        )}
      </div>
    </div>
  );
};

export default SectionFive;