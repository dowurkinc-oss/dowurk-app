import { useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Bot, Send, Sparkles, User, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm your DowUrk AI Business Assistant. I'm here to help you with business planning, grant applications, legal requirements, marketing strategies, and more. What can I help you with today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [contextType, setContextType] = useState('general');

  const contextOptions = [
    { value: 'general', label: 'General Help', icon: '💬' },
    { value: 'business_planning', label: 'Business Planning', icon: '📋' },
    { value: 'grants', label: 'Grants & Funding', icon: '💰' },
    { value: 'legal', label: 'Legal & Compliance', icon: '⚖️' },
    { value: 'marketing', label: 'Marketing & Sales', icon: '📈' },
  ];

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(`${API}/ai/chat`, {
        message: input,
        conversation_history: messages,
        context_type: contextType
      });

      const assistantMessage = { role: 'assistant', content: response.data.response };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = { 
        role: 'assistant', 
        content: "I apologize, but I'm having trouble processing your request. Please try again." 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6" data-testid="ai-assistant">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <Bot className="h-12 w-12 text-[#006847]" />
          <h1 className="text-4xl font-bold">AI Business Assistant</h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Get personalized guidance powered by AI, specifically trained on Louisiana's business ecosystem
        </p>
      </div>

      {/* Context Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">What do you need help with?</CardTitle>
          <CardDescription>Select a topic for more specialized assistance</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={contextType} onValueChange={setContextType}>
            <SelectTrigger data-testid="context-selector">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {contextOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.icon} {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Chat Container */}
      <Card className="min-h-[500px] flex flex-col" data-testid="chat-container">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle>Conversation</CardTitle>
            <Badge className="bg-[#A4D65E] text-black">
              {contextOptions.find(opt => opt.value === contextType)?.label}
            </Badge>
          </div>
        </CardHeader>
        
        {/* Messages */}
        <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              data-testid={`message-${message.role}`}
            >
              <div
                className={`flex space-x-3 max-w-[80%] ${
                  message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div className="flex-shrink-0">
                  {message.role === 'user' ? (
                    <div className="h-8 w-8 rounded-full bg-[#006847] flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#A4D65E] to-[#006847] flex items-center justify-center">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                  )}
                </div>
                <div
                  className={`rounded-lg p-4 ${
                    message.role === 'user'
                      ? 'bg-[#006847] text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className="flex space-x-3 max-w-[80%]">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#A4D65E] to-[#006847] flex items-center justify-center">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div className="rounded-lg p-4 bg-gray-100">
                  <Loader2 className="h-5 w-5 animate-spin text-[#006847]" />
                </div>
              </div>
            </div>
          )}
        </CardContent>

        {/* Input Area */}
        <div className="border-t p-4">
          <div className="flex space-x-3">
            <Textarea
              placeholder="Ask me anything about starting or growing your business..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              rows={2}
              className="resize-none"
              disabled={loading}
              data-testid="chat-input"
            />
            <Button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="bg-gradient-to-r from-[#A4D65E] to-[#006847] hover:opacity-90"
              data-testid="send-button"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="mr-2 h-5 w-5 text-[#A4D65E]" />
            AI-Powered Tools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto flex-col items-start p-4 space-y-2">
              <span className="font-semibold">Business Plan Generator</span>
              <span className="text-xs text-gray-600 text-left">Create a custom business plan outline</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col items-start p-4 space-y-2">
              <span className="font-semibold">Grant Match Finder</span>
              <span className="text-xs text-gray-600 text-left">Find grants you're eligible for</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col items-start p-4 space-y-2">
              <span className="font-semibold">Marketing Copy Writer</span>
              <span className="text-xs text-gray-600 text-left">Generate social posts and content</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Alert>
        <AlertDescription className="text-xs">
          💡 <strong>Note:</strong> While our AI assistant provides helpful guidance, always consult with licensed 
          professionals for legal, financial, or other specialized advice.
        </AlertDescription>
      </Alert>
    </div>
  );
}

export default AIAssistant;
