import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';


const Dashboard = () => {
  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="content">
          <h2>Welcome to the Dashboard</h2>
          <p>This is your dashboard content.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;