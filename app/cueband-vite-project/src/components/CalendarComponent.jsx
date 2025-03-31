/**
 * 
 * Calendar Component
 *
 * @author Maja Bosy
 * Student ID: W20037161
 * 
*/

import React, { useState } from 'react';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

// Component for displaying a big calendar
const BigCalendar = ({ value, onChange }) => {
  // State variable to manage calendar value
  const [calendarValue, setCalendarValue] = useState(value);

  // Function to handle date click event
  const handleDateClick = (date) => {
    setCalendarValue(date);
    onChange(date);
  };

  return (
    <div className="big-clickable-calendar">
      <Calendar
        onChange={handleDateClick}
        value={calendarValue}
        tileClassName="big-clickable-calendar-tile"
      />
      <style jsx>{`
      .big-clickable-calendar {
        width: 100%;
        max-width: 600px; /* Adjust as needed */
        margin: 0 auto;
        padding: 20px;
        box-sizing: border-box;
        font-size: 18px;
      }

      .big-clickable-calendar .react-calendar {
        max-width: 100%;
        border: none;
      }

      .big-clickable-calendar-tile {
        cursor: pointer;
        padding: 10px;
        border-radius: 8px;
        transition: background-color 0.3s ease;
      }

      .big-clickable-calendar-tile:hover {
        background-color: #f0f0f0;
      }

      .big-clickable-calendar .react-calendar__tile--active {
        background-color: #007bff;
        color: #fff;
      }
    `}</style>
    </div>
  );
};

export default BigCalendar;
