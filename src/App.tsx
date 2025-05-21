
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import PasswordRecovery from "./pages/PasswordRecovery";
import Dashboard from "./pages/Dashboard";
import ClientsPage from "./pages/ClientsPage";
import PlaceholderPage from "./pages/PlaceholderPage";
import NotFound from "./pages/NotFound";
import UserRegister from "./pages/UserRegister";
import SuccessModalDemo from "./components/SuccessModalDemo";
import BESSFormPage from "./pages/BESSFormPage";
import MaintenanceOrdersPage from "./pages/MaintenanceOrdersPage";

const queryClient = new QueryClient();

const App = () => {
  // Function to check user role and redirect accordingly
  const checkUserRoleAndRedirect = () => {
    const userData = localStorage.getItem("user");
    if (!userData) return <Navigate to="/" />;
    
    const user = JSON.parse(userData);
    if (user.role === "technical_manager") {
      return <Navigate to="/manutencoes" />;
    }
    return <Dashboard />;
  };
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<><Login /><SuccessModalDemo /></>} />
            <Route path="/recuperar-senha" element={<PasswordRecovery />} />
            <Route path="/cadastro-usuario" element={<UserRegister />} />
            <Route path="/dashboard" element={checkUserRoleAndRedirect()} />
            <Route path="/clientes" element={<ClientsPage />} />
            <Route path="/administradores" element={<PlaceholderPage />} />
            <Route path="/bess" element={<BESSFormPage />} />
            <Route path="/manutencoes" element={<MaintenanceOrdersPage />} />
            <Route path="/perfil" element={<PlaceholderPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
