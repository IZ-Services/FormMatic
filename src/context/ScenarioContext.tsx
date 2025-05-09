'use client';
import React, { createContext, useState, useContext, useEffect } from 'react';

export interface Subsection {
  name: string;
  subOptions?: string[];
}

export interface Scenerio {
  _id?: string;
  transactionType: string;
  subsections: (string | Subsection)[];
}

interface ScenarioContextType {
  scenarios: Scenerio[];
  selectedSubsection: string | null;
  setSelectedSubsection: React.Dispatch<React.SetStateAction<string | null>>;
  activeScenarios: Record<string, boolean>;
  setActiveScenarios: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  activeSubOptions: Record<string, boolean>;
  setActiveSubOptions: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  clearPersistedScenarios: () => void;
}

const ScenarioContext = createContext<ScenarioContextType | null>(null);

const scenerios: Scenerio[] = [
  {
    transactionType: 'Transfer',
    subsections: [
      'Simple Transfer',
      'Multiple Transfer', 
    ],
  },
  {
    transactionType: 'Duplicate & Replacement',
    subsections: [
      'Duplicate Title',
      'Duplicate Registration',
      {
        name: 'Duplicate Stickers',
        subOptions: [
          'Month',
          'Year'
        ]
      },
      'Duplicate Plates & Stickers',
    ],
  },
  {
    transactionType: 'Lienholder',
    subsections: [
      'Add Lienholder',
      'Remove Lienholder',
    ],
  },
  {
    transactionType: 'Address & Name Changes',
    subsections: [
      {
        name: 'Name Change',
        subOptions: [
          'Name Correction',
          'Legal Name Change',
          'Name Discrepancy'
        ]
      },
      'Change of Address'
    ],
  },
  {
    transactionType: 'Planned Non-Operation',
    subsections: [
      'Filing for Planned Non-Operation (PNO)',
      'Restoring PNO Vehicle to Operational',
      'Certificate of Non-Operation',
    ],
  },
  {
    transactionType: 'Specialty Plates & Placards',
    subsections: [
      {
        name: 'Personalized Plates',
        subOptions: [
          'Order',
          'Replace',
          'Reassign/Retain',
          'Exchange'
        ]
      },
      'Disabled Person Placards/Plates',
    ],
  },
  {
    transactionType: 'Commercial and Salvage Title',
    subsections: [
      'Commercial Vehicle',
      'Salvage',
    ],
  },
];

export function ScenarioProvider({ children }: Readonly<{ children: React.ReactNode }>) {
 
  const [selectedSubsection, setSelectedSubsection] = useState<string | null>(null);
  const [activeScenarios, setActiveScenarios] = useState<Record<string, boolean>>({});
  const [activeSubOptions, setActiveSubOptions] = useState<Record<string, boolean>>({});
  const [isInitialized, setIsInitialized] = useState(false);

 
  useEffect(() => {
    if (typeof window !== 'undefined' && !isInitialized) {
      try {
 
        const savedSubsection = localStorage.getItem('formmatic_selected_subsection');
        if (savedSubsection) {
          setSelectedSubsection(savedSubsection);
        }
        
 
        const savedScenarios = localStorage.getItem('formmatic_active_scenarios');
        if (savedScenarios) {
          setActiveScenarios(JSON.parse(savedScenarios));
        }
        
 
        const savedSubOptions = localStorage.getItem('formmatic_active_sub_options');
        if (savedSubOptions) {
          setActiveSubOptions(JSON.parse(savedSubOptions));
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Error loading saved scenario state:', error);
        setIsInitialized(true);
      }
    }
  }, [isInitialized]);

 
  useEffect(() => {
    if (typeof window !== 'undefined' && isInitialized) {
      if (selectedSubsection) {
        localStorage.setItem('formmatic_selected_subsection', selectedSubsection);
      } else {
        localStorage.removeItem('formmatic_selected_subsection');
      }
    }
  }, [selectedSubsection, isInitialized]);

 
  useEffect(() => {
    if (typeof window !== 'undefined' && isInitialized && Object.keys(activeScenarios).length > 0) {
      localStorage.setItem('formmatic_active_scenarios', JSON.stringify(activeScenarios));
    }
  }, [activeScenarios, isInitialized]);

 
  useEffect(() => {
    if (typeof window !== 'undefined' && isInitialized && Object.keys(activeSubOptions).length > 0) {
      localStorage.setItem('formmatic_active_sub_options', JSON.stringify(activeSubOptions));
    }
  }, [activeSubOptions, isInitialized]);

 
  const clearPersistedScenarios = () => {
    setSelectedSubsection(null);
    setActiveScenarios({});
    setActiveSubOptions({});
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('formmatic_selected_subsection');
      localStorage.removeItem('formmatic_active_scenarios');
      localStorage.removeItem('formmatic_active_sub_options');
    }
  };

  return (
    <ScenarioContext.Provider
      value={{ 
        scenarios: scenerios, 
        selectedSubsection, 
        setSelectedSubsection,
        activeScenarios,
        setActiveScenarios,
        activeSubOptions,
        setActiveSubOptions,
        clearPersistedScenarios
      }}
    >
      {children}
    </ScenarioContext.Provider>
  );
}

export const useScenarioContext = () => {
  const context = useContext(ScenarioContext);
  if (!context) {
    throw new Error('useScenarioContext must be used within a ScenarioProvider');
  }
  return context;
};