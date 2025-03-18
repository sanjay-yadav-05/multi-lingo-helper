
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CalendarDays, 
  ChevronRight, 
  Clock, 
  MessageSquare, 
  PlusCircle, 
  Star 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppointmentBookingDialog from "@/components/AppointmentBookingDialog";
import FeedbackDialog from "@/components/FeedbackDialog";
import { useTickets, Ticket } from "@/context/TicketContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { tickets, updateTicket } = useTickets();
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const handleCreateTicket = () => {
    navigate("/create-ticket");
  };

  const handleBookAppointment = (ticketId: string) => {
    setSelectedTicket(ticketId);
    setIsBookingOpen(true);
  };
  
  const handleAppointmentBooked = (ticketId: string) => {
    // Get current date and add 5 days for the appointment
    const currentDate = new Date();
    const appointmentDate = new Date(currentDate);
    appointmentDate.setDate(currentDate.getDate() + 5);
    
    // Format the appointment date and time
    const appointmentDateTime = `${appointmentDate.getFullYear()}-${String(appointmentDate.getMonth() + 1).padStart(2, '0')}-${String(appointmentDate.getDate()).padStart(2, '0')} ${String(appointmentDate.getHours()).padStart(2, '0')}:${String(appointmentDate.getMinutes()).padStart(2, '0')}`;
    
    // Update ticket status to "in_progress" and mark appointment as booked
    updateTicket(ticketId, { 
      status: "in_progress", 
      appointmentBooked: true,
      appointmentDateTime: appointmentDateTime
    });
    setIsBookingOpen(false);
    setSelectedTicket(null);
  };
  
  const handleGiveFeedback = (ticketId: string) => {
    setSelectedTicket(ticketId);
    setIsFeedbackOpen(true);
  };
  
  const handleFeedbackSubmitted = (ticketId: string) => {
    // In a real app, you would store the feedback in a database
    setIsFeedbackOpen(false);
    setSelectedTicket(null);
    
    // Update ticket to show feedback has been given
    updateTicket(ticketId, { feedbackGiven: true });
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
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  // Get status display name
  const getStatusName = (status: string): string => {
    switch (status) {
      case "pending":
        return "Pending";
      case "approved":
        return "Approved";
      case "in_progress":
        return "In Progress";
      case "resolved":
        return "Resolved";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
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
          {tickets.map((ticket) => (
            <Card key={ticket.id} className="transition-all hover:shadow-md">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">#{ticket.id}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                        {getStatusName(ticket.status)}
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
                      {ticket.appointmentBooked && (
                        <div className="flex items-center gap-1 text-blue-600">
                          <Clock className="h-3 w-3" />
                          <span>
                            Appointment Booked
                            {ticket.status === "in_progress" && ticket.appointmentDateTime && (
                              <span className="ml-1">({ticket.appointmentDateTime})</span>
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-0 flex gap-2">
                    {ticket.status === "approved" && !ticket.appointmentBooked && (
                      <Button 
                        variant="outline" 
                        className="gap-2"
                        onClick={() => handleBookAppointment(ticket.id)}
                      >
                        <Clock className="h-4 w-4" />
                        Book Appointment
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    )}
                    
                    {ticket.status === "resolved" && !ticket.feedbackGiven && (
                      <Button 
                        variant="outline" 
                        className="gap-2"
                        onClick={() => handleGiveFeedback(ticket.id)}
                      >
                        <MessageSquare className="h-4 w-4" />
                        Give Feedback
                      </Button>
                    )}
                    
                    {ticket.feedbackGiven && (
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="h-4 w-4 fill-amber-500" />
                        <span className="text-xs">Feedback Provided</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {selectedTicket && (
        <>
          <AppointmentBookingDialog
            open={isBookingOpen}
            ticketId={selectedTicket}
            onClose={() => {
              setIsBookingOpen(false);
              setSelectedTicket(null);
            }}
            onBooked={() => handleAppointmentBooked(selectedTicket)}
          />
          
          <FeedbackDialog
            open={isFeedbackOpen}
            ticketId={selectedTicket}
            onClose={() => {
              setIsFeedbackOpen(false);
              setSelectedTicket(null);
            }}
            onSubmit={() => handleFeedbackSubmitted(selectedTicket)}
          />
        </>
      )}
    </div>
  );
};

export default Dashboard;
