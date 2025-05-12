
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface PasswordCreationProps {
  onSubmit: (password: string) => void;
}

export default function PasswordCreation({ onSubmit }: PasswordCreationProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  
  // Password validation requirements
  const minLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const passwordsMatch = password === confirmPassword && password !== "";
  
  const isPasswordValid = 
    minLength && 
    hasUpperCase && 
    hasLowerCase && 
    hasSpecialChar && 
    hasNumber;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isPasswordValid) {
      setError("A senha não atende aos requisitos mínimos.");
      return;
    }
    
    if (!passwordsMatch) {
      setError("As senhas não conferem.");
      return;
    }
    
    onSubmit(password);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
        />
        
        {/* Password requirements list */}
        <div className="mt-2 text-sm space-y-1">
          <p className="font-medium text-gray-700">A senha deve conter:</p>
          <ul className="pl-5 space-y-1 list-disc">
            <li className={minLength ? "text-green-600" : "text-gray-500"}>
              No mínimo 8 caracteres
            </li>
            <li className={hasUpperCase ? "text-green-600" : "text-gray-500"}>
              Uma letra maiúscula
            </li>
            <li className={hasLowerCase ? "text-green-600" : "text-gray-500"}>
              Uma letra minúscula
            </li>
            <li className={hasSpecialChar ? "text-green-600" : "text-gray-500"}>
              Um caractere especial
            </li>
            <li className={hasNumber ? "text-green-600" : "text-gray-500"}>
              Um algarismo numérico
            </li>
          </ul>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar Senha</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="input-field"
        />
        {confirmPassword && !passwordsMatch && (
          <p className="text-sm text-red-500 mt-1">As senhas não conferem</p>
        )}
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Button 
        type="submit" 
        className="btn-primary w-full"
        disabled={!isPasswordValid || !passwordsMatch}
      >
        Continuar
      </Button>
    </form>
  );
}
