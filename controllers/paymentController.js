const AyaPayService = require('../services/payment');
const paymentConfig = require('../config/payment');

const ayaPayService = new AyaPayService(paymentConfig.ayaPay);

// Test endpoint for token generation
exports.testTokenGeneration = async (req, res) => {
    try {
        const token = await ayaPayService.generateToken();
        res.json({
            success: true,
            token: token
        });
    } catch (error) {
        console.error('Token generation test error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate token',
            error: error.message
        });
    }
};

// Test endpoint for merchant login
exports.testMerchantLogin = async (req, res) => {
    try {
        const { phone, password } = req.body;
        
        if (!phone || !password) {
            return res.status(400).json({
                success: false,
                message: 'Phone and password are required'
            });
        }

        const result = await ayaPayService.merchantLogin(phone, password);
        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Merchant login test error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to login merchant',
            error: error.message
        });
    }
};

exports.initiatePayment = async (req, res) => {
    try {
        const { amount, orderId, description } = req.body;
        
        const paymentDetails = {
            amount,
            orderId,
            description,
            callbackUrl: paymentConfig.ayaPay.callbackUrl
        };

        const paymentResponse = await ayaPayService.processPayment(paymentDetails);
        
        res.json({
            success: true,
            data: paymentResponse
        });
    } catch (error) {
        console.error('Payment initiation error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to initiate payment'
        });
    }
};

exports.handleCallback = async (req, res) => {
    try {
        const { orderId, status, transactionId } = req.body;
        
        // Here you would typically:
        // 1. Verify the payment status
        // 2. Update your database
        // 3. Send notifications if needed
        
        res.json({
            success: true,
            message: 'Payment callback processed successfully'
        });
    } catch (error) {
        console.error('Payment callback error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process payment callback'
        });
    }
}; 