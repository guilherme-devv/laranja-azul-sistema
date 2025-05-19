
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { pt } from "date-fns/locale";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { CalendarDays, Filter, Search, Battery } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

// Tipos de dados
interface BESSSystem {
  id: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  capacity: number;
}

interface Client {
  id: string;
  name: string;
}

interface FilterOptions {
  client: string;
  bessSystem: string;
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  valueFilters: {
    parameter: string;
    condition: string;
    value1: string;
    value2: string;
  };
  sortOption: string;
}

// Dados de exemplo
const mockClients: Client[] = [
  { id: "1", name: "Cliente A" },
  { id: "2", name: "Cliente B" },
  { id: "3", name: "Cliente C" },
];

const mockBESSSystems: BESSSystem[] = [
  { id: "1", manufacturer: "Tesla", model: "Powerwall 2", serialNumber: "TL10021", capacity: 14 },
  { id: "2", manufacturer: "LG", model: "RESU 10H", serialNumber: "LG20045", capacity: 10 },
  { id: "3", manufacturer: "Sonnen", model: "eco 8", serialNumber: "SN30067", capacity: 8 },
];

// Dados de exemplo para os gráficos
const generateMockData = () => {
  const data = [];
  const now = new Date();
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(now);
    date.setDate(now.getDate() - (30 - i));
    
    data.push({
      date: format(date, "dd/MM"),
      energyUsed: Math.floor(Math.random() * 40) + 20,
      energyInjected: Math.floor(Math.random() * 35) + 15,
      voltage: Math.floor(Math.random() * 20) + 220,
      current: Math.floor(Math.random() * 50) + 10,
      batteryPercentage: Math.floor(Math.random() * 100),
      financialGain: Math.floor(Math.random() * 300) + 50,
    });
  }
  
  return data;
};

