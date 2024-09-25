import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

export const fetchTransactions = (month, page, searchTerm) => {
    return API.get('/transactions', { params: { month, page, search: searchTerm } });
};

export const fetchStatistics = (month) => {
    return API.get('/statistics', { params: { month } });
};

export const fetchBarChartData = (month) => {
    return API.get('/bar-chart', { params: { month } });
};