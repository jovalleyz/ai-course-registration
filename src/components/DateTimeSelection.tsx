
import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DateTimeSelectionProps {
  formData: {
    classType: 'individual' | 'group';
    selectedDate: Date | null;
    selectedTime: string | null;
  };
  onDateSelect: (date: Date) => void;
  onTimeSelect: (time: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const monthsOfYear = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

// Time slot configurations
const individualTimeSlots = {
  weekday: ['9:00–10:00', '10:00–11:00', '11:00–12:00', '3:00–4:00', '4:00–5:00', '5:00–6:00', '6:00–7:00', '7:00–8:00'],
  saturday: ['9:30–10:30', '10:30–11:30', '11:30–12:30']
};

const groupTimeSlots = ['6:00–7:30', '7:30–9:00'];

const DateTimeSelection: React.FC<DateTimeSelectionProps> = ({ 
  formData, onDateSelect, onTimeSelect, onNext, onBack 
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<Array<{ date: Date; disabled: boolean }>>([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);

  // Generate calendar days for the current month
  useEffect(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Add days from previous month to fill the first row
    const firstDayOfWeek = firstDayOfMonth.getDay();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      days.push({
        date,
        disabled: true,
      });
    }
    
    // Add days of current month
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      const date = new Date(year, month, day);
      const isDisabled = isDateDisabled(date, today, formData.classType);
      
      days.push({
        date,
        disabled: isDisabled,
      });
    }
    
    // Add days from next month to fill the last row
    const lastDayOfWeek = lastDayOfMonth.getDay();
    for (let i = 1; i < 7 - lastDayOfWeek; i++) {
      const date = new Date(year, month + 1, i);
      days.push({
        date,
        disabled: true,
      });
    }
    
    setCalendarDays(days);
  }, [currentMonth, formData.classType]);

  // Determine if a date should be disabled based on class type and past dates
  const isDateDisabled = (date: Date, today: Date, classType: 'individual' | 'group'): boolean => {
    if (date < today) return true;
    
    const dayOfWeek = date.getDay();
    
    if (classType === 'individual') {
      // Individual classes: Monday to Saturday (1-6)
      return dayOfWeek === 0; // Only Sunday is disabled
    } else {
      // Group classes: Wednesday, Friday, and Saturday (3, 5, 6)
      return !(dayOfWeek === 3 || dayOfWeek === 5 || dayOfWeek === 6);
    }
  };

  // Update available time slots when date changes
  useEffect(() => {
    if (!formData.selectedDate) {
      setAvailableTimeSlots([]);
      return;
    }
    
    const dayOfWeek = formData.selectedDate.getDay();
    
    if (formData.classType === 'individual') {
      // For individual classes
      if (dayOfWeek === 6) { // Saturday
        setAvailableTimeSlots(individualTimeSlots.saturday);
      } else { // Weekdays
        setAvailableTimeSlots(individualTimeSlots.weekday);
      }
    } else {
      // For group classes (only Wednesday, Friday, Saturday)
      if (dayOfWeek === 3 || dayOfWeek === 5 || dayOfWeek === 6) {
        setAvailableTimeSlots(groupTimeSlots);
      } else {
        setAvailableTimeSlots([]);
      }
    }
  }, [formData.selectedDate, formData.classType]);

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Handle date selection
  const handleDateSelect = (date: Date, disabled: boolean) => {
    if (disabled) return;
    onDateSelect(date);
    onTimeSelect(null as unknown as string); // Reset time selection when date changes
  };

  // Format date to display
  const formatDate = (date: Date): string => {
    return `${date.getDate()}`;
  };

  // Check if a day is selected
  const isDateSelected = (date: Date): boolean => {
    if (!formData.selectedDate) return false;
    return (
      date.getDate() === formData.selectedDate.getDate() &&
      date.getMonth() === formData.selectedDate.getMonth() &&
      date.getFullYear() === formData.selectedDate.getFullYear()
    );
  };

  // Check if form is valid to proceed
  const isFormValid = formData.selectedDate && formData.selectedTime;

  return (
    <div className="animate-scale-in">
      <div className="space-y-6">
        <div className="calendar-container shadow-md rounded-lg overflow-hidden border border-muted">
          <div className="calendar-header flex justify-between items-center bg-primary text-white p-4 rounded-t-lg">
            <button 
              onClick={goToPreviousMonth}
              className="p-1 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Previous month"
            >
              <ArrowLeft size={18} />
            </button>
            <h2 className="text-lg font-medium">
              {monthsOfYear[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h2>
            <button 
              onClick={goToNextMonth}
              className="p-1 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Next month"
            >
              <ArrowRight size={18} />
            </button>
          </div>
          
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
                  onClick={() => handleDateSelect(day.date, day.disabled)}
                >
                  {formatDate(day.date)}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {formData.selectedDate && (
          <div className="mt-8 animate-fade-in">
            <h3 className="text-md font-medium mb-4">Horarios Disponibles</h3>
            {availableTimeSlots.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {availableTimeSlots.map((time) => (
                  <div
                    key={time}
                    onClick={() => onTimeSelect(time)}
                    className={`
                      p-3 border rounded-md text-center cursor-pointer transition-all
                      ${formData.selectedTime === time 
                        ? 'bg-primary text-white border-primary shadow-md scale-105' 
                        : 'border-gray-200 hover:border-primary/50 hover:bg-primary/5'
                      }
                    `}
                  >
                    {time}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No hay horarios disponibles para la fecha seleccionada.
              </p>
            )}
          </div>
        )}
        
        <div className="flex gap-3 mt-8">
          <Button 
            type="button" 
            onClick={onBack}
            variant="outline"
            className="flex-1 flex items-center justify-center gap-2 py-6 rounded-lg"
          >
            <ArrowLeft size={18} /> Atrás
          </Button>
          
          <Button 
            type="button" 
            onClick={onNext}
            disabled={!isFormValid}
            className="flex-1 flex items-center justify-center gap-2 py-6 rounded-lg glass-button disabled:opacity-70"
          >
            Continuar <ArrowRight size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DateTimeSelection;
