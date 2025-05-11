const axios = require('axios');

const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY;
const PAYMOB_INTEGRATION_ID = process.env.PAYMOB_INTEGRATION_ID;
const PAYMOB_IFRAME_ID = process.env.PAYMOB_IFRAME_ID;
const PAYMOB_BASE_URL = 'https://accept.paymob.com/api';

async function authenticate() {
    const response = await axios.post(`${PAYMOB_BASE_URL}/auth/tokens`, {
        api_key: PAYMOB_API_KEY,
    });
    return response.data.token;
}

async function createOrder(token, amountCents, userData) {
    const response = await axios.post(
        `${PAYMOB_BASE_URL}/ecommerce/orders`,
        {
            auth_token: token,
            delivery_needed: false,
            amount_cents: amountCents,
            currency: 'EGP',
            items: [],
            shipping_data: userData,
        }
    );
    return response.data;
}

async function generatePaymentKey(token, amountCents, orderId, billingData) {
    const response = await axios.post(
        `${PAYMOB_BASE_URL}/acceptance/payment_keys`,
        {
            auth_token: token,
            amount_cents: amountCents,
            expiration: 3600,
            order_id: orderId,
            billing_data: billingData,
            currency: 'EGP',
            integration_id: PAYMOB_INTEGRATION_ID,
            lock_order_when_paid: true,
        }
    );
    return response.data.token;
}

function getPaymentUrl(paymentKey) {
    return `https://accept.paymob.com/api/acceptance/iframes/${PAYMOB_IFRAME_ID}?payment_token=${paymentKey}`;
}

module.exports = {
    authenticate,
    createOrder,
    generatePaymentKey,
    getPaymentUrl,
}; 