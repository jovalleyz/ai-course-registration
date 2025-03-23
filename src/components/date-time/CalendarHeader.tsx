
import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface CalendarHeaderProps {
  currentMonth: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

const monthsOfYear = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ 
  currentMonth, 
  onPreviousMonth, 
  onNextMonth 
}) => {
  return (
    <div className="calendar-header flex justify-between items-center bg-primary text-white p-4 rounded-t-lg">
      <button 
        onClick={onPreviousMonth}
        className="p-1 rounded-full hover:bg-white/20 transition-colors"
        aria-label="Previous month"
      >
        <ArrowLeft size={18} />
      </button>
      <h2 className="text-lg font-medium">
        {monthsOfYear[currentMonth.getMonth()]} {currentMonth.getFullYear()}
      </h2>
      <button 
        onClick={onNextMonth}
        className="p-1 rounded-full hover:bg-white/20 transition-colors"
        aria-label="Next month"
      >
        <ArrowRight size={18} />
      </button>
    </div>
  );
};

export default CalendarHeader;
