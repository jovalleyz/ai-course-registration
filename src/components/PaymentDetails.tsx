
import React, { useState, useRef } from 'react';
import { ArrowLeft, ArrowRight, Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';
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
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Allowed file types
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
  const maxSizeMB = 5;
  
  // Handle file validation
  const validateFile = (file: File): boolean => {
    // Check file type
    if (!allowedTypes.includes(file.type)) {
      setFileError(`Tipo de archivo no permitido. Por favor, suba una imagen o PDF.`);
      return false;
    }
    
    // Check file size (max 5MB)
    if (file.size > maxSizeMB * 1024 * 1024) {
      setFileError(`El archivo es demasiado grande. El tamaño máximo permitido es ${maxSizeMB}MB.`);
      return false;
    }
    
    setFileError(null);
    return true;
  };
  
  // Process uploaded file
  const processFile = (file: File) => {
    if (validateFile(file)) {
      onFileUpload(file);
      
      // Create preview
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFilePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else if (file.type === 'application/pdf') {
        // For PDFs, just show an icon
        setFilePreview('pdf');
      }
      
      toast.success(`${file.name} subido correctamente`);
    }
  };
  
  // Handle drag events
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };
  
  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };
  
  // Trigger file input click
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Remove uploaded file
  const removeFile = () => {
    if (formData.receipt) {
      onFileUpload(null as unknown as File);
      setFilePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      toast.info('Archivo eliminado');
    }
  };
  
  return (
    <div className="animate-scale-in">
      <h3 className="text-lg font-medium text-center mb-6">Comprobante de Pago</h3>
      
      <div className="glass-card p-5 mb-6 border border-muted">
        <h4 className="font-medium text-center mb-3">Detalles de Pago</h4>
        
        <div className="bg-secondary p-4 rounded-md space-y-3 mb-4">
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
      </div>
      
      <div className="mb-8">
        <div className="text-sm font-medium mb-2">Subir Comprobante de Pago<span className="text-red-500">*</span></div>
        
        {formData.receipt ? (
          <div className="bg-secondary p-3 rounded-md mb-3 flex items-center gap-3 animate-fade-in">
            <div className="relative min-w-16 h-16 bg-background rounded overflow-hidden flex items-center justify-center">
              {filePreview ? (
                filePreview === 'pdf' ? (
                  <File size={24} className="text-primary" />
                ) : (
                  <img src={filePreview} alt="Preview" className="w-full h-full object-cover" />
                )
              ) : (
                <File size={24} className="text-primary" />
              )}
            </div>
            
            <div className="flex-grow">
              <div className="flex items-center gap-1 mb-1">
                <CheckCircle size={16} className="text-green-600" />
                <div className="font-medium text-sm truncate">
                  {formData.receipt.name}
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                {(formData.receipt.size / 1024 / 1024).toFixed(2)} MB
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              size="icon"
              onClick={removeFile}
              className="text-muted-foreground hover:text-destructive transition-colors"
            >
              <X size={18} />
            </Button>
          </div>
        ) : (
          <div 
            className={`border-2 border-dashed rounded-md p-6 transition-colors cursor-pointer text-center 
              ${isDragging ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50 hover:bg-secondary'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={triggerFileInput}
          >
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png,.gif,.webp,.pdf"
              className="hidden"
            />
            
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <Upload size={20} className="text-primary" />
              </div>
              <div>
                <div className="font-medium">Haga clic o arrastre un archivo</div>
                <div className="text-sm text-muted-foreground mt-1">
                  JPG, PNG, GIF, WEBP o PDF (máx. {maxSizeMB}MB)
                </div>
              </div>
            </div>
          </div>
        )}
        
        {fileError && (
          <div className="flex items-center gap-2 mt-2 text-destructive animate-fade-in text-sm">
            <AlertCircle size={16} />
            <div>{fileError}</div>
          </div>
        )}
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
          disabled={!formData.receipt}
          className="flex-1 flex items-center justify-center gap-2 py-6 rounded-lg glass-button"
        >
          Finalizar <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  );
};

export default PaymentDetails;
