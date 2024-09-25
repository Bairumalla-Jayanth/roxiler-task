const express = require('express');
const router = express.Router();
const productController = require('../Controllers/productController');

// Defining the routes
router.get('/fetch-data', productController.transactionData);  
router.get('/transactions', productController.getTransactions);
router.get('/statistics', productController.getStatistics);
router.get('/bar-chart', productController.getBarChartData);
router.get('/pie-chart', productController.getPieChartData);
router.get('/combined-data',productController.combinedData);

module.exports = router;
