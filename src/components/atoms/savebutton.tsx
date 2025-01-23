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
      console.log('[SaveButton] Saving transaction...');
      const saveResponse = await fetch('/api/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSave),
      });

      if (saveResponse.ok) {
        const saveResult = await saveResponse.json();
        console.log('[SaveButton] Transaction saved:', saveResult);

        alert('Transaction saved successfully: ' + saveResult.message);

        // Extract transactionId from the save response
        const { transactionId } = saveResult;

        // Call the fillPdf API with the transactionId
        const fillPdfResponse = await fetch('/api/fillPdf', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ transactionId }),
        });

        if (fillPdfResponse.ok) {
          const pdfBlob = await fillPdfResponse.blob();
          const pdfUrl = URL.createObjectURL(pdfBlob);

          window.open(pdfUrl, '_blank');
          console.log('[SaveButton] PDF opened in a new tab.');
        } else {
          const pdfError = await fillPdfResponse.json();
          console.error('[SaveButton] Error generating PDF:', pdfError);
          alert('Failed to generate PDF: ' + pdfError.error);
        }

        if (onSuccess) {
          onSuccess(); // Trigger any additional success actions
        }
      } else {
        const error = await saveResponse.json();
        console.error('[SaveButton] Error saving transaction:', error);
        alert('Failed to save transaction: ' + error.error);
      }
    } catch (error) {
      console.error('[SaveButton] Unexpected error:', error);
      alert('An unexpected error occurred.');
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
