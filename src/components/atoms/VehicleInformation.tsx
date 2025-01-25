'use client';
import React from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import './VehicleInformation.css';

const VehicleInformation = () => {
  const { formData, updateField } = useFormContext();

  const handleVehicleInfoChange = (field: string, value: string | boolean) => {
    const currentInfo = formData.vehicleInformation || {};
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
          value={formData.vehicleInformation?.licensePlate || ''}
          onChange={(e) => handleVehicleInfoChange('licensePlate', e.target.value)}
        />
      </div>
    
      <div className="formGroup">
        <label className="formLabel">Vehicle/Hull Identification Number</label>
        <input
          className="formInput hullIdInput"
          type="text"
          placeholder="Vehicle/ Hull Identification Number"
          value={formData.vehicleInformation?.hullId || ''}
          onChange={(e) => handleVehicleInfoChange('hullId', e.target.value)}
        />
      </div>

      <div className="vehicleFirstGroup">
        <div className="vehicleFormItem">
          <label className="yearlabel">Year of Vehicle</label>
          <input
            className="yearInput"
            type="text"
            placeholder="Year of Vehicle"
            value={formData.vehicleInformation?.year || ''}
            onChange={(e) => handleVehicleInfoChange('year', e.target.value)}
          />
        </div>
        <div className="vehicleFormItem">
          <label className="yearlabel">Make of Vehicle OR Vessel Builder</label>
          <input
            className="makeInput"
            type="text"
            placeholder="Make of Vehicle OR Vessel Builder"
            value={formData.vehicleInformation?.make || ''}
            onChange={(e) => handleVehicleInfoChange('make', e.target.value)}
          />
        </div>
        <div className="vehicleFormItem">
          <label className="yearlabel">Explain Odometer Discrepancy</label>
          <input
            className="odometerInput"
            type="text"
            placeholder="Explanation"
            value={formData.vehicleInformation?.odometerDiscrepancyExplanation || ''}
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
            value={formData.vehicleInformation?.mileage || ''}
            onChange={(e) => handleVehicleInfoChange('mileage', e.target.value)}
          />
        </div>
        <div className="checkboxGroup">
          <label className="checkboxLabel">
            <input
              type="checkbox"
              checked={formData.vehicleInformation?.notActualMileage || false}
              onChange={(e) => handleVehicleInfoChange('notActualMileage', e.target.checked)}
              className="checkboxInput"
            />
            NOT Actual Mileage
          </label>
          <label className="checkboxLabel">
            <input
              type="checkbox"
              checked={formData.vehicleInformation?.exceedsMechanicalLimit || false}
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