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
import { useNavigate } from "react-router-dom";
import { useTickets } from "@/context/TicketContext";

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
  
  const navigate = useNavigate();
  const { addTicket } = useTickets();
  const speechRecognition = useRef(getSpeechRecognition());
  const speechSynthesis = useRef(getSpeechSynthesis());
  const hasSpokenIssuePrompt = useRef(false);
  
  const getText = (key: keyof typeof translations) => {
    if (key === 'categories') {
      return (categoryKey: string): string => {
        if (!selectedLanguage) return translations.categories[categoryKey as keyof typeof translations.categories]?.en || categoryKey;
        return translations.categories[categoryKey as keyof typeof translations.categories]?.[selectedLanguage as keyof typeof translations.categories.loan] || categoryKey;
      };
    }
    
    if (!selectedLanguage) return translations[key].en;
    return translations[key][selectedLanguage as keyof typeof translations[typeof key]];
  };
  
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
  
  const handleVoiceResponse = (forStep: "language" | "category") => {
    speechSynthesis.current.cancel();
    
    setVoicePromptActive(true);
    setVoiceResponseText("");
    setIsRecording(true);
    
    const lang = forStep === "language" ? "en" : selectedLanguage || "en";
    
    speechRecognition.current.setLanguage(lang);
    speechRecognition.current.start(
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
              toast.error(getText('selectCategory') as string + ". " + getText('errorSpeechRecognition') as string);
              setIsRecording(false);
              setVoicePromptActive(false);
            }
          }
        }
      },
      () => {
        setIsRecording(false);
        setVoicePromptActive(false);
      },
      (error) => {
        setIsRecording(false);
        setVoicePromptActive(false);
        toast.error(getText('errorSpeechRecognition') as string);
        console.error("Speech recognition error:", error);
      }
    );
  };
  
  const handleLanguageSelect = async (language: string) => {
    setSelectedLanguage(language);
    
    speechRecognition.current.setLanguage(language);
    
    await speakText(translations.languageConfirmation[language as keyof typeof translations.languageConfirmation], language);
    
    setCurrentStep(Step.CategorySelection);
    
    setTimeout(async () => {
      await speakText(translations.categoryQuestion[language as keyof typeof translations.categoryQuestion], language);
      setTimeout(() => {
        handleVoiceResponse("category");
      }, 300);
    }, 300);
  };
  
  const handleCategorySelect = async (category: string) => {
    console.log("Category selected:", category);
    setSelectedCategory(category);
    
    const getCategoryName = getText('categories') as (cat: string) => string;
    const categoryName = getCategoryName(category);
    
    const message = translations.categoryConfirmation[selectedLanguage as keyof typeof translations.categoryConfirmation]
      .replace("{category}", categoryName);
    
    await speakText(message);
    
    setTimeout(() => {
      console.log("Moving to issue description step");
      setCurrentStep(Step.IssueDescription);
      
      hasSpokenIssuePrompt.current = false;
    }, 300);
  };
  
  useEffect(() => {
    if (currentStep === Step.IssueDescription && !hasSpokenIssuePrompt.current) {
      hasSpokenIssuePrompt.current = true;
      
      setTimeout(async () => {
        await speakText(translations.issuePrompt[selectedLanguage as keyof typeof translations.issuePrompt]);
      }, 300);
    }
  }, [currentStep, selectedLanguage]);
  
  const handleMicrophoneClick = () => {
    speechSynthesis.current.cancel();
    
    if (isRecording) {
      speechRecognition.current.stop();
      setIsRecording(false);
      setVoicePromptActive(false);
    } else {
      if (currentStep === Step.LanguageSelection) {
        handleVoiceResponse("language");
      } else if (currentStep === Step.CategorySelection) {
        handleVoiceResponse("category");
      } else if (currentStep === Step.IssueDescription) {
        setUserIssue("");
        setIsRecording(true);
        
        speechRecognition.current.start(
          (text, isFinal) => {
            setUserIssue(text);
            
            if (isFinal) {
              console.log("Final issue transcript:", text);
            }
          },
          () => {
            setIsRecording(false);
            if (userIssue && userIssue.trim().length > 0) {
              handleIssueRecorded();
            } else {
              toast.error(getText('errorSpeechRecognition') as string);
            }
          },
          (error) => {
            setIsRecording(false);
            toast.error(getText('errorSpeechRecognition') as string);
            console.error("Speech recognition error:", error);
          }
        );
      }
    }
  };
  
  const handleIssueRecorded = async () => {
    if (!userIssue.trim()) {
      toast.error('No speech detected. Please try again.');
      return;
    }
    
    setIsProcessing(true);
    
    const userIssueForDisplay = userIssue;
    console.log("Processing issue:", userIssueForDisplay);
    
    setTimeout(() => {
      const summary = userIssueForDisplay;
      setIssueSummary(summary);
      
      speakText(summary);
      
      setCurrentStep(Step.Confirmation);
      setIsProcessing(false);
    }, 1000);
  };
  
  const handleConfirmSummary = () => {
    setIsProcessing(true);
    
    const randomId = Math.floor(100000 + Math.random() * 900000).toString();
    setTicketId(randomId);
    
    const confirmationMsg = getText('confirmSummary') as string;
    speakText(confirmationMsg);
    
    const today = new Date();
    const currentDate = `2025-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    addTicket({
      id: randomId,
      category: selectedCategory || 'other',
      description: issueSummary,
      status: 'pending',
      date: currentDate,
      language: selectedLanguage || 'en',
      appointmentBooked: false,
    });
    
    setTimeout(() => {
      setCurrentStep(Step.TicketCreated);
      setIsProcessing(false);
      
      const ticketMsg = getText('ticketCreated') as string;
      speakText(ticketMsg);
    }, 800);
  };
  
  const handleEditSummary = () => {
    setCurrentStep(Step.IssueDescription);
    hasSpokenIssuePrompt.current = false;
  };
  
  const handleNewTicket = () => {
    setSelectedLanguage(null);
    setSelectedCategory(null);
    setUserIssue("");
    setIssueSummary("");
    setCurrentStep(Step.LanguageSelection);
    
    setTimeout(() => {
      speakWelcomeSequence();
    }, 300);
  };
  
  const handleViewDashboard = () => {
    navigate("/dashboard");
  };
  
  const speakWelcomeSequence = async () => {
    await speakText(translations.welcomeMessage.en, "en");
    await speakText(translations.welcomeMessage.hi, "hi");
    await speakText(translations.welcomeMessage.mr, "mr");
    
    setTimeout(() => {
      handleVoiceResponse("language");
    }, 300);
  };
  
  useEffect(() => {
    return () => {
      speechRecognition.current.stop();
      speechSynthesis.current.cancel();
    };
  }, []);
  
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
  
  useEffect(() => {
    const welcomeTimeout = setTimeout(() => {
      speakWelcomeSequence();
    }, 1000);
    
    return () => clearTimeout(welcomeTimeout);
  }, []);
  
  const getStepTitle = () => {
    switch (currentStep) {
      case Step.LanguageSelection:
        return getText('selectLanguage') as string;
      case Step.CategorySelection:
        return getText('selectCategory') as string;
      case Step.IssueDescription:
        return getText('describeIssue') as string;
      case Step.Confirmation:
        return getText('confirmSummary') as string;
      case Step.TicketCreated:
        return getText('ticketCreated') as string;
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
            <AnimatePresence mode="wait" key={currentStep}>
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
                      key="user-issue"
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
                  onViewDashboard={handleViewDashboard}
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
