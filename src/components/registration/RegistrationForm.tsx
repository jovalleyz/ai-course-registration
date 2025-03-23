
import React, { useState } from 'react';
import PersonalInfoForm from '@/components/PersonalInfoForm';
import DateTimeSelection from '@/components/DateTimeSelection';
import RegistrationSummary from '@/components/RegistrationSummary';
import PaymentDetails from '@/components/PaymentDetails';
import RegistrationComplete from '@/components/RegistrationComplete';
import RegistrationProgress from '@/components/RegistrationProgress';
import { toast } from 'sonner';
import { saveRegistration } from '@/lib/supabaseClient';

// Define form data interface
export interface FormData {
  name: string;
  phone: string;
  email: string;
  classType: 'individual' | 'group';
  selectedDate: Date | null;
  selectedTime: string | null;
  registrationId?: string;
}

const initialFormData: FormData = {
  name: '',
  phone: '',
  email: '',
  classType: 'individual',
  selectedDate: null,
  selectedTime: null,
};

interface RegistrationFormProps {
  onProcessingChange?: (isProcessing: boolean) => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onProcessingChange }) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const totalSteps = 5;

  // Handle input changes for personal info
  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    setFormData((prev) => ({
      ...prev,
      selectedDate: date,
    }));
  };

  // Handle time selection
  const handleTimeSelect = (time: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedTime: time,
    }));
  };

  // Complete registration
  const completeRegistration = async () => {
    setIsProcessing(true);
    if (onProcessingChange) {
      onProcessingChange(true);
    }
    
    try {
      // Save registration to Supabase
      const result = await saveRegistration(formData);
      
      if (result.success && result.data) {
        // Store the registration ID if it exists
        setFormData(prev => ({
          ...prev,
          registrationId: result.data[0]?.id
        }));
        
        // Proceed to completion step
        setTimeout(() => {
          setIsProcessing(false);
          setCurrentStep(totalSteps);
          if (onProcessingChange) {
            onProcessingChange(false);
          }
          toast.success('Su registro ha sido completado exitosamente');
        }, 1500);
      } else {
        throw new Error('No se pudo guardar el registro');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setIsProcessing(false);
      if (onProcessingChange) {
        onProcessingChange(false);
      }
      toast.error('Hubo un error al procesar su registro. Por favor, intente nuevamente.');
    }
  };

  // Navigate to next step
  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      if (currentStep === 4) {
        completeRegistration();
      } else {
        setCurrentStep(prevStep => prevStep + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  // Navigate to previous step
  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prevStep => prevStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Render processing state
  const renderProcessingState = () => (
    <div className="flex flex-col items-center justify-center py-12 animate-pulse">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin-slow mb-6"></div>
      <h3 className="text-xl font-medium">Procesando su registro...</h3>
      <p className="text-muted-foreground mt-2">Espere un momento por favor.</p>
    </div>
  );

  // Render form step based on current step
  const renderFormStep = () => {
    if (isProcessing) {
      return renderProcessingState();
    }

    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoForm
            formData={formData}
            onChange={handleInputChange}
            onNext={goToNextStep}
          />
        );
      case 2:
        return (
          <DateTimeSelection
            formData={formData}
            onDateSelect={handleDateSelect}
            onTimeSelect={handleTimeSelect}
            onNext={goToNextStep}
            onBack={goToPreviousStep}
          />
        );
      case 3:
        return (
          <RegistrationSummary
            formData={formData}
            onNext={goToNextStep}
            onBack={goToPreviousStep}
          />
        );
      case 4:
        return (
          <PaymentDetails
            formData={formData}
            onNext={goToNextStep}
            onBack={goToPreviousStep}
          />
        );
      case 5:
        return <RegistrationComplete formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <>
      {currentStep < totalSteps && (
        <RegistrationProgress currentStep={currentStep} totalSteps={totalSteps - 1} />
      )}
      
      <div className="max-w-lg mx-auto glass-card p-6 shadow-lg rounded-xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-100 rounded-full opacity-30 mix-blend-multiply"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-green-100 rounded-full opacity-30 mix-blend-multiply"></div>
        
        {renderFormStep()}
      </div>
    </>
  );
};

export default RegistrationForm;
