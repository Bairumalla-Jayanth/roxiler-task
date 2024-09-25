
import React, { useEffect, useState } from 'react';
import { fetchStatistics } from '../Services/api';
import './Statistics.css'; 

//Fetching the transaction statistics 
const Statistics = ({ month }) => {
    const [statistics, setStatistics] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const statsResponse = await fetchStatistics(month);
                setStatistics(statsResponse.data);
            } catch (err) {
                setError('Failed to fetch statistics.'); 
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [month]); 

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="statistics-container">
            <h2>Statistics for {month}</h2>
            <p>Total Sale Amount: <strong>${statistics.totalSaleAmount}</strong></p>
            <p>Total Sold Items: <strong>{statistics.totalSoldItems}</strong></p>
            <p>Total Not Sold Items: <strong>{statistics.totalNotSoldItems}</strong></p>
        </div>
    );
};

export default Statistics;
