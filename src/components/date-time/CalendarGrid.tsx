
import React from 'react';

interface CalendarGridProps {
  calendarDays: Array<{ date: Date; disabled: boolean }>;
  onDateSelect: (date: Date, disabled: boolean) => void;
  isDateSelected: (date: Date) => boolean;
}

const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

const CalendarGrid: React.FC<CalendarGridProps> = ({ 
  calendarDays, 
  onDateSelect, 
  isDateSelected 
}) => {
  // Format date to display
  const formatDate = (date: Date): string => {
    return `${date.getDate()}`;
  };

  return (
    <div className="bg-white p-4 rounded-b-lg">
      <div className="grid grid-cols-7 gap-1">
        {daysOfWeek.map((day, index) => (
          <div key={index} className="text-center text-sm font-medium text-muted-foreground py-2">
            {day}
          </div>
        ))}
        
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`
              aspect-square flex items-center justify-center rounded-md text-sm cursor-pointer transition-all
              ${day.disabled 
                ? 'text-gray-300 cursor-not-allowed' 
                : isDateSelected(day.date)
                  ? 'bg-primary text-white font-medium shadow-md scale-105'
                  : 'hover:bg-primary/10 text-gray-700'
              }
            `}
            onClick={() => onDateSelect(day.date, day.disabled)}
          >
            {formatDate(day.date)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarGrid;
