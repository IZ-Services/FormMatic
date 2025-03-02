'use client';
import React, { createContext, useState, useContext } from 'react';


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
}

const ScenarioContext = createContext<ScenarioContextType | null>(null);

const scenerios: Scenerio[] = [
  {
    transactionType: 'Transfer',
    subsections: [
      'Simple Transfer',
      'Multiple Transfer',
      'Family Transfer',
      {
        name: 'Out-of-State Title',
        subOptions: [
          'Purchased Over a Year Ago',
          'Purchased Less Than a Year Ago'
        ]
      }
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
];

export function ScenarioProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [selectedSubsection, setSelectedSubsection] = useState<string | null>(null);

  return (
    <ScenarioContext.Provider
      value={{ scenarios: scenerios, selectedSubsection, setSelectedSubsection }}
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