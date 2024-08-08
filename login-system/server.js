const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'your_jwt_secret_key';

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

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

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '60s' });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).send('Error logging in user');
  }
});

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) return res.status(401).send('Access denied');

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send('Token expired or invalid');
    req.user = user;
    next();
  });
};

app.get('/protected-route', authenticateToken, (req, res) => {
  res.send('This is a protected route');
});

app.post('/verify-payment', async (req, res) => {
  const { reference } = req.body;
  try {
    const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `sk_test_971a2e464395cd15963125cb025f9045bcea6340`
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

app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send('Error retrieving users');
  }
});


app.get('/user-transactions', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id; // Assuming the user ID is stored in the JWT payload
    const transactions = await Transaction.find({ userId });
    res.json(transactions);
  } catch (error) {
    res.status(500).send('Error fetching transactions');
  }
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
