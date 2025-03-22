
import React, { useState, useEffect } from 'react';
import PersonalInfoForm from '@/components/PersonalInfoForm';
import DateTimeSelection from '@/components/DateTimeSelection';
import RegistrationSummary from '@/components/RegistrationSummary';
import PaymentDetails from '@/components/PaymentDetails';
import RegistrationComplete from '@/components/RegistrationComplete';
import RegistrationProgress from '@/components/RegistrationProgress';
import ContactFooter from '@/components/ContactFooter';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

// Define initial form state
interface FormData {
  name: string;
  phone: string;
  email: string;
  classType: 'individual' | 'group';
  selectedDate: Date | null;
  selectedTime: string | null;
  receipt: File | null;
  zoomLink?: string;
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
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailJSReady, setEmailJSReady] = useState(false);
  const totalSteps = 5;

  // Load EmailJS SDK
  useEffect(() => {
    const loadEmailJS = async () => {
      try {
        // Create script element
        const script = document.createElement('script');
        script.src = 'https://cdn.emailjs.com/sdk/2.3.2/email.min.js';
        script.async = true;
        document.body.appendChild(script);

        // Wait for script to load
        script.onload = () => {
          // Initialize EmailJS
          if ((window as any).emailjs) {
            (window as any).emailjs.init(EMAILJS_USER_ID);
            console.log('EmailJS initialized successfully');
            setEmailJSReady(true);
          }
        };

        script.onerror = (error) => {
          console.error('Error loading EmailJS:', error);
          toast.error('No se pudo cargar el servicio de correo. Por favor, recargue la página.');
        };
      } catch (error) {
        console.error('Error setting up EmailJS:', error);
      }
    };

    loadEmailJS();

    return () => {
      // No need to remove the script on unmount as it's needed globally
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

  // Generate Zoom link
  const generateZoomLink = (): string => {
    // Create a semi-realistic Zoom meeting ID (9-11 digits)
    const meetingId = Math.floor(100000000 + Math.random() * 900000000);
    const passcode = Math.floor(1000 + Math.random() * 9000);
    
    return `https://zoom.us/j/${meetingId}?pwd=${passcode}`;
  };

  // Submit registration
  const submitRegistration = async () => {
    if (!formData.receipt) {
      toast.error('Por favor, suba el comprobante de pago');
      return;
    }

    setIsProcessing(true);
    setEmailError(null);

    try {
      // Check if EmailJS is loaded
      if (!emailJSReady || !(window as any).emailjs) {
        throw new Error('El servicio de correo no está disponible. Intente nuevamente.');
      }

      // Generate a zoom link
      const zoomLink = generateZoomLink();
      
      // Convert file to base64
      const base64File = await fileToBase64(formData.receipt);
      
      if (!base64File) {
        throw new Error('Error al procesar el archivo');
      }

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
        zoom_link: zoomLink,
      };

      console.log('Sending email with parameters:', {
        ...templateParams,
        comprobante: 'Base64 file included', // Log without the actual base64 content for brevity
      });

      // Send email
      const response = await (window as any).emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      );

      console.log('Email sent successfully:', response);
      
      // Update form data with zoom link
      setFormData(prev => ({
        ...prev,
        zoomLink: zoomLink
      }));
      
      // Show success toast
      toast.success('Registro completado exitosamente');
      
      // Move to the final step after a short delay
      setTimeout(() => {
        setIsProcessing(false);
        setCurrentStep(totalSteps);
      }, 1500);
    } catch (error) {
      console.error('Error sending email:', error);
      setIsProcessing(false);
      
      // Determine the error message
      let errorMsg = 'Error desconocido';
      if (error instanceof Error) {
        errorMsg = error.message;
      }
      
      // For development/testing purposes, we'll allow moving forward despite the error
      const mockZoomLink = generateZoomLink();
      setFormData(prev => ({
        ...prev,
        zoomLink: mockZoomLink
      }));
      
      // Set error state but also allow proceeding (for demo purposes)
      setEmailError(errorMsg);
      toast.error('Error al enviar el correo. Continuando con el proceso para demostración.');
      
      // In a real application, you might want to retry or provide specific error handling
      // For demo purposes, we'll proceed to the final step anyway after a delay
      setTimeout(() => {
        setCurrentStep(totalSteps);
        setIsProcessing(false);
      }, 2000);
    }
  };

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (reader.result) {
          resolve(reader.result.toString());
        } else {
          reject(new Error('Error al leer el archivo'));
        }
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // Navigate to next step
  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      if (currentStep === 4) {
        submitRegistration();
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

    if (emailError) {
      return (
        <div className="py-6 animate-fade-in">
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>
              {emailError}. Continuando con el proceso para demostración.
            </AlertDescription>
          </Alert>
          
          <button 
            onClick={() => {
              setEmailError(null);
              setCurrentStep(totalSteps); // Move to final step anyway for demo
            }}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Continuar de todos modos
          </button>
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
        return <RegistrationComplete zoomLink={formData.zoomLink} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col animate-fade-in">
      <div className="container max-w-4xl mx-auto px-4 py-12 flex-grow">
        <div className="text-center mb-10">
          <div className="text-sm font-medium text-primary mb-2 animate-pulse-subtle">Formulario de Registro</div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3 relative">
            <span className="bg-gradient-to-r from-primary to-blue-700 bg-clip-text text-transparent">
              Curso de Uso de Inteligencia Artificial
            </span>
            <span className="absolute -top-8 -right-8 w-20 h-20 bg-blue-100 rounded-full opacity-30 blur-3xl"></span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Complete el formulario a continuación para registrarse en nuestro curso de IA
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
