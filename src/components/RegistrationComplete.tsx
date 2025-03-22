
import React, { useEffect } from 'react';
import { Check } from 'lucide-react';

const RegistrationComplete: React.FC = () => {
  // Animation effect when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      const checkmark = document.getElementById('completion-checkmark');
      if (checkmark) {
        checkmark.classList.add('scale-100');
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="text-center py-8 animate-scale-in">
      <div className="flex flex-col items-center justify-center">
        <div 
          id="completion-checkmark"
          className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mb-6 transform scale-0 transition-transform duration-700"
        >
          <Check size={36} className="text-white" />
        </div>
        
        <h2 className="text-2xl font-semibold mb-3">¡Registro Completado!</h2>
        
        <p className="text-muted-foreground mb-6 max-w-md">
          Se ha enviado un correo electrónico con los detalles de su registro y el enlace de Zoom para la clase.
        </p>
        
        <div className="glass-card p-6 w-full max-w-md">
          <h3 className="font-medium mb-3">¿Qué sigue?</h3>
          <ol className="space-y-3 text-left">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center mt-0.5">1</span>
              <span>Revise su correo electrónico para confirmar los detalles.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center mt-0.5">2</span>
              <span>Añada la clase a su calendario.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center mt-0.5">3</span>
              <span>Prepare cualquier pregunta que tenga para la clase.</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default RegistrationComplete;
