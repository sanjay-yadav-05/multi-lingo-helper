
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import VoiceAssistant from "@/components/VoiceAssistant";

const CreateTicket = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container py-4">
        <Button 
          variant="ghost" 
          className="mb-4 gap-2" 
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
        
        <VoiceAssistant />
      </div>
    </main>
  );
};

export default CreateTicket;
