const axios = require('axios');

class PaymobService {
  constructor() {
    this.apiKey = process.env.PAYMOB_API_KEY;
    this.integrationId = process.env.PAYMOB_INTEGRATION_ID;
    this.apiBaseUrl = 'https://accept.paymob.com/api';
  }

  async authenticate() {
    const response = await axios.post(`${this.apiBaseUrl}/auth/tokens`, {
      api_key: this.apiKey,
    });
    return response.data.token;
  }

  async createOrder(token, orderData) {
    const response = await axios.post(
      `${this.apiBaseUrl}/ecommerce/orders`,
      orderData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.id;
  }

  async requestPaymentKey(token, paymentKeyData) {
    const response = await axios.post(
      `${this.apiBaseUrl}/acceptance/payment_keys`,
      paymentKeyData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.token;
  }

  async createPaymentSession(orderAmount, currency, billingData) {
    // Authenticate and get token
    const authToken = await this.authenticate();

    // Create order
    const orderId = await this.createOrder(authToken, {
      amount_cents: orderAmount,
      currency: currency,
      items: [],
    });

    // Request payment key
    const paymentKey = await this.requestPaymentKey(authToken, {
      amount_cents: orderAmount,
      expiration: 3600,
      order_id: orderId,
      billing_data: billingData,
      currency: currency,
      integration_id: this.integrationId,
      lock_order_when_paid: false,
    });

    return paymentKey;
  }
}

module.exports = PaymobService;
