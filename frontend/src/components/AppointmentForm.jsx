import React, { useEffect, useState } from "react";
import axios from '../axios';// Import your axios instance
import './AppointmentForm.css'

const AppointmentForm = () => {
  const [mechanics, setMechanics] = useState([]);
  const [allAppointments, setAllAppointments] = useState([]);
  const [mechanicId, setMechanicId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [registration, setRegistration] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get("api/mechanics/")
      .then((res) => {
        setMechanics(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching mechanics:", err);
        setLoading(false);
      });

    axios.get("api/appointments/")
      .then((res) => setAllAppointments(res.data))
      .catch((err) => console.error("Error fetching appointments:", err));
  }, []);

  const getRemainingSlots = (mechId) => {
    if (!appointmentDate) return 4;

    try {
      const selectedDate = new Date(appointmentDate).toISOString().split("T")[0];

      const count = allAppointments.filter(
        (a) =>
          a.mechanic === mechId &&
          a.appointment_date.split("T")[0] === selectedDate
      ).length;

      return 4 - count;
    } catch (err) {
      return 4;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!appointmentDate || !mechanicId) {
      setMessage("Please select a mechanic and a date.");
      return;
    }

    const remaining = getRemainingSlots(parseInt(mechanicId));
    if (remaining <= 0) {
      setMessage("This mechanic has reached the daily appointment limit.");
      return;
    }

    const data = {
      mechanic: mechanicId,
      customer_name: customerName,
      phone_number: phoneNumber,
      appointment_date: appointmentDate,
      registration: registration,
    };

    setLoading(true);

    axios
      .post("/api/appointments/create/", data) 
      .then((res) => {
        setMessage("Appointment booked successfully!");
        setCustomerName("");
        setPhoneNumber("");
        setAppointmentDate("");
        setRegistration("");
        setMechanicId("");
        setAllAppointments([...allAppointments, res.data]); 
        setLoading(false);
      })
      .catch((err) => {
        setMessage("Error booking appointment.");
        console.error("Error:", err.response || err);
        setLoading(false);
      });
  };

  return (
    <div style={{ maxWidth: 500, margin: "auto" }}>
      <h2>Book an Appointment</h2>
      {message && <p>{message}</p>}
      {loading && <p>Loading...</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Mechanic:</label>
          <select
            value={mechanicId}
            onChange={(e) => setMechanicId(e.target.value)}
            required
          >
            <option value="">Select Mechanic</option>
            {mechanics.map((mech) => {
              const remaining = getRemainingSlots(mech.id);
              return (
                <option key={mech.id} value={mech.id}>
                  {mech.name} ({remaining} slots left)
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <label>Customer Name:</label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Phone Number:</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Appointment Date & Time:</label>
          <input
            type="datetime-local"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Car Registration No:</label>
          <input
            type="text"
            value={registration}
            onChange={(e) => setRegistration(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>Book Appointment</button>
      </form>
    </div>
  );
};

export default AppointmentForm;
