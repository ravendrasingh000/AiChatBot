import { useState, useEffect, useRef } from 'react';
import { Send, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ChatMessage from '@/components/ChatMessage';
import TypingIndicator from '@/components/TypingIndicator';
import APIKeySettings from '@/components/APIKeySettings';
import { AIService } from '@/services/aiService';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Heyy! 👋 Main tumhara AI chatbot hu! Kuch bhi poocho - main sab jawab de sakta hu! 😊",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [apiKey, setApiKey] = useState(() => {
    // Check if API key is already stored, otherwise use the new provided key
    const storedKey = localStorage.getItem('openai-api-key');
    return storedKey || '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';
  });
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const aiServiceRef = useRef<AIService | null>(null);

  // Initialize AI service when API key changes
  useEffect(() => {
    if (apiKey) {
      aiServiceRef.current = new AIService({ apiKey });
      localStorage.setItem('openai-api-key', apiKey);
    } else {
      aiServiceRef.current = null;
      localStorage.removeItem('openai-api-key');
    }
  }, [apiKey]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getFallbackResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Greetings
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      const greetings = [
        "Heyy! Kaise ho yaar? 😄",
        "Hi there! Sab badhiya? 🤗",
        "Hello ji! Kya scene hai? 👋",
        "Hey buddy! Kaise chal raha hai sab? 😊"
      ];
      return greetings[Math.floor(Math.random() * greetings.length)];
    }
    
    // API key missing message
    return "Yaar AI functionality ke liye OpenAI API key chahiye! 🔑 Settings mein jaake add kar do, phir main tumhare saare questions ka jawab de sakta hu! 😊";
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      text: inputText,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText('');
    setIsTyping(true);

    try {
      let botResponseText: string;
      
      if (aiServiceRef.current && apiKey) {
        // Use AI service for intelligent responses
        botResponseText = await aiServiceRef.current.getAIResponse(currentInput, messages);
      } else {
        // Fallback to simple responses
        botResponseText = getFallbackResponse(currentInput);
      }

      // Simulate typing delay
      setTimeout(() => {
        const botResponse: Message = {
          id: Date.now() + 1,
          text: botResponseText,
          isBot: true,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
      }, 1000 + Math.random() * 1000);
      
    } catch (error) {
      console.error('Error getting bot response:', error);
      setTimeout(() => {
        const errorResponse: Message = {
          id: Date.now() + 1,
          text: "Sorry yaar, kuch technical problem aa gaya! 😔 Thoda baad try karna.",
          isBot: true,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, errorResponse]);
        setIsTyping(false);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex flex-col">
      {/* API Key Settings */}
      <APIKeySettings
        apiKey={apiKey}
        onApiKeyChange={setApiKey}
        isOpen={showSettings}
        onToggle={() => setShowSettings(!showSettings)}
      />

      {/* Header */}
      <div className="bg-green-600 text-white p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
            <Bot size={24} />
          </div>
          <div>
            <h1 className="font-semibold text-lg">AI Chatbot</h1>
            <p className="text-green-100 text-sm">
              {apiKey ? "AI powered & ready to help! 🚀" : "Add API key to unlock AI! ⚡"}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex gap-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything... 🤖"
            className="flex-1 rounded-full border-gray-300 focus:border-green-500 focus:ring-green-500"
          />
          <Button
            onClick={handleSendMessage}
            className="rounded-full bg-green-600 hover:bg-green-700 text-white px-4"
            disabled={!inputText.trim()}
          >
            <Send size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
