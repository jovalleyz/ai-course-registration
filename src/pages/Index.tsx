
import React, { useState } from 'react';
import PersonalInfoForm from '@/components/PersonalInfoForm';
import DateTimeSelection from '@/components/DateTimeSelection';
import RegistrationSummary from '@/components/RegistrationSummary';
import PaymentDetails from '@/components/PaymentDetails';
import RegistrationComplete from '@/components/RegistrationComplete';
import RegistrationProgress from '@/components/RegistrationProgress';
import ContactFooter from '@/components/ContactFooter';
import { toast } from 'sonner';

// Define initial form state
interface FormData {
  name: string;
  phone: string;
  email: string;
  classType: 'individual' | 'group';
  selectedDate: Date | null;
  selectedTime: string | null;
}

const initialFormData: FormData = {
  name: '',
  phone: '',
  email: '',
  classType: 'individual',
  selectedDate: null,
  selectedTime: null,
};

const Index = () => {
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

  // Format date for display
  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Complete registration
  const completeRegistration = () => {
    setIsProcessing(true);
    
    // Simulate processing time
    setTimeout(() => {
      setIsProcessing(false);
      setCurrentStep(totalSteps);
      toast.success('Su registro ha sido completado exitosamente');
    }, 1500);
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

  // Render form step based on current step
  const renderFormStep = () => {
    if (isProcessing) {
      return (
        <div className="flex flex-col items-center justify-center py-12 animate-pulse">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin-slow mb-6"></div>
          <h3 className="text-xl font-medium">Procesando su registro...</h3>
          <p className="text-muted-foreground mt-2">Espere un momento por favor.</p>
        </div>
      );
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col animate-fade-in">
      <div className="container max-w-4xl mx-auto px-4 py-12 flex-grow">
        <div className="text-center mb-10">
          <div className="text-sm font-medium text-primary mb-2 animate-pulse-subtle">
            <span className="text-lg">Formulario de Registro</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3 relative">
            <span className="bg-gradient-to-r from-primary to-blue-700 bg-clip-text text-transparent">
              Curso de Uso de Inteligencia Artificial
            </span>
            <span className="absolute -top-8 -right-8 w-20 h-20 bg-blue-100 rounded-full opacity-30 blur-3xl"></span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Talleres, Charlas, Material didáctico, Nuevas Tendencias
          </p>
        </div>
        
        {currentStep < totalSteps && (
          <RegistrationProgress currentStep={currentStep} totalSteps={totalSteps - 1} />
        )}
        
        <div className="max-w-lg mx-auto glass-card p-6 shadow-lg rounded-xl relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-100 rounded-full opacity-30 mix-blend-multiply"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-green-100 rounded-full opacity-30 mix-blend-multiply"></div>
          
          {renderFormStep()}
        </div>
      </div>
      
      <ContactFooter />
    </div>
  );
};

export default Index;
