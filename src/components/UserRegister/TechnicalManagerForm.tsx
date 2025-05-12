
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

interface TechnicalManagerFormProps {
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

export default function TechnicalManagerForm({ onFormSubmit }: TechnicalManagerFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFormSubmit();
  };
  
  const isFormValid = name && phone && address && role;
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
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
        <Label htmlFor="role">Cargo</Label>
        <Select value={role} onValueChange={setRole} required>
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
