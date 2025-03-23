
import React from 'react';

interface TimeSlotsGridProps {
  availableTimeSlots: string[];
  selectedTime: string | null;
  onTimeSelect: (time: string) => void;
}

const TimeSlotsGrid: React.FC<TimeSlotsGridProps> = ({ 
  availableTimeSlots, 
  selectedTime, 
  onTimeSelect 
}) => {
  if (availableTimeSlots.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-4">
        No hay horarios disponibles para la fecha seleccionada.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {availableTimeSlots.map((time) => (
        <div
          key={time}
          onClick={() => onTimeSelect(time)}
          className={`
            p-3 border rounded-md text-center cursor-pointer transition-all
            ${selectedTime === time 
              ? 'bg-primary text-white border-primary shadow-md scale-105' 
              : 'border-gray-200 hover:border-primary/50 hover:bg-primary/5'
            }
          `}
        >
          {time}
        </div>
      ))}
    </div>
  );
};

export default TimeSlotsGrid;
