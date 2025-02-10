'use client';
import React from 'react';
import './savebutton.css';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: Record<string, any>;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ isOpen, onClose, formData }) => {
  if (!isOpen) return null;

  const formatKey = (key: string) => {
    return key
      .replace(/([A-Z])/g, ' $1') 
      .replace(/_/g, ' ') 
      .replace(/\b\w/g, (char) => char.toUpperCase()); 
  };

  const getValue = (value: any) => {
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (Array.isArray(value)) {
      return value.length > 0 ? (
        <ul>
          {value.map((item, index) => (
            <li key={index}>{typeof item === 'object' ? renderObject(item) : item}</li>
          ))}
        </ul>
      ) : (
        'N/A'
      );
    }
    if (typeof value === 'object' && value !== null) {
      return renderObject(value);
    }
    return value !== undefined && value !== null && value !== '' ? value.toString() : 'N/A';
  };

  const renderObject = (obj: Record<string, any>) => (
    <div className="nestedObject">
      {Object.entries(obj).map(([key, value]) => (
        <div key={key} className="objectRow">
          <strong>{formatKey(key)}:</strong> {getValue(value)}
        </div>
      ))}
    </div>
  );

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <h2>Transaction Preview</h2>

        <div className="previewContainer">
          {formData && Object.keys(formData).length > 0 ? (
            Object.keys(formData).map((sectionKey) => {
              const sectionData = formData[sectionKey];

              if (sectionKey === 'owners' && Array.isArray(sectionData)) {
                return (
                  <div key={sectionKey} className="previewSection">
                    <h3>{formatKey(sectionKey)}</h3>
                    <table className="previewTable">
                      <thead>
                        <tr>
                          {Object.keys(sectionData[0] || {}).map((colKey) => (
                            <th key={colKey}>{formatKey(colKey)}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {sectionData.map((owner, index) => (
                          <tr key={index}>
                            {Object.values(owner).map((value, i) => (
                              <td key={i}>{getValue(value)}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              }

              if (sectionKey === 'sellerInfo' && sectionData.sellers && Array.isArray(sectionData.sellers)) {
                return (
                  <div key={sectionKey} className="previewSection">
                    <h3>Sellers</h3>
                    <table className="previewTable">
                      <thead>
                        <tr>
                          {Object.keys(sectionData.sellers[0] || {}).map((colKey: string) => (
                            <th key={colKey}>{formatKey(colKey)}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {sectionData.sellers.map((seller: Record<string, any>, index: number) => (
                          <tr key={index}>
                            {Object.values(seller).map((value: any, i: number) => (
                              <td key={i}>{getValue(value)}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              }
              

              if (typeof sectionData === 'object' && sectionData !== null && !Array.isArray(sectionData)) {
                return (
                  <div key={sectionKey} className="previewSection">
                    <h3>{formatKey(sectionKey)}</h3>
                    <div className="keyValueContainer">{getValue(sectionData)}</div>
                  </div>
                );
              }

              return (
                <div key={sectionKey} className="previewSection">
                  <h3>{formatKey(sectionKey)}</h3>
                  <p>{getValue(sectionData)}</p>
                </div>
              );
            })
          ) : (
            <p>No data available</p>
          )}
        </div>

        <button className="closeButton" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default PreviewModal;
