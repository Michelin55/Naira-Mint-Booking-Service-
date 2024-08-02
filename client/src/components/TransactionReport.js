import React, { useEffect, useState } from 'react';
import { fetchTransactions } from '../services/api';
import { CSVLink } from 'react-csv';
import Modal from 'react-modal';
import './modalStyles.css';

const TransactionReport = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [modalHeight, setModalHeight] = useState(300); // Initial height of the modal

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const data = await fetchTransactions();
        setTransactions(data);
        setFilteredTransactions(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, []);

  useEffect(() => {
    setFilteredTransactions(
      transactions.filter(transaction =>
        transaction.customer.email.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, transactions]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const openModal = (items) => {
    setSelectedItems(items);
    setModalIsOpen(true);
    // Calculate modal height based on number of items
    setModalHeight(Math.max(300, items.length * 30)); // Adjust as needed based on item height
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedItems([]);
  };

  const csvHeaders = [
    { label: 'ID', key: 'id' },
    { label: 'User', key: 'customer.email' },
    { label: 'Amount', key: 'amount' },
    { label: 'Date', key: 'created_at' },
    { label: 'Status', key: 'status' },
    { label: 'Items', key: 'metadata.items' }, // Ensure your metadata contains items
  ];

  return (
    <div>
      <h1>Transaction Report</h1>
      <input
        type="text"
        placeholder="Search by user"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <CSVLink
        data={filteredTransactions}
        headers={csvHeaders}
        filename="transactions.csv"
        className="btn btn-primary"
        target="_blank"
      >
        Export CSV
      </CSVLink>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Status</th>
            <th>Items</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map(transaction => (
            <tr key={transaction.id}>
              <td>{transaction.id}</td>
              <td>{transaction.customer.email}</td>
              <td>{(transaction.amount / 100).toFixed(2)}</td>
              <td>{new Date(transaction.created_at).toLocaleDateString()}</td>
              <td>{transaction.status}</td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => openModal(transaction.metadata.items)}
                >
                  View Items
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Items Modal"
        ariaHideApp={false}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          },
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '60%',
            height: modalHeight,
            overflowY: 'auto',
            padding: '20px'
          }
        }}
      >
        <h2>Items Details</h2>
        {selectedItems && selectedItems.length > 0 ? (
          <ul>
            {selectedItems.map((item, index) => (
              <li key={index}>#{item.price}</li>
            ))}
          </ul>
        ) : (
          'No items'
        )}
        <button onClick={closeModal} className="btn btn-secondary">Close</button>
      </Modal>
    </div>
  );
};

export default TransactionReport;
