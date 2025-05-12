
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import AnimatedSuccessModal from './AnimatedSuccessModal';

export default function SuccessModalDemo() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-6">
      <h2 className="text-2xl font-bold text-center">Modal de Sucesso Animado</h2>
      <p className="text-gray-500 text-center">Clique no botão abaixo para ver o modal animado</p>
      <Button onClick={openModal} className="btn-primary">
        Abrir Modal de Sucesso
      </Button>
      
      <AnimatedSuccessModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Operação Concluída!"
        description="Sua ação foi realizada com sucesso."
      />
    </div>
  );
}
