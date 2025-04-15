
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function PasswordRecoveryForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, informe seu e-mail",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simula envio de e-mail de recuperação
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1000);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="flex justify-center mb-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-brand-orange">Recuperar Senha</h1>
          <p className="text-sm text-gray-500 mt-1">Informe seu e-mail para receber um link de redefinição</p>
        </div>
      </div>
      
      {isSubmitted ? (
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <CheckCircle2 className="h-16 w-16 text-brand-green-dark" />
          </div>
          <h2 className="text-xl font-medium">E-mail enviado!</h2>
          <p className="text-gray-500">
            Enviamos um link para {email}.<br />
            Verifique sua caixa de entrada.
          </p>
          <Link to="/" className="btn-primary inline-block mt-4">
            Voltar ao login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field"
            />
          </div>
          
          <Button
            type="submit"
            className="btn-primary w-full"
            disabled={isLoading}
          >
            {isLoading ? "Enviando..." : "Enviar link de redefinição"}
          </Button>
          
          <div className="text-center">
            <Link
              to="/"
              className="inline-flex items-center text-brand-blue-medium hover:text-brand-blue-dark text-sm font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Voltar ao login
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
