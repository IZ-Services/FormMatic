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

interface ValidationError {
  field: string;
  index: number;
  message: string;
}

interface PlannedNonOperationType {
  entries: VehicleEntryType[];
}

interface PlannedNonOperationProps {
  formData?: {
    plannedNonOperation?: PlannedNonOperationType;
  };
  showValidationErrors?: boolean;
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

const PlannedNonOperation: React.FC<PlannedNonOperationProps> = ({ 
  formData: propFormData,
  showValidationErrors = false 
}) => {
  const { formData: contextFormData, updateField } = useFormContext();
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  const formData = {
    ...contextFormData,
    ...propFormData
  };

  // Validation function
  const validateEntries = (): ValidationError[] => {
    const errors: ValidationError[] = [];
    const entries = formData.plannedNonOperation?.entries || [];

    entries.forEach((entry, index) => {
      // Validate license plate
      if (!entry.vehicleLicensePlate) {
        errors.push({
          field: 'vehicleLicensePlate',
          index,
          message: 'License plate number is required'
        });
      }

      // Validate VIN
      if (!entry.vehicleIdNumber) {
        errors.push({
          field: 'vehicleIdNumber',
          index,
          message: 'Vehicle ID number is required'
        });
      } else if (entry.vehicleIdNumber.length < 17) {
        errors.push({
          field: 'vehicleIdNumber',
          index,
          message: 'VIN must be 17 characters'
        });
      }

      // Validate make
      if (!entry.vehicleMake) {
        errors.push({
          field: 'vehicleMake',
          index,
          message: 'Vehicle make is required'
        });
      }
    });

    return errors;
  };

  // Helper to get error message
  const getErrorMessage = (field: string, index: number): string | null => {
    const error = validationErrors.find(err => err.field === field && err.index === index);
    return error ? error.message : null;
  };

  useEffect(() => {
    if (!formData.plannedNonOperation) {
      updateField('plannedNonOperation', initialPlannedNonOperation);
    }
  }, []);

  // Run validation when data changes or validation flag is turned on
  useEffect(() => {
    if (showValidationErrors) {
      const errors = validateEntries();
      setValidationErrors(errors);
    }
  }, [showValidationErrors, formData.plannedNonOperation]);

  // Update parent component about validation status
  useEffect(() => {
    if (showValidationErrors) {
      updateField('_validationErrors', (prev: any) => ({
        ...prev,
        plannedNonOperation: validationErrors.length > 0
      }));
    }
  }, [validationErrors, showValidationErrors]);

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
    
    // Run validation if we're showing validation errors
    if (showValidationErrors) {
      const errors = validateEntries();
      setValidationErrors(errors);
    }
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
    
    // Run validation after deletion if we're showing validation errors
    if (showValidationErrors) {
      setTimeout(() => {
        const errors = validateEntries();
        setValidationErrors(errors);
      }, 0);
    }
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
                      className={`pnoInput ${showValidationErrors && getErrorMessage('vehicleLicensePlate', index) ? 'error-input' : ''}`}
                      value={(entry.vehicleLicensePlate || '').toUpperCase()}
                      onChange={(e) => handleEntryChange(index, 'vehicleLicensePlate', e.target.value.toUpperCase())}
                      placeholder="License plate number"
                    />
                    {showValidationErrors && getErrorMessage('vehicleLicensePlate', index) && (
                      <div className="error-message">{getErrorMessage('vehicleLicensePlate', index)}</div>
                    )}
                  </td>
                  <td>
                    <input
                      type="text"
                      className={`pnoInput ${showValidationErrors && getErrorMessage('vehicleIdNumber', index) ? 'error-input' : ''}`}
                      value={(entry.vehicleIdNumber || '').toUpperCase()}
                      onChange={(e) => handleEntryChange(index, 'vehicleIdNumber', e.target.value.toUpperCase())}
                      placeholder="VIN"
                      maxLength={17}
                    />
                    {showValidationErrors && getErrorMessage('vehicleIdNumber', index) && (
                      <div className="error-message">{getErrorMessage('vehicleIdNumber', index)}</div>
                    )}
                  </td>
                  <td>
                    <input
                      type="text"
                      className={`pnoInput ${showValidationErrors && getErrorMessage('vehicleMake', index) ? 'error-input' : ''}`}
                      value={(entry.vehicleMake || '').toUpperCase()}
                      onChange={(e) => handleEntryChange(index, 'vehicleMake', e.target.value.toUpperCase())}
                      placeholder="Make"
                    />
                    {showValidationErrors && getErrorMessage('vehicleMake', index) && (
                      <div className="error-message">{getErrorMessage('vehicleMake', index)}</div>
                    )}
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