'use client';
import React, { useState, useEffect, useDeferredValue } from 'react';
import './transactions.css';
import {
  TrashIcon,
  PencilSquareIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { UserAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import Loading from '../../components/pages/Loading';
import { useAppContext } from '@/context';


import SimpleTransfer from '../../components/molecules/SimpleTransfer';
import MultipleTransfer from '../../components/molecules/MultipleTransfer';
import DuplicateTitle from '../../components/molecules/DuplicateTitle';
import DuplicateRegistration from '../../components/molecules/DuplicateRegistration';
import DuplicatePlatesStickers from '../../components/molecules/DuplicatePlatesAndSticklers';
import AddLienholder from '../../components/molecules/LienHolderAddition';
import RemoveLienholder from '../../components/molecules/LienHolderRemovel';
import ChangeOfAddress from '../../components/molecules/ChangeOfAddress';
import CommercialVehicleTransfer from '../../components/molecules/CommercialVehicleTitle';
import SalvageTransfer from '../../components/molecules/Salvage';
import PlannedNonOperation from '../../components/molecules/FilingPNO';
import RestoringPNOTransfer from '../../components/molecules/RestoringPno';
import CertificateOfNonOperation from '../../components/molecules/CertificateOfNonOperation';
import DisabledPersonPlacards from '../../components/molecules/DisabledPersonAndPlacards';
import DuplicateStickers from '../../components/molecules/DuplicateStickersOnly';
import NameChange from '../../components/molecules/NameChange';
import PersonalizedPlates from '../../components/molecules/PersonlisedPlates';

interface ITransaction {
  _id: string;
  userId: string;
  formData: any;
  transactionType: string;
  createdAt: string;
}


const transactionComponents: Record<string, React.FC<{ formData: any }>> = {
  'Simple Transfer': SimpleTransfer,
  'Multiple Transfer': MultipleTransfer,
  'Duplicate Title Transfer': DuplicateTitle,
  'Duplicate Registration Transfer': DuplicateRegistration,
  'Duplicate Plates & Stickers': DuplicatePlatesStickers,
  'Lien Holder Addition': AddLienholder,
  'Lien Holder Removal': RemoveLienholder,
  'Change Of Address Transfer': ChangeOfAddress,
  'Commercial Vehicle Transfer': CommercialVehicleTransfer,
  'Salvage Title Transfer': SalvageTransfer,
  'Filing PNO Transfer': PlannedNonOperation,
  'Restoring PNO Transfer': RestoringPNOTransfer,
  'Certificate Of Non-Operation Transfer': CertificateOfNonOperation,
  'Disabled Person and Placards': DisabledPersonPlacards,
  'Duplicate Stickers': DuplicateStickers,
  'Name Change/Correction Transfer': NameChange,
'Personalized Plates (Order)': PersonalizedPlates,
  'Personalized Plates (Exchange)': PersonalizedPlates,
  'Personalized Plates (Replacement)': PersonalizedPlates,
  'Personalized Plates (Reassignment)': PersonalizedPlates};

export default function Transactions() {
  const { transactions, setTransactions, setFormData } = useAppContext()!;
  const { user, isSubscribed } = UserAuth();
  const router = useRouter();

  const [searchFor, setSearchFor] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<ITransaction | null>(null);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [loading, setLoading] = useState(true);
  const [noTransactions, setNoTransactions] = useState(false);
  const deferredSearchFor = useDeferredValue(searchFor);

  useEffect(() => {
    if (!user) {
      router.push('/');
    } else if (!isSubscribed) {
      router.push('/signUp');
    } else {
      setLoading(false);
    }
  }, [user, isSubscribed, router]);

  useEffect(() => {
    const fetchRecentTransactions = async () => {
      try {
        const res = await fetch(`/api/getRecent?userId=${user?.uid}`);

        if (res.status === 404) {
          setTransactions([]);
          setNoTransactions(true);
          return;
        }

        const data = await res.json();
        setTransactions(Array.isArray(data) ? data : []);
        setNoTransactions(false);
      } catch (error) {
        console.error('Error fetching recent transactions:', error);
      }
    };

    fetchRecentTransactions();
  }, [setTransactions, user?.uid]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      try {
        const endpoint = deferredSearchFor.trim()
          ? `/api/get?searchFor=${deferredSearchFor}&userId=${user?.uid}`
          : `/api/getRecent?userId=${user?.uid}`;

        const res = await fetch(endpoint);

        if (res.status === 404) {
          setTransactions([]);
          setNoTransactions(true);
          return;
        }

        const data = await res.json();

        if (data.error) {
          setTransactions([]);
          setNoTransactions(true);
        } else {
          setTransactions(
            data.sort(
              (a: ITransaction, b: ITransaction) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
          );
          setNoTransactions(false);
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [deferredSearchFor, setTransactions, user?.uid]);

  const handleEdit = (clientId: string, user_id: string | undefined) => {
    if (!user_id) return;
  
    const clientToEdit = transactions.find(
      (transaction) => transaction._id === clientId && transaction.userId === user_id
    );
  
    if (!clientToEdit) {
      alert('Transaction not found.');
      return;
    }
    
    console.log('Transaction type:', clientToEdit.transactionType);
    console.log('Available components:', Object.keys(transactionComponents));
    

    let normalizedTransactionType = clientToEdit.transactionType;
    if (normalizedTransactionType.startsWith('Multiple Transfer')) {
      normalizedTransactionType = 'Multiple Transfer';
    }
    
    const formDataWithId = {
      ...clientToEdit.formData,
      _id: clientToEdit._id
    };
  
    setFormData(formDataWithId);
    setSelectedTransaction({
      ...clientToEdit,

      transactionType: normalizedTransactionType,
      formData: formDataWithId
    });
  };

  const handleDelete = async (clientId: string, user_id: string | undefined) => {
    if (!user_id) {
      console.error('User ID is required');
      return;
    }

    try {
      const response = await fetch(`/api/delete?clientId=${clientId}&user_id=${user_id}`, {
        method: 'DELETE',
      });

      await response.json();
      setTransactions(transactions.filter((client) => client._id !== clientId));
      alert('Client Deleted.');
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };


  const handleBackToTransactions = () => {
    setSelectedTransaction(null);
  };

  if (loading) {
    return <Loading />;
  }

  if (selectedTransaction) {
    const Component = transactionComponents[selectedTransaction.transactionType] as React.FC<{ formData: any }>;

    return (
      <div className="transaction-container">
        <div className="transaction-header" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button 
            className="back-buttonn" 
            onClick={handleBackToTransactions}
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '5px'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5"></path>
              <path d="M12 19l-7-7 7-7"></path>
            </svg>
          </button>
          <h2 className="transaction-heading" style={{ margin: 0 }}>Edit Transaction</h2>
        </div>
        {Component ? (
          <Component formData={selectedTransaction.formData} />
        ) : (
          <p className="noTransactionsMessage">
            Form not found for this transaction type: {selectedTransaction.transactionType}
          </p>
        )}
      </div>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="container">
        <div className="transactionSearchContainer">
          <div className="search-input-wrapper">
            <MagnifyingGlassIcon className="searchIcon" />
            <input
              className="transactionSearch"
              placeholder="Search by transaction type..." 
              onChange={(e) => setSearchFor(e.target.value)}
            />
          </div>
        </div>
        {noTransactions ? (
          <p className="noTransactionsMessage">No transactions found.</p>
        ) : transactions.length === 0 ? (
          <Loading />
        ) : (
          <table className="transactionsTable">
            <thead>
              <tr>
                <th className="transactionDateTitle">Date</th>
                <th className="transactionTypeHeading">Transaction Type</th>
                <th className="transactionActions">Actions</th>
              </tr>
            </thead>
            <tbody>
            {transactions.map((transaction: ITransaction) => (
  <tr key={transaction._id}>
    <td>{new Date(transaction.createdAt).toLocaleString()}</td>
    <td>
      {transaction.transactionType.startsWith('Multiple Transfer') 
        ? 'Multiple Transfer'
        : transaction.transactionType}
    </td>
    <td>
      <button
        className="editanddelete-button"
        onClick={() => handleEdit(transaction._id, user?.uid)}
      >
        <PencilSquareIcon className="editIcon" />
      </button>
      <button
        className="editanddelete-button"
        onClick={() => handleDelete(transaction._id, user?.uid)}
      >
        <TrashIcon className="trashIcon" />
      </button>
    </td>
  </tr>
))}
            </tbody>
          </table>
        )}
      </div>
    </LocalizationProvider>
  );
}