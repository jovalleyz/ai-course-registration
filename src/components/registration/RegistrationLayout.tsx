
import React from 'react';
import ContactFooter from '@/components/ContactFooter';

interface RegistrationLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const RegistrationLayout: React.FC<RegistrationLayoutProps> = ({ 
  children, 
  title, 
  subtitle 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col animate-fade-in">
      <div className="container max-w-4xl mx-auto px-4 py-12 flex-grow">
        <div className="text-center mb-10">
          <div className="text-sm font-medium text-primary mb-2 animate-pulse-subtle">
            <span className="text-lg">Formulario de Registro</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3 relative">
            <span className="bg-gradient-to-r from-primary to-blue-700 bg-clip-text text-transparent">
              {title}
            </span>
            <span className="absolute -top-8 -right-8 w-20 h-20 bg-blue-100 rounded-full opacity-30 blur-3xl"></span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {subtitle}
          </p>
        </div>
        
        {children}
      </div>
      
      <ContactFooter />
    </div>
  );
};

export default RegistrationLayout;
