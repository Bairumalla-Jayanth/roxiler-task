import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { fetchBarChartData } from '../Services/api';
import { Chart, registerables } from 'chart.js';
import './BarChart.css';

Chart.register(...registerables); 


// Fetching the Bar chart data
const BarChart = ({ month }) => {
    const [barChartData, setBarChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetchBarChartData(month);
                setBarChartData(response.data);
            } catch (err) {
                setError('Failed to fetch bar chart data.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [month]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    
    const labels = barChartData.map(item => item.priceRange);
    const counts = barChartData.map(item => item.itemCount);

    const data = {
        labels,
        datasets: [
            {
                label: 'Item Count',
                data: counts,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
        ],
    };

    return (
        <div className="bar-chart-container">
            <h3 className="bar-chart-title">Bar Chart Data for {month}</h3>
            <Bar data={data} />
        </div>
    );
};

export default BarChart;
