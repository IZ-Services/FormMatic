import React, { useState, useEffect } from 'react';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
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

const SectionFive: React.FC<SectionFiveProps> = ({ formData: propFormData }) => {
  const [vehicleEntries, setVehicleEntries] = useState<VehicleEntry[]>(
    propFormData?.vehiclesOwned?.length 
      ? propFormData.vehiclesOwned 
      : [{ ...initialVehicleEntry }]
  );
  const { updateField } = useFormContext();

  useEffect(() => {
    if (propFormData?.vehiclesOwned) {
      setVehicleEntries(propFormData.vehiclesOwned);
    }
  }, [propFormData]);

  const handleEntryChange = (index: number, field: keyof VehicleEntry, value: string | undefined) => {
    const newEntries = [...vehicleEntries];
    newEntries[index] = {
      ...newEntries[index],
      [field]: value
    };
    setVehicleEntries(newEntries);
    updateField('vehiclesOwned', newEntries);
  };

  const addNewEntry = () => {
    const newEntries = [...vehicleEntries, { ...initialVehicleEntry }];
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
          <div className="input-group">
            <label className="input-label">CALIFORNIA PLATE/CF/PLACARD NO.</label>
            <input
              type="text"
              className="form-input"
              value={entry.plateCfNumber || ''}
              onChange={(e) => handleEntryChange(index, 'plateCfNumber', e.target.value.toUpperCase())}
              maxLength={20}
            />
          </div>

          <div className="input-group">
            <label className="input-label">LAST 17 POSITIONS OF VEHICLE ID OR VESSEL HULL ID NUMBER</label>
            <input
              type="text"
              className="form-input"
              value={entry.vehicleHullId || ''}
              onChange={(e) => handleEntryChange(index, 'vehicleHullId', e.target.value.toUpperCase())}
              maxLength={17}
            />
          </div>

          <div className="checkbox-group">
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name={`leased-${index}`}
                  checked={entry.leased === 'inside'}
                  onChange={() => handleEntryChange(index, 'leased', 'inside')}
                />
                LEASED INSIDE CA
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name={`leased-${index}`}
                  checked={entry.leased === 'outside'}
                  onChange={() => handleEntryChange(index, 'leased', 'outside')}
                />
                LEASED OUTSIDE CA
              </label>
            </div>

            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name={`registered-${index}`}
                  checked={entry.registeredLocation === 'inside'}
                  onChange={() => handleEntryChange(index, 'registeredLocation', 'inside')}
                />
                REGISTERED INSIDE CA
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name={`registered-${index}`}
                  checked={entry.registeredLocation === 'outside'}
                  onChange={() => handleEntryChange(index, 'registeredLocation', 'outside')}
                />
                REGISTERED OUTSIDE CA
              </label>
            </div>
          </div>
        </div>
      ))}

      <div className="add-entry-container">
        <button 
          type="button" 
          className="add-entry-button" 
          onClick={addNewEntry}
        >
          <PlusCircleIcon className="add-icon" />
          <span>Add Vehicle</span>
        </button>
      </div>
    </div>
  );
};

export default SectionFive;