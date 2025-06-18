const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Test route for token generation
router.get('/test-token', paymentController.testTokenGeneration);

// Test route for merchant login
router.post('/test-merchant-login', paymentController.testMerchantLogin);

// Test route for push payment request
router.post('/test-push-payment', paymentController.testPushPayment);

// Route to initiate payment
router.post('/initiate', paymentController.initiatePayment);

// Route to handle payment callback from AYA PAY
router.post('/callback', paymentController.handleCallback);

module.exports = router; 