import axios from 'axios';

// Base URL for Paystack API
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

// Get the Paystack secret key from environment variables
const PAYSTACK_SECRET_KEY = process.env.REACT_APP_PAYSTACK_SECRET_KEY;

// Set up Axios instance with Paystack secret key
const axiosInstance = axios.create({
  baseURL: PAYSTACK_BASE_URL,
  headers: {
    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
  },
});

// Fetch transactions from Paystack
export const fetchTransactions = async () => {
  try {
    const response = await axiosInstance.get('/transaction');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};
