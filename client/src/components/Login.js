import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Form, Button, Alert } from 'react-bootstrap';
import './Login.css';
import { Link } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://naira-mint-booking-service.onrender.com/login', {
        email,
        password,
      });
      console.log(response.data);
      localStorage.setItem('token', response.data.token);
      onLogin(); 
      navigate('/bookingForm'); 
    } catch (error) {
      console.error('Error:', error);
      if (error.response) {
       
        setError(error.response.data.message); 
      } else if (error.request) {
       
        setError('Server is unreachable. Please try again later.'); 
      } else {
        setError('An unexpected error occurred. Please try again.'); 
      }
    }
  };

  return (
    <Container className="login-container">
      <Row className="justify-content-center">
        <div className="login-form">
          <h2 className="text-center">Login</h2>
          {error && <Alert variant="danger">{error}</Alert>} {}
          <Form onSubmit={handleSubmit}>
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
              Login
            </Button>
          </Form>
          <div className="text-center mt-3">
            <p>Don't have an account? <Link to="/register">Click here to register</Link></p>
          </div>
        </div>
      </Row>
    </Container>
  );
};

export default Login;
