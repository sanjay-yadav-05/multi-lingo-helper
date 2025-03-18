
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import VoiceAssistant from "@/components/VoiceAssistant";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

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
        
        <Alert className="mb-6 border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <AlertTitle>Bank Approval Required</AlertTitle>
          <AlertDescription className="text-sm text-blue-700 dark:text-blue-300">
            All submitted tickets need to be reviewed and approved by our bank staff before proceeding.
            Once approved, you will be able to book an appointment.
          </AlertDescription>
        </Alert>
        
        <VoiceAssistant />
      </div>
    </main>
  );
};

export default CreateTicket;
