
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

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: messages,
          max_tokens: 300,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        console.error('API Error:', response.status, response.statusText);
        return "Sorry yaar, kuch technical problem aa gaya! 😔 Thoda baad try karna.";
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || "Hmm, kuch samajh nahi aaya! 🤔 Fir se try karo.";
    } catch (error) {
      console.error('AI Service Error:', error);
      return "Oops! Internet connection check karo, ya API key sahi hai? 🤷‍♂️";
    }
  }
}
