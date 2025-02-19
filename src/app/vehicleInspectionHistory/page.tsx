'use client';
import React, { useState } from 'react';
import './vehicleInspectionHistory.css';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
// import { UserAuth } from '../../context/AuthContext';
// import { useRouter } from 'next/navigation';
// import Loading from '../../components/pages/Loading';

export default function VehicleInspectionHistoryPage() {
//   const { user, isSubscribed } = UserAuth();
//   const router = useRouter();
//   const [loading, setLoading] = React.useState(true);
const [vinInput, setVinInput] = useState('');
const [selectedVehicle, setSelectedVehicle] = useState<any>(null);

  // useEffect(() => {
  //   if (!user) {
  //     router.push('/');
  //   } else if (!isSubscribed) {
  //     router.push('/signUp');
  //   } else {
  //     setLoading(false);
  //   }
  // }, [user, isSubscribed, router]);

  // if (loading) {
  //   return <Loading />;
  // }

  const handleSearch = async () => {
    try {
      // Call our new Puppeteer API endpoint
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vin: vinInput }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch inspection data');
      }

      const data = await response.json();
      setSelectedVehicle(data);
    } catch (error) {
      console.error(error);
      // Reset or handle error in state
      setSelectedVehicle(null);
    }
  };


  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      {/* Heading and print button */}
      <div className="pageHeader">
        <button className="printButton" onClick={handlePrint}>
          Print
        </button>
        <h1 className="contactHeading">Vehicle Inspection History</h1>
      </div>

      {/* Search Bar */}
      <div className="searchVinNumInput">
        <div className="inputWrapper">
          <input
            type="text"
            placeholder="Enter VIN Number"
            value={vinInput}
            onChange={(e) => setVinInput(e.target.value)}
          />
          <MagnifyingGlassIcon className="magnifyingGlassIcon" />
        </div>
        <button className="searchVinNumButton" onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* Display Vehicle Info / Inspection History */}
      {selectedVehicle && (
        <div className="vehicleInfoContainer">
          <h2>Vehicle Information</h2>
          <div className="vehicleDetails">
            <p>
              <strong>VIN:</strong> {selectedVehicle.vin}
            </p>
            <p>
              <strong>STAR Certification Required:</strong> {selectedVehicle.starCertificationRequired}
            </p>
            <p>
              <strong>Referee Certification Required:</strong>{' '}
              {selectedVehicle.refereeCertificationRequired}
            </p>
            <p>
              <strong>Program Area:</strong> {selectedVehicle.programArea}
            </p>
          </div>

          <hr className="sectionDivider" />

          <h2>Inspection History</h2>
          {selectedVehicle.inspectionHistory && selectedVehicle.inspectionHistory.length > 0 ? (
            <div>
              <p>
                {selectedVehicle.inspectionHistory.length} inspection result
                {selectedVehicle.inspectionHistory.length > 1 && 's'} for VIN #{selectedVehicle.vin}
              </p>

              <div className="inspectionTableWrapper">
                <table className="inspectionTable">
                  <thead>
                    <tr>
                      <th>Make</th>
                      <th>Model</th>
                      <th>Year</th>
                      <th>Inspection Type</th>
                      <th>Date / Time</th>
                      <th>Result</th>
                      <th>Certificate Number</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedVehicle.inspectionHistory.map((inspection: any, index: number) => (
                      <tr key={index}>
                        <td>{inspection.make}</td>
                        <td>{inspection.model}</td>
                        <td>{inspection.year}</td>
                        <td>{inspection.inspectionType}</td>
                        <td>{inspection.dateTime}</td>
                        <td>{inspection.result}</td>
                        <td>{inspection.certificateNumber}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p>0 inspection result(s) for VIN #{selectedVehicle.vin}</p>
          )}
        </div>
      )}
    </div>
  );
}