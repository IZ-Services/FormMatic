'use client';
import React, { useEffect } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import './VehicleInformation.css';

interface VehicleInformationType {
  licensePlate?: string;
  hullId?: string;
  engineNumber?: string;  
  year?: string;
  make?: string;
  odometerDiscrepancyExplanation?: string;
  mileage?: string;
  notActualMileage?: boolean;
  exceedsMechanicalLimit?: boolean;
}

interface VehicleInformationProps {
  formData?: {
    vehicleInformation?: VehicleInformationType;
  };
}

const initialVehicleInformation: VehicleInformationType = {
  licensePlate: '',
  hullId: '',
  engineNumber: '',
  year: '',
  make: '',
  odometerDiscrepancyExplanation: '',
  mileage: '',
  notActualMileage: false,
  exceedsMechanicalLimit: false
};

const VehicleInformation: React.FC<VehicleInformationProps> = ({ formData: propFormData }) => {
  const { formData: contextFormData, updateField } = useFormContext();

  const formData = {
    ...contextFormData,
    ...propFormData
  };

  useEffect(() => {
    if (!formData.vehicleInformation) {
      updateField('vehicleInformation', initialVehicleInformation);
    }
  }, []);

  const handleVehicleInfoChange = (field: keyof VehicleInformationType, value: string | boolean) => {
    const currentInfo = (formData.vehicleInformation || {}) as VehicleInformationType;
    updateField('vehicleInformation', { ...currentInfo, [field]: value });
  };

  return (
    <div className="vehicleInformationWrapper">
      <h3 className="vehicleInformationHeading">Vehicle Information</h3>
      
      <div className="formGroup">
        <label className="formLabel">Vehicle License Plate or Vessel CF Number</label>
        <input
          className="formInput vehicleLicenseInput"
          type="text"
          placeholder="Vehicle License Plate or Vessel CF Number"
          value={(formData.vehicleInformation as VehicleInformationType)?.licensePlate || ''}
          onChange={(e) => handleVehicleInfoChange('licensePlate', e.target.value)}
        />
      </div>
    
      <div className="formGroup">
        <label className="formLabel">Vehicle/Hull Identification Number</label>
        <input
          className="formInput hullIdInput"
          type="text"
          placeholder="Vehicle/ Hull Identification Number"
          value={(formData.vehicleInformation as VehicleInformationType)?.hullId || ''}
          onChange={(e) => handleVehicleInfoChange('hullId', e.target.value)}
        />
      </div>
      <div className="formGroup">
  <label className="formLabel">Motorcycle Engine Number</label>
  <input
    className="formInput engineNumberInput"
    type="text"
    placeholder="Motorcycle Engine Number"
    value={(formData.vehicleInformation as VehicleInformationType)?.engineNumber || ''}
    onChange={(e) => handleVehicleInfoChange('engineNumber', e.target.value)}
  />
</div>
      <div className="vehicleFirstGroup">
        <div className="vehicleFormItem">
          <label className="yearlabel">Year of Vehicle</label>
          <input
            className="yearInput"
            type="text"
            placeholder="Year of Vehicle"
            value={(formData.vehicleInformation as VehicleInformationType)?.year || ''}
            onChange={(e) => handleVehicleInfoChange('year', e.target.value)}
          />
        </div>
        <div className="vehicleFormItem">
          <label className="yearlabel">Make of Vehicle OR Vessel Builder</label>
          <input
            className="makeInput"
            type="text"
            placeholder="Make of Vehicle OR Vessel Builder"
            value={(formData.vehicleInformation as VehicleInformationType)?.make || ''}
            onChange={(e) => handleVehicleInfoChange('make', e.target.value)}
          />
        </div>
        <div className="vehicleFormItem">
          <label className="yearlabel">Explain Odometer Discrepancy</label>
          <input
            className="odometerInput"
            type="text"
            placeholder="Explanation"
            value={(formData.vehicleInformation as VehicleInformationType)?.odometerDiscrepancyExplanation || ''}
            onChange={(e) => handleVehicleInfoChange('odometerDiscrepancyExplanation', e.target.value)}
          />
        </div>
      </div>
    
      <div className="mileageGroup">
        <div className="formGroup">
          <label className="formLabel">Mileage of Vehicle</label>
          <input
            className="formInput mileageInput"
            type="text"
            placeholder="Mileage of Vehicle"
            value={(formData.vehicleInformation as VehicleInformationType)?.mileage || ''}
            onChange={(e) => handleVehicleInfoChange('mileage', e.target.value)}
          />
        </div>
        <div className="checkboxGroup">
          <label className="checkboxLabel">
            <input
              type="checkbox"
              checked={(formData.vehicleInformation as VehicleInformationType)?.notActualMileage || false}
              onChange={(e) => handleVehicleInfoChange('notActualMileage', e.target.checked)}
              className="checkboxInput"
            />
            NOT Actual Mileage
          </label>
          <label className="checkboxLabel">
            <input
              type="checkbox"
              checked={(formData.vehicleInformation as VehicleInformationType)?.exceedsMechanicalLimit || false}
              onChange={(e) => handleVehicleInfoChange('exceedsMechanicalLimit', e.target.checked)}
              className="checkboxInput"
            />
            Mileage Exceeds Mechanical Limit
          </label>
        </div>
      </div>
    </div>
  );
};

export default VehicleInformation;
