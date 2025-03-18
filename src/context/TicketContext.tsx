
import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the Ticket interface (matching what's in Dashboard)
export interface Ticket {
  id: string;
  category: string;
  description: string;
  status: string;
  date: string;
  language: string;
  appointmentBooked: boolean;
  feedbackGiven?: boolean;
}

// Mock data for initial tickets
const initialTickets: Ticket[] = [
  {
    id: "123456",
    category: "loan",
    description: "Loan application status inquiry",
    status: "pending",
    date: "2023-06-15",
    language: "en",
    appointmentBooked: false,
  },
  {
    id: "234567",
    category: "savings",
    description: "Interest rate query for savings account",
    status: "approved",
    date: "2023-06-10",
    language: "hi",
    appointmentBooked: false,
  },
  {
    id: "345678",
    category: "fraud",
    description: "Unauthorized transaction report",
    status: "resolved",
    date: "2023-06-05",
    language: "en",
    appointmentBooked: false,
    feedbackGiven: false,
  },
  {
    id: "456789",
    category: "creditcard",
    description: "Credit card limit increase request",
    status: "in_progress",
    date: "2023-06-01",
    language: "mr",
    appointmentBooked: true,
  },
];

// Define the context type
interface TicketContextType {
  tickets: Ticket[];
  addTicket: (ticket: Ticket) => void;
  updateTicket: (id: string, updates: Partial<Ticket>) => void;
}

// Create the context
export const TicketContext = createContext<TicketContextType | undefined>(undefined);

// Custom hook for using the ticket context
export const useTickets = () => {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error("useTickets must be used within a TicketProvider");
  }
  return context;
};

// Provider component
export const TicketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);

  const addTicket = (ticket: Ticket) => {
    setTickets((prevTickets) => [...prevTickets, ticket]);
  };

  const updateTicket = (id: string, updates: Partial<Ticket>) => {
    setTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket.id === id ? { ...ticket, ...updates } : ticket
      )
    );
  };

  return (
    <TicketContext.Provider value={{ tickets, addTicket, updateTicket }}>
      {children}
    </TicketContext.Provider>
  );
};
