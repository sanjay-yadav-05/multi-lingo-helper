
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, StopCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import VoiceWaveAnimation from "./VoiceWaveAnimation";

interface MicrophoneButtonProps {
  isRecording: boolean;
  isProcessing: boolean;
  onClick: () => void;
  className?: string;
}

const MicrophoneButton: React.FC<MicrophoneButtonProps> = ({
  isRecording,
  isProcessing,
  onClick,
  className,
}) => {
  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <Button
        size="lg"
        variant={isRecording ? "destructive" : "default"}
        className={cn(
          "h-16 w-16 rounded-full p-0 record-button",
          isRecording && "recording",
          "shadow-lg hover:shadow-xl transition-all duration-300"
        )}
        onClick={onClick}
        disabled={isProcessing}
      >
        <motion.div
          animate={isRecording ? { scale: [1, 1.05, 1] } : { scale: 1 }}
          transition={{ repeat: isRecording ? Infinity : 0, duration: 1.5 }}
        >
          {isRecording ? <StopCircle className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
        </motion.div>
      </Button>
      
      <div className="h-6 flex items-center justify-center">
        {isRecording && <VoiceWaveAnimation isActive={true} />}
        {isProcessing && (
          <span className="text-sm text-muted-foreground animate-pulse">
            Processing...
          </span>
        )}
        {!isRecording && !isProcessing && (
          <span className="text-sm text-muted-foreground">
            Tap to speak
          </span>
        )}
      </div>
    </div>
  );
};

export default MicrophoneButton;
