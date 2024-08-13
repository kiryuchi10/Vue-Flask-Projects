import React from 'react';
import { useParams } from 'react-router-dom';
import './CalendarDatePage.css'; // Optional: import CSS for styling

const CalendarDatePage = () => {
  const { date } = useParams();
  const formattedDate = new Date(date).toDateString(); // Format date for display

  return (
    <div className="calendar-date-page">
      <h2>Date: {formattedDate}</h2>
      <p>TODOs and details for {formattedDate} will be displayed here.</p>
      {/* Add components to add, delete, or modify TODOs */}
    </div>
  );
};

export default CalendarDatePage;
