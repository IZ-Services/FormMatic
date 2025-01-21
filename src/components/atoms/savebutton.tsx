// file: components/SaveButton.tsx

'use client';
import React, { useState } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import { UserAuth } from '../../context/AuthContext';

interface SaveButtonProps {
  transactionType: string;
}

const SaveButton: React.FC<SaveButtonProps> = ({ transactionType }) => {
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
      const response = await fetch('/api/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSave),
      });

      if (response.ok) {
        const result = await response.json();
        alert('Transaction saved successfully: ' + result.message);
      } else {
        const error = await response.json();
        alert('Failed to save transaction: ' + error.error);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button onClick={handleSave} disabled={isLoading}>
      {isLoading ? 'Saving...' : 'Save'}
    </button>
  );
};

export default SaveButton;
