
import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ChatMessage from '@/components/ChatMessage';
import TypingIndicator from '@/components/TypingIndicator';

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
      text: "Heyy! 👋 Main tumhara friendly chatbot hu! Kya haal chaal? 😊",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userMessage: string): string => {
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
    
    // How are you
    if (lowerMessage.includes('how are you') || lowerMessage.includes('kaise ho') || lowerMessage.includes('kya haal')) {
      const responses = [
        "Main ekdum mast hu! 😎 Tu bata, tera din kaisa gaya?",
        "Bas chill kar raha hu! Tum sunao, kya kar rahe ho? 🙂",
        "Sab badhiya hai mere paas! Tumhara kya scene hai? 😄"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Name questions
    if (lowerMessage.includes('name') || lowerMessage.includes('naam')) {
      return "Main hu tumhara friendly bot! 🤖 Tum mujhe koi bhi naam de sakte ho. Tumhara naam kya hai? 😊";
    }
    
    // Weather
    if (lowerMessage.includes('weather') || lowerMessage.includes('mausam')) {
      return "Yaar main weather check nahi kar sakta, but I hope aaj ka din achha ho! ☀️ Tumhare yahan kaisa mausam hai? 🌤️";
    }
    
    // Feeling sad/bad
    if (lowerMessage.includes('sad') || lowerMessage.includes('upset') || lowerMessage.includes('down')) {
      return "Aww yaar, kya hua? 😔 Share kar sakte ho mere saath. Sometimes baat karne se achha lagta hai! 💙";
    }
    
    // Happy/good responses
    if (lowerMessage.includes('happy') || lowerMessage.includes('good') || lowerMessage.includes('great') || lowerMessage.includes('achha')) {
      return "Yayy! That's amazing! 🎉 Mujhe bhi khushi hui sunke! Keep spreading those good vibes! ✨";
    }
    
    // Food related
    if (lowerMessage.includes('food') || lowerMessage.includes('khana') || lowerMessage.includes('eat')) {
      return "Ooh khana! 🍽️ Main toh bot hu but mujhe lagta hai ghar ka khana sabse best hota hai! Tumne kya khaya aaj? 😋";
    }
    
    // Default responses
    const defaultResponses = [
      "Interesting! Tell me more about it 🤔",
      "Haan haan, bilkul! Aur kya chal raha hai? 😊",
      "Oh nice! Thanks for sharing that with me! 💫",
      "Sahi hai yaar! Aur batao kya scene hai? 🙌",
      "Cool cool! Main sun raha hu, continue karo! 👂",
      "Haha, mast hai! Aur kuch interesting hua aaj? 😄"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
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
    setInputText('');
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: Date.now() + 1,
        text: getBotResponse(inputText),
        isBot: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex flex-col">
      {/* Header */}
      <div className="bg-green-600 text-white p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
            <Bot size={24} />
          </div>
          <div>
            <h1 className="font-semibold text-lg">Friendly Bot</h1>
            <p className="text-green-100 text-sm">Always here to chat! 😊</p>
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
            placeholder="Type your message... 💬"
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
