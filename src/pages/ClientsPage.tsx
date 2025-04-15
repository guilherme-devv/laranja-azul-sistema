
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import ClientsTable from "@/components/ClientsTable";
import { useIsMobile } from "@/hooks/use-mobile";

export default function ClientsPage() {
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
          <h1 className="text-xl font-semibold text-brand-blue-dark ml-2">Clientes</h1>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <ClientsTable />
          </div>
        </main>
      </div>
    </div>
  );
}
