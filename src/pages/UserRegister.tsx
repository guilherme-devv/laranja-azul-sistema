
import { useState } from "react";
import PasswordCreation from "@/components/UserRegister/PasswordCreation";
import AdministratorForm from "@/components/UserRegister/AdministratorForm";
import TechnicalManagerForm from "@/components/UserRegister/TechnicalManagerForm";
import TechnicianForm from "@/components/UserRegister/TechnicianForm";
import { useToast } from "@/components/ui/use-toast";
import { useLocation, useNavigate } from "react-router-dom";

// User types
export type UserType = "admin" | "manager" | "technician";

export default function UserRegister() {
  const [currentStep, setCurrentStep] = useState<"password" | "details">("password");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get user type from URL params or state
  const userType = (location.state?.userType || "admin") as UserType;
  
  const handlePasswordSubmit = (validPassword: string) => {
    setPassword(validPassword);
    setCurrentStep("details");
    toast({
      title: "Senha definida com sucesso",
      description: "Por favor, complete seus dados pessoais.",
    });
  };
  
  const handleFormSubmit = () => {
    toast({
      title: "Cadastro concluído",
      description: "Seus dados foram salvos com sucesso.",
    });
    
    // In a real application, you would save the user data to a database
    // For now, we'll just redirect to the login page
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };
  
  // Different forms based on user type
  const renderUserDetailsForm = () => {
    switch (userType) {
      case "admin":
        return <AdministratorForm onFormSubmit={handleFormSubmit} />;
      case "manager":
        return <TechnicalManagerForm onFormSubmit={handleFormSubmit} />;
      case "technician":
        return <TechnicianForm onFormSubmit={handleFormSubmit} />;
      default:
        return <AdministratorForm onFormSubmit={handleFormSubmit} />;
    }
  };
  
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-brand-blue-light to-brand-blue-dark p-4">
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
        <div className="flex justify-center mb-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-brand-orange">BESS Solar</h1>
            <p className="text-sm text-gray-500 mt-1">Cadastro de {userType === "admin" ? "Administrador" : userType === "manager" ? "Gerente Técnico" : "Técnico"}</p>
          </div>
        </div>
        
        {currentStep === "password" ? (
          <PasswordCreation onSubmit={handlePasswordSubmit} />
        ) : (
          renderUserDetailsForm()
        )}
      </div>
    </div>
  );
}
