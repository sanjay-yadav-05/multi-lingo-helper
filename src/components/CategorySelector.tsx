
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CreditCard, BanknoteIcon, Building, AlertCircle, AlertTriangle, HelpCircle } from "lucide-react";

interface CategoryOption {
  id: string;
  name: {
    en: string;
    hi: string;
    mr: string;
  };
  icon: React.ReactNode;
}

interface CategorySelectorProps {
  language: string;
  onSelect: (category: string) => void;
  selectedCategory: string | null;
  className?: string;
}

const categories: CategoryOption[] = [
  { 
    id: "loan", 
    name: {
      en: "Loan",
      hi: "लोन",
      mr: "कर्ज"
    },
    icon: <BanknoteIcon className="h-6 w-6" />
  },
  { 
    id: "savings", 
    name: {
      en: "Savings Account",
      hi: "सेविंग अकाउंट",
      mr: "बचत खाते"
    },
    icon: <Building className="h-6 w-6" />
  },
  { 
    id: "current", 
    name: {
      en: "Current Account",
      hi: "करेंट अकाउंट",
      mr: "चालू खाते"
    },
    icon: <Building className="h-6 w-6" />
  },
  { 
    id: "creditcard", 
    name: {
      en: "Credit Card",
      hi: "क्रेडिट कार्ड",
      mr: "क्रेडिट कार्ड"
    },
    icon: <CreditCard className="h-6 w-6" />
  },
  { 
    id: "fraud", 
    name: {
      en: "Fraud Report",
      hi: "फ्रॉड रिपोर्ट",
      mr: "फसवणूक अहवाल"
    },
    icon: <AlertTriangle className="h-6 w-6" />
  },
  { 
    id: "other", 
    name: {
      en: "Other",
      hi: "अन्य",
      mr: "इतर"
    },
    icon: <HelpCircle className="h-6 w-6" />
  },
];

const CategorySelector: React.FC<CategorySelectorProps> = ({
  language,
  onSelect,
  selectedCategory,
  className,
}) => {
  // Default to English if language is not supported
  const currentLanguage = ["en", "hi", "mr"].includes(language) ? language : "en";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
      className={cn("grid grid-cols-2 gap-3", className)}
    >
      {categories.map((category) => (
        <Button
          key={category.id}
          variant="outline"
          onClick={() => onSelect(category.id)}
          className={cn(
            "flex items-center gap-3 h-auto p-4 transition-all duration-300 border-2",
            selectedCategory === category.id 
              ? "border-primary bg-primary/5 shadow-sm" 
              : "border-border hover:border-primary/30 hover:bg-primary/5",
            "btn-animation justify-start"
          )}
        >
          <div className={cn(
            "rounded-full p-2",
            selectedCategory === category.id 
              ? "bg-primary/10 text-primary" 
              : "bg-muted text-muted-foreground"
          )}>
            {category.icon}
          </div>
          <span>{category.name[currentLanguage as keyof typeof category.name]}</span>
        </Button>
      ))}
    </motion.div>
  );
};

export default CategorySelector;
