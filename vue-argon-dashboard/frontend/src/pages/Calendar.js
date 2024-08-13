// pages/Calendar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar'; // Make sure to install this package or use your own calendar component
import 'react-calendar/dist/Calendar.css'; // If using the react-calendar package

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
        // You can customize the calendar here
      />
    </div>
  );
};

export default CalendarPage;
