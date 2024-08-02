import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import './Login.css';
import { Link } from 'react-router-dom';
const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', {
        email,
        password,
      });
      console.log(response.data);
      localStorage.setItem('token', response.data.token);
      onLogin(); // Notify parent component that login is successful
      navigate('/bookingForm'); // Navigate to bookingForm after successful login
    } catch (error) {
      console.error('error', error.response);
    }
  };

  return (
    <Container className="login-container">
      <Row className="justify-content-center">
       
          <div className="login-form">
            <h2 className="text-center">Login</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>

              <Button variant="primary" type="submit" block>
                Login
              </Button>
            </Form>
            <div className="text-center mt-3">
              <p>Dont have an account? <Link to="/register">Click here to register</Link></p>
            </div>
          </div>
      </Row>
    </Container>
  );
};

export default Login;
