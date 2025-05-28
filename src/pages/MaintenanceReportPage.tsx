
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import Sidebar from "@/components/Sidebar";
import MaintenanceReportForm from "@/components/MaintenanceReportForm";

export default function MaintenanceReportPage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { orderId } = useParams();
  
  useEffect(() => {
    // Check if user is authenticated
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Only technicians and technical managers should access this page
      if (!["technician", "technical_manager"].includes(parsedUser.role)) {
        navigate("/dashboard");
      }
    } else {
      navigate("/");
    }
    setIsLoading(false);
  }, [navigate]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-brand-orange border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  return (
    <div className="h-screen flex overflow-hidden">
      {!isMobile && <Sidebar />}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 shadow-sm h-16 flex items-center px-4 sticky top-0 z-10">
          {isMobile && <Sidebar isMobile={true} />}
          <h1 className="text-xl font-semibold text-brand-blue-dark ml-2">
            Relatório de Manutenção - Ordem {orderId}
          </h1>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <MaintenanceReportForm orderId={orderId} />
          </div>
        </main>
      </div>
    </div>
  );
}
