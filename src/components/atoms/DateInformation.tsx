import React, { useState, useEffect } from 'react';
import { useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import './DateInformation.css';

interface DateInformationData {
  enteredCalifornia?: {
    month: string;
    day: string;
    year: string;
  };
  firstOperated?: {
    month: string;
    day: string;
    year: string;
  };
  becameResident?: {
    month: string;
    day: string;
    year: string;
  };
  purchased?: {
    month: string;
    day: string;
    year: string;
  };
}

interface FormDataType {
  dateInformation?: DateInformationData;
  [key: string]: any;
}

interface DateInformationProps {
  formData?: FormDataType;
  onChange?: (data: DateInformationData) => void;
}

const DateInformation: React.FC<DateInformationProps> = ({
  formData: propFormData,
  onChange
}) => {
  const { formData: contextFormData, updateField } = useFormContext();

  const combinedFormData: FormDataType = {
    ...contextFormData,
    ...propFormData
  };

  const [dateData, setDateData] = useState<DateInformationData>({
    enteredCalifornia: { month: '', day: '', year: '' },
    firstOperated: { month: '', day: '', year: '' },
    becameResident: { month: '', day: '', year: '' },
    purchased: { month: '', day: '', year: '' }
  });

  useEffect(() => {
    const mergedData: DateInformationData = {
      enteredCalifornia: { month: '', day: '', year: '' },
      firstOperated: { month: '', day: '', year: '' },
      becameResident: { month: '', day: '', year: '' },
      purchased: { month: '', day: '', year: '' },
      ...combinedFormData?.dateInformation
    };
    setDateData(mergedData);
  }, [combinedFormData?.dateInformation]);

  const handleDateChange = (
    section: keyof DateInformationData,
    field: 'month' | 'day' | 'year',
    value: string
  ) => {
    const newData = {
      ...dateData,
      [section]: {
        ...dateData[section],
        [field]: value
      }
    };

    setDateData(newData);
    updateField('dateInformation', newData);

    if (onChange) {
      onChange(newData);
    }
  };

  return (
    <div className="dateInformationWrapper">
      <div className="headerRow">
        <h3 className="sectionHeading">DATE INFORMATION</h3>
      </div>

      <div className="dateSection">
        <div className="dateLabel">DATE VEHICLE ENTERED OR WILL ENTER CALIFORNIA (CA):</div>
        <div className="dateInputRow">
          <div className="dateInputGroup">
            <label>Month</label>
            <input
              type="text"
              maxLength={2}
              value={dateData.enteredCalifornia?.month || ''}
              onChange={(e) => handleDateChange('enteredCalifornia', 'month', e.target.value)}
              className="dateInput"
            />
          </div>
          <div className="dateInputGroup">
            <label>Day</label>
            <input
              type="text"
              maxLength={2}
              value={dateData.enteredCalifornia?.day || ''}
              onChange={(e) => handleDateChange('enteredCalifornia', 'day', e.target.value)}
              className="dateInput"
            />
          </div>
          <div className="dateInputGroup">
            <label>Year</label>
            <input
              type="text"
              maxLength={4}
              value={dateData.enteredCalifornia?.year || ''}
              onChange={(e) => handleDateChange('enteredCalifornia', 'year', e.target.value)}
              className="dateInput"
            />
          </div>
        </div>
      </div>

      <div className="dateSection">
        <div className="dateLabel">DATE VEHICLE FIRST OPERATED IN CALIFORNIA:</div>
        <div className="dateInputRow">
          <div className="dateInputGroup">
            <label>Month</label>
            <input
              type="text"
              maxLength={2}
              value={dateData.firstOperated?.month || ''}
              onChange={(e) => handleDateChange('firstOperated', 'month', e.target.value)}
              className="dateInput"
            />
          </div>
          <div className="dateInputGroup">
            <label>Day</label>
            <input
              type="text"
              maxLength={2}
              value={dateData.firstOperated?.day || ''}
              onChange={(e) => handleDateChange('firstOperated', 'day', e.target.value)}
              className="dateInput"
            />
          </div>
          <div className="dateInputGroup">
            <label>Year</label>
            <input
              type="text"
              maxLength={4}
              value={dateData.firstOperated?.year || ''}
              onChange={(e) => handleDateChange('firstOperated', 'year', e.target.value)}
              className="dateInput"
            />
          </div>
        </div>
      </div>

      <div className="dateSection">
        <div className="dateLabel">DATE YOU WENT TO WORK IN CALIFORNIA, OBTAINED A CA DRIVER LICENSE, OR BECAME A RESIDENT:</div>
        <div className="dateInputRow">
          <div className="dateInputGroup">
            <label>Month</label>
            <input
              type="text"
              maxLength={2}
              value={dateData.becameResident?.month || ''}
              onChange={(e) => handleDateChange('becameResident', 'month', e.target.value)}
              className="dateInput"
            />
          </div>
          <div className="dateInputGroup">
            <label>Day</label>
            <input
              type="text"
              maxLength={2}
              value={dateData.becameResident?.day || ''}
              onChange={(e) => handleDateChange('becameResident', 'day', e.target.value)}
              className="dateInput"
            />
          </div>
          <div className="dateInputGroup">
            <label>Year</label>
            <input
              type="text"
              maxLength={4}
              value={dateData.becameResident?.year || ''}
              onChange={(e) => handleDateChange('becameResident', 'year', e.target.value)}
              className="dateInput"
            />
          </div>
        </div>
      </div>

      <div className="dateSection">
        <div className="dateLabel">DATE VEHICLE WAS PURCHASED OR ACQUIRED:</div>
        <div className="dateInputRow">
          <div className="dateInputGroup">
            <label>Month</label>
            <input
              type="text"
              maxLength={2}
              value={dateData.purchased?.month || ''}
              onChange={(e) => handleDateChange('purchased', 'month', e.target.value)}
              className="dateInput"
            />
          </div>
          <div className="dateInputGroup">
            <label>Day</label>
            <input
              type="text"
              maxLength={2}
              value={dateData.purchased?.day || ''}
              onChange={(e) => handleDateChange('purchased', 'day', e.target.value)}
              className="dateInput"
            />
          </div>
          <div className="dateInputGroup">
            <label>Year</label>
            <input
              type="text"
              maxLength={4}
              value={dateData.purchased?.year || ''}
              onChange={(e) => handleDateChange('purchased', 'year', e.target.value)}
              className="dateInput"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateInformation;