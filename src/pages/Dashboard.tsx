
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();
  
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
          <h1 className="text-xl font-semibold text-brand-blue-dark ml-2">Dashboard</h1>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-brand-orange mb-6">Bem-vindo ao Sistema BESS Solar</h2>
              <p className="text-gray-600">
                Selecione uma opção no menu lateral para começar.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-gradient-to-r from-brand-orange to-brand-orange-light text-white rounded-lg p-6 shadow-md">
                  <h3 className="text-lg font-semibold mb-2">Clientes</h3>
                  <p className="text-sm opacity-80">Gerencie os clientes da empresa</p>
                </div>
                
                <div className="bg-gradient-to-r from-brand-yellow-gold to-brand-yellow-light text-gray-800 rounded-lg p-6 shadow-md">
                  <h3 className="text-lg font-semibold mb-2">BESS</h3>
                  <p className="text-sm opacity-80">Sistema de armazenamento de energia</p>
                </div>
                
                <div className="bg-gradient-to-r from-brand-blue-medium to-brand-blue-light text-white rounded-lg p-6 shadow-md">
                  <h3 className="text-lg font-semibold mb-2">Manutenções</h3>
                  <p className="text-sm opacity-80">Agende e gerencie manutenções</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
