import React, { useState, useEffect } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import './CommercialVehicleInfo.css';

interface CommercialVehicleData {
  numberOfAxles: string;
  unladenWeight: string;
  isEstimatedWeight: boolean | null;
  bodyModelType: string; 
}

interface CommercialVehicleInfoProps {
  formData?: {
    commercialVehicleInfo?: CommercialVehicleData;
    _showValidationErrors?: boolean;
    [key: string]: any;
  };
}

const CommercialVehicleInfo: React.FC<CommercialVehicleInfoProps> = ({ formData: propFormData }) => {
  const { formData: contextFormData, updateField } = useFormContext();
  
  const formData = {
    ...contextFormData,
    ...propFormData
  };
  
  const [vehicleData, setVehicleData] = useState<CommercialVehicleData>({
    numberOfAxles: formData?.commercialVehicleInfo?.numberOfAxles || '',
    unladenWeight: formData?.commercialVehicleInfo?.unladenWeight || '',
    isEstimatedWeight: formData?.commercialVehicleInfo?.isEstimatedWeight === true ? true : 
                       formData?.commercialVehicleInfo?.isEstimatedWeight === false ? false : null,
    bodyModelType: formData?.commercialVehicleInfo?.bodyModelType || '' 
  });
  
  const showValidationErrors = formData?._showValidationErrors === true;

  useEffect(() => {
    if (formData?.commercialVehicleInfo) {
      setVehicleData({
        numberOfAxles: formData.commercialVehicleInfo.numberOfAxles || vehicleData.numberOfAxles,
        unladenWeight: formData.commercialVehicleInfo.unladenWeight || vehicleData.unladenWeight,
        isEstimatedWeight: formData.commercialVehicleInfo.isEstimatedWeight !== undefined 
          ? formData.commercialVehicleInfo.isEstimatedWeight 
          : vehicleData.isEstimatedWeight,
        bodyModelType: formData.commercialVehicleInfo.bodyModelType || vehicleData.bodyModelType
      });
    }
  }, [formData?.commercialVehicleInfo]);

  const handleInputChange = (field: keyof CommercialVehicleData, value: string | boolean) => {
    const newData = { ...vehicleData, [field]: value };
    setVehicleData(newData);
    updateField('commercialVehicleInfo', newData);
  };

 
  const handleAxlesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    handleInputChange('numberOfAxles', value);
  };

 
  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    handleInputChange('unladenWeight', value);
  };

  const handleWeightTypeChange = (isEstimated: boolean) => {
    handleInputChange('isEstimatedWeight', isEstimated);
  };

  const handleBodyModelTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange('bodyModelType', e.target.value);
  };

  return (
    <div className="commercial-vehicle-wrapper">
      <div className="commercial-heading">
        <h3>FOR COMMERCIAL VEHICLES ONLY</h3>
      </div>
      
      <div className="commercial-fields-container">
        <div className="commercial-field-group">
          <label htmlFor="axles-input">Number of axles:</label>
          <input
            id="axles-input"
            type="text"
            className={`form-control ${showValidationErrors && !vehicleData.numberOfAxles ? 'validation-error' : ''}`}
            value={vehicleData.numberOfAxles}
            onChange={handleAxlesChange}
            placeholder="Enter number"
            maxLength={2}
          />
          {showValidationErrors && !vehicleData.numberOfAxles && (
            <p className="validation-message">Number of axles is required</p>
          )}
        </div>
        
        <div className="commercial-field-group">
          <label htmlFor="weight-input">Unladen weight:</label>
          <input
            id="weight-input"
            type="text"
            className={`form-control ${showValidationErrors && !vehicleData.unladenWeight ? 'validation-error' : ''}`}
            value={vehicleData.unladenWeight}
            onChange={handleWeightChange}
            placeholder="Enter weight"
          />
          {showValidationErrors && !vehicleData.unladenWeight && (
            <p className="validation-message">Unladen weight is required</p>
          )}
        </div>
        
        <div className="commercial-field-group" style={{ maxWidth: '180px' }}>
          <label htmlFor="body-model-type">Body Model Type:</label>
          <input
            id="body-model-type"
            type="text"
            className="form-control"
            value={vehicleData.bodyModelType}
            onChange={handleBodyModelTypeChange}
            placeholder="Body type"
          />
        </div>
        
        <div className="weight-type-container">
          <div className="weight-type-option">
            <label className="checkbox-label">
              <input 
                type="checkbox"
                checked={vehicleData.isEstimatedWeight === false}
                onChange={() => handleWeightTypeChange(false)}
                className="checkbox-input"
              />
              <span className="checkbox-text">Actual</span>
            </label>
          </div>
          
          <div className="weight-type-option">
            <label className="checkbox-label">
              <input 
                type="checkbox"
                checked={vehicleData.isEstimatedWeight === true}
                onChange={() => handleWeightTypeChange(true)}
                className="checkbox-input"
              />
              <span className="checkbox-text">Estimated (Vehicles over 10,001 lbs. only)</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommercialVehicleInfo;