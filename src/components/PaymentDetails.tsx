
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Copy, Check, Upload, File, FileText, FileImage } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

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
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const paymentDetails = [
    { label: 'Banco', value: 'BHD' },
    { label: 'Beneficiario', value: 'Jonathan Valle' },
    { label: 'Cédula', value: '402 434 5432 5' },
    { label: 'Número de Cuenta de Ahorro', value: '207 923 200 15' },
    { label: 'Monto a Pagar', value: '1,200 pesos dominicanos' },
  ];

  useEffect(() => {
    // Generate preview for existing file
    if (formData.receipt) {
      generateFilePreview(formData.receipt);
    } else {
      setFilePreview(null);
    }
  }, [formData.receipt]);

  const generateFilePreview = (file: File) => {
    // Only generate previews for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      // For non-images (like PDFs), set to null
      setFilePreview(null);
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.includes('pdf')) return <FileText size={24} className="text-red-500" />;
    if (file.type.includes('image')) return <FileImage size={24} className="text-blue-500" />;
    return <File size={24} className="text-gray-500" />;
  };

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
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/tiff', 'application/pdf'];
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
    generateFilePreview(file);
    toast.success('Comprobante de pago subido correctamente');
  };

  const handleBrowseFiles = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const renderFilePreview = () => {
    if (!formData.receipt) return null;
    
    return (
      <div className="mt-2 w-full">
        {filePreview ? (
          <div className="relative w-full h-32 rounded-md overflow-hidden">
            <img 
              src={filePreview} 
              alt="Vista previa" 
              className="w-full h-full object-contain bg-black/5 rounded-md" 
            />
          </div>
        ) : (
          <div className="flex items-center gap-2 p-3 bg-secondary rounded-md">
            {getFileIcon(formData.receipt)}
            <span className="text-sm font-medium truncate">
              {formData.receipt.name}
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="animate-scale-in">
      <div className="space-y-6">
        <div className="glass-card p-6 mb-6 hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-lg font-medium text-center mb-6">Detalles de Pago</h3>
          
          <div className="space-y-4">
            {paymentDetails.map((detail, index) => (
              <div 
                key={detail.label} 
                className={cn(
                  "flex justify-between items-center p-3 rounded-md bg-secondary transform transition-all duration-300",
                  index % 2 === 0 ? "hover:-translate-y-1" : "hover:translate-y-1"
                )}
              >
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
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
            isDragging ? 'border-primary bg-primary/5 scale-105' : 'border-muted hover:border-primary/50'
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
              {renderFilePreview()}
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
              <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-muted animate-pulse-subtle">
                <Upload className="text-muted-foreground" size={24} />
              </div>
              <div>
                <p className="font-medium">Suba su comprobante de pago</p>
                <p className="text-sm text-muted-foreground mt-1">Arrastre y suelte un archivo, o haga clic en explorar</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Formatos aceptados: JPG, PNG, TIFF, PDF (máx. 5MB)
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handleBrowseFiles}
                className="mt-2 hover:shadow-md transition-shadow duration-300"
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
            className="flex-1 flex items-center justify-center gap-2 py-6 rounded-lg hover:bg-muted transition-colors"
          >
            <ArrowLeft size={18} /> Atrás
          </Button>
          
          <Button 
            type="button" 
            onClick={onNext}
            disabled={!formData.receipt}
            className="flex-1 flex items-center justify-center gap-2 py-6 rounded-lg glass-button disabled:opacity-70 relative overflow-hidden group"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary/0 via-white/10 to-primary/0 transform -translate-x-full animate-shine"></span>
            <span>Continuar</span> <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetails;
