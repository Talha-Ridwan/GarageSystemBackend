// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import AppointmentForm from './components/AppointmentForm';
import AdminPanel from './components/AdminPanel';

const App = () => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  return (
    <Router>
      <Navbar setIsAdminLoggedIn={setIsAdminLoggedIn} />

      <Routes>
        <Route path="/" element={<AppointmentForm />} />
        <Route
          path="/admin"
          element={isAdminLoggedIn ? <AdminPanel /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