// Componente principal do Dashboard
export default function BESSDashboard() {
  const [filters, setFilters] = useState<FilterOptions>({
    client: "",
    bessSystem: "",
    dateRange: { from: undefined, to: undefined },
    valueFilters: {
      parameter: "current",
      condition: "greaterThan",
      value1: "",
      value2: "",
    },
    sortOption: "desc",
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [chartData, setChartData] = useState(generateMockData());
  
  const handleFilterChange = (field: keyof FilterOptions, value: any) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };
  
  const handleValueFilterChange = (field: keyof typeof filters.valueFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      valueFilters: { ...prev.valueFilters, [field]: value },
    }));
  };
  
  const applyFilters = () => {
    // Simulação da aplicação de filtros - em uma implementação real,
    // isso poderia enviar uma solicitação para uma API com os filtros
    console.log("Filtros aplicados:", filters);
    const newData = generateMockData();
    
    // Simulação da ordenação
    if (filters.sortOption === "asc") {
      newData.sort((a, b) => a.financialGain - b.financialGain);
    } else if (filters.sortOption === "desc") {
      newData.sort((a, b) => b.financialGain - a.financialGain);
    }
    
    setChartData(newData);
  };
  
  const resetFilters = () => {
    setFilters({
      client: "",
      bessSystem: "",
      dateRange: { from: undefined, to: undefined },
      valueFilters: {
        parameter: "current",
        condition: "greaterThan",
        value1: "",
        value2: "",
      },
      sortOption: "desc",
    });
    setChartData(generateMockData());
  };
  
  // Valores fixos para as tarifas
  const peakTariff = "R$ 1,50 / kWh";
  const offPeakTariff = "R$ 0,65 / kWh";
  
  // Calcular estatísticas para exibição
  const totalEnergyUsed = chartData.reduce((sum, item) => sum + item.energyUsed, 0);
  const totalEnergyInjected = chartData.reduce((sum, item) => sum + item.energyInjected, 0);
  const averageBatteryPercentage = Math.floor(
    chartData.reduce((sum, item) => sum + item.batteryPercentage, 0) / chartData.length
  );
  const totalFinancialGain = chartData.reduce((sum, item) => sum + item.financialGain, 0);
  
  return (
    <div className="space-y-6">
      {/* Cabeçalho e Filtros */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
        <h2 className="text-2xl font-bold text-brand-blue-dark">BESS Sistema Dashboard</h2>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? "bg-muted" : ""}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {filters.sortOption === "asc" ? "Crescente" : "Decrescente"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem 
                onClick={() => handleFilterChange("sortOption", "asc")}
                className={filters.sortOption === "asc" ? "bg-muted" : ""}
              >
                Crescente
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleFilterChange("sortOption", "desc")}
                className={filters.sortOption === "desc" ? "bg-muted" : ""}
              >
                Decrescente
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Seção de Filtros */}
      {showFilters && (
        <Card className="p-4 border-brand-orange border-2 shadow-md animate-fade-in">
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 p-0 pt-4">
            <div className="space-y-2">
              <Label htmlFor="client">Cliente</Label>
              <Select 
                value={filters.client} 
                onValueChange={(value) => handleFilterChange("client", value)}
              >
                <SelectTrigger id="client">
                  <SelectValue placeholder="Selecionar Cliente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Clientes</SelectItem>
                  {mockClients.map(client => (
                    <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bessSystem">Sistema BESS</Label>
              <Select 
                value={filters.bessSystem} 
                onValueChange={(value) => handleFilterChange("bessSystem", value)}
              >
                <SelectTrigger id="bessSystem">
                  <SelectValue placeholder="Selecionar Sistema" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Sistemas</SelectItem>
                  {mockBESSSystems.map(system => (
                    <SelectItem key={system.id} value={system.id}>
                      {system.manufacturer} - {system.model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Período</Label>
              <div className="flex space-x-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarDays className="mr-2 h-4 w-4" />
                      {filters.dateRange.from ? (
                        filters.dateRange.to ? (
                          <>
                            {format(filters.dateRange.from, "dd/MM/yyyy")} -
                            {format(filters.dateRange.to, "dd/MM/yyyy")}
                          </>
                        ) : (
                          format(filters.dateRange.from, "dd/MM/yyyy")
                        )
                      ) : (
                        <span>Selecione um período</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      locale={pt}
                      mode="range"
                      defaultMonth={new Date()}
                      selected={{
                        from: filters.dateRange.from,
                        to: filters.dateRange.to,
                      }}
                      onSelect={(range) => handleFilterChange("dateRange", range || {})}
                      numberOfMonths={1}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="parameter">Parâmetro</Label>
              <Select 
                value={filters.valueFilters.parameter} 
                onValueChange={(value) => handleValueFilterChange("parameter", value)}
              >
                <SelectTrigger id="parameter">
                  <SelectValue placeholder="Selecionar Parâmetro" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="voltage">Tensão (V)</SelectItem>
                  <SelectItem value="current">Corrente (A)</SelectItem>
                  <SelectItem value="batteryPercentage">% da Bateria</SelectItem>
                  <SelectItem value="financialGain">Ganho Financeiro (R$)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="condition">Condição</Label>
              <Select 
                value={filters.valueFilters.condition} 
                onValueChange={(value) => handleValueFilterChange("condition", value)}
              >
                <SelectTrigger id="condition">
                  <SelectValue placeholder="Selecionar Condição" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="greaterThan">Maior que</SelectItem>
                  <SelectItem value="lessThan">Menor que</SelectItem>
                  <SelectItem value="between">Está entre</SelectItem>
                  <SelectItem value="equals">Igual a</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2 flex items-end space-x-2">
              <div className="flex-1">
                <Label htmlFor="value1">Valor</Label>
                <Input 
                  id="value1"
                  type="number" 
                  placeholder="Valor" 
                  value={filters.valueFilters.value1}
                  onChange={(e) => handleValueFilterChange("value1", e.target.value)} 
                />
              </div>
              
              {filters.valueFilters.condition === "between" && (
                <div className="flex-1">
                  <Label htmlFor="value2">Até</Label>
                  <Input 
                    id="value2"
                    type="number" 
                    placeholder="Valor" 
                    value={filters.valueFilters.value2}
                    onChange={(e) => handleValueFilterChange("value2", e.target.value)} 
                  />
                </div>
              )}
            </div>
            
            <div className="col-span-1 md:col-span-3 flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={resetFilters}>Limpar</Button>
              <Button onClick={applyFilters}>Aplicar Filtros</Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Cards com estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Energia Utilizada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEnergyUsed} kWh</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Energia Injetada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEnergyInjected} kWh</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Status da Bateria
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <Battery className="h-6 w-6 mr-2" />
            <div className="text-2xl font-bold">{averageBatteryPercentage}%</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ganho Financeiro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalFinancialGain.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tarifas */}
      <Card>
        <CardHeader>
          <CardTitle>Tarifas Vigentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
              <span className="font-medium">Tarifa Ponta</span>
              <span className="font-bold text-lg text-brand-orange">{peakTariff}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
              <span className="font-medium">Tarifa Fora Ponta</span>
              <span className="font-bold text-lg text-brand-blue-medium">{offPeakTariff}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gráfico de Energia */}
        <Card>
          <CardHeader>
            <CardTitle>Energia Utilizada vs. Injetada</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ChartContainer
              className="h-full"
              config={{
                energyUsed: {
                  label: "Energia Utilizada",
                  theme: { 
                    light: "#FF7F29", 
                    dark: "#FF7F29" 
                  },
                },
                energyInjected: {
                  label: "Energia Injetada",
                  theme: { 
                    light: "#1B4D89", 
                    dark: "#1B4D89" 
                  },
                },
              }}
            >
              <BarChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <ChartTooltipContent 
                          active={active}
                          payload={payload}
                          label={`Data: ${payload[0].payload.date}`}
                        />
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Bar dataKey="energyUsed" name="Energia Utilizada" fill="#FF7F29" />
                <Bar dataKey="energyInjected" name="Energia Injetada" fill="#1B4D89" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        
        {/* Gráfico de Ganho Financeiro */}
        <Card>
          <CardHeader>
            <CardTitle>Ganho Financeiro</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ChartContainer
              className="h-full"
              config={{
                financialGain: {
                  label: "Ganho Financeiro",
                  theme: { 
                    light: "#10B981", 
                    dark: "#10B981" 
                  },
                },
              }}
            >
              <AreaChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <ChartTooltipContent 
                          active={active}
                          payload={payload}
                          label={`Data: ${payload[0].payload.date}`}
                          formatter={(value) => {
                            // Fix the type error by ensuring value is a number before using toFixed
                            return `R$ ${typeof value === 'number' ? value.toFixed(2) : value}`;
                          }}
                        />
                      );
                    }
                    return null;
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="financialGain" 
                  name="Ganho Financeiro"
                  stroke="#10B981" 
                  fill="#10B981" 
                  fillOpacity={0.2} 
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
        
        {/* Gráfico de Parâmetros Técnicos */}
        <Card>
          <CardHeader>
            <CardTitle>Parâmetros Técnicos (Tensão/Corrente)</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ChartContainer
              className="h-full"
              config={{
                voltage: {
                  label: "Tensão",
                  theme: { 
                    light: "#F59E0B", 
                    dark: "#F59E0B" 
                  },
                },
                current: {
                  label: "Corrente",
                  theme: { 
                    light: "#3B82F6", 
                    dark: "#3B82F6" 
                  },
                },
              }}
            >
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <ChartTooltipContent 
                          active={active}
                          payload={payload}
                          label={`Data: ${payload[0].payload.date}`}
                        />
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Line 
                  yAxisId="left" 
                  type="monotone" 
                  dataKey="voltage" 
                  name="Tensão (V)" 
                  stroke="#F59E0B" 
                  activeDot={{ r: 8 }} 
                />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="current" 
                  name="Corrente (A)" 
                  stroke="#3B82F6" 
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
        
        {/* Gráfico de Status da Bateria */}
        <Card>
          <CardHeader>
            <CardTitle>Status da Bateria</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ChartContainer
              className="h-full"
              config={{
                batteryPercentage: {
                  label: "Nível da Bateria",
                  theme: { 
                    light: "#10B981", 
                    dark: "#10B981" 
                  },
                },
              }}
            >
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <ChartTooltipContent 
                          active={active}
                          payload={payload}
                          label={`Data: ${payload[0].payload.date}`}
                          formatter={(value) => `${value}%`}
                        />
                      );
                    }
                    return null;
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="batteryPercentage" 
                  name="Nível da Bateria (%)" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  dot={{ stroke: '#10B981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
