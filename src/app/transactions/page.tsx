'use client';
import React, { useState, useEffect, useDeferredValue } from 'react';
import Link from 'next/link';
import './transactions.css';
import { useAppContext } from '@/context';
import { TrashIcon, PencilSquareIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { IClient } from '@/models/clientSchema';
import {UserAuth} from "../../context/AuthContext";
import { useRouter } from 'next/navigation';

export default function Transactions() {
  const { transactions, setFormData, setTransactions } = useAppContext()!;
  const {user} = UserAuth();

  const router = useRouter();

  const [searchFor, setSearchFor] = useState('');
  const [, setSelectedDate] = useState('');
  const deferredSearchFor = useDeferredValue(searchFor);

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  useEffect(() => {
    const fetchRecentTransactions = async () => {
      try {
        const res = await fetch('/api/getRecent');
        const data = await res.json();
        if (Array.isArray(data)) {
          setTransactions(data);
        } else {
          setTransactions([]);
        }
      } catch (error) {
        console.error('Error fetching recent transactions:', error);
        alert('An error occurred while fetching transactions.');
      }
    };
    fetchRecentTransactions();
  }, [setTransactions]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      try {
        if (deferredSearchFor.trim() === '') {
          const res = await fetch('/api/getRecent');
          const data = await res.json();
          if (Array.isArray(data)) {
            setTransactions(data);
          } else {
            setTransactions([]);
            console.error('Expected an array of transactions');
          }
        } else {
          const res = await fetch(`/api/get?searchFor=${deferredSearchFor}`);
          const data = await res.json();
          if (data.error) {
            setTransactions([]);
          } else {
            data.sort(
              (a: IClient, b: IClient) =>
                new Date(b.timeCreated).getTime() - new Date(a.timeCreated).getTime(),
            );
            setTransactions(data);
          }
        }
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [deferredSearchFor, setTransactions]);

  const handleDateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    setSelectedDate(selectedDate);

    const startOfDay = new Date(selectedDate);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(selectedDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    try {
      const res = await fetch(`/api/getByDate?date=${selectedDate}`);
      const data = await res.json();

      if (data.error) {
        setTransactions([]);
      } else {
        if (Array.isArray(data)) {
          data.sort(
            (a: IClient, b: IClient) =>
              new Date(b.timeCreated).getTime() - new Date(a.timeCreated).getTime(),
          );
          setTransactions(data);
        } else {
          setTransactions([]);
          console.error('Expected an array of transactions');
        }
      }
    } catch (error) {
      console.error('Error fetching transactions by date:', error);
    }
  };

  const handleTransactionChange: React.ChangeEventHandler<HTMLSelectElement> = async (e) => {
    const transactionType = e.target.value;

    try {
      const response =
        transactionType === 'All'
          ? await fetch('/api/getRecent')
          : await fetch(`/api/getByTransaction?transactionType=${transactionType}`);
      const data = await response.json();

      if (data.error) {
        setTransactions([]);
      } else {
        if (Array.isArray(data)) {
          setTransactions(data);
        } else {
          setTransactions([]);
          console.error('Expected an array of transactions');
        }
      }
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  const handleEdit = async (clientId: string) => {
    try {
      const clientToEdit = transactions.find((client) => client._id === clientId);
      if (clientToEdit) {
        setFormData(clientToEdit);
      } else {
        alert('Client not found.');
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const handleDelete = async (clientId: string) => {
    try {
      const response = await fetch(`/api/delete?clientId=${clientId}`, {
        method: 'DELETE',
      });

      await response.json();

      setTransactions(transactions.filter((client) => client._id !== clientId));
      alert('Client Deleted.');
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };


  return (
    <div className="container">
      <div className="transactionSearchContainer">
        <input type="date" className="transactionDate" onChange={handleDateChange} />
        <select className="transactionType" onChange={handleTransactionChange}>
          <option>All </option>
          <optgroup label="Simple Transfer">
            <option>Basic Simple Transfer</option>
            <option>Simple Transfer W/ Duplicates Plates/Stickers</option>
            <option>Simple Transfer W/ Gift</option>
            <option>Simple Transfer W/ Gift And Duplicates Plates/Stickers</option>
          </optgroup>
          <optgroup label="Renewal">
            <option>Basic Renewal</option>
            <option>Renewal W/ Duplicates Plates/Stickers </option>
            <option>Renewal W/ change of address </option>
            <option>Out of State Renewal That Needs Smog </option>
            <option>Renewal W/ Disabled Plates</option>
          </optgroup>
        </select>
        <div className="search-input-wrapper">
          <MagnifyingGlassIcon className="searchIcon" />
          <input
            className="transactionSearch"
            placeholder="Search By Name or Vin"
            onChange={(e) => setSearchFor(e.target.value)}
          />
        </div>
      </div>
      {transactions.length === 0 ? (
        <p className="noTransactionsMessage">No Transactions Found</p>
      ) : (
        <table className="transactionsTable">
          <thead>
            <tr>
              <th className="transactionDateTitle">Date</th>
              <th className="transactionFirst">First Name</th>
              <th className="transactionLast">Last Name</th>
              <th className="transactionVin">Vehicle Vin </th>
              <th className="transactionTypeHeading">Transaction Type </th>
              <th className="transactionEdit"></th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((client) => {
              return (
                <tr className="transaction" key={client._id}>
                  <td>{new Date(client.timeCreated).toLocaleString()}</td>
                  <td>{client.firstName1}</td>
                  <td>{client.lastName1}</td>
                  <td>{client.vehicleVinNumber}</td>
                  <td>{client.transactionType}</td>
                  <td>
                    <Link
                      href="/updateClient"
                      className="editanddelete-button"
                      onClick={() => handleEdit(client._id)}
                    >
                      <PencilSquareIcon className="editIcon" />
                    </Link>
                    <button className="editanddelete-button">
                      <TrashIcon className="trashIcon" onClick={() => handleDelete(client._id)} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
