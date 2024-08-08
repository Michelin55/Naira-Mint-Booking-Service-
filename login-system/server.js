const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const User = require('./models/User');  // Assuming you have a User model

const app = express();
const PORT = process.env.PORT || 5000;

const JWT_SECRET = 'your_jwt_secret_key';
const JWT_REFRESH_SECRET = 'your_jwt_refresh_secret_key';

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Generate Access and Refresh Tokens
const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1m' });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

// User Registration
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).send('User registered successfully');
  } catch (error) {
    res.status(500).send('Error registering user');
  }
});

// User Login with JWT and Refresh Token
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Invalid credentials');
    }

    const token = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.status(200).json({ token, refreshToken });
  } catch (error) {
    res.status(500).send('Error logging in user');
  }
});

// Middleware for Token Authentication
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) return res.status(401).send('Access denied');

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send('Token expired or invalid');
    req.user = user;
    next();
  });
};

// Route to Refresh Access Token using Refresh Token
app.post('/refresh-token', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).send('Refresh Token required');

  jwt.verify(refreshToken, JWT_REFRESH_SECRET, (err, user) => {
    if (err) return res.status(403).send('Invalid or expired refresh token');
    
    const newAccessToken = generateAccessToken({ id: user.id });
    res.status(200).json({ token: newAccessToken });
  });
});

// Protected Route Example
app.get('/protected-route', authenticateToken, (req, res) => {
  res.send('This is a protected route');
});

// Payment Verification Example
app.post('/verify-payment', async (req, res) => {
  const { reference } = req.body;
  try {
    const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer your_paystack_secret_key`
      }
    });
    if (response.data.data.status === 'success') {
      res.json({ status: 'success', data: response.data.data });
    } else {
      res.json({ status: 'error', message: 'Transaction not successful' });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'An error occurred', error: error.message });
  }
});

// Fetch All Users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send('Error retrieving users');
  }
});

// Fetch User Transactions (Protected Route)
app.get('/user-transactions', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;  // Assuming the user ID is stored in the JWT payload
    const transactions = await Transaction.find({ userId });
    res.json(transactions);
  } catch (error) {
    res.status(500).send('Error fetching transactions');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
