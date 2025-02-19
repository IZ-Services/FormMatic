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

interface ITransaction {
  _id: string;
  userId: string;
  formData: any;
  transactionType: string;
  createdAt: string;
}

const transactionComponents: Record<string, React.FC<{ formData: any }>> = {
  'Simple Transfer': SimpleTransfer,
};

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
  
    const formDataWithId = {
      ...clientToEdit.formData,
      _id: clientToEdit._id
    };
  
    setFormData(formDataWithId);
    setSelectedTransaction({
      ...clientToEdit,
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

  if (loading) {
    return <Loading />;
  }

  if (selectedTransaction) {
    const Component = transactionComponents[selectedTransaction.transactionType] as React.FC<{ formData: any }>;

    return (
      <div className="transaction-container">
        <h2 className="transaction-heading">Edit Transaction</h2>
        {Component ? <Component formData={selectedTransaction.formData} /> : <p className="noTransactionsMessage">Form not found for this transaction type.</p>}
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
              placeholder="Search Transactions"
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
                  <td>{transaction.transactionType}</td>
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
