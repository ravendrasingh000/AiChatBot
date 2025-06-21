
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

      console.log('Making OpenRouter API request...');
      console.log('Using API Key:', this.apiKey.substring(0, 20) + '...');
      
      const requestBody = {
        model: 'meta-llama/llama-3.2-3b-instruct:free',
        messages: messages,
        max_tokens: 300,
        temperature: 0.7,
        stream: false
      };

      console.log('Request body:', JSON.stringify(requestBody, null, 2));
      
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'AI Chatbot App'
        },
        body: JSON.stringify(requestBody),
      });

      console.log('OpenRouter response status:', response.status);
      
      if (!response.ok) {
        const responseText = await response.text();
        console.error('OpenRouter API Error:', response.status, responseText);
        
        let errorData;
        try {
          errorData = JSON.parse(responseText);
        } catch {
          errorData = { error: { message: responseText } };
        }
        
        if (response.status === 401) {
          console.error('Auth error - checking key validity');
          return "Yaar API key mein problem hai! 🔑 OpenRouter dashboard check karo:\n1. Key valid hai?\n2. Credits available hain?\n3. Key regenerate kar ke try karo";
        } else if (response.status === 402) {
          return "Credits khatam ho gaye! 💸 OpenRouter account mein balance add karo.";
        } else if (response.status === 429) {
          return "Rate limit exceed ho gaya! 😅 Thoda wait karo.";
        } else {
          return `OpenRouter API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`;
        }
      }

      const data = await response.json();
      console.log('OpenRouter success response:', data);
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        return data.choices[0].message.content || "Kuch response nahi mila! 🤔";
      } else {
        console.error('Unexpected response format:', data);
        return "Response format unexpected hai! 😕 Fir se try karo.";
      }
      
    } catch (error) {
      console.error('Network/Fetch Error:', error);
      return "Network error aa gaya! 🌐 Internet connection check karo aur fir try karo.";
    }
  }
}
