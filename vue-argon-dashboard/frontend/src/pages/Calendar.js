// pages/Calendar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar'; // Make sure this package is installed
import 'react-calendar/dist/Calendar.css'; // Import default styles from react-calendar
import './CalendarDatePage.css'; // Import custom styles

const CalendarPage = () => {
  const navigate = useNavigate();

  const handleDateClick = (date) => {
    const formattedDate = date.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
    navigate(`/calendar/todo/${formattedDate}`);
  };

  return (
    <div>
      <h1>Calendar</h1>
      <Calendar
        onClickDay={handleDateClick}
        // Customizations can be added here if needed
      />
    </div>
  );
};

export default CalendarPage;
