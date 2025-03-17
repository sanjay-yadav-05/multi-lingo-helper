
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
}

interface LanguageSelectorProps {
  onSelect: (language: string) => void;
  selectedLanguage: string | null;
  className?: string;
}

const languages: LanguageOption[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिंदी" },
  { code: "mr", name: "Marathi", nativeName: "मराठी" },
];

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  onSelect,
  selectedLanguage,
  className,
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "flex flex-col space-y-4 items-center",
        className
      )}
    >
      <div className="grid grid-cols-3 gap-3">
        {languages.map((language) => (
          <Button
            key={language.code}
            variant={selectedLanguage === language.code ? "default" : "outline"}
            onClick={() => onSelect(language.code)}
            className={cn(
              "relative overflow-hidden px-5 py-6 h-auto transition-all duration-300 border-2",
              selectedLanguage === language.code 
                ? "border-primary shadow-md" 
                : "border-border hover:border-primary/50",
              "btn-animation"
            )}
          >
            <div className="flex flex-col items-center gap-1">
              <span className="text-base font-medium">{language.name}</span>
              <span className="text-sm opacity-80">{language.nativeName}</span>
            </div>
            {selectedLanguage === language.code && (
              <motion.div
                layoutId="selectedLanguage"
                className="absolute bottom-0 left-0 h-1 w-full bg-primary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </Button>
        ))}
      </div>
    </motion.div>
  );
};

export default LanguageSelector;
