// src/components/AdminPage.jsx
import React, { useState, useEffect } from 'react';
import axios from '../axios';// Use the custom axios instance

const AdminPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newMechanic, setNewMechanic] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const appointmentsResponse = await axios.get('/appointments/');
        const mechanicsResponse = await axios.get('/mechanics/');
        setAppointments(appointmentsResponse.data);
        setMechanics(mechanicsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleEditClick = (appointment) => {
    setSelectedAppointment(appointment);
    setNewDate(appointment.appointment_date);
    setNewMechanic(appointment.mechanic.id);
  };

  const handleSaveClick = async () => {
    try {
      const updatedAppointment = {
        appointment_date: newDate, // Already in local format
        mechanic: newMechanic,
      };

      const response = await axios.put(
        `/appointments/${selectedAppointment.id}/update/`,
        updatedAppointment
      );

      const updatedAppointments = appointments.map((appointment) =>
        appointment.id === selectedAppointment.id ? response.data : appointment
      );

      setAppointments(updatedAppointments);
      setSelectedAppointment(null); // Close form after save
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  return (
    <div>
      <h2>Admin Panel - Appointment Management</h2>

      <table>
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Phone Number</th>
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
              <td>{appointment.appointment_date}</td>
              <td>
                {
                  mechanics.find((mechanic) => mechanic.id === appointment.mechanic)
                    ?.name || 'N/A'
                }
              </td>
              <td>
                <button onClick={() => handleEditClick(appointment)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedAppointment && (
        <div>
          <h3>Edit Appointment</h3>
          <form>
            <label>
              Appointment Date:
              <input
                type="datetime-local"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
              />
            </label>
            <br />
            <label>
              Mechanic:
              <select
                value={newMechanic}
                onChange={(e) => setNewMechanic(e.target.value)}
              >
                {mechanics.map((mechanic) => (
                  <option key={mechanic.id} value={mechanic.id}>
                    {mechanic.name}
                  </option>
                ))}
              </select>
            </label>
            <br />
            <button type="button" onClick={handleSaveClick}>
              Save Changes
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
