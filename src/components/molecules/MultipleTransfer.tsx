'use client';
import NewRegisteredOwners from '../atoms/NewRegisteredOwner';
import Seller from '../atoms/Seller';
import { FormDataProvider, useFormContext } from '../../app/api/formDataContext/formDataContextProvider';
import { ScenarioProvider } from '../../context/ScenarioContext';
import React, { useEffect, useRef, useState } from 'react';
import './MultipleTransfer.css';
import { ChevronDownIcon } from 'lucide-react';

interface MultipleTransferProps {
  formData?: any;
}

export default function MultipleTransfer({ formData }: MultipleTransferProps) {
	const [formValues, setFormValues] = useState(formData || {});
  	const [howManyTransfers, setHowManyTransfers] = useState(Number(formData?.howManyTransfers) || 1);
  	const [isHowManyTransfersMenuOpen, setIsHowManyTransfersMenuOpen] = useState(false);
	const [activeTransfer, setActiveTransfer] = useState(1);
  
	const howManyTransfersRef = useRef<HTMLUListElement | null>(null);
  	const howManyTransfersOption = ['1', '2', '3', '4', '5'];


	useEffect(() => {
		setFormValues(formData);
		if (formData?.howManyTransfers) {
		setHowManyTransfers(Number(formData.howManyTransfers));
		}
	}, [formData]);

	const handleHowManyTransfersChange = (option: string) => {
		setHowManyTransfers(Number(option));
		setFormValues((prev: any) => ({ ...prev, howManyTransfers: Number(option) }));
		setIsHowManyTransfersMenuOpen(false);
	};
	
	

  	const FormContent = () => {
    	const { updateField } = useFormContext();

    	useEffect(() => {
      		if (formValues) {
        		Object.entries(formValues).forEach(([key, value]) => {
          	updateField(key, value);
        });
      }
    }, [formValues]);



    return (
		<div>
		
		
			<div className="transferHeader">
				<h3 className="transferHeading">Number of Transfers</h3>
				<div className="howManyTransfersWrapper">
				<button
					onClick={() => setIsHowManyTransfersMenuOpen(!isHowManyTransfersMenuOpen)}
					className="howManyTransfersDropDown"
					>
					{String(howManyTransfers)}
					<ChevronDownIcon className={`howManyTransfersIcon ${isHowManyTransfersMenuOpen ? 'rotate' : ''}`} />
					</button>

				{isHowManyTransfersMenuOpen && (
					<ul ref={howManyTransfersRef} className="howManyTransfersMenu">
					{howManyTransfersOption.map((option, index) => (
						<li
						className="howManyTransfersLists"
						key={index}
						  onClick={() => handleHowManyTransfersChange(option)}
						>
						{option}
						</li>
					))}
					</ul>
				)}
				</div>
			</div>

			<div className='Multiple-Container'>
        		<div className="transferTabs">
          			{Array.from({ length: howManyTransfers }, (_, i) => i + 1).map((transfer) => (
            	<button
              		key={transfer}
              		className={`transferTab ${activeTransfer === transfer ? 'active' : ''}`}
              		onClick={() => setActiveTransfer(transfer)}
            	>
              	Transfer {transfer}
            	</button>
          	))}
        	</div>
			<div className='transferInner'>
				<NewRegisteredOwners formData={formValues} />
				<Seller formData={formValues} />
			</div>
			</div>
		</div>
    );
  };

  return (
    <FormDataProvider>
      <ScenarioProvider>
        <div className="MultipleTransferWrapper">
          <FormContent />
        </div>
      </ScenarioProvider>
    </FormDataProvider>
  );
}