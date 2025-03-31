/**
 * 
 * Calendar Heatmap Component
 *
 * @author Maja Bosy
 * Student ID: W20037161
 * 
*/

import React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

// HeatmapCalendar functional component
const HeatmapCalendar = ({ diaryData, onDayClick }) => {
  // Formatting diary data into events
  const events = diaryData.map(entry => ({
    date: new Date(entry.date), 
    count: entry.power,
  }));

  // Rendering HeatmapCalendar component
  return (
    <div className="heatmap-calendar-container" style={{ background: '#f8f8f8', padding: '30px' }}>
      <CalendarHeatmap
        startDate={new Date(new Date().getFullYear(), 0, 1)} 
        endDate={new Date()} 
        values={events}
        onClick={(value) => onDayClick(new Date(value.date))}
        showWeekdayLabels={true}
        weekdayLabels={['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']}
        monthLabels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']}
        tooltipDataAttrs={value => {
          return {
            'data-tip': `${value.date}: ${value.count} events`,
          };
        }}
        gutterSize={2} 
        horizontal={true} 
        classForValue={(value) => {
          if (!value) {
            return 'color-empty';
          }
          return `color-strength-${value.count}`;
        }}
        rectSize={6} 
        fontSize={8} 
      />
    </div>
  );
};
export default HeatmapCalendar;
