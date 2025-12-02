import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Send, MessageCircle, Sparkles, Minimize2, Maximize2 } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const messagesEndRef = useRef(null);

  // Show welcome message on first visit
  useEffect(() => {
    const hasVisited = sessionStorage.getItem('chatbot_dismissed');
    if (!hasVisited) {
      setTimeout(() => {
        setIsOpen(true);
        setMessages([{
          role: 'assistant',
          content: "👋 Welcome to DowUrk H.U.B.! I'm your AI guide. I can help you find the perfect resources for your entrepreneurial journey. What brings you here today?"
        }]);
      }, 2000); // Show after 2 seconds
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('chatbot_dismissed', 'true');
  };

  const handleSend = async (messageText = null) => {
    const textToSend = messageText || input;
    if (!textToSend.trim()) return;

    setHasInteracted(true);
    const userMessage = { role: 'user', content: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(`${API}/ai/chat`, {
        message: textToSend,
        conversation_history: messages,
        context_type: 'general'
      });

      // Parse response for navigation suggestions
      let assistantMessage = response.data.response;
      const assistantMsg = { role: 'assistant', content: assistantMessage };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having trouble connecting right now, but I can still help! Try clicking one of the quick links below or use the navigation menu above."
      }]);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { text: 'Find businesses', emoji: '🏢', link: '/businesses' },
    { text: 'Get AI help', emoji: '🤖', link: '/ai-assistant' },
    { text: 'Find grants', emoji: '💰', link: '/grants' },
    { text: 'Join events', emoji: '📅', link: '/events' },
    { text: 'Learn more', emoji: '📚', link: '/resources' },
    { text: 'Shop merch', emoji: '🛍️', link: '/shop' }
  ];

  const handleQuickAction = (action) => {
    window.location.href = action.link;
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full bg-gradient-to-r from-[#A4D65E] to-[#006847] shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-50 group"
        data-testid="chatbot-open-button"
      >
        <MessageCircle className="h-7 w-7 text-white" />
        <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold animate-pulse">
          !
        </span>
        <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
          <div className="bg-gray-900 text-white text-sm rounded-lg px-3 py-2 whitespace-nowrap">
            Need help? Chat with me!
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      </button>
    );
  }

  return (
    <div 
      className={`fixed bottom-6 right-6 z-50 transition-all ${
        isMinimized ? 'w-80' : 'w-96'
      }`}
      data-testid="chatbot-widget"
    >
      <Card className="shadow-2xl border-2 border-[#A4D65E]">
        {/* Header */}
        <CardHeader className="bg-gradient-to-r from-[#A4D65E] to-[#006847] text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-[#006847]" />
              </div>
              <div>
                <CardTitle className="text-lg">DowUrk AI Guide</CardTitle>
                <Badge variant="secondary" className="bg-white/20 text-white text-xs">
                  Online
                </Badge>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="hover:bg-white/20 p-2 rounded transition"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </button>
              <button
                onClick={handleClose}
                className="hover:bg-white/20 p-2 rounded transition"
                data-testid="chatbot-close-button"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0">
            {/* Messages */}
            <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-[#006847] text-white'
                        : 'bg-white text-gray-900 shadow'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-lg p-3 shadow">
                    <div className="flex space-x-2">
                      <div className="h-2 w-2 bg-[#A4D65E] rounded-full animate-bounce"></div>
                      <div className="h-2 w-2 bg-[#A4D65E] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="h-2 w-2 bg-[#A4D65E] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {!hasInteracted && (
              <div className="p-4 border-t bg-white">
                <p className="text-xs text-gray-600 mb-3 font-semibold">Quick shortcuts:</p>
                <div className="grid grid-cols-3 gap-2">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickAction(action)}
                      className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-100 transition text-center"
                    >
                      <span className="text-2xl mb-1">{action.emoji}</span>
                      <span className="text-xs text-gray-700">{action.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t bg-white">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Ask me anything..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A4D65E] text-sm"
                  data-testid="chatbot-input"
                />
                <Button
                  onClick={() => handleSend()}
                  disabled={loading || !input.trim()}
                  className="bg-gradient-to-r from-[#A4D65E] to-[#006847] hover:opacity-90"
                  size="sm"
                  data-testid="chatbot-send-button"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Powered by AI • Here to help 24/7
              </p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}

export default ChatbotWidget;
