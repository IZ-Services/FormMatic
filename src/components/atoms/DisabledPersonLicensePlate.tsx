'use client';
import React, { useEffect } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import './DisabledPersonLicensePlate.css';

interface DisabledPersonLicensePlatesType {
  licensePlateNumber?: string;
  vehicleIdentificationNumber?: string;
  vehicleMake?: string;
  vehicleYear?: string;
 
  weightFeeExemption?: boolean;
}

interface DisabledPersonLicensePlatesProps {
  formData?: {
    disabledPersonLicensePlates?: DisabledPersonLicensePlatesType;
  };
  onChange?: (data: DisabledPersonLicensePlatesType) => void;
  readOnly?: boolean;
}

const initialDisabledPersonLicensePlates: DisabledPersonLicensePlatesType = {
  licensePlateNumber: '',
  vehicleIdentificationNumber: '',
  vehicleMake: '',
  vehicleYear: '',
  weightFeeExemption: undefined 
};

const DisabledPersonLicensePlates: React.FC<DisabledPersonLicensePlatesProps> = ({
  formData: propFormData,
  onChange,
  readOnly = false
}) => {
  const { formData: contextFormData, updateField } = useFormContext();

  const formData = {
    ...contextFormData,
    ...propFormData
  };

  useEffect(() => {
    if (!formData.disabledPersonLicensePlates) {
      const newData = initialDisabledPersonLicensePlates;
      updateField('disabledPersonLicensePlates', newData);
      if (onChange) {
        onChange(newData);
      }
    }
  }, []);

  const handleDisabledPersonLicensePlatesChange = (field: keyof DisabledPersonLicensePlatesType, value: string | boolean) => {
    const currentInfo = (formData.disabledPersonLicensePlates || {}) as DisabledPersonLicensePlatesType;
    const newInfo = { ...currentInfo, [field]: value };
    
    updateField('disabledPersonLicensePlates', newInfo);
    if (onChange) {
      onChange(newInfo);
    }
  };

  return (
    <div className="disabledPersonLicensePlatesWrapper">
      <div className="sectionHeader">
        <h3 className="sectionTitle">DISABLED PERSON LICENSE PLATES APPLICANTS <span className="onlyText">ONLY</span>: VEHICLE INFORMATION</h3>
      </div>
    
      <div className="formFields">
        <div className="formRow">
<div className="formField">
  <label className="fieldLabel">LICENSE PLATE</label>
  <input
    className="fieldInput"
    type="text"
    placeholder="License Plate Number"
    value={((formData.disabledPersonLicensePlates as DisabledPersonLicensePlatesType)?.licensePlateNumber || '').toUpperCase()}
    onChange={(e) => handleDisabledPersonLicensePlatesChange('licensePlateNumber', e.target.value.toUpperCase())}
    disabled={readOnly}
  />
</div>

<div className="formField vinField">
  <label className="fieldLabel">VEHICLE IDENTIFICATION NUMBER</label>
  <input
    className="fieldInput"
    type="text"
    placeholder="Vehicle Identification Number"
    value={((formData.disabledPersonLicensePlates as DisabledPersonLicensePlatesType)?.vehicleIdentificationNumber || '').toUpperCase()}
    onChange={(e) => handleDisabledPersonLicensePlatesChange('vehicleIdentificationNumber', e.target.value.toUpperCase())}
    disabled={readOnly}
  />
</div>

<div className="formField">
  <label className="fieldLabel">VEHICLE MAKE</label>
  <input
    className="fieldInput"
    type="text"
    placeholder="Vehicle Make"
    value={((formData.disabledPersonLicensePlates as DisabledPersonLicensePlatesType)?.vehicleMake || '').toUpperCase()}
    onChange={(e) => handleDisabledPersonLicensePlatesChange('vehicleMake', e.target.value.toUpperCase())}
    disabled={readOnly}
  />
</div>
          
          <div className="formField">
            <label className="fieldLabel">VEHICLE YEAR</label>
            <input
              className="fieldInput"
              type="text"
              placeholder="Vehicle Year"
              value={(formData.disabledPersonLicensePlates as DisabledPersonLicensePlatesType)?.vehicleYear || ''}
              onChange={(e) => {
                const value = e.target.value;
                const numericValue = value.replace(/[^0-9]/g, '');
                const limitedValue = numericValue.slice(0, 4);
                
                handleDisabledPersonLicensePlatesChange('vehicleYear', limitedValue);
              }}
              maxLength={4}
              disabled={readOnly}
            />
          </div>
        </div>
      </div>

       {/* Weight Fee Exemption section */}
       <div className="exemptionContainer">
        <div className="exemptionText">
          <p>Commercial Vehicles – Weight Fee Exemption. I am requesting an exemption from weight fees for the vehicle described above. It weighs less than 8,001 pounds unladen. I understand that this exemption may be used for ONE commercial vehicle only and I do not have this exemption for any other vehicles I own.</p>
        </div>
        <div className="checkboxOptions">
          <div className="checkboxOption">
            <input
              type="checkbox"
              id="weightFeeExemptionYes"
              checked={(formData.disabledPersonLicensePlates as DisabledPersonLicensePlatesType)?.weightFeeExemption === true}
              onChange={() => handleDisabledPersonLicensePlatesChange('weightFeeExemption', true)}
              disabled={readOnly}
            />
            <label htmlFor="weightFeeExemptionYes">Yes</label>
          </div>
          <div className="checkboxOption">
            <input
              type="checkbox"
              id="weightFeeExemptionNo"
              checked={(formData.disabledPersonLicensePlates as DisabledPersonLicensePlatesType)?.weightFeeExemption === false}
              onChange={() => handleDisabledPersonLicensePlatesChange('weightFeeExemption', false)}
              disabled={readOnly}
            />
            <label htmlFor="weightFeeExemptionNo">No</label>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default DisabledPersonLicensePlates;