import React, { useState, useEffect, useRef } from "react";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const isLeapYear = (year) => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

const getFebDays = (year) => {
  return isLeapYear(year) ? 29 : 28;
};

const Calendar = ({ onDateSelect }) => {
  const currentDate = new Date();
  const [currYear, setCurrYear] = useState(currentDate.getFullYear() - 8);
  const [currMonth, setCurrMonth] = useState(currentDate.getMonth());
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const calendarRef = useRef(null);

  const daysOfMonth = [
    31,
    getFebDays(currYear),
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];

  // const generateDays = () => {
  //   const days = [];
  //   const firstDay = new Date(currYear, currMonth, 1).getDay();

  //   for (let i = 0; i < daysOfMonth[currMonth] + firstDay; i++) {
  //     if (i >= firstDay) {
  //       const day = i - firstDay + 1;
  //       days.push(
  //         <div
  //           key={i}
  //           className={`calendar-day-hover ${
  //             day === currentDate.getDate() &&
  //             currYear === currentDate.getFullYear() &&
  //             currMonth === currentDate.getMonth()
  //               ? "curr-date"
  //               : ""
  //           }`}
  //           onClick={() => {
  //             const date = `${currYear}-${currMonth + 1}-${day}`;
  //             setSelectedDate(date);
  //             onDateSelect(date); // Call the parent-provided callback
  //           }}
  //         >
  //           {day}
  //           <span></span>
  //           <span></span>
  //           <span></span>
  //           <span></span>
  //         </div>
  //       );
  //     } else {
  //       days.push(<div key={i}></div>);
  //     }
  //   }
  //   return days;
  // };
  const closePickers = () => {
    setShowMonthPicker(false);
    setShowYearPicker(false);
  };

  const handleClickOutside = (event) => {
    if (calendarRef.current && !calendarRef.current.contains(event.target)) {
      closePickers();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const prevMonth = () => {
    if (currMonth > 0) {
      setCurrMonth(currMonth - 1);
    } else if (currYear > currYear - 1) {
      setCurrYear(currYear - 1);
      setCurrMonth(11);
    }
  };

  const nextMonth = () => {
    if (currMonth < 11) {
      setCurrMonth(currMonth + 1);
    } else if (currYear < currentDate.getFullYear()) {
      setCurrYear(currYear + 1);
      setCurrMonth(0);
    }
  };
  const minAllowedYear = currentDate.getFullYear() - 8; // Minimum year for someone to be 8 years old
  const minAllowedMonth = currentDate.getMonth(); // Minimum month for someone to be 8 years old

  // Disable "Next" button logic
  const isNextDisabled =
    currYear === minAllowedYear && currMonth === minAllowedMonth;
  const minDate = new Date(
    currentDate.getFullYear() - 8,
    currentDate.getMonth(),
    currentDate.getDate()
  ); // Date 8 years ago
  const isDateDisabled = (date) => {
    return selectedDate < minDate || selectedDate > currentDate; // Disable dates outside the range
  };
  const generateDays = () => {
    const days = [];
    const firstDay = new Date(currYear, currMonth, 1).getDay();
    const currentDate = new Date(); // Current date
    const minDate = new Date(
      currentDate.getFullYear() - 8,
      currentDate.getMonth(),
      currentDate.getDate()
    ); // 8 years ago

    for (let i = 0; i < daysOfMonth[currMonth] + firstDay; i++) {
      if (i >= firstDay) {
        const day = i - firstDay + 1;
        const dayDate = new Date(currYear, currMonth, day); // The date of this day in the calendar
        const isDisabled = dayDate > minDate || dayDate > currentDate; // Check if the date is outside the range

        days.push(
          <div
            key={i}
            className={`calendar-day-hover ${
              day === currentDate.getDate() &&
              currYear === currentDate.getFullYear() &&
              currMonth === currentDate.getMonth()
                ? "curr-date"
                : ""
            } ${isDisabled ? "disabled-date" : ""}`} // Add a disabled class for styling
            onClick={() => {
              if (!isDisabled) {
                const date = `${currYear}-${currMonth + 1}-${day}`;
                setSelectedDate(date);
                onDateSelect(date); // Call the parent-provided callback
              }
            }}
          >
            {day}
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        );
      } else {
        days.push(<div key={i}></div>);
      }
    }
    return days;
  };

  const handleYearClick = (year) => {
    setCurrYear(year);
    closePickers();
  };

  const handleMonthClick = (month) => {
    setCurrMonth(month);
    closePickers();
  };

  const startYear = currentDate.getFullYear() - 100;
  const endYear = currentDate.getFullYear() - 8; // 100 years back from current year
  const years = [];

  for (let year = startYear; year <= endYear; year++) {
    years.push(year);
  }
  console.log(currYear, currMonth);

  return (
    <div className="calendar" ref={calendarRef}>
      <div className="calendar-header">
        <button className="year-change" onClick={prevMonth}>
          &lt;
        </button>
        <span
          className="month-picker"
          onClick={() => setShowMonthPicker(!showMonthPicker)}
        >
          {monthNames[currMonth]}
        </span>
        <span
          className="year-picker-toggle"
          onClick={() => setShowYearPicker(!showYearPicker)}
        >
          {currYear}
        </span>
        <button
          className="year-change"
          onClick={nextMonth}
          disabled={isNextDisabled}
        >
          &gt;
        </button>
      </div>

      {showMonthPicker && (
        <div className="month-grid">
          {monthNames.map((month, index) => (
            <div
              key={index}
              className="month-item"
              onClick={() => handleMonthClick(index)}
            >
              {month}
            </div>
          ))}
        </div>
      )}

      {showYearPicker && (
        <div className="year-picker-list">
          {years.map((year) => (
            <div
              key={year}
              className="year-item"
              onClick={() => handleYearClick(year)}
            >
              {year}
            </div>
          ))}
        </div>
      )}

      {!showMonthPicker && !showYearPicker && (
        <div className="calendar-body">
          <div className="calendar-week-day">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>
          <div className="calendar-days">{generateDays()}</div>
        </div>
      )}

      <style jsx>{`
        .calendar {
          height: max-content;
          width: max-content;
          background-color: hsl(0, 0%, 98%);
          border-radius: 3px;
          border: 1px solid hsl(268, 82%, 27%);
          padding: 20px;
          max-width: 400px;
          font-family: "Vidaloka";
          position: relative;
          overflow: hidden;
          box-shadow: rgba(0, 0, 0, 0.56) 0px 10px 30px 10px;
          /* transform: scale(1.25); */
        }

        .calendar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 18px;
          font-weight: 600;
          color: hsl(266, 100%, 13%);
          padding: 10px;
        }

        .calendar-body {
          padding: 10px;
        }

        .calendar-week-day {
          height: 50px;
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          font-weight: 600;
        }

        .calendar-week-day div {
          display: grid;
          place-items: center;
          color: #9ca3af;
        }

        .calendar-days {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 2px;
          color: hsl(266, 100%, 13%);
        }

        .calendar-days div {
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 5px;
          position: relative;
          cursor: pointer;
          animation: to-top 1s forwards;
          /* border-radius: 50%; */
        }

        .calendar-days div span {
          position: absolute;
        }

        .calendar-days div:hover span {
          transition: width 0.2s ease-in-out, height 0.2s ease-in-out;
        }

        .calendar-days div span:nth-child(1),
        .calendar-days div span:nth-child(3) {
          width: 2px;
          height: 0;
          background-color: hsl(268, 82%, 27%);
        }

        .calendar-days div:hover span:nth-child(1),
        .calendar-days div:hover span:nth-child(3) {
          height: 100%;
        }

        .calendar-days div span:nth-child(1) {
          bottom: 0;
          left: 0;
        }

        .calendar-days div span:nth-child(3) {
          top: 0;
          right: 0;
        }

        .calendar-days div span:nth-child(2),
        .calendar-days div span:nth-child(4) {
          width: 0;
          height: 2px;
          background-color: hsl(268, 82%, 27%);
        }

        .calendar-days div:hover span:nth-child(2),
        .calendar-days div:hover span:nth-child(4) {
          width: 100%;
        }

        .calendar-days div span:nth-child(2) {
          top: 0;
          left: 0;
        }

        .calendar-days div span:nth-child(4) {
          bottom: 0;
          right: 0;
        }

        .calendar-days div:hover span:nth-child(2) {
          transition-delay: 0.2s;
        }

        .calendar-days div:hover span:nth-child(3) {
          transition-delay: 0.4s;
        }

        .calendar-days div:hover span:nth-child(4) {
          transition-delay: 0.6s;
        }

        .calendar-days div.curr-date,
        .calendar-days div.curr-date:hover {
          background-color: hsl(41, 100%, 62%);
          color: white;
          border-radius: 50%;
        }

        .calendar-days div.curr-date span {
          display: none;
        }

        .month-picker {
          padding: 5px 10px;
          border-radius: 10px;
          cursor: pointer;
        }
        .year-picker-toggle {
          padding: 5px 10px;
          border-radius: 10px;
          cursor: pointer;
        }
        .disabled-date {
          color: #ccc; /* Gray out the text */
          pointer-events: none; /* Disable clicking */
          opacity: 0.5; /* Add a faded appearance */
          background-color: #f0f0f0; /* Optional: Light background */
          cursor: not-allowed; /* Change cursor to indicate it's disabled */
        }

        .month-picker:hover,
        .year-picker-toggle:hover {
          background-color: white;
        }

        .year-picker {
          display: flex;
          align-items: center;
        }

        .year-change {
          height: 40px;
          width: 40px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          margin: 0 10px;
          cursor: pointer;
          background-color: hsl(266, 100%, 13%);
          color: white;
          border: hsl(266, 100%, 13%);
        }

        .year-change:hover {
          background-color: hsl(268 82% 27%);
          color: hsl(266, 100%, 13%);
          border: hsl(268 82% 27%);
        }

        .calendar-footer {
          padding: 10px;
          display: flex;
          justify-content: flex-end;
          align-items: center;
        }

        .toggle {
          display: flex;
        }

        .toggle span {
          margin-right: 10px;
        }

        .month-list {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          background-color: white;
          padding: 20px;
          grid-template-columns: repeat(3, auto);
          gap: 5px;
          display: grid;
          transform: scale(1.5);
          visibility: hidden;
          pointer-events: none;
        }

        .month-list.show {
          transform: scale(1);
          visibility: visible;
          pointer-events: visible;
          transition: all 0.2s ease-in-out;
        }

        .month-list > div {
          display: grid;
          place-items: center;
        }

        .month-list > div > div {
          width: 100%;
          padding: 5px 20px;
          border-radius: 10px;
          text-align: center;
          cursor: pointer;
          color: hsl(266, 100%, 13%);
        }

        @keyframes to-top {
          0% {
            transform: translateY(100%);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .year-change:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .calendar.date-picker {
          width: 300px;
          padding: 10px;
        }

        .calendar-header {
          font-size: 16px;
          padding: 5px;
        }

        .calendar-days div {
          width: 30px;
          height: 30px;
        }

        .year-picker-toggle {
          cursor: pointer;
        }

        .year-picker-list {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 10px;
          margin-top: 20px;
          padding: 10px;
          cursor: pointer;
          width: auto; /* Allow the list to expand */
          max-height: 300px; /* Limit the height */
          overflow-y: auto; /* Enable vertical scroll */
        }

        .year-item {
          background-color: hsl(266, 100%, 13%);
          border: 1px solid hsl(266, 100%, 13%);
          padding: 5px;
          text-align: center;
          cursor: pointer;
          border-radius: 5px;
          transition: background-color 0.2s ease;
          color: white;
        }

        .year-item:hover {
          background-color: hsl(268, 82%, 27%);
          border: 1px solid hsl(268, 82%, 27%);
          color: white;
        }
        .month-grid {
          display: grid;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-top: 20px;
          padding: 10px;
          cursor: pointer;
        }

        .month-item {
          background-color: hsl(266, 100%, 13%);
          border: 1px solid hsl(266, 100%, 13%);
          padding: 5px;
          text-align: center;
          cursor: pointer;
          border-radius: 5px;
          transition: background-color 0.2s ease;
          color: white;
        }

        .month-item:hover {
          background-color: hsl(268, 82%, 27%);
          border: 1px solid hsl(268, 82%, 27%);
          color: white;
        }
        .relative-container {
          position: relative;
        }

        .calendar-overlay {
          position: absolute;
          top: 100%; /* Position below the input */
          left: 0;
          z-index: 10; /* Ensure it's above other elements */
          background: white; /* Add background for better visibility */
          border: 1px solid #ccc; /* Optional border */
          box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); /* Optional shadow */
          border-radius: 4px; /* Optional rounded corners */
        }
        /* Responsive Styles for Mobile */
        @media (max-width: 768px) {
          .calendar {
            width: 100%; /* Full width for mobile */
            padding: 15px;
          }

          .calendar-header {
            font-size: 18px; /* Smaller header font size */
            padding: 8px;
          }

          .calendar-week-day {
            height: auto;
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            font-size: 12px; /* Smaller font for weekdays */
          }

          .calendar-week-day div {
            display: grid;
            place-items: center;
            color: #9ca3af;
          }

          .calendar-days {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 1px; /* Smaller gap for mobile */
          }

          .calendar-days div {
            width: 40px; /* Adjust day box size */
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 5px;
          }

          .calendar-days div.curr-date,
          .calendar-days div.curr-date:hover {
            width: 35px; /* Smaller active date circle */
            height: 35px;
          }

          .calendar-footer {
            display: none; /* Hide footer on mobile */
          }

          .month-picker,
          .year-picker-toggle {
            padding: 5px;
            font-size: 14px; /* Smaller font size for buttons */
          }

          .year-change {
            width: 30px; /* Smaller year change buttons */
            height: 30px;
            font-size: 18px;
          }

          .month-grid,
          .year-picker-list {
            padding: 0;
            margin-top: 10px;
          }

          .month-item,
          .year-item {
            font-size: 12px; /* Smaller font for months/years */
            padding: 3px 5px;
          }
        }

        /* For small screens like mobile portrait */
        @media (max-width: 480px) {
          .calendar {
            padding: 10px; /* Even less padding */
          }

          .calendar-header {
            font-size: 16px; /* Reduce font size further */
          }

          .calendar-days div {
            width: 35px; /* Further reduce day box size */
            height: 35px;
          }

          .calendar-days div.curr-date,
          .calendar-days div.curr-date:hover {
            width: 30px;
            height: 30px;
          }

          .calendar-week-day div {
            font-size: 10px; /* Even smaller font for weekdays */
          }

          .calendar-body {
            padding: 5px;
          }
        }
      `}</style>
    </div>
  );
};

export default Calendar;
