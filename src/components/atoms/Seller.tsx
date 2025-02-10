'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import './Seller.css';

interface Seller {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  licenseNumber?: string;
  state?: string;
  phone?: string;
  saleDate?: string;
}

interface SellerInfo {
  sellerCount?: string;
  sellers?: Seller[];
}

interface FormData {
  sellerInfo?: SellerInfo;
  [key: string]: any;
}

interface FormContext {
  formData: FormData;
  updateField: (field: string, value: any) => void;
}

const SellerSection = () => {
  const { formData, updateField } = useFormContext() as FormContext;
  const [openDropdown, setOpenDropdown] = useState<{ 
    type: 'count' | 'state', 
    index?: number 
  } | null>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);

  const states = [
    { name: 'Alabama', abbreviation: 'AL' },
    { name: 'Alaska', abbreviation: 'AK' },
    { name: 'Arizona', abbreviation: 'AZ' },
    { name: 'Arkansas', abbreviation: 'AR' },
    { name: 'California', abbreviation: 'CA' },
    { name: 'Colorado', abbreviation: 'CO' },
    { name: 'Connecticut', abbreviation: 'CT' },
    { name: 'Delaware', abbreviation: 'DE' },
    { name: 'Florida', abbreviation: 'FL' },
    { name: 'Georgia', abbreviation: 'GA' },
    { name: 'Hawaii', abbreviation: 'HI' },
    { name: 'Idaho', abbreviation: 'ID' },
    { name: 'Illinois', abbreviation: 'IL' },
    { name: 'Indiana', abbreviation: 'IN' },
    { name: 'Iowa', abbreviation: 'IA' },
    { name: 'Kansas', abbreviation: 'KS' },
    { name: 'Kentucky', abbreviation: 'KY' },
    { name: 'Louisiana', abbreviation: 'LA' },
    { name: 'Maine', abbreviation: 'ME' },
    { name: 'Maryland', abbreviation: 'MD' },
    { name: 'Massachusetts', abbreviation: 'MA' },
    { name: 'Michigan', abbreviation: 'MI' },
    { name: 'Minnesota', abbreviation: 'MN' },
    { name: 'Mississippi', abbreviation: 'MS' },
    { name: 'Missouri', abbreviation: 'MO' },
    { name: 'Montana', abbreviation: 'MT' },
    { name: 'Nebraska', abbreviation: 'NE' },
    { name: 'Nevada', abbreviation: 'NV' },
    { name: 'New Hampshire', abbreviation: 'NH' },
    { name: 'New Jersey', abbreviation: 'NJ' },
    { name: 'New Mexico', abbreviation: 'NM' },
    { name: 'New York', abbreviation: 'NY' },
    { name: 'North Carolina', abbreviation: 'NC' },
    { name: 'North Dakota', abbreviation: 'ND' },
    { name: 'Ohio', abbreviation: 'OH' },
    { name: 'Oklahoma', abbreviation: 'OK' },
    { name: 'Oregon', abbreviation: 'OR' },
    { name: 'Pennsylvania', abbreviation: 'PA' },
    { name: 'Rhode Island', abbreviation: 'RI' },
    { name: 'South Carolina', abbreviation: 'SC' },
    { name: 'South Dakota', abbreviation: 'SD' },
    { name: 'Tennessee', abbreviation: 'TN' },
    { name: 'Texas', abbreviation: 'TX' },
    { name: 'Utah', abbreviation: 'UT' },
    { name: 'Vermont', abbreviation: 'VT' },
    { name: 'Virginia', abbreviation: 'VA' },
    { name: 'Washington', abbreviation: 'WA' },
    { name: 'West Virginia', abbreviation: 'WV' },
    { name: 'Wisconsin', abbreviation: 'WI' },
    { name: 'Wyoming', abbreviation: 'WY' },
  ];  

  const handleSellerChange = (index: number, field: keyof Seller, value: string) => {
    const sellers = [...(formData.sellerInfo?.sellers || [])];
    sellers[index] = { ...sellers[index], [field]: value };
    updateField('sellerInfo', { 
      ...(formData.sellerInfo || {}), 
      sellers 
    });
  };

  const handleCountChange = (count: string) => {
    const currentSellers = formData.sellerInfo?.sellers || [{}];
    const newSellers = Array(Number(count))
      .fill({})
      .map((_, i) => currentSellers[i] || {});
    
    updateField('sellerInfo', {
      ...(formData.sellerInfo || {}),
      sellerCount: count,
      sellers: newSellers
    });
    setOpenDropdown(null);
  };

  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as Element;
    if (dropdownRef.current && !dropdownRef.current.contains(target)) {
      setOpenDropdown(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const renderSellerForms = () => {
    const count = Number(formData.sellerInfo?.sellerCount || 1);
    return Array.from({ length: count }).map((_, index) => (
      <div key={index} className="seller-form-section">
        <h4 className="seller-number">Seller {index + 1}</h4>
        
        <div className="sellerFirstGroup">
          <div className="sellerFormItem">
            <label className="sellerLabel">First Name</label>
            <input
              className="sellerInput"
              type="text"
              placeholder="First Name"
              value={formData.sellerInfo?.sellers?.[index]?.firstName || ''}
              onChange={(e) => handleSellerChange(index, 'firstName', e.target.value)}
            />
          </div>
          <div className="sellerFormItem">
            <label className="sellerLabel">Middle Name</label>
            <input
              className="sellerInput"
              type="text"
              placeholder="Middle Name"
              value={formData.sellerInfo?.sellers?.[index]?.middleName || ''}
              onChange={(e) => handleSellerChange(index, 'middleName', e.target.value)}
            />
          </div>
          <div className="sellerFormItem">
            <label className="sellerLabel">Last Name</label>
            <input
              className="sellerInput"
              type="text"
              placeholder="Last Name"
              value={formData.sellerInfo?.sellers?.[index]?.lastName || ''}
              onChange={(e) => handleSellerChange(index, 'lastName', e.target.value)}
            />
          </div>
        </div>

        <div className="driverState">
          <div className="driverLicenseField">
            <label className="formLabel">Driver License Number</label>
            <input
              className="formInput"
              type="text"
              placeholder="Driver License Number"
              value={formData.sellerInfo?.sellers?.[index]?.licenseNumber || ''}
              onChange={(e) => handleSellerChange(index, 'licenseNumber', e.target.value)}
            />
          </div>
          <div className="regStateWrapper">
            <label className="registeredOwnerLabel">State</label>
            <button
              onClick={() => setOpenDropdown({ type: 'state', index })}
              className="regStateDropDown"
            >
              {formData.sellerInfo?.sellers?.[index]?.state || 'State'}
              <ChevronDownIcon
                className={`regIcon ${openDropdown?.type === 'state' && openDropdown?.index === index ? 'rotate' : ''}`}
              />
            </button>
            {openDropdown?.type === 'state' && openDropdown?.index === index && (
              <ul ref={dropdownRef} className="regStateMenu">
                {states.map((state, i) => (
                  <li
                    className="regStateLists"
                    key={i}
                    onClick={() => handleSellerChange(index, 'state', state.abbreviation)}
                  >
                    {state.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="sellerThirdGroup">
          <div className="sellerThirdItem">
            <label className="sellerLabel">Phone Number</label>
            <input
              className="sellerNumberInput"
              type="text"
              placeholder="Phone Number"
              value={formData.sellerInfo?.sellers?.[index]?.phone || ''}
              onChange={(e) => handleSellerChange(index, 'phone', e.target.value)}
            />
          </div>
          <div className="sellerThirdItem">
          <label className="registeredOwnerLabel">Date of Purchase</label>
          <input
              className="registeredDateInput"
              type="text"
              placeholder="MM/DD/YYYY"
              value={formData.sellerInfo?.sellers?.[index]?.saleDate || ''}
              onChange={(e) => handleSellerChange(index, 'saleDate', e.target.value)}
            />
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="seller-section">
      <div className="sellerHeader">
        <h3 className="sellerHeading">Seller(s)</h3>
        <div className="howManyWrapper">
          <button
            onClick={() => setOpenDropdown(openDropdown?.type === 'count' ? null : { type: 'count' })}
            className="howManyDropDown"
          >
            {formData.sellerInfo?.sellerCount || 'How Many'}
            <ChevronDownIcon
              className={`howManyIcon ${openDropdown?.type === 'count' ? 'rotate' : ''}`}
            />
          </button>
          {openDropdown?.type === 'count' && (
            <ul ref={dropdownRef} className="howManyMenu">
              {['1', '2', '3'].map((option, index) => (
                <li
                  className="howManyLists"
                  key={index}
                  onClick={() => handleCountChange(option)}
                >
                  {option}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {renderSellerForms()}
    </div>
  );
};

export default SellerSection;