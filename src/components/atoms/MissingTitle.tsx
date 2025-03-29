'use client';
import React, { useState, useEffect } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import './MissingTitle.css';

interface MissingTitleInfo {
  reason?: string;
  otherReason?: string;
}

interface MissingTitleProps {
  formData?: {
    missingTitleInfo?: MissingTitleInfo;
  };
}

const MissingTitle: React.FC<MissingTitleProps> = ({ formData: propFormData }) => {
  const [titleData, setTitleData] = useState<MissingTitleInfo>(
    propFormData?.missingTitleInfo || {}
  );
  const [showOtherInput, setShowOtherInput] = useState<boolean>(false);
  const { updateField } = useFormContext();

  const missingTitleOptions = [
    'Lost', 
    'Stolen', 
    'Not Received From Prior Owner', 
    'Not Received From DMV', 
    'Illegible/Mutilated',
    'Other'
  ];

  useEffect(() => {
    if (propFormData?.missingTitleInfo) {
      setTitleData(propFormData.missingTitleInfo);
      setShowOtherInput(propFormData.missingTitleInfo.reason === 'Other');
    }
  }, [propFormData]);

  const handleRadioChange = (reason: string) => {
    const newData = { ...titleData, reason };
    
    if (reason === 'Other') {
      setShowOtherInput(true);
    } else {
      setShowOtherInput(false);
      delete newData.otherReason;
    }

    setTitleData(newData);
    updateField('missingTitleInfo', newData);
  };

  const handleOtherReasonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const otherReason = e.target.value;
    const newData = { ...titleData, otherReason };
    setTitleData(newData);
    updateField('missingTitleInfo', newData);
  };

  return (
    <div className="releaseWrapper">
      <div className="headerRow">
        <h3 className="releaseHeading">Missing Title Reason</h3>
      </div>
      
      <div className="checkboxes">
        {missingTitleOptions.map((reason, index) => (
          <div key={index} className="checkbox-section">
            <label className="checkbox-label">
              <input
                type="radio"
                name="missingTitleReason"
                checked={titleData.reason === reason}
                onChange={() => handleRadioChange(reason)}
              />
              {reason}
            </label>
          </div>
        ))}
      </div>
      
      {showOtherInput && (
        <div className="other-input-container">
          <input
            type="text"
            value={titleData.otherReason || ''}
            onChange={handleOtherReasonChange}
            placeholder="Please specify other reason"
            className="text-input"
          />
        </div>
      )}
    </div>
  );
};

export default MissingTitle;