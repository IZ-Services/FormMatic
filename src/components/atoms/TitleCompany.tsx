'use client';
import React, { useState, useEffect } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import './TitleCompany.css'; // You'll need to create this CSS file

interface TitleFieldProps {
  formData?: {
    title?: string;
  };
  onChange?: (data: { title: string }) => void;
}

const TitleField: React.FC<TitleFieldProps> = ({ formData: propFormData, onChange }) => {
  const [titleData, setTitleData] = useState<{ title: string }>({
    title: propFormData?.title || '',
  });
  
  const { formData: contextFormData, updateField } = useFormContext() as {
    formData: Record<string, any>;
    updateField: (section: string, value: any) => void;
  };
  
  useEffect(() => {
    if (propFormData?.title !== undefined && propFormData.title !== titleData.title) {
      setTitleData({ title: propFormData.title });
    }
  }, [propFormData]);
  
  useEffect(() => {
    if (!onChange) {
      updateField('title', titleData.title);
    }
  }, []);
  
  // Function to capitalize the first letter
  const capitalizeFirstLetter = (str: string): string => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  
  const handleTitleChange = (value: string) => {
    console.log(`Updating title to:`, value);
    
    // Apply capitalization
    const capitalizedValue = capitalizeFirstLetter(value);
    const newData = { title: capitalizedValue };
    setTitleData(newData);
    
    if (onChange) {
      onChange(newData);
    } else {
      updateField('title', capitalizedValue);
    }
  };
  
  return (
    <div className="titleFieldWrapper">
      <label className="titleFieldLabel">Title if Signing for a Company</label>
      <input
        className="titleFieldInput"
        type="text"
        placeholder="Enter title"
        value={titleData.title}
        onChange={(e) => handleTitleChange(e.target.value)}
      />
    </div>
  );
};

export default TitleField;