'use client';
import React, { createContext, useState, useContext } from 'react';

export interface Scenerio {
  _id?: string;
  transactionType: string;
  subsections: string[];
}

interface ScenarioContextType {
  scenarios: Scenerio[];
  selectedSubsection: string | null;
  setSelectedSubsection: React.Dispatch<React.SetStateAction<string | null>>;
}

const ScenarioContext = createContext<ScenarioContextType | null>(null);

const scenerios: Scenerio[] = [
  {
    transactionType: 'Simple Transfer',
    subsections: [
      'Simple Transfer Without Title',
      'Simple Transfer + Duplicate Title',
      'Simple Transfer + Duplicate Plates/Stickers',
      'Simple Transfer + Smog Required',
      'Simple Transfer + Smog Exempt',
      'Simple Transfer + Penalty Waiver',
      'Simple Transfer + Gift',
      'Simple Transfer + Gift + Smog Required',
      'Simple Transfer + Gift + Smog Exempt',
      'Simple Transfer + Gift + Duplicate Title',
      'Simple Transfer + Gift + Duplicate Plates/Stickers',
      'Simple Transfer + Gift + Penalty Waiver',
      'Simple Transfer + Gift + Smog Required + Duplicate Plates/Stickers',
      'Simple Transfer + Smog Exempt + Duplicate Plates/Stickers',
      'Simple Transfer + Penalty Waiver + Duplicate Plates/Stickers',
    ],
  },
    {
    transactionType: 'Out of State Transfer',
    subsections: [
      'Out-of-State Registration',
      'Out-of-State Registration + Smog Required',
      'Out-of-State Registration + Smog Exempt',
      'Out-of-State Registration + Duplicate Title',
      'Out-of-State Registration + Duplicate Plates/Stickers',
      'Out-of-State Registration + VIN Verification',
      'Out-of-State Registration + Lienholder Addition',
      'Out-of-State Registration + Lienholder Removal',
      'Out-of-State Registration + Penalty Waiver',
      'Out-of-State Registration + Smog Required + Duplicate Plates/Stickers',
      'Out-of-State Registration + Smog Exempt + Duplicate Plates/Stickers',
      'Out-of-State Registration + VIN Verification + Duplicate Plates/Stickers'
    ],
  },
  {
    transactionType: 'Renewal',
    subsections: [
      'Renewal Only',
      'Renewal + Penalty Waiver',
      'Renewal + Duplicate Plates/Stickers',
      'Renewal + Duplicate Title',
      'Renewal + Disabled Person Placards/Plates',
      'Renewal + Personalized Plates',
      'Renewal + Commercial Vehicle Weight Fee Adjustment'
    ],
  },
  {
    transactionType: 'Salvage Title Registration',
    subsections: [
      'Salvage Title Registration',
      'Salvage Title Registration + Smog Required',
      'Salvage Title Registration + Smog Exempt',
      'Salvage Title Registration + Duplicate Plates/Stickers',
      'Salvage Title Registration + Penalty Waiver',
      'Salvage Title Registration + VIN Verification',
    ],
  },
  {
    transactionType: 'Planned Non-Operation (PNO)',
    subsections: [
      'Filing PNO',
      'Filing PNO + Penalty Waiver',
      'Filing PNO + Duplicate Title',
    ],
  },
  {
    transactionType: 'Commercial Vehicle Registration',
    subsections: [
      'Commercial Vehicle Registration',
      'Commercial Vehicle Registration + Weight Fee Change',
      'Commercial Vehicle Registration + Conversion to Private Use',
      'Commercial Vehicle Registration + Duplicate Title',
      'Commercial Vehicle Registration + Duplicate Plates/Stickers',
      'Commercial Vehicle Registration + Smog Exempt',
      'Commercial Vehicle Registration + Penalty Waiver',
      'Commercial Vehicle Registration + Disabled Person Placards/Plates',
    ],
  },
  {
    transactionType: 'Lienholder Changes',
    subsections: [
      'Lienholder Addition',
      'Lienholder Addition + Duplicate Title',
      'Lienholder Addition + Smog Required',
      'Lienholder Addition + Smog Exempt',
      'Lienholder Addition + Duplicate Plates/Stickers',
      'Lienholder Removal',
      'Lienholder Removal + Duplicate Title',
    ],
  },
  {
    transactionType: 'License Plate Transactions',
    subsections: [
      'License Plate Transfer',
      'License Plate Transfer + Duplicate Plates',
      'License Plate Transfer + Personalized Plates',
    ],
  },
  {
    transactionType: 'Other Unique Transactions',
    subsections: [
      'Name Change/Correction on Title',
      'Name Change/Correction on Title + Duplicate Title',
      'Name Change/Correction on Title + Smog Required',
      'Name Change/Correction on Title + Smog Exempt',
      'Disabled Person Placards/Plates',
      'VIN Verification Only',
      'VIN Verification + Transfer or Registration',
      'Penalty Waiver for Late Registration',
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