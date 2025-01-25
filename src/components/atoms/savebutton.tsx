'use client';
import React, { useState } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import { UserAuth } from '../../context/AuthContext';

interface SaveButtonProps {
  transactionType: string;
  onSuccess?: () => void;
}

const SaveButton: React.FC<SaveButtonProps> = ({ transactionType, onSuccess }) => {
  const { formData } = useFormContext();
  const { user } = UserAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!user || !transactionType) {
      alert('User ID and Transaction Type are required.');
      return;
    }

    setIsLoading(true);

    const dataToSave = {
      userId: user.uid,
      transactionType,
      formData,
    };

    try {
      const saveResponse = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave),
      });

      if (saveResponse.ok) {
        const saveResult = await saveResponse.json();
        const { transactionId } = saveResult;

        const fillPdfResponse = await fetch('/api/fillPdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transactionId }),
        });

        if (fillPdfResponse.ok) {
          const pdfBlob = await fillPdfResponse.blob();
          const pdfUrl = URL.createObjectURL(pdfBlob);

          const pdfWindow = window.open(pdfUrl, '_blank');
          if (!pdfWindow) {
            alert('Please allow popups to view the PDF.');
          }
        } else {
          const error = await fillPdfResponse.json();
          throw new Error(error.error || 'Failed to generate PDF');
        }

        onSuccess?.();
      } else {
        const error = await saveResponse.json();
        throw new Error(error.error || 'Failed to save transaction');
      }
    } catch (error: any) {
      console.error('Save failed:', error);
      alert(`Error: ${error.message || 'An unexpected error occurred'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSave}
      disabled={isLoading}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
    >
      {isLoading ? 'Saving...' : 'Save'}
    </button>
  );
};

export default SaveButton;