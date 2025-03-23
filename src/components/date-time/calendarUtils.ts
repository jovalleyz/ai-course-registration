
// Time slot configurations
export const individualTimeSlots = {
  weekday: ['9:00–10:00', '10:00–11:00', '11:00–12:00', '3:00–4:00', '4:00–5:00', '5:00–6:00', '6:00–7:00', '7:00–8:00'],
  saturday: ['9:30–10:30', '10:30–11:30', '11:30–12:30']
};

export const groupTimeSlots = ['6:00–7:30', '7:30–9:00'];

// Determine if a date should be disabled based on class type, past dates, and future month limits
export const isDateDisabled = (date: Date, today: Date, classType: 'individual' | 'group'): boolean => {
  if (date < today) return true;
  
  // Allow selection for current month and next 3 months
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  maxDate.setDate(maxDate.getDate() + 1); // Include the full last day
  if (date > maxDate) return true;
  
  const dayOfWeek = date.getDay();
  
  if (classType === 'individual') {
    // Individual classes: Monday to Saturday (1-6)
    return dayOfWeek === 0; // Only Sunday is disabled
  } else {
    // Group classes: Wednesday, Friday, and Saturday (3, 5, 6)
    return !(dayOfWeek === 3 || dayOfWeek === 5 || dayOfWeek === 6);
  }
};

// Generate calendar days for the current month
export const generateCalendarDays = (
  currentMonth: Date, 
  classType: 'individual' | 'group'
): Array<{ date: Date; disabled: boolean }> => {
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
    const isDisabled = isDateDisabled(date, today, classType);
    
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
  
  return days;
};

// Get available time slots based on selected date and class type
export const getAvailableTimeSlots = (
  selectedDate: Date | null,
  classType: 'individual' | 'group'
): string[] => {
  if (!selectedDate) {
    return [];
  }
  
  const dayOfWeek = selectedDate.getDay();
  
  if (classType === 'individual') {
    // For individual classes
    if (dayOfWeek === 6) { // Saturday
      return individualTimeSlots.saturday;
    } else { // Weekdays
      return individualTimeSlots.weekday;
    }
  } else {
    // For group classes (only Wednesday, Friday, Saturday)
    if (dayOfWeek === 3 || dayOfWeek === 5 || dayOfWeek === 6) {
      return groupTimeSlots;
    } else {
      return [];
    }
  }
};

// Generate PDF summary of registration
export const generateSummaryData = (formData: {
  name: string;
  phone: string;
  email: string;
  classType: 'individual' | 'group';
  selectedDate: Date | null;
  selectedTime: string | null;
}): string => {
  const { name, phone, email, classType, selectedDate, selectedTime } = formData;
  
  const formatDate = (date: Date | null): string => {
    if (!date) return 'No seleccionada';
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  const summaryText = `
RESUMEN DE REGISTRO
===================

DATOS DEL ALUMNO
-----------------
Nombre: ${name}
Teléfono: ${phone}
Correo: ${email}

DETALLES DE LA CLASE
-------------------
Curso: Uso de Inteligencia Artificial
Tipo de Clase: ${classType === 'individual' ? 'Individual' : 'Grupal'}
Fecha: ${formatDate(selectedDate)}
Horario: ${selectedTime || 'No seleccionado'}

INFORMACIÓN DE PAGO
------------------
Banco: BHD
Beneficiario: Jonathan Valle
Cédula: 402 434 5432 5
Cuenta de Ahorro: 207 923 200 15
Monto: 1,200 pesos dominicanos

Por favor, envíe el comprobante de pago a:
Email: jvalle@ovm-consulting.com
WhatsApp: +1 829 534 1802

Gracias por su registro.
  `.trim();
  
  return summaryText;
};
