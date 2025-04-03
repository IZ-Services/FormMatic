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
  isDuplicateRegistrationMode?: boolean;
}

const ItemRequested: React.FC<ItemRequestedProps> = ({ 
  formData: propFormData, 
  onChange,
  isDuplicateRegistrationMode = false
}) => {
  const { formData: contextFormData, updateField } = useFormContext() as {
    formData: Record<string, any>;
    updateField: (key: string, value: any) => void;
  };

  const combinedFormData = {
    ...contextFormData,
    ...propFormData
  };

  const initialData: ItemRequestedData = isDuplicateRegistrationMode
    ? {
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
        other: true,
        otherExplanation: 'Requesting a duplicate registration card'
      }
    : {
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


  useEffect(() => {
    if (isDuplicateRegistrationMode) {
      const updatedData = {
        ...itemData,
        other: true,
        otherExplanation: 'Requesting a duplicate registration card'
      };
      setItemData(updatedData);
      
      if (onChange) {
        onChange(updatedData);
      } else {
        updateField('itemRequested', updatedData);
      }
    }
  }, [isDuplicateRegistrationMode]);

  const handleCheckboxChange = (field: keyof ItemRequestedData) => {

    if (isDuplicateRegistrationMode) return;

    const newData = { ...itemData };
    

    if (field === 'lost' || field === 'stolen' || field === 'destroyedMutilated') {

      newData.lost = false;
      newData.stolen = false;
      newData.destroyedMutilated = false;

      newData[field] = !itemData[field];
    } 

    else if (field === 'notReceivedFromDMV' || field === 'notReceivedFromPriorOwner') {

      newData.notReceivedFromDMV = false;
      newData.notReceivedFromPriorOwner = false;

      newData[field] = !itemData[field];
    }

    else {
      newData[field] = !itemData[field] as any;
    }


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

    if (isDuplicateRegistrationMode) return;


    const newValue: 'One' | 'Two' | '' = itemData.numberOfPlatesSurrendered === value ? '' : value;
    
    const newData = {
      ...itemData,
      numberOfPlatesSurrendered: newValue
    };

    setItemData(newData);
    
    if (onChange) {
      onChange(newData);
    } else {
      updateField('itemRequested', newData);
    }
  };

  const handleOtherExplanationChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    if (isDuplicateRegistrationMode) return;

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
        {/* Group 1: Lost, Stolen, Destroyed/Mutilated - Mutually exclusive */}
        <div className="checkbox-roww">
          <label className={`checkbox-label ${isDuplicateRegistrationMode ? 'disabled' : ''}`}>
            <input
              type="checkbox"
              checked={itemData.lost || false}
              onChange={() => handleCheckboxChange('lost')}
              disabled={isDuplicateRegistrationMode}
            />
            <span>Lost</span>
          </label>

          <label className={`checkbox-label ${isDuplicateRegistrationMode ? 'disabled' : ''}`}>
            <input
              type="checkbox"
              checked={itemData.stolen || false}
              onChange={() => handleCheckboxChange('stolen')}
              disabled={isDuplicateRegistrationMode}
            />
            <span>Stolen</span>
          </label>

          <label className={`checkbox-label ${isDuplicateRegistrationMode ? 'disabled' : ''}`}>
            <input
              type="checkbox"
              checked={itemData.destroyedMutilated || false}
              onChange={() => handleCheckboxChange('destroyedMutilated')}
              disabled={isDuplicateRegistrationMode}
            />
            <span>Destroyed/Mutilated <i>(remnants/remains of the plate(s) must be surrendered to DMV)</i></span>
          </label>
        </div>

        {/* Group 2: Not Received from DMV, Not Received from Prior Owner - Mutually exclusive */}
        <div className="checkbox-roww">
          <label className={`checkbox-label ${isDuplicateRegistrationMode ? 'disabled' : ''}`}>
            <input
              type="checkbox"
              checked={itemData.notReceivedFromDMV || false}
              onChange={() => handleCheckboxChange('notReceivedFromDMV')}
              disabled={isDuplicateRegistrationMode}
            />
            <span>Not Received from DMV <i>(Allow 30 days from issue date before reapplying)</i></span>
          </label>

          <label className={`checkbox-label ${isDuplicateRegistrationMode ? 'disabled' : ''}`}>
            <input
              type="checkbox"
              checked={itemData.notReceivedFromPriorOwner || false}
              onChange={() => handleCheckboxChange('notReceivedFromPriorOwner')}
              disabled={isDuplicateRegistrationMode}
            />
            <span>Not Received from Prior Owner</span>
          </label>
        </div>

        <div className="checkbox-roww">
          <div className={`surrendered-section ${isDuplicateRegistrationMode ? 'disabled' : ''}`}>
            <label className={`checkbox-label ${isDuplicateRegistrationMode ? 'disabled' : ''}`}>
              <input
                type="checkbox"
                checked={itemData.surrendered || false}
                onChange={() => handleCheckboxChange('surrendered')}
                disabled={isDuplicateRegistrationMode}
              />
              <span>Surrendered</span>
            </label>
            
            {itemData.surrendered && !isDuplicateRegistrationMode && (
              <div className="plates-number-section">
                <span className="plates-label">Number of plates surrendered to DMV</span>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={itemData.numberOfPlatesSurrendered === 'One'}
                    onChange={() => handlePlatesNumberChange('One')}
                    disabled={isDuplicateRegistrationMode}
                  />
                  <span>One</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={itemData.numberOfPlatesSurrendered === 'Two'}
                    onChange={() => handlePlatesNumberChange('Two')}
                    disabled={isDuplicateRegistrationMode}
                  />
                  <span>Two</span>
                </label>
              </div>
            )}
          </div>
        </div>

        <div className="checkbox-roww">
          <label className={`checkbox-label ${isDuplicateRegistrationMode ? 'disabled' : ''}`}>
            <input
              type="checkbox"
              checked={itemData.specialPlatesRetained || false}
              onChange={() => handleCheckboxChange('specialPlatesRetained')}
              disabled={isDuplicateRegistrationMode}
            />
            <span>Special Plates were Retained by Owner <i>(Personalized, Disabled Person, Disabled Veteran)</i></span>
          </label>
        </div>

        <div className="checkbox-roww">
          <label className={`checkbox-label ${isDuplicateRegistrationMode ? 'disabled' : ''}`}>
            <input
              type="checkbox"
              checked={itemData.requestingRegistrationCard || false}
              onChange={() => handleCheckboxChange('requestingRegistrationCard')}
              disabled={isDuplicateRegistrationMode}
            />
            <span>Requesting Registration Card with Current Address</span>
          </label>
        </div>

        <div className="checkbox-roww">
          <label className={`checkbox-label ${isDuplicateRegistrationMode ? 'disabled' : ''}`}>
            <input
              type="checkbox"
              checked={itemData.perCVC4467 || false}
              onChange={() => handleCheckboxChange('perCVC4467')}
              disabled={isDuplicateRegistrationMode}
            />
            <span>Per CVC §4467 – Copy of a police report, court documentation, or other law enforcement documentation required.</span>
          </label>
        </div>

        <div className="checkbox-roww">
          <div className="other-section">
            <label className={isDuplicateRegistrationMode ? 'checkbox-label' : 'checkbox-label'}>
              <input
                type="checkbox"
                checked={itemData.other || false}
                onChange={() => handleCheckboxChange('other')}
                disabled={isDuplicateRegistrationMode}
              />
              <span>Other – Explain:</span>
            </label>
            
            {(itemData.other || isDuplicateRegistrationMode) && (
              <input
                type="text"
                className="other-explanation"
                value={itemData.otherExplanation || ''}
                onChange={handleOtherExplanationChange}
                placeholder="Enter explanation"
                disabled={isDuplicateRegistrationMode}
                readOnly={isDuplicateRegistrationMode}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemRequested;