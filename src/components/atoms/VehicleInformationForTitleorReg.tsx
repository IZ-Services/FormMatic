import React, { useState, useEffect } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import './VehicleInformationForTitleorReg.css';

interface TrailerCoachDetails {
  length?: string;
  width?: string;
}

interface CommercialVehicleDetails {
  numberOfAxes?: string;
  unladenWeight?: 'Actual' | 'Estimated';
}

interface VehicleInformationData {
  vehicleType?: 'Auto' | 'Commercial' | 'Motorcycle' | 'Off Highway' | 'Trailer Coach';
  transportationForHire?: boolean;
  commercialVehicle?: boolean;
  trailerCoachDetails?: TrailerCoachDetails;
  commercialVehicleDetails?: CommercialVehicleDetails;
}

interface VehicleInformationProps {
  formData?: {
    vehicleInformation?: VehicleInformationData;
  };
}

const VehicleInformation: React.FC<VehicleInformationProps> = ({ formData: propFormData }) => {
  const [vehicleData, setVehicleData] = useState<VehicleInformationData>(
    propFormData?.vehicleInformation || {}
  );
  const { updateField } = useFormContext();

  useEffect(() => {
    if (propFormData?.vehicleInformation) {
      setVehicleData(propFormData.vehicleInformation);
    }
  }, [propFormData]);

  const handleVehicleTypeChange = (type: VehicleInformationData['vehicleType']) => {
    const newData = { 
      ...vehicleData, 
      vehicleType: type 
    };
    setVehicleData(newData);
    updateField('vehicleInformation', newData);
  };

  const handleBooleanChange = (field: 'transportationForHire' | 'commercialVehicle', value: boolean) => {
    const newData = { 
      ...vehicleData, 
      [field]: value 
    };
    setVehicleData(newData);
    updateField('vehicleInformation', newData);
  };

  const handleTrailerCoachChange = (field: keyof TrailerCoachDetails, value: string) => {
    const newData = { 
      ...vehicleData, 
      trailerCoachDetails: {
        ...(vehicleData.trailerCoachDetails || {}),
        [field]: value
      }
    };
    setVehicleData(newData);
    updateField('vehicleInformation', newData);
  };

  const handleCommercialVehicleChange = (field: keyof CommercialVehicleDetails, value: string | 'Actual' | 'Estimated') => {
    const newData = { 
      ...vehicleData, 
      commercialVehicleDetails: {
        ...(vehicleData.commercialVehicleDetails || {}),
        [field]: value
      }
    };
    setVehicleData(newData);
    updateField('vehicleInformation', newData);
  };

  const vehicleTypes = ['Auto', 'Commercial', 'Motorcycle', 'Off Highway', 'Trailer Coach'];

  return (
    <div className="vehicle-information-wrapper">
      <div className="section-header">
        <h3 className="section-title">Vehicle Information for Title or Registration</h3>
      </div>

      <div className="vehicle-type-section">
        <label className="section-label">TYPE OF VEHICLE (CHECK ONE BOX)</label>
        <div className="vehicle-type-options">
          {vehicleTypes.map((type) => (
            <label key={type} className="vehicle-type-label">
              <input
                type="radio"
                name="vehicleType"
                checked={vehicleData.vehicleType === type}
                onChange={() => handleVehicleTypeChange(type as VehicleInformationData['vehicleType'])}
              />
              {type}
            </label>
          ))}
        </div>
      </div>

      <div className="question-section">
        <label className="section-label">
          Will this vehicle be used for the transportation of persons for hire, compensation, or profit 
          (e.g., limousine, taxi, bus, etc.)?
        </label>
        <div className="radio-group">
          <label className="radio-label">
            <input
              type="radio"
              name="transportationForHire"
              checked={vehicleData.transportationForHire === true}
              onChange={() => handleBooleanChange('transportationForHire', true)}
            />
            Yes
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="transportationForHire"
              checked={vehicleData.transportationForHire === false}
              onChange={() => handleBooleanChange('transportationForHire', false)}
            />
            No
          </label>
        </div>
      </div>

      <div className="question-section">
        <label className="section-label">
          Is this a commercial vehicle that operates at 10,001 lbs. or more (or is a pickup exceeding 8,001 lbs. unladen and/or 11,499 lbs. Gross Vehicle Weight Rating (GVWR))?
        </label>
        <div className="radio-group">
          <label className="radio-label">
            <input
              type="radio"
              name="commercialVehicle"
              checked={vehicleData.commercialVehicle === true}
              onChange={() => handleBooleanChange('commercialVehicle', true)}
            />
            Yes
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="commercialVehicle"
              checked={vehicleData.commercialVehicle === false}
              onChange={() => handleBooleanChange('commercialVehicle', false)}
            />
            No
          </label>
        </div>
      </div>

      {/* <div className="important-note">
        <p>
          <strong>IMPORTANT:</strong> If yes, a Declaration of Gross Vehicle Weight/Combined Gross Vehicle Weight 
          (REG 4008) form must be completed. If yes, a Motor Carrier Permit may be required. 
          Refer to www.dmv.ca.gov for more information.
        </p>
      </div> */}

      {vehicleData.vehicleType === 'Trailer Coach' && (
        <div className="trailer-coach-section">
          <div className="trailer-coach-dimensions">
            <div className="input-group">
              <label className="input-label">LENGTH</label>
              <input
                type="text"
                className="form-input"
                value={vehicleData.trailerCoachDetails?.length || ''}
                onChange={(e) => handleTrailerCoachChange('length', e.target.value)}
              />
            </div>
            <div className="input-group">
              <label className="input-label">WIDTH</label>
              <input
                type="text"
                className="form-input"
                value={vehicleData.trailerCoachDetails?.width || ''}
                onChange={(e) => handleTrailerCoachChange('width', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {vehicleData.commercialVehicle && (
        <div className="commercial-vehicle-section">
          <div className="input-group">
            <label className="input-label">NUMBER OF AXLES</label>
            <input
              type="text"
              className="form-input"
              value={vehicleData.commercialVehicleDetails?.numberOfAxes || ''}
              onChange={(e) => handleCommercialVehicleChange('numberOfAxes', e.target.value)}
            />
          </div>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="unladenWeight"
                checked={vehicleData.commercialVehicleDetails?.unladenWeight === 'Actual'}
                onChange={() => handleCommercialVehicleChange('unladenWeight', 'Actual')}
              />
              Actual
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="unladenWeight"
                checked={vehicleData.commercialVehicleDetails?.unladenWeight === 'Estimated'}
                onChange={() => handleCommercialVehicleChange('unladenWeight', 'Estimated')}
              />
              Estimated (Vehicles over 10,001 lbs. only)
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleInformation;