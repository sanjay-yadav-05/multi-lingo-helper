
import React from "react";
import { cn } from "@/lib/utils";

interface VoiceWaveAnimationProps {
  isActive: boolean;
  className?: string;
}

const VoiceWaveAnimation: React.FC<VoiceWaveAnimationProps> = ({ 
  isActive, 
  className 
}) => {
  return (
    <div className={cn(
      "wave-animation", 
      isActive ? "opacity-100" : "opacity-0",
      className
    )}>
      <span className={cn("animate-wave-1", isActive ? "bg-primary" : "bg-muted-foreground/30")} />
      <span className={cn("animate-wave-2", isActive ? "bg-primary" : "bg-muted-foreground/30")} />
      <span className={cn("animate-wave-3", isActive ? "bg-primary" : "bg-muted-foreground/30")} />
      <span className={cn("animate-wave-4", isActive ? "bg-primary" : "bg-muted-foreground/30")} />
      <span className={cn("animate-wave-5", isActive ? "bg-primary" : "bg-muted-foreground/30")} />
    </div>
  );
};

export default VoiceWaveAnimation;
