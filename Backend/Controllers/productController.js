const Product = require('../Models/Product');
const axios = require('axios');

// Creating API to initialize the database,fetching the JSON from the third party API and initializing the database with seed data.
const transactionData = async (req, res) => {
    try {
       const response = await axios.get("https://s3.amazonaws.com/roxiler.com/product_transaction.json");  
        const data = response.data;
        const transactionData = await Product.insertMany(data);  
        res.json({ "message": 'Data saved successfully', transactionData });
    } catch (error) {
       res.json({ "msg": 'An error occurred while fetching data' });
    }
};

// Creating an API to list  all the transactions and making sure it follows filter conditions and pagination
const getTransactions = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.perPage) || 10;
        const search = req.query.search ? req.query.search.toLowerCase() : '';
        const selectedMonth = req.query.month ? req.query.month.toLowerCase() : 'march';

        const monthMap = {
            'january': 1,
            'february': 2,
            'march': 3,
            'april': 4,
            'may': 5,
            'june': 6,
            'july': 7,
            'august': 8,
            'september': 9,
            'october': 10,
            'november': 11,
            'december': 12,
        };

        const numericMonth = monthMap[selectedMonth.toLowerCase()];

        const query = {            
            $expr: { $eq: [{ $month: "$dateOfSale" }, numericMonth] },            
            $or: [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ]
        };
        if (!isNaN(Number(search))) {
            query.$or.push({ price: Number(search) });
        }

        const totalCount = await Product.countDocuments(query);

        
        const transactions = await Product.find(query)
            .skip((page - 1) * perPage) 
            .limit(perPage);  

        const totalPages = Math.ceil(totalCount / perPage);        
        res.json({
            page,
            perPage,
            totalPages,
            totalCount,
            transactions
        });

    } catch (e) {
        console.error(e.message);
        res.json({ error: 'Internal Server Error' });
    }
};

// Creating an API for statistics
const getStatistics = async (req, res) => {
    try {
        const selectedMonth = req.query.month || 'march';

        const monthMap = {
            'january': 1,
            'february': 2,
            'march': 3,
            'april': 4,
            'may': 5,
            'june': 6,
            'july': 7,
            'august': 8,
            'september': 9,
            'october': 10,
            'november': 11,
            'december': 12,
        };
        const numericMonth = monthMap[selectedMonth.toLowerCase()];
        
        const totalSaleAmount = await Product.aggregate([
            { $match: { $expr: { $eq: [{ $month: "$dateOfSale" }, numericMonth] } } },
            { $group: { _id: null, totalSaleAmount: { $sum: { $cond: [{ $eq: ["$sold", true] }, "$price", 0] } } } }
        ]);

        const totalSoldItems = await Product.countDocuments({ $expr: { $eq: [{ $month: "$dateOfSale" }, numericMonth] }, sold: true });
        const totalNotSoldItems = await Product.countDocuments({ $expr: { $eq: [{ $month: "$dateOfSale" }, numericMonth] }, sold: false });

        res.json({
            selectedMonth,
            totalSaleAmount: totalSaleAmount[0]?.totalSaleAmount || 0,
            totalSoldItems,
            totalNotSoldItems
        });
    } catch (e) {
        console.error(e.message);
        res.json({ error: 'Internal Server Error' });
    }
};

// Creating an API for bar chart
const getBarChartData = async (req, res) => {
    try {
        const selectedMonth = req.query.month || 'march';
        const monthMap = {
            'january': 1,
            'february': 2,
            'march': 3,
            'april': 4,
            'may': 5,
            'june': 6,
            'july': 7,
            'august': 8,
            'september': 9,
            'october': 10,
            'november': 11,
            'december': 12,
        };
        const numericMonth = monthMap[selectedMonth.toLowerCase()];

        const priceRanges = [
            { label: '0 - 100', min: 0, max: 100 },
            { label: '101 - 200', min: 101, max: 200 },
            { label: '201 - 300', min: 201, max: 300 },
            { label: '301 - 400', min: 301, max: 400 },
            { label: '401 - 500', min: 401, max: 500 },
            { label: '501 - 600', min: 501, max: 600 },
            { label: '601 - 700', min: 601, max: 700 },
            { label: '701 - 800', min: 701, max: 800 },
            { label: '801 - 900', min: 801, max: 900 },
            { label: '901-above', min: 901, max: 9999999 }
        ];
        
        const barChartData = await Promise.all(priceRanges.map(async (range) => {
            const itemCount = await Product.countDocuments({
                $expr: { $eq: [{ $month: "$dateOfSale" }, numericMonth] },
                price: { $gte: range.min, $lte: range.max }
            });
            return { priceRange: range.label, itemCount };
        }));

        res.json(barChartData);
    } catch (e) {
        console.error(e.message);
        res.json({ error: 'Internal Server Error' });
    }
};

