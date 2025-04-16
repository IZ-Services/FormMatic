'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { clearSellerAddressStorage } from '../../../components/atoms/SellerAdrress'; 
import { clearmultipleStorage } from '../../../components/molecules/MultipleTransfer'; 

type FormData = Record<string, unknown>;

 
interface ValidationError {
  fieldPath: string;
  message: string;
}

type FormContextType = {
  formData: FormData;
  updateField: (key: string, value: unknown) => void;
  clearField: (key: string) => void;
  transactionType: string;
  setTransactionType: (type: string) => void;
  clearAllFormData: () => void;
  clearFormTriggered: number | null;
 
  validateForm: () => boolean;
  validationErrors: ValidationError[];
  setValidationErrors: (errors: ValidationError[]) => void;
  showValidationErrors: boolean;
  setShowValidationErrors: (show: boolean) => void;
};

const FormContext = createContext<FormContextType | undefined>(undefined);

interface FormDataProviderProps {
  children: React.ReactNode;
  initialData?: FormData;
}

export const FormDataProvider: React.FC<FormDataProviderProps> = ({ 
  children, 
  initialData = {} }) => {
  const [formData, setFormData] = useState<FormData>(initialData);
  const [transactionType, setTransactionType] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [clearFormTriggered, setClearFormTriggered] = useState<number | null>(null);
 
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [showValidationErrors, setShowValidationErrors] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && !isInitialized) {
      try {
        const savedType = localStorage.getItem('formmatic_transaction_type');
        if (savedType) {
          setTransactionType(savedType);
          
          const savedData = localStorage.getItem(`formmatic_form_data_${savedType}`);
          if (savedData) {
            const parsedData = JSON.parse(savedData);
            setFormData(prev => ({ ...prev, ...parsedData }));
            console.log(`Restored form data for transaction: ${savedType}`);
          }
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Error loading saved form data:', error);
        setIsInitialized(true);
      }
    }
  }, [isInitialized]);

  useEffect(() => {
    if (typeof window !== 'undefined' && isInitialized && transactionType) {
      localStorage.setItem('formmatic_transaction_type', transactionType);
    }
  }, [transactionType, isInitialized]);

  useEffect(() => {
    if (typeof window !== 'undefined' && isInitialized && transactionType) {
      const saveTimeout = setTimeout(() => {
        try {
          localStorage.setItem(`formmatic_form_data_${transactionType}`, JSON.stringify(formData));
          console.log(`Saved form data for transaction: ${transactionType}`);
        } catch (error) {
          console.error('Error saving form data:', error);
        }
      }, 500); 

      return () => clearTimeout(saveTimeout);
    }
  }, [formData, transactionType, isInitialized]);

  const updateField = (key: string, value: unknown) => {
    console.log(`Updating field: ${key} with value:`, value);
    setFormData((prev) => ({ ...prev, [key]: value }));
    
 
    setValidationErrors(prev => 
      prev.filter(error => !error.fieldPath.startsWith(key))
    );
  };

  const clearField = (key: string) => {
    console.log(`Clearing field: ${key}`);
    setFormData((prev) => {
      const newData = { ...prev };
      delete newData[key];
      return newData;
    });
  };

  const clearAllFormData = () => {
    // Clear validation state
    setValidationErrors([]);
    setShowValidationErrors(false);
    
    if (typeof window !== 'undefined') {
      if (transactionType) {
        localStorage.removeItem(`formmatic_form_data_${transactionType}`);
      }
      
      // Also clear the multipleTransferState in localStorage
      localStorage.removeItem('multipleTransferState');
      
      clearSellerAddressStorage();

      clearmultipleStorage();
    }
    
    setFormData({});
    setClearFormTriggered(Date.now());
    
    console.log('All form data cleared successfully');
  };

  
 
