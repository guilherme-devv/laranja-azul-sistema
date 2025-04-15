
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";

// Interface para o tipo de cliente
interface Client {
  id: string;
  name: string;
  documentType: "cpf" | "cnpj";
  documentNumber: string;
}

// Dados mockados para exemplo
const initialClients: Client[] = [
  {
    id: "1",
    name: "João Silva",
    documentType: "cpf",
    documentNumber: "123.456.789-00",
  },
  {
    id: "2",
    name: "Empresa ABC Ltda",
    documentType: "cnpj",
    documentNumber: "12.345.678/0001-90",
  },
  {
    id: "3",
    name: "Maria Souza",
    documentType: "cpf",
    documentNumber: "987.654.321-00",
  },
  {
    id: "4",
    name: "Tech Solutions S.A.",
    documentType: "cnpj",
    documentNumber: "98.765.432/0001-10",
  },
];

export default function ClientsTable() {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [filteredClients, setFilteredClients] = useState<Client[]>(initialClients);
  const [searchTerm, setSearchTerm] = useState("");
  const [documentTypeFilter, setDocumentTypeFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [newClient, setNewClient] = useState<Omit<Client, "id">>({
    name: "",
    documentType: "cpf",
    documentNumber: "",
  });
  const { toast } = useToast();
  
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);

  // Aplicar filtros
  const applyFilters = () => {
    let result = [...clients];
    
    if (searchTerm) {
      result = result.filter(client => 
        client.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (documentTypeFilter !== "all") {
      result = result.filter(client => client.documentType === documentTypeFilter);
    }
    
    setFilteredClients(result);
    setCurrentPage(1);
  };
  
  // Paginação
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentClients = filteredClients.slice(startIndex, endIndex);
  
  // Adicionar novo cliente
  const addClient = () => {
    if (!newClient.name || !newClient.documentNumber) {
      toast({
        title: "Campos obrigatórios",
        description: "Todos os campos são obrigatórios.",
        variant: "destructive",
      });
      return;
    }
    
    const newId = (Math.max(...clients.map(c => parseInt(c.id)), 0) + 1).toString();
    const clientToAdd = { ...newClient, id: newId };
    
    setClients([...clients, clientToAdd]);
    setFilteredClients([...filteredClients, clientToAdd]);
    
    setNewClient({
      name: "",
      documentType: "cpf",
      documentNumber: "",
    });
    
    toast({
      title: "Cliente adicionado",
      description: "Cliente adicionado com sucesso!",
    });
  };
  
  // Editar cliente
  const saveEditedClient = () => {
    if (!editingClient) return;
    
    if (!editingClient.name || !editingClient.documentNumber) {
      toast({
        title: "Campos obrigatórios",
        description: "Todos os campos são obrigatórios.",
        variant: "destructive",
      });
      return;
    }
    
    const updatedClients = clients.map(client => 
      client.id === editingClient.id ? editingClient : client
    );
    
    setClients(updatedClients);
    setFilteredClients(updatedClients);
    
    setEditingClient(null);
    
    toast({
      title: "Cliente atualizado",
      description: "Cliente atualizado com sucesso!",
    });
  };
  
  // Excluir cliente
  const deleteClient = (id: string) => {
    const updatedClients = clients.filter(client => client.id !== id);
    setClients(updatedClients);
    setFilteredClients(updatedClients);
    
    toast({
      title: "Cliente excluído",
      description: "Cliente excluído com sucesso!",
    });
  };

  return (
    <div className="space-y-4">
      {/* Cabeçalho com filtros */}
      <div className="flex flex-col md:flex-row gap-3 items-end">
        <div className="flex-1">
          <Label htmlFor="search">Buscar por nome</Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              type="text"
              placeholder="Buscar cliente..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (!e.target.value) {
                  applyFilters();
                }
              }}
              onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            />
          </div>
        </div>
        
        <div className="w-full md:w-48">
          <Label htmlFor="documentType">Tipo de documento</Label>
          <Select 
            value={documentTypeFilter}
            onValueChange={(value) => {
              setDocumentTypeFilter(value);
              setTimeout(applyFilters, 0);
            }}
          >
            <SelectTrigger id="documentType">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="cpf">CPF</SelectItem>
              <SelectItem value="cnpj">CNPJ</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button onClick={applyFilters} className="btn-secondary md:w-auto w-full">
          Filtrar
        </Button>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="btn-primary md:w-auto w-full">
              <Plus className="mr-2 h-4 w-4" /> Adicionar Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Cliente</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nome
                </Label>
                <Input
                  id="name"
                  className="col-span-3"
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">
                  Tipo
                </Label>
                <RadioGroup 
                  className="flex col-span-3" 
                  defaultValue={newClient.documentType}
                  onValueChange={(value) => setNewClient({ ...newClient, documentType: value as "cpf" | "cnpj" })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cpf" id="cpf" />
                    <Label htmlFor="cpf">CPF</Label>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <RadioGroupItem value="cnpj" id="cnpj" />
                    <Label htmlFor="cnpj">CNPJ</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="document" className="text-right">
                  Documento
                </Label>
                <Input
                  id="document"
                  className="col-span-3"
                  value={newClient.documentNumber}
                  onChange={(e) => setNewClient({ ...newClient, documentNumber: e.target.value })}
                  placeholder={newClient.documentType === "cpf" ? "000.000.000-00" : "00.000.000/0000-00"}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button className="btn-primary" onClick={addClient}>Salvar</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabela de clientes */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Documento</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentClients.length > 0 ? (
              currentClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>{client.documentType.toUpperCase()}</TableCell>
                  <TableCell>{client.documentNumber}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => setEditingClient(client)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Editar Cliente</DialogTitle>
                          </DialogHeader>
                          {editingClient && (
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-name" className="text-right">
                                  Nome
                                </Label>
                                <Input
                                  id="edit-name"
                                  className="col-span-3"
                                  value={editingClient.name}
                                  onChange={(e) => setEditingClient({ ...editingClient, name: e.target.value })}
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">
                                  Tipo
                                </Label>
                                <RadioGroup 
                                  className="flex col-span-3" 
                                  defaultValue={editingClient.documentType}
                                  onValueChange={(value) => 
                                    setEditingClient({ ...editingClient, documentType: value as "cpf" | "cnpj" })
                                  }
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="cpf" id="edit-cpf" />
                                    <Label htmlFor="edit-cpf">CPF</Label>
                                  </div>
                                  <div className="flex items-center space-x-2 ml-4">
                                    <RadioGroupItem value="cnpj" id="edit-cnpj" />
                                    <Label htmlFor="edit-cnpj">CNPJ</Label>
                                  </div>
                                </RadioGroup>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-document" className="text-right">
                                  Documento
                                </Label>
                                <Input
                                  id="edit-document"
                                  className="col-span-3"
                                  value={editingClient.documentNumber}
                                  onChange={(e) => 
                                    setEditingClient({ ...editingClient, documentNumber: e.target.value })
                                  }
                                  placeholder={editingClient.documentType === "cpf" ? 
                                    "000.000.000-00" : "00.000.000/0000-00"}
                                />
                              </div>
                            </div>
                          )}
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline">Cancelar</Button>
                            </DialogClose>
                            <DialogClose asChild>
                              <Button className="btn-primary" onClick={saveEditedClient}>Salvar</Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="icon" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir o cliente "{client.name}"? 
                              Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                              className="bg-destructive text-destructive-foreground"
                              onClick={() => deleteClient(client.id)}
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6">
                  Nenhum cliente encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Paginação */}
      {filteredClients.length > 0 && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Mostrando {startIndex + 1} a {Math.min(endIndex, filteredClients.length)} de {filteredClients.length} resultados
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
