
import React, { useState, useEffect } from 'react';
import CalendarHeader from './date-time/CalendarHeader';
import CalendarGrid from './date-time/CalendarGrid';
import TimeSlotsGrid from './date-time/TimeSlotsGrid';
import NavigationButtons from './date-time/NavigationButtons';
import DownloadSummary from './date-time/DownloadSummary';
import { generateCalendarDays, getAvailableTimeSlots } from './date-time/calendarUtils';

interface DateTimeSelectionProps {
  formData: {
    classType: 'individual' | 'group';
    selectedDate: Date | null;
    selectedTime: string | null;
    name: string;
    phone: string;
    email: string;
  };
  onDateSelect: (date: Date) => void;
  onTimeSelect: (time: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const DateTimeSelection: React.FC<DateTimeSelectionProps> = ({ 
  formData, onDateSelect, onTimeSelect, onNext, onBack 
}) => {
  // Initialize currentMonth to the current month or to the month of the selectedDate if it exists
  const [currentMonth, setCurrentMonth] = useState(() => {
    if (formData.selectedDate) {
      return new Date(
        formData.selectedDate.getFullYear(),
        formData.selectedDate.getMonth(),
        1
      );
    }
    return new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  });
  
  const [calendarDays, setCalendarDays] = useState<Array<{ date: Date; disabled: boolean }>>([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);

  // Generate calendar days when current month or class type changes
  useEffect(() => {
    const days = generateCalendarDays(currentMonth, formData.classType);
    setCalendarDays(days);
  }, [currentMonth, formData.classType]);

  // Update available time slots when date changes
  useEffect(() => {
    const timeSlots = getAvailableTimeSlots(formData.selectedDate, formData.classType);
    setAvailableTimeSlots(timeSlots);
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
          <CalendarHeader 
            currentMonth={currentMonth}
            onPreviousMonth={goToPreviousMonth}
            onNextMonth={goToNextMonth}
          />
          
          <CalendarGrid 
            calendarDays={calendarDays}
            onDateSelect={handleDateSelect}
            isDateSelected={isDateSelected}
          />
        </div>
        
        {formData.selectedDate && (
          <div className="mt-8 animate-fade-in">
            <h3 className="text-md font-medium mb-4">Horarios Disponibles</h3>
            <TimeSlotsGrid 
              availableTimeSlots={availableTimeSlots}
              selectedTime={formData.selectedTime}
              onTimeSelect={onTimeSelect}
            />
          </div>
        )}
        
        <NavigationButtons 
          onNext={onNext}
          onBack={onBack}
          isNextDisabled={!isFormValid}
        />
        
        <DownloadSummary formData={formData} />
      </div>
    </div>
  );
};

export default DateTimeSelection;
