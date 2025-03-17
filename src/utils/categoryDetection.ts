
// Simple category detection from user voice input
export const detectCategory = (text: string, language: string): string | null => {
  // Convert to lowercase for easier matching
  const lowercaseText = text.toLowerCase();
  
  const categoryKeywords: Record<string, Record<string, string[]>> = {
    'en': {
      'loan': ['loan', 'emi', 'interest', 'borrowing', 'credit', 'mortgage'],
      'savings': ['savings', 'saving account', 'deposit', 'interest rate', 'save'],
      'current': ['current', 'current account', 'business account', 'checking', 'transaction'],
      'creditcard': ['credit card', 'card', 'credit', 'payment card', 'visa', 'mastercard', 'debit card'],
      'fraud': ['fraud', 'scam', 'unauthorized', 'transaction', 'stolen', 'hacked', 'suspicious'],
      'other': ['other', 'different', 'another', 'else', 'none of these']
    },
    'hi': {
      'loan': ['लोन', 'कर्ज', 'ऋण', 'ईएमआई', 'ब्याज', 'loan', 'karj'],
      'savings': ['बचत', 'सेविंग', 'जमा', 'खाता', 'bachat', 'saving'],
      'current': ['चालू खाता', 'करंट', 'व्यापार खाता', 'current', 'chalu khata'],
      'creditcard': ['क्रेडिट कार्ड', 'कार्ड', 'भुगतान कार्ड', 'card', 'credit card'],
      'fraud': ['धोखाधड़ी', 'फ्रॉड', 'अनधिकृत', 'लेनदेन', 'चोरी', 'fraud', 'dhokha'],
      'other': ['अन्य', 'दूसरा', 'और', 'other', 'anya']
    },
    'mr': {
      'loan': ['कर्ज', 'लोन', 'व्याज', 'ईएमआय', 'karj', 'loan'],
      'savings': ['बचत खाते', 'बचत', 'जमा', 'bachat', 'saving'],
      'current': ['चालू खाते', 'व्यावसायिक खाते', 'chalu khate', 'current'],
      'creditcard': ['क्रेडिट कार्ड', 'कार्ड', 'पेमेंट कार्ड', 'card', 'credit card'],
      'fraud': ['फसवणूक', 'अनधिकृत', 'चोरी', 'हॅक', 'fraud', 'fasvanuk'],
      'other': ['इतर', 'दुसरे', 'वेगळे', 'other', 'itar']
    }
  };
  
  // Use English as fallback if language not supported
  const langToUse = language in categoryKeywords ? language : 'en';
  
  // Go through each category and its keywords
  for (const [category, keywords] of Object.entries(categoryKeywords[langToUse])) {
    for (const keyword of keywords) {
      if (lowercaseText.includes(keyword.toLowerCase())) {
        return category;
      }
    }
  }
  
  // Default to null if we can't determine
  return null;
};
