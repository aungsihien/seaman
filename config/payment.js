module.exports = {
    ayaPay: {
        baseUrl: process.env.AYA_PAY_API_URL || 'https://opensandbox.ayainnovation.com',
        clientId: process.env.AYA_PAY_CLIENT_ID || 'YG4ZKc7XWb5CKLOfH8TeQB2KUWQa',
        clientSecret: process.env.AYA_PAY_CLIENT_SECRET || 'tzkZORt_xQoaE9caVxLltT9kxH8a',
        callbackUrl: process.env.AYA_PAY_CALLBACK_URL || 'https://your-domain.com/payment/callback'
    }
}; 