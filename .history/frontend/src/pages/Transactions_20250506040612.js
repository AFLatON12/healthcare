import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Transactions.css';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [newTransaction, setNewTransaction] = useState({ amount: '', description: '' });
  const [editingTransactionId, setEditingTransactionId] = useState(null);
  const [editingTransaction, setEditingTransaction] = useState({ amount: '', description: '' });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('/api/payments');
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleCreateTransaction = async () => {
    try {
      await axios.post('/api/payments', newTransaction);
      fetchTransactions();
      setNewTransaction({ amount: '', description: '' });
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  };

  const handleEditClick = (transaction) => {
    setEditingTransactionId(transaction._id);
    setEditingTransaction({ amount: transaction.amount, description: transaction.description });
  };

  const handleCancelEdit = () => {
    setEditingTransactionId(null);
    setEditingTransaction({ amount: '', description: '' });
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(`/api/payments/${editingTransactionId}`, editingTransaction);
      fetchTransactions();
      setEditingTransactionId(null);
      setEditingTransaction({ amount: '', description: '' });
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/payments/${id}`);
      fetchTransactions();
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  return (
    <div className="transactions-container">
      <h1>Transactions</h1>
      <div className="transaction-form">
        <input
          type="number"
          placeholder="Amount"
          value={newTransaction.amount}
          onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={newTransaction.description}
          onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
        />
        <button onClick={handleCreateTransaction}>Create Transaction</button>
      </div>
      <table className="transactions-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Amount</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction._id}>
              <td>{transaction._id}</td>
              <td>
                {editingTransactionId === transaction._id ? (
                  <input
                    type="number"
                    value={editingTransaction.amount}
                    onChange={(e) => setEditingTransaction({ ...editingTransaction, amount: e.target.value })}
                  />
                ) : (
                  transaction.amount
                )}
              </td>
              <td>
                {editingTransactionId === transaction._id ? (
                  <input
                    type="text"
                    value={editingTransaction.description}
                    onChange={(e) => setEditingTransaction({ ...editingTransaction, description: e.target.value })}
                  />
                ) : (
                  transaction.description
                )}
              </td>
              <td>
                {editingTransactionId === transaction._id ? (
                  <>
                    <button onClick={handleSaveEdit}>Save</button>
                    <button onClick={handleCancelEdit}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEditClick(transaction)}>Edit</button>
                    <button onClick={() => handleDelete(transaction._id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Transactions;
