import React, { useState, useEffect, useRef } from 'react';

const AIBusinessAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [businessContext, setBusinessContext] = useState('');
  const [sessionId] = useState(() => `session-${Date.now()}`);
  const [isLoading, setIsLoading] = useState(false);
  const [showContextInput, setShowContextInput] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat history when component mounts
  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/ai/chat-history/${sessionId}`
      );
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;

    // Add user message to UI immediately
    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/ai/business-plan`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            session_id: sessionId,
            user_message: inputMessage,
            business_context: businessContext || undefined
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      // Add assistant response to UI
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.assistant_response,
        timestamp: data.timestamp
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = async () => {
    if (!window.confirm('Are you sure you want to clear the chat history?')) {
      return;
    }

    try {
      await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/ai/chat-history/${sessionId}`,
        { method: 'DELETE' }
      );
      setMessages([]);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-t-2xl shadow-lg p-6 border-b">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🚀 AI Business Planning Assistant
          </h1>
          <p className="text-gray-600">
            Get expert guidance for your business journey with DowUrk AI
          </p>
          
          {/* Business Context Toggle */}
          <div className="mt-4">
            <button
              onClick={() => setShowContextInput(!showContextInput)}
              className="text-sm text-purple-600 hover:text-purple-800 font-medium"
            >
              {showContextInput ? '− Hide' : '+ Add'} Business Context
            </button>
            
            {showContextInput && (
              <div className="mt-2">
                <textarea
                  value={businessContext}
                  onChange={(e) => setBusinessContext(e.target.value)}
                  placeholder="E.g., Located in New Orleans, targeting young entrepreneurs aged 18-25..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  rows="2"
                />
              </div>
            )}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="bg-white shadow-lg p-6 h-96 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-6xl mb-4">💡</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Start Your Business Journey
              </h3>
              <p className="text-gray-500 max-w-md">
                Ask me anything about starting or growing your business. I specialize in helping underserved entrepreneurs, nonprofits, and minority-owned businesses.
              </p>
              <div className="mt-6 space-y-2 text-left">
                <p className="text-sm text-gray-600">💬 Try asking:</p>
                <ul className="text-sm text-purple-600 space-y-1">
                  <li>• "How do I start a nonprofit?"</li>
                  <li>• "What funding options are available?"</li>
                  <li>• "Help me create a marketing strategy"</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-3xl rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="text-sm font-semibold mb-1">
                      {message.role === 'user' ? 'You' : '🤖 AI Assistant'}
                    </div>
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}

          {isLoading && (
            <div className="flex justify-start mt-4">
              <div className="bg-gray-100 rounded-2xl px-4 py-3">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-b-2xl shadow-lg p-4 border-t">
          <form onSubmit={sendMessage} className="flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about business planning, funding, marketing..."
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Send
            </button>
          </form>
          
          {messages.length > 0 && (
            <button
              onClick={clearHistory}
              className="mt-2 text-sm text-red-600 hover:text-red-800"
            >
              Clear Chat History
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIBusinessAssistant;
