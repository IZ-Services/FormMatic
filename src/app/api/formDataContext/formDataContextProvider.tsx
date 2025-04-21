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

    setValidationErrors([]);
    setShowValidationErrors(false);
    
    if (typeof window !== 'undefined') {
      if (transactionType) {
        localStorage.removeItem(`formmatic_form_data_${transactionType}`);
      }
      

      localStorage.removeItem('multipleTransferState');
      
      clearSellerAddressStorage();

      clearmultipleStorage();
    }
    
    setFormData({});
    setClearFormTriggered(Date.now());
    
    console.log('All form data cleared successfully');
  };

  interface CommercialVehicleData {
    numberOfAxles: string;
    unladenWeight: string;
    isEstimatedWeight: boolean | null;
    bodyModelType: string; 
  }

  const validateCommercialVehicleInfo = (data: CommercialVehicleData): ValidationError[] => {
    const errors: ValidationError[] = [];
  

    if (!data.numberOfAxles) {
      errors.push({
        fieldPath: 'commercialVehicleInfo.numberOfAxles',
        message: 'Number of axles is required'
      });
    } else {
      const axlesNum = parseInt(data.numberOfAxles, 10);
      if (isNaN(axlesNum) || axlesNum <= 0 || axlesNum > 10) {
        errors.push({
          fieldPath: 'commercialVehicleInfo.numberOfAxles',
          message: 'Number of axles must be between 1 and 10'
        });
      }
    }
  

    if (!data.unladenWeight) {
      errors.push({
        fieldPath: 'commercialVehicleInfo.unladenWeight',
        message: 'Unladen weight is required'
      });
    } else {
      const weightNum = parseInt(data.unladenWeight, 10);
      if (isNaN(weightNum) || weightNum <= 0) {
        errors.push({
          fieldPath: 'commercialVehicleInfo.unladenWeight',
          message: 'Unladen weight must be a positive number'
        });
      }
    }
  

    if (data.isEstimatedWeight === null) {
      errors.push({
        fieldPath: 'commercialVehicleInfo.isEstimatedWeight',
        message: 'Please select whether the weight is actual or estimated'
      });
    }
  

    if (data.bodyModelType && data.bodyModelType.length > 50) {
      errors.push({
        fieldPath: 'commercialVehicleInfo.bodyModelType',
        message: 'Body model type cannot exceed 50 characters'
      });
    }
  
    return errors;
  };
 
  const validateForm = () => {
    const errors: ValidationError[] = [];


  if (formData.vehicleDeclaration) {
    const vehicleDeclaration = formData.vehicleDeclaration as any;
    

    if (!vehicleDeclaration.vehicles || !Array.isArray(vehicleDeclaration.vehicles) || vehicleDeclaration.vehicles.length === 0) {
      errors.push({
        fieldPath: 'vehicleDeclaration.vehicles',
        message: 'At least one vehicle entry is required'
      });
    } else {

      vehicleDeclaration.vehicles.forEach((vehicle: any, index: number) => {

        if (!vehicle.licenseNumber || vehicle.licenseNumber.trim() === '') {
          errors.push({
            fieldPath: `vehicleDeclaration.vehicles[${index}].licenseNumber`,
            message: 'License number is required'
          });
        } else if (!/^[A-Z0-9]{1,7}$/.test(vehicle.licenseNumber)) {
          errors.push({
            fieldPath: `vehicleDeclaration.vehicles[${index}].licenseNumber`,
            message: 'Please enter a valid license plate number'
          });
        }
        

        if (!vehicle.vin || vehicle.vin.trim() === '') {
          errors.push({
            fieldPath: `vehicleDeclaration.vehicles[${index}].vin`,
            message: 'VIN is required'
          });
        } else if (!/^[A-Z0-9]{17}$/.test(vehicle.vin)) {
          errors.push({
            fieldPath: `vehicleDeclaration.vehicles[${index}].vin`,
            message: 'Please enter a valid 17-character VIN'
          });
        }
        

        if (!vehicle.make || vehicle.make.trim() === '') {
          errors.push({
            fieldPath: `vehicleDeclaration.vehicles[${index}].make`,
            message: 'Vehicle make is required'
          });
        } else if (vehicle.make.length > 50) {
          errors.push({
            fieldPath: `vehicleDeclaration.vehicles[${index}].make`,
            message: 'Vehicle make cannot exceed 50 characters'
          });
        }
        

        if (!vehicle.gvwWeight || vehicle.gvwWeight.trim() === '') {
          errors.push({
            fieldPath: `vehicleDeclaration.vehicles[${index}].gvwWeight`,
            message: 'GVW weight is required'
          });
        }
        

        if (!vehicle.cgwWeight || vehicle.cgwWeight.trim() === '') {
          errors.push({
            fieldPath: `vehicleDeclaration.vehicles[${index}].cgwWeight`,
            message: 'CGW weight is required'
          });
        }
        

        if (!vehicle.dateOperated || vehicle.dateOperated.trim() === '') {
          errors.push({
            fieldPath: `vehicleDeclaration.vehicles[${index}].dateOperated`,
            message: 'Date operated is required'
          });
        } else {

          const date = new Date(vehicle.dateOperated);
          const today = new Date();
          if (isNaN(date.getTime())) {
            errors.push({
              fieldPath: `vehicleDeclaration.vehicles[${index}].dateOperated`,
              message: 'Please enter a valid date'
            });
          } else if (date > today) {
            errors.push({
              fieldPath: `vehicleDeclaration.vehicles[${index}].dateOperated`,
              message: 'Date cannot be in the future'
            });
          }
        }
      });
    }
    

    if (!vehicleDeclaration.howMany) {
      errors.push({
        fieldPath: 'vehicleDeclaration.howMany',
        message: 'Please select how many vehicles to declare'
      });
    } else {
      const count = parseInt(vehicleDeclaration.howMany, 10);
      if (count > 0 && (!vehicleDeclaration.vehicles || vehicleDeclaration.vehicles.length !== count)) {
        errors.push({
          fieldPath: 'vehicleDeclaration.vehicles',
          message: `You selected ${count} vehicles but provided ${vehicleDeclaration.vehicles?.length || 0}`
        });
      }
    }
  }

    const validateCommercialVehicleInfo = (data: CommercialVehicleData): ValidationError[] => {
      const errors: ValidationError[] = [];
    

      if (!data.numberOfAxles) {
        errors.push({
          fieldPath: 'commercialVehicleInfo.numberOfAxles',
          message: 'Number of axles is required'
        });
      } else {
        const axlesNum = parseInt(data.numberOfAxles, 10);
        if (isNaN(axlesNum) || axlesNum <= 0 || axlesNum > 10) {
          errors.push({
            fieldPath: 'commercialVehicleInfo.numberOfAxles',
            message: 'Number of axles must be between 1 and 10'
          });
        }
      }
    

      if (!data.unladenWeight) {
        errors.push({
          fieldPath: 'commercialVehicleInfo.unladenWeight',
          message: 'Unladen weight is required'
        });
      } else {
        const weightNum = parseInt(data.unladenWeight, 10);
        if (isNaN(weightNum) || weightNum <= 0) {
          errors.push({
            fieldPath: 'commercialVehicleInfo.unladenWeight',
            message: 'Unladen weight must be a positive number'
          });
        }
      }
    

      if (data.isEstimatedWeight === null) {
        errors.push({
          fieldPath: 'commercialVehicleInfo.isEstimatedWeight',
          message: 'Please select whether the weight is actual or estimated'
        });
      }
    

      if (data.bodyModelType && data.bodyModelType.length > 50) {
        errors.push({
          fieldPath: 'commercialVehicleInfo.bodyModelType',
          message: 'Body model type cannot exceed 50 characters'
        });
      }
    
      return errors;
    };

if (formData.reassignmentSection) {
  const reassignmentSection = formData.reassignmentSection as any;
  

  if (!reassignmentSection.specialInterestLicensePlate) {
    errors.push({
      fieldPath: 'reassignmentSection.specialInterestLicensePlate',
      message: 'Special interest license plate number is required'
    });
  } else if (!/^[A-Z0-9]{1,7}$/.test(reassignmentSection.specialInterestLicensePlate)) {
    errors.push({
      fieldPath: 'reassignmentSection.specialInterestLicensePlate',
      message: 'Please enter a valid license plate number'
    });
  }
  

  if (!reassignmentSection.removedFrom) {
    errors.push({
      fieldPath: 'reassignmentSection.removedFrom',
      message: 'VIN number is required'
    });
  } else if (!/^[A-Z0-9]{17}$/.test(reassignmentSection.removedFrom)) {
    errors.push({
      fieldPath: 'reassignmentSection.removedFrom',
      message: 'Please enter a valid 17-character VIN'
    });
  }
  

  if (reassignmentSection.placedOnLicensePlate && !/^[A-Z0-9]{1,7}$/.test(reassignmentSection.placedOnLicensePlate)) {
    errors.push({
      fieldPath: 'reassignmentSection.placedOnLicensePlate',
      message: 'Please enter a valid license plate number'
    });
  }
  

  if (reassignmentSection.placedOnVehicle && !/^[A-Z0-9]{17}$/.test(reassignmentSection.placedOnVehicle)) {
    errors.push({
      fieldPath: 'reassignmentSection.placedOnVehicle',
      message: 'Please enter a valid 17-character VIN'
    });
  }
  

  if (!reassignmentSection.retainInterest && !reassignmentSection.releaseInterestDMV && !reassignmentSection.releaseInterestNewOwner) {
    errors.push({
      fieldPath: 'reassignmentSection.interestOptions',
      message: 'Please select one of the options (retain or release interest)'
    });
  }
  

  if (reassignmentSection.retainInterest) {

    if (!reassignmentSection.feeEnclosed) {
      errors.push({
        fieldPath: 'reassignmentSection.feeEnclosed',
        message: 'Fee is required when retaining interest'
      });
    }
    
    if (!reassignmentSection.placedOnLicensePlate && !reassignmentSection.placedOnVehicle) {
      errors.push({
        fieldPath: 'reassignmentSection.placedOn',
        message: 'Please provide either a license plate or vehicle identification number'
      });
    }
  }
  

  if (reassignmentSection.releaseInterestNewOwner) {
    if (!reassignmentSection.placedOnLicensePlate && !reassignmentSection.placedOnVehicle) {
      errors.push({
        fieldPath: 'reassignmentSection.placedOn',
        message: 'Please provide either a license plate or vehicle identification number'
      });
    }
  }
}

    if (formData.selectConfiguration) {
      const config = formData.selectConfiguration as any;
      

      if (!config.vehicleType) {
        errors.push({
          fieldPath: 'selectConfiguration.vehicleType',
          message: 'Vehicle type is required'
        });
      }
      

      if (!config.plateType) {
        errors.push({
          fieldPath: 'selectConfiguration.plateType',
          message: 'Plate type is required'
        });
      }
      

      if (config.plateType === 'Sequential') {
        if (!config.currentLicensePlate) {
          errors.push({
            fieldPath: 'selectConfiguration.currentLicensePlate',
            message: 'Current license plate number is required'
          });
        } else if (config.currentLicensePlate.length < 5) {
          errors.push({
            fieldPath: 'selectConfiguration.currentLicensePlate',
            message: 'License plate must be at least 5 characters'
          });
        }
        
        if (!config.fullVehicleId) {
          errors.push({
            fieldPath: 'selectConfiguration.fullVehicleId',
            message: 'Vehicle ID number is required'
          });
        } else if (config.fullVehicleId.length < 17) {
          errors.push({
            fieldPath: 'selectConfiguration.fullVehicleId',
            message: 'VIN must be 17 characters'
          });
        }
      }
      

      if (config.plateType === 'Personalized') {

        if (!config.personalized?.firstChoice) {
          errors.push({
            fieldPath: 'selectConfiguration.personalized.firstChoice',
            message: 'First choice is required'
          });
        }
        
        if (!config.personalized?.firstChoiceMeaning) {
          errors.push({
            fieldPath: 'selectConfiguration.personalized.firstChoiceMeaning',
            message: 'Meaning for first choice is required'
          });
        }
        

        if (config.personalized?.secondChoice && !config.personalized?.secondChoiceMeaning) {
          errors.push({
            fieldPath: 'selectConfiguration.personalized.secondChoiceMeaning',
            message: 'Meaning is required when second choice is provided'
          });
        }
        

        if (config.personalized?.thirdChoice && !config.personalized?.thirdChoiceMeaning) {
          errors.push({
            fieldPath: 'selectConfiguration.personalized.thirdChoiceMeaning',
            message: 'Meaning is required when third choice is provided'
          });
        }
      }
      

      if (config.plateType && !config.pickupLocation) {
        errors.push({
          fieldPath: 'selectConfiguration.pickupLocation',
          message: 'Pickup location is required'
        });
      }
      

      if (config.pickupLocation && !config.locationCity) {
        errors.push({
          fieldPath: 'selectConfiguration.locationCity',
          message: 'Location city is required'
        });
      }
    }

    
    

    if (formData.plannedNonOperation) {
      const pno = formData.plannedNonOperation as any;
      
      if (pno.entries && Array.isArray(pno.entries)) {
        pno.entries.forEach((entry: any, index: number) => {

          if (!entry.vehicleLicensePlate) {
            errors.push({
              fieldPath: `plannedNonOperation.entries[${index}].vehicleLicensePlate`,
              message: 'License plate number is required'
            });
          }
  

          if (!entry.vehicleIdNumber) {
            errors.push({
              fieldPath: `plannedNonOperation.entries[${index}].vehicleIdNumber`,
              message: 'Vehicle ID number is required'
            });
          } else if (entry.vehicleIdNumber.length < 17) {
            errors.push({
              fieldPath: `plannedNonOperation.entries[${index}].vehicleIdNumber`,
              message: 'VIN must be 17 characters'
            });
          }
  

          if (!entry.vehicleMake) {
            errors.push({
              fieldPath: `plannedNonOperation.entries[${index}].vehicleMake`,
              message: 'Vehicle make is required'
            });
          }
        });
      }
    }
    

    if (formData.storageLocation) {
      const storage = formData.storageLocation as any;
      

      if (!storage.fromDate) {
        errors.push({
          fieldPath: 'storageLocation.fromDate',
          message: 'From date is required'
        });
      } else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(storage.fromDate)) {
        errors.push({
          fieldPath: 'storageLocation.fromDate',
          message: 'Date must be in MM/DD/YYYY format'
        });
      }
      

      if (!storage.toDate) {
        errors.push({
          fieldPath: 'storageLocation.toDate',
          message: 'To date is required'
        });
      } else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(storage.toDate)) {
        errors.push({
          fieldPath: 'storageLocation.toDate',
          message: 'Date must be in MM/DD/YYYY format'
        });
      }
      

      if (!storage.address) {
        errors.push({
          fieldPath: 'storageLocation.address',
          message: 'Address is required'
        });
      }
      

      if (!storage.city) {
        errors.push({
          fieldPath: 'storageLocation.city',
          message: 'City is required'
        });
      }
      

      if (!storage.state) {
        errors.push({
          fieldPath: 'storageLocation.state',
          message: 'State is required'
        });
      }
      

      if (!storage.zipCode) {
        errors.push({
          fieldPath: 'storageLocation.zipCode',
          message: 'ZIP code is required'
        });
      } else if (!/^\d{5}(-\d{4})?$/.test(storage.zipCode)) {
        errors.push({
          fieldPath: 'storageLocation.zipCode',
          message: 'Please enter a valid ZIP code'
        });
      }
    }
    

