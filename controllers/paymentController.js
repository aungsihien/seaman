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

// Test endpoint for push payment request
exports.testPushPayment = async (req, res) => {
    try {
        const { 
            merchantPhone, 
            merchantPassword, 
            amount, 
            customerPhone, 
            externalTransactionId,
            externalAdditionalData 
        } = req.body;
        
        if (!merchantPhone || !merchantPassword || !amount || !customerPhone || !externalTransactionId) {
            return res.status(400).json({
                success: false,
                message: 'merchantPhone, merchantPassword, amount, customerPhone, and externalTransactionId are required'
            });
        }

        // First, login as merchant to get merchant token
        const merchantLoginResult = await ayaPayService.merchantLogin(merchantPhone, merchantPassword);
        console.log('Merchant login result:', merchantLoginResult);
        
        // Extract the merchant token from the response
        // The token is nested under token.token based on the API response
        let merchantToken;
        if (merchantLoginResult.token && merchantLoginResult.token.token) {
            merchantToken = merchantLoginResult.token.token;
        } else if (merchantLoginResult.token) {
            merchantToken = merchantLoginResult.token;
        } else if (merchantLoginResult.access_token) {
            merchantToken = merchantLoginResult.access_token;
        } else if (merchantLoginResult.data && merchantLoginResult.data.token) {
            merchantToken = merchantLoginResult.data.token;
        } else {
            throw new Error('Could not extract merchant token from login response');
        }

        console.log('Extracted merchant token:', merchantToken);

        // Prepare payment details
        const paymentDetails = {
            amount: amount,
            currency: 'MMK',
            externalTransactionId: externalTransactionId,
            customerPhone: customerPhone,
            externalAdditionalData: externalAdditionalData
        };

        // Request push payment
        const result = await ayaPayService.requestPushPayment(merchantToken, paymentDetails);
        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Push payment test error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to request push payment',
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