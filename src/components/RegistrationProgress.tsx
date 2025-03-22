
import React from 'react';

interface RegistrationProgressProps {
  currentStep: number;
  totalSteps: number;
}

const RegistrationProgress: React.FC<RegistrationProgressProps> = ({ currentStep, totalSteps }) => {
  // Generate steps array
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);
  
  // Step labels
  const stepLabels = [
    'Datos Personales',
    'Fecha y Hora',
    'Resumen',
    'Finalizar'
  ];
  
  return (
    <div className="mb-8">
      <div className="w-full relative">
        {/* Progress bar */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-0.5 bg-muted"></div>
        <div 
          className="absolute top-1/2 left-0 -translate-y-1/2 h-0.5 bg-primary transition-all duration-500"
          style={{ width: `${(currentStep - 1) / (totalSteps - 1) * 100}%` }}
        ></div>
        
        {/* Step markers */}
        <div className="relative flex justify-between">
          {steps.map((step) => (
            <div key={step} className="flex flex-col items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 z-10 
                  ${step < currentStep 
                    ? 'bg-primary text-white shadow-md' 
                    : step === currentStep 
                      ? 'bg-white border-2 border-primary text-primary' 
                      : 'bg-white border border-muted text-muted-foreground'
                  }`}
              >
                {step < currentStep ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                ) : (
                  <span className="text-sm">{step}</span>
                )}
              </div>
              
              {/* Step label */}
              {stepLabels[step - 1] && (
                <span 
                  className={`text-xs mt-2 font-medium transition-colors duration-300
                    ${step <= currentStep ? 'text-primary' : 'text-muted-foreground'}`}
                >
                  {stepLabels[step - 1]}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RegistrationProgress;
