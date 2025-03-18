
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Star } from "lucide-react";

interface FeedbackDialogProps {
  open: boolean;
  ticketId: string;
  onClose: () => void;
  onSubmit: () => void;
}

const FeedbackDialog: React.FC<FeedbackDialogProps> = ({
  open,
  ticketId,
  onClose,
  onSubmit,
}) => {
  const [rating, setRating] = useState<string | null>(null);
  const [comment, setComment] = useState<string>("");

  const handleSubmitFeedback = () => {
    if (!rating) {
      toast.error("Please provide a satisfaction rating");
      return;
    }

    // In a real application, this would send data to your backend
    toast.success("Thank you for your feedback!");
    
    // Log the feedback to console (for demonstration purposes)
    console.log("Feedback submitted:", {
      ticketId,
      rating,
      comment
    });
    
    // Call the callback to mark feedback as submitted
    onSubmit();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Service Feedback</DialogTitle>
          <DialogDescription>
            Please share your feedback on how we handled your query.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <Label htmlFor="rating">How satisfied were you with our service?</Label>
            <RadioGroup 
              value={rating || ""} 
              onValueChange={setRating}
              className="flex justify-between pt-2"
            >
              {[1, 2, 3, 4, 5].map((value) => (
                <div key={value} className="flex flex-col items-center gap-1">
                  <RadioGroupItem 
                    value={value.toString()} 
                    id={`rating-${value}`} 
                    className="sr-only peer"
                  />
                  <Label
                    htmlFor={`rating-${value}`}
                    className="flex flex-col items-center cursor-pointer peer-data-[state=checked]:text-primary"
                  >
                    <Star 
                      className={`h-8 w-8 ${
                        rating && parseInt(rating) >= value 
                          ? "fill-amber-500 text-amber-500" 
                          : "text-muted-foreground"
                      }`}
                    />
                    <span className="text-xs">{value}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="comments">Additional comments (optional)</Label>
            <Textarea
              id="comments"
              placeholder="Tell us more about your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmitFeedback}>
            Submit Feedback
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;
