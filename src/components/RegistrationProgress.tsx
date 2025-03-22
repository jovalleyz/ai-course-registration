
import React from 'react';
import { cn } from '@/lib/utils';

interface RegistrationProgressProps {
  currentStep: number;
  totalSteps: number;
}

const RegistrationProgress: React.FC<RegistrationProgressProps> = ({ 
  currentStep, 
  totalSteps 
}) => {
  // Generate steps array
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);
  
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        {steps.map((step) => (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center">
              <div 
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                  step < currentStep 
                    ? "bg-primary text-white" 
                    : step === currentStep 
                      ? "bg-primary text-white ring-4 ring-primary/20" 
                      : "bg-muted text-muted-foreground"
                )}
              >
                {step}
              </div>
              <div className="text-xs mt-1 text-muted-foreground">
                {getStepName(step)}
              </div>
            </div>
            
            {step < totalSteps && (
              <div 
                className={cn(
                  "flex-1 h-0.5",
                  step < currentStep ? "bg-primary" : "bg-muted"
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

// Helper function to get step names
const getStepName = (step: number): string => {
  switch (step) {
    case 1:
      return 'Información';
    case 2:
      return 'Agenda';
    case 3:
      return 'Resumen';
    case 4:
      return 'Pago';
    case 5:
      return 'Completado';
    default:
      return '';
  }
};

export default RegistrationProgress;
