import React, { useState } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import { UserAuth } from '../../context/AuthContext';
import PreviewModal from './previewmodal';
import './savebutton.css';
import { PDFDocument } from 'pdf-lib';
declare global {
  interface Window {
    _failedPdfs?: Array<{ blob: Blob, title: string }>;
  }
}
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
    isOutOfStateTitle?: boolean;
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
  };const mergePDFs = async (pdfBlobs: { blob: Blob, title: string }[]): Promise<Blob> => {
  try {
    console.log(`Attempting to merge ${pdfBlobs.length} PDFs`);    if (pdfBlobs.length === 1) {
      console.log('Only one PDF, returning it directly');
      return pdfBlobs[0].blob;
    }    const mergedPdf = await PDFDocument.create();
    const failedPdfs: { blob: Blob, title: string }[] = [];    for (const pdfData of pdfBlobs) {
      try {
        console.log(`Processing PDF: ${pdfData.title}, size: ${pdfData.blob.size} bytes`);        const arrayBuffer = await pdfData.blob.arrayBuffer();        let pdfDoc;
        try {
          pdfDoc = await PDFDocument.load(arrayBuffer, { 
            ignoreEncryption: true 
          });
        } catch (loadError) {
          console.warn(`Failed to load PDF ${pdfData.title}, will open separately: ${String(loadError)}`);
          failedPdfs.push(pdfData);
          continue;        }        const pages = await pdfDoc.getPages();
        console.log(`Successfully loaded PDF with ${pages.length} pages`);        for (let i = 0; i < pages.length; i++) {
          try {
            const [copiedPage] = await mergedPdf.copyPages(pdfDoc, [i]);
            mergedPdf.addPage(copiedPage);
            console.log(`Added page ${i+1} from ${pdfData.title}`);
          } catch (pageError) {
            console.error(`Error copying page ${i+1} from ${pdfData.title}:`, pageError);            failedPdfs.push(pdfData);
            break;
          }
        }
      } catch (error) {
        console.error(`Error processing PDF ${pdfData.title}:`, error);
        failedPdfs.push(pdfData);
      }
    }    try {
      const mergedPages = await mergedPdf.getPageCount();
      
      if (mergedPages > 0) {
        console.log(`Creating merged PDF with ${mergedPages} pages...`);
        const mergedPdfBytes = await mergedPdf.save();
        const mergedPdfBlob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
        console.log(`Merged PDF created, size: ${mergedPdfBlob.size} bytes`);        if (failedPdfs.length === 0) {          return mergedPdfBlob;
        } else {          console.warn(`${failedPdfs.length} PDFs could not be merged`);          window._failedPdfs = failedPdfs;
          return mergedPdfBlob;
        }
      } else {
        console.warn('No pages were successfully merged');        if (pdfBlobs.length > 1) {
          window._failedPdfs = pdfBlobs.slice(1);
        }
        return pdfBlobs[0].blob;
      }
    } catch (saveError) {
      console.error('Error saving merged PDF:', saveError);      if (pdfBlobs.length > 1) {
        window._failedPdfs = pdfBlobs.slice(1);
      }
      return pdfBlobs[0].blob;
    }
  } catch (error) {
    console.error('Error in PDF merge process:', error);    return pdfBlobs[0].blob;
  }
};
const handlePdfDisplay = async (transactionId: string) => {
  try {
    let formTypes = [];
    
    console.log('Opening PDFs for transaction type:', transactionType);
    
    if (transactionType === "Disabled Person and Placards") {
      formTypes = ['REG195'];
    } else if (transactionType === "Personalized Plates (Order)" || 
               transactionType === "Personalized Plates (Reassignment)" ||
               transactionType === "Personalized Plates (Replacement)" ||
               transactionType === "Personalized Plates (Exchange)") {
      formTypes = ['REG17'];
    } else if (transactionType === "Filing PNO Transfer" || 
               transactionType === "Certificate Of Non-Operation Transfer") {
      formTypes = ['REG102'];
      if (formData.pnoDetails?.requestPnoCard) {
        formTypes.push('Reg156');
      }
    } else if (transactionType === "Lien Holder Addition") {
      formTypes = ['Reg227'];
    } else if (transactionType === "Lien Holder Removal") {
      formTypes = ['Reg227', 'DMVReg166'];
    } else if (transactionType === "Duplicate Title Transfer") {
      formTypes = ['Reg227'];
    } else if (transactionType === "Duplicate Registration Transfer") {
      formTypes = ['Reg156'];
    } else if (transactionType === "Name Change/Correction Transfer") {
      formTypes = ['Reg256'];
    } else if (transactionType === "Change Of Address Transfer") {
      formTypes = ['DMV14'];
    }else if (transactionType === "Salvage Title Transfer") {
      formTypes = ['Reg488c'];
    }  
    else if (transactionType === "Restoring PNO Transfer") {
      formTypes = ['Reg256'];
    }  
    
    else if (transactionType === "Commercial Vehicle Transfer") {
      formTypes = ['Reg343', 'Reg4008', 'Reg256'];
            const vehicleType = formData.vehicleTypeInfo?.vehicleType;
      if (vehicleType && ['Bus', 'Taxicab', 'Limousine', 'Station Wagon'].includes(vehicleType)) {
        formTypes.push('Reg590');
        console.log(`Adding Reg590 form for vehicle type: ${vehicleType}`);
      } else {
        console.log(`Not including Reg590 - vehicle type is: ${vehicleType || 'not specified'}`);
      }
      
      console.log('Commercial Vehicle Transfer: Using forms:', formTypes.join(', '));
    } else {
      formTypes = ['Reg227', 'DMVREG262'];
      
      if (formData.vehicleTransactionDetails?.isFamilyTransfer || 
          formData.vehicleTransactionDetails?.isGift ||
          formData.vehicleTransactionDetails?.isSmogExempt) {
        formTypes.push('Reg256');
      }
      
      if (formData.vehicleTransactionDetails?.isOutOfStateTitle) {
        formTypes.push('Reg343');
      }
    }
    
    window._failedPdfs = [];
    
    const pdfBlobs: Array<{ blob: Blob, title: string }> = [];
    
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
          
          if (pdfBlob.size > 0) {
            console.log(`Received PDF for ${formType}, size: ${pdfBlob.size} bytes`);
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
    
    const mergedPdfBlob = await mergePDFs(pdfBlobs);
    
    const pdfUrl = URL.createObjectURL(mergedPdfBlob);
    window.open(pdfUrl, '_blank');
    
    setTimeout(() => {
      URL.revokeObjectURL(pdfUrl);
    }, 5000);
    
    if (window._failedPdfs && window._failedPdfs.length > 0) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log(`Opening ${window._failedPdfs.length} PDFs that couldn't be merged`);
      
      for (const failedPdf of window._failedPdfs) {
        const failedPdfUrl = URL.createObjectURL(failedPdf.blob);
        window.open(failedPdfUrl, '_blank', 'noopener');
        
        await new Promise(resolve => setTimeout(resolve, 300));
        
        setTimeout(() => {
          URL.revokeObjectURL(failedPdfUrl);
        }, 5000);
      }
    }
    
    return true;
  } catch (error: any) {
    console.error('Error opening PDFs:', error);
    alert(`Error opening PDFs: ${error.message}`);
    return false;
  }
};


const openPdfs = async (transactionId: string) => {
  return handlePdfDisplay(transactionId);
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
          
          await openPdfs(transactionId);
          
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