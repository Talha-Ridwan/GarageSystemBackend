import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = "/"; 

const AdminPanel = () => {
  const [appointments, setAppointments] = useState([]);
  const [mechanics, setMechanics] = useState([]);


  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`/api/appointments/`);
      const data = response.data.map((appointment) => ({
        ...appointment,
        appointment_date: appointment.appointment_date?.slice(0, 16),
      }));
      setAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  // Fetch mechanics
  const fetchMechanics = async () => {
    try {
      const response = await axios.get(`/api/mechanics/`);
      setMechanics(response.data);
    } catch (error) {
      console.error("Error fetching mechanics:", error);
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchMechanics();
  }, []);

  // Handle changes
  const handleDateChange = (e, id) => {
    const value = e.target.value;
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, appointment_date: value } : a))
    );
  };

  const handleMechanicChange = (e, id) => {
    const value = parseInt(e.target.value);
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, mechanic: value } : a))
    );
  };

  const handleSaveClick = async (id) => {
    const appointment = appointments.find((a) => a.id === id);
    const payload = {
      appointment_date: appointment.appointment_date,
      mechanic: appointment.mechanic,
    };

    try {
      await axios.put(`/api/appointments/${id}/update/`, payload);
      alert("Appointment updated!");
      fetchAppointments();
    } catch (err) {
      console.error("Error updating appointment:", err.response?.data || err.message);
      alert("Failed to update appointment.");
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Admin Panel</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Client Name</th>
            <th>Phone</th>
            <th>Car Registration</th>
            <th>Appointment Date</th>
            <th>Mechanic</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.id}>
              <td>{appointment.customer_name}</td>
              <td>{appointment.phone_number}</td>
              <td>{appointment.registration}</td>
              <td>
                <input
                  type="datetime-local"
                  value={appointment.appointment_date || ""}
                  onChange={(e) => handleDateChange(e, appointment.id)}
                />
              </td>
              <td>
                <select
                  value={appointment.mechanic || ""}
                  onChange={(e) => handleMechanicChange(e, appointment.id)}
                >
                  <option value="">Select Mechanic</option>
                  {mechanics.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <button onClick={() => handleSaveClick(appointment.id)}>Save</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;