// Creating an API for pie chart
const getPieChartData = async (req, res) => {
    try {
        const selectedMonth = req.query.month || 'march';
        const monthMap = {
            'january': 1,
            'february': 2,
            'march': 3,
            'april': 4,
            'may': 5,
            'june': 6,
            'july': 7,
            'august': 8,
            'september': 9,
            'october': 10,
            'november': 11,
            'december': 12,
        };
        const numericMonth = monthMap[selectedMonth.toLowerCase()];
        
        const pieChartData = await Product.aggregate([
            { $match: { $expr: { $eq: [{ $month: "$dateOfSale" }, numericMonth] } } },
            { $group: { _id: "$category", itemCount: { $sum: 1 } } },
            { $project: { category: "$_id", itemCount: 1, _id: 0 } }
        ]);

        res.json(pieChartData);
    } catch (e) {
        console.error(e.message);
        res.json({ error: 'Internal Server Error' });
    }
};

// Creating a combined Api
const combinedData = async (req, res) => {
    try {
        
        const selectedMonth = req.query.month || 'march';
        const page = parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.perPage) || 10;
        const search = req.query.search ? req.query.search.toLowerCase() : '';

        const monthMap = {
            'january': 1, 'february': 2, 'march': 3, 'april': 4, 'may': 5,
            'june': 6, 'july': 7, 'august': 8, 'september': 9,
            'october': 10, 'november': 11, 'december': 12,
        };
        const numericMonth = monthMap[selectedMonth.toLowerCase()];

        
        const query = {
            $expr: { $eq: [{ $month: "$dateOfSale" }, numericMonth] },
            $or: [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ]
        };
        if (!isNaN(Number(search))) {
            query.$or.push({ price: Number(search) });
        }

        const totalCount = await Product.countDocuments(query);
        const transactions = await Product.find(query)
            .skip((page - 1) * perPage)
            .limit(perPage);
        const totalPages = Math.ceil(totalCount / perPage);

        
        const totalSaleAmount = await Product.aggregate([
            { $match: { $expr: { $eq: [{ $month: "$dateOfSale" }, numericMonth] } } },
            { $group: { _id: null, totalSaleAmount: { $sum: { $cond: [{ $eq: ["$sold", true] }, "$price", 0] } } } }
        ]);
        const totalSoldItems = await Product.countDocuments({ $expr: { $eq: [{ $month: "$dateOfSale" }, numericMonth] }, sold: true });
        const totalNotSoldItems = await Product.countDocuments({ $expr: { $eq: [{ $month: "$dateOfSale" }, numericMonth] }, sold: false });

        const statistics = {
            selectedMonth,
            totalSaleAmount: totalSaleAmount[0]?.totalSaleAmount || 0,
            totalSoldItems,
            totalNotSoldItems
        };

        
        const priceRanges = [
            { label: '0 - 100', min: 0, max: 100 },
            { label: '101 - 200', min: 101, max: 200 },
            { label: '201 - 300', min: 201, max: 300 },
            { label: '301 - 400', min: 301, max: 400 },
            { label: '401 - 500', min: 401, max: 500 },
            { label: '501 - 600', min: 501, max: 600 },
            { label: '601 - 700', min: 601, max: 700 },
            { label: '701 - 800', min: 701, max: 800 },
            { label: '801 - 900', min: 801, max: 900 },
            { label: '901-above', min: 901, max: 9999999 }
        ];

        const barChartData = await Promise.all(priceRanges.map(async (range) => {
            const itemCount = await Product.countDocuments({
                $expr: { $eq: [{ $month: "$dateOfSale" }, numericMonth] },
                price: { $gte: range.min, $lte: range.max }
            });
            return { priceRange: range.label, itemCount };
        }));

        
        const pieChartData = await Product.aggregate([
            { $match: { $expr: { $eq: [{ $month: "$dateOfSale" }, numericMonth] } } },
            { $group: { _id: "$category", itemCount: { $sum: 1 } } },
            { $project: { category: "$_id", itemCount: 1, _id: 0 } }
        ]);

        
        const combinedData = {
            transactions: {
                page,
                perPage,
                totalPages,
                totalCount,
                data: transactions
            },
            statistics,
            barChartData,
            pieChartData
        };

        res.json(combinedData);
    } catch (error) {
        console.error(error.message);
        res.json({ error: 'Failed to fetch combined data' });
    }
};



module.exports = { transactionData, getTransactions, getStatistics, getBarChartData, getPieChartData, combinedData};
