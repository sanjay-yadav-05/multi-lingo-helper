
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import LanguageSelector from "./LanguageSelector";
import CategorySelector from "./CategorySelector";
import MicrophoneButton from "./MicrophoneButton";
import TicketSummary from "./TicketSummary";
import TicketCreated from "./TicketCreated";
import { getSpeechRecognition } from "@/utils/speechRecognition";
import { getSpeechSynthesis } from "@/utils/speechSynthesis";
import { translations } from "@/utils/translations";
import { detectLanguage } from "@/utils/languageDetection";
import { detectCategory } from "@/utils/categoryDetection";

enum Step {
  LanguageSelection = "language",
  CategorySelection = "category",
  IssueDescription = "issue",
  Confirmation = "confirmation",
  TicketCreated = "completed"
}

const VoiceAssistant: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>(Step.LanguageSelection);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [userIssue, setUserIssue] = useState<string>("");
  const [issueSummary, setIssueSummary] = useState<string>("");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [ticketId, setTicketId] = useState<string>("");
  const [voicePromptActive, setVoicePromptActive] = useState<boolean>(false);
  const [voiceResponseText, setVoiceResponseText] = useState<string>("");
  
  const speechRecognition = useRef(getSpeechRecognition());
  const speechSynthesis = useRef(getSpeechSynthesis());
  
  // Helper function to get text based on current language
  const getText = (key: keyof typeof translations) => {
    if (!selectedLanguage) return translations[key].en;
    return translations[key][selectedLanguage as keyof typeof translations[typeof key]];
  };
  
  // Function to speak text with the selected language
  const speakText = async (text: string, language: string = selectedLanguage || "en") => {
    try {
      await speechSynthesis.current.speak(text, {
        language,
        rate: 1,
        pitch: 1
      });
    } catch (error) {
      console.error('Speech synthesis error:', error);
    }
  };
  
  // Handles recording of voice responses for both language and category selection
  const handleVoiceResponse = (forStep: "language" | "category") => {
    setVoicePromptActive(true);
    setVoiceResponseText("");
    setIsRecording(true);
    
    const lang = forStep === "language" ? "en" : selectedLanguage || "en";
    
    speechRecognition.current.setLanguage(lang);
    speechRecognition.current.start(
      // onResult callback
      (text, isFinal) => {
        setVoiceResponseText(text);
        
        if (isFinal) {
          if (forStep === "language") {
            const detectedLang = detectLanguage(text);
            if (detectedLang) {
              handleLanguageSelect(detectedLang);
            } else {
              toast.error("Language not recognized. Please select one from the options.");
              setIsRecording(false);
              setVoicePromptActive(false);
            }
          } else if (forStep === "category") {
            const detectedCat = detectCategory(text, selectedLanguage || "en");
            if (detectedCat) {
              handleCategorySelect(detectedCat);
            } else {
              toast.error(getText('selectCategory') + ". " + getText('errorSpeechRecognition'));
              setIsRecording(false);
              setVoicePromptActive(false);
            }
          }
        }
      },
      // onEnd callback
      () => {
        setIsRecording(false);
        setVoicePromptActive(false);
      },
      // onError callback
      (error) => {
        setIsRecording(false);
        setVoicePromptActive(false);
        toast.error(getText('errorSpeechRecognition'));
        console.error("Speech recognition error:", error);
      }
    );
  };
  
  // Handle language selection
  const handleLanguageSelect = async (language: string) => {
    setSelectedLanguage(language);
    
    // Set speech recognition language
    speechRecognition.current.setLanguage(language);
    
    // Speak language confirmation message
    await speakText(translations.languageConfirmation[language as keyof typeof translations.languageConfirmation], language);
    
    // Move to next step immediately to reduce delay
    setCurrentStep(Step.CategorySelection);
    
    // After a short delay, speak the category question
    setTimeout(async () => {
      await speakText(translations.categoryQuestion[language as keyof typeof translations.categoryQuestion], language);
      // Auto start voice response for category after speaking
      setTimeout(() => {
        handleVoiceResponse("category");
      }, 300);
    }, 300);
  };
  
  // Handle category selection
  const handleCategorySelect = async (category: string) => {
    setSelectedCategory(category);
    
    // Get localized category name if available
    const categoryName = translations.categories[category as keyof typeof translations.categories]?.[selectedLanguage as keyof typeof translations.categories.loan] || category;
    
    // Format the confirmation message with the category name
    const message = translations.categoryConfirmation[selectedLanguage as keyof typeof translations.categoryConfirmation]
      .replace("{category}", categoryName);
    
    // Speak category confirmation message
    await speakText(message);
    
    // Move to next step immediately to reduce delay
    setCurrentStep(Step.IssueDescription);
    
    // After a short delay, speak the issue prompt
    setTimeout(async () => {
      await speakText(translations.issuePrompt[selectedLanguage as keyof typeof translations.issuePrompt]);
    }, 300);
  };
  
  // Handle microphone button click
  const handleMicrophoneClick = () => {
    if (isRecording) {
      // Stop recording
      speechRecognition.current.stop();
      setIsRecording(false);
      setVoicePromptActive(false);
    } else {
      // Start recording based on current step
      if (currentStep === Step.LanguageSelection) {
        handleVoiceResponse("language");
      } else if (currentStep === Step.CategorySelection) {
        handleVoiceResponse("category");
      } else {
        // Regular issue description
        setIsRecording(true);
        
        speechRecognition.current.start(
          // onResult callback
          (text, isFinal) => {
            if (isFinal) {
              setUserIssue(text);
            }
          },
          // onEnd callback
          () => {
            setIsRecording(false);
            handleIssueRecorded();
          },
          // onError callback
          (error) => {
            setIsRecording(false);
            toast.error(getText('errorSpeechRecognition'));
            console.error("Speech recognition error:", error);
          }
        );
      }
    }
  };
  
  // Handle issue recorded
  const handleIssueRecorded = async () => {
    if (!userIssue.trim()) {
      toast.error('No speech detected. Please try again.');
      return;
    }
    
    setIsProcessing(true);
    
    // Get speech in the selected language but save in English for the backend
    const userIssueForDisplay = userIssue;
    
    // Simulate AI processing to generate a summary
    // In a real implementation, this would call an AI service
    setTimeout(() => {
      // Create a simplified summary from the user's issue
      // This is a very basic implementation - in reality you'd use an LLM
      const summary = generateSummary(userIssueForDisplay, selectedLanguage as string);
      setIssueSummary(summary);
      
      // Speak the generated summary
      speakText(summary);
      
      // Move to confirmation step immediately
      setCurrentStep(Step.Confirmation);
      setIsProcessing(false);
    }, 1000); // Reduced delay time
  };
  
  // Generate a simplified summary (mock implementation)
  const generateSummary = (issue: string, language: string): string => {
    // This is a simplified mock of what would normally be done with an AI model
    // In a real implementation, you would call an API to generate the summary
    
    // Just return the issue with a prefix based on language for this demo
    const prefixes = {
      en: "User reports: ",
      hi: "उपयोगकर्ता रिपोर्ट: ",
      mr: "वापरकर्ता अहवाल: "
    };
    
    return `${prefixes[language as keyof typeof prefixes]}${issue}`;
  };
  
  // Handle confirmation
  const handleConfirmSummary = () => {
    setIsProcessing(true);
    
    // Generate a random ticket ID
    const randomId = Math.floor(100000 + Math.random() * 900000).toString();
    setTicketId(randomId);
    
    // Get confirmation message in the selected language
    const confirmationMsg = getText('confirmSummary');
    speakText(confirmationMsg);
    
    // Simulate ticket creation with reduced delay
    setTimeout(() => {
      setCurrentStep(Step.TicketCreated);
      setIsProcessing(false);
      
      // Speak the ticket created message
      const ticketMsg = getText('ticketCreated');
      speakText(ticketMsg);
    }, 800); // Reduced delay time
  };
  
  // Handle edit (go back to issue description)
  const handleEditSummary = () => {
    setCurrentStep(Step.IssueDescription);
    
    // Speak the issue prompt again
    speakText(getText('describeIssue'));
  };
  
  // Reset the form to create a new ticket
  const handleNewTicket = () => {
    setSelectedLanguage(null);
    setSelectedCategory(null);
    setUserIssue("");
    setIssueSummary("");
    setCurrentStep(Step.LanguageSelection);
    
    // Speak welcome message again
    setTimeout(() => {
      speakWelcomeSequence();
    }, 300);
  };
  
  // Function to speak the welcome sequence in all languages
  const speakWelcomeSequence = async () => {
    // Speak all welcome messages in sequence
    await speakText(translations.welcomeMessage.en, "en");
    await speakText(translations.welcomeMessage.hi, "hi");
    await speakText(translations.welcomeMessage.mr, "mr");
    
    // After all messages are spoken, automatically activate voice response
    setTimeout(() => {
      handleVoiceResponse("language");
    }, 300);
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      speechRecognition.current.stop();
      speechSynthesis.current.cancel();
    };
  }, []);
  
  // Request microphone access on initial load
  useEffect(() => {
    const requestMicrophonePermission = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (error) {
        toast.error('Microphone access is required for this application');
      }
    };
    
    requestMicrophonePermission();
  }, []);
  
  // Speak welcome message on initial load
  useEffect(() => {
    const welcomeTimeout = setTimeout(() => {
      speakWelcomeSequence();
    }, 1000);
    
    return () => clearTimeout(welcomeTimeout);
  }, []);
  
  // Generate the title for the current step
  const getStepTitle = () => {
    switch (currentStep) {
      case Step.LanguageSelection:
        return getText('selectLanguage');
      case Step.CategorySelection:
        return getText('selectCategory');
      case Step.IssueDescription:
        return getText('describeIssue');
      case Step.Confirmation:
        return getText('confirmSummary');
      case Step.TicketCreated:
        return getText('ticketCreated');
      default:
        return '';
    }
  };
  
  return (
    <div className="voice-container min-h-screen w-full flex items-center justify-center p-4 md:p-8">
      <Card className="w-full max-w-xl mx-auto glass border-none shadow-xl overflow-hidden">
        <CardHeader className="pb-0">
          <CardTitle className="text-2xl font-medium text-center">
            {getStepTitle()}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          <Tabs 
            value={currentStep} 
            className="w-full"
            onValueChange={(value) => {}}
          >
            <AnimatePresence mode="wait">
              <TabsContent value={Step.LanguageSelection} className="mt-0 space-y-8">
                {voicePromptActive && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="text-center mb-4 p-4 bg-primary/10 rounded-lg"
                  >
                    <p className="mb-2 font-medium">{translations.listeningMessage[selectedLanguage as keyof typeof translations.listeningMessage || "en"]}</p>
                    {voiceResponseText && (
                      <p className="italic text-sm">"{voiceResponseText}"</p>
                    )}
                  </motion.div>
                )}
                <LanguageSelector
                  selectedLanguage={selectedLanguage}
                  onSelect={handleLanguageSelect}
                  className="mt-6"
                />
                <div className="flex justify-center mt-6">
                  <MicrophoneButton
                    isRecording={isRecording}
                    isProcessing={isProcessing}
                    onClick={handleMicrophoneClick}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value={Step.CategorySelection} className="mt-0 space-y-8">
                {selectedLanguage && (
                  <>
                    {voicePromptActive && (
                      <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        className="text-center mb-4 p-4 bg-primary/10 rounded-lg"
                      >
                        <p className="mb-2 font-medium">{translations.listeningMessage[selectedLanguage as keyof typeof translations.listeningMessage]}</p>
                        {voiceResponseText && (
                          <p className="italic text-sm">"{voiceResponseText}"</p>
                        )}
                      </motion.div>
                    )}
                    <CategorySelector
                      language={selectedLanguage}
                      selectedCategory={selectedCategory}
                      onSelect={handleCategorySelect}
                      className="mt-6"
                    />
                    <div className="flex justify-center mt-6">
                      <MicrophoneButton
                        isRecording={isRecording}
                        isProcessing={isProcessing}
                        onClick={handleMicrophoneClick}
                      />
                    </div>
                  </>
                )}
              </TabsContent>
              
              <TabsContent value={Step.IssueDescription} className="mt-0 space-y-8">
                <div className="flex flex-col items-center justify-center py-8 space-y-6">
                  <MicrophoneButton
                    isRecording={isRecording}
                    isProcessing={isProcessing}
                    onClick={handleMicrophoneClick}
                  />
                  
                  {userIssue && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-4 bg-secondary/50 rounded-lg text-sm text-foreground w-full"
                    >
                      <p className="italic">"{userIssue}"</p>
                    </motion.div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value={Step.Confirmation} className="mt-0 space-y-8">
                <TicketSummary
                  language={selectedLanguage || 'en'}
                  category={selectedCategory || ''}
                  summary={issueSummary}
                  onConfirm={handleConfirmSummary}
                  onEdit={handleEditSummary}
                  className="mt-6"
                />
              </TabsContent>
              
              <TabsContent value={Step.TicketCreated} className="mt-0 space-y-8">
                <TicketCreated
                  language={selectedLanguage || 'en'}
                  ticketId={ticketId}
                  onNewTicket={handleNewTicket}
                  className="mt-6"
                />
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceAssistant;
