'use client';
import React, { useState } from 'react';
import './VehicleInformation.css';

const VehicleInformation = () => {
  const [notActualMileage, setNotActualMileage] = useState(false);
  const [exceedsMechanicalLimit, setExceedsMechanicalLimit] = useState(false);

  return (
    <div className="vehicleInformationWrapper">
    <h3 className="vehicleInformationHeading">Vehicle Information</h3>
    
    <div className="formGroup">
      <label className="formLabel">Vehicle License Plate or Vessel CF Number</label>
      <input
        className="formInput vehicleLicenseInput"
        type="text"
        placeholder="Vehicle License Plate or Vessel CF Number"
      />
    </div>
  
    <div className="formGroup">
      <label className="formLabel">Vehicle/Hull Identification Number</label>
      <input
        className="formInput hullIdInput"
        type="text"
        placeholder="Vehicle/ Hull Identification Number"
      />
    </div>

    <div className="vehicleFirstGroup">
        <div className="vehicleFormItem">
          <label className="yearlabel">Year of Vehicle</label>
          <input
            className="yearInput"
            type="text"
            placeholder="Year of Vehicle"
          />
        </div>
        <div className="vehicleFormItem">
          <label className="yearlabel">Make of Vehicle OR Vessel Builder
          </label>
          <input
            className="makeInput"
            type="text"
            placeholder="Make of Vehicle OR Vessel Builder"
          />
        </div>
        <div className="vehicleFormItem">
          <label className="yearlabel">Explain Odometer Discrepancy
          </label>
          <input
            className="odometerInput"
            type="text"
            placeholder="Explanation"
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
        />
      </div>
      <div className="checkboxGroup">
        <label className="checkboxLabel">
          <input
            type="checkbox"
            checked={notActualMileage}
            onChange={() => setNotActualMileage(!notActualMileage)}
            className="checkboxInput"
          />
          NOT Actual Mileage
        </label>
        <label className="checkboxLabel">
          <input
            type="checkbox"
            checked={exceedsMechanicalLimit}
            onChange={() => setExceedsMechanicalLimit(!exceedsMechanicalLimit)}
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
