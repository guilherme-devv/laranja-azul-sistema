
import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AnimatedSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  buttonText?: string;
}

export default function AnimatedSuccessModal({
  isOpen,
  onClose,
  title,
  description,
  buttonText = "Continuar",
}: AnimatedSuccessModalProps) {
  const [showAnimation, setShowAnimation] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      // Small delay to trigger animation after modal opens
      const timer = setTimeout(() => {
        setShowAnimation(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setShowAnimation(false);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-white p-6 sm:p-8 max-w-md mx-auto rounded-xl">
        <div className="flex flex-col items-center text-center space-y-5">
          <div 
            className={`relative transition-all duration-700 ${
              showAnimation ? "scale-100 opacity-100" : "scale-50 opacity-0"
            }`}
          >
            <div className="absolute inset-0 bg-green-100 rounded-full animate-pulse opacity-50 scale-125"></div>
            <CheckCircle2 
              className="h-24 w-24 text-brand-green-dark relative z-10" 
              strokeWidth={1.5} 
            />
          </div>
          
          <div 
            className={`space-y-3 transition-all duration-700 delay-300 ${
              showAnimation ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
            {description && <p className="text-gray-500">{description}</p>}
          </div>

          <Button 
            onClick={onClose}
            className={`btn-primary w-full transition-all duration-700 delay-500 ${
              showAnimation ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            {buttonText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
