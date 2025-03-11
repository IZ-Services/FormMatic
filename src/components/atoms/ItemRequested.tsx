import React, { useState, useEffect } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import './ItemRequested.css';

interface ItemRequestedData {
  lost?: boolean;
  stolen?: boolean;
  destroyedMutilated?: boolean;
  notReceivedFromDMV?: boolean;
  notReceivedFromPriorOwner?: boolean;
  surrendered?: boolean;
  numberOfPlatesSurrendered?: 'One' | 'Two' | '';
  specialPlatesRetained?: boolean;
  requestingRegistrationCard?: boolean;
  perCVC4467?: boolean;
  other?: boolean;
  otherExplanation?: string;
}

interface ItemRequestedProps {
  formData?: {
    itemRequested?: ItemRequestedData;
    [key: string]: any;
  };
  onChange?: (data: ItemRequestedData) => void;
}

const ItemRequested: React.FC<ItemRequestedProps> = ({ formData: propFormData, onChange }) => {
  const { formData: contextFormData, updateField } = useFormContext() as {
    formData: Record<string, any>;
    updateField: (key: string, value: any) => void;
  };

  const combinedFormData = {
    ...contextFormData,
    ...propFormData
  };

  const initialData: ItemRequestedData = {
    lost: false,
    stolen: false,
    destroyedMutilated: false,
    notReceivedFromDMV: false,
    notReceivedFromPriorOwner: false,
    surrendered: false,
    numberOfPlatesSurrendered: '',
    specialPlatesRetained: false,
    requestingRegistrationCard: false,
    perCVC4467: false,
    other: false,
    otherExplanation: ''
  };

  const [itemData, setItemData] = useState<ItemRequestedData>({
    ...initialData,
    ...combinedFormData?.itemRequested
  });

  useEffect(() => {
 
    if (combinedFormData?.itemRequested) {
      setItemData(prevData => ({
        ...prevData,
        ...combinedFormData.itemRequested
      }));
    }
  }, [combinedFormData?.itemRequested]);

  const handleCheckboxChange = (field: keyof ItemRequestedData) => {
    const newData = {
      ...itemData,
      [field]: !itemData[field]
    };

 
    if (field === 'surrendered' && !newData.surrendered) {
      newData.numberOfPlatesSurrendered = '';
    }

    setItemData(newData);
    
    if (onChange) {
      onChange(newData);
    } else {
      updateField('itemRequested', newData);
    }
  };

  const handlePlatesNumberChange = (value: 'One' | 'Two') => {
    const newData = {
      ...itemData,
      numberOfPlatesSurrendered: value
    };

    setItemData(newData);
    
    if (onChange) {
      onChange(newData);
    } else {
      updateField('itemRequested', newData);
    }
  };

  const handleOtherExplanationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newData = {
      ...itemData,
      otherExplanation: e.target.value
    };

    setItemData(newData);
    
    if (onChange) {
      onChange(newData);
    } else {
      updateField('itemRequested', newData);
    }
  };

  return (
    <div className="item-requested-wrapper">
      <div className="header-row">
        <h3 className="section-heading">THE ITEM REQUESTED WAS</h3>
        <span className="section-subheading">(Check appropriate box(es))</span>
      </div>

      <div className="checkbox-grid">
        <div className="checkbox-row">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={itemData.lost || false}
              onChange={() => handleCheckboxChange('lost')}
            />
            <span>Lost</span>
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={itemData.stolen || false}
              onChange={() => handleCheckboxChange('stolen')}
            />
            <span>Stolen</span>
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={itemData.destroyedMutilated || false}
              onChange={() => handleCheckboxChange('destroyedMutilated')}
            />
            <span>Destroyed/Mutilated <i>(remnants/remains of the plate(s) must be surrendered to DMV)</i></span>
          </label>
        </div>

        <div className="checkbox-row">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={itemData.notReceivedFromDMV || false}
              onChange={() => handleCheckboxChange('notReceivedFromDMV')}
            />
            <span>Not Received from DMV <i>(Allow 30 days from issue date before reapplying)</i></span>
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={itemData.notReceivedFromPriorOwner || false}
              onChange={() => handleCheckboxChange('notReceivedFromPriorOwner')}
            />
            <span>Not Received from Prior Owner</span>
          </label>
        </div>

        <div className="checkbox-row">
          <div className="surrendered-section">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={itemData.surrendered || false}
                onChange={() => handleCheckboxChange('surrendered')}
              />
              <span>Surrendered</span>
            </label>
            
            {itemData.surrendered && (
              <div className="plates-number-section">
                <span className="plates-label">Number of plates surrendered to DMV</span>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={itemData.numberOfPlatesSurrendered === 'One'}
                    onChange={() => handlePlatesNumberChange('One')}
                  />
                  <span>One</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={itemData.numberOfPlatesSurrendered === 'Two'}
                    onChange={() => handlePlatesNumberChange('Two')}
                  />
                  <span>Two</span>
                </label>
              </div>
            )}
          </div>
        </div>

        <div className="checkbox-row">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={itemData.specialPlatesRetained || false}
              onChange={() => handleCheckboxChange('specialPlatesRetained')}
            />
            <span>Special Plates were Retained by Owner <i>(Personalized, Disabled Person, Disabled Veteran)</i></span>
          </label>
        </div>

        <div className="checkbox-row">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={itemData.requestingRegistrationCard || false}
              onChange={() => handleCheckboxChange('requestingRegistrationCard')}
            />
            <span>Requesting Registration Card with Current Address</span>
          </label>
        </div>

        <div className="checkbox-row">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={itemData.perCVC4467 || false}
              onChange={() => handleCheckboxChange('perCVC4467')}
            />
            <span>Per CVC §4467 – Copy of a police report, court documentation, or other law enforcement documentation required.</span>
          </label>
        </div>

        <div className="checkbox-row">
          <div className="other-section">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={itemData.other || false}
                onChange={() => handleCheckboxChange('other')}
              />
              <span>Other – Explain:</span>
            </label>
            
            {itemData.other && (
              <input
                type="text"
                className="other-explanation"
                value={itemData.otherExplanation || ''}
                onChange={handleOtherExplanationChange}
                placeholder="Enter explanation"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemRequested;