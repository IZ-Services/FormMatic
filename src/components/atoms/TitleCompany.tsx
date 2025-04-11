'use client';
import React, { useState, useEffect } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import './TitleCompany.css';

interface TitleFieldProps {
  formData?: {
    title?: string;
  };
  onChange?: (data: { title: string }) => void;
}

 
export const TITLE_FIELD_STORAGE_KEY = 'formmatic_title_field';

 
export const clearTitleFieldStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TITLE_FIELD_STORAGE_KEY);
    console.log('Title field data cleared from localStorage');
  }
};

const TitleField: React.FC<TitleFieldProps> = ({ formData: propFormData, onChange }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [titleData, setTitleData] = useState<{ title: string }>({
    title: '',
  });
  
  const { formData: contextFormData, updateField, clearFormTriggered } = useFormContext() as {
    formData: Record<string, any>;
    updateField: (section: string, value: any) => void;
    clearFormTriggered?: number | null;
  };
  
 
  useEffect(() => {
    if (clearFormTriggered) {
      console.log('Clear form triggered in TitleField component');
      clearTitleFieldStorage();
      
      const emptyData = { title: '' };
      setTitleData(emptyData);
      
 
      updateField('title', '');
      
      if (onChange) {
        onChange(emptyData);
      }
    }
  }, [clearFormTriggered]);
  
 
  useEffect(() => {
    if (typeof window !== 'undefined' && !isInitialized) {
      try {
        const savedData = localStorage.getItem(TITLE_FIELD_STORAGE_KEY);
        
        if (savedData) {
          console.log("Loading title field data from localStorage");
          const parsedData = JSON.parse(savedData);
          
 
          const titleValue = propFormData?.title !== undefined ? propFormData.title : parsedData.title;
          const mergedData = { title: titleValue };
          
          setTitleData(mergedData);
          
 
          updateField('title', mergedData.title);
          
          if (onChange) {
            onChange(mergedData);
          }
        } else if (propFormData?.title !== undefined) {
 
          const newData = { title: propFormData.title };
          setTitleData(newData);
          updateField('title', newData.title);
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Error loading saved title field data:', error);
        setIsInitialized(true);
        
 
        if (propFormData?.title !== undefined) {
          const newData = { title: propFormData.title };
          setTitleData(newData);
        }
      }
    }
  }, []);
  
 
  useEffect(() => {
    if (isInitialized && propFormData?.title !== undefined && propFormData.title !== titleData.title) {
      setTitleData({ title: propFormData.title });
    }
  }, [propFormData, isInitialized]);
  
 
  useEffect(() => {
    if (isInitialized && !onChange) {
      updateField('title', titleData.title);
    }
  }, [titleData, isInitialized]);
  
  const capitalizeFirstLetter = (str: string): string => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  
  const handleTitleChange = (value: string) => {
    console.log(`Updating title to:`, value);
    
    const capitalizedValue = capitalizeFirstLetter(value);
    const newData = { title: capitalizedValue };
    setTitleData(newData);
    
 
    if (typeof window !== 'undefined') {
      localStorage.setItem(TITLE_FIELD_STORAGE_KEY, JSON.stringify(newData));
    }
    
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