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
  vehicleUnder10001lbs?: boolean;
  gvwCode?: string;
  cgwCode?: string;
  operationDate?: string;
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
  exceedsMechanicalLimit: false,
  gvwCode: '',
  cgwCode: '',
  operationDate: ''
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
      
    
   
<div className="vehicleFirstGroup">
        <div className="vehicleFormItem">
          <label className="yearlabel">Motorcycle Engine Number</label>
          <input
            className="yearInput"
            type="text"
    placeholder="Motorcycle Engine Number"
    value={(formData.vehicleInformation as VehicleInformationType)?.engineNumber || ''}
    onChange={(e) => handleVehicleInfoChange('engineNumber', e.target.value)}
          />
        </div>
        <div className="vehicleFormItem">
          <label className="yearlabel">Vehicle/Hull Identification Number</label>
          <input
            className="makeInput"
            type="text"
          placeholder="Vehicle/ Hull Identification Number"
          value={(formData.vehicleInformation as VehicleInformationType)?.hullId || ''}
          onChange={(e) => handleVehicleInfoChange('hullId', e.target.value)}
          />
        </div>
        <div className="vehicleFormItem">
          <label className="yearlabel">Vehicle License Plate or Vessel CF Number</label>
          <input
            className="odometerInput"
            type="text"
            placeholder="Vehicle License Plate or Vessel CF Number"
            value={(formData.vehicleInformation as VehicleInformationType)?.licensePlate || ''}
            onChange={(e) => handleVehicleInfoChange('licensePlate', e.target.value)}
          />
        </div>
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
      </div>
    
      <div className="mileageGroup">
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

          <label className="checkboxLabel">
            <input
              type="checkbox"
              checked={(formData.vehicleInformation as VehicleInformationType)?.vehicleUnder10001lbs || false}
              onChange={(e) => handleVehicleInfoChange('vehicleUnder10001lbs', e.target.checked)}
              className="checkboxInput"
            />
Vehicle Operated Under 10,001 lbs.          </label>
        </div>
      </div>


      <div className="vehicleFirstGroup">
        <div className="vehicleFormItem">
          <label className="yearlabel">Mileage of Vehicle</label>
          <input
            className="yearInput"
            type="text"
            placeholder="Vehicle Mileage"
            value={(formData.vehicleInformation as VehicleInformationType)?.mileage || ''}
            onChange={(e) => handleVehicleInfoChange('mileage', e.target.value)}
          />
        </div>
        <div className="vehicleFormItem">
          <label className="yearlabel">GVW Code</label>
          <input
            className="makeInput"
            type="text"
            placeholder="Enter GVW Code"
            value={(formData.vehicleInformation as VehicleInformationType)?.gvwCode || ''}
            onChange={(e) => handleVehicleInfoChange('gvwCode', e.target.value)}
          />
        </div>
        <div className="vehicleFormItem">
          <label className="yearlabel">CGW Code</label>
          <input
            className="odometerInput"
            type="text"
          placeholder="Enter CGW Code"
          value={(formData.vehicleInformation as VehicleInformationType)?.cgwCode || ''}
          onChange={(e) => handleVehicleInfoChange('cgwCode', e.target.value)}
          />
        </div>
      </div>
      

      <div className="newRegThirdItem">
              <label className="registeredOwnerLabel">Date Vehicle Will Be or Was Operated at This Weight</label>
              <input
                className="registeredDateInput"
                type="text"
                placeholder="MM/DD/YYYY"
                value={(formData.vehicleInformation as VehicleInformationType)?.operationDate || ''}
                onChange={(e) => handleVehicleInfoChange('operationDate', e.target.value)}
              />
            </div>
      
    </div>
  );
};

export default VehicleInformation;
