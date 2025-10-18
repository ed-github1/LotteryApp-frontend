import { addMonths, subMonths, startOfMonth, endOfMonth, format, parseISO } from 'date-fns';
import { useState } from 'react';

const FilterTabs = ({ type, setType, startDate, setStartDate, endDate, setEndDate }) => {
  // Parse the date correctly - extract year and month from ISO string to avoid timezone issues
  let currentMonth;
  let currentMonthLabel;
  if (startDate) {
    // Extract year and month from ISO string (e.g., "2025-09-01T00:00:00.000Z")
    const [year, month] = startDate.split('T')[0].split('-').map(Number);
    currentMonth = new Date(year, month - 1, 1); // month - 1 because Date months are 0-based
    currentMonthLabel = `${new Date(year, month - 1).toLocaleString('default', { month: 'long' })} ${year}`;

  } else {
    currentMonth = new Date();
    currentMonthLabel = format(currentMonth, 'MMMM yyyy');
  }

  const goToPreviousMonth = () => {
    const prevMonth = subMonths(currentMonth, 1);
    const start = startOfMonth(prevMonth);
    const end = endOfMonth(prevMonth);
    
    console.log('Setting dates for previous month:', {
      month: format(prevMonth, 'MMMM yyyy'),
      startDate: start.toISOString(),
      endDate: end.toISOString()
    });
    
    // Convert to ISO strings to match your hook's format
    setStartDate(start.toISOString()); // <-- Add .toISOString()
    setEndDate(end.toISOString());     // <-- Add .toISOString()
    setType('month');
  };

  const goToNextMonth = () => {
    const nextMonth = addMonths(currentMonth, 1);
    const today = new Date();
    
    // Don't allow going beyond current month
    if (nextMonth <= today) {
      const start = startOfMonth(nextMonth);
      const end = endOfMonth(nextMonth);
      
      // Convert to ISO strings to match your hook's format
      setStartDate(start.toISOString()); // <-- Add .toISOString()
      setEndDate(end.toISOString());     // <-- Add .toISOString()
      setType('month');
    }
  };

  const canGoNext = addMonths(currentMonth, 1) <= new Date();

  return (
    <div className="bg-white/5 border-b border-white/10 px-6 py-3">
      <div className="flex items-center justify-center gap-6">
        <button
          onClick={goToPreviousMonth}
          className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors"
          title="Previous Month"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <h3 className="text-white text-base font-medium min-w-[140px] text-center">
          {currentMonthLabel}
        </h3>

        <button
          onClick={goToNextMonth}
          disabled={!canGoNext}
          className={`p-1.5 rounded transition-colors ${
            canGoNext 
              ? 'text-white/70 hover:text-white hover:bg-white/10' 
              : 'text-white/30 cursor-not-allowed'
          }`}
          title="Next Month"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default FilterTabs;