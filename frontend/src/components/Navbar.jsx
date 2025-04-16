// src/components/Navbar.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLogin from './AdminLogin';
import axios from '../axios';

const Navbar = ({ setIsAdminLoggedIn }) => {
  const navigate = useNavigate();
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);

  const handleAdminViewChange = (e) => {
    if (e.target.value === 'Admin') {
      setIsLoginModalVisible(true); 
    } else {
      navigate('/'); 
    }
  };

  const handleLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    setIsLoginModalVisible(false); 

    // Delay navigation until after state updates
    setTimeout(() => {
      navigate('/admin'); 
    }, 0);
  };

  const handleLoginFailure = () => {
    setIsAdminLoggedIn(false); 
  };

  return (
    <nav className="navbar">
      <h1>Car Appointment System</h1>
      <select onChange={handleAdminViewChange}>
        <option value="User">User View</option>
        <option value="Admin">Admin View</option>
      </select>

      {isLoginModalVisible && (
        <AdminLogin
          onLoginSuccess={handleLoginSuccess}
          onLoginFailure={handleLoginFailure}
        />
      )}
    </nav>
  );
};

export default Navbar;
