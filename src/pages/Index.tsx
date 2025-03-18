
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to dashboard
    navigate("/dashboard");
  }, [navigate]);
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/20 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl">Redirecting to Dashboard...</h1>
      </div>
    </main>
  );
};

export default Index;
