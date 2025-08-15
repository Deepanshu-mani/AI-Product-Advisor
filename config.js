// config.js
// Configuration file for the application

export const config = {
  // Gemini API Configuration
  gemini: {
    apiUrl: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
    apiKey: process.env.EXPO_PUBLIC_GEMINI_KEY,
    model: "gemini-2.5-flash",
    timeout: 30000, // 30 seconds
  },
  
  // Safety settings for Gemini
  safetySettings: [
    {
      category: "HARM_CATEGORY_HARASSMENT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
      category: "HARM_CATEGORY_HATE_SPEECH", 
      threshold: "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
      category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
      category: "HARM_CATEGORY_DANGEROUS_CONTENT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE"
    }
  ],
  
  // Generation configuration
  generationConfig: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 1024,
  }
};

// Helper function to validate configuration
export function validateConfig() {
  const errors = [];
  
  if (!config.gemini.apiKey) {
    errors.push("EXPO_PUBLIC_GEMINI_KEY environment variable is not set");
  }
  
  if (errors.length > 0) {
    console.warn("Configuration validation failed:", errors);
    return false;
  }
  
  return true;
}
