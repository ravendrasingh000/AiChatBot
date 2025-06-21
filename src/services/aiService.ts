
export interface AIServiceConfig {
  apiKey: string;
}

export class AIService {
  private apiKey: string;

  constructor(config: AIServiceConfig) {
    this.apiKey = config.apiKey;
  }

  async getAIResponse(message: string, conversationHistory: Array<{text: string, isBot: boolean}>): Promise<string> {
    if (!this.apiKey) {
      return "API key nahi mila yaar! 😅 Pehle API key daal do settings mein.";
    }

    // Validate API key format
    if (!this.apiKey.startsWith('sk-or-v1-')) {
      return "Yaar ye OpenRouter API key nahi lag rahi! 🤔 Sahi key daalo jo 'sk-or-v1-' se start hoti hai.";
    }

    try {
      // Create conversation context for better responses
      const messages = [
        {
          role: "system",
          content: `You are a friendly chatbot that behaves like a WhatsApp friend. You can speak in Hinglish (Hindi + English mix) and are helpful, casual, and supportive. Use emojis occasionally. Keep responses conversational and not too long. You can help with questions, give advice, or just chat casually.`
        },
        // Add recent conversation history for context
        ...conversationHistory.slice(-6).map(msg => ({
          role: msg.isBot ? "assistant" : "user",
          content: msg.text
        })),
        {
          role: "user",
          content: message
        }
      ];

      console.log('Making API request to OpenRouter...');
      console.log('API Key length:', this.apiKey.length);
      console.log('API Key prefix:', this.apiKey.substring(0, 10) + '...');
      
      // Use OpenRouter API endpoint with proper headers
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'AI Chatbot',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.2-3b-instruct:free',
          messages: messages,
          max_tokens: 300,
          temperature: 0.7,
        }),
      });

      console.log('API Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error Details:', errorData);
        
        if (response.status === 401) {
          return "API key invalid hai yaar! 🔑 OpenRouter mein check karo - key sahi hai ya expired toh nahi?";
        } else if (response.status === 402) {
          return "Credits khatam ho gaye! 💸 OpenRouter account mein balance add karo.";
        } else if (response.status === 429) {
          return "Bohot zyada requests kar diye! 😅 Thoda wait karo phir try karna.";
        } else {
          return `API error aa gaya: ${response.status}. 😔 Error: ${JSON.stringify(errorData)}`;
        }
      }

      const data = await response.json();
      console.log('API Response data:', data);
      
      return data.choices[0]?.message?.content || "Hmm, kuch samajh nahi aaya! 🤔 Fir se try karo.";
    } catch (error) {
      console.error('AI Service Error:', error);
      return "Oops! Internet connection check karo, ya API key sahi hai? 🤷‍♂️";
    }
  }
}
