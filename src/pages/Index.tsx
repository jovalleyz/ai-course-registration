
import React from 'react';
import RegistrationForm from '@/components/registration/RegistrationForm';
import RegistrationLayout from '@/components/registration/RegistrationLayout';
import { Helmet } from 'react-helmet';

const Index = () => {
  // Set page title
  React.useEffect(() => {
    document.title = "Registro Academia de Inteligencia Artificial";
  }, []);

  return (
    <>
      <Helmet>
        <title>Registro Academia de Inteligencia Artificial</title>
      </Helmet>
      
      <RegistrationLayout 
        title="Curso de Uso de Inteligencia Artificial"
        subtitle="Talleres, Charlas, Material didáctico, Nuevas Tendencias"
      >
        <RegistrationForm />
      </RegistrationLayout>
    </>
  );
};

export default Index;
