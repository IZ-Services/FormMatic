import React, { useState, useEffect } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';

interface CommercialVehicleQuestionsProps {
  formData?: any;
  onChange?: (data: any) => void;
}

const CommercialVehicleQuestions: React.FC<CommercialVehicleQuestionsProps> = ({ 
  formData: propFormData,
  onChange 
}) => {
  const { formData: contextFormData, updateField } = useFormContext();
  
  const initialData = {
    isForHire: false,
    isCommercialOverWeight: false,
    ...(propFormData?.commercialVehicleQuestions || {}),
    ...(contextFormData?.commercialVehicleQuestions || {})
  };
  
  const [questions, setQuestions] = useState(initialData);

  useEffect(() => {
    const mergedData = {
      ...initialData,
      ...(contextFormData?.commercialVehicleQuestions || {}),
      ...(propFormData?.commercialVehicleQuestions || {})
    };
    
    setQuestions(mergedData);
  }, [contextFormData?.commercialVehicleQuestions, propFormData?.commercialVehicleQuestions]);

  const handleChange = (field: string, value: boolean) => {
    const updatedData = {
      ...questions,
      [field]: value
    };
    
    setQuestions(updatedData);
    updateField('commercialVehicleQuestions', updatedData);
    
    if (onChange) {
      onChange(updatedData);
    }
  };

  return (
    <div className="commercial-questions-container" style={{ 
     
      marginBottom: '20px',
      fontSize: '14px',
      lineHeight: '1.5',
      marginTop: '20px'

    }}>
      <div className="question-row" style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px'
      }}>
        <div className="question-text" style={{ flex: 1 }}>
          Will this vehicle be used for the transportation of persons for hire, compensation, or profit (e.g. limousine, taxi, bus, etc.)?
        </div>
        <div className="checkbox-group" style={{ display: 'flex', gap: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <input
              type="checkbox"
              checked={questions.isForHire === true}
              onChange={() => handleChange('isForHire', true)}
              style={{ width: '18px', height: '18px' }}
            />
            Yes
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <input
              type="checkbox"
              checked={questions.isForHire === false}
              onChange={() => handleChange('isForHire', false)}
              style={{ width: '18px', height: '18px' }}
            />
            No
          </label>
        </div>
      </div>
      
      <div className="question-row" style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px'
      }}>
        <div className="question-text" style={{ flex: 1 }}>
          Is this a commercial vehicle that operates at 10,001 lbs. or more (or is a pickup exceeding 8,001 lbs. unladen and/or 11,499 lbs. Gross Vehicle Weight Rating (GVWR)?
        </div>
        <div className="checkbox-group" style={{ display: 'flex', gap: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <input
              type="checkbox"
              checked={questions.isCommercialOverWeight === true}
              onChange={() => handleChange('isCommercialOverWeight', true)}
              style={{ width: '18px', height: '18px' }}
            />
            Yes
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <input
              type="checkbox"
              checked={questions.isCommercialOverWeight === false}
              onChange={() => handleChange('isCommercialOverWeight', false)}
              style={{ width: '18px', height: '18px' }}
            />
            No
          </label>
        </div>
      </div>
    
    </div>
  );
};

export default CommercialVehicleQuestions;