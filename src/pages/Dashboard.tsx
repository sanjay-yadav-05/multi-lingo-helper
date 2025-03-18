
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, ChevronRight, Clock, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppointmentBookingDialog from "@/components/AppointmentBookingDialog";

// Mock data for tickets, in a real app this would come from an API
const mockTickets = [
  {
    id: "123456",
    category: "loan",
    description: "Loan application status inquiry",
    status: "pending",
    date: "2023-06-15",
    language: "en",
  },
  {
    id: "234567",
    category: "savings",
    description: "Interest rate query for savings account",
    status: "approved",
    date: "2023-06-10",
    language: "hi",
  },
  {
    id: "345678",
    category: "fraud",
    description: "Unauthorized transaction report",
    status: "resolved",
    date: "2023-06-05",
    language: "en",
  },
  {
    id: "456789",
    category: "creditcard",
    description: "Credit card limit increase request",
    status: "approved",
    date: "2023-06-01",
    language: "mr",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const handleCreateTicket = () => {
    navigate("/create-ticket");
  };

  const handleBookAppointment = (ticketId: string) => {
    setSelectedTicket(ticketId);
    setIsBookingOpen(true);
  };

  // Translate category keys to display names
  const getCategoryName = (category: string): string => {
    const categories: Record<string, string> = {
      loan: "Loan",
      savings: "Savings Account",
      current: "Current Account",
      creditcard: "Credit Card",
      fraud: "Fraud Report",
      other: "Other",
    };
    
    return categories[category] || category;
  };

  // Get status badge color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "resolved":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">Service Tickets Dashboard</h1>
          <Button onClick={handleCreateTicket} className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Create New Ticket
          </Button>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {mockTickets.map((ticket) => (
            <Card key={ticket.id} className="transition-all hover:shadow-md">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">#{ticket.id}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                        {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="space-y-1">
                      <h3 className="font-medium">{getCategoryName(ticket.category)}</h3>
                      <p className="text-sm text-muted-foreground">{ticket.description}</p>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <CalendarDays className="h-3 w-3" />
                        <span>{ticket.date}</span>
                      </div>
                    </div>
                  </div>
                  
                  {ticket.status === "approved" && (
                    <Button 
                      variant="outline" 
                      className="mt-4 md:mt-0 gap-2"
                      onClick={() => handleBookAppointment(ticket.id)}
                    >
                      <Clock className="h-4 w-4" />
                      Book Appointment
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {selectedTicket && (
        <AppointmentBookingDialog
          open={isBookingOpen}
          ticketId={selectedTicket}
          onClose={() => {
            setIsBookingOpen(false);
            setSelectedTicket(null);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
