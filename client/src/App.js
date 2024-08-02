import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './components//Register';
import Login from './components/Login';
import UserList from './components/UserList';
//import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import MainLayout from './components/MainLayout';
import BookingForm from './components/BookingForm'
import Transactions from "./components/TransactionReport"
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // Import custom styles
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  // Function to handle login and set isLoggedIn to true
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  // Function to handle logout and set isLoggedIn to false
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('token'); // Clear token from localStorage or session storage
  };

  return (
    <Router>
      <MainLayout isLoggedIn={isLoggedIn} handleLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          {isLoggedIn ? (
            <>
            <Route path="/bookingForm" element={<BookingForm />} />
            <Route path="/transactions" element={<Transactions />} />
            </>
          ) : (
            <>
            <Route path="/bookingForm" element={<Navigate to="/login" />} />
            <Route path="/transactions" element={<Navigate to="/login" />} />
            </>
          )}
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default App;
