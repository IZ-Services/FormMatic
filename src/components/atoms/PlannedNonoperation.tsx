'use client';
import React, { useState, useEffect } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import './PlannedNonOperation.css';

interface VehicleEntryType {
  vehicleLicensePlate: string;
  vehicleIdNumber: string;
  vehicleMake: string;
  equipmentNumber: string;
}

interface PlannedNonOperationType {
  entries: VehicleEntryType[];
}

interface PlannedNonOperationProps {
  formData?: {
    plannedNonOperation?: PlannedNonOperationType;
  };
}

const initialVehicleEntry: VehicleEntryType = {
  vehicleLicensePlate: '',
  vehicleIdNumber: '',
  vehicleMake: '',
  equipmentNumber: ''
};

const initialPlannedNonOperation: PlannedNonOperationType = {
  entries: [{ ...initialVehicleEntry }, { ...initialVehicleEntry }]
};

const PlannedNonOperation: React.FC<PlannedNonOperationProps> = ({ formData: propFormData }) => {
  const { formData: contextFormData, updateField } = useFormContext();

  const formData = {
    ...contextFormData,
    ...propFormData
  };

  useEffect(() => {
    if (!formData.plannedNonOperation) {
      updateField('plannedNonOperation', initialPlannedNonOperation);
    }
  }, []);

  const handleEntryChange = (index: number, field: keyof VehicleEntryType, value: string) => {
    const currentInfo = { ...(formData.plannedNonOperation || initialPlannedNonOperation) };
    const updatedEntries = [...currentInfo.entries];     if (!updatedEntries[index]) {
      updatedEntries[index] = { ...initialVehicleEntry };
    }     updatedEntries[index] = { 
      ...updatedEntries[index], 
      [field]: value 
    };
    
    updateField('plannedNonOperation', {
      ...currentInfo,
      entries: updatedEntries
    });
  };

  const addNewEntry = () => {
    const currentInfo = { ...(formData.plannedNonOperation || initialPlannedNonOperation) };
    const updatedEntries = [...currentInfo.entries, { ...initialVehicleEntry }];
    
    updateField('plannedNonOperation', {
      ...currentInfo,
      entries: updatedEntries
    });
  };

  return (
    <div className="pnoWrapper">
      <div className="pnoHeader">
        <h3 className="pnoTitle">PLANNED NON-OPERATION CERTIFICATE</h3>
      </div>
      
      <div className="pnoContent">
        <div className="pnoTableContainer">
          <table className="pnoTable">
            <thead>
              <tr>
                <th className="verticalHeader">
                  <div className="verticalText">VEHICLE LICENSE PLATE NUMBER</div>
                </th>
                <th className="verticalHeader">
                  <div className="verticalText">VEHICLE ID NUMBER</div>
                </th>
                <th className="verticalHeader">
                  <div className="verticalText">MAKE</div>
                </th>
                <th className="verticalHeader">
                  <div className="verticalText">EQUIPMENT NUMBER (OPTIONAL)</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {(formData.plannedNonOperation?.entries || []).map((entry, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      className="pnoInput"
                      value={entry.vehicleLicensePlate || ''}
                      onChange={(e) => handleEntryChange(index, 'vehicleLicensePlate', e.target.value)}
                      placeholder="License plate number"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="pnoInput"
                      value={entry.vehicleIdNumber || ''}
                      onChange={(e) => handleEntryChange(index, 'vehicleIdNumber', e.target.value)}
                      placeholder="VIN"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="pnoInput"
                      value={entry.vehicleMake || ''}
                      onChange={(e) => handleEntryChange(index, 'vehicleMake', e.target.value)}
                      placeholder="Make"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="pnoInput"
                      value={entry.equipmentNumber || ''}
                      onChange={(e) => handleEntryChange(index, 'equipmentNumber', e.target.value)}
                      placeholder="Equipment number"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="addEntryContainer">
          <button 
            type="button" 
            className="addEntryButton" 
            onClick={addNewEntry}
            aria-label="Add new vehicle entry"
          >
            <PlusCircleIcon className="addIcon" />
            <span>Add Vehicle</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlannedNonOperation;