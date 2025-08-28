import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, Sparkles, MessageCircle, X, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm FineFlow AI, your intelligent assistant. How can I help you today?", sender: 'bot', timestamp: Date.now() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch('https://sabapathybuilds4461.app.n8n.cloud/webhook/0115f48e-3d97-43a0-b08e-42779a8398e0/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: currentInput }),
      });

      if (!response.ok) {
        throw new Error(`Webhook response was not ok: ${response.statusText}`);
      }
      
      const responseData = await response.json();
      
      const botResponseText = responseData.output || "I received a response, but it was empty.";

      const botMessage = {
        id: Date.now() + 1,
        text: botResponseText,
        sender: 'bot',
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('Error fetching from webhook:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
        sender: 'bot',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-30"
              animate={{
                x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
                y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
              }}
              transition={{
                duration: 20 + Math.random() * 20,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
              }}
            />
          ))}
        </div>
      </div>

      {/* Header */}
      <motion.div 
        className="relative z-10 p-8 text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex items-center justify-center gap-4 mb-4">
          <img 
            src="https://sabapathy7620.neocities.org/images/logo.png" 
            alt="FineFlow AI Logo" 
            className="w-12 h-12"
          />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            FineFlow AI Experience
          </h1>
        </div>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          Experience the future of AI conversation with our premium chatbot widget
        </p>
      </motion.div>

      {/* Chatbot Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Toggle Button */}
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              onClick={() => setIsOpen(true)}
              className="relative w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 flex items-center justify-center overflow-hidden"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              {/* Pulsing rings */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-blue-400"
                animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-purple-400"
                animate={{ scale: [1, 1.8], opacity: [0.3, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              />
              
              {/* Bot Icon */}
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <img 
                  src="https://sabapathy7620.neocities.org/images/section2-icon2.png" 
                  alt="AI Bot" 
                  className="w-10 h-10 rounded-full"
                />
              </motion.div>

              {/* Sparkle effect */}
              <motion.div
                className="absolute top-1 right-1"
                animate={{ 
                  scale: [0.5, 1, 0.5],
                  rotate: [0, 180, 360] 
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Sparkles className="w-3 h-3 text-yellow-300" />
              </motion.div>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Chat Window */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="absolute bottom-0 right-0 w-96 h-[600px] bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
              initial={{ scale: 0.5, opacity: 0, y: 100 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: 100 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  >
                    <img 
                      src="https://sabapathy7620.neocities.org/images/logo.png" 
                      alt="FineFlow AI" 
                      className="w-8 h-8"
                    />
                  </motion.div>
                  <div>
                    <h3 className="text-white font-semibold">FineFlow AI</h3>
                    <p className="text-blue-100 text-xs">Always here to help</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="text-white hover:bg-white/10"
                  >
                    <Minimize2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-white/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Messages Area */}
              <AnimatePresence>
                {!isMinimized && (
                  <motion.div
                    className="h-96 p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-white/20"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 384 }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <AnimatePresence>
                      {messages.map((message, index) => (
                        <motion.div
                          key={message.id}
                          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className={`max-w-xs px-4 py-3 rounded-2xl ${
                            message.sender === 'user'
                              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                              : 'bg-white/10 backdrop-blur-sm text-white border border-white/20'
                          }`}>
                            {message.sender === 'bot' && (
                              <div className="flex items-center gap-2 mb-2">
                                <Bot className="w-4 h-4 text-blue-400" />
                                <span className="text-xs text-blue-300">FineFlow AI</span>
                              </div>
                            )}
                            <p className="text-sm leading-relaxed">{message.text}</p>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {/* Typing Indicator */}
                    <AnimatePresence>
                      {isTyping && (
                        <motion.div
                          className="flex justify-start"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                        >
                          <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/20">
                            <div className="flex items-center gap-2">
                              <Bot className="w-4 h-4 text-blue-400" />
                              <div className="flex gap-1">
                                {[...Array(3)].map((_, i) => (
                                  <motion.div
                                    key={i}
                                    className="w-2 h-2 bg-blue-400 rounded-full"
                                    animate={{ scale: [1, 1.5, 1] }}
                                    transition={{
                                      duration: 1,
                                      repeat: Infinity,
                                      delay: i * 0.2
                                    }}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Input Area */}
              <AnimatePresence>
                {!isMinimized && (
                  <motion.div
                    className="p-4 border-t border-white/10"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                  >
                    <form onSubmit={handleSend} className="flex gap-3">
                      <Input
                        ref={inputRef}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-white/50 focus:bg-white/20 transition-all duration-300"
                        disabled={isTyping}
                      />
                      <Button
                        type="submit"
                        disabled={!inputValue.trim() || isTyping}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                      >
                        <motion.div
                          whileTap={{ scale: 0.95 }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <Send className="w-4 h-4" />
                        </motion.div>
                      </Button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
