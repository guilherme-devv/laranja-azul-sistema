
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface TechnicianFormProps {
  onFormSubmit: () => void;
}

const CARGO_OPTIONS = [
  "Engenharia", 
  "TI", 
  "Obras e Serviços", 
  "PMO", 
  "Diretoria", 
  "Outros"
];

export default function TechnicianForm({ onFormSubmit }: TechnicianFormProps) {
  const [name, setName] = useState("");
  const [registrationCode, setRegistrationCode] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [is3EEmployee, setIs3EEmployee] = useState(false);
  const [role, setRole] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFormSubmit();
  };
  
  const isFormValid = name && registrationCode && address && phone && company && (!is3EEmployee || role);
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Nome/Razão Social</Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-field"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="registrationCode">Código de Matrícula</Label>
        <Input
          id="registrationCode"
          type="text"
          value={registrationCode}
          onChange={(e) => setRegistrationCode(e.target.value)}
          className="input-field"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address">Endereço</Label>
        <Input
          id="address"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="input-field"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Telefone</Label>
        <Input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="input-field"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="company">Empresa Associada</Label>
        <Input
          id="company"
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="input-field"
          required
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="is3EEmployee" 
          checked={is3EEmployee} 
          onCheckedChange={(checked) => setIs3EEmployee(checked === true)}
        />
        <Label htmlFor="is3EEmployee">Colaborador da 3E</Label>
      </div>
      
      {is3EEmployee && (
        <div className="space-y-2">
          <Label htmlFor="role">Cargo</Label>
          <Select value={role} onValueChange={setRole} required={is3EEmployee}>
            <SelectTrigger id="role" className="input-field">
              <SelectValue placeholder="Selecione um cargo" />
            </SelectTrigger>
            <SelectContent>
              {CARGO_OPTIONS.map((cargo) => (
                <SelectItem key={cargo} value={cargo}>{cargo}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      <Button 
        type="submit" 
        className="btn-primary w-full"
        disabled={!isFormValid}
      >
        Cadastrar
      </Button>
    </form>
  );
}
