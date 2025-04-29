import React, { useState, useEffect } from 'react';
import { transactionService } from '../services/api';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all'); // all, completed, pending

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const data = await transactionService.getTransactions();
            setTransactions(data);
        } catch (err) {
            setError('Failed to fetch transactions');
            console.error('Transactions fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredTransactions = transactions.filter((transaction) => {
        if (filter === 'all') return true;
        return transaction.status === filter;
    });

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
            </div>

            {/* Filters */}
            <div className="bg-white shadow rounded-lg p-4">
                <div className="flex space-x-4">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-md ${filter === 'all'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('completed')}
                        className={`px-4 py-2 rounded-md ${filter === 'completed'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Completed
                    </button>
                    <button
                        onClick={() => setFilter('pending')}
                        className={`px-4 py-2 rounded-md ${filter === 'pending'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Pending
                    </button>
                </div>
            </div>

            {/* Transactions List */}
            <div className="bg-white shadow rounded-lg divide-y">
                {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((transaction) => (
                        <div
                            key={transaction.id}
                            className="p-6 hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">
                                        {transaction.description}
                                    </h3>
                                    <p className="mt-1 text-gray-500">
                                        Transaction ID: {transaction.id}
                                    </p>
                                    <p className="mt-1 text-gray-500">
                                        {new Date(transaction.date).toLocaleDateString()}{' '}
                                        {new Date(transaction.date).toLocaleTimeString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-medium text-gray-900">
                                        ${transaction.amount.toFixed(2)}
                                    </p>
                                    <span
                                        className={`mt-2 inline-block px-3 py-1 rounded-full text-sm ${transaction.status === 'completed'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                            }`}
                                    >
                                        {transaction.status}
                                    </span>
                                </div>
                            </div>
                            {transaction.appointmentId && (
                                <div className="mt-4 text-sm text-gray-500">
                                    Related to appointment: {transaction.appointmentId}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="p-6 text-center text-gray-500">
                        No transactions found
                    </div>
                )}
            </div>

            {/* Summary */}
            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Transaction Summary
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Total Transactions</p>
                        <p className="text-2xl font-semibold text-gray-900">
                            {transactions.length}
                        </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Total Amount</p>
                        <p className="text-2xl font-semibold text-gray-900">
                            $
                            {transactions
                                .reduce((sum, t) => sum + t.amount, 0)
                                .toFixed(2)}
                        </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Completed Transactions</p>
                        <p className="text-2xl font-semibold text-gray-900">
                            {transactions.filter((t) => t.status === 'completed').length}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Transactions; 