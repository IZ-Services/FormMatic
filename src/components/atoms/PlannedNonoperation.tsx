'use client';
import React, { useState, useEffect } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import { PlusCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
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
    const updatedEntries = [...currentInfo.entries];
    
    if (!updatedEntries[index]) {
      updatedEntries[index] = { ...initialVehicleEntry };
    }
    
    updatedEntries[index] = { 
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
    

    if (currentInfo.entries.length >= 9) {
      return;
    }
    
    const updatedEntries = [...currentInfo.entries, { ...initialVehicleEntry }];
    
    updateField('plannedNonOperation', {
      ...currentInfo,
      entries: updatedEntries
    });
  };

  const deleteEntry = (index: number) => {
    const currentInfo = { ...(formData.plannedNonOperation || initialPlannedNonOperation) };
    

    if (currentInfo.entries.length <= 1) {
      return;
    }
    
    const updatedEntries = currentInfo.entries.filter((_, i) => i !== index);
    
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
                <th>VEHICLE LICENSE PLATE NUMBER</th>
                <th>VEHICLE ID NUMBER</th>
                <th>MAKE</th>
                <th>EQUIPMENT NUMBER (OPTIONAL)</th>
                <th className="actionHeader">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {(formData.plannedNonOperation?.entries || []).map((entry, index) => (
                <tr key={index}>
                <td>
  <input
    type="text"
    className="pnoInput"
    value={(entry.vehicleLicensePlate || '').toUpperCase()}
    onChange={(e) => handleEntryChange(index, 'vehicleLicensePlate', e.target.value.toUpperCase())}
    placeholder="License plate number"
  />
</td>
<td>
  <input
    type="text"
    className="pnoInput"
    value={(entry.vehicleIdNumber || '').toUpperCase()}
    onChange={(e) => handleEntryChange(index, 'vehicleIdNumber', e.target.value.toUpperCase())}
    placeholder="VIN"
  />
</td>
<td>
  <input
    type="text"
    className="pnoInput"
    value={(entry.vehicleMake || '').toUpperCase()}
    onChange={(e) => handleEntryChange(index, 'vehicleMake', e.target.value.toUpperCase())}
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
                  <td className="actionCell">
                    <button 
                      type="button" 
                      className="deleteEntryButton" 
                      onClick={() => deleteEntry(index)}
                      aria-label="Delete vehicle entry"
                      disabled={(formData.plannedNonOperation?.entries || []).length <= 1}
                      title={(formData.plannedNonOperation?.entries || []).length <= 1 ? 
                        "Cannot delete the only entry" : "Delete this vehicle"}
                    >
                      <TrashIcon className="deleteIcon" />
                    </button>
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
            aria-label="Add another vehicle entry"
            disabled={(formData.plannedNonOperation?.entries || []).length >= 9}
            title={(formData.plannedNonOperation?.entries || []).length >= 9 ? 
              "Maximum of 9 vehicles allowed" : "Add another vehicle"}
          >
            <PlusCircleIcon className="addIcon" />
            <span>Add another vehicle</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlannedNonOperation;