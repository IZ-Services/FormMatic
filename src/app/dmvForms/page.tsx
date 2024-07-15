'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import './dmvForms.css';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { UserAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function DMVFroms() {
  const { user, isSubscribed } = UserAuth();
  const router = useRouter();

  const [selectedUrl, setSelectedUrl] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [filteredForms, setFilteredForms] = useState<string[]>([]);

  const formNames = [
    'ADM399/ APPLICATION FOR REFUND',
    'BOAT101/ APPLICATION FOR REGISTRATION NUMBER, CERTIFICATE OF OWNERSHIP, AND CERTIFICATE OF NUMBER FOR UNDOCUMENTED VESSEL',
    'DMV14/ NOTICE OF CHANGE OF ADDRESS',
    'REG5/ AFFIDAVIT FOR TRANSFER WITHOUT PROBATE CALIFORNIA TITLED VEHICLE OR VESSELS ONLY',
    'REG17/ SPECIAL INTEREST LICENSE PLATE APPLICATION',
    'REG17A/ SPECIAL RECOGNITION LICENSE PLATE APPLICATION',
    'REG31/ VERIFICATION OF VEHICLE',
    'REG65/ APPLICATION FOR VEHICLE LICENSE FEE REFUND',
    'REG101/ STATEMENT TO RECORD OWNERSHIP',
    'REG102/ CERTIFICATE OF NON-OPERATION ',
    'REG135/ BILL OF SALE',
    'REG138/ NOTICE OF TRANSFER AND RELEASE OF LIABILITY',
    'REG156/ APPLICATION FOR REPLACEMENT PLATES, STICKERS, DOCUMENTS',
    'REG195/ APPLICATION FOR DISABLED PERSON PLACARD OR PLATES',
    'REG227/ APPLICATION FOR REPLACEMENT OR TRANSFER OF TITLE',
    'REG256/ STATEMENT OF FACTS',
    'REG256A/ MISCELLANEOUS CERTIFICATIONS',
    'REG256F/ STATEMENT OF FACTS CALIFORNIA NON-CERTIFIED VEHICLE',
    'REG343/ APPLICATION FOR TITLE OR REGISTRATION',
    'REG345/ SPECIALIZED TRANSPORTATION VEHICLE EXEMPTION CERTIFICATION',
    'REG488c/ APPLICATION FOR SALVAGE CERTIFICATE OR NONREPAIRABLE VEHICLE CERTIFICATE',
    'REG4008/ DECLARATION OF GROSS VEHICLE WEIGHT (GVW)/COMBINED GROSS VEHICLE WEIGHT (CGW)',
    'REG4017/ PERMANENT TRAILER IDENTIFICATION (PTI) CERTIFICATION',
    'REG5045/ NONRESIDENT MILITARY (NRM) VEHICLE LICENSE FEE AND TRANSPORTATION IMPROVEMENT FEE EXEMPTION',
    'REG5103/ APPLICATION FOR TEMPORARY SMOG EXEMPTION FOR A VEHICLE LOCATED OUT-OF-STATE',
  ];

  useEffect(() => {
    setFilteredForms(formNames);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }

    const creationTime = user.metadata?.creationTime;
    if (creationTime) {
      const userCreationDate = new Date(creationTime);
      const currentDate = new Date();
      const diffTime = Math.abs(currentDate.getTime() - userCreationDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 7 && !isSubscribed) {
        router.push('/signUp'); 
      }
    }
  }, [user, router, isSubscribed]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    filterForms(e.target.value);
  };

  const filterForms = (input: string) => {
    const filtered = formNames.filter((formName) =>
      formName.toLowerCase().includes(input.toLowerCase()),
    );
    setFilteredForms(filtered);
  };

  const handleFormClick = async (formName: string) => {
    let url = '';
    switch (formName) {
      case 'ADM399/ APPLICATION FOR REFUND':
        url = 'https://www.dmv.ca.gov/portal/uploads/2022/12/ADM-399-R6-2020-AS-WWW.pdf';
        break;
      case 'BOAT101/ APPLICATION FOR REGISTRATION NUMBER, CERTIFICATE OF OWNERSHI, AND CERTIFICATE OF NUMBER FOR UNDOCUMENTED VESSEL':
        url = 'https://www.dmv.ca.gov/portal/uploads/2020/03/boat101.pdf';
        break;
      case 'DMV14/ NOTICE OF CHANGE OF ADDRESS':
        url = 'https://www.dmv.ca.gov/portal/file/notice-of-change-of-address-dmv-14-form-pdf/';
        break;
      case 'REG5/ AFFIDAVIT FOR TRANSFER WITHOUT PROBATE CALIFORNIA TITLED VEHICLE OR VESSELS ONLY':
        url = 'https://www.dmv.ca.gov/portal/uploads/2021/07/REG5.pdf';
        break;
      case 'REG17/ SPECIAL INTEREST LICENSE PLATE APPLICATION':
        url = 'https://www.dmv.ca.gov/portal/uploads/2020/06/reg17.pdf';
        break;
      case 'REG17A/ SPECIAL RECOGNITION LICENSE PLATE APPLICATION':
        url = 'https://www.dmv.ca.gov/portal/uploads/2020/03/reg17a-1.pdf';
        break;
      case 'REG31/ VERIFICATION OF VEHICLE':
        url = 'https://www.dmv.ca.gov/portal/uploads/2024/03/REG-31-R4-2023-AS-WWW.pdf';
        break;
      case 'REG65/ APPLICATION FOR VEHICLE LICENSE FEE REFUND':
        url = 'https://www.dmv.ca.gov/portal/uploads/2020/03/reg65.p';
        break;
      case 'REG101/ STATEMENT TO RECORD OWNERSHIP':
        url = 'https://www.dmv.ca.gov/portal/uploads/2020/06/reg101.pdf';
        break;
      case 'REG102/ CERTIFICATE OF NON-OPERATION':
        url = 'https://www.dmv.ca.gov/portal/file/planned-non-operation-certification-reg-102-pdf/';
        break;
      case 'REG135/ BILL OF SALE':
        url = 'https://www.dmv.ca.gov/portal/uploads/2020/06/reg135.pdf';
        break;
      case 'REG138/ NOTICE OF TRANSFER AND RELEASE OF LIABILITY':
        url = 'https://www.dmv.ca.gov/portal/uploads/2020/06/reg138.pdf';
        break;
      case 'REG156/ APPLICATION FOR REPLACEMENT PLATES, STICKERS, DOCUMENTS':
        url = 'https://www.dmv.ca.gov/portal/uploads/2020/06/reg156.pdf';
        break;
      case 'REG195/ APPLICATION FOR DISABLED PERSON PLACARD OR PLATES':
        url =
          'https://www.dmv.ca.gov/portal/file/application-for-disabled-person-placard-or-plates-reg-195-pdf/';
        break;
      case 'REG227/ APPLICATION FOR REPLACEMENT OR TRANSFER OF TITLE':
        url = 'https://www.dmv.ca.gov/portal/uploads/2021/11/REG-227-R9-2021-AS-WWW.pdf';
        break;
      case 'REG256/ STATEMENT OF FACTS':
        url = 'https://www.dmv.ca.gov/portal/uploads/2022/10/REG-256-SP-R7-2009-AS-WWW.pdf';
        break;
      case 'REG256A/ MISCELLANEOUS CERTIFICATIONS':
        url = 'https://www.dmv.ca.gov/portal/uploads/2020/12/reg256a.pdf';
        break;
      case 'REG256F/ STATEMENT OF FACTS CALIFORNIA NON-CERTIFIED VEHICLE':
        url = 'https://www.dmv.ca.gov/portal/uploads/2020/04/reg256f.pdf';
        break;
      case 'REG343/ APPLICATION FOR TITLE OR REGISTRATION':
        url = 'https://www.dmv.ca.gov/portal/uploads/2023/07/REG-343-R12-2022-AS-WWW.pdf';
        break;
      case 'REG345/ SPECIALIZED TRANSPORTATION VEHICLE EXEMPTION CERTIFICATION':
        url = 'https://www.dmv.ca.gov/portal/uploads/2020/05/reg345.pdf';
        break;
      case 'REG488C/ APPLICATION FOR SALVAGE CERTIFICATE OR NONREPAIRABLE VEHICLE CERTIFICATE':
        url = 'https://www.dmv.ca.gov/portal/uploads/2020/03/reg488c.pdf';
        break;
      case 'REG4008/ DECLARATION OF GROSS VEHICLE WEIGHT (GVW)/COMBINED GROSS VEHICLE WEIGHT (CGW)':
        url = 'https://www.dmv.ca.gov/portal/uploads/2020/05/reg4008.pdf';
        break;
      case 'REG4017/ PERMANENT TRAILER IDENTIFICATION (PTI) CERTIFICATION':
        url = 'https://www.dmv.ca.gov/portal/uploads/2022/02/REG-4017-R1-2022-AS-WWW.pdf';
        break;
      case 'REG5045/ NONRESIDENT MILITARY (NRM) VEHICLE LICENSE FEE AND TRANSPORTATION IMPROVEMENT FEE EXEMPTION':
        url = 'https://www.dmv.ca.gov/portal/uploads/2022/01/REG-5045-R12-2021.pdf';
        break;
      case 'REG5103/ APPLICATION FOR TEMPORARY SMOG EXEMPTION FOR A VEHICLE LOCATED OUT-OF-STATE':
        url = 'https://www.dmv.ca.gov/portal/uploads/2020/05/reg5103.pdf';
        break;
      default:
        break;
    }
    setSelectedUrl(url);
  };

  return (
    <section className="container">
      <div className="formSearchContainer">
        <div className="search-input-wrapper">
          <MagnifyingGlassIcon className="searchIcon" />
          <input
            className="formSearch"
            placeholder="Search For Form"
            value={searchInput}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <div className="cards">
        {filteredForms.length === 0 ? (
          <p className="noFormsMessage">No forms found matching your search.</p>
        ) : (
          filteredForms.map((formName: string, index: number) => {
            const [id, title] = formName.split('/ ');
            return (
              <div className="card" key={index}>
                <h3>{title}</h3>
                <p>{id}</p>
                <Link href={selectedUrl} target="_blank" onClick={() => handleFormClick(formName)}>
                  <button className="previewButton">Preview</button>
                </Link>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
