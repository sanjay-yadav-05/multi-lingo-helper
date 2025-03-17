
// Web Speech API types
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
  length: number;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

class SpeechRecognitionService {
  recognition: any;
  isListening: boolean = false;
  language: string = 'en-US';
  
  constructor() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.error('Speech Recognition is not supported in this browser.');
      return;
    }
    
    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.lang = this.language;
  }
  
  setLanguage(languageCode: string) {
    const languageMap: Record<string, string> = {
      'en': 'en-US',
      'hi': 'hi-IN',
      'mr': 'mr-IN'
    };
    
    this.language = languageMap[languageCode] || 'en-US';
    if (this.recognition) {
      this.recognition.lang = this.language;
    }
  }
  
  start(onResult: (text: string, isFinal: boolean) => void, onEnd: () => void, onError: (error: any) => void) {
    if (!this.recognition) return;
    
    if (this.isListening) {
      this.stop();
    }
    
    this.isListening = true;
    
    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      const resultIndex = event.resultIndex;
      const transcript = event.results[resultIndex][0].transcript;
      const isFinal = event.results[resultIndex].isFinal;
      
      onResult(transcript, isFinal);
    };
    
    this.recognition.onend = () => {
      this.isListening = false;
      onEnd();
    };
    
    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      this.isListening = false;
      onError(event.error);
    };
    
    try {
      this.recognition.start();
    } catch (error) {
      console.error('Speech recognition failed to start', error);
      onError(error);
    }
  }
  
  stop() {
    if (this.recognition && this.isListening) {
      this.isListening = false;
      try {
        this.recognition.stop();
      } catch (error) {
        console.error('Speech recognition failed to stop', error);
      }
    }
  }
}

// Singleton instance
let service: SpeechRecognitionService | null = null;

export const getSpeechRecognition = (): SpeechRecognitionService => {
  if (!service) {
    service = new SpeechRecognitionService();
  }
  return service;
};
