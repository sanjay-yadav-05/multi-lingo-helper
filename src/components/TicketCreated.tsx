
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle2, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface TicketCreatedProps {
  language: string;
  ticketId: string;
  onNewTicket: () => void;
  className?: string;
}

const TicketCreated: React.FC<TicketCreatedProps> = ({
  language,
  ticketId,
  onNewTicket,
  className,
}) => {
  const successText = {
    en: "Support ticket created successfully!",
    hi: "सपोर्ट टिकट सफलतापूर्वक बनाया गया!",
    mr: "समर्थन तिकीट यशस्वीरित्या तयार केले!"
  };

  const ticketText = {
    en: "Ticket ID",
    hi: "टिकट आईडी",
    mr: "तिकीट आयडी"
  };

  const newTicketText = {
    en: "Create New Ticket",
    hi: "नया टिकट बनाएं",
    mr: "नवीन तिकीट तयार करा"
  };

  const currentLanguage = ["en", "hi", "mr"].includes(language) ? language : "en";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "flex flex-col items-center justify-center space-y-6 p-8 text-center",
        className
      )}
    >
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
        className="rounded-full bg-primary/10 p-4 text-primary"
      >
        <CheckCircle2 className="h-12 w-12" />
      </motion.div>
      
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">
          {successText[currentLanguage as keyof typeof successText]}
        </h2>
        
        <div className="flex items-center justify-center gap-2 font-mono text-base">
          <span className="text-sm text-muted-foreground">
            {ticketText[currentLanguage as keyof typeof ticketText]}:
          </span>
          <span className="font-medium text-foreground">{ticketId}</span>
        </div>
      </div>
      
      <Button 
        variant="outline"
        className="gap-2 mt-4 btn-animation"
        onClick={onNewTicket}
      >
        <RotateCcw className="h-4 w-4" />
        {newTicketText[currentLanguage as keyof typeof newTicketText]}
      </Button>
    </motion.div>
  );
};

export default TicketCreated;
