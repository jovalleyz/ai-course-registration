
import React from 'react';
import { FileDownIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateSummaryData } from './calendarUtils';
import { FormData } from '@/components/registration/RegistrationForm';

interface DownloadSummaryProps {
  formData: FormData;
}

const DownloadSummary: React.FC<DownloadSummaryProps> = ({ formData }) => {
  const handleDownload = () => {
    // Generate summary text
    const summaryText = generateSummaryData(formData);
    
    // Create blob and download link
    const blob = new Blob([summaryText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `registro-curso-ia-${formData.name.split(' ')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-4 text-center">
      <p className="text-sm text-muted-foreground mb-3">
        Descargue un resumen de su registro para enviarlo junto al comprobante de pago.
      </p>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleDownload}
        className="flex items-center gap-2"
      >
        <FileDownIcon size={16} />
        Descargar Resumen
      </Button>
    </div>
  );
};

export default DownloadSummary;
