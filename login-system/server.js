const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//const Stripe = require('stripe');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'your_jwt_secret_key';
//const stripe = Stripe('sk_test_51Pawcs2LhakE1036Z2stHyJ94gsHhV2DcXVqmV0FjxY8UrRx4RHcmlT5BkgGFyO4hHq4J07VoudhWiE8mwcAGOYf00996kbOyA'); // Initialize Stripe with your secret key

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/login-system', {
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

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '15s' });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).send('Error logging in user');
  }
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



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
