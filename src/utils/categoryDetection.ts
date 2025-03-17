
// Simple category detection from user voice input
export const detectCategory = (text: string, language: string): string | null => {
  // Convert to lowercase for easier matching
  const lowercaseText = text.toLowerCase();
  
  const categoryKeywords: Record<string, Record<string, string[]>> = {
    'en': {
      'loan': ['loan', 'emi', 'interest', 'borrowing', 'credit'],
      'savings': ['savings', 'saving account', 'deposit', 'interest rate'],
      'current': ['current', 'current account', 'business account', 'checking'],
      'creditcard': ['credit card', 'card', 'credit', 'payment card', 'visa', 'mastercard'],
      'fraud': ['fraud', 'scam', 'unauthorized', 'transaction', 'stolen', 'hacked'],
      'other': ['other', 'different', 'another', 'else']
    },
    'hi': {
      'loan': ['लोन', 'कर्ज', 'ऋण', 'ईएमआई', 'ब्याज'],
      'savings': ['बचत', 'सेविंग', 'जमा', 'खाता'],
      'current': ['चालू खाता', 'करंट', 'व्यापार खाता'],
      'creditcard': ['क्रेडिट कार्ड', 'कार्ड', 'भुगतान कार्ड'],
      'fraud': ['धोखाधड़ी', 'फ्रॉड', 'अनधिकृत', 'लेनदेन', 'चोरी'],
      'other': ['अन्य', 'दूसरा', 'और']
    },
    'mr': {
      'loan': ['कर्ज', 'लोन', 'व्याज', 'ईएमआय'],
      'savings': ['बचत खाते', 'बचत', 'जमा'],
      'current': ['चालू खाते', 'व्यावसायिक खाते'],
      'creditcard': ['क्रेडिट कार्ड', 'कार्ड', 'पेमेंट कार्ड'],
      'fraud': ['फसवणूक', 'अनधिकृत', 'चोरी', 'हॅक'],
      'other': ['इतर', 'दुसरे', 'वेगळे']
    }
  };
  
  // Use English as fallback if language not supported
  const langToUse = language in categoryKeywords ? language : 'en';
  
  // Go through each category and its keywords
  for (const [category, keywords] of Object.entries(categoryKeywords[langToUse])) {
    for (const keyword of keywords) {
      if (lowercaseText.includes(keyword)) {
        return category;
      }
    }
  }
  
  // Default to null if we can't determine
  return null;
};
