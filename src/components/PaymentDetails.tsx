
import React from 'react';
import { ArrowLeft, ArrowRight, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface PaymentDetailsProps {
  formData: {
    name: string;
    email: string;
    phone: string;
  };
  onNext: () => void;
  onBack: () => void;
}

const PaymentDetails: React.FC<PaymentDetailsProps> = ({ formData, onNext, onBack }) => {
  const handleCopyEmail = () => {
    navigator.clipboard.writeText('jvalle@ovm-consulting.com');
    toast.success('Correo copiado al portapapeles');
  };

  const handleOpenWhatsApp = () => {
    const message = encodeURIComponent(
      `Hola, soy ${formData.name}. He completado mi registro para el curso de IA y deseo enviar mi comprobante de pago.`
    );
    window.open(`https://wa.me/18295341802?text=${message}`, '_blank');
  };

  return (
    <div className="animate-scale-in">
      <h3 className="text-lg font-medium text-center mb-6">Detalles de Pago</h3>
      
      <div className="glass-card p-5 mb-6 border border-muted">
        <h4 className="font-medium text-center mb-3">Información de Pago</h4>
        
        <div className="bg-secondary p-4 rounded-md space-y-3 mb-6">
          <div className="grid grid-cols-2 gap-1">
            <div className="text-sm text-muted-foreground">Banco:</div>
            <div className="font-medium text-sm">BHD</div>
          </div>
          
          <div className="grid grid-cols-2 gap-1">
            <div className="text-sm text-muted-foreground">Beneficiario:</div>
            <div className="font-medium text-sm">Jonathan Valle</div>
          </div>
          
          <div className="grid grid-cols-2 gap-1">
            <div className="text-sm text-muted-foreground">Cédula:</div>
            <div className="font-medium text-sm">402 434 5432 5</div>
          </div>
          
          <div className="grid grid-cols-2 gap-1">
            <div className="text-sm text-muted-foreground">Cuenta de Ahorro:</div>
            <div className="font-medium text-sm">207 923 200 15</div>
          </div>
          
          <div className="grid grid-cols-2 gap-1">
            <div className="text-sm text-muted-foreground">Monto:</div>
            <div className="font-medium text-sm">1,200 pesos dominicanos</div>
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-md border border-blue-100 mb-4">
          <p className="text-sm text-blue-800 mb-3">
            <strong>Instrucciones:</strong> Para completar su registro, por favor realice el pago y envíe el comprobante a través de las siguientes opciones:
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Mail size={16} className="text-primary" />
              </div>
              <div>
                <div className="text-sm font-medium mb-1">Enviar por correo electrónico</div>
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-white px-2 py-1 rounded border">jvalle@ovm-consulting.com</code>
                  <button 
                    onClick={handleCopyEmail} 
                    className="text-xs text-primary underline"
                  >
                    Copiar
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Phone size={16} className="text-primary" />
              </div>
              <div>
                <div className="text-sm font-medium mb-1">Enviar por WhatsApp</div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-xs"
                  onClick={handleOpenWhatsApp}
                >
                  Abrir WhatsApp (+1 829 534 1802)
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <p className="text-sm text-center text-muted-foreground">
          Una vez recibido su comprobante de pago, recibirá un correo con los detalles de acceso a su clase.
        </p>
      </div>
      
      <div className="flex gap-3">
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
          className="flex-1 flex items-center justify-center gap-2 py-6 rounded-lg glass-button"
        >
          Finalizar Registro <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  );
};

export default PaymentDetails;
