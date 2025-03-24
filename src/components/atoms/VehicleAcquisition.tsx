import React, { useState, useEffect } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import './VehicleAcquisition.css';

interface VehicleAcquisitionData {
  acquiredFrom?: 'dealer' | 'privateParty' | 'dismantler' | 'familyMember';
  familyRelationship?: string;
  hasModifications?: boolean;
}

interface FormDataType {
  vehicleAcquisition?: VehicleAcquisitionData;
  [key: string]: any;
}

interface VehicleAcquisitionProps {
  formData?: FormDataType;
  onChange?: (data: VehicleAcquisitionData) => void;
}

const VehicleAcquisition: React.FC<VehicleAcquisitionProps> = ({
  formData: propFormData,
  onChange
}) => {
  const { formData: contextFormData, updateField } = useFormContext();

  const combinedFormData: FormDataType = {
    ...contextFormData,
    ...propFormData
  };

  const [acquisitionData, setAcquisitionData] = useState<VehicleAcquisitionData>({
    acquiredFrom: undefined,
    familyRelationship: '',
    hasModifications: false
  });

  useEffect(() => {
    const mergedData: VehicleAcquisitionData = {
      acquiredFrom: undefined,
      familyRelationship: '',
      hasModifications: false,
      ...combinedFormData?.vehicleAcquisition
    };
    setAcquisitionData(mergedData);
  }, [combinedFormData?.vehicleAcquisition]);

  const handleRadioChange = (value: 'dealer' | 'privateParty' | 'dismantler' | 'familyMember') => {
    const newData = {
      ...acquisitionData,
      acquiredFrom: value
    };    if (value !== 'familyMember') {
      newData.familyRelationship = '';
    }

    setAcquisitionData(newData);
    updateField('vehicleAcquisition', newData);

    if (onChange) {
      onChange(newData);
    }
  };

  const handleRelationshipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newData = {
      ...acquisitionData,
      familyRelationship: e.target.value
    };

    setAcquisitionData(newData);
    updateField('vehicleAcquisition', newData);

    if (onChange) {
      onChange(newData);
    }
  };
  
  const handleModificationChange = (value: boolean) => {
    const newData = {
      ...acquisitionData,
      hasModifications: value
    };
    
    setAcquisitionData(newData);
    updateField('vehicleAcquisition', newData);
    
    if (onChange) {
      onChange(newData);
    }
  };

  return (
    <div className="vehicleAcquisitionWrapper">
      <div className="headerRow">
        <h3 className="sectionHeading">VEHICLE WAS PURCHASED OR ACQUIRED FROM:</h3>
      </div>

      <div className="acquisitionSection">
        <div className="radioOptions">
          <label className="radio-label">
            <input
              type="radio"
              name="acquiredFrom"
              checked={acquisitionData.acquiredFrom === 'dealer'}
              onChange={() => handleRadioChange('dealer')}
            />
            Dealer
          </label>
          
          <label className="radio-label">
            <input
              type="radio"
              name="acquiredFrom"
              checked={acquisitionData.acquiredFrom === 'privateParty'}
              onChange={() => handleRadioChange('privateParty')}
            />
            Private Party
          </label>
          
          <label className="radio-label">
            <input
              type="radio"
              name="acquiredFrom"
              checked={acquisitionData.acquiredFrom === 'dismantler'}
              onChange={() => handleRadioChange('dismantler')}
            />
            Dismantler
          </label>
          
          <label className="radio-label acquisition-family">
            <input
              type="radio"
              name="acquiredFrom"
              checked={acquisitionData.acquiredFrom === 'familyMember'}
              onChange={() => handleRadioChange('familyMember')}
            />
            Immediate Family Member – State Relationship:
            {acquisitionData.acquiredFrom === 'familyMember' && (
              <input
                type="text"
                className="relationship-input"
                value={acquisitionData.familyRelationship || ''}
                onChange={handleRelationshipChange}
                placeholder="Enter relationship"
              />
            )}
          </label>
        </div>
      </div>
      
      <div className="modificationSection">
        <div className="modificationQuestion">
          <p>FOR ALL VEHICLES:</p>
          <p className="modificationText">
            Since purchasing or acquiring this vehicle, were any body type modifications, additions and/or alterations (e.g., changing from pickup to utility, etc.) made to this vehicle?
            <span className="modificationNote"> If yes, a Statement of Construction (REG 5036) form must be completed.</span>
          </p>
          
          <div className="modificationOptions">
            <label className="radio-label">
              <input
                type="radio"
                name="hasModifications"
                checked={acquisitionData.hasModifications === true}
                onChange={() => handleModificationChange(true)}
              />
              Yes
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="hasModifications"
                checked={acquisitionData.hasModifications === false}
                onChange={() => handleModificationChange(false)}
              />
              No
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleAcquisition;