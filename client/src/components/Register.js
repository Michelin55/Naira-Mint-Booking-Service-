import React, { useState } from 'react';
import axios from 'axios';
import { Container, Row, Form, Button, Alert } from 'react-bootstrap';
import './Login.css';
import { Link } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); // State for error message

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/register', {
        username,
        email,
        password,
      });
      console.log(response.data);
      // Optionally, handle successful registration here
    } catch (error) {
      console.error('Error:', error);
      if (error.response) {
        // Server responded with a status code outside of 2xx range
        setError(error.response.data.message); // Set error message from server response
      } else if (error.request) {
        // The request was made but no response was received
        setError('Server is unreachable. Please try again later.'); // Set custom error message for server unreachable
      } else {
        // Something happened in setting up the request that triggered an error
        setError('An unexpected error occurred. Please try again.'); // Set generic error message
      }
    }
  };

  return (
    <Container className="login-container">
      <Row className="justify-content-center">
        <div className="login-form">
          <h2 className="text-center">Register</h2>
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
            <p>
              Already have an account? <Link to="/login">Click here to login</Link>
            </p>
          </div>
        </div>
      </Row>
    </Container>
  );
};

export default Register;
