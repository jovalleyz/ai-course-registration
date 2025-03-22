
import React, { useState, useEffect } from 'react';
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
  receipt: File | null;
}

const initialFormData: FormData = {
  name: '',
  phone: '',
  email: '',
  classType: 'individual',
  selectedDate: null,
  selectedTime: null,
  receipt: null,
};

// EmailJS configuration
const EMAILJS_USER_ID = 'YbpuzhrezlL8aNkyI';
const EMAILJS_SERVICE_ID = 'service_6hvm7jl';
const EMAILJS_TEMPLATE_ID = 'template_btf0gpl';

const Index = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const totalSteps = 5;

  // Load EmailJS SDK
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.emailjs.com/sdk/2.3.2/email.min.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      // Initialize EmailJS
      if ((window as any).emailjs) {
        (window as any).emailjs.init(EMAILJS_USER_ID);
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

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

  // Handle file upload
  const handleFileUpload = (file: File) => {
    setFormData((prev) => ({
      ...prev,
      receipt: file,
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

  // Submit registration
  const submitRegistration = async () => {
    if (!formData.receipt) {
      toast.error('Por favor, suba el comprobante de pago');
      return;
    }

    setIsProcessing(true);

    try {
      // Convert file to base64
      const base64File = await fileToBase64(formData.receipt);

      // Prepare template parameters
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        telefono: formData.phone,
        tipo_clase: formData.classType === 'individual' ? 'Individual' : 'Grupal',
        fecha: formatDate(formData.selectedDate),
        hora: formData.selectedTime,
        comprobante: base64File,
        instructor_email: 'jvalle@ovm-consulting.com',
      };

      // Send email
      if ((window as any).emailjs) {
        await (window as any).emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          templateParams
        );

        console.log('Email sent successfully');
        
        // Simulate processing time
        setTimeout(() => {
          setIsProcessing(false);
          setCurrentStep(totalSteps);
        }, 3000);
      } else {
        throw new Error('EmailJS not loaded');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setIsProcessing(false);
      toast.error('Error al enviar el registro. Por favor, intente nuevamente.');
    }
  };

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Navigate to next step
  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      if (currentStep === 4) {
        submitRegistration();
      } else {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  // Navigate to previous step
  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
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
            onFileUpload={handleFileUpload}
            onNext={goToNextStep}
            onBack={goToPreviousStep}
          />
        );
      case 5:
        return <RegistrationComplete />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      <div className="container max-w-4xl mx-auto px-4 py-12 flex-grow">
        <div className="text-center mb-10">
          <div className="text-sm font-medium text-primary mb-2">Formulario de Registro</div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Curso de Uso de Inteligencia Artificial</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Complete el formulario a continuación para registrarse en nuestro curso de IA
          </p>
        </div>
        
        {currentStep < totalSteps && (
          <RegistrationProgress currentStep={currentStep} totalSteps={totalSteps - 1} />
        )}
        
        <div className="max-w-lg mx-auto">
          {renderFormStep()}
        </div>
      </div>
      
      <ContactFooter />
    </div>
  );
};

export default Index;
