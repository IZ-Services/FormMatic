'use client';
import React, { useState } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import { UserAuth } from '../../context/AuthContext';
import PreviewModal from './previewmodal';
import './savebutton.css';

interface SaveButtonProps {
  transactionType: string;
  onSuccess?: () => void;
}

const SaveButton: React.FC<SaveButtonProps> = ({ transactionType, onSuccess }) => {
  const { formData } = useFormContext();
  const { user } = UserAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

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
      transactionId: formData._id 
    };

    try {
      const endpoint = formData._id ? '/api/update' : '/api/save';

      const saveResponse = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave),
      });

      if (saveResponse.ok) {
        const saveResult = await saveResponse.json();
        const { transactionId } = saveResult;

        const openForm = async (formType:any) => {
          const fillPdfResponse = await fetch('/api/fillPdf', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ transactionId, formType }),
          });

          if (fillPdfResponse.ok) {
            const pdfBlob = await fillPdfResponse.blob();
            const pdfUrl = URL.createObjectURL(pdfBlob);

            const pdfWindow = window.open(pdfUrl, '_blank');
            if (!pdfWindow) {
              alert(`Please allow popups to view the ${formType} PDF.`);
            }
            return true;
          } else {
            const error = await fillPdfResponse.json();
            throw new Error(error.error || `Failed to generate ${formType} PDF`);
          }
        };

        // Open both forms
        await openForm('Reg227');
        await openForm('DMVREG262');

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
    <div className="saveButtonContainer">
      <button
        onClick={handleSave}
        disabled={isLoading}
        className={`saveButton ${isLoading ? 'disabled' : ''}`}
      >
        {isLoading ? <div className="spinner"></div> : 'Save'}
      </button>

      <button
        onClick={() => setIsPreviewOpen(true)} 
        className="nextButton"
      >
        Preview
      </button>

      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        formData={formData} 
      />
    </div>
  );
};

export default SaveButton;