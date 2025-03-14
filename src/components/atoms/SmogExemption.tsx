'use client';
import React, { useState, useEffect } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import './SmogExemption.css';


type ExemptionReasonKey = 
  | 'lastSmogCertification' 
  | 'alternativeFuel' 
  | 'outsideCalifornia' 
  | 'familyTransfer' 
  | 'soleProprietor' 
  | 'leasingCompany' 
  | 'lessorLessee' 
  | 'lessorOperator' 
  | 'addingOwners';

type PowerSourceKey = 'electricity' | 'diesel' | 'other';

interface SmogExemptionType {
  exemptionReasons?: Partial<Record<ExemptionReasonKey, boolean>>;
  powerSource?: Partial<Record<PowerSourceKey, boolean>>;
  powerSourceOther?: string;
}

interface VehicleTransactionDetailsType {
  isFamilyTransfer?: boolean;
  isSmogged?: boolean;
  [key: string]: any;
}

interface ContextFormDataType {
  smogExemption?: SmogExemptionType;
  vehicleTransactionDetails?: VehicleTransactionDetailsType;
  [key: string]: any;
}

interface SmogExemptionProps {
  formData?: {
    smogExemption?: SmogExemptionType;
  };
  onChange?: (data: SmogExemptionType) => void;
}

const SmogExemption: React.FC<SmogExemptionProps> = ({ formData: propFormData, onChange }) => {
  const { formData: contextFormData, updateField } = useFormContext() as {
    formData: ContextFormDataType;
    updateField: (field: string, value: any) => void;
  };
  

  const propSmogExemption = propFormData?.smogExemption;
  const contextSmogExemption = contextFormData?.smogExemption;
  
  const [smogData, setSmogData] = useState<SmogExemptionType>(
    propSmogExemption || contextSmogExemption || {
      exemptionReasons: {},
      powerSource: {}
    }
  );

  useEffect(() => {

    const currentSmogExemption = propSmogExemption || contextSmogExemption;
    if (currentSmogExemption) {
      setSmogData(currentSmogExemption);
    }
  }, [propSmogExemption, contextSmogExemption]);

  const handleExemptionChange = (exemptionKey: ExemptionReasonKey) => {
    const newExemptionReasons = {
      ...smogData.exemptionReasons,
      [exemptionKey]: !(smogData.exemptionReasons?.[exemptionKey] ?? false)
    };
    

    const newSmogData = {
      ...smogData,
      exemptionReasons: newExemptionReasons
    };
    

    if (exemptionKey === 'alternativeFuel' && !newExemptionReasons.alternativeFuel) {
      newSmogData.powerSource = {};
      newSmogData.powerSourceOther = '';
    }
    

    if (exemptionKey === 'familyTransfer') {
      const isFamilyTransfer = newExemptionReasons.familyTransfer || false;
      const currentVehicleTransactionDetails = contextFormData.vehicleTransactionDetails || {};
      
      updateField('vehicleTransactionDetails', {
        ...currentVehicleTransactionDetails,
        isFamilyTransfer
      });
    }
    
    setSmogData(newSmogData);
    updateField('smogExemption', newSmogData);
    
    if (onChange) {
      onChange(newSmogData);
    }
  };

  const handlePowerSourceChange = (sourceKey: PowerSourceKey) => {
    const newPowerSource = {
      ...smogData.powerSource,
      [sourceKey]: !(smogData.powerSource?.[sourceKey] ?? false)
    };
    

    const newSmogData = {
      ...smogData,
      powerSource: newPowerSource
    };
    

    if (sourceKey === 'other' && !newPowerSource.other) {
      newSmogData.powerSourceOther = '';
    }
    
    setSmogData(newSmogData);
    updateField('smogExemption', newSmogData);
    
    if (onChange) {
      onChange(newSmogData);
    }
  };

  const handleOtherPowerSourceChange = (value: string) => {
    const newSmogData = {
      ...smogData,
      powerSourceOther: value
    };
    
    setSmogData(newSmogData);
    updateField('smogExemption', newSmogData);
    
    if (onChange) {
      onChange(newSmogData);
    }
  };


  useEffect(() => {
    const hasAnyExemption = smogData.exemptionReasons && 
                           Object.values(smogData.exemptionReasons).some(value => value === true);
                           
    const currentVehicleTransactionDetails = contextFormData.vehicleTransactionDetails || {};
    
    if (hasAnyExemption !== currentVehicleTransactionDetails.isSmogged) {
      updateField('vehicleTransactionDetails', {
        ...currentVehicleTransactionDetails,
        isSmogged: hasAnyExemption
      });
    }
  }, [smogData.exemptionReasons, contextFormData.vehicleTransactionDetails]);

  return (
    <div className="smogWrapper">
      <div className="smogHeader">
        <h3 className="smogTitle">Statement for Smog Exemption</h3>
      </div>
      
      <p className="smogSubtitle">The vehicle does not require a smog certification for transfer of ownership because:</p>

      <div className="smogContent">
        {/* Main exemption checkboxes */}
        <div className="checkboxGroup">
          <label className="checkboxLabel">
            <input
              type="checkbox"
              checked={smogData.exemptionReasons?.lastSmogCertification || false}
              onChange={() => handleExemptionChange('lastSmogCertification')}
            />
            The last smog certification was obtained within the last 90 days.
          </label>
          
          <div className="checkboxWithSubOptions">
            <label className="checkboxLabel">
              <input
                type="checkbox"
                checked={smogData.exemptionReasons?.alternativeFuel || false}
                onChange={() => handleExemptionChange('alternativeFuel')}
              />
              It is powered by:
            </label>
            
            {/* Power source options - only shown when alternativeFuel is checked */}
            {smogData.exemptionReasons?.alternativeFuel && (
              <div className="subCheckboxGroup">
                <label className="subCheckboxLabel">
                  <input
                    type="checkbox"
                    checked={smogData.powerSource?.electricity || false}
                    onChange={() => handlePowerSourceChange('electricity')}
                  />
                  electricity
                </label>
                
                <label className="subCheckboxLabel">
                  <input
                    type="checkbox"
                    checked={smogData.powerSource?.diesel || false}
                    onChange={() => handlePowerSourceChange('diesel')}
                  />
                  diesel
                </label>
                
                <div className="otherInputGroup">
                  <label className="subCheckboxLabel">
                    <input
                      type="checkbox"
                      checked={smogData.powerSource?.other || false}
                      onChange={() => handlePowerSourceChange('other')}
                    />
                    Other
                  </label>
                  
                  {smogData.powerSource?.other && (
                    <input
                      type="text"
                      className="otherInput"
                      value={smogData.powerSourceOther || ''}
                      onChange={(e) => handleOtherPowerSourceChange(e.target.value)}
                      placeholder="Specify other power source"
                    />
                  )}
                </div>
              </div>
            )}
          </div>
          
          <label className="checkboxLabel">
            <input
              type="checkbox"
              checked={smogData.exemptionReasons?.outsideCalifornia || false}
              onChange={() => handleExemptionChange('outsideCalifornia')}
            />
            It is located outside the State of California. (Exception: Nevada and Mexico)
          </label>
          
          <label className="checkboxLabel">
            <input
              type="checkbox"
              checked={smogData.exemptionReasons?.familyTransfer || false}
              onChange={() => handleExemptionChange('familyTransfer')}
            />
            It is being transferred from/between:
          </label>
          
          {smogData.exemptionReasons?.familyTransfer && (
            <div className="indentedCheckbox">
              <div className="familyRelationText">
                The parent, grandparent, child, grandchild, brother, sister, spouse, or domestic partner (as defined in Family Code §297) of the transferee.*
              </div>
            </div>
          )}
          
          <label className="checkboxLabel">
            <input
              type="checkbox"
              checked={smogData.exemptionReasons?.soleProprietor || false}
              onChange={() => handleExemptionChange('soleProprietor')}
            />
            A sole proprietorship to the proprietor as owner.*
          </label>
          
          <label className="checkboxLabel">
            <input
              type="checkbox"
              checked={smogData.exemptionReasons?.leasingCompany || false}
              onChange={() => handleExemptionChange('leasingCompany')}
            />
            Companies whose principal business is leasing vehicles. There is no change in lessee or operator.*
          </label>
          
          <label className="checkboxLabel">
            <input
              type="checkbox"
              checked={smogData.exemptionReasons?.lessorLessee || false}
              onChange={() => handleExemptionChange('lessorLessee')}
            />
            Lessor and lessee of vehicle, and no change in the lessee or operator of the vehicle.*
          </label>
          
          <label className="checkboxLabel">
            <input
              type="checkbox"
              checked={smogData.exemptionReasons?.lessorOperator || false}
              onChange={() => handleExemptionChange('lessorOperator')}
            />
            Lessor and person who has been lessee's operator of the vehicle for at least one year.*
          </label>
          
          <label className="checkboxLabel">
            <input
              type="checkbox"
              checked={smogData.exemptionReasons?.addingOwners || false}
              onChange={() => handleExemptionChange('addingOwners')}
            />
            Individual(s) being added as registered owner(s).*
          </label>
        </div>
        
      </div>
    </div>
  );
};

export default SmogExemption;