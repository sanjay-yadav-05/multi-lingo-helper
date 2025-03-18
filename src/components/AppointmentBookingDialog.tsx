
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { format, addDays, isAfter, isBefore, startOfDay } from "date-fns";

interface AppointmentBookingDialogProps {
  open: boolean;
  ticketId: string;
  onClose: () => void;
}

// Simulate available time slots for the next 7 days
const generateTimeSlots = () => {
  const slots = [];
  // Create time slots from 11 AM to 4 PM with 30-minute intervals
  for (let hour = 11; hour < 16; hour++) {
    slots.push(`${hour}:00`);
    slots.push(`${hour}:30`);
  }
  return slots;
};

const timeSlots = generateTimeSlots();

const AppointmentBookingDialog: React.FC<AppointmentBookingDialogProps> = ({
  open,
  ticketId,
  onClose,
}) => {
  const today = new Date();
  const maxDate = addDays(today, 7); // 1 week window
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleBookAppointment = () => {
    if (!selectedDate || !selectedTime) {
      toast.error("Please select both date and time for your appointment");
      return;
    }

    // In a real application, this would send data to your backend
    toast.success(`Appointment booked successfully for ${format(selectedDate, "PPP")} at ${selectedTime}`);
    onClose();
  };

  // Function to check if a date is within the allowed range (next 7 days)
  const isDateInRange = (date: Date) => {
    return (
      isAfter(date, startOfDay(today)) &&
      isBefore(date, addDays(startOfDay(maxDate), 1))
    );
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Book an Appointment</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Select a Date</h3>
            <p className="text-xs text-muted-foreground">
              Appointments are available for the next 7 days.
            </p>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => !isDateInRange(date)}
              className="rounded-md border"
            />
          </div>
          
          {selectedDate && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Select a Time</h3>
              <p className="text-xs text-muted-foreground">
                Available from 11:00 AM to 4:00 PM
              </p>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "text-xs",
                      selectedTime === time && "bg-primary text-primary-foreground"
                    )}
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleBookAppointment} 
            disabled={!selectedDate || !selectedTime}
          >
            Book Appointment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentBookingDialog;
