
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-4">
      <div className="glass-card p-8 text-center max-w-md animate-scale-in">
        <h1 className="text-6xl font-bold text-primary mb-6">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Página no encontrada</h2>
        <p className="text-muted-foreground mb-8">
          Lo sentimos, no pudimos encontrar la página que estás buscando.
        </p>
        <Button 
          asChild
          className="glass-button flex items-center gap-2 px-6 py-5 rounded-lg"
        >
          <a href="/">
            <ArrowLeft size={18} /> Volver al inicio
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
