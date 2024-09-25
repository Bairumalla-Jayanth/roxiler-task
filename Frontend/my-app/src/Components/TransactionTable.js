import React, { useState, useEffect } from 'react';
import { fetchTransactions } from '../Services/api';
import './TransactionTable.css'; 


//Fetching the list of transactions 
const TransactionTable = ({ month, page, searchTerm }) => {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const getData = async () => {
            const response = await fetchTransactions(month, page, searchTerm);            
            
            const uniqueTransactions = response.data.transactions.filter(
                (transaction, index, self) =>
                    index === self.findIndex(t => t._id === transaction._id)
            );
            
            setTransactions(uniqueTransactions);
        };
        getData();
    }, [month, page, searchTerm]);

    return (
        <table className="transaction-table">
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Price</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Image</th> 
                </tr>
            </thead>
            <tbody>
                {transactions.length > 0 ? (
                    transactions.map(transaction => (
                        <tr key={transaction._id}>
                            <td>{transaction.title}</td>
                            <td>${transaction.price.toFixed(2)}</td>
                            <td>{transaction.description}</td>
                            <td>{transaction.category}</td>
                            <td>
                                <img 
                                    src={transaction.image} 
                                    alt={transaction.title} 
                                    style={{
                                        width: '120px', 
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                        objectFit: 'cover',
                                        transition: 'transform 0.3s ease',                                        
                                    }}
                                   
                                />
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="5" style={{ textAlign: 'center' }}>No transactions found.</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};

export default TransactionTable;
