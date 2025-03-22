'use client';
import React, { useState, useEffect } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import './ReassignmentSection.css';

interface ReassignmentSectionType {
  specialInterestLicensePlate?: string;
  removedFrom?: string;
  placedOnLicensePlate?: string;
  placedOnVehicle?: string;
  retainInterest?: boolean;
  releaseInterestDMV?: boolean;
  releaseInterestNewOwner?: boolean;
  feeEnclosed?: boolean;
}

interface ReassignmentSectionProps {
  formData?: {
    reassignmentSection?: ReassignmentSectionType;
  };
}

const initialReassignmentSection: ReassignmentSectionType = {
  specialInterestLicensePlate: '',
  removedFrom: '',
  placedOnLicensePlate: '',
  placedOnVehicle: '',
  retainInterest: false,
  releaseInterestDMV: false,
  releaseInterestNewOwner: false,
  feeEnclosed: false,
};

const ReassignmentSection: React.FC<ReassignmentSectionProps> = ({ formData: propFormData }) => {
  const { formData: contextFormData, updateField } = useFormContext();

  const formData = {
    ...contextFormData,
    ...propFormData
  };

  useEffect(() => {
    if (!formData.reassignmentSection) {
      updateField('reassignmentSection', initialReassignmentSection);
    }
  }, []);

  const handleChange = (field: keyof ReassignmentSectionType, value: any) => {
    const currentInfo = (formData.reassignmentSection || {}) as ReassignmentSectionType;
    const newData = { ...currentInfo, [field]: value };
    

    if (field === 'releaseInterestDMV' && value === true) {
      newData.releaseInterestNewOwner = false;
    } else if (field === 'releaseInterestNewOwner' && value === true) {
      newData.releaseInterestDMV = false;
    }
    
    updateField('reassignmentSection', newData);
  };

  return (
    <div className="reassignmentWrapper">
      <div className="reassignmentHeader">
        <h3 className="reassignmentTitle">REASSIGN, RETAIN INTEREST, OR RELEASE INTEREST</h3>
      </div>
      
      <div className="reassignmentContent">
        <div className="reassignmentInputRow">
          <div className="reassignmentInput">
            <label className="reassignmentLabel">SPECIAL INTEREST LICENSE PLATE NUMBER</label>
            <input
              type="text"
              className="textInput"
              value={(formData.reassignmentSection as ReassignmentSectionType)?.specialInterestLicensePlate || ''}
              onChange={(e) => handleChange('specialInterestLicensePlate', e.target.value)}
              placeholder="Enter plate number"
            />
          </div>
          
          <div className="reassignmentInput">
            <label className="reassignmentLabel">REMOVED FROM (VEHICLE IDENTIFICATION NUMBER)</label>
            <input
              type="text"
              className="textInput"
              value={(formData.reassignmentSection as ReassignmentSectionType)?.removedFrom || ''}
              onChange={(e) => handleChange('removedFrom', e.target.value)}
              placeholder="Enter VIN"
            />
          </div>
          
          <div className="reassignmentInput">
            <label className="reassignmentLabel">PLACED ON (CURRENT LICENSE PLATE)</label>
            <input
              type="text"
              className="textInput"
              value={(formData.reassignmentSection as ReassignmentSectionType)?.placedOnLicensePlate || ''}
              onChange={(e) => handleChange('placedOnLicensePlate', e.target.value)}
              placeholder="Enter license plate"
            />
          </div>
          
          <div className="reassignmentInput">
            <label className="reassignmentLabel">PLACED ON (VEHICLE IDENTIFICATION NUMBER)</label>
            <input
              type="text"
              className="textInput"
              value={(formData.reassignmentSection as ReassignmentSectionType)?.placedOnVehicle || ''}
              onChange={(e) => handleChange('placedOnVehicle', e.target.value)}
              placeholder="Enter VIN"
            />
          </div>
        </div>
        
        <div className="reassignmentOptionsRow">
          <div className="retainSection">
            <label className="optionLabel">
              <input
                type="checkbox"
                checked={(formData.reassignmentSection as ReassignmentSectionType)?.retainInterest || false}
                onChange={(e) => handleChange('retainInterest', e.target.checked)}
                className="optionCheckbox"
              />
              <div className="optionText">
                <span className="optionTitle">RETAIN INTEREST FOR FUTURE USE. FAILURE TO PAY A REQUIRED RETENTION FEE WILL RESULT IN CANCELLATION OF THE PERSONALIZED PLATE.</span>
              </div>
            </label>
            
            <label className="feeLabel">
              <input
                type="checkbox"
                checked={(formData.reassignmentSection as ReassignmentSectionType)?.feeEnclosed || false}
                onChange={(e) => handleChange('feeEnclosed', e.target.checked)}
                className="feeCheckbox"
              />
              <span className="feeText">Fee enclosed</span>
            </label>
          </div>
          
          <div className="releaseSection">
            <label className="optionLabel">
              <input
                type="checkbox"
                checked={(formData.reassignmentSection as ReassignmentSectionType)?.releaseInterestDMV || false}
                onChange={(e) => handleChange('releaseInterestDMV', e.target.checked)}
                className="optionCheckbox"
              />
              <span className="optionTitle">RELEASE INTEREST/SURRENDER TO DMV</span>
            </label>
            
            <label className="optionLabel">
              <input
                type="checkbox"
                checked={(formData.reassignmentSection as ReassignmentSectionType)?.releaseInterestNewOwner || false}
                onChange={(e) => handleChange('releaseInterestNewOwner', e.target.checked)}
                className="optionCheckbox"
              />
              <span className="optionTitle">RELEASE INTEREST TO NEW OWNER</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReassignmentSection;