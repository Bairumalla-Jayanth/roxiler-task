
import React, { useState } from 'react';
import TransactionTable from './Components/TransactionTable';
import Statistics from './Components/Statistics';
import BarChart from './Components/BarChart';
import './App.css'; 

// Setting up App to display Transaction Dashboard and also the searchbar, pagination and dropdown list for months
const App = () => {
    const [month, setMonth] = useState('march');
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);

    const handleNextPage = () => {
      if (page < 6) {
          setPage(prevPage => prevPage + 1);
      }
  };
  
  const handlePrevPage = () => {
      if (page > 1) {
          setPage(prevPage => prevPage - 1);
      }
  };
    

    return (
        <div className="app-container">
            <h1>Transaction Dashboard</h1>
            <div className="controls">
                <select value={month} onChange={(e) => setMonth(e.target.value)}>
                    {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month, index) => (
                        <option key={index} value={month.toLowerCase()}>{month}</option>
                    ))}
                </select>
                <input 
                    type="text" 
                    placeholder="Search transactions..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="pagination">
                  <button onClick={handlePrevPage} disabled={page === 1}>Previous</button>
                    <span>Page {page}</span>
                  <button onClick={handleNextPage} disabled={page === 6}>Next</button>
                </div>

            </div>
            <TransactionTable month={month} page={page} searchTerm={searchTerm} />
            <Statistics month={month} />
            <BarChart month={month} />
        </div>
    );
};

export default App;
