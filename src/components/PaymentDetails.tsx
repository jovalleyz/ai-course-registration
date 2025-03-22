
import React, { useState, useRef } from 'react';
import { ArrowLeft, ArrowRight, Copy, Check, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface PaymentDetailsProps {
  formData: {
    receipt: File | null;
  };
  onFileUpload: (file: File) => void;
  onNext: () => void;
  onBack: () => void;
}

const PaymentDetails: React.FC<PaymentDetailsProps> = ({ formData, onFileUpload, onNext, onBack }) => {
  const [copied, setCopied] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const paymentDetails = [
    { label: 'Banco', value: 'BHD' },
    { label: 'Beneficiario', value: 'Jonathan Valle' },
    { label: 'Cédula', value: '402 434 5432 5' },
    { label: 'Número de Cuenta de Ahorro', value: '207 923 200 15' },
    { label: 'Monto a Pagar', value: '1,200 pesos dominicanos' },
  ];

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    toast.success(`${label} copiado al portapapeles`);
    
    setTimeout(() => {
      setCopied(null);
    }, 2000);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      validateAndUploadFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      validateAndUploadFile(file);
    }
  };

  const validateAndUploadFile = (file: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/tiff', 'application/pdf'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!validTypes.includes(file.type)) {
      toast.error('Formato de archivo no válido. Por favor, suba una imagen (JPG, PNG, TIFF) o PDF.');
      return;
    }
    
    if (file.size > maxSize) {
      toast.error('El archivo es demasiado grande. El tamaño máximo es 5MB.');
      return;
    }
    
    onFileUpload(file);
    toast.success('Comprobante de pago subido correctamente');
  };

  const handleBrowseFiles = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="animate-scale-in">
      <div className="space-y-6">
        <div className="glass-card p-6 mb-6">
          <h3 className="text-lg font-medium text-center mb-6">Detalles de Pago</h3>
          
          <div className="space-y-4">
            {paymentDetails.map((detail) => (
              <div key={detail.label} className="flex justify-between items-center p-3 rounded-md bg-secondary">
                <div>
                  <div className="text-sm text-muted-foreground">{detail.label}</div>
                  <div className="font-medium">{detail.value}</div>
                </div>
                <button
                  onClick={() => handleCopy(detail.value, detail.label)}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                  aria-label={`Copiar ${detail.label}`}
                >
                  {copied === detail.label ? (
                    <Check size={18} className="text-primary" />
                  ) : (
                    <Copy size={18} className="text-muted-foreground" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            accept=".jpg,.jpeg,.png,.tiff,.pdf"
            className="hidden"
          />
          
          {formData.receipt ? (
            <div className="space-y-3">
              <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-primary/10 text-primary">
                <Check size={24} />
              </div>
              <div>
                <p className="font-medium">Comprobante subido correctamente</p>
                <p className="text-sm text-muted-foreground mt-1">{formData.receipt.name}</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleBrowseFiles}
                className="mt-2"
              >
                Cambiar archivo
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-muted">
                <Upload className="text-muted-foreground" size={24} />
              </div>
              <div>
                <p className="font-medium">Suba su comprobante de pago</p>
                <p className="text-sm text-muted-foreground mt-1">Arrastre y suelte un archivo, o haga clic en explorar</p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handleBrowseFiles}
                className="mt-2"
              >
                Explorar archivos
              </Button>
            </div>
          )}
        </div>
        
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
            disabled={!formData.receipt}
            className="flex-1 flex items-center justify-center gap-2 py-6 rounded-lg glass-button disabled:opacity-70"
          >
            Continuar <ArrowRight size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetails;
