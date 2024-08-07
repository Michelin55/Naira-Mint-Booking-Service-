import React, { useState } from 'react';
import axios from 'axios';
import { Container, Row, Form, Button, Alert } from 'react-bootstrap';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); 
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    setSuccess(null); // Clear previous success messages

    try {
      const response = await axios.post('https://naira-mint-booking-service.onrender.com/register', {
        username,
        email,
        password,
      });
      
      if (response.status === 201) {
        setSuccess('Account created successfully!');
        setTimeout(() => navigate('/login'), 2000); // Redirect to login page after 2 seconds
      }
    } catch (error) {
      console.error('Error:', error);
      if (error.response) {
        // Server responded with a status code outside the range of 2xx
        setError(error.response.data); // Display the specific error message from the server
      } else if (error.request) {
        // Request was made but no response was received
        setError('Server is unreachable. Please try again later.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <Container className="login-container">
      <Row className="justify-content-center">
        <div className="login-form">
          <h2 className="text-center">Register</h2>
          {success && <Alert variant="success">{success}</Alert>} {/* Render success message if success exists */}
          {error && <Alert variant="danger">{error}</Alert>} {/* Render error message if error exists */}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" block>
              Register
            </Button>
          </Form>
          <div className="text-center mt-3">
            <p>Already have an account? <Link to="/login">Click here to login</Link></p>
          </div>
        </div>
      </Row>
    </Container>
  );
};

export default Register;
