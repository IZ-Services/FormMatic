import React, { useState } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import { UserAuth } from '../../context/AuthContext';
import PreviewModal from './previewmodal';
import './savebutton.css';
import { PDFDocument } from 'pdf-lib';

interface SaveButtonProps {
  transactionType: string;
  onSuccess?: () => void;
  multipleTransferData?: {
    numberOfTransfers: number;
    transfersData: any[];
    isMultipleTransfer: boolean;
  };
}

interface OwnerData {
  firstName: string;
  middleName: string;
  lastName: string;
  licenseNumber: string;
  state: string;
  phoneCode: string;
  phoneNumber: string;
  purchaseDate: string;
  purchaseValue: string;
  marketValue: string;
  isGift: boolean;
  isTrade: boolean;
  relationshipWithGifter?: string;
  giftValue?: string;
}

interface AddressData {
  street?: string;
  apt?: string;
  city?: string;
  state?: string;
  zip?: string;
  poBox?: string;
  county?: string;
}

interface FormData {
  owners?: OwnerData[];
  howMany?: string;
  vehicleTransactionDetails?: {
    isGift?: boolean;
    withTitle?: boolean;
    currentLienholder?: boolean;
    isMotorcycle?: boolean;
    isFamilyTransfer?: boolean;
    isSmogExempt?: boolean;

  };
  mailingAddressDifferent?: boolean;
  lesseeAddressDifferent?: boolean;
  trailerLocationDifferent?: boolean;
  address?: AddressData;
  mailingAddress?: AddressData;
  lesseeAddress?: AddressData;
  trailerLocation?: AddressData;
  _showValidationErrors?: boolean;
  _id?: string;
  [key: string]: any; 
}

