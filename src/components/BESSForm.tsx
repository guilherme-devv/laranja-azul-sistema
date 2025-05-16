
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import AnimatedSuccessModal from "./AnimatedSuccessModal";

// Define the form schema with validation
const formSchema = z.object({
  manufacturer: z.string().min(1, "Fabricante é obrigatório"),
  model: z.string().min(1, "Modelo é obrigatório"),
  serialNumber: z.string().min(1, "Número de série é obrigatório"),
  capacity: z.string().min(1, "Capacidade é obrigatória"),
  voltage: z.string().min(1, "Tensão nominal é obrigatória"),
  batteryCapacity: z.string().min(1, "Capacidade da bateria é obrigatória"),
  cellType: z.string().min(1, "Tipo de célula é obrigatório"),
  power: z.string().min(1, "Potência é obrigatória"),
  installationAddress: z.string().min(1, "Endereço de instalação é obrigatório"),
  energySource: z.string().min(1, "Fonte de energia é obrigatória"),
  acquisitionValue: z.string().min(1, "Valor de aquisição é obrigatório"),
});

type FormData = z.infer<typeof formSchema>;

export default function BESSForm() {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      manufacturer: "",
      model: "",
      serialNumber: "",
      capacity: "",
      voltage: "",
      batteryCapacity: "",
      cellType: "",
      power: "",
      installationAddress: "",
      energySource: "Solar",
      acquisitionValue: "",
    },
  });

  const onSubmit = (data: FormData) => {
    console.log("Form data submitted:", data);
    // Here you would typically save the data to a database
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    form.reset();
  };

  return (
    <>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-brand-orange">
            Cadastro de Sistema BESS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="manufacturer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fabricante</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do fabricante" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Modelo</FormLabel>
                      <FormControl>
                        <Input placeholder="Modelo do sistema" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="serialNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de Série</FormLabel>
                      <FormControl>
                        <Input placeholder="ID do equipamento" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacidade (kWh)</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Ex: 10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="voltage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tensão Nominal (V)</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Ex: 220" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="batteryCapacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacidade da Bateria (Ah)</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Ex: 100" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cellType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Célula</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Li-ion" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="power"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Potência</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 5kW" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="energySource"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fonte de Energia</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a fonte de energia" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Solar">Solar</SelectItem>
                          <SelectItem value="Eólica">Eólica</SelectItem>
                          <SelectItem value="Rede">Rede</SelectItem>
                          <SelectItem value="Híbrida">Híbrida</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="acquisitionValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor de Aquisição (R$)</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Ex: 50000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="installationAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço de Instalação</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Endereço completo do local de instalação" 
                        className="min-h-[80px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <CardFooter className="px-0 flex justify-end">
                <Button type="submit" className="btn-primary w-full md:w-auto">
                  Salvar
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>

      <AnimatedSuccessModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Sistema BESS Cadastrado"
        description="O sistema BESS foi cadastrado com sucesso!"
        buttonText="Fechar"
      />
    </>
  );
}
