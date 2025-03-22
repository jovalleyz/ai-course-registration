
import React, { useEffect } from 'react';
import { Check, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface RegistrationCompleteProps {
  formData: {
    name: string;
    email: string;
    phone: string;
  }
}

const RegistrationComplete: React.FC<RegistrationCompleteProps> = ({ formData }) => {
  // Animation effect when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      const checkmark = document.getElementById('completion-checkmark');
      if (checkmark) {
        checkmark.classList.add('scale-100');
      }
      
      const stepsElements = document.querySelectorAll('.next-step-item');
      stepsElements.forEach((el, index) => {
        setTimeout(() => {
          el.classList.add('opacity-100', 'translate-y-0');
        }, 300 + (index * 150));
      });
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  const addToCalendar = () => {
    toast.success('Recordatorio añadido a su calendario');
  };

  return (
    <div className="text-center py-8 animate-scale-in">
      <div className="flex flex-col items-center justify-center">
        <div 
          id="completion-checkmark"
          className="w-20 h-20 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mb-6 transform scale-0 transition-transform duration-700 shadow-lg relative"
        >
          <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping"></div>
          <Check size={36} className="text-white" />
        </div>
        
        <h2 className="text-2xl font-semibold mb-3 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          ¡Registro Completado!
        </h2>
        
        <p className="text-muted-foreground mb-6 max-w-md">
          Hemos recibido su solicitud de registro para el curso de Inteligencia Artificial.
        </p>
        
        <div className="glass-card p-6 w-full max-w-md border border-muted/60">
          <h3 className="font-medium mb-4 text-primary">¿Qué sigue?</h3>
          <ol className="space-y-4 text-left">
            <li className="flex items-start gap-3 opacity-0 -translate-y-2 transition-all duration-300 next-step-item">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center mt-0.5">1</span>
              <span>Realice el pago según las instrucciones proporcionadas.</span>
            </li>
            <li className="flex items-start gap-3 opacity-0 -translate-y-2 transition-all duration-300 next-step-item">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center mt-0.5">2</span>
              <span>Envíe el comprobante de pago por correo electrónico a <strong>jvalle@ovm-consulting.com</strong> o por WhatsApp al <strong>+1 829 534 1802</strong>.</span>
            </li>
            <li className="flex items-start gap-3 opacity-0 -translate-y-2 transition-all duration-300 next-step-item">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center mt-0.5">3</span>
              <span>Recibirá un correo con el enlace de Zoom para acceder a su clase.</span>
            </li>
            <li className="flex items-start gap-3 opacity-0 -translate-y-2 transition-all duration-300 next-step-item">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center mt-0.5">4</span>
              <div>
                <span>Prepare cualquier pregunta que tenga para la clase.</span>
                <Button 
                  variant="link" 
                  className="text-primary p-0 h-auto text-sm mt-1"
                  onClick={addToCalendar}
                >
                  <Calendar size={14} className="mr-1" />
                  Añadir recordatorio al calendario
                </Button>
              </div>
            </li>
          </ol>
        </div>
        
        <div className="mt-8 text-sm text-muted-foreground animate-fade-in delay-500">
          <p>Se ha enviado un resumen de su registro a <strong>{formData.email}</strong></p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationComplete;
