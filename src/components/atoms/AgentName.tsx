'use client';
import React, { useState, useEffect } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import './TitleCompany.css';

interface AgentNameFieldProps {
  formData?: {
    agentName?: string;
  };
  onChange?: (data: { agentName: string }) => void;
}

const AgentNameField: React.FC<AgentNameFieldProps> = ({ formData: propFormData, onChange }) => {
  const [agentNameData, setAgentNameData] = useState<{ agentName: string }>({
    agentName: propFormData?.agentName || '',
  });
  
  const { formData: contextFormData, updateField } = useFormContext() as {
    formData: Record<string, any>;
    updateField: (section: string, value: any) => void;
  };
  
  useEffect(() => {
    if (propFormData?.agentName !== undefined && propFormData.agentName !== agentNameData.agentName) {
      setAgentNameData({ agentName: propFormData.agentName });
    }
  }, [propFormData]);
  
  useEffect(() => {
    if (!onChange) {
      updateField('agentName', agentNameData.agentName);
    }
  }, []);
  
  const formatName = (name: string): string => {
    if (!name) return '';
    
 
    return name
      .split(' ')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ');
  };
  
  const handleAgentNameChange = (value: string) => {
    console.log(`Updating agent name to:`, value);
    
    const formattedName = formatName(value);
    const newData = { agentName: formattedName };
    setAgentNameData(newData);
    
    if (onChange) {
      onChange(newData);
    } else {
      updateField('agentName', formattedName);
    }
  };
  
  return (
    <div className="titleFieldWrapper">
      <label className="titleFieldLabel">Agent Name</label>
      <input
        className="titleFieldInput"
        type="text"
        placeholder="Enter agent name"
        value={agentNameData.agentName}
        onChange={(e) => handleAgentNameChange(e.target.value)}
      />
    </div>
  );
};

export default AgentNameField;