const validateForm = () => {
  const errors: ValidationError[] = [];
  // Add validation for NewLienHolder component
const transactionType = formData.transactionType as string | undefined;
if (transactionType === "Lien Holder Addition") {
  const lienHolder = formData.lienHolder as any | undefined;
  
  if (!lienHolder) {
    errors.push({
      fieldPath: 'lienHolder',
      message: 'Lien holder information is required'
    });
  } else {
    // Validate lien holder name
    if (!lienHolder.name) {
      errors.push({
        fieldPath: 'lienHolder.name',
        message: 'Lien holder name is required'
      });
    }
    
    // Validate ELT if provided
    if (lienHolder.eltNumber && lienHolder.eltNumber.length !== 3) {
      errors.push({
        fieldPath: 'lienHolder.eltNumber',
        message: 'ELT Number must be exactly 3 digits'
      });
    }
    
    // Validate address
    if (!lienHolder.address?.street) {
      errors.push({
        fieldPath: 'lienHolder.address.street',
        message: 'Street is required'
      });
    }
    
    if (!lienHolder.address?.city) {
      errors.push({
        fieldPath: 'lienHolder.address.city',
        message: 'City is required'
      });
    }
    
    if (!lienHolder.address?.state) {
      errors.push({
        fieldPath: 'lienHolder.address.state',
        message: 'State is required'
      });
    }
    
    if (!lienHolder.address?.zip) {
      errors.push({
        fieldPath: 'lienHolder.address.zip',
        message: 'ZIP code is required'
      });
    }
    
    // Validate mailing address if different
    if (lienHolder.mailingAddressDifferent) {
      if (!lienHolder.mailingAddress?.street) {
        errors.push({
          fieldPath: 'lienHolder.mailingAddress.street',
          message: 'Mailing street is required'
        });
      }
      
      if (!lienHolder.mailingAddress?.city) {
        errors.push({
          fieldPath: 'lienHolder.mailingAddress.city',
          message: 'Mailing city is required'
        });
      }
      
      if (!lienHolder.mailingAddress?.state) {
        errors.push({
          fieldPath: 'lienHolder.mailingAddress.state',
          message: 'Mailing state is required'
        });
      }
      
      if (!lienHolder.mailingAddress?.zip) {
        errors.push({
          fieldPath: 'lienHolder.mailingAddress.zip',
          message: 'Mailing ZIP code is required'
        });
      }
    }
  }
}
  const itemRequested = formData.itemRequested as any | undefined;
  if (itemRequested) {
    // Check if at least one option is selected for non-duplicate registration mode
    const isDuplicateRegistrationMode = formData.isDuplicateRegistrationMode === true;
    
    if (!isDuplicateRegistrationMode) {
      const hasSelection = 
        itemRequested.lost || 
        itemRequested.stolen || 
        itemRequested.destroyedMutilated || 
        itemRequested.notReceivedFromDMV || 
        itemRequested.notReceivedFromPriorOwner || 
        itemRequested.surrendered || 
        itemRequested.specialPlatesRetained || 
        itemRequested.requestingRegistrationCard || 
        itemRequested.perCVC4467 || 
        itemRequested.other;
      
      if (!hasSelection) {
        errors.push({
          fieldPath: 'itemRequested',
          message: 'At least one reason must be selected'
        });
      }
    }
    
    // Validate "Other" explanation
    if (itemRequested.other && !itemRequested.otherExplanation) {
      errors.push({
        fieldPath: 'itemRequested.otherExplanation',
        message: 'Explanation is required when "Other" is selected'
      });
    }
    
    // Validate "Surrendered" plates number
    if (itemRequested.surrendered && !isDuplicateRegistrationMode && !itemRequested.numberOfPlatesSurrendered) {
      errors.push({
        fieldPath: 'itemRequested.numberOfPlatesSurrendered',
        message: 'Number of plates surrendered is required'
      });
    }
  } else if (formData.transactionType === "Duplicate Plates & Stickers" || 
            formData.transactionType === "Duplicate Stickers") {
    // ItemRequested is required for duplicate transactions
    errors.push({
      fieldPath: 'itemRequested',
      message: 'Item requested information is required'
    });
  }
  
  // Validate LicensePlate
  const licensePlate = formData.licensePlate as any | undefined;
  const isLicensePlateRequired = formData.transactionType === "Duplicate Plates & Stickers";
  
  if (isLicensePlateRequired) {
    if (!licensePlate || (!licensePlate.oneMissingPlate && !licensePlate.twoMissingPlates)) {
      errors.push({
        fieldPath: 'licensePlate',
        message: 'Please select at least one license plate option'
      });
    }
  }
  
  const missingTitleInfo = formData.missingTitleInfo as { reason?: string } | undefined;
  if (missingTitleInfo) {
    if (!missingTitleInfo.reason) {
      errors.push({
        fieldPath: 'missingTitleInfo.reason',
        message: 'Missing title reason is required'
      });
    }
  }
  const owners = formData.owners as any[] | undefined;
  if (owners && Array.isArray(owners)) {
    const vehicleTransactionDetails = formData.vehicleTransactionDetails as 
    { isGift?: boolean } | undefined;
    const isGift = vehicleTransactionDetails?.isGift === true;      
    owners.forEach((owner, index) => {
 
      if (!owner.firstName) {
        errors.push({ 
          fieldPath: `owners[${index}].firstName`, 
          message: 'First name is required' 
        });
      }
      
      if (!owner.lastName) {
        errors.push({ 
          fieldPath: `owners[${index}].lastName`, 
          message: 'Last name is required' 
        });
      }
      
 
      if (!formData.hideLicenseField && !owner.licenseNumber) {
        errors.push({ 
          fieldPath: `owners[${index}].licenseNumber`, 
          message: 'License number is required' 
        });
      }
      
 
      if (!formData.hideStateField && !owner.state) {
        errors.push({ 
          fieldPath: `owners[${index}].state`, 
          message: 'State is required' 
        });
      }
      
      if (!owner.phoneNumber) {
        errors.push({ 
          fieldPath: `owners[${index}].phoneNumber`, 
          message: 'Phone number is required' 
        });
      }
      
 
      if (!owner.purchaseDate) {
        errors.push({ 
          fieldPath: `owners[${index}].purchaseDate`, 
          message: 'Purchase date is required' 
        });
      }
      
 
      if (!formData.isPNORestoration) {
 
        if (isGift && !owner.marketValue) {
          errors.push({ 
            fieldPath: `owners[${index}].marketValue`, 
            message: 'Market value is required' 
          });
        } else if (!isGift && !owner.purchaseValue) {
          errors.push({ 
            fieldPath: `owners[${index}].purchaseValue`, 
            message: 'Purchase value is required' 
          });
        }
        
 
        if (isGift && index === 0) {
          if (!owner.relationshipWithGifter) {
            errors.push({ 
              fieldPath: `owners[${index}].relationshipWithGifter`, 
              message: 'Relationship with gifter is required' 
            });
          }
          
          if (!owner.giftValue) {
            errors.push({ 
              fieldPath: `owners[${index}].giftValue`, 
              message: 'Gift value is required' 
            });
          }
        }
      }
    });
  }
  
 
  const sellerInfo = formData.sellerInfo as any | undefined;
  if (sellerInfo && sellerInfo.sellers && Array.isArray(sellerInfo.sellers)) {
 
    sellerInfo.sellers.forEach((seller: any, index: number) => {
      if (!seller.firstName) {
        errors.push({
          fieldPath: `sellerInfo.sellers[${index}].firstName`,
          message: 'First name is required'
        });
      }
      
      if (!seller.lastName) {
        errors.push({
          fieldPath: `sellerInfo.sellers[${index}].lastName`,
          message: 'Last name is required'
        });
      }
      
      if (!seller.licenseNumber) {
        errors.push({
          fieldPath: `sellerInfo.sellers[${index}].licenseNumber`,
          message: 'License number is required'
        });
      }
      
      if (!seller.state) {
        errors.push({
          fieldPath: `sellerInfo.sellers[${index}].state`,
          message: 'State is required'
        });
      }
      
      if (!seller.phone) {
        errors.push({
          fieldPath: `sellerInfo.sellers[${index}].phone`,
          message: 'Phone number is required'
        });
      }
      
 
      if (!formData.hideDateOfSale && index === 0 && !seller.saleDate) {
        errors.push({
          fieldPath: `sellerInfo.sellers[${index}].saleDate`,
          message: 'Date of sale is required'
        });
      }
      
 
      if (!formData.hideDateOfBirth && index === 0 && !seller.dob) {
        errors.push({
          fieldPath: `sellerInfo.sellers[${index}].dob`,
          message: 'Date of birth is required'
        });
      }
    });
  }
  
 
  const vehicleInformation = formData.vehicleInformation as any | undefined;
  if (vehicleInformation) {
 
    if (!vehicleInformation.licensePlate) {
      errors.push({
        fieldPath: 'vehicleInformation.licensePlate',
        message: 'License plate or CF number is required'
      });
    }
    
    if (!vehicleInformation.hullId) {
      errors.push({
        fieldPath: 'vehicleInformation.hullId',
        message: 'VIN/Hull ID is required'
      });
    }

    const vehicleType = formData.vehicleType as { isMotorcycle?: boolean; isTrailerCoach?: boolean } | undefined;
    const vehicleTransactionDetails = formData.vehicleTransactionDetails as { isMotorcycle?: boolean } | undefined;
    
    
    const isMotorcycle = 
    (vehicleType && vehicleType.isMotorcycle === true) || 
    (vehicleTransactionDetails && vehicleTransactionDetails.isMotorcycle === true);
  
  if (isMotorcycle && !vehicleInformation.engineNumber) {
    errors.push({
      fieldPath: 'vehicleInformation.engineNumber',
      message: 'Engine number is required for motorcycles'
    });
  }
    
    if (!vehicleInformation.year) {
      errors.push({
        fieldPath: 'vehicleInformation.year',
        message: 'Year is required'
      });
    } else if (vehicleInformation.year.length < 4) {
      errors.push({
        fieldPath: 'vehicleInformation.year',
        message: 'Please enter a 4-digit year'
      });
    }
    
    if (!vehicleInformation.make) {
      errors.push({
        fieldPath: 'vehicleInformation.make',
        message: 'Make is required'
      });
    }
    
    const isTrailerCoach = vehicleType && vehicleType.isTrailerCoach === true;
    
    if (isTrailerCoach) {
      if (!vehicleInformation.length) {
        errors.push({
          fieldPath: 'vehicleInformation.length',
          message: 'Length is required for trailer coaches'
        });
      }
      
      if (!vehicleInformation.width) {
        errors.push({
          fieldPath: 'vehicleInformation.width',
          message: 'Width is required for trailer coaches'
        });
      }
    }
    
 
    const hideMileageFields = formData.hideMileageFields === true || 
      formData.isDuplicateRegistrationMode === true;
    
    if (!hideMileageFields && !vehicleInformation.mileage) {
      errors.push({
        fieldPath: 'vehicleInformation.mileage',
        message: 'Mileage is required'
      });
    }
  }
  
 
  const address = formData.address as any | undefined;
  if (address) {
 
    if (!address.street) {
      errors.push({
        fieldPath: 'address.street',
        message: 'Street is required'
      });
    }
    
    if (!address.city) {
      errors.push({
        fieldPath: 'address.city',
        message: 'City is required'
      });
    }
    
    if (!address.state) {
      errors.push({
        fieldPath: 'address.state',
        message: 'State is required'
      });
    }
    
    if (!address.zip) {
      errors.push({
        fieldPath: 'address.zip',
        message: 'ZIP code is required'
      });
    }
    
    if (!address.county) {
      errors.push({
        fieldPath: 'address.county',
        message: 'County is required'
      });
    }
  }
  
 
  if (formData.mailingAddressDifferent) {
    const mailingAddress = formData.mailingAddress as any | undefined;
    if (mailingAddress) {
      if (!mailingAddress.street) {
        errors.push({
          fieldPath: 'mailingAddress.street',
          message: 'Street is required'
        });
      }
      
      if (!mailingAddress.city) {
        errors.push({
          fieldPath: 'mailingAddress.city',
          message: 'City is required'
        });
      }
      
      if (!mailingAddress.state) {
        errors.push({
          fieldPath: 'mailingAddress.state',
          message: 'State is required'
        });
      }
      
      if (!mailingAddress.zip) {
        errors.push({
          fieldPath: 'mailingAddress.zip',
          message: 'ZIP code is required'
        });
      }
    }
  }
  
 
  if (formData.lesseeAddressDifferent) {
    const lesseeAddress = formData.lesseeAddress as any | undefined;
    if (lesseeAddress) {
      if (!lesseeAddress.street) {
        errors.push({
          fieldPath: 'lesseeAddress.street',
          message: 'Street is required'
        });
      }
      
      if (!lesseeAddress.city) {
        errors.push({
          fieldPath: 'lesseeAddress.city',
          message: 'City is required'
        });
      }
      
      if (!lesseeAddress.state) {
        errors.push({
          fieldPath: 'lesseeAddress.state',
          message: 'State is required'
        });
      }
      
      if (!lesseeAddress.zip) {
        errors.push({
          fieldPath: 'lesseeAddress.zip',
          message: 'ZIP code is required'
        });
      }
    }
  }
  
 
  if (formData.trailerLocationDifferent) {
    const trailerLocation = formData.trailerLocation as any | undefined;
    if (trailerLocation) {
      if (!trailerLocation.street) {
        errors.push({
          fieldPath: 'trailerLocation.street',
          message: 'Street is required'
        });
      }
      
      if (!trailerLocation.city) {
        errors.push({
          fieldPath: 'trailerLocation.city',
          message: 'City is required'
        });
      }
      
      if (!trailerLocation.state) {
        errors.push({
          fieldPath: 'trailerLocation.state',
          message: 'State is required'
        });
      }
      
      if (!trailerLocation.zip) {
        errors.push({
          fieldPath: 'trailerLocation.zip',
          message: 'ZIP code is required'
        });
      }
      
      if (!trailerLocation.county) {
        errors.push({
          fieldPath: 'trailerLocation.county',
          message: 'County is required'
        });
      }
    }
  }
  
 
  const sellerAddress = formData.sellerAddress as any | undefined;
  if (sellerAddress) {
    if (!sellerAddress.street) {
      errors.push({
        fieldPath: 'sellerAddress.street',
        message: 'Street is required'
      });
    }
    
    if (!sellerAddress.city) {
      errors.push({
        fieldPath: 'sellerAddress.city',
        message: 'City is required'
      });
    }
    
    if (!sellerAddress.state) {
      errors.push({
        fieldPath: 'sellerAddress.state',
        message: 'State is required'
      });
    }
    
    if (!sellerAddress.zip) {
      errors.push({
        fieldPath: 'sellerAddress.zip',
        message: 'ZIP code is required'
      });
    }
    
    if (!sellerAddress.county) {
      errors.push({
        fieldPath: 'sellerAddress.county',
        message: 'County is required'
      });
    }
  }
  
 
  if (formData.sellerMailingAddressDifferent) {
    const sellerMailingAddress = formData.sellerMailingAddress as any | undefined;
    if (sellerMailingAddress) {
      if (!sellerMailingAddress.street) {
        errors.push({
          fieldPath: 'sellerMailingAddress.street',
          message: 'Street is required'
        });
      }
      
      if (!sellerMailingAddress.city) {
        errors.push({
          fieldPath: 'sellerMailingAddress.city',
          message: 'City is required'
        });
      }
      
      if (!sellerMailingAddress.state) {
        errors.push({
          fieldPath: 'sellerMailingAddress.state',
          message: 'State is required'
        });
      }
      
      if (!sellerMailingAddress.zip) {
        errors.push({
          fieldPath: 'sellerMailingAddress.zip',
          message: 'ZIP code is required'
        });
      }
      
 
      if (formData.showMailingCounty && !sellerMailingAddress.county) {
        errors.push({
          fieldPath: 'sellerMailingAddress.county',
          message: 'County is required'
        });
      }
    }
  }
  
 
  
  setValidationErrors(errors);
  return errors.length === 0;
};
  console.log('FormDataProvider is rendering with state:', { formData, transactionType });

  return (
    <FormContext.Provider
      value={{ 
        formData, 
        updateField, 
        clearField,
        transactionType, 
        setTransactionType,
        clearAllFormData,
        clearFormTriggered,
 
        validateForm,
        validationErrors,
        setValidationErrors,
        showValidationErrors,
        setShowValidationErrors
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormDataProvider');
  }
  return context;
};