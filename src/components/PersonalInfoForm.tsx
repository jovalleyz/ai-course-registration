
import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface PersonalInfoFormProps {
  formData: {
    name: string;
    phone: string;
    email: string;
    classType: 'individual' | 'group';
  };
  onChange: (name: string, value: string) => void;
  onNext: () => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ formData, onChange, onNext }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const isFormValid = formData.name.trim() && formData.phone.trim() && formData.email.trim() && formData.classType;

  return (
    <div className="animate-scale-in">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="form-control">
            <Label htmlFor="name" className="text-sm font-medium mb-1.5 block">Nombre y Apellido</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => onChange('name', e.target.value)}
              placeholder="Ingrese su nombre completo"
              className="w-full transition-all focus:ring-2 focus:ring-primary/30"
              required
            />
          </div>
          
          <div className="form-control">
            <Label htmlFor="phone" className="text-sm font-medium mb-1.5 block">Número de Teléfono</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => onChange('phone', e.target.value)}
              placeholder="Ingrese su número telefónico"
              className="w-full transition-all focus:ring-2 focus:ring-primary/30"
              required
            />
          </div>
          
          <div className="form-control">
            <Label htmlFor="email" className="text-sm font-medium mb-1.5 block">Correo Electrónico</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => onChange('email', e.target.value)}
              placeholder="Ingrese su correo electrónico"
              className="w-full transition-all focus:ring-2 focus:ring-primary/30"
              required
            />
          </div>
          
          <div className="pt-4">
            <Label className="text-sm font-medium mb-3 block">Tipo de Clase</Label>
            <RadioGroup 
              value={formData.classType} 
              onValueChange={(value) => onChange('classType', value)}
              className="grid gap-4 grid-cols-1 sm:grid-cols-2"
            >
              <div className={`rounded-lg border border-muted p-4 transition-all ${formData.classType === 'individual' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50 hover:border-primary/30'}`}>
                <RadioGroupItem value="individual" id="individual" className="sr-only" />
                <Label htmlFor="individual" className="flex items-center gap-3 cursor-pointer font-normal">
                  {formData.classType === 'individual' && <Check size={18} className="text-primary" />}
                  <span className={formData.classType === 'individual' ? 'font-medium' : ''}>Clase Individual</span>
                </Label>
              </div>
              
              <div className={`rounded-lg border border-muted p-4 transition-all ${formData.classType === 'group' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50 hover:border-primary/30'}`}>
                <RadioGroupItem value="group" id="group" className="sr-only" />
                <Label htmlFor="group" className="flex items-center gap-3 cursor-pointer font-normal">
                  {formData.classType === 'group' && <Check size={18} className="text-primary" />}
                  <span className={formData.classType === 'group' ? 'font-medium' : ''}>Clase Grupal</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        
        <Button 
          type="submit" 
          disabled={!isFormValid}
          className="w-full mt-8 font-medium flex items-center justify-center gap-2 py-6 rounded-lg transition-all duration-300 glass-button disabled:opacity-70"
        >
          Continuar <ArrowRight size={18} />
        </Button>
      </form>
    </div>
  );
};

export default PersonalInfoForm;