if (transactionType?.startsWith("Personalized Plates")) {
  const platePurchaserOwner = formData.platePurchaserOwner as any | undefined;
  
  if (!platePurchaserOwner) {
    errors.push({
      fieldPath: 'platePurchaserOwner',
      message: 'Plate purchaser information is required'
    });
  } else {

    if (!platePurchaserOwner.purchaser?.fullName) {
      errors.push({
        fieldPath: 'platePurchaserOwner.purchaser.fullName',
        message: 'Purchaser name is required'
      });
    }
    
    if (!platePurchaserOwner.purchaser?.streetAddress) {
      errors.push({
        fieldPath: 'platePurchaserOwner.purchaser.streetAddress',
        message: 'Street address is required'
      });
    }
    
    if (!platePurchaserOwner.purchaser?.city) {
      errors.push({
        fieldPath: 'platePurchaserOwner.purchaser.city',
        message: 'City is required'
      });
    }
    
    if (!platePurchaserOwner.purchaser?.state) {
      errors.push({
        fieldPath: 'platePurchaserOwner.purchaser.state',
        message: 'State is required'
      });
    }
    
    if (!platePurchaserOwner.purchaser?.zipCode) {
      errors.push({
        fieldPath: 'platePurchaserOwner.purchaser.zipCode',
        message: 'ZIP code is required'
      });
    } else if (!/^\d{5}(-\d{4})?$/.test(platePurchaserOwner.purchaser.zipCode)) {
      errors.push({
        fieldPath: 'platePurchaserOwner.purchaser.zipCode',
        message: 'Please enter a valid ZIP code'
      });
    }
    
    if (!platePurchaserOwner.purchaser?.phoneNumber) {
      errors.push({
        fieldPath: 'platePurchaserOwner.purchaser.phoneNumber',
        message: 'Phone number is required'
      });
    } else if (platePurchaserOwner.purchaser.phoneNumber.length < 14) {
      errors.push({
        fieldPath: 'platePurchaserOwner.purchaser.phoneNumber',
        message: 'Please enter a complete phone number'
      });
    }
    

    if (!platePurchaserOwner.sameAsOwner) {
      if (!platePurchaserOwner.owner?.fullName) {
        errors.push({
          fieldPath: 'platePurchaserOwner.owner.fullName',
          message: 'Owner name is required'
        });
      }
      
      if (!platePurchaserOwner.owner?.streetAddress) {
        errors.push({
          fieldPath: 'platePurchaserOwner.owner.streetAddress',
          message: 'Street address is required'
        });
      }
      
      if (!platePurchaserOwner.owner?.city) {
        errors.push({
          fieldPath: 'platePurchaserOwner.owner.city',
          message: 'City is required'
        });
      }
      
      if (!platePurchaserOwner.owner?.state) {
        errors.push({
          fieldPath: 'platePurchaserOwner.owner.state',
          message: 'State is required'
        });
      }
      
      if (!platePurchaserOwner.owner?.zipCode) {
        errors.push({
          fieldPath: 'platePurchaserOwner.owner.zipCode',
          message: 'ZIP code is required'
        });
      } else if (!/^\d{5}(-\d{4})?$/.test(platePurchaserOwner.owner.zipCode)) {
        errors.push({
          fieldPath: 'platePurchaserOwner.owner.zipCode',
          message: 'Please enter a valid ZIP code'
        });
      }
      
      if (!platePurchaserOwner.owner?.phoneNumber) {
        errors.push({
          fieldPath: 'platePurchaserOwner.owner.phoneNumber',
          message: 'Phone number is required'
        });
      } else if (platePurchaserOwner.owner.phoneNumber.length < 14) {
        errors.push({
          fieldPath: 'platePurchaserOwner.owner.phoneNumber',
          message: 'Please enter a complete phone number'
        });
      }
    }
  }
}
    if (transactionType?.startsWith("Personalized Plates (Replacement)") || 
    (formData.replacementSection && Object.keys(formData.replacementSection).length > 0)) {
  const replacementSection = formData.replacementSection as any | undefined;
  
  if (!replacementSection) {
    errors.push({
      fieldPath: 'replacementSection',
      message: 'Replacement information is required'
    });
  } else {

    if (!replacementSection.specialInterestLicensePlate) {
      errors.push({
        fieldPath: 'replacementSection.specialInterestLicensePlate',
        message: 'License plate number is required'
      });
    } else if (replacementSection.specialInterestLicensePlate.length < 2) {
      errors.push({
        fieldPath: 'replacementSection.specialInterestLicensePlate',
        message: 'Please enter a valid license plate number'
      });
    }
    

    if (!replacementSection.ineed) {
      errors.push({
        fieldPath: 'replacementSection.ineed',
        message: 'Please select how many plates you need'
      });
    }
    

    if (!replacementSection.plateStatus) {
      errors.push({
        fieldPath: 'replacementSection.plateStatus',
        message: 'Please select the status of your plates'
      });
    }
  }
}
    if (transactionType === "Lien Holder Removal") {
      const releaseInformation = formData.releaseInformation as any | undefined;
      
      if (!releaseInformation) {
        errors.push({
          fieldPath: 'releaseInformation',
          message: 'Release of ownership information is required'
        });
      } else {

        if (!releaseInformation.name) {
          errors.push({
            fieldPath: 'releaseInformation.name',
            message: 'Name is required'
          });
        }
        

        if (!releaseInformation.address?.street) {
          errors.push({
            fieldPath: 'releaseInformation.address.street',
            message: 'Street is required'
          });
        }
        
        if (!releaseInformation.address?.city) {
          errors.push({
            fieldPath: 'releaseInformation.address.city',
            message: 'City is required'
          });
        }
        
        if (!releaseInformation.address?.state) {
          errors.push({
            fieldPath: 'releaseInformation.address.state',
            message: 'State is required'
          });
        }
        
        if (!releaseInformation.address?.zip) {
          errors.push({
            fieldPath: 'releaseInformation.address.zip',
            message: 'ZIP code is required'
          });
        }
        

        if (!releaseInformation.authorizedAgentName) {
          errors.push({
            fieldPath: 'releaseInformation.authorizedAgentName',
            message: 'Authorized agent name is required'
          });
        }
        
        if (!releaseInformation.authorizedAgentTitle) {
          errors.push({
            fieldPath: 'releaseInformation.authorizedAgentTitle',
            message: 'Authorized agent title is required'
          });
        }
        

        if (!releaseInformation.date) {
          errors.push({
            fieldPath: 'releaseInformation.date',
            message: 'Date is required'
          });
        } else if (releaseInformation.date.length < 10) {
          errors.push({
            fieldPath: 'releaseInformation.date',
            message: 'Date must be in MM/DD/YYYY format'
          });
        }
        
        if (!releaseInformation.phoneNumber) {
          errors.push({
            fieldPath: 'releaseInformation.phoneNumber',
            message: 'Phone number is required'
          });
        }
        

        if (releaseInformation.mailingAddressDifferent) {
          if (!releaseInformation.mailingAddress?.street) {
            errors.push({
              fieldPath: 'releaseInformation.mailingAddress.street',
              message: 'Mailing street is required'
            });
          }
          
          if (!releaseInformation.mailingAddress?.city) {
            errors.push({
              fieldPath: 'releaseInformation.mailingAddress.city',
              message: 'Mailing city is required'
            });
          }
          
          if (!releaseInformation.mailingAddress?.state) {
            errors.push({
              fieldPath: 'releaseInformation.mailingAddress.state',
              message: 'Mailing state is required'
            });
          }
          
          if (!releaseInformation.mailingAddress?.zip) {
            errors.push({
              fieldPath: 'releaseInformation.mailingAddress.zip',
              message: 'Mailing ZIP code is required'
            });
          }
        }
      }
    }
    
    if (transactionType === "Lien Holder Addition") {
      const lienHolder = formData.lienHolder as any | undefined;
      
      if (!lienHolder) {
        errors.push({
          fieldPath: 'lienHolder',
          message: 'Lien holder information is required'
        });
      } else {

        if (!lienHolder.name) {
          errors.push({
            fieldPath: 'lienHolder.name',
            message: 'Lien holder name is required'
          });
        }
        

        if (lienHolder.eltNumber && lienHolder.eltNumber.length !== 3) {
          errors.push({
            fieldPath: 'lienHolder.eltNumber',
            message: 'ELT Number must be exactly 3 digits'
          });
        }
        

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
    

    if (transactionType?.startsWith("Personalized Plates")) {
      const platePurchaser = formData.platePurchaserOwner as any | undefined;
      
      if (!platePurchaser) {
        errors.push({
          fieldPath: 'platePurchaserOwner',
          message: 'Plate purchaser information is required'
        });
      } else {

        if (!platePurchaser.firstName) {
          errors.push({
            fieldPath: 'platePurchaserOwner.firstName',
            message: 'First name is required'
          });
        }
        
        if (!platePurchaser.lastName) {
          errors.push({
            fieldPath: 'platePurchaserOwner.lastName',
            message: 'Last name is required'
          });
        }
        

        if (!platePurchaser.address?.street) {
          errors.push({
            fieldPath: 'platePurchaserOwner.address.street',
            message: 'Street is required'
          });
        }
        
        if (!platePurchaser.address?.city) {
          errors.push({
            fieldPath: 'platePurchaserOwner.address.city',
            message: 'City is required'
          });
        }
        
        if (!platePurchaser.address?.state) {
          errors.push({
            fieldPath: 'platePurchaserOwner.address.state',
            message: 'State is required'
          });
        }
        
        if (!platePurchaser.address?.zip) {
          errors.push({
            fieldPath: 'platePurchaserOwner.address.zip',
            message: 'ZIP code is required'
          });
        }
        

        if (!platePurchaser.driverLicense) {
          errors.push({
            fieldPath: 'platePurchaserOwner.driverLicense',
            message: 'Driver license number is required'
          });
        }
        
        if (!platePurchaser.licenseState) {
          errors.push({
            fieldPath: 'platePurchaserOwner.licenseState',
            message: 'License state is required'
          });
        }
        
        if (!platePurchaser.dayPhone) {
          errors.push({
            fieldPath: 'platePurchaserOwner.dayPhone',
            message: 'Day phone number is required'
          });
        }
        

        if (platePurchaser.mailingAddressDifferent) {
          if (!platePurchaser.mailingAddress?.street) {
            errors.push({
              fieldPath: 'platePurchaserOwner.mailingAddress.street',
              message: 'Mailing street is required'
            });
          }
          
          if (!platePurchaser.mailingAddress?.city) {
            errors.push({
              fieldPath: 'platePurchaserOwner.mailingAddress.city',
              message: 'Mailing city is required'
            });
          }
          
          if (!platePurchaser.mailingAddress?.state) {
            errors.push({
              fieldPath: 'platePurchaserOwner.mailingAddress.state',
              message: 'Mailing state is required'
            });
          }
          
          if (!platePurchaser.mailingAddress?.zip) {
            errors.push({
              fieldPath: 'platePurchaserOwner.mailingAddress.zip',
              message: 'Mailing ZIP code is required'
            });
          }
        }
      }
    }
    

    if (transactionType?.startsWith("Personalized Plates")) {
      const plateSelection = formData.plateSelection as any | undefined;
      
      if (!plateSelection?.plateType) {
        errors.push({
          fieldPath: 'plateSelection.plateType',
          message: 'Plate type is required'
        });
      }
    }
if (transactionType === "Lien Holder Removal") {
  const releaseInformation = formData.releaseInformation as any | undefined;
  
  if (!releaseInformation) {
    errors.push({
      fieldPath: 'releaseInformation',
      message: 'Release of ownership information is required'
    });
  } else {

    if (!releaseInformation.name) {
      errors.push({
        fieldPath: 'releaseInformation.name',
        message: 'Name is required'
      });
    }
    

    if (!releaseInformation.address?.street) {
      errors.push({
        fieldPath: 'releaseInformation.address.street',
        message: 'Street is required'
      });
    }
    
    if (!releaseInformation.address?.city) {
      errors.push({
        fieldPath: 'releaseInformation.address.city',
        message: 'City is required'
      });
    }
    
    if (!releaseInformation.address?.state) {
      errors.push({
        fieldPath: 'releaseInformation.address.state',
        message: 'State is required'
      });
    }
    
    if (!releaseInformation.address?.zip) {
      errors.push({
        fieldPath: 'releaseInformation.address.zip',
        message: 'ZIP code is required'
      });
    }
    

    if (!releaseInformation.date) {
      errors.push({
        fieldPath: 'releaseInformation.date',
        message: 'Date is required'
      });
    } else if (releaseInformation.date.length < 10) {
      errors.push({
        fieldPath: 'releaseInformation.date',
        message: 'Date must be in MM/DD/YYYY format'
      });
    }
    
    if (!releaseInformation.phoneNumber) {
      errors.push({
        fieldPath: 'releaseInformation.phoneNumber',
        message: 'Phone number is required'
      });
    }
    

    if (releaseInformation.mailingAddressDifferent) {
      if (!releaseInformation.mailingAddress?.street) {
        errors.push({
          fieldPath: 'releaseInformation.mailingAddress.street',
          message: 'Mailing street is required'
        });
      }
      
      if (!releaseInformation.mailingAddress?.city) {
        errors.push({
          fieldPath: 'releaseInformation.mailingAddress.city',
          message: 'Mailing city is required'
        });
      }
      
      if (!releaseInformation.mailingAddress?.state) {
        errors.push({
          fieldPath: 'releaseInformation.mailingAddress.state',
          message: 'Mailing state is required'
        });
      }
      
      if (!releaseInformation.mailingAddress?.zip) {
        errors.push({
          fieldPath: 'releaseInformation.mailingAddress.zip',
          message: 'Mailing ZIP code is required'
        });
      }
    }
  }
}if (transactionType === "Lien Holder Addition") {
  const lienHolder = formData.lienHolder as any | undefined;
  
  if (!lienHolder) {
    errors.push({
      fieldPath: 'lienHolder',
      message: 'Lien holder information is required'
    });
  } else {

    if (!lienHolder.name) {
      errors.push({
        fieldPath: 'lienHolder.name',
        message: 'Lien holder name is required'
      });
    }
    

    if (lienHolder.eltNumber && lienHolder.eltNumber.length !== 3) {
      errors.push({
        fieldPath: 'lienHolder.eltNumber',
        message: 'ELT Number must be exactly 3 digits'
      });
    }
    

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
    

    if (itemRequested.other && !itemRequested.otherExplanation) {
      errors.push({
        fieldPath: 'itemRequested.otherExplanation',
        message: 'Explanation is required when "Other" is selected'
      });
    }
    

    if (itemRequested.surrendered && !isDuplicateRegistrationMode && !itemRequested.numberOfPlatesSurrendered) {
      errors.push({
        fieldPath: 'itemRequested.numberOfPlatesSurrendered',
        message: 'Number of plates surrendered is required'
      });
    }
  } else if (formData.transactionType === "Duplicate Plates & Stickers" || 
            formData.transactionType === "Duplicate Stickers") {

    errors.push({
      fieldPath: 'itemRequested',
      message: 'Item requested information is required'
    });
  }
  

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