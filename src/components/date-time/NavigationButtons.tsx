
import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavigationButtonsProps {
  onNext: () => void;
  onBack: () => void;
  isNextDisabled: boolean;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({ 
  onNext, 
  onBack, 
  isNextDisabled 
}) => {
  return (
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
        disabled={isNextDisabled}
        className="flex-1 flex items-center justify-center gap-2 py-6 rounded-lg glass-button disabled:opacity-70"
      >
        Continuar <ArrowRight size={18} />
      </Button>
    </div>
  );
};

export default NavigationButtons;
