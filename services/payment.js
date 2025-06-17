const axios = require('axios');

class AyaPayService {
    constructor(config) {
        this.baseUrl = config.baseUrl;
        this.clientId = config.clientId;
        this.clientSecret = config.clientSecret;
    }

    async generateToken() {
        try {
            // Using the exact Authorization header from the CURL example
            const response = await axios.post(
                `${this.baseUrl}/token`,
                'grant_type=client_credentials',
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': 'Basic WUc0WktjN1hXYjVDS0xPZUg4VGVRQjJLVVdRYTp0emtaT1J0X3hRb2FFOWNhVnhMbHRUOWt4SDhh'
                    }
                }
            );

            console.log('Token response:', response.data);
            return response.data.access_token;
        } catch (error) {
            console.error('Error generating token:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                headers: error.response?.headers
            });
            throw new Error(`Failed to generate payment token: ${error.message}`);
        }
    }

    async merchantLogin(phone, password) {
        try {
            // First, get the token
            const token = await this.generateToken();
            console.log('Generated token for merchant login:', token);

            // Then use the token for merchant login
            const response = await axios.post(
                `${this.baseUrl}/om/1.0.0/thirdparty/merchant/login`,
                {
                    phone: phone,
                    password: password
                },
                {
                    headers: {
                        'Token': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Merchant login response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error in merchant login:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                headers: error.response?.headers
            });
            throw new Error(`Failed to authenticate merchant: ${error.message}`);
        }
    }

    async requestPayment(token, paymentDetails) {
        try {
            const response = await axios.post(`${this.baseUrl}/payment/request`, {
                token: token,
                merchantId: this.merchantId,
                amount: paymentDetails.amount,
                currency: 'MMK',
                orderId: paymentDetails.orderId,
                description: paymentDetails.description,
                callbackUrl: paymentDetails.callbackUrl
            });
            return response.data;
        } catch (error) {
            console.error('Error requesting payment:', error);
            throw new Error('Failed to initiate payment');
        }
    }

    async processPayment(paymentDetails) {
        try {
            // Step 1: Generate token
            const token = await this.generateToken();
            
            // Step 2: Merchant login
            await this.merchantLogin(this.phone, this.password);
            
            // Step 3: Request payment
            const paymentResponse = await this.requestPayment(token, paymentDetails);
            
            return paymentResponse;
        } catch (error) {
            console.error('Payment processing error:', error);
            throw error;
        }
    }
}

module.exports = AyaPayService; 