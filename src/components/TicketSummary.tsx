
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TicketSummaryProps {
  language: string;
  category: string;
  summary: string;
  onConfirm: () => void;
  onEdit: () => void;
  className?: string;
}

const TicketSummary: React.FC<TicketSummaryProps> = ({
  language,
  category,
  summary,
  onConfirm,
  onEdit,
  className,
}) => {
  const confirmationText = {
    en: "Does this correctly summarize your issue?",
    hi: "क्या यह सही सारांश है?",
    mr: "ही माहिती योग्य आहे का?"
  };

  const buttonTextYes = {
    en: "Yes, Correct",
    hi: "हां, सही है",
    mr: "होय, बरोबर आहे"
  };

  const buttonTextNo = {
    en: "No, Edit",
    hi: "नहीं, संपादित करें",
    mr: "नाही, संपादित करा"
  };

  const currentLanguage = ["en", "hi", "mr"].includes(language) ? language : "en";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "flex flex-col space-y-4 p-6 border border-border rounded-xl glass",
        className
      )}
    >
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-foreground">
          {summary}
        </h3>
        <p className="text-sm text-muted-foreground">
          {confirmationText[currentLanguage as keyof typeof confirmationText]}
        </p>
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          variant="default"
          className="flex-1 gap-2 btn-animation"
          onClick={onConfirm}
        >
          <Check className="h-4 w-4" />
          {buttonTextYes[currentLanguage as keyof typeof buttonTextYes]}
        </Button>
        
        <Button
          variant="outline"
          className="flex-1 gap-2 btn-animation"
          onClick={onEdit}
        >
          <X className="h-4 w-4" />
          {buttonTextNo[currentLanguage as keyof typeof buttonTextNo]}
        </Button>
      </div>
    </motion.div>
  );
};

export default TicketSummary;
