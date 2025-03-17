
interface SpeechOptions {
  language: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

class SpeechSynthesisService {
  private speaking: boolean = false;
  private voices: SpeechSynthesisVoice[] = [];
  
  constructor() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      // Load voices
      this.loadVoices();
      
      // Chrome loads voices asynchronously
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = this.loadVoices.bind(this);
      }
    } else {
      console.error('Speech synthesis is not supported in this browser.');
    }
  }
  
  private loadVoices() {
    this.voices = window.speechSynthesis.getVoices();
  }
  
  private getVoiceForLanguage(languageCode: string): SpeechSynthesisVoice | null {
    if (!this.voices.length) {
      this.loadVoices();
    }
    
    const languageMap: Record<string, string> = {
      'en': 'en-US',
      'hi': 'hi-IN',
      'mr': 'mr-IN'
    };
    
    const langCode = languageMap[languageCode] || 'en-US';
    
    // Try to find a matching voice
    const voice = this.voices.find(voice => 
      voice.lang.includes(langCode) && voice.localService
    ) || this.voices.find(voice => 
      voice.lang.includes(langCode)
    );
    
    // Fallback to the first voice if none found
    return voice || this.voices[0];
  }
  
  speak(text: string, options: SpeechOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!window.speechSynthesis) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }
      
      // Cancel any ongoing speech
      this.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set the voice based on language
      const voice = this.getVoiceForLanguage(options.language);
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      } else {
        // Fallback language mapping if no matching voice
        const langMap: Record<string, string> = {
          'en': 'en-US',
          'hi': 'hi-IN',
          'mr': 'mr-IN'
        };
        utterance.lang = langMap[options.language] || 'en-US';
      }
      
      // Set other properties
      utterance.rate = options.rate || 1;
      utterance.pitch = options.pitch || 1;
      utterance.volume = options.volume || 1;
      
      utterance.onstart = () => {
        this.speaking = true;
      };
      
      utterance.onend = () => {
        this.speaking = false;
        resolve();
      };
      
      utterance.onerror = (event) => {
        this.speaking = false;
        console.error("Speech synthesis error:", event);
        reject(new Error(`Speech synthesis error: ${event.error}`));
      };
      
      window.speechSynthesis.speak(utterance);
    });
  }
  
  cancel() {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      this.speaking = false;
    }
  }
  
  isSpeaking(): boolean {
    return this.speaking;
  }
}

// Singleton instance
let service: SpeechSynthesisService | null = null;

export const getSpeechSynthesis = (): SpeechSynthesisService => {
  if (!service) {
    service = new SpeechSynthesisService();
  }
  return service;
};
