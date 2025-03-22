
import React, { useEffect } from 'react';
import { Check, Calendar, Link as LinkIcon, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface RegistrationCompleteProps {
  zoomLink?: string;
}

const RegistrationComplete: React.FC<RegistrationCompleteProps> = ({ zoomLink }) => {
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

  const handleCopyZoomLink = () => {
    if (zoomLink) {
      navigator.clipboard.writeText(zoomLink);
      toast.success('Enlace de Zoom copiado al portapapeles');
    }
  };

  const addToCalendar = () => {
    toast.success('Recordatorio añadido a su calendario');
  };

  return (
    <div className="text-center py-8 animate-scale-in">
      <div className="flex flex-col items-center justify-center">
        <div 
          id="completion-checkmark"
          className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mb-6 transform scale-0 transition-transform duration-700 shadow-lg relative"
        >
          <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping"></div>
          <Check size={36} className="text-white" />
        </div>
        
        <h2 className="text-2xl font-semibold mb-3 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          ¡Registro Completado!
        </h2>
        
        <p className="text-muted-foreground mb-6 max-w-md">
          Se ha enviado un correo electrónico con los detalles de su registro y el enlace de Zoom para la clase.
        </p>
        
        {zoomLink && (
          <div className="glass-card p-5 w-full max-w-md mb-6 hover:shadow-md transition-shadow">
            <h3 className="font-medium mb-2 flex items-center justify-center gap-2">
              <LinkIcon size={18} className="text-primary" />
              Enlace de Zoom
            </h3>
            <div className="flex items-center gap-2 bg-muted p-3 rounded-md">
              <div className="text-sm truncate flex-1 text-muted-foreground">
                {zoomLink}
              </div>
              <Button 
                size="sm" 
                variant="ghost"
                onClick={handleCopyZoomLink}
                className="flex-shrink-0"
              >
                <Copy size={16} />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Guarde este enlace para acceder a su clase
            </p>
          </div>
        )}
        
        <div className="glass-card p-6 w-full max-w-md">
          <h3 className="font-medium mb-4">¿Qué sigue?</h3>
          <ol className="space-y-4 text-left">
            <li className="flex items-start gap-3 opacity-0 -translate-y-2 transition-all duration-300 next-step-item">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center mt-0.5">1</span>
              <span>Revise su correo electrónico para confirmar los detalles.</span>
            </li>
            <li className="flex items-start gap-3 opacity-0 -translate-y-2 transition-all duration-300 next-step-item">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center mt-0.5">2</span>
              <div>
                <span>Añada la clase a su calendario.</span>
                <Button 
                  variant="link" 
                  className="text-primary p-0 h-auto text-sm"
                  onClick={addToCalendar}
                >
                  <Calendar size={14} className="mr-1" />
                  Añadir a calendario
                </Button>
              </div>
            </li>
            <li className="flex items-start gap-3 opacity-0 -translate-y-2 transition-all duration-300 next-step-item">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center mt-0.5">3</span>
              <span>Prepare cualquier pregunta que tenga para la clase.</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default RegistrationComplete;
