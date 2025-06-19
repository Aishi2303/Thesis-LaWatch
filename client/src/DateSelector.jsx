import React from 'react';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

//Extend dayjs to handle custom date formats
dayjs.extend(customParseFormat);

const DateSelector = ({ availableDates = [], onDateChange }) => {
  //Convert CSV dates (MM/DD/YYYY) to YYYY-MM-DD for comparison
    const parseDate = (dateStr) => {
      return dayjs(dateStr, 'M/D/YYYY', true).format('YYYY-MM-DD'); //Strict parsing
    };

    const disabledDate = (current) => {
      if (!availableDates.length) return false; //Allow all if no dates exist
      const formattedDate = dayjs(current).format('YYYY-MM-DD');
      return !availableDates.map(parseDate).includes(formattedDate);
    };

  return (
    <div className="date-selector" style={{ padding: '10px' }}>
      <DatePicker
        disabledDate={disabledDate}
        onChange={(date) => {
          if (date) {
            //Convert selected date back to MM/DD/YYYY if needed
            const formattedDate = date.format('M/D/YYYY');
            onDateChange(formattedDate);
          } else {
            onDateChange(null);
          }
        }}
        style={{ width: '100%' }}
      />
    </div>
  );
};

export default DateSelector;