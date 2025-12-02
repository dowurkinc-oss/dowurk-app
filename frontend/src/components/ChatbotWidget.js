import { useState } from 'react';
import { MessageSquare, X, Send, Minimize2, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m your DowUrk AI Guide. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const quickActions = [
    { text: 'Find businesses', icon: '🏢' },
    { text: 'Get AI help', icon: '🤖' },
    { text: 'Find grants', icon: '💰' }
  ];

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await axios.post(`${API}/ai/chat`, {
        message: userMessage,
        conversation_history: messages.slice(-6),
        context_type: 'general'
      });
      setMessages(prev => [...prev, { role: 'assistant', content: response.data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I\'m having trouble right now. Please try again or contact support.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (action) => {
    setInput(action);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 bg-white/70 backdrop-blur-md border border-white/40 hover:bg-white/80 shadow-lg"
        >
          <MessageSquare className="h-6 w-6 text-[#006847]" />
        </Button>
      </div>
    );
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          onClick={() => setIsMinimized(false)}
          className="rounded-full w-12 h-12 bg-white/70 backdrop-blur-md border border-white/40 hover:bg-white/80 shadow-lg"
        >
          <Maximize2 className="h-5 w-5 text-[#006847]" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 z-40 bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/40">
      {/* Header */}
      <div className="p-3 bg-gradient-to-r from-[#A4D65E]/80 to-[#006847]/80 text-white flex items-center justify-between rounded-t-2xl">
        <div className="flex items-center space-x-2">
          <MessageSquare className="h-4 w-4" />
          <span className="font-semibold text-sm">DowUrk AI</span>
        </div>
        <div className="flex items-center space-x-1">
          <button onClick={() => setIsMinimized(true)} className="hover:bg-white/20 p-1 rounded">
            <Minimize2 className="h-3 w-3" />
          </button>
          <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded">
            <X className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="h-64 overflow-y-auto p-3 space-y-2">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-2 rounded-lg text-xs ${
              msg.role === 'user' 
                ? 'bg-[#006847]/80 text-white' 
                : 'bg-white/60 text-gray-800 border border-gray-200'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/60 border border-gray-200 p-2 rounded-lg text-xs">
              <span className="animate-pulse">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="px-3 pb-2 flex gap-1 flex-wrap">
        {quickActions.map((action, idx) => (
          <button
            key={idx}
            onClick={() => handleQuickAction(action.text)}
            className="text-xs px-2 py-1 bg-white/50 hover:bg-white/70 rounded-full border border-gray-200 transition"
          >
            {action.icon} {action.text}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-white/30">
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask me anything..."
            className="text-xs bg-white/50 border-gray-200"
          />
          <Button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            size="sm"
            className="bg-[#006847]/80 hover:bg-[#006847] h-8 px-2"
          >
            <Send className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ChatbotWidget;