const SaveButton: React.FC<SaveButtonProps> = ({ transactionType, onSuccess, multipleTransferData }) => {
  const { formData, updateField } = useFormContext() as { 
    formData: FormData; 
    updateField: (field: string, value: any) => void 
  };
  
  const { user } = UserAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [showValidationDialog, setShowValidationDialog] = useState(false);
  
  const isDuplicatePlatesOrStickers = 
    transactionType === "Duplicate Plates & Stickers" || 
    transactionType === "Duplicate Stickers";

  const prepareTransferData = (transferData: FormData): FormData => {
    const preparedData = { ...transferData };
    
    if (!preparedData.address) {
      preparedData.address = {
        street: '',
        apt: '',
        city: '',
        state: '',
        zip: '',
        poBox: '',
        county: ''
      };
    }
    
    if (preparedData.mailingAddressDifferent && !preparedData.mailingAddress) {
      preparedData.mailingAddress = {
        street: '',
        apt: '',
        city: '',
        state: '',
        zip: '',
        poBox: '',
        county: ''
      };
    }
    
    if (preparedData.lesseeAddressDifferent && !preparedData.lesseeAddress) {
      preparedData.lesseeAddress = {
        street: '',
        apt: '',
        city: '',
        state: '',
        zip: '',
        poBox: '',
        county: ''
      };
    }
    
    if (preparedData.trailerLocationDifferent && !preparedData.trailerLocation) {
      preparedData.trailerLocation = {
        street: '',
        apt: '',
        city: '',
        state: '',
        zip: '',
        poBox: '',
        county: ''
      };
    }
    
    if (preparedData.mailingAddressDifferent === undefined) {
      preparedData.mailingAddressDifferent = false;
    }
    
    if (preparedData.lesseeAddressDifferent === undefined) {
      preparedData.lesseeAddressDifferent = false;
    }
    
    if (preparedData.trailerLocationDifferent === undefined) {
      preparedData.trailerLocationDifferent = false;
    }
    
    return preparedData;
  };

  const validateSingleForm = (data: FormData) => {
    if (isDuplicatePlatesOrStickers) {
      return true;
    }
    
    if (!data.owners || !Array.isArray(data.owners) || data.owners.length === 0) {
      return false;
    }

    const requiredFields = ['firstName', 'lastName', 'licenseNumber', 'state', 'phoneNumber', 'purchaseDate'];
    const isGift = data.vehicleTransactionDetails?.isGift === true;
    
    const missingFields = [];
    
    for (let i = 0; i < data.owners.length; i++) {
      const owner = data.owners[i];
      
      for (const field of requiredFields) {
        if (!owner[field as keyof OwnerData]) {
          missingFields.push(`owners[${i}].${field}`);
        }
      }
      
      if (isGift && !owner.marketValue) {
        missingFields.push(`owners[${i}].marketValue`);
      } else if (!isGift && !owner.purchaseValue) {
        missingFields.push(`owners[${i}].purchaseValue`);
      }
      
      if (isGift && i === 0) {
        if (!owner.relationshipWithGifter) {
          missingFields.push(`owners[${i}].relationshipWithGifter`);
        }
        if (!owner.giftValue) {
          missingFields.push(`owners[${i}].giftValue`);
        }
      }
    }
    
    return missingFields.length === 0;
  };

  const validateForm = () => {
    if (isDuplicatePlatesOrStickers) {
      return true;
    }
    
    if (multipleTransferData?.isMultipleTransfer) {
      const { transfersData } = multipleTransferData;
      let allValid = true;
      
      for (let i = 0; i < multipleTransferData.numberOfTransfers; i++) {
        const transferData = transfersData[i];
        if (!validateSingleForm(transferData)) {
          allValid = false;
          break;
        }
      }
      
      if (!allValid) {
        updateField('_showValidationErrors', true);
        return false;
      }
      
      return true;
    } else {
      return validateSingleForm(formData);
    }
  };

  const handleSaveClick = () => {
    if (!validateForm()) {
      setShowValidationDialog(true);
      return;
    }
    
    handleSave();
  };


  const mergePDFs = async (pdfBlobs: { blob: Blob, title: string }[]): Promise<Blob> => {
    try {
      const mergedPdf = await PDFDocument.create();
      
      for (const pdfData of pdfBlobs) {
        try {
          console.log(`Merging PDF: ${pdfData.title}, size: ${pdfData.blob.size} bytes`);
          const arrayBuffer = await pdfData.blob.arrayBuffer();
          

          const pdfDoc = await PDFDocument.load(arrayBuffer, { 
            ignoreEncryption: true 
          });
          
          const pages = await pdfDoc.getPages();
          console.log(`Successfully loaded PDF with ${pages.length} pages`);
          
          for (let i = 0; i < pages.length; i++) {
            const [copiedPage] = await mergedPdf.copyPages(pdfDoc, [i]);
            mergedPdf.addPage(copiedPage);
            console.log(`Added page ${i+1} from ${pdfData.title}`);
          }
        } catch (error) {
          console.error(`Error processing PDF ${pdfData.title}:`, error);

        }
      }
      
      console.log('Creating final merged PDF...');
      const mergedPdfBytes = await mergedPdf.save();
      console.log(`Merged PDF created, size: ${mergedPdfBytes.length} bytes`);
      
      return new Blob([mergedPdfBytes], { type: 'application/pdf' });
    } catch (error:any) {
      console.error('Error merging PDFs:', error);
      throw new Error(`Failed to merge PDFs: ${error.message}`);
    }
  };

  const handleSave = async () => {
    if (!user || !transactionType) {
      alert('User ID and Transaction Type are required.');
      return;
    }
  
    setShowValidationDialog(false);
    setIsLoading(true);
  
    try {
      if (multipleTransferData?.isMultipleTransfer) {
        const { transfersData, numberOfTransfers } = multipleTransferData;
        const allTransactionIds = [];
        const allPdfBlobs = [];
        
        for (let i = 0; i < numberOfTransfers; i++) {
          let transferData = JSON.parse(JSON.stringify(transfersData[i]));
          transferData = prepareTransferData(transferData);
          console.log(`Saving transfer ${i + 1} of ${numberOfTransfers}:`, JSON.stringify({
            owners: transferData.owners?.length || 0,
            vehicleInfo: Boolean(transferData.vehicleInformation),
            sellerInfo: Boolean(transferData.seller),
            address: Boolean(transferData.address)
          }));
          
          const normalizedData = {
            ...transferData,
            owners: transferData.owners || (transferData.newOwners?.owners || []),
            vehicleInformation: transferData.vehicleInformation || {},
            sellerInfo: { 
              sellers: transferData.seller?.sellers || [transferData.seller].filter(Boolean) || [] 
            },
            address: transferData.address || {},
            mailingAddressDifferent: Boolean(transferData.mailingAddressDifferent),
          };
          
          const dataToSave = {
            userId: user.uid,
            transactionType: `Multiple Transfer ${i + 1} of ${numberOfTransfers}`,
            formData: normalizedData,
            transferIndex: i,
            totalTransfers: numberOfTransfers,
            isPartOfMultipleTransfer: true
          };
          
          const endpoint = transferData._id ? '/api/update' : '/api/save';
          
          const saveResponse = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSave),
          });
          
          if (saveResponse.ok) {
            const saveResult = await saveResponse.json();
            const { transactionId } = saveResult;
            allTransactionIds.push(transactionId);
            console.log(`Successfully saved transfer ${i + 1}, got ID:`, transactionId);
          } else {
            const error = await saveResponse.json();
            throw new Error(error.error || `Failed to save transfer ${i + 1}`);
          }
        }
        
        for (let i = 0; i < allTransactionIds.length; i++) {
          const transactionId = allTransactionIds[i];
          const transferForms = [`Reg227`, `DMVREG262`];
          
          for (const formType of transferForms) {
            const response = await fetch('/api/fillPdf', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ transactionId, formType }),
            });
            
            if (response.ok) {
              const blob = await response.blob();
              allPdfBlobs.push({
                blob,
                title: `Transfer ${i + 1} - ${formType}`
              });
            } else {
              console.error(`Failed to generate ${formType} for transfer ${i + 1}`);
            }
          }
        }
        
        if (allTransactionIds.length > 0) {
          const response = await fetch('/api/fillPdf', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              transactionId: allTransactionIds[0], 
              formType: 'Reg101' 
            }),
          });
          
          if (response.ok) {
            const blob = await response.blob();
            allPdfBlobs.push({
              blob,
              title: 'Vehicle Registration Application (Reg101)'
            });
          } else {
            console.error('Failed to generate Reg101 form');
          }
        }
        
        if (allPdfBlobs.length > 0) {
          const mergedPdfBlob = await mergePDFs(allPdfBlobs);
          const pdfUrl = URL.createObjectURL(mergedPdfBlob);
          window.open(pdfUrl, '_blank');
          setTimeout(() => {
            URL.revokeObjectURL(pdfUrl);
          }, 5000);
        } else {
          throw new Error('No PDFs were generated successfully');
        }
        
        updateField('_showValidationErrors', false);
        onSuccess?.();
        
      } else if (isDuplicatePlatesOrStickers) {
        console.log(`Handling save for ${transactionType}`);
        
        const enhancedFormData = {
          ...formData,
          transactionType
        };
        
        const dataToSave = {
          userId: user.uid,
          transactionType,
          formData: enhancedFormData,
          transactionId: formData._id
        };
        
        console.log("Saving with transaction type:", transactionType);
        
        const endpoint = formData._id ? '/api/update' : '/api/save';
        
        const saveResponse = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSave),
        });
        
        if (saveResponse.ok) {
          const saveResult = await saveResponse.json();
          const { transactionId } = saveResult;
          
          updateField('_showValidationErrors', false);
          
          console.log(`Opening Reg156 form for ${transactionType}`);
          const fillPdfResponse = await fetch('/api/fillPdf', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              transactionId, 
              formType: 'Reg156',
              transactionType
            }),
          });
  
          if (fillPdfResponse.ok) {
            const pdfBlob = await fillPdfResponse.blob();
            const pdfUrl = URL.createObjectURL(pdfBlob);
            
            console.log('Opening Reg156 PDF directly at URL:', pdfUrl);
            const pdfWindow = window.open(pdfUrl, '_blank');
            if (!pdfWindow) {
              alert(`Please allow popups to view the ${transactionType} form.`);
            }
            
            setTimeout(() => {
              URL.revokeObjectURL(pdfUrl);
            }, 5000);
          } else {
            const error = await fillPdfResponse.json();
            throw new Error(error.error || 'Failed to generate Reg156 PDF');
          }
          
          onSuccess?.();
        } else {
          const error = await saveResponse.json();
          throw new Error(error.error || 'Failed to save transaction');
        }
      } else {
        const standardizedFormData = prepareTransferData(formData);
        
        const dataToSave = {
          userId: user.uid,
          transactionType,
          formData: standardizedFormData,
          transactionId: formData._id
        };
        
        const endpoint = formData._id ? '/api/update' : '/api/save';
        
        const saveResponse = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSave),
        });
        
        if (saveResponse.ok) {
          const saveResult = await saveResponse.json();
          const { transactionId } = saveResult;
          
          updateField('_showValidationErrors', false);
          
          await openMergedPdfs(transactionId);
          
          onSuccess?.();
        } else {
          const error = await saveResponse.json();
          throw new Error(error.error || 'Failed to save transaction');
        }
      }
    } catch (error: any) {
      console.error('Save failed:', error);
      alert(`Error: ${error.message || 'An unexpected error occurred'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const openMergedPdfs = async (transactionId: string) => {
    try {
      let formTypes = [];
      
      console.log('Opening PDFs for transaction type:', transactionType);
      
      if (transactionType === "Disabled Person and Placards") {
        formTypes = ['REG195'];
        console.log('Disabled Person and Placards: Using REG195 form');
      } else if (transactionType === "Lien Holder Addition") {
        formTypes = ['Reg227'];
      } else if (transactionType === "Lien Holder Removal") {
        formTypes = ['Reg227', 'DMVReg166']; 
        console.log('Lien Holder Removal: Using both Reg227 and DMVReg166 forms');
      } else if (transactionType === "Duplicate Title Transfer") {
        formTypes = ['Reg227'];
        console.log('Duplicate Title Transfer: Using Reg227 form');
      } else if (transactionType === "Duplicate Registration Transfer") {
        formTypes = ['Reg156'];
        console.log('Duplicate Registration Transfer: Using Reg156 form');
      } else if (transactionType === "Name Change/Correction Transfer") {
        formTypes = ['Reg256'];
        console.log('Name Change/Correction Transfer: Using Reg256 form');
      } else if (transactionType === "Change Of Address Transfer") {
        formTypes = ['DMV14'];
        console.log('Change Of Address Transfer: Using DMV14 form');
      } else {
        formTypes = ['Reg227', 'DMVREG262'];
        
        if (formData.vehicleTransactionDetails?.isFamilyTransfer || 
            formData.vehicleTransactionDetails?.isGift ||
            formData.vehicleTransactionDetails?.isSmogExempt) {
          formTypes.push('Reg256');
          console.log('Including Reg256 form due to family transfer, gift, or smog exemption');
        }
      }
      
      const pdfBlobs: { blob: Blob, title: string }[] = [];
      
      for (const formType of formTypes) {
        console.log(`Requesting PDF for form type: ${formType}`);
        
        try {
          const fillPdfResponse = await fetch('/api/fillPdf', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              transactionId, 
              formType,
              transactionType
            }),
          });
      
          if (fillPdfResponse.ok) {
            const pdfBlob = await fillPdfResponse.blob();
            console.log(`Successfully received PDF for ${formType}, size: ${pdfBlob.size} bytes`);
            
            if (pdfBlob.size > 0) {
              pdfBlobs.push({ 
                blob: pdfBlob, 
                title: formType 
              });
            } else {
              console.warn(`PDF for ${formType} has zero size, skipping`);
            }
          } else {
            let errorText = 'Unknown error';
            try {
              const errorJson = await fillPdfResponse.json();
              errorText = errorJson.error || 'Unknown error';
            } catch (err) {
              errorText = await fillPdfResponse.text();
            }
            console.error(`Error fetching ${formType} (${fillPdfResponse.status}):`, errorText);
          }
        } catch (error) {
          console.error(`Exception while fetching ${formType}:`, error);
        }
      }
      
      if (pdfBlobs.length === 0) {
        throw new Error('No PDFs were generated successfully');
      }
      
      console.log(`Successfully received ${pdfBlobs.length} PDFs, merging them...`);
      
      if (pdfBlobs.length === 1) {
        console.log('Only one PDF available, opening directly without merging');
        const pdfUrl = URL.createObjectURL(pdfBlobs[0].blob);
        const pdfWindow = window.open(pdfUrl, '_blank');
        
        if (!pdfWindow) {
          alert('Please allow popups to view the PDF forms.');
        }
        
        setTimeout(() => {
          URL.revokeObjectURL(pdfUrl);
        }, 5000);
        
        return true;
      }
      
      const mergedPdfBlob = await mergePDFs(pdfBlobs);
      const pdfUrl = URL.createObjectURL(mergedPdfBlob);
      const pdfWindow = window.open(pdfUrl, '_blank');
      
      if (!pdfWindow) {
        alert('Please allow popups to view the PDF forms.');
      }
      
      setTimeout(() => {
          URL.revokeObjectURL(pdfUrl);
      }, 5000);
      
      return true;
    } catch (error: any) {
      console.error('Error opening PDFs:', error);
      alert(`Error opening PDFs: ${error.message}`);
      return false;
    }
  };
  return (
    <div className="saveButtonContainer">
      <button
        onClick={handleSaveClick}
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

      {showValidationDialog && (
        <div className="validation-dialog-overlay">
          <div className="validation-dialog">
            <h3>Missing Information</h3>
            <p>Some required fields are missing. Would you like to continue anyway?</p>
            <div className="validation-buttons">
              <button 
                className="cancel-button" 
                onClick={() => setShowValidationDialog(false)}
              >
                Cancel
              </button>
              <button 
                className="continue-button" 
                onClick={handleSave}
              >
                Continue Anyway
              </button>
            </div>
          </div>
        </div>
      )}

      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        formData={multipleTransferData?.isMultipleTransfer ? multipleTransferData : formData}
      />
    </div>
  );
};

export default SaveButton;