
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

export default function PlaceholderPage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('administradores')) return "Administradores";
    if (path.includes('bess')) return "BESS";
    if (path.includes('manutencoes')) return "Manutenções";
    if (path.includes('perfil')) return "Perfil";
    return "Página";
  };
  
  useEffect(() => {
    // Verificar se o usuário está autenticado
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setIsLoading(false);
  }, []);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-brand-orange border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/" />;
  }
  
  return (
    <div className="h-screen flex overflow-hidden">
      {!isMobile && <Sidebar />}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 shadow-sm h-16 flex items-center px-4 sticky top-0 z-10">
          {isMobile && <Sidebar isMobile={true} />}
          <h1 className="text-xl font-semibold text-brand-blue-dark ml-2">{getPageTitle()}</h1>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h2 className="text-2xl font-bold text-brand-orange mb-4">{getPageTitle()}</h2>
              <p className="text-gray-600">
                Esta seção está em desenvolvimento. Volte em breve!
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
