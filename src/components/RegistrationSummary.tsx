
import React from 'react';
import { ArrowLeft, ArrowRight, Calendar, Clock, User, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RegistrationSummaryProps {
  formData: {
    name: string;
    phone: string;
    email: string;
    classType: 'individual' | 'group';
    selectedDate: Date | null;
    selectedTime: string | null;
  };
  onNext: () => void;
  onBack: () => void;
}

const RegistrationSummary: React.FC<RegistrationSummaryProps> = ({ formData, onNext, onBack }) => {
  // Format date for display
  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="animate-scale-in">
      <div className="glass-card p-6 mb-8">
        <h3 className="text-lg font-medium text-center mb-6">Resumen de Registro</h3>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-md bg-secondary">
            <User className="text-primary flex-shrink-0" size={20} />
            <div>
              <div className="text-sm text-muted-foreground">Participante</div>
              <div className="font-medium">{formData.name}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 rounded-md bg-secondary">
            <div className="p-1 rounded-full bg-primary text-white flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 8V4H8"></path>
                <rect width="16" height="12" x="4" y="8" rx="2"></rect>
                <path d="M2 14h2"></path>
                <path d="M20 14h2"></path>
                <path d="M15 13v2"></path>
                <path d="M9 13v2"></path>
              </svg>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Curso</div>
              <div className="font-medium">Uso de Inteligencia Artificial</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 rounded-md bg-secondary">
            {formData.classType === 'individual' ? (
              <User className="text-primary flex-shrink-0" size={20} />
            ) : (
              <Users className="text-primary flex-shrink-0" size={20} />
            )}
            <div>
              <div className="text-sm text-muted-foreground">Tipo de Clase</div>
              <div className="font-medium">
                {formData.classType === 'individual' ? 'Individual' : 'Grupal'}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 rounded-md bg-secondary">
            <Calendar className="text-primary flex-shrink-0" size={20} />
            <div>
              <div className="text-sm text-muted-foreground">Fecha</div>
              <div className="font-medium">{formatDate(formData.selectedDate)}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 rounded-md bg-secondary">
            <Clock className="text-primary flex-shrink-0" size={20} />
            <div>
              <div className="text-sm text-muted-foreground">Horario</div>
              <div className="font-medium">{formData.selectedTime}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex gap-3">
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
          className="flex-1 flex items-center justify-center gap-2 py-6 rounded-lg glass-button"
        >
          Continuar <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  );
};

export default RegistrationSummary;
