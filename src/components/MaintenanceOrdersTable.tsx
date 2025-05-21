
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Plus, Search, Filter, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data for demonstration purposes
const mockBESSSystems = [
  { id: "bess1", manufacturer: "Enel X", model: "EX-100" },
  { id: "bess2", manufacturer: "Enphase", model: "IQ Battery 10T" },
  { id: "bess3", manufacturer: "Tesla", model: "Powerwall 2" },
  { id: "bess4", manufacturer: "LG", model: "ESS Home 10" },
  { id: "bess5", manufacturer: "Sonnen", model: "eco 12" },
];

const mockTechnicians = [
  { id: "tech1", name: "Carlos Silva" },
  { id: "tech2", name: "Ana Oliveira" },
  { id: "tech3", name: "Roberto Almeida" },
  { id: "tech4", name: "Patricia Costa" },
  { id: "tech5", name: "Fernando Santos" },
];

interface MaintenanceOrder {
  id: string;
  bessSystemId: string;
  technicianId: string;
  createdAt: Date;
}

export default function MaintenanceOrdersTable() {
  const { toast } = useToast();
  const [maintenanceOrders, setMaintenanceOrders] = useState<MaintenanceOrder[]>([
    { 
      id: "maint1", 
      bessSystemId: "bess1", 
      technicianId: "tech1", 
      createdAt: new Date(2023, 5, 15) 
    },
    { 
      id: "maint2", 
      bessSystemId: "bess2", 
      technicianId: "tech3", 
      createdAt: new Date(2023, 6, 22) 
    },
    { 
      id: "maint3", 
      bessSystemId: "bess4", 
      technicianId: "tech2", 
      createdAt: new Date(2023, 7, 10) 
    },
  ]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterSystem, setFilterSystem] = useState<string | null>(null);
  const [filterTechnician, setFilterTechnician] = useState<string | null>(null);
  
  const [editingOrder, setEditingOrder] = useState<MaintenanceOrder | null>(null);
  const [newOrderBessId, setNewOrderBessId] = useState("");
  const [newOrderTechId, setNewOrderTechId] = useState("");
  
  // Items per page
  const itemsPerPage = 5;
  
  // Filter and search orders
  const filteredOrders = maintenanceOrders.filter(order => {
    const bessSystem = mockBESSSystems.find(sys => sys.id === order.bessSystemId);
    const technician = mockTechnicians.find(tech => tech.id === order.technicianId);
    
    let matchesBess = true;
    let matchesTech = true;
    let matchesSearch = true;
    
    if (filterSystem) {
      matchesBess = order.bessSystemId === filterSystem;
    }
    
    if (filterTechnician) {
      matchesTech = order.technicianId === filterTechnician;
    }
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const bessMatch = bessSystem 
        ? `${bessSystem.manufacturer} ${bessSystem.model}`.toLowerCase().includes(searchLower)
        : false;
      const techMatch = technician 
        ? technician.name.toLowerCase().includes(searchLower)
        : false;
      const idMatch = order.id.toLowerCase().includes(searchLower);
      
      matchesSearch = bessMatch || techMatch || idMatch;
    }
    
    return matchesBess && matchesTech && matchesSearch;
  });
  
  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Handle creating new order
  const handleCreateOrder = () => {
    if (!newOrderBessId || !newOrderTechId) {
      toast({
        title: "Erro ao criar ordem",
        description: "Todos os campos são obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    
    const newOrder: MaintenanceOrder = {
      id: `maint${maintenanceOrders.length + 1}`,
      bessSystemId: newOrderBessId,
      technicianId: newOrderTechId,
      createdAt: new Date()
    };
    
    setMaintenanceOrders([...maintenanceOrders, newOrder]);
    setNewOrderBessId("");
    setNewOrderTechId("");
    
    toast({
      title: "Ordem de Manutenção Criada",
      description: `Nova ordem de manutenção ${newOrder.id} criada com sucesso.`
    });
  };
  
  // Handle updating order
  const handleUpdateOrder = () => {
    if (!editingOrder || !editingOrder.bessSystemId || !editingOrder.technicianId) {
      toast({
        title: "Erro ao atualizar ordem",
        description: "Todos os campos são obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    
    const updatedOrders = maintenanceOrders.map(order => 
      order.id === editingOrder.id ? editingOrder : order
    );
    
    setMaintenanceOrders(updatedOrders);
    setEditingOrder(null);
    
    toast({
      title: "Ordem de Manutenção Atualizada",
      description: `Ordem ${editingOrder.id} atualizada com sucesso.`
    });
  };
  
  // Handle deleting order
  const handleDeleteOrder = (orderId: string) => {
    const updatedOrders = maintenanceOrders.filter(order => order.id !== orderId);
    setMaintenanceOrders(updatedOrders);
    
    toast({
      title: "Ordem de Manutenção Removida",
      description: `Ordem ${orderId} removida com sucesso.`
    });
  };
  
  // Get BESS system info by ID
  const getBessSystemById = (bessId: string) => {
    const system = mockBESSSystems.find(sys => sys.id === bessId);
    return system ? `${system.manufacturer} ${system.model}` : "Desconhecido";
  };
  
  // Get technician info by ID
  const getTechnicianById = (techId: string) => {
    const tech = mockTechnicians.find(tech => tech.id === techId);
    return tech ? tech.name : "Desconhecido";
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-brand-blue-dark">Ordens de Manutenção</h2>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-brand-orange hover:bg-brand-orange/90">
              <Plus className="mr-2" /> Nova Ordem
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Nova Ordem de Manutenção</DialogTitle>
              <DialogDescription>
                Crie uma nova ordem de manutenção preenchendo os campos abaixo.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="bess-system">Sistema BESS</label>
                <Select onValueChange={setNewOrderBessId} value={newOrderBessId}>
                  <SelectTrigger id="bess-system">
                    <SelectValue placeholder="Selecionar Sistema BESS" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockBESSSystems.map(system => (
                      <SelectItem key={system.id} value={system.id}>
                        {system.manufacturer} {system.model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label htmlFor="technician">Técnico Responsável</label>
                <Select onValueChange={setNewOrderTechId} value={newOrderTechId}>
                  <SelectTrigger id="technician">
                    <SelectValue placeholder="Selecionar Técnico" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockTechnicians.map(tech => (
                      <SelectItem key={tech.id} value={tech.id}>
                        {tech.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button onClick={handleCreateOrder}>Criar Ordem</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 pb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input 
            placeholder="Pesquisar ordens..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Select onValueChange={(val) => setFilterSystem(val === "all" ? null : val)}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filtrar por Sistema" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Sistemas</SelectItem>
              {mockBESSSystems.map(system => (
                <SelectItem key={system.id} value={system.id}>
                  {system.manufacturer} {system.model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select onValueChange={(val) => setFilterTechnician(val === "all" ? null : val)}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filtrar por Técnico" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Técnicos</SelectItem>
              {mockTechnicians.map(tech => (
                <SelectItem key={tech.id} value={tech.id}>
                  {tech.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID da Manutenção</TableHead>
              <TableHead>Sistema BESS</TableHead>
              <TableHead>Técnico Responsável</TableHead>
              <TableHead>Data de Criação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedOrders.length > 0 ? (
              paginatedOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{getBessSystemById(order.bessSystemId)}</TableCell>
                  <TableCell>{getTechnicianById(order.technicianId)}</TableCell>
                  <TableCell>{order.createdAt.toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" 
                            onClick={() => setEditingOrder({...order})}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Editar Ordem de Manutenção</DialogTitle>
                            <DialogDescription>
                              Atualize os detalhes da ordem {editingOrder?.id}.
                            </DialogDescription>
                          </DialogHeader>
                          {editingOrder && (
                            <div className="grid gap-4 py-4">
                              <div className="grid gap-2">
                                <label htmlFor="edit-bess">Sistema BESS</label>
                                <Select 
                                  value={editingOrder.bessSystemId}
                                  onValueChange={(value) => setEditingOrder({
                                    ...editingOrder,
                                    bessSystemId: value
                                  })}
                                >
                                  <SelectTrigger id="edit-bess">
                                    <SelectValue placeholder="Selecionar Sistema BESS" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {mockBESSSystems.map(system => (
                                      <SelectItem key={system.id} value={system.id}>
                                        {system.manufacturer} {system.model}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="grid gap-2">
                                <label htmlFor="edit-tech">Técnico Responsável</label>
                                <Select 
                                  value={editingOrder.technicianId}
                                  onValueChange={(value) => setEditingOrder({
                                    ...editingOrder,
                                    technicianId: value
                                  })}
                                >
                                  <SelectTrigger id="edit-tech">
                                    <SelectValue placeholder="Selecionar Técnico" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {mockTechnicians.map(tech => (
                                      <SelectItem key={tech.id} value={tech.id}>
                                        {tech.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          )}
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline">Cancelar</Button>
                            </DialogClose>
                            <DialogClose asChild>
                              <Button onClick={handleUpdateOrder}>Salvar Alterações</Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteOrder(order.id)}
                          >
                            Confirmar Remoção
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  Nenhuma ordem de manutenção encontrada
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={currentPage === i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
