
// Simple language detection from user voice input
export const detectLanguage = (text: string): string | null => {
  // Convert to lowercase for easier matching
  const lowercaseText = text.toLowerCase();
  
  // English detection
  const englishKeywords = ['english', 'speak in english', 'i want english', 'english please', 'in english'];
  const isEnglish = englishKeywords.some(keyword => lowercaseText.includes(keyword));
  if (isEnglish) return 'en';
  
  // Hindi detection
  const hindiKeywords = ['hindi', 'हिंदी', 'speak in hindi', 'हिंदी में', 'मुझे हिंदी चाहिए', 'हिन्दी'];
  const isHindi = hindiKeywords.some(keyword => lowercaseText.includes(keyword));
  if (isHindi) return 'hi';
  
  // Marathi detection
  const marathiKeywords = ['marathi', 'मराठी', 'speak in marathi', 'मराठी मध्ये', 'मला मराठी हवी', 'marathi madhe'];
  const isMarathi = marathiKeywords.some(keyword => lowercaseText.includes(keyword));
  if (isMarathi) return 'mr';
  
  // If no language is detected from keywords, try to guess based on script
  if (/[\u0900-\u097F]/.test(text)) {
    // Devanagari script - could be Hindi or Marathi
    // Simple heuristic - more Hindi-specific characters
    if (/[कखगघङचछजझञटठडढणतथदधन]/.test(text)) {
      return 'hi';
    } else {
      return 'mr';
    }
  }
  
  // Default to null if we can't determine
  return null;
};
