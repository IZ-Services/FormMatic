import React, { useState, useEffect } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import './PlatesStickerDocRequest.css';

interface ReplacementRequestData {
  licensePlates?: boolean;
  registrationCard?: boolean;
  yearSticker?: boolean;
  monthSticker?: boolean;
  vesselBoatYearSticker?: boolean;
  vesselCertificateOfNumber?: boolean;
  vesselMusselFeeSticker?: boolean;
  disabledPersonRecord?: boolean;
  disabledPersonIdCard?: boolean;
  cvraWeightDecal?: boolean;
  cvraYearSticker?: boolean;
  trailerOrOhvIdCard?: boolean;
  plannedNonOperationCard?: boolean;
  pfrSticker?: boolean;
}

interface ReplacementRequestProps {
  formData?: {
    replacementRequest?: ReplacementRequestData;
  };
}

const ReplacementRequest: React.FC<ReplacementRequestProps> = ({ formData: propFormData }) => {
  const [requestData, setRequestData] = useState<ReplacementRequestData>(
    propFormData?.replacementRequest || {}
  );
  const { updateField } = useFormContext();

  useEffect(() => {
    if (propFormData?.replacementRequest) {
      setRequestData(propFormData.replacementRequest);
    }
  }, [propFormData]);

  const handleCheckboxChange = (field: keyof ReplacementRequestData, value: boolean) => {
    const newData = { 
      ...requestData, 
      [field]: value 
    };
    setRequestData(newData);
    updateField('replacementRequest', newData);
  };

  const renderCheckboxGroup = (group: { label: string; field: keyof ReplacementRequestData }[]) => {
    return group.map(({ label, field }) => (
      <label key={field} className="checkbox-label">
        <input
          type="checkbox"
          checked={requestData[field] || false}
          onChange={(e) => handleCheckboxChange(field, e.target.checked)}
        />
        {label}
      </label>
    ));
  };

  return (
    <div className="replacement-request-wrapper">
      <div className="section-header">
        <h3 className="section-title">Plates, Stickers, Document Request</h3>
      </div>


      <div className="checkbox-container">
        <div className="checkbox-column">
          {renderCheckboxGroup([
            { label: 'License Plates', field: 'licensePlates' },
            { label: 'Registration Card', field: 'registrationCard' },
            { label: 'Year Sticker', field: 'yearSticker' },
            { label: 'Month Sticker', field: 'monthSticker' }
          ])}
        </div>
        <div className="checkbox-column">
          {renderCheckboxGroup([
            { label: 'Vessel (Boat) Year Sticker', field: 'vesselBoatYearSticker' },
            { label: 'Vessel Certificate of Number', field: 'vesselCertificateOfNumber' },
            { label: 'Vessel Mussel Fee Sticker', field: 'vesselMusselFeeSticker' },
            { label: 'Disabled Person Placard', field: 'disabledPersonRecord' }
          ])}
        </div>
        <div className="checkbox-column">
          {renderCheckboxGroup([
            { label: 'Disabled Person ID Card', field: 'disabledPersonIdCard' },
            { label: 'CVRA Weight Decal', field: 'cvraWeightDecal' },
            { label: 'CVRA Year Sticker', field: 'cvraYearSticker' },
            { label: 'Trailer or OHV ID Card', field: 'trailerOrOhvIdCard' },
            { label: 'Planned Non-Operation Card', field: 'plannedNonOperationCard' },
            { label: 'PFR Sticker', field: 'pfrSticker' }
          ])}
        </div>
      </div>
    </div>
  );
};

export default ReplacementRequest;