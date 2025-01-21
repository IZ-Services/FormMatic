'use client';
import React, { useState } from 'react';
import './SelectTransaction.css';
import { useScenarioContext } from '../../context/ScenarioContext';
import SimpleTransfer from '../../components/molecules/SimpleTransfer';

const scenerios = [
  {
    transactionType: 'Transfer',
    subsections: [
      'Simple Transfer Without Title',
      'Transfer w. Duplicate Plates/Stickers',
      'Transfer w. Gift',
      'Transfer w. Gift & Duplicate Plates/Stickers',
    ],
  },
  {
    transactionType: 'Renewal',
    subsections: [
      'Simple Renewal',
      'Renewal w. Duplicate Plates/Stickers',
      'Renewal w. Change of Address',
      'Out of State Renewal & Needs Smog',
      'Renewal w. Disabled Plates',
    ],
  },
  {
    transactionType: 'Out of State Transfer',
    subsections: ['Simple Out of State Transfer'],
  },
];

export default function SelectTransaction() {
  const { setSelectedSubsection } = useScenarioContext()!;
  const [hoveredType, setHoveredType] = useState<string | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);

  const renderComponent = () => {
    switch (selectedTransaction) {
      case 'Simple Transfer Without Title':
        return <SimpleTransfer />;
      default:
        return <div>Component for {selectedTransaction} not yet implemented.</div>;
    }
  };

  if (selectedTransaction) {
    return (
      <div className="selectedTransactionContainer">
        <h2 className="transactionHeading">{selectedTransaction}</h2>
        {renderComponent()}
      </div>
    );
  }

  return (
    <div className="selectTransactionContainer">
      <h1 className="pageTitle">Select a Transaction Type</h1>
      <div className="transactionTypeGrid">
        {scenerios.map((scenerio, index) => (
          <div
            key={index}
            className="transactionTypeBox"
            onMouseEnter={() => setHoveredType(scenerio.transactionType)}
            onMouseLeave={() => setHoveredType(null)}
          >
            <span className="transactionTypeText">{scenerio.transactionType}</span>
            {hoveredType === scenerio.transactionType && (
              <div className="subTransactionTree">
                {scenerio.subsections.map((subsection, subIndex) => (
                  <div
                    key={subIndex}
                    className="subTransactionBox"
                    onClick={() => {
                      setSelectedSubsection(subsection); // Update ScenarioContext
                      setSelectedTransaction(subsection); // Update local state
                    }}
                  >
                    {subsection}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
