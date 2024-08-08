import React, { useEffect } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './MainLayout.css';

const MainLayout = ({ isLoggedIn, handleLogout, children }) => {

  useEffect(() => {
    if (isLoggedIn) {
      const verifyToken = async () => {
        try {
          const token = localStorage.getItem('token');
          if (token) {
            await axios.get('/protected-route', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
          }
        } catch (error) {
          if (error.response && error.response.status === 403) {
            // Token expired, try to refresh it
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
              try {
                const response = await axios.post('/refresh-token', { refreshToken });
                const { token: newToken } = response.data;
                localStorage.setItem('token', newToken);
              } catch (refreshError) {
                handleLogout(); // Refresh token also invalid, log out
              }
            } else {
              handleLogout(); // No refresh token, log out
            }
          } else {
            // Handle other errors here
            console.error('An error occurred while verifying the token:', error.message);
          }
        }
      };

      // Verify the token immediately and then every 10 seconds
      verifyToken();
      const intervalId = setInterval(verifyToken, 10000);

      return () => clearInterval(intervalId);
    }
  }, [isLoggedIn, handleLogout]);

  return (
    <div>
      <Navbar className="navbar-custom" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">Currency Mint</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto navbar-nav">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <Nav.Link as={Link} to="/features">Features</Nav.Link>
              <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
              {isLoggedIn ? (
                <>
                  <Nav.Link as={Link} to="/bookingForm">Booking Form</Nav.Link>
                  <Nav.Link as={Link} to="/transactions">Transactions Report</Nav.Link>
                  <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/register">Register</Nav.Link>
                  <Nav.Link as={Link} to="/login">Login</Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <main>{children}</main>

      <footer className="footer-custom text-center py-3 mt-5">
        <Container>
          <p>&copy; 2024 Currency Mint @Michelin. All rights reserved.</p>
        </Container>
      </footer>
    </div>
  );
};

export default MainLayout;
