
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, Upload, Save, Send } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const maintenanceReportSchema = z.object({
  // Início
  maintenanceType: z.enum(["preventiva", "corretiva"]),
  reactive: z.number().min(0),
  dateTime: z.date(),
  startImage: z.any().optional(),
  
  // 1ª etapa - Inspeção Visual
  generalViewImage: z.any().optional(),
  generalViewStatus: z.string().min(1),
  mainEquipmentImage: z.any().optional(),
  mainEquipmentStatus: z.enum(["otimo", "razoavel", "deteriorado", "fora_funcionamento"]),
  electricalConnectionsImage: z.any().optional(),
  electricalConnections: z.string().min(1),
  ventilationImage: z.any().optional(),
  ventilationStatus: z.enum(["otimo", "razoavel", "deteriorado", "fora_funcionamento"]),
  torqueValues: z.string().min(1),
  additionalObservationsImage: z.any().optional(),
  additionalObservations: z.string().optional(),
  
  // 2ª etapa - Testes de Segurança
  testEquipmentImage: z.any().optional(),
  testEquipment: z.string().min(1),
  isolationTestImage: z.any().optional(),
  isolationTestResult: z.number().min(0),
  groundingTestImage: z.any().optional(),
  groundingTestResult: z.number().min(0),
  inputCurrentImage: z.any().optional(),
  inputCurrent: z.number().min(0),
  outputCurrentImage: z.any().optional(),
  outputCurrent: z.number().min(0),
  inputVoltageImage: z.any().optional(),
  inputVoltage: z.number().min(0),
  outputVoltageImage: z.any().optional(),
  outputVoltage: z.number().min(0),
  protectionVerificationImage: z.any().optional(),
  protectionVerification: z.string().min(1),
  
  // 3ª etapa - Inicialização
  bmsScreenImage: z.any().optional(),
  bmsParameters: z.string().min(1),
  invertersImage: z.any().optional(),
  invertersOperation: z.string().min(1),
  controlSystemImage: z.any().optional(),
  controlSystem: z.string().min(1),
  communicationStatus: z.string().min(1),
  programmedParameters: z.string().min(1),
  batteryInitialState: z.string().min(1),
  
  // 4ª etapa - Testes Funcionais
  monitoringScreensImage: z.any().optional(),
  monitoringScreens: z.string().min(1),
  chargeDischargeGraphsImage: z.any().optional(),
  chargeDischargeGraphs: z.string().min(1),
  responseTimesLimits: z.string().min(1),
  integrationOtherSources: z.string().min(1),
  
  // 5ª etapa - Supervisão
  scadaScreensImage: z.any().optional(),
  scadaScreens: z.string().min(1),
  automaticReportsImage: z.any().optional(),
  automaticReports: z.string().min(1),
  logEvents: z.string().min(1),
  
  // 6ª etapa - Entrega Final
  participatingTeam: z.string().min(1),
  testSchedules: z.string().min(1),
  technicianSignature: z.string().min(1),
  managerSignatureImage: z.any().optional(),
});

type MaintenanceReportFormData = z.infer<typeof maintenanceReportSchema>;

interface MaintenanceReportFormProps {
  orderId?: string;
}

export default function MaintenanceReportForm({ orderId }: MaintenanceReportFormProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  
  const form = useForm<MaintenanceReportFormData>({
    resolver: zodResolver(maintenanceReportSchema),
    defaultValues: {
      reactive: 0,
      isolationTestResult: 0,
      groundingTestResult: 0,
      inputCurrent: 0,
      outputCurrent: 0,
      inputVoltage: 0,
      outputVoltage: 0,
    }
  });

  const steps = [
    { title: "Início", color: "bg-orange-500" },
    { title: "1ª etapa - Inspeção Visual", color: "bg-blue-500" },
    { title: "2ª etapa - Testes de Segurança", color: "bg-yellow-500" },
    { title: "3ª etapa - Inicialização", color: "bg-green-500" },
    { title: "4ª etapa - Testes Funcionais", color: "bg-red-500" },
    { title: "5ª etapa - Supervisão", color: "bg-amber-600" },
    { title: "6ª etapa - Entrega Final", color: "bg-gray-800" }
  ];

  const onSubmit = (data: MaintenanceReportFormData) => {
    console.log("Relatório de manutenção:", data);
    toast({
      title: "Relatório Salvo",
      description: "O relatório de manutenção foi salvo com sucesso."
    });
    navigate("/manutencoes");
  };

  const handleSaveDraft = () => {
    toast({
      title: "Rascunho Salvo",
      description: "O progresso foi salvo como rascunho."
    });
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="maintenanceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de manutenção *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="preventiva">Preventiva</SelectItem>
                      <SelectItem value="corretiva">Corretiva</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="reactive"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reativo (VAr) *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="dateTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data e Hora *</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Selecionar data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div>
              <Label>Imagem do ensaio</Label>
              <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">Clique para fazer upload da imagem</p>
              </div>
            </div>
          </div>
        );
      
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label>Vista geral do sistema *</Label>
              <div className="mt-2 space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">Upload da imagem</p>
                </div>
                <FormField
                  control={form.control}
                  name="generalViewStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva o estado geral do sistema..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div>
              <Label>Equipamentos principais *</Label>
              <div className="mt-2 space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">Upload da imagem</p>
                </div>
                <FormField
                  control={form.control}
                  name="mainEquipmentStatus"
                  render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecionar estado" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="otimo">Ótimo</SelectItem>
                          <SelectItem value="razoavel">Razoável</SelectItem>
                          <SelectItem value="deteriorado">Deteriorado</SelectItem>
                          <SelectItem value="fora_funcionamento">Fora de funcionamento</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            {/* Add more fields for this step */}
          </div>
        );
      
      // Add cases for steps 2-6 with similar structure
      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-500">Etapa em desenvolvimento...</p>
          </div>
        );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium",
                  index === currentStep
                    ? `${step.color} text-white`
                    : index < currentStep
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-700"
                )}
              >
                <span className="w-6 h-6 rounded-full bg-white bg-opacity-30 flex items-center justify-center text-xs">
                  {index + 1}
                </span>
                <span className="hidden sm:block">{step.title}</span>
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-brand-orange h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className={cn("w-4 h-4 rounded-full", steps[currentStep].color)} />
              <span>{steps[currentStep].title}</span>
            </CardTitle>
            <CardDescription>
              Preencha os dados da {steps[currentStep].title.toLowerCase()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation buttons */}
        <div className="flex justify-between">
          <div className="space-x-2">
            <Button type="button" variant="outline" onClick={handleSaveDraft}>
              <Save className="mr-2 h-4 w-4" />
              Salvar Rascunho
            </Button>
            {currentStep > 0 && (
              <Button type="button" variant="outline" onClick={prevStep}>
                Anterior
              </Button>
            )}
          </div>
          
          <div className="space-x-2">
            {currentStep < steps.length - 1 ? (
              <Button type="button" onClick={nextStep}>
                Próximo
              </Button>
            ) : (
              <Button type="submit" className="bg-brand-orange hover:bg-brand-orange/90">
                <Send className="mr-2 h-4 w-4" />
                Finalizar Relatório
              </Button>
            )}
          </div>
        </div>
      </form>
    </Form>
  );
